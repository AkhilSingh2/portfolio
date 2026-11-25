import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const origin = process.env.ORIGIN || "http://127.0.0.1:4174";
const base = "/portfolio";
const outDir = process.env.SHOTS || "/tmp/v2shots";
fs.mkdirSync(outDir, { recursive: true });

function routes() {
  const found = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === "index.html") {
        const rel = path.relative("out", full).replace(/index\.html$/, "");
        const urlPath = rel === "" ? "/" : `/${rel}`;
        found.push(`${base}${urlPath}`);
      }
    }
  };
  walk("out");
  found.push(`${base}/404.html`);
  return [...new Set(found)];
}

const pages = routes();
const failures = [];

const browser = await chromium.launch({
  channel: "chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function visit(viewport, label) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const bad = [];
  page.on("response", (response) => {
    const status = response.status();
    if (status >= 400) bad.push(`${status} ${response.url()}`);
  });
  page.on("requestfailed", (request) => {
    bad.push(`FAIL ${request.failure()?.errorText || ""} ${request.url()}`);
  });

  for (const route of pages) {
    bad.length = 0;
    const response = await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    const status = response?.status() ?? 0;
    if (status >= 400) bad.push(`${status} document ${route}`);
    if (bad.length) failures.push({ label, route, bad: [...bad] });
    else console.log("ok", label, route);
  }

  const shots = [
    ["/", "home"],
    ["/work/", "work"],
    ["/about/", "about"],
    ["/contact/", "contact"],
    ["/design-system/", "system"],
    ["/work/kinetic/", "kinetic"],
    ["/work/docmind/", "docmind"],
  ];
  for (const [route, name] of shots) {
    await page.goto(`${origin}${base}${route}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(outDir, `${label}-${name}.png`), fullPage: false });
  }

  if (label === "desktop") {
    await page.goto(`${origin}${base}/`, { waitUntil: "networkidle" });
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(450);
    }
  }

  await context.close();
}

await visit({ width: 1440, height: 900 }, "desktop");
await visit({ width: 390, height: 844 }, "mobile");
await browser.close();

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
console.log("zero failed responses across", pages.length, "routes");
