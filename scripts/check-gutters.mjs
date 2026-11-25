import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const origin = process.env.ORIGIN || "http://127.0.0.1:4190";
const base = "/portfolio";
const gutter = 16;
const viewports = [
  { width: 1440, height: 900, label: "1440" },
  { width: 1024, height: 800, label: "1024" },
  { width: 390, height: 844, label: "390" },
];

function routes() {
  const found = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === "index.html") {
        const rel = path.relative("out", full).replace(/index\.html$/, "");
        found.push(`${base}/${rel}`);
      }
    }
  };
  walk("out");
  return [...new Set(found)];
}

const pages = routes();
const failures = [];
const browser = await chromium.launch({ channel: "chrome", args: ["--no-sandbox"] });

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  for (const route of pages) {
    await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    const hits = await page.evaluate((gutter) => {
      const selectors = "h1,h2,h3,h4,h5,h6,p,a,button,li,label,figcaption,dt,dd,span,strong,em";
      const clipped = (rect, node) => {
        let left = rect.left;
        let right = rect.right;
        let top = rect.top;
        let bottom = rect.bottom;
        let parent = node.parentElement;
        while (parent) {
          const style = getComputedStyle(parent);
          if (/(hidden|clip|auto|scroll)/.test(style.overflowX) || /(hidden|clip|auto|scroll)/.test(style.overflowY)) {
            const box = parent.getBoundingClientRect();
            left = Math.max(left, box.left);
            right = Math.min(right, box.right);
            top = Math.max(top, box.top);
            bottom = Math.min(bottom, box.bottom);
          }
          parent = parent.parentElement;
        }
        left = Math.max(left, 0);
        right = Math.min(right, window.innerWidth);
        top = Math.max(top, 0);
        bottom = Math.min(bottom, window.innerHeight);
        if (right - left < 2 || bottom - top < 2) return null;
        return { left, right, top, bottom };
      };
      const bad = [];
      for (const el of document.querySelectorAll(selectors)) {
        const text = (el.innerText || el.textContent || "").trim();
        if (!text) continue;
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
        const rect = el.getBoundingClientRect();
        const box = clipped(rect, el);
        if (!box) continue;
        if (box.left < gutter || box.right > window.innerWidth - gutter) {
          bad.push({
            text: text.slice(0, 80),
            tag: el.tagName.toLowerCase(),
            left: Math.round(box.left),
            right: Math.round(box.right),
            width: window.innerWidth,
          });
        }
      }
      return bad;
    }, gutter);
    if (hits.length) {
      failures.push({ viewport: viewport.label, route, hits: hits.slice(0, 12), count: hits.length });
      console.log("FAIL", viewport.label, route, hits.length);
      for (const hit of hits.slice(0, 6)) console.log("  ", hit.tag, hit.left, hit.right, JSON.stringify(hit.text));
    } else {
      console.log("ok", viewport.label, route);
    }
  }
  await context.close();
}

await browser.close();
if (failures.length) {
  console.log(JSON.stringify(failures, null, 2));
  process.exit(1);
}
console.log("gutters hold on", pages.length, "routes at", viewports.map((item) => item.label).join(", "));
