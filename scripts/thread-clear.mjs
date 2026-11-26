import { chromium } from "playwright";

const origin = process.env.ORIGIN || "http://127.0.0.1:4455";
const base = process.env.BASE_PATH || "/portfolio";
const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
];
const stops = [0, 0.18, 0.36, 0.54, 0.72, 0.9];

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const failures = [];

function log(line) {
  process.stdout.write(`${line}\n`);
}

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  await page.goto(`${origin}${base}/`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForFunction(() => Array.isArray(window.__threadSamples) && window.__threadSamples.length > 20, null, { timeout: 8000 });
  for (const stop of stops) {
    await page.evaluate((fraction) => {
      const home = document.querySelector(".thread-home");
      const spacer = document.querySelector(".pin-spacer");
      const top = (spacer || home).getBoundingClientRect().top + window.scrollY;
      const distance = spacer ? spacer.offsetHeight - window.innerHeight : Math.max(1, home.offsetHeight - window.innerHeight);
      window.scrollTo(0, top + distance * fraction);
    }, stop);
    await page.waitForTimeout(180);
    const result = await page.evaluate(() => {
      const points = window.__threadSamples || [];
      const content = [...document.querySelectorAll(".thread-chapter.is-active .thread-shot, .thread-chapter.is-active .thread-copy, .thread-chapter.is-active .thread-screens")];
      const rects = content.map((element) => element.getBoundingClientRect());
      const covered = points.filter((point) => rects.some((rect) => point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom));
      const onTop = covered.filter((point) => {
        const stack = document.elementsFromPoint(point.x, point.y);
        const drawing = stack.find((element) => element.classList.contains("thread-field") || element.classList.contains("beat-mark"));
        const front = stack.find((element) => element.closest(".thread-shot, .thread-copy, .thread-screens"));
        if (!drawing || !front) return false;
        return stack.indexOf(drawing) < stack.indexOf(front);
      });
      const field = document.querySelector(".thread-field");
      const mark = document.querySelector(".thread-chapter.is-active .beat-mark");
      const drawing = mark && getComputedStyle(mark).display !== "none" ? mark : field;
      const shot = document.querySelector(".thread-chapter.is-active .thread-shot");
      const frontZ = content.length ? Math.max(...content.map((element) => Number(getComputedStyle(element).zIndex) || 0)) : 0;
      const drawingZ = drawing ? Number(getComputedStyle(drawing).zIndex) || 0 : 0;
      return {
        shape: window.__threadShape || "",
        points: points.length,
        onTop: onTop.length,
        drawingZ,
        frontZ,
        shot: shot ? Math.round(shot.getBoundingClientRect().width) : 0,
      };
    });
    if (result.points < 20 && stop < 0.9) failures.push({ viewport, stop, message: `only ${result.points} samples` });
    if (result.onTop) failures.push({ viewport, stop, shape: result.shape, message: `${result.onTop} points painted on top of the shot or the type` });
    else log(`${viewport.width} @ ${stop} ${result.shape} behind content (${result.points} pts)`);
    if (result.drawingZ > result.frontZ && result.frontZ > 0) {
      failures.push({ viewport, stop, message: `drawing z-index ${result.drawingZ} is above content ${result.frontZ}` });
    }
  }

  if (viewport.width >= 960) {
    const size = await page.evaluate(() => {
      const beats = document.querySelectorAll(".thread-beat").length;
      const exitShare = 0.7 / (beats - 1 + 0.7);
      const progress = (1 / (beats - 1)) * (1 - exitShare);
      const home = document.querySelector(".thread-home");
      const spacer = home.closest(".pin-spacer") || home;
      const top = spacer.getBoundingClientRect().top + window.scrollY;
      const distance = spacer.offsetHeight - window.innerHeight;
      window.scrollTo(0, top + distance * progress);
      return new Promise((resolve) => {
        window.setTimeout(() => {
          const points = window.__threadSamples || [];
          const ys = points.map((point) => point.y);
          const shot = document.querySelector(".thread-chapter.is-active .thread-shot")?.getBoundingClientRect();
          const height = ys.length ? Math.max(...ys) - Math.min(...ys) : 0;
          resolve({
            shape: window.__threadShape || "",
            shotRatio: shot ? shot.width / window.innerWidth : 0,
            objectRatio: height / window.innerHeight,
            taller: shot ? height > shot.height : false,
          });
        }, 220);
      });
    });
    log(`${viewport.width} lyra shot ${size.shotRatio.toFixed(2)} object ${size.objectRatio.toFixed(2)} ${size.shape}`);
    if (size.shotRatio < 0.45 || size.shotRatio > 0.55) failures.push({ viewport, message: `shot is ${size.shotRatio.toFixed(2)} of the viewport` });
    if (size.objectRatio < 0.6 || size.objectRatio > 0.75) failures.push({ viewport, message: `object is ${size.objectRatio.toFixed(2)} of the viewport height` });
    if (!size.taller) failures.push({ viewport, message: "object is not taller than the screenshot" });
  } else {
    await page.evaluate(() => document.querySelector('[data-chapter="lyra"]')?.scrollIntoView({ inline: "center", block: "start" }));
    await page.waitForTimeout(200);
    const phone = await page.evaluate(() => {
      const card = document.querySelector('[data-chapter="lyra"]');
      const shot = card?.querySelector(".thread-shot")?.getBoundingClientRect();
      const mark = card?.querySelector(".beat-mark")?.getBoundingClientRect();
      const cardBox = card?.getBoundingClientRect();
      return {
        card: cardBox ? cardBox.width / window.innerWidth : 0,
        shot: shot?.width || 0,
        mark: mark?.height || 0,
      };
    });
    log(`${viewport.width} card ${phone.card.toFixed(2)} shot ${Math.round(phone.shot)} mark ${Math.round(phone.mark)}`);
    if (phone.card < 0.95) failures.push({ viewport, message: `phone card is ${phone.card.toFixed(2)} of the viewport` });
    if (phone.mark <= phone.shot) failures.push({ viewport, message: "phone object is not larger than the screenshot" });
  }
  await page.close();
}

await browser.close();
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
log("thread stays behind the screenshot and the type");
