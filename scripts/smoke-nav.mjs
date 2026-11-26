import { writeSync } from "node:fs";
import { chromium } from "playwright";

const origin = process.env.ORIGIN || "http://127.0.0.1:4177";
const base = process.env.BASE_PATH || "/portfolio";
const concurrency = Number(process.env.SMOKE_CONCURRENCY || 8);

const failures = [];

function log(line) {
  writeSync(1, `${line}\n`);
}

function absolute(href) {
  if (href.startsWith("http")) return href.split("#")[0];
  const path = href.startsWith("/") ? href : `/${href}`;
  const withBase = path.startsWith(base) ? path : `${base}${path === "/" ? "/" : path}`;
  return `${origin}${withBase.split("#")[0]}`;
}

function isInternal(href) {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return false;
  if (href.startsWith("http")) return href.startsWith(origin);
  return href.startsWith("/") || href.startsWith(base);
}

function routeKey(href) {
  const parsed = new URL(absolute(href));
  let path = parsed.pathname;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}

function routePath(href) {
  const parsed = new URL(absolute(href));
  let path = parsed.pathname.startsWith(base) ? parsed.pathname.slice(base.length) || "/" : parsed.pathname;
  if (!path.endsWith("/") && !path.includes(".")) path = `${path}/`;
  return path;
}

function watch(page, bag) {
  page.on("pageerror", (error) => bag.pageerrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    const located = message.location()?.url || "";
    if (/favicon|Download the React DevTools|ERR_ABORTED/i.test(`${text} ${located}`)) return;
    bag.console.push(text.slice(0, 300));
  });
  page.on("response", (response) => {
    if (response.status() < 400) return;
    const target = response.url();
    if (!target.startsWith(origin) || target.endsWith("favicon.ico")) return;
    bag.http.push(`${response.status()} ${target}`);
  });
}

function metaProblems(path, html) {
  const content = (property) => {
    const match = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`, "i"))
      || html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`, "i"));
    return match?.[1] || "";
  };
  const hrefOf = (rel) => {
    const match = html.match(new RegExp(`<link[^>]+rel=["']${rel}["'][^>]+href=["']([^"']+)["']`, "i"))
      || html.match(new RegExp(`<link[^>]+href=["']([^"']+)["'][^>]+rel=["']${rel}["']`, "i"));
    return match?.[1] || "";
  };
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] || "";
  const problems = [];
  const ogTitle = content("og:title");
  const ogImage = content("og:image");
  const ogUrl = content("og:url");
  if (!ogTitle) problems.push("missing og:title");
  if (!content("og:description")) problems.push("missing og:description");
  if (!ogImage.includes(`${base}/og.png`)) problems.push(`og:image ${ogImage}`);
  if (!/^https?:\/\//.test(ogUrl) || !ogUrl.includes(`${base}/`)) problems.push(`og:url ${ogUrl}`);
  if (content("twitter:card") !== "summary_large_image") problems.push(`twitter:card ${content("twitter:card")}`);
  if (!hrefOf("icon").includes("favicon")) problems.push(`icon ${hrefOf("icon")}`);
  if (!hrefOf("apple-touch-icon").includes("apple-touch-icon")) problems.push(`apple ${hrefOf("apple-touch-icon")}`);
  if (!hrefOf("manifest").includes("site.webmanifest")) problems.push(`manifest ${hrefOf("manifest")}`);
  if (path.includes("/work/") && path !== "/work/" && !/DocMind/i.test(`${title} ${ogTitle}`)) {
    problems.push(`case title ${title} / ${ogTitle}`);
  }
  return { problems, assets: [hrefOf("icon"), hrefOf("apple-touch-icon"), hrefOf("manifest"), ogImage].filter(Boolean) };
}

function discover(html, seen) {
  const found = [];
  const pattern = /<a\b[^>]*\bhref\s*=\s*(?:"([^"]+)"|'([^']+)')/gi;
  let match = pattern.exec(html);
  while (match) {
    const href = (match[1] || match[2] || "").trim();
    match = pattern.exec(html);
    if (!isInternal(href)) continue;
    const key = routeKey(href);
    if (seen.has(key)) continue;
    seen.add(key);
    found.push(href.split("#")[0]);
  }
  return found;
}

function mainMarkup(html) {
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || "";
}

function mainIsEmpty(markup) {
  if (/<(img|svg|video|canvas|picture)\b/i.test(markup)) return false;
  const text = markup
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length === 0;
}

async function checkLink(href) {
  const target = absolute(href);
  const response = await fetch(target, { redirect: "follow" });
  if (response.status !== 200) {
    failures.push({ where: href, message: `${response.status} ${target}` });
    return [];
  }
  const type = response.headers.get("content-type") || "";
  if (/\.pdf($|\?)/i.test(target) || type.includes("pdf")) {
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength < 100) failures.push({ where: href, message: "pdf is empty" });
    return [];
  }
  const html = await response.text();
  if (/couldn't load|couldn’t load/i.test(html)) failures.push({ where: href, message: "client error screen" });
  if (mainIsEmpty(mainMarkup(html))) failures.push({ where: href, message: "empty or missing main" });

  const path = routePath(href);
  if (["/", "/work/", "/contact/", "/about/", "/resume/", "/work/docmind/", "/design-system/"].includes(path)) {
    const meta = metaProblems(path, html);
    for (const asset of meta.assets) {
      const assetUrl = new URL(asset, target);
      const local = assetUrl.href.startsWith(origin) ? assetUrl.href : `${origin}${assetUrl.pathname}`;
      const assetResponse = await fetch(local, { redirect: "follow" });
      if (assetResponse.status >= 400) meta.problems.push(`${assetResponse.status} ${local}`);
    }
    if (meta.problems.length) failures.push({ where: `meta ${path}`, message: meta.problems.join("; ") });
  }
  return html;
}

async function clickMenu() {
  const browser = await chromium.launch({
    ...(process.env.SMOKE_CHANNEL ? { channel: process.env.SMOKE_CHANNEL } : {}),
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const bag = { pageerrors: [], console: [], http: [] };
  watch(page, bag);
  const hrefs = [];
  try {
    await page.goto(absolute("/"), { waitUntil: "domcontentloaded" });
    await page.locator("header.site-nav").waitFor();
    await page.getByRole("button", { name: "Work", exact: true }).click();
    await page.locator("#site-menu").waitFor({ state: "visible", timeout: 8000 });
    const seeAll = page.locator("#site-menu a[href$='/work/'], #site-menu a[href$='/work']");
    if ((await seeAll.count()) === 0) failures.push({ where: "megamenu", message: "missing the link to /work/" });

    const primary = await page.locator('header.site-nav nav[aria-label="Primary"] a').allTextContents();
    if (primary.some((label) => label.trim() === "Calibre")) {
      failures.push({ where: "primary nav", message: "Calibre is still in the top nav" });
    }
    const inMenu = await page.locator('#site-menu a[href*="design-system"]').count();
    const inFooter = await page.locator('footer a[href*="design-system"]').count();
    const colophon = await page.locator(".footer-colophon").innerText();
    if (!inMenu) failures.push({ where: "design-system reach", message: "missing from the work menu" });
    if (inFooter) failures.push({ where: "footer", message: "Calibre is still linked in the footer" });
    if (/calibre/i.test(colophon)) failures.push({ where: "footer", message: `colophon still names Calibre: ${colophon}` });

    hrefs.push(
      ...(await page.evaluate(() => {
        const nodes = [
          ...document.querySelectorAll("header.site-nav a[href], #site-menu a[href], footer a[href], nav a[href]"),
        ];
        return [...new Set(nodes.map((node) => node.getAttribute("href")).filter(Boolean))];
      })),
    );

    await page.getByRole("button", { name: "Close", exact: true }).click();
    await page.locator("#site-menu").waitFor({ state: "hidden", timeout: 8000 });
    await page.locator('header.site-nav nav[aria-label="Primary"]').getByRole("link", { name: "About", exact: true }).click();
    await page.waitForURL(/\/about\/?$/, { timeout: 8000 });
    const body = await page.locator("main").innerText();
    if (!body.trim()) failures.push({ where: "click about", message: "empty main" });
    if (/couldn't load|couldn’t load/i.test(body)) failures.push({ where: "click about", message: "client error screen" });
  } catch (error) {
    failures.push({ where: "megamenu click", message: String(error).slice(0, 400) });
  }
  if (bag.pageerrors.length || bag.console.length || bag.http.length) {
    failures.push({ where: "megamenu click", ...bag });
  }
  await browser.close();
  return hrefs;
}

const seen = new Set();
const seed = [];
for (const href of await clickMenu()) {
  if (!isInternal(href) || seen.has(routeKey(href))) continue;
  seen.add(routeKey(href));
  seed.push(href.split("#")[0]);
}
if (!seen.has(routeKey("/"))) {
  seen.add(routeKey("/"));
  seed.push("/");
}

async function mapLimit(items, limit, task) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await task(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, Math.max(items.length, 1)) }, () => run()));
  return results;
}

log(`checking ${seed.length} internal links, then anything they link to`);
let batch = seed;
let checked = 0;
while (batch.length) {
  const pages = await mapLimit(batch, concurrency, async (href) => {
    checked += 1;
    log(`${checked} ${href}`);
    try {
      return await checkLink(href);
    } catch (error) {
      failures.push({ where: href, message: String(error).slice(0, 400) });
      return "";
    }
  });
  batch = pages.flatMap((html) => (typeof html === "string" && html.includes("<") ? discover(html, seen) : []));
}

if (failures.length) {
  log(JSON.stringify(failures.slice(0, 20), null, 2));
  log(`nav smoke failed: ${failures.length}`);
  process.exit(1);
}
log(`nav smoke passed for ${checked} internal links`);
