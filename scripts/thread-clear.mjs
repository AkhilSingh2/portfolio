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
      const cards = [...document.querySelectorAll(".thread-chapter.is-active .thread-shot, .thread-chapter.is-active .thread-screens")].map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
      });
      const hits = points.filter((point) => cards.some((rect) => point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom));
      return { shape: window.__threadShape || "", points: points.length, cards: cards.length, hits: hits.slice(0, 3) };
    });
    if (result.points < 20) failures.push({ viewport, stop, message: `only ${result.points} samples` });
    if (result.hits.length) failures.push({ viewport, stop, shape: result.shape, message: `${result.hits.length} points inside a card`, sample: result.hits[0] });
    else console.log(`${viewport.width} @ ${stop} ${result.shape} clear (${result.points} pts, ${result.cards} cards)`);
  }
  await page.close();
}

await browser.close();
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
console.log("thread stays clear of every screenshot and card");
