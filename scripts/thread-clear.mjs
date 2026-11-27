import { chromium } from "playwright";

const origin = process.env.ORIGIN || "http://127.0.0.1:4455";
const base = process.env.BASE_PATH || "/portfolio";
const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
  { width: 440, height: 956 },
  { width: 390, height: 664 },
  { width: 440, height: 780 },
];

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const failures = [];

function log(line) {
  process.stdout.write(`${line}\n`);
}

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  await page.goto(`${origin}${base}/`, { waitUntil: "networkidle", timeout: 60000 });
  const desktop = viewport.width >= 960;
  if (desktop) {
    await page.waitForFunction(() => Array.isArray(window.__threadSamples) && window.__threadSamples.length > 20, null, { timeout: 8000 });
  }

  if (desktop) {
    const count = await page.locator(".thread-beat").count();
    for (let index = 0; index < count; index += 1) {
      const result = await page.evaluate((beat) => {
        const beats = [...document.querySelectorAll(".thread-beat")];
        const exitShare = 0.7 / (beats.length - 1 + 0.7);
        const progress = (beat / (beats.length - 1)) * (1 - exitShare);
        const home = document.querySelector(".thread-home");
        const spacer = home.closest(".pin-spacer") || home;
        const top = spacer.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, top + (spacer.offsetHeight - window.innerHeight) * progress);
        return new Promise((resolve) => {
          window.setTimeout(() => {
            const card = document.querySelector(".thread-beat.is-active");
            const copy = card?.querySelector(".thread-copy")?.getBoundingClientRect();
            const img = card?.querySelector(".thread-shot img");
            const shot = img?.getBoundingClientRect();
            const points = window.__threadSamples || [];
            const ys = points.map((point) => point.y);
            const xs = points.map((point) => point.x);
            const others = [...document.querySelectorAll(".thread-beat:not(.is-active)")].filter((chapter) => {
              const style = getComputedStyle(chapter);
              return style.visibility !== "hidden" || Number(style.opacity) > 0.02;
            });
            let imageAbove = true;
            let shotOpacity = 1;
            let shotBlend = "normal";
            if (img && shot) {
              const field = document.querySelector(".thread-field");
              const previous = field?.style.pointerEvents;
              if (field) field.style.pointerEvents = "auto";
              const stack = document.elementsFromPoint(shot.left + shot.width / 2, shot.top + shot.height / 2);
              if (field) field.style.pointerEvents = previous || "none";
              const picture = stack.find((element) => element === img || element.classList.contains("thread-shot"));
              const drawing = stack.find((element) => element.classList.contains("thread-field"));
              imageAbove = Boolean(picture && drawing && stack.indexOf(picture) < stack.indexOf(drawing));
              const frame = card.querySelector(".thread-shot");
              shotOpacity = Number(getComputedStyle(frame).opacity);
              shotBlend = getComputedStyle(frame).mixBlendMode;
            }
            const blocks = [...card.querySelectorAll("h1, h2, p, a, .thread-shot")].map((node) => node.getBoundingClientRect());
            const near = (point, pad) =>
              blocks.some((rect) => point.x >= rect.left - pad && point.x <= rect.right + pad && point.y >= rect.top - pad && point.y <= rect.bottom + pad);
            const veilAt = (point) => (window.__threadVeil ? window.__threadVeil(point.x, point.y) : 1);
            const dimOutside = points.filter((point) => !near(point, 48) && veilAt(point) < 0.85).length;
            const bright = points.filter((point) => near(point, 0) && veilAt(point) > 0.55).length;
            const panel = card.querySelector(".thread-panel")?.getBoundingClientRect();
            const beatBox = card.getBoundingClientRect();
            const contentX = panel ? (panel.left - beatBox.left) / Math.max(1, beatBox.width - panel.width) : 0;
            const phase = beat % 4;
            const expectedX = phase === 0 ? 0 : phase === 2 ? 1 : 0.5;
            const scrim = getComputedStyle(card.querySelector(".thread-copy"), "::before").content !== "none";
            resolve({
              chapter: card?.getAttribute("data-chapter") || "",
              shape: window.__threadShape || "",
              placement: window.__threadPlacement || "",
              others: others.length,
              imageAbove,
              shotOpacity,
              shotBlend,
              cardOpacity: card ? Number(getComputedStyle(card).opacity) : 0,
              dimOutside,
              textHits: points.filter((point) => near(point, 0)).length,
              bright,
              contentX,
              expectedX,
              height: ys.length ? (Math.max(...ys) - Math.min(...ys)) / window.innerHeight : 0,
              width: xs.length ? (Math.max(...xs) - Math.min(...xs)) / window.innerWidth : 0,
              objectLeft: xs.length ? Math.min(...xs) : 0,
              objectRight: xs.length ? Math.max(...xs) : 0,
              shotLeft: shot ? shot.left : null,
              shotRight: shot ? shot.right : null,
              gap: (() => {
                const column = card.querySelector(".thread-panel")?.getBoundingClientRect();
                if (!column || !xs.length) return 0;
                const left = Math.min(...xs);
                const right = Math.max(...xs);
                if (right < column.left) return (column.left - right) / window.innerWidth;
                if (left > column.right) return (left - column.right) / window.innerWidth;
                return 0;
              })(),
              scrim,
            });
          }, 220);
        });
      }, index);
      log(`${viewport.width} ${result.chapter} ${result.shape} ${result.placement} x${result.contentX.toFixed(2)} h${result.height.toFixed(2)} w${result.width.toFixed(2)} gap${result.gap.toFixed(3)} dim ${result.dimOutside}`);
      if (Math.abs(result.contentX - result.expectedX) > 0.14) failures.push({ viewport, chapter: result.chapter, message: `content x ${result.contentX.toFixed(2)} expected ${result.expectedX}` });
      if (result.others) failures.push({ viewport, chapter: result.chapter, message: `${result.others} other chapters still visible` });
      if (result.cardOpacity < 0.99) failures.push({ viewport, chapter: result.chapter, message: `active card opacity ${result.cardOpacity}` });
      if (result.textHits === 0 && result.scrim) failures.push({ viewport, chapter: result.chapter, message: "scrim is on without an overlap" });
      if (result.textHits > 0 && !result.scrim) failures.push({ viewport, chapter: result.chapter, message: "scrim missing where the thread crosses the text" });
      if (result.dimOutside > 40) failures.push({ viewport, chapter: result.chapter, message: `${result.dimOutside} samples dimmed away from the text` });
      if (result.bright) failures.push({ viewport, chapter: result.chapter, message: `${result.bright} full-opacity thread samples inside the text` });
      if (result.shotOpacity && result.imageAbove === false) failures.push({ viewport, chapter: result.chapter, message: "screenshot is not above the thread" });
      if (result.shotBlend && result.shotBlend !== "normal") failures.push({ viewport, chapter: result.chapter, message: `shot blend ${result.shotBlend}` });
      if (result.shotOpacity && result.shotOpacity < 0.99) failures.push({ viewport, chapter: result.chapter, message: `shot opacity ${result.shotOpacity}` });
      if (result.placement === "behind" && result.shape !== "knot" && result.height < 0.45 && result.width < 0.55) {
        failures.push({ viewport, chapter: result.chapter, message: `behind object is small h${result.height.toFixed(2)} w${result.width.toFixed(2)}` });
      }
      if (result.placement === "behind" && result.shape !== "knot" && Math.abs(result.expectedX - 0.5) > 0.2 && result.height > 0.8) {
        failures.push({ viewport, chapter: result.chapter, message: `behind object height ${result.height.toFixed(2)}` });
      }
      if (Math.abs(result.expectedX - 0.5) < 0.05) {
        const spans = result.width >= 0.85 || result.height >= 0.85;
        if (!spans) failures.push({ viewport, chapter: result.chapter, message: `centred object is h${result.height.toFixed(2)} w${result.width.toFixed(2)}` });
        if (result.shotLeft != null && (result.objectLeft > result.shotLeft - 24 || result.objectRight < result.shotRight + 24)) {
          failures.push({ viewport, chapter: result.chapter, message: "centred object does not clear both sides of the screenshot" });
        }
      }
      if (result.placement === "full-bleed" && result.width < 0.9) {
        failures.push({ viewport, chapter: result.chapter, message: `full-bleed width ${result.width.toFixed(2)}` });
      }
      if ((result.placement === "left" || result.placement === "right") && Math.abs(result.expectedX - 0.5) > 0.2) {
        if (result.height < 0.6) failures.push({ viewport, chapter: result.chapter, message: `side object height ${result.height.toFixed(2)}` });
        if (result.gap > 0.08) failures.push({ viewport, chapter: result.chapter, message: `side gap ${(result.gap * 100).toFixed(1)}% of the viewport` });
      }
    }
  } else {
    const chapters = await page.locator(".thread-beat").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-chapter")));
    for (const chapter of chapters) {
      const result = await page.evaluate((id) => {
        const card = document.querySelector(`[data-chapter="${id}"]`);
        const stage = document.querySelector(".thread-stage");
        stage.scrollLeft = card.offsetLeft;
        card.scrollIntoView({ block: "start", inline: "start" });
        return new Promise((resolve) => {
          window.setTimeout(() => {
            const shot = card.querySelector(".thread-shot")?.getBoundingClientRect();
            const mark = card.querySelector(".beat-mark")?.getBoundingClientRect();
            const copy = card.querySelector(".thread-copy")?.getBoundingClientRect();
            let imageAbove = true;
            if (shot && mark) {
              const drawingEl = card.querySelector(".beat-mark");
              const previous = drawingEl?.style.pointerEvents;
              if (drawingEl) drawingEl.style.pointerEvents = "auto";
              const stack = document.elementsFromPoint(shot.left + shot.width / 2, shot.top + Math.min(shot.height / 2, 36));
              if (drawingEl) drawingEl.style.pointerEvents = previous || "none";
              const picture = stack.find((element) => element.tagName === "IMG" || element.classList.contains("thread-shot"));
              const drawing = stack.find((element) => element.classList.contains("beat-mark"));
              imageAbove = !drawing || Boolean(picture && stack.indexOf(picture) < stack.indexOf(drawing));
            }
            const overlapY = copy && mark ? Math.min(copy.bottom - 8, Math.max(copy.top + 8, mark.top + 8)) : 0;
            const overlaps = Boolean(copy && mark && overlapY >= mark.top && overlapY <= mark.bottom && overlapY >= copy.top && overlapY <= copy.bottom);
            const veil = overlaps && window.__threadVeil ? window.__threadVeil(copy.left + copy.width / 2, overlapY) : 0;
            const scrim = getComputedStyle(card.querySelector(".thread-copy"), "::before").backgroundImage;
            const sides = [];
            if (shot && mark) {
              if (shot.left - mark.left >= window.innerWidth * 0.08) sides.push("left");
              if (mark.right - shot.right >= window.innerWidth * 0.08) sides.push("right");
              if (shot.top - mark.top >= window.innerHeight * 0.08) sides.push("top");
              if (mark.bottom - shot.bottom >= window.innerHeight * 0.08) sides.push("bottom");
            }
            const hero = id === "tap";
            const name = hero ? card.querySelector("h1")?.getBoundingClientRect() : null;
            resolve({
              card: card.getBoundingClientRect().width / window.innerWidth,
              mark: mark ? mark.height / window.innerHeight : 0,
              shotWidth: shot ? shot.width / window.innerWidth : 0,
              shotMid: shot ? Math.abs(shot.left + shot.width / 2 - window.innerWidth / 2) : 0,
              shotMidY: shot && copy ? Math.abs(shot.top + shot.height / 2 - copy.top / 2) / window.innerHeight : 0,
              copyTop: copy ? copy.top / window.innerHeight : 0,
              copyBottom: copy ? window.innerHeight - copy.bottom : 99,
              separated: Boolean(!shot || !copy || shot.bottom < copy.top - 2),
              imageAbove,
              sides: sides.length,
              veil,
              scrim: scrim.includes("gradient"),
              heroVeil: hero && scrim.includes("radial-gradient") && Boolean(name && copy && name.top >= copy.top && name.bottom <= copy.bottom),
            });
          }, 180);
        });
      }, chapter);
      log(`${viewport.width}x${viewport.height} ${chapter} card ${result.card.toFixed(2)} shot ${result.shotWidth.toFixed(2)} text ${result.copyTop.toFixed(2)} sides ${result.sides}`);
      if (result.card < 0.95) failures.push({ viewport, chapter, message: `card is ${result.card.toFixed(2)} of the viewport` });
      if (result.shotWidth && (result.shotWidth < 0.72 || result.shotWidth > 0.78)) failures.push({ viewport, chapter, message: `screenshot is ${result.shotWidth.toFixed(2)} of the width` });
      if (result.shotWidth && result.shotMid > 12) failures.push({ viewport, chapter, message: "screenshot is not centred" });
      if (result.shotWidth && result.shotMidY > 0.1) failures.push({ viewport, chapter, message: "screenshot is not centred in the space above the text" });
      if (result.shotWidth && result.sides < 3) failures.push({ viewport, chapter, message: `thread clears the screenshot on ${result.sides} sides` });
      if (!result.separated) failures.push({ viewport, chapter, message: "screenshot overlaps the text" });
      if (result.copyTop < 0.68) failures.push({ viewport, chapter, message: `text starts at ${result.copyTop.toFixed(2)} of the height` });
      if (result.copyBottom > 24) failures.push({ viewport, chapter, message: "text is not anchored to the bottom" });
      if (!result.scrim) failures.push({ viewport, chapter, message: "bottom scrim missing" });
      if (chapter === "tap" && !result.heroVeil) failures.push({ viewport, chapter, message: "hero name has no radial veil" });
      if (!result.imageAbove) failures.push({ viewport, chapter, message: "screenshot is not above the thread" });
      if (result.veil > 0.28) failures.push({ viewport, chapter, message: `thread veil ${result.veil.toFixed(2)} inside the text` });
    }
  }
  await page.close();
}

await browser.close();
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
log("thread stays behind the screenshot, dim under the words, and each step keeps its placement");
