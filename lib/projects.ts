export type Shot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  year: string;
  summary: string;
  problem: string;
  built: string;
  outcome: string;
  highlights: string[];
  stack: string[];
  repo: string;
  pr?: string;
  live?: string;
  liveLabel?: string;
  reel: boolean;
  group: "selected" | "also";
  shots: Shot[];
};

const gh = "https://github.com/AkhilSingh2";

export const projects: Project[] = [
  {
    slug: "kinetic",
    title: "Lyra",
    kicker: "Kinetic launch site",
    year: "2026",
    summary:
      "A scroll-driven launch film for Lyra, a closed-back planar headphone that does not exist. I built it to show motion, WebGL, and interface craft in one static site.",
    problem:
      "A product film usually hides the engineering. I wanted the scroll itself to be the interface: one idea at a time, the object held in frame, the next sentence replacing the last.",
    built:
      "I modelled the headphone in the scene instead of downloading a file, lit it like a studio shot, and pinned the chapters so the driver turns as the line changes. Route changes run through a curtain. On a phone the pin, the custom cursor, and the heavy pixel ratio drop away.",
    outcome:
      "Four routes — product, specs, gallery, story — build to a static folder. Requesting a pair opens a dialog and does not pretend there is a waitlist. The study is the site.",
    highlights: [
      "Pinned, scrubbed chapters with GSAP ScrollTrigger and Lenis on the wheel.",
      "A React Three Fiber headphone, lazy-loaded, paused offscreen, with a fragment shader on the driver.",
      "A plate that grows from a window until it is the room, then lets the line appear.",
      "View Transitions under an ivory curtain, and a reduced-motion path that keeps the writing.",
    ],
    stack: ["Vite", "React", "TypeScript", "GSAP", "Lenis", "Three.js", "React Three Fiber"],
    repo: `${gh}/kinetic`,
    pr: `${gh}/kinetic/pull/1`,
    reel: true,
    group: "selected",
    shots: [
      {
        src: "/work/kinetic/hero.webp",
        alt: "Lyra hero. A milled headphone floats on a warm black field with the line The room disappears.",
        width: 1440,
        height: 900,
        caption: "Hero. The headphone is geometry I generated, not a downloaded model.",
      },
      {
        src: "/work/kinetic/chapter.webp",
        alt: "A pinned Lyra chapter with the headphone beside a short line of type.",
        width: 1440,
        height: 900,
        caption: "A pinned chapter. One idea, the object held in frame.",
      },
      {
        src: "/work/kinetic/gallery.webp",
        alt: "Lyra gallery of original studies on a dark field.",
        width: 1440,
        height: 900,
        caption: "Gallery studies. Hover distortion only exists while a pointer is on a plate.",
      },
      {
        src: "/work/kinetic/mobile.webp",
        alt: "Lyra on a phone, the headphone above the headline.",
        width: 780,
        height: 1688,
        caption: "The phone layout keeps the type and drops the choreography.",
      },
    ],
  },
  {
    slug: "docmind",
    title: "DocMind",
    kicker: "Cited research agent",
    year: "2026",
    summary:
      "I load PDFs, Markdown, and public pages, ask a question, and get an answer whose citations jump back to the exact passage. Demo mode needs no API key.",
    problem:
      "A chat box over a pile of documents is easy to fake and hard to trust. I wanted the retrieval, the tool call, and the quoted sentence visible in the same screen.",
    built:
      "Chunking is heading-aware. Retrieval mixes a hashed vector with a lexical score. Answers stream through the Vercel AI SDK. In the default mock, the answer is extractive: a citation cannot point at a sentence the library does not contain.",
    outcome:
      "A recruiter can clone the repo and search a seeded library of notes with zero keys. OpenAI, Anthropic, Ollama, and Postgres with pgvector are optional switches on the same tools.",
    highlights: [
      "Upload a file, paste a note, or ingest a public URL, with checks against fetching internal addresses.",
      "Visible tool steps: retrieve, calculate, search, summarise, compare.",
      "A golden-set retrieval eval that fails the build when the right document leaves the top three.",
      "Dark and light themes, keyboard access, and a layout that works on a phone.",
    ],
    stack: ["Next.js", "TypeScript", "Vercel AI SDK", "Tailwind CSS", "Drizzle", "pgvector", "Vitest", "Playwright"],
    repo: `${gh}/docmind`,
    pr: `${gh}/docmind/pull/1`,
    reel: true,
    group: "selected",
    shots: [
      {
        src: "/work/docmind/desktop.webp",
        alt: "DocMind workspace with a library, a cited answer, and the source passage open.",
        width: 1440,
        height: 900,
        caption: "Desktop. The citation opens the passage it came from.",
      },
      {
        src: "/work/docmind/mobile.webp",
        alt: "DocMind on a phone, the same research workspace stacked.",
        width: 390,
        height: 844,
        caption: "The same loop on a phone.",
      },
    ],
  },
  {
    slug: "launchpad",
    title: "LaunchPad",
    kicker: "Multi-tenant SaaS starter",
    year: "2026",
    summary:
      "A SaaS starter for planning a launch with a team: sessions, organisations, roles enforced on the server, billing, an audit log, and mail. It runs locally with no paid accounts.",
    problem:
      "Starters often stop at a login form. The hard parts are the membership check, the plan limit before the insert, and a webhook that does not apply twice.",
    built:
      "I put the real session check in server actions. The proxy only looks for a cookie. Every mutation loads the membership and the role. Stripe is real when keys exist and a local checkout stub when they do not. Mail goes to Resend or to an outbox I can read at /dev/emails.",
    outcome:
      "Seeded demo users open a Northstar workspace. Confirming the local Pro checkout writes the plan, an idempotency row, an audit entry, and a billing email.",
    highlights: [
      "Organisations, invites, and owner, admin, and member roles.",
      "A launch id in the URL is loaded with the organisation from the membership, so one tenant cannot read another tenant's row.",
      "Stripe Checkout, Customer Portal, and signed webhooks, with the event id inserted before the plan changes.",
      "Rate limits on sign-in and invites, and React Email templates.",
    ],
    stack: ["Next.js", "TypeScript", "Postgres", "Drizzle", "Better Auth", "Stripe", "Resend", "Vitest", "Playwright"],
    repo: `${gh}/launchpad-saas`,
    pr: `${gh}/launchpad-saas/pull/1`,
    reel: true,
    group: "selected",
    shots: [
      {
        src: "/work/launchpad/landing.webp",
        alt: "LaunchPad marketing landing page.",
        width: 1440,
        height: 900,
        caption: "Landing.",
      },
      {
        src: "/work/launchpad/dashboard.webp",
        alt: "LaunchPad workspace dashboard for the Northstar organisation.",
        width: 1440,
        height: 900,
        caption: "The Northstar workspace.",
      },
      {
        src: "/work/launchpad/billing.webp",
        alt: "LaunchPad billing screen with the local checkout path.",
        width: 1440,
        height: 900,
        caption: "Billing. Without Stripe keys, checkout stays inside the app and still writes the plan.",
      },
      {
        src: "/work/launchpad/mobile.webp",
        alt: "LaunchPad landing page on a phone.",
        width: 390,
        height: 844,
        caption: "Landing on a phone.",
      },
    ],
  },
  {
    slug: "tandem",
    title: "Tandem",
    kicker: "Real-time job-hunt studio",
    year: "2026",
    summary:
      "Two people, one pipeline, live. I open a room, share the link, and the other person gets a cursor, a name, and the same board. If the socket drops, the edits still merge.",
    problem:
      "A shared board that last-writes-wins loses a sentence. I wanted the brief, the cards, and the sketch to merge, and I wanted cursors that do not bloat the saved document.",
    built:
      "The document is a Y.Doc. Keystrokes land locally, then stream through a Hocuspocus websocket into SQLite, or Postgres when DATABASE_URL is set. Awareness carries cursors and in-progress strokes and is not persisted. Offline edits sit in IndexedDB.",
    outcome:
      "No accounts and no paid APIs. /demo opens two real clients side by side. A Playwright test types in one browser and reads the result in the other.",
    highlights: [
      "Five columns — Wishlist, Applied, Screen, Interview, Offer — with drag and drop and a detail drawer.",
      "A shared brief two people can type in, and a whiteboard stored as normalised points.",
      "Undo only reverts my own edits.",
      "The link is the permission. Rooms are unguessable ids.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Yjs", "Hocuspocus", "Tailwind CSS", "SQLite", "Playwright"],
    repo: `${gh}/tandem`,
    pr: `${gh}/tandem/pull/1`,
    reel: true,
    group: "selected",
    shots: [
      {
        src: "/work/tandem/landing.webp",
        alt: "Tandem landing page introducing the shared job-hunt studio.",
        width: 1440,
        height: 900,
        caption: "Landing. The link is the only permission.",
      },
      {
        src: "/work/tandem/room.webp",
        alt: "Tandem room with a shared pipeline and presence.",
        width: 1440,
        height: 900,
        caption: "A room. Pipeline, brief, and sketch on one document.",
      },
      {
        src: "/work/tandem/room-mobile.webp",
        alt: "Tandem room on a phone.",
        width: 390,
        height: 844,
        caption: "The room on a phone.",
      },
    ],
  },
  {
    slug: "pulse",
    title: "Pulse",
    kicker: "Product analytics",
    year: "2026",
    summary:
      "I track events, watch them land, and answer three questions: what happened, who converted, and who came back. The product in the demo, Northstar, is synthetic traffic.",
    problem:
      "Dashboards that sum unique visitors across hourly buckets invent numbers. Funnels that join anonymous ids to user ids the wrong way invent drop-off.",
    built:
      "The SDK batches page, track, and identify. Ingest validates with Zod, dedupes on event id, and rate-limits. Raw events stay in Postgres. Hourly and daily rollups update on the write. The dashboard reads through tRPC, and the chart says whether it used a rollup or the raw table.",
    outcome:
      "Nothing calls a paid API. A simulator posts through the real SDK so the overview does not sit still. Identity stays on the anonymous id. user_id is an attribute, not a second person.",
    highlights: [
      "Funnels, retention cohorts, top pages, referrers, segment filters, CSV export, and saved views.",
      "Rollups for volume. Uniques, funnels, and retention stay on raw events.",
      "Unit tests for the math, and integration tests that check SQL against those functions when a database is present.",
      "A phone layout and a theme toggle.",
    ],
    stack: ["Next.js", "TypeScript", "tRPC", "Postgres", "Zod", "Recharts", "Turborepo", "Playwright"],
    repo: `${gh}/pulse-analytics`,
    pr: `${gh}/pulse-analytics/pull/1`,
    reel: true,
    group: "selected",
    shots: [
      {
        src: "/work/pulse/overview.webp",
        alt: "Pulse overview dashboard with traffic for the fictional Northstar product.",
        width: 1440,
        height: 960,
        caption: "Overview. Synthetic Northstar traffic, seeded and deterministic.",
      },
      {
        src: "/work/pulse/funnels.webp",
        alt: "Pulse funnel view.",
        width: 1440,
        height: 900,
        caption: "Funnels, computed from raw events.",
      },
      {
        src: "/work/pulse/retention.webp",
        alt: "Pulse weekly retention chart.",
        width: 1440,
        height: 900,
        caption: "Weekly retention.",
      },
      {
        src: "/work/pulse/mobile.webp",
        alt: "Pulse overview on a phone.",
        width: 780,
        height: 1688,
        caption: "The same overview on a phone.",
      },
    ],
  },
  {
    slug: "online-chalisa",
    title: "Online Chalisa",
    kicker: "Multilingual reader",
    year: "2026",
    summary:
      "I built a reader for Hindu devotional texts in six languages, with verse-synced audio and offline transliteration. It is live at onlinechalisa.com. Aman Sharma built it with me.",
    problem:
      "The texts are easy to find as scans and awkward to read: mixed scripts, no verse-level audio, and pages that were not designed for a phone.",
    built:
      "The texts are structured JSON. English sits at the root. Untranslated pages fall back to English. Devanagari transliterates offline to Telugu, Tamil, Kannada, Bengali, and IAST, including the consonants Tamil does not have. A script makes one clip per verse and writes the timestamps the player follows.",
    outcome:
      "The site is server-rendered on Cloudflare Workers, with a generated sitemap, per-page Open Graph images, a reading streak, and a custom 404.",
    highlights: [
      "Six locales: English, Hindi, Bengali, Telugu, Tamil, and Kannada.",
      "Transliteration has no runtime dictionary service.",
      "Audio is joined with ffmpeg and highlighted verse by verse.",
      "WhatsApp share and a sankalp page sit beside the reader, not in the way of it.",
    ],
    stack: ["Astro", "TypeScript", "Tailwind CSS", "Cloudflare Workers", "ElevenLabs", "ffmpeg"],
    repo: `${gh}/onlinechalisa.com`,
    live: "https://onlinechalisa.com",
    liveLabel: "onlinechalisa.com",
    reel: true,
    group: "selected",
    shots: [
      {
        src: "/work/onlinechalisa/home.webp",
        alt: "Online Chalisa home page inviting a reading of the Hanuman Chalisa.",
        width: 1440,
        height: 900,
        caption: "Home. A reading room.",
      },
      {
        src: "/work/onlinechalisa/reader.webp",
        alt: "Hanuman Chalisa reader in Devanagari with script tabs and a verse-synced player.",
        width: 1440,
        height: 900,
        caption: "Reader. Script, type size, and audio that follows the verse.",
      },
      {
        src: "/work/onlinechalisa/mobile.webp",
        alt: "Online Chalisa reader on a phone.",
        width: 585,
        height: 1266,
        caption: "The phone is the same reader.",
      },
    ],
  },
  {
    slug: "spendsense",
    title: "SpendSense",
    kicker: "Local-first ledger",
    year: "2026",
    summary:
      "I write an expense the way I actually say it — 450 lunch with team yesterday — and the ledger files it. The app is Expo, phone first, and it runs with no API key.",
    problem:
      "Expense apps want a form before they want the sentence. I wanted the sentence, a keypad, and a receipt photo to land in the same review step, and I wanted the month to still work on a train.",
    built:
      "Money is stored as minor units. The parser tries a mock model that turns spoken amounts into digits, then the same grammar as the rules. If the model throws, 450 lunch yesterday still saves. SQLite is the store. The browser falls back to local storage. Sync is optional.",
    outcome:
      "A sample Bengaluru month fills the charts so the first launch is not an empty state. Budgets raise one alert at 75, 90, or 100 percent, not three. A PIN locks the ledger. Biometrics are used when the device has them.",
    highlights: [
      "Categories, income, monthly caps, and repeats that post themselves when they are due.",
      "INR by default. A charge can keep its original currency, with bundled indicative rates.",
      "Charts compare this month with the last without pretending rent repeats every day.",
      "Jest on the domain, and a small Node sync server I can point the app at.",
    ],
    stack: ["Expo", "React Native", "TypeScript", "SQLite", "Reanimated"],
    repo: `${gh}/spendsense-mobile`,
    pr: `${gh}/spendsense-mobile/pull/1`,
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/spendsense/home.webp",
        alt: "SpendSense home screen with the month and a place to type an expense.",
        width: 780,
        height: 1688,
        caption: "Home. Type the expense in a sentence.",
      },
      {
        src: "/work/spendsense/insights.webp",
        alt: "SpendSense insights with daily bars and a category breakdown.",
        width: 780,
        height: 1688,
        caption: "Insights for the month.",
      },
      {
        src: "/work/spendsense/add.webp",
        alt: "SpendSense add screen reviewing a parsed expense.",
        width: 780,
        height: 1688,
        caption: "Review before it hits the ledger.",
      },
    ],
  },
  {
    slug: "laa-pi",
    title: "laa-pi",
    kicker: "Local-first job search",
    year: "2026",
    summary:
      "I built a job-search copilot that finds roles, scores fit, and writes a one-page resume from facts already in my profile. I approve what gets sent. It runs on my machine.",
    problem:
      "Applying is a loop of tailoring and forms. The useful part is repetitive. The dangerous part is a model inventing a skill, or a bot sending something I have not read.",
    built:
      "Discovery uses the public Greenhouse, Lever, and Ashby boards, plus headed browser collectors. Near-duplicates merge, and a direct listing wins over an aggregator. The resume builder may only pick facts by index. Every rendered string is checked before the PDF is written.",
    outcome:
      "The copilot pauses on an OTP, a CAPTCHA, a login wall, or an unknown question. LinkedIn and Naukri are never auto-submitted. Outreach is copy I send myself. Seventy-two tests run without a network.",
    highlights: [
      "A Streamlit dashboard: Home, Jobs, Applications, Outreach, Command Center, Scheduler, Settings.",
      "Fit scoring drops any skill that is not in the profile and the job text.",
      "Daily caps, delays, and execution windows are in the config, not in a prompt.",
      "One Docker image can front the app with a password. It is not a public hosted product.",
    ],
    stack: ["Python", "Streamlit", "SQLite", "Playwright", "Claude", "WeasyPrint", "Docker", "pytest"],
    repo: `${gh}/laa-pi`,
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/laa-pi/home.webp",
        alt: "laa-pi home dashboard for a sample profile, with pipeline counts and items that need review.",
        width: 1440,
        height: 900,
        caption: "Home, with a fictional sample profile.",
      },
      {
        src: "/work/laa-pi/jobs.webp",
        alt: "laa-pi jobs board with sample roles, fit scores, and approve or apply actions.",
        width: 1440,
        height: 900,
        caption: "Jobs. Approve stays a separate action from apply.",
      },
      {
        src: "/work/laa-pi/applications.webp",
        alt: "laa-pi applications table for sample roles.",
        width: 1440,
        height: 900,
        caption: "Applications, with a CSV export.",
      },
    ],
  },
  {
    slug: "subtitle-vocab-explainer",
    title: "Subtitle Vocab Explainer",
    kicker: "Chrome extension",
    year: "2026",
    summary:
      "I click a word in a YouTube or Netflix caption and read the meaning in that scene, without leaving the video. Dictionary mode is free. AI mode is optional.",
    problem:
      "Looking a word up pulls me out of the line it belonged to, and a dictionary often misses the idiom.",
    built:
      "Caption adapters for both sites underline idioms. I can drag across a phrase. Smart pause resumes only if the extension paused the video. The card renders in a closed shadow DOM. The API key stays in the service worker.",
    outcome:
      "The repository records 237 unit tests, including a check that refuses a build with an embedded key. I load it unpacked. It is not a Chrome Web Store listing yet.",
    highlights: [
      "Free mode: dictionary, IPA, pronunciation, and an estimated level.",
      "AI mode asks for the meaning of that line at a chosen CEFR level.",
      "Saved words and a CSV export. No account.",
      "The repo includes the PRD, the UX spec, and the technical design.",
    ],
    stack: ["TypeScript", "React", "Vite", "Manifest V3", "Tailwind CSS", "Vitest"],
    repo: `${gh}/subtitle-vocab-explainer`,
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/subtitle-vocab-explainer/onboarding.webp",
        alt: "Subtitle Vocab Explainer onboarding: captions, click a word, optional API key.",
        width: 680,
        height: 480,
        caption: "Onboarding. Three steps, then back to the video.",
      },
      {
        src: "/work/subtitle-vocab-explainer/popup.webp",
        alt: "Extension popup with level, mode, and smart pause.",
        width: 380,
        height: 340,
        caption: "Popup.",
      },
    ],
  },
  {
    slug: "sutra-ui",
    title: "Sutra UI",
    kicker: "Design system",
    year: "2026",
    summary:
      "Sutra UI is my open-source design system for fast, India-first web tools. I am building it to be imported, not presented.",
    problem:
      "Small tools keep restyling the same button, the same field, and the same empty state. A system only helps if it is accessible and small enough to adopt.",
    built:
      "The public repository states the intent: accessible components for interfaces that have to work on a phone, in more than one script, and without a heavy runtime.",
    outcome:
      "The repository is the source. Calibre, the system on this portfolio, is the specimen I use for my own site. Sutra is the one I am shaping for other tools.",
    highlights: [
      "Accessible by default, so the keyboard path is part of the component and not a later pass.",
      "Aimed at India-first tools: dense type, clear touch targets, and room for more than one script.",
      "Open source, so the decisions are in the repo rather than in a file only I can open.",
    ],
    stack: [],
    repo: `${gh}/sutra-ui`,
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/sutra-ui/cover.webp",
        alt: "Title card reading Sutra UI, an accessible system for India-first tools.",
        width: 1440,
        height: 900,
        caption: "Sutra UI.",
      },
    ],
  },
  {
    slug: "devkit",
    title: "DevKit",
    kicker: "In-browser tools",
    year: "2026",
    summary:
      "DevKit is my set of developer tools that run in the browser. They are fast, they work offline, and the work stays on the machine.",
    problem:
      "Small utilities keep sending a snippet, a diff, or a token to someone else's server. I want the tool in the tab.",
    built:
      "The public repository describes private, offline-capable tools. No account stands between the page and the result.",
    outcome:
      "I use the browser as the runtime on purpose. If a tool needs a network, that has to be the exception I can see.",
    highlights: [
      "Runs entirely in the browser.",
      "Offline-capable, so a laptop on a train is still a workbench.",
      "Private by default: the input is not a request.",
    ],
    stack: [],
    repo: `${gh}/devkit`,
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/devkit/cover.webp",
        alt: "Title card reading DevKit, developer tools that stay in the browser.",
        width: 1440,
        height: 900,
        caption: "DevKit.",
      },
    ],
  },
  {
    slug: "meeting-actions",
    title: "Meeting Actions",
    kicker: "Transcript agent",
    year: "2026",
    summary:
      "I turn a meeting transcript into the decisions, the action items, and the tickets those actions become.",
    problem:
      "The useful part of a meeting is a short list. The transcript is long, and the list usually lives in someone's memory.",
    built:
      "The agent reads the transcript and separates what was decided from what someone has to do next. The public repository is meeting-actions-agent.",
    outcome:
      "A transcript goes in. Decisions, actions, and tickets come out, in a shape I can file instead of re-read.",
    highlights: [
      "Decisions stay distinct from chatter.",
      "Action items name the work, not the whole paragraph.",
      "Tickets are the same actions, ready to track.",
    ],
    stack: [],
    repo: `${gh}/meeting-actions-agent`,
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/meeting-actions/cover.webp",
        alt: "Title card reading Meeting Actions, transcripts into decisions and tickets.",
        width: 1440,
        height: 900,
        caption: "Meeting Actions.",
      },
    ],
  },
  {
    slug: "india-salary-tax",
    title: "India salary and tax",
    kicker: "Salary suite",
    year: "2026",
    summary:
      "A suite I am building to read an Indian salary and the tax on it, without a spreadsheet that only I understand.",
    problem:
      "CTC, take-home, and tax sit in different sheets, and the labels do not match the words on the offer.",
    built:
      "The public repository is india-salary-tax. The work is a clear reading of a salary and the tax attached to it.",
    outcome:
      "One place to see what the offer says and what the tax does to it.",
    highlights: [
      "Salary and tax in the same reading.",
      "Written for pay in India.",
      "The repository is public.",
    ],
    stack: [],
    repo: `${gh}/india-salary-tax`,
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/india-salary-tax/cover.webp",
        alt: "Title card reading Salary and tax, an India salary and tax suite.",
        width: 1440,
        height: 900,
        caption: "India salary and tax.",
      },
    ],
  },
  {
    slug: "cgpa-upi",
    title: "CGPA and UPI tools",
    kicker: "Small tools",
    year: "2026",
    summary:
      "Two small tools I keep reaching for: one for CGPA, one for UPI. They live together in cgpa-upi-tools.",
    problem:
      "The calculations are short and the pages I find are crowded. I want the input, the result, and nothing else.",
    built:
      "A CGPA tool and a UPI tool, published together so I do not rebuild either of them the next time I need them.",
    outcome:
      "Fast, single-purpose tools. The repository is public.",
    highlights: [
      "CGPA in one place.",
      "UPI in another.",
      "Small on purpose.",
    ],
    stack: [],
    repo: `${gh}/cgpa-upi-tools`,
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/cgpa-upi/cover.webp",
        alt: "Title card reading CGPA and UPI, small tools for marks and payments.",
        width: 1440,
        height: 900,
        caption: "CGPA and UPI tools.",
      },
    ],
  },
  {
    slug: "mymirro",
    title: "MyMirro",
    kicker: "AI styling app",
    year: "2025",
    summary:
      "I worked on the frontend of MyMirro, a styling app with a quiz, outfit recommendations, lookbooks, and a cart. It is live at mymirro.in. Aditya Pratap Singh and Sanket Singh built it with me.",
    problem:
      "The quiz had to become outfits, similar looks, and a path to the product, without the interface feeling like a catalogue search.",
    built:
      "My commits covered the style-quiz flow, looks and outfit pages, lookbooks with a public or private setting, the recommendations UI, cart and product pages, and client-side image caching.",
    outcome:
      "The recommendations UI talks to API routes that proxy the recommendation service. The live app is mymirro.in.",
    highlights: [
      "Style quiz and the newer onboarding.",
      "Routing for a single piece inside an outfit.",
      "Lookbooks: create, rename, public or private.",
      "Analytics wiring for the storefront.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Framer Motion"],
    repo: `${gh}/mymirrowebsite`,
    live: "https://www.mymirro.in",
    liveLabel: "mymirro.in",
    reel: false,
    group: "also",
    shots: [
      {
        src: "/work/mymirro/home.webp",
        alt: "MyMirro home page with the style quiz invitation.",
        width: 1440,
        height: 900,
        caption: "Home. The quiz is the way in.",
      },
      {
        src: "/work/mymirro/style-quiz.webp",
        alt: "MyMirro style quiz on a phone.",
        width: 585,
        height: 1266,
        caption: "Style quiz.",
      },
      {
        src: "/work/mymirro/home-mobile.webp",
        alt: "MyMirro home on a phone.",
        width: 585,
        height: 1266,
        caption: "Home on a phone.",
      },
    ],
  },
  {
    slug: "momogpt",
    title: "momoGPT",
    kicker: "Texting style",
    year: "2026",
    summary:
      "I parse a WhatsApp export and reply in that person's vocabulary, emoji habits, message length, and punctuation. Real exports stay out of git.",
    problem:
      "A prompt that says be casual is not a texting style. The measurable parts are short: which words repeat, how long a message is, which emoji show up.",
    built:
      "A parser for common export formats, an analyzer that writes a personality file and a system prompt, and backends for OpenAI, Anthropic, Ollama, Groq, or OpenRouter. Several exports can merge when the same person appears under different names.",
    outcome:
      "The screenshot uses the bundled example persona. I only train on chats I have permission to use.",
    highlights: [
      "Multi-line messages and system lines, grouped by sender.",
      "Terminal chat and a Flask web UI.",
      "A fine-tuning export of prompt and response pairs.",
    ],
    stack: ["Python", "Flask", "OpenAI", "Anthropic", "Ollama", "Groq"],
    repo: `${gh}/momoGPT`,
    reel: false,
    group: "also",
    shots: [
      {
        src: "/work/momogpt/chat.webp",
        alt: "momoGPT web chat with the example persona.",
        width: 1280,
        height: 800,
        caption: "Web UI, example persona.",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function selectedProjects() {
  return projects.filter((project) => project.group === "selected");
}

export function alsoProjects() {
  return projects.filter((project) => project.group === "also");
}

export function reelProjects() {
  return projects.filter((project) => project.reel);
}

export function neighbors(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? projects[index - 1] : undefined,
    next: index < projects.length - 1 ? projects[index + 1] : undefined,
  };
}
