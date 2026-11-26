import { readFileSync, writeSync } from "node:fs";
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

async function checkFooterHeading() {
  const viewports = [
    { width: 1440, height: 600 },
    { width: 1440, height: 640 },
    { width: 1440, height: 1000 },
    { width: 1024, height: 600 },
    { width: 1024, height: 1000 },
    { width: 390, height: 600 },
    { width: 390, height: 1000 },
  ];
  const browser = await chromium.launch({
    ...(process.env.SMOKE_CHANNEL ? { channel: process.env.SMOKE_CHANNEL } : {}),
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      await page.goto(absolute("/"), { waitUntil: "domcontentloaded" });
      await page.locator("[data-close-title]").waitFor({ timeout: 8000 });
      await page.waitForTimeout(600);
      await page.evaluate(async () => {
        const jump = () => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo(0, max);
          document.documentElement.scrollTop = max;
          document.body.scrollTop = max;
        };
        jump();
        await new Promise((resolve) => window.setTimeout(resolve, 400));
        jump();
      });
      await page.waitForFunction(
        () => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          return window.scrollY >= max - 4 && document.querySelector("[data-close-title]")?.classList.contains("is-open");
        },
        null,
        { timeout: 5000 },
      );
      const result = await page.evaluate(() => {
        const heading = document.querySelector("[data-close-title]");
        const rect = heading.getBoundingClientRect();
        const style = getComputedStyle(heading);
        const fontSize = Number.parseFloat(style.fontSize) || 16;
        let clipped = false;
        let node = heading.parentElement;
        while (node && node !== document.documentElement) {
          const parent = getComputedStyle(node);
          const hidden = parent.overflow === "hidden" || parent.overflowY === "hidden" || parent.overflowX === "hidden";
          if (hidden) {
            const box = node.getBoundingClientRect();
            if (rect.top < box.top - 1 || rect.bottom > box.bottom + 1 || rect.left < box.left - 1 || rect.right > box.right + 1) clipped = true;
          }
          node = node.parentElement;
        }
        const clip = style.clipPath || "none";
        const topCut = /inset\(\s*([\d.]+)px/.exec(clip);
        const visible =
          rect.top >= -1 &&
          rect.left >= -1 &&
          rect.bottom <= window.innerHeight + 1 &&
          rect.right <= window.innerWidth + 1 &&
          rect.height >= fontSize * 0.95;
        return {
          text: heading.textContent || "",
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          height: Math.round(rect.height),
          clip,
          clipped,
          visible,
          cut: topCut ? Number(topCut[1]) : 0,
        };
      });
      const where = `footer ${viewport.width}x${viewport.height}`;
      if (!/Let.s build something/.test(result.text)) failures.push({ where, message: `heading text ${result.text}` });
      if (!result.visible) failures.push({ where, message: `heading box top ${result.top} bottom ${result.bottom} height ${result.height}` });
      if (result.clipped) failures.push({ where, message: "heading is clipped by an ancestor" });
      if (result.cut > 1) failures.push({ where, message: `clip-path still cuts ${result.clip}` });
      else log(`${where} heading visible (${result.height}px)`);
      await page.close();
    }
  } catch (error) {
    failures.push({ where: "footer heading", message: String(error).slice(0, 400) });
  }
  await browser.close();
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

async function checkPhoneStory() {
  const titles = [
    "Akhilendra Singh",
    "Lyra",
    "Online Chalisa",
    "Sutra UI",
    "Tandem",
    "Buzzroom",
    "MyMirro",
    "DocMind",
    "Quorum",
    "Pulse",
    "Cadence",
    "Marketing site",
    "LaunchPad",
    "The thread ties off",
  ];
  const cases = [
    { width: 390, height: 844, mobile: false },
    { width: 440, height: 956, mobile: false },
    { width: 390, height: 844, mobile: true },
  ];
  const browser = await chromium.launch({
    ...(process.env.SMOKE_CHANNEL ? { channel: process.env.SMOKE_CHANNEL } : {}),
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    for (const item of cases) {
      const context = await browser.newContext({
        viewport: { width: item.width, height: item.height },
        isMobile: item.mobile,
        hasTouch: item.mobile,
      });
      const page = await context.newPage();
      const where = `story ${item.width}x${item.height}${item.mobile ? " touch" : ""}`;
      try {
        await page.goto(absolute("/"), { waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => document.querySelector(".pin-spacer, .thread-home"), null, { timeout: 8000 });
        await page.waitForTimeout(700);
        const found = new Set();
        const steps = 48;
        for (let step = 0; step <= steps; step += 1) {
          await page.evaluate((fraction) => {
            const home = document.querySelector(".thread-home");
            const spacer = document.querySelector(".pin-spacer");
            const host = spacer || home;
            const top = host.getBoundingClientRect().top + window.scrollY;
            const distance = Math.max(1, host.offsetHeight - window.innerHeight);
            window.scrollTo(0, top + distance * fraction);
          }, step / steps);
          await page.waitForTimeout(40);
          const visible = await page.evaluate(() =>
            [...document.querySelectorAll(".thread-copy h1, .thread-copy h2")]
              .filter((node) => {
                const card = node.closest(".thread-beat");
                const cardStyle = card ? getComputedStyle(card) : null;
                if (cardStyle && (cardStyle.visibility === "hidden" || Number(cardStyle.opacity) < 0.45)) return false;
                const rect = node.getBoundingClientRect();
                return rect.width > 8 && rect.height > 8 && rect.top < window.innerHeight && rect.bottom > 0;
              })
              .map((node) => node.textContent.replace(/\s+/g, " ").trim()),
          );
          for (const title of titles) {
            if (visible.some((text) => text.includes(title))) found.add(title);
          }
          if (found.size === titles.length) break;
        }
        const missing = titles.filter((title) => !found.has(title));
        if (missing.length) failures.push({ where, message: `missing ${missing.join(", ")}` });
        else log(`${where} shows all ${titles.length} story titles`);
      } catch (error) {
        failures.push({ where, message: String(error).slice(0, 400) });
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

await checkPhoneStory();
await checkFooterHeading();

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

const projectSource = readFileSync(new URL("../lib/projects.ts", import.meta.url), "utf8");
const expected = [];
for (const block of projectSource.split(/\n  \{/) ) {
  const slug = block.match(/slug: "([^"]+)"/)?.[1];
  if (!slug) continue;
  const live = block.match(/live: "([^"]+)"/)?.[1] || "";
  const repoPath = block.match(/repo: `\$\{gh\}([^`]+)`/)?.[1] || "";
  expected.push({ slug, live, repo: repoPath ? `https://github.com/AkhilSingh2${repoPath}` : "" });
}

function anchors(html) {
  const found = [];
  const pattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match = pattern.exec(html);
  while (match) {
    const href = match[1].match(/href="([^"]+)"/)?.[1] || "";
    const text = match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    found.push({ href, text });
    match = pattern.exec(html);
  }
  return found;
}

const outbound = new Map();
for (const project of expected) {
  const pageHref = `/work/${project.slug}`;
  let html = "";
  try {
    const response = await fetch(absolute(pageHref), { redirect: "follow" });
    html = response.ok ? await response.text() : "";
    if (!response.ok) failures.push({ where: pageHref, message: `${response.status}` });
  } catch (error) {
    failures.push({ where: pageHref, message: String(error).slice(0, 200) });
  }
  const links = anchors(html);
  const liveLink = links.find((item) => item.text.startsWith("Live site"));
  const codeLink = links.find((item) => item.text.startsWith("Code"));
  if (project.live) {
    if (!liveLink || liveLink.href !== project.live) failures.push({ where: pageHref, message: `missing Live site ${project.live}` });
    outbound.set(project.live, project.slug);
  } else if (liveLink) {
    failures.push({ where: pageHref, message: "Live site link without a public URL" });
  }
  if (project.repo) {
    if (!codeLink || codeLink.href !== project.repo) failures.push({ where: pageHref, message: `missing Code ${project.repo}` });
    outbound.set(project.repo, project.slug);
  } else if (codeLink) {
    failures.push({ where: pageHref, message: "Code link without a public repository" });
  }
}

const story = ["kinetic", "online-chalisa", "sutra-ui", "tandem", "buzzroom", "mymirro", "docmind", "meeting-actions", "pulse", "cadence", "marketing-site", "launchpad"];
const homeHtml = await (await fetch(absolute("/"), { redirect: "follow" })).text();
for (const slug of story) {
  const project = expected.find((item) => item.slug === slug);
  if (!project) continue;
  if (project.live && !homeHtml.includes(project.live)) failures.push({ where: "home story", message: `missing ${project.live}` });
  if (project.repo && !homeHtml.includes(project.repo)) failures.push({ where: "home story", message: `missing ${project.repo}` });
}

log(`checking ${outbound.size} live and code links`);
await mapLimit([...outbound.keys()], 6, async (href) => {
  try {
    const response = await fetch(href, { redirect: "follow" });
    if (response.status !== 200) failures.push({ where: href, message: `${response.status}` });
    else log(`200 ${href}`);
  } catch (error) {
    failures.push({ where: href, message: String(error).slice(0, 200) });
  }
});

if (failures.length) {
  log(JSON.stringify(failures.slice(0, 20), null, 2));
  log(`nav smoke failed: ${failures.length}`);
  process.exit(1);
}
log(`nav smoke passed for ${checked} internal links and ${outbound.size} live and code links`);
