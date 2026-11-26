import { chromium } from "playwright";

const origin = process.env.ORIGIN || "http://127.0.0.1:4455";
const base = process.env.BASE_PATH || "/portfolio";
const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const failures = [];

function log(line) {
  process.stdout.write(`${line}\n`);
}

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  await page.goto(`${origin}${base}/`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForFunction(() => Array.isArray(window.__threadSamples) && window.__threadSamples.length > 20, null, { timeout: 8000 });
  const desktop = viewport.width >= 960;

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
            const hit = (point, rect, pad) =>
              point.x >= rect.left + pad && point.x <= rect.right - pad && point.y >= rect.top + pad && point.y <= rect.bottom - pad;
            const veil = copy && window.__threadVeil ? window.__threadVeil(copy.left + copy.width / 2, copy.top + copy.height / 2) : 0;
            const textHits = copy ? points.filter((point) => hit(point, copy, 10)).length : 0;
            const bright = copy
              ? points.filter((point) => hit(point, copy, 12) && window.__threadVeil && window.__threadVeil(point.x, point.y) > 0.35).length
              : 0;
            resolve({
              chapter: card?.getAttribute("data-chapter") || "",
              shape: window.__threadShape || "",
              placement: window.__threadPlacement || card?.getAttribute("data-placement") || "",
              expected: card?.getAttribute("data-placement") || "",
              others: others.length,
              imageAbove,
              shotOpacity,
              shotBlend,
              cardOpacity: card ? Number(getComputedStyle(card).opacity) : 0,
              veil,
              textHits,
              bright,
              height: ys.length ? (Math.max(...ys) - Math.min(...ys)) / window.innerHeight : 0,
              width: xs.length ? (Math.max(...xs) - Math.min(...xs)) / window.innerWidth : 0,
              scrim: card ? getComputedStyle(card.querySelector(".thread-copy"), "::before").backgroundImage.includes("radial-gradient") : false,
            });
          }, 220);
        });
      }, index);
      log(`${viewport.width} ${result.chapter} ${result.shape} ${result.placement} h${result.height.toFixed(2)} w${result.width.toFixed(2)} veil ${result.veil.toFixed(2)}`);
      if (result.placement !== result.expected) failures.push({ viewport, chapter: result.chapter, message: `placement ${result.placement} expected ${result.expected}` });
      if (result.others) failures.push({ viewport, chapter: result.chapter, message: `${result.others} other chapters still visible` });
      if (result.cardOpacity < 0.99) failures.push({ viewport, chapter: result.chapter, message: `active card opacity ${result.cardOpacity}` });
      if (!result.scrim) failures.push({ viewport, chapter: result.chapter, message: "text scrim missing" });
      if (result.veil > 0.28) failures.push({ viewport, chapter: result.chapter, message: `thread veil ${result.veil.toFixed(2)} inside the text` });
      if (result.bright) failures.push({ viewport, chapter: result.chapter, message: `${result.bright} full-opacity thread samples inside the text` });
      if (result.shotOpacity && result.imageAbove === false) failures.push({ viewport, chapter: result.chapter, message: "screenshot is not above the thread" });
      if (result.shotBlend && result.shotBlend !== "normal") failures.push({ viewport, chapter: result.chapter, message: `shot blend ${result.shotBlend}` });
      if (result.shotOpacity && result.shotOpacity < 0.99) failures.push({ viewport, chapter: result.chapter, message: `shot opacity ${result.shotOpacity}` });
      if ((result.placement === "left" || result.placement === "right") && result.textHits > 0) {
        failures.push({ viewport, chapter: result.chapter, message: `${result.textHits} samples overlap the text` });
      }
      if (result.placement === "behind" && result.shape !== "knot" && result.height < 0.5 && result.width < 0.7) {
        failures.push({ viewport, chapter: result.chapter, message: `behind object is small h${result.height.toFixed(2)} w${result.width.toFixed(2)}` });
      }
      if (result.placement === "behind" && result.shape !== "knot" && result.height > 0.8) {
        failures.push({ viewport, chapter: result.chapter, message: `behind object height ${result.height.toFixed(2)}` });
      }
      if (result.placement === "full-bleed" && result.width < 0.9) {
        failures.push({ viewport, chapter: result.chapter, message: `full-bleed width ${result.width.toFixed(2)}` });
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
            resolve({
              card: card.getBoundingClientRect().width / window.innerWidth,
              mark: mark ? mark.height / window.innerHeight : 0,
              imageAbove,
              veil,
              scrim: getComputedStyle(card.querySelector(".thread-copy"), "::before").backgroundImage.includes("radial-gradient"),
            });
          }, 180);
        });
      }, chapter);
      log(`${viewport.width} ${chapter} card ${result.card.toFixed(2)} mark ${result.mark.toFixed(2)} veil ${result.veil.toFixed(2)}`);
      if (result.card < 0.95) failures.push({ viewport, chapter, message: `card is ${result.card.toFixed(2)} of the viewport` });
      if (result.mark > 0.55 || result.mark < 0.28) failures.push({ viewport, chapter, message: `phone object is ${result.mark.toFixed(2)} of the viewport` });
      if (!result.imageAbove) failures.push({ viewport, chapter, message: "screenshot is not above the thread" });
      if (!result.scrim) failures.push({ viewport, chapter, message: "text scrim missing" });
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
