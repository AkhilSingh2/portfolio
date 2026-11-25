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

async function openMenu(page, mobile) {
  const name = mobile ? "Menu" : "Index";
  await page.getByRole("button", { name, exact: true }).click();
  await page.locator("#site-menu").waitFor({ state: "visible", timeout: 8000 });
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
      await openMenu(page, viewport.mobile);
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
            const animated = await link.evaluate((node) => Boolean(node.closest(".reel-stage")));
            if (!animated) return { link, force: false };
            moving = link;
          }
          return moving ? { link: moving, force: true } : null;
        };
        let link = await find();
        if (!link) {
          await openMenu(visit, viewport.mobile);
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
