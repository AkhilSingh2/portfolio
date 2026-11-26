import { writeSync } from "node:fs";
import { chromium } from "playwright";

const origin = process.env.ORIGIN || "http://127.0.0.1:4177";
const base = process.env.BASE_PATH || "/portfolio";
const starts = (process.env.SMOKE_STARTS || "/,/work/,/contact/,/about/,/resume/,/work/docmind/,/design-system/").split(",").filter(Boolean);
const widths = (process.env.SMOKE_WIDTHS || "1440,390").split(",").map(Number);

function log(line) {
  writeSync(1, `${line}\n`);
}

function url(path) {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized.startsWith(base) ? normalized : `${base}${normalized}`}`;
}

function isInternal(href) {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (href.startsWith("#")) return true;
  if (href.startsWith("http")) return href.startsWith(origin);
  return href.startsWith("/") || href.startsWith(base);
}

const launchArgs = ["--no-sandbox", "--disable-dev-shm-usage"];
const browser = await chromium.launch({
  ...(process.env.SMOKE_CHANNEL ? { channel: process.env.SMOKE_CHANNEL } : {}),
  args: launchArgs,
});

const failures = [];

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
    if (!target.startsWith(origin)) return;
    if (target.endsWith("favicon.ico")) return;
    bag.http.push(`${response.status()} ${target}`);
  });
}

function freshBag() {
  return { pageerrors: [], console: [], http: [] };
}

function since(bag, mark) {
  return {
    pageerrors: bag.pageerrors.slice(mark.pageerrors),
    console: bag.console.slice(mark.console),
    http: bag.http.slice(mark.http),
  };
}

function bad(found) {
  return found.pageerrors.length || found.console.length || found.http.length;
}

async function openMenu(page) {
  await page.getByRole("button", { name: "Work", exact: true }).click();
  await page.locator("#site-menu").waitFor({ state: "visible", timeout: 8000 });
  const seeAll = page.locator("#site-menu a[href$='/work/'], #site-menu a[href$='/work']");
  if ((await seeAll.count()) === 0) throw new Error("megamenu is missing the link to /work/");
}

async function checkMeta(page, path) {
  await page.goto(url(path), { waitUntil: "domcontentloaded" });
  const meta = await page.evaluate(() => {
    const content = (selector) => document.querySelector(selector)?.getAttribute("content") || "";
    const href = (selector) => document.querySelector(selector)?.getAttribute("href") || "";
    return {
      title: document.title,
      ogTitle: content('meta[property="og:title"]'),
      ogDescription: content('meta[property="og:description"]'),
      ogImage: content('meta[property="og:image"]'),
      ogUrl: content('meta[property="og:url"]'),
      twitter: content('meta[name="twitter:card"]'),
      icon: href('link[rel="icon"]'),
      apple: href('link[rel="apple-touch-icon"]'),
      manifest: href('link[rel="manifest"]'),
    };
  });
  const problems = [];
  if (!meta.ogTitle) problems.push("missing og:title");
  if (!meta.ogDescription) problems.push("missing og:description");
  if (!meta.ogImage.includes(`${base}/og.png`)) problems.push(`og:image ${meta.ogImage}`);
  if (!/^https?:\/\//.test(meta.ogUrl) || !meta.ogUrl.includes(`${base}/`)) problems.push(`og:url ${meta.ogUrl}`);
  if (meta.twitter !== "summary_large_image") problems.push(`twitter:card ${meta.twitter}`);
  if (!meta.icon.includes("favicon")) problems.push(`icon ${meta.icon}`);
  if (!meta.apple.includes("apple-touch-icon")) problems.push(`apple ${meta.apple}`);
  if (!meta.manifest.includes("site.webmanifest")) problems.push(`manifest ${meta.manifest}`);
  for (const href of [meta.icon, meta.apple, meta.manifest, meta.ogImage]) {
    if (!href) continue;
    const absolute = new URL(href, page.url());
    const local = absolute.href.startsWith(origin) ? absolute.href : `${origin}${absolute.pathname}`;
    const response = await page.request.get(local);
    if (response.status() >= 400) problems.push(`${response.status()} ${local}`);
  }
  if (path.includes("/work/") && path !== "/work/" && !/DocMind/i.test(`${meta.title} ${meta.ogTitle}`)) {
    problems.push(`case title ${meta.title} / ${meta.ogTitle}`);
  }
  if (problems.length) failures.push({ where: `meta ${path}`, message: problems.join("; ") });
}

{
  const context = await browser.newContext();
  const page = await context.newPage();
  const bag = freshBag();
  watch(page, bag);
  for (const path of ["/", "/work/", "/contact/", "/about/", "/resume/", "/work/docmind/", "/design-system/"]) {
    await checkMeta(page, path);
  }
  if (bad(bag)) failures.push({ where: "meta load", ...bag });
  await context.close();
}

for (const width of widths) {
  const viewport = { width, height: width < 700 ? 844 : 900, mobile: width < 700 };
  const context = await browser.newContext({ viewport });
  for (const start of starts) {
    const page = await context.newPage();
    const bag = freshBag();
    watch(page, bag);
    log(`open ${viewport.width} ${start}`);
    await page.goto(url(start), { waitUntil: "domcontentloaded" });
    await page.locator("header.site-nav").waitFor();
    if (bad(bag)) failures.push({ where: `${viewport.width} load ${start}`, ...bag });

    const mark = { pageerrors: bag.pageerrors.length, console: bag.console.length, http: bag.http.length };
    try {
      await openMenu(page);
    } catch (error) {
      failures.push({ where: `${viewport.width} open menu ${start}`, message: String(error), ...since(bag, mark) });
    }
    const opened = since(bag, mark);
    if (bad(opened)) failures.push({ where: `${viewport.width} menu ${start}`, ...opened });

    const hoverMark = { pageerrors: bag.pageerrors.length, console: bag.console.length, http: bag.http.length };
    const menuLinks = page.locator("#site-menu a[href]");
    const menuCount = await menuLinks.count();
    for (let index = 0; index < menuCount; index += 1) {
      await menuLinks.nth(index).hover({ timeout: 3000 }).catch(() => {});
    }
    await page.waitForTimeout(250);
    const hovered = since(bag, hoverMark);
    if (bad(hovered)) failures.push({ where: `${viewport.width} hover menu ${start}`, ...hovered });

    const hrefs = await page.evaluate(() => {
      const nodes = [
        ...document.querySelectorAll("header.site-nav a[href], #site-menu a[href], footer a[href], nav a[href]"),
      ];
      return [...new Set(nodes.map((node) => node.getAttribute("href")).filter(Boolean))];
    });
    await page.close();

    const visit = await context.newPage();
    const visitBag = freshBag();
    watch(visit, visitBag);
    for (const href of hrefs) {
      if (href.startsWith("mailto:") || href.startsWith("tel:")) continue;
      const label = `${viewport.width} ${start} -> ${href}`;
      log(label);
      const mark = { pageerrors: visitBag.pageerrors.length, console: visitBag.console.length, http: visitBag.http.length };
      try {
        await visit.goto(url(start), { waitUntil: "domcontentloaded" });
        const find = async () => {
          const links = visit.locator(`a[href=${JSON.stringify(href)}]`);
          const count = await links.count();
          let moving = null;
          for (let index = 0; index < count; index += 1) {
            const link = links.nth(index);
            if (!(await link.isVisible())) continue;
            const animated = await link.evaluate((node) => Boolean(node.closest(".reel-stage, .practice-stage")));
            if (!animated) return { link, force: false };
            moving = link;
          }
          return moving ? { link: moving, force: true } : null;
        };
        let link = await find();
        if (!link) {
          await openMenu(visit);
          link = await find();
        }
        if (!link) throw new Error(`no visible link for ${href}`);
        const click = { timeout: 8000, force: link.force };
        if (!isInternal(href)) {
          const popupPromise = visit.waitForEvent("popup", { timeout: 4000 }).catch(() => null);
          await link.link.click(click);
          const popup = await popupPromise;
          if (popup) await popup.close().catch(() => {});
        } else if (href.endsWith(".pdf")) {
          await Promise.all([visit.waitForEvent("download", { timeout: 8000 }), link.link.click(click)]);
        } else {
          await link.link.click(click);
          await visit.waitForTimeout(600);
        }
        const found = since(visitBag, mark);
        if (bad(found)) failures.push({ where: label, ...found });
        const body = await visit.locator("body").innerText();
        if (/couldn't load|couldn’t load/i.test(body)) failures.push({ where: label, message: "client error screen" });
      } catch (error) {
        failures.push({ where: label, message: String(error).slice(0, 400), ...since(visitBag, mark) });
      }
    }
    await visit.close();
  }
  await context.close();
}

await browser.close();
if (failures.length) {
  console.log(JSON.stringify(failures.slice(0, 20), null, 2));
  console.log(`nav smoke failed: ${failures.length}`);
  process.exit(1);
}
log(`nav smoke passed for ${starts.length} pages at ${widths.join(" and ")}`);
