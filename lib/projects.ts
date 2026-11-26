import { engineeringNotes, projectTags } from "@/lib/engineering";
import type { Engineering, StackTag } from "@/lib/engineering";

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
  repo?: string;
  pr?: string;
  live?: string;
  liveLabel?: string;
  reel: boolean;
  group: "selected" | "backend" | "professional" | "also";
  shots: Shot[];
  tags?: StackTag[];
  engineering?: Engineering;
};

const gh = "https://github.com/AkhilSingh2";

function plate(slug: string, caption: string): Shot[] {
  return [
    {
      src: `/covers/${slug}.svg`,
      alt: "Abstract cover in ink and champagne",
      width: 1200,
      height: 750,
      caption,
    },
  ];
}

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
      "Four routes — product, specs, gallery, story — build to a static folder. Requesting a pair opens a dialog and does not pretend there is a waitlist. The study is the site. It is live on GitHub Pages.",
    highlights: [
      "Pinned, scrubbed chapters with GSAP ScrollTrigger and Lenis on the wheel.",
      "A React Three Fiber headphone, lazy-loaded, paused offscreen, with a fragment shader on the driver.",
      "A plate that grows from a window until it is the room, then lets the line appear.",
      "View Transitions under an ivory curtain, and a reduced-motion path that keeps the writing.",
    ],
    stack: ["Vite", "React", "TypeScript", "GSAP", "Lenis", "Three.js", "React Three Fiber"],
    repo: `${gh}/kinetic`,
    live: "https://akhilsingh2.github.io/kinetic/",
    liveLabel: "Live site",
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
      "A recruiter can clone the repo and search a seeded library of notes with zero keys. OpenAI, Anthropic, Ollama, and Postgres with pgvector are optional switches on the same tools. The live link is a static build in demo mode with the sample library, so retrieval and the answerer run in the browser.",
    highlights: [
      "Upload a file, paste a note, or ingest a public URL, with checks against fetching internal addresses.",
      "Visible tool steps: retrieve, calculate, search, summarise, compare.",
      "A golden-set retrieval eval that fails the build when the right document leaves the top three.",
      "Dark and light themes, keyboard access, and a layout that works on a phone.",
    ],
    stack: ["Next.js", "TypeScript", "Vercel AI SDK", "Tailwind CSS", "Drizzle", "pgvector", "Vitest", "Playwright"],
    repo: `${gh}/docmind`,
    live: "https://akhilsingh2.github.io/docmind/",
    liveLabel: "Live demo",
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
      "Seeded demo users open a Northstar workspace. Confirming the local Pro checkout writes the plan, an idempotency row, an audit entry, and a billing email. The live link runs in demo mode on Vercel with a Neon Postgres database: one click signs in as the Northstar owner, checkout is simulated, and the sample data resets every day.",
    highlights: [
      "Organisations, invites, and owner, admin, and member roles.",
      "A launch id in the URL is loaded with the organisation from the membership, so one tenant cannot read another tenant's row.",
      "Stripe Checkout, Customer Portal, and signed webhooks, with the event id inserted before the plan changes.",
      "Rate limits on sign-in and invites, and React Email templates.",
    ],
    stack: ["Next.js", "TypeScript", "Postgres", "Drizzle", "Better Auth", "Stripe", "Resend", "Vitest", "Playwright"],
    repo: `${gh}/launchpad-saas`,
    live: "https://akhil-launchpad.vercel.app",
    liveLabel: "Live demo",
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
      "No accounts and no paid APIs. /demo opens two real clients side by side. A Playwright test types in one browser and reads the result in the other. The live link runs in demo mode with sample data. GitHub Pages has no websocket server, so tabs in one browser sync over a BroadcastChannel.",
    highlights: [
      "Five columns — Wishlist, Applied, Screen, Interview, Offer — with drag and drop and a detail drawer.",
      "A shared brief two people can type in, and a whiteboard stored as normalised points.",
      "Undo only reverts my own edits.",
      "The link is the permission. Rooms are unguessable ids.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Yjs", "Hocuspocus", "Tailwind CSS", "SQLite", "Playwright"],
    repo: `${gh}/tandem`,
    live: "https://akhilsingh2.github.io/tandem/",
    liveLabel: "Live demo",
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
      "Nothing calls a paid API. A simulator posts through the real SDK so the overview does not sit still. Identity stays on the anonymous id. user_id is an attribute, not a second person. The live link runs in demo mode with sample data: the same queries run against Postgres compiled to WebAssembly in the browser.",
    highlights: [
      "Funnels, retention cohorts, top pages, referrers, segment filters, CSV export, and saved views.",
      "Rollups for volume. Uniques, funnels, and retention stay on raw events.",
      "Unit tests for the math, and integration tests that check SQL against those functions when a database is present.",
      "A phone layout and a theme toggle.",
    ],
    stack: ["Next.js", "TypeScript", "tRPC", "Postgres", "Zod", "Recharts", "Turborepo", "Playwright"],
    repo: `${gh}/pulse-analytics`,
    live: "https://akhilsingh2.github.io/pulse-analytics/",
    liveLabel: "Live demo",
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
    slug: "buzzroom",
    title: "Buzzroom",
    kicker: "Party trivia game show",
    year: "2026",
    summary:
      "A trivia night for one big screen and a room full of phones. Teams join from a QR code, answer against a shared clock, and watch the scores land on a three.js stage.",
    problem:
      "Phones sleep, Wi-Fi drops, and the host's laptop restarts. A quiz that keeps state in the socket loses a team's answers the moment a screen locks.",
    built:
      "One Node process owns the game. Express serves the screens and Socket.IO carries every action. A phone reconnects on a new socket with its saved player id and is re-bound to its team, and the whole game is snapshotted to disk so a restart resumes mid-round. The display is a three.js stage with CC0 models.",
    outcome:
      "A host console, a big-screen display, a phone controller, and an audience view, with buzzer battles, lifelines, and a chance bowl. Smoke and reconnect tests run in CI. The live link runs in demo mode with sample data: the real server is bundled for the browser and plays a show with four simulated teams, and you can join from the panel beside it.",
    highlights: [
      "Twelve categories and 180 original questions, including flags drawn as SVG.",
      "Reconnect-safe teams: the player id survives a locked phone, and a 75-second grace keeps the seat.",
      "An atomic state file, written to a temp file and renamed, restored on boot.",
      "A printable deck and lifeline cards for a night without the network.",
    ],
    stack: ["Node.js", "Express 5", "Socket.IO", "Three.js", "esbuild", "Docker", "Fly.io"],
    repo: `${gh}/buzzroom`,
    live: "https://akhilsingh2.github.io/buzzroom/",
    liveLabel: "Live demo",
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/buzzroom/lobby.webp",
        alt: "Buzzroom lobby on the big screen with a join QR code and the teams who have joined.",
        width: 1280,
        height: 720,
        caption: "Lobby. Teams join from the QR code.",
      },
      {
        src: "/work/buzzroom/answering.webp",
        alt: "Buzzroom question on the three.js stage with a countdown and four answer options.",
        width: 1280,
        height: 720,
        caption: "A question on the stage, against the clock.",
      },
      {
        src: "/work/buzzroom/chance-draw.webp",
        alt: "Buzzroom chance bowl drawing a card for a team.",
        width: 1280,
        height: 720,
        caption: "The chance bowl. Cards can steal, shield, or share points.",
      },
      {
        src: "/work/buzzroom/demo-play-along.webp",
        alt: "Buzzroom demo with the big screen and a phone controller side by side.",
        width: 1280,
        height: 720,
        caption: "Demo mode. Join the simulated show from the phone panel.",
      },
    ],
  },
  {
    slug: "trainer",
    title: "Trainer",
    kicker: "Adaptive performance companion",
    year: "2026",
    summary:
      "A voice-first coach that reads last night's recovery and today's mood, decides what kind of day it is, and reshapes training, food, and study around it.",
    problem:
      "Most plans assume every day is a good day. After a bad night they still ask for the full session, and a missed day turns into guilt instead of a smaller win.",
    built:
      "A readiness engine scores sleep, HRV, and resting heart rate against my own baselines, adds a mood check-in, and classifies the day green, amber, red, or deload. An adapter turns that into a workout, a protein floor, a study block, and micro-tasks. Chat recalls preferences from pgvector memory, and a tutor mode gives hints only.",
    outcome:
      "FastAPI, Postgres with pgvector, a plain web UI, and a SwiftUI app with HealthKit and voice. Without an API key an offline coach answers from the day's plan. The live link runs in demo mode with sample data: the web UI in the browser, with ports of the readiness engine and the offline coach and nothing saved.",
    highlights: [
      "Tone is part of the plan: coaching, neutral, or empathetic with no guilt.",
      "A guardrail regenerates any tutor reply that looks like a full solution.",
      "Every log rebuilds and saves the day's plan.",
      "Unit tests and an end-to-end smoke test against Postgres in CI.",
    ],
    stack: ["Python", "FastAPI", "Postgres", "pgvector", "asyncpg", "Gemini", "SwiftUI", "HealthKit"],
    repo: `${gh}/trainer`,
    live: "https://akhilsingh2.github.io/trainer/",
    liveLabel: "Live demo",
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/trainer/red-day.webp",
        alt: "Trainer web UI on a red day with a short plan, micro-tasks, and a mood log.",
        width: 1280,
        height: 800,
        caption: "A red day. One kind sentence and fifteen honest minutes.",
      },
      {
        src: "/work/trainer/green-day.webp",
        alt: "Trainer web UI on a green day with a full session and a sixty-minute study block.",
        width: 1280,
        height: 800,
        caption: "A green day. The full session comes back.",
      },
      {
        src: "/work/trainer/mobile.webp",
        alt: "Trainer web UI on a phone.",
        width: 390,
        height: 844,
        caption: "The same plan on a phone.",
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
        width: 2880,
        height: 1800,
        caption: "Home. A reading room.",
      },
      {
        src: "/work/onlinechalisa/reader.webp",
        alt: "Hanuman Chalisa reader in Devanagari with script tabs and a verse-synced player.",
        width: 2880,
        height: 1800,
        caption: "Reader. Script, type size, and audio that follows the verse.",
      },
      {
        src: "/work/onlinechalisa/mobile.webp",
        alt: "Online Chalisa reader on a phone.",
        width: 1170,
        height: 2532,
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
      "A sample Bengaluru month fills the charts so the first launch is not an empty state. Budgets raise one alert at 75, 90, or 100 percent, not three. A PIN locks the ledger. Biometrics are used when the device has them. The live link is the Expo web build in demo mode. The sample month and anything I add stay in that browser.",
    highlights: [
      "Categories, income, monthly caps, and repeats that post themselves when they are due.",
      "INR by default. A charge can keep its original currency, with bundled indicative rates.",
      "Charts compare this month with the last without pretending rent repeats every day.",
      "Jest on the domain, and a small Node sync server I can point the app at.",
    ],
    stack: ["Expo", "React Native", "TypeScript", "SQLite", "Reanimated"],
    repo: `${gh}/spendsense-mobile`,
    live: "https://akhilsingh2.github.io/spendsense-mobile/",
    liveLabel: "Live demo",
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
      "Sutra UI is my open-source design system for calculators, converters, and generators. The gallery edition is ivory and ink, with antique gold as a line. The docs are live.",
    problem:
      "Small tools restyle the same control, and a salary gets left as an ungrouped string. A louder colour was the previous answer. This edition holds the pigment back.",
    built:
      "Tokens are W3C DTCG JSON and CSS variables. Fraunces titles the room. Inter does the labels, with Noto Sans Devanagari in the same stack. Kalamkari survives as a hairline, not a picture behind the sentence. Number inputs group in lakhs and crores. The FAQ writes FAQPage JSON-LD. There is no runtime CSS-in-JS. The core component JavaScript stays under 15KB gzipped.",
    outcome:
      "The docs are a static export on GitHub Pages: philosophy, components, tokens, and an illustrative income-tax shell. Themes are light, dark, high-contrast, and system. Motion does not bounce, and durations drop to 0ms when reduced motion is requested. Calibre, the system on this portfolio, stays separate.",
    highlights: [
      "Ivory is the wall. Ink does the reading. Antique gold is a line.",
      "Oxblood and emerald appear once, the way a miniature uses kumkum or peacock.",
      "Fraunces for the title, Inter for the tool.",
      "Kalamkari and block-print as hairline repeats.",
      "Lakh and crore grouping, and FAQPage JSON-LD.",
      "Core component JavaScript under 15KB gzipped.",
    ],
    stack: ["React", "TypeScript", "CSS"],
    repo: `${gh}/sutra-ui`,
    live: "https://akhilsingh2.github.io/sutra-ui/",
    liveLabel: "Live docs",
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/sutra-ui/home.webp",
        alt: "Sutra UI gallery edition home, ivory page, Fraunces title, and a Kalamkari line drawing labelled 01 Ink.",
        width: 2880,
        height: 1800,
        caption: "Gallery edition. Ivory, ink, and a Kalamkari study.",
      },
      {
        src: "/work/sutra-ui/philosophy.webp",
        alt: "Sutra UI philosophy page, Why it is held back, with the pigment, type, and motif principles.",
        width: 2880,
        height: 1800,
        caption: "Philosophy. The pigment is held back.",
      },
      {
        src: "/work/sutra-ui/components.webp",
        alt: "Sutra UI component collection with primary, secondary, ghost, and danger buttons.",
        width: 2880,
        height: 1800,
        caption: "Components. One primary action.",
      },
      {
        src: "/work/sutra-ui/tokens.webp",
        alt: "Sutra UI token page, The material, with live colour swatches.",
        width: 2880,
        height: 1800,
        caption: "Tokens. The swatches read the live CSS.",
      },
      {
        src: "/work/sutra-ui/dark.webp",
        alt: "The same Sutra UI gallery home in the dark theme, ivory type on ink.",
        width: 2880,
        height: 1800,
        caption: "The same index in the dark theme.",
      },
    ],
  },
  {
    slug: "devkit",
    title: "DevKit",
    kicker: "In-browser toolbox",
    year: "2026",
    summary:
      "I format JSON, convert YAML, decode a JWT, test a regex, and explain a cron expression in the browser. Nothing I paste is uploaded. It is live.",
    problem:
      "The small jobs — a token, a diff, a crontab — keep meaning another tab that sends the text somewhere. I want the tool in the page.",
    built:
      "Each tool has its own URL. JSON formats, minifies, and runs a JSONPath query. YAML converts locally, including Kubernetes, Compose, GitHub Actions, and Helm. JWT decode stays on the machine and does not verify the signature. A service worker keeps pages I have opened available offline.",
    outcome:
      "The site is a static Next.js export. I deployed it to GitHub Pages.",
    highlights: [
      "JSON, YAML, JWT, Base64, regex, cron, hashes, diff, SQL, curl-to-code, chmod, and color contrast.",
      "Private by default. The input is not a request.",
      "Offline for pages already opened, through a service worker.",
    ],
    stack: ["Next.js", "TypeScript"],
    repo: `${gh}/devkit`,
    live: "https://akhilsingh2.github.io/devkit/",
    liveLabel: "Live site",
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/devkit/home.webp",
        alt: "DevKit home with a filter and cards for JSON, YAML, JWT, and Base64 tools.",
        width: 2880,
        height: 1800,
        caption: "Home. Every tool runs in the browser.",
      },
      {
        src: "/work/devkit/json.webp",
        alt: "DevKit JSON formatter with a JSONPath match.",
        width: 2880,
        height: 1800,
        caption: "JSON formatter and JSONPath.",
      },
      {
        src: "/work/devkit/cron.webp",
        alt: "DevKit cron tool explaining an every-five-minutes expression.",
        width: 2880,
        height: 1800,
        caption: "Cron, explained in the page.",
      },
      {
        src: "/work/devkit/mobile.webp",
        alt: "DevKit home on a phone.",
        width: 1170,
        height: 2532,
        caption: "The same toolbox on a phone.",
      },
    ],
  },
  {
    slug: "meeting-actions",
    title: "Quorum",
    kicker: "Meeting agent",
    year: "2026",
    summary:
      "I paste a transcript, or drop in a Zoom, Meet, or Teams export, and Quorum returns decisions, owners, and a follow-up. Every item cites the line it came from.",
    problem:
      "I leave a call with a transcript and need the work, not another summary wall. The useful list is short. The file is long.",
    built:
      "Demo mode is the default and needs no API key. A heuristic reads the transcript and keeps the source sentence as the citation. The review board lists the summary, decisions, action items, open questions, risks, and a follow-up email. I can edit an owner and the email draft rebuilds from the fields. History stays in the browser.",
    outcome:
      "Markdown, CSV, and an .ics of deadlines download from the page. Ticket previews for Jira, Linear, GitHub, Notion, and Slack stop before the network unless I turn demo mode off and add credentials. The repository scores a checked-in eval set and says those figures describe that set only. The live link runs in demo mode with sample transcripts. The parser and heuristic run in the browser, and exports are dry runs.",
    highlights: [
      "WebVTT, SubRip, Zoom text, Meet's speaker export, dialogue, and Word.",
      "Each item links to a transcript line. Clicking the time scrolls to it.",
      "Status across meetings: open, in progress, done, dropped.",
      "If a live model fails, Quorum falls back to the heuristic and says so.",
    ],
    stack: ["Next.js", "TypeScript", "Zod"],
    repo: `${gh}/meeting-actions-agent`,
    live: "https://akhilsingh2.github.io/meeting-actions-agent/",
    liveLabel: "Live demo",
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/meeting-actions/review.webp",
        alt: "Quorum review board with the transcript beside cited action items.",
        width: 1600,
        height: 1111,
        caption: "Review. The citation sits next to the item.",
      },
      {
        src: "/work/meeting-actions/home.webp",
        alt: "Quorum home with a transcript field and sample meetings.",
        width: 1600,
        height: 1000,
        caption: "Home. Paste a transcript or open a sample.",
      },
      {
        src: "/work/meeting-actions/mobile.webp",
        alt: "Quorum review board on a phone-width screen.",
        width: 780,
        height: 1688,
        caption: "The same board on a phone.",
      },
    ],
  },
  {
    slug: "india-salary-tax",
    title: "Aayam",
    kicker: "Salary and tax",
    year: "2026",
    summary:
      "Aayam is my static site for salaried people in India: income tax, in-hand salary from CTC, HRA, and a rent receipt. No account. Nothing is uploaded.",
    problem:
      "CTC, take-home, and tax sit in different sheets, and the labels do not match the words on the offer.",
    built:
      "The tax calculator puts the old and new regimes side by side for FY 2025-26, and keeps FY 2024-25 available. In-hand breaks a CTC into basic, HRA, PF, gratuity, and professional tax by state. HRA uses the three statutory limits. The rent-receipt PDF is built in the browser.",
    outcome:
      "It is live on GitHub Pages. It is not the Income Tax Department and it does not file returns. The rules version lives in the repository, with links to the Budget speech and the Finance Bill. Names and PAN on a receipt stay on the device.",
    highlights: [
      "Section 87A rebate, surcharge, and cess, covered by tests at the slab edges.",
      "HRA for metro and non-metro cities.",
      "A sample receipt labelled Sample Tenant and Sample Landlord.",
      "Hindi FAQs and a dark theme.",
    ],
    stack: ["Next.js", "TypeScript"],
    repo: `${gh}/india-salary-tax`,
    live: "https://akhilsingh2.github.io/india-salary-tax/",
    liveLabel: "Live site",
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/india-salary-tax/home.webp",
        alt: "Aayam home page linking to the tax, salary, HRA, and rent-receipt tools.",
        width: 2880,
        height: 1800,
        caption: "Home.",
      },
      {
        src: "/work/india-salary-tax/tax.webp",
        alt: "Aayam income tax calculator comparing old and new regimes.",
        width: 2880,
        height: 1800,
        caption: "Income tax. Old and new regime side by side.",
      },
      {
        src: "/work/india-salary-tax/salary.webp",
        alt: "Aayam in-hand salary calculator from CTC.",
        width: 2880,
        height: 1800,
        caption: "In-hand from CTC.",
      },
      {
        src: "/work/india-salary-tax/hra.webp",
        alt: "Aayam HRA exemption calculator showing the lowest of three limits.",
        width: 2880,
        height: 1800,
        caption: "HRA. The exemption is the lowest of the three limits.",
      },
      {
        src: "/work/india-salary-tax/home-mobile.webp",
        alt: "Aayam home page on a phone.",
        width: 1170,
        height: 2532,
        caption: "Home on a phone.",
      },
    ],
  },
  {
    slug: "cgpa-upi",
    title: "Hundredmark",
    kicker: "CGPA and UPI",
    year: "2026",
    summary:
      "Hundredmark is two tools I use myself: CGPA to percentage, and a UPI QR code built entirely in the browser. The UPI ID never leaves the device.",
    problem:
      "The calculation is short and the pages I find are crowded. I want the institution, the number, and the result, and I want a payment poster that is not uploaded anywhere.",
    built:
      "Each university formula is quoted from the document that states it: CBSE, VTU, AKTU, Anna University, Mumbai, GTU, KTU, JNTUH, plus a custom multiplier. A result link reopens the same institution and value. The UPI tool checks the ID shape and builds a upi://pay link. Download a PNG or SVG, or print the poster.",
    outcome:
      "It is a static site, live on GitHub Pages. Hundredmark is not affiliated with any university, NPCI, BHIM, or a UPI app.",
    highlights: [
      "CGPA to percentage, percentage back to CGPA, and a credit-weighted SGPA average.",
      "One page per institution, for example VTU.",
      "UPI poster with an optional logo read from the device. It is not uploaded.",
      "Dark mode on the same pages.",
    ],
    stack: ["TypeScript"],
    repo: `${gh}/cgpa-upi-tools`,
    live: "https://akhilsingh2.github.io/cgpa-upi-tools/",
    liveLabel: "Live site",
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/cgpa-upi/home.webp",
        alt: "Hundredmark home with links to the CGPA calculator and the UPI QR generator.",
        width: 2880,
        height: 1800,
        caption: "Home.",
      },
      {
        src: "/work/cgpa-upi/cgpa.webp",
        alt: "Hundredmark VTU CGPA calculator on a desktop.",
        width: 2880,
        height: 1800,
        caption: "VTU CGPA to percentage.",
      },
      {
        src: "/work/cgpa-upi/upi.webp",
        alt: "Hundredmark UPI QR generator with a shop poster and a scannable code.",
        width: 2880,
        height: 1800,
        caption: "UPI poster. The ID stays on the device.",
      },
      {
        src: "/work/cgpa-upi/cgpa-mobile.webp",
        alt: "Hundredmark VTU calculator on a phone.",
        width: 1170,
        height: 2532,
        caption: "The same calculator on a phone.",
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
        width: 2880,
        height: 1800,
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
        width: 1170,
        height: 2532,
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
      "The screenshot uses the bundled example persona. I only train on chats I have permission to use. The live link is the web chat in demo mode: canned sample replies in the example persona's style, with no model behind it.",
    highlights: [
      "Multi-line messages and system lines, grouped by sender.",
      "Terminal chat and a Flask web UI.",
      "A fine-tuning export of prompt and response pairs.",
    ],
    stack: ["Python", "Flask", "OpenAI", "Anthropic", "Ollama", "Groq"],
    repo: `${gh}/momoGPT`,
    live: "https://akhilsingh2.github.io/momoGPT/",
    liveLabel: "Live demo",
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
  {
    slug: "mymirro-recommendation-api",
    title: "MyMirro Recommendation API",
    kicker: "Outfit search and colour",
    year: "2026",
    summary:
      "The REST API behind the MyMirro styling app. It builds outfits from the catalogue, searches similar outfits and products, and recommends colours from a photo or a skin-tone hex.",
    problem:
      "The styling app needs a service that can assemble outfits, search by embedding, and read a skin tone, and that can be called without the browser holding the catalogue.",
    built:
      "Flask-RESTX mounts the routes under /api/v1 and serves Swagger UI at /swagger/. Outfit generation and similarity search read Supabase. Similar outfits and products use a FAISS index over sentence-transformer embeddings. Colour analysis uses OpenCV, either on a base64 image or on a hex the client already picked.",
    outcome:
      "The repository is the source of truth. It documents Railway and Supabase setup, and it does not commit a public base URL, so the study links the repo rather than a live host.",
    highlights: [
      "Outfit generation takes a user id and an optional regenerate flag, and writes the result to Supabase.",
      "Similar outfits are a GET with a count query. Similar products are a POST.",
      "Colour analysis accepts an image or a hex, and rejects a body that sends both.",
      "If FAISS and sentence-transformers are not installed, outfit routes answer 503 instead of pretending to search.",
    ],
    stack: ["Python", "Flask", "Flask-RESTX", "FAISS", "sentence-transformers", "OpenCV", "Supabase", "Docker", "Railway"],
    repo: `${gh}/mymirro-backend`,
    reel: false,
    group: "backend",
    shots: plate("mymirro-recommendation-api", "POST /api/v1/outfits/generate"),
  },
  {
    slug: "colour-analysis-api",
    title: "Colour Analysis API",
    kicker: "Undertone and contrast",
    year: "2026",
    summary:
      "A Flask service that reads a face photo, names the skin undertone and contrast, and returns a palette with a short reason for each colour.",
    problem:
      "A palette picker that does not look at the face is a guess. This service had to find the face, sample even-lit skin, and say why a colour was recommended.",
    built:
      "POST /analyze takes a base64 image. OpenCV and dlib’s 68-point landmarks find the face. k-means clusters the skin pixels. Undertone is Warm or Cool, contrast is Low, Medium, or High, and the palette is chosen from those two labels. Swagger UI is mounted at /api/docs.",
    outcome:
      "Docker Compose and a Railway guide are in the repo. No public host is committed, so the study links the repository. The shape-predictor file is downloaded separately and is not in git.",
    highlights: [
      "A missing image returns 400 with an error string.",
      "The health check is GET /health and returns status healthy.",
      "The root path is an HTML form for trying an upload.",
      "Swagger is generated into static/swagger.json when the process starts.",
    ],
    stack: ["Python", "Flask", "OpenCV", "dlib", "scikit-learn", "Docker", "Railway"],
    repo: `${gh}/color-analysis`,
    reel: false,
    group: "backend",
    shots: plate("colour-analysis-api", "POST /analyze"),
  },
  {
    slug: "ai-asset-platform",
    title: "AI asset platform",
    kicker: "At Kwalee",
    year: "2024",
    summary:
      "A full-stack platform for cataloguing AI assets, composing recipes, and rendering them. I was the frontend-leaning full-stack engineer on the platform.",
    problem:
      "Rendering the same recipe twice wasted compute, and a failed job could leave an asset record with no file, or two records for one render.",
    built:
      "The browser is React and TypeScript. The API is Python and FastAPI. Render and recipe work runs on Celery workers that take jobs from SQS queues. A signature deduplicates a render or a recipe before it is queued. A person approves a batch before generation starts, which is how compute cost stays bounded. Retries use the same signature, so a second attempt updates the existing job instead of creating another asset.",
    outcome:
      "The platform catalogues assets, composes recipes, and renders them through that queue. Deduplication, approval, and idempotent retries are the reliability path.",
    highlights: [
      "Render and recipe deduplication signatures.",
      "Pre-generation approvals before compute is spent.",
      "Idempotent retries so a repeat does not orphan an asset or insert a duplicate record.",
    ],
    stack: ["React", "TypeScript", "Python", "FastAPI", "Celery", "SQS"],
    reel: false,
    group: "professional",
    shots: plate("ai-asset-platform", "A queue in front of the workers"),
  },
  {
    slug: "media-composition",
    title: "Media composition engine",
    kicker: "At Kwalee",
    year: "2024",
    summary:
      "A worker pipeline that composes video, GIFs, audio overrides, chroma-key plates, and VP9 output. I worked on the pipeline and the autoscaling around it.",
    problem:
      "Composed media failed when audio sample rates did not match, when tracks did not start together, or when a stream ended before the worker expected.",
    built:
      "FFmpeg is the composition step: video, GIFs, replacement audio, chroma-key, and VP9. The workers normalise sample rate, align tracks, and treat a short or chunked stream as a finished input instead of a broken one. The worker fleet autoscales with Helm and KEDA on Kubernetes.",
    outcome: "The workers handle up to 20,000 tasks a day.",
    highlights: [
      "One FFmpeg path for video, GIFs, audio overrides, chroma-key, and VP9.",
      "Sample-rate, alignment, and streaming cases handled in the worker, not left to the caller.",
      "Helm and KEDA scale the workers on Kubernetes.",
    ],
    stack: ["FFmpeg", "Python", "Kubernetes", "Helm", "KEDA"],
    reel: false,
    group: "professional",
    shots: plate("media-composition", "Workers scaled with Helm"),
  },
  {
    slug: "localisation-pipeline",
    title: "Localisation pipeline",
    kicker: "At Kwalee",
    year: "2024",
    summary:
      "Ingestion for many locales, and a model pass that scores agency translations. I co-developed the pipelines and built the frontend.",
    problem:
      "Agency translations arrived as files. There was no repeatable way to ingest them for every locale, or to tell a weak translation from a strong one before someone read it.",
    built:
      "The pipelines ingest translation files for 30+ locales. Gemini scores an agency translation against a reference with chrF. A Slack alert fires when a score needs a person. The frontend is the place those scores and the source strings are reviewed.",
    outcome: "Ingestion covers 30+ locales, with chrF scoring and a Slack alert on the translations that need a look.",
    highlights: [
      "Ingestion pipelines co-developed for 30+ locales.",
      "Gemini produces a chrF score against the agency translation.",
      "Slack alerts for scores that should be reviewed.",
      "The review screen is the frontend I built.",
    ],
    stack: ["React", "TypeScript", "Python", "Gemini"],
    reel: false,
    group: "professional",
    shots: plate("localisation-pipeline", "A review screen in front of the scores"),
  },
  {
    slug: "finance-platform",
    title: "Finance platform",
    kicker: "At Kwalee",
    year: "2024",
    summary:
      "A monorepo for a finance product, with revenue recognition shared by a React app and a FastAPI service, and an accounting integration. I set up the monorepo and the recognition module.",
    problem:
      "A retry of the same financial write created a second row, so the amount was counted twice.",
    built:
      "The monorepo holds the React app and the FastAPI service. Revenue recognition is one module called from both. The accounting system is NetSuite, reached through its API. The double count was an upsert that treated a repeated request as a new record. The fix uses a stable business key. The write inserts that key once and, on conflict, updates the same row. A retry sends the same key and the same amount, so the stored total does not move.",
    outcome:
      "Revenue recognition runs across the React app and the FastAPI service, and the accounting write no longer doubles a retried amount.",
    highlights: [
      "Monorepo for the web app and the API.",
      "Revenue recognition implemented once and used from both sides.",
      "NetSuite as the accounting API.",
      "Idempotent upsert on a stable business key.",
    ],
    stack: ["React", "TypeScript", "Python", "FastAPI", "NetSuite"],
    reel: false,
    group: "professional",
    shots: plate("finance-platform", "One module, two callers"),
  },
  {
    slug: "cloud-infrastructure",
    title: "Cloud infrastructure",
    kicker: "At Kwalee",
    year: "2024",
    summary:
      "Infrastructure as code for container images, the database, object storage, and access, plus autoscaling for the media workers. I wrote the Terraform and the Helm charts.",
    problem:
      "Environments were being prepared by hand, and production shared an account with older hosting. That made a change in one place able to touch the other.",
    built:
      "Terraform defines ECR, RDS, S3, and IAM, with a separate configuration for each environment. Non-production and production are separate accounts. Helm and KEDA scale the media workers. Hosted web apps that had lived in a legacy account were moved onto Amplify in the newer accounts. The module boundaries are the only detail here. Names, account ids, and policies stay in the private repositories.",
    outcome:
      "Images, the database, storage, and access are declared per environment, in separate non-production and production accounts, and the media workers scale with Helm and KEDA.",
    highlights: [
      "Terraform for ECR, RDS, S3, and IAM.",
      "A non-production account and a production account, kept apart.",
      "Amplify apps moved off a legacy account.",
      "Helm and KEDA for the worker fleet, up to 20,000 tasks a day on the media pipeline.",
    ],
    stack: ["Terraform", "AWS", "Helm", "KEDA", "Kubernetes", "Amplify"],
    reel: false,
    group: "professional",
    shots: plate("cloud-infrastructure", "Accounts, images, and the worker fleet"),
  },
  {
    slug: "marketing-site",
    title: "Marketing site",
    kicker: "At Kwalee",
    year: "2024",
    summary:
      "The studio’s public marketing site, moved to Next.js and a headless CMS. I led the migration.",
    problem:
      "The previous site fetched its content in sequence, hydrated more than the page needed, and shipped a bundle that made the first view slow.",
    built:
      "Next.js renders the pages. Strapi is the headless CMS. Requests for independent content run in parallel. Hydration is limited to the parts that actually change on the client. The bundle was cut back to what each route uses.",
    outcome: "Page load times fell by 45%.",
    highlights: [
      "Next.js for the site and Strapi for the content.",
      "Parallel fetches where the data does not depend on itself.",
      "Hydration limited to interactive parts.",
      "Bundle reduced to the route that needs it.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Strapi"],
    reel: false,
    group: "professional",
    shots: plate("marketing-site", "The pages that can stay static"),
  },
];

export function decorate<T extends { slug: string }>(project: T) {
  return {
    ...project,
    tags: projectTags[project.slug] ?? [],
    engineering: engineeringNotes[project.slug],
  };
}

export function getProject(slug: string) {
  const project = projects.find((item) => item.slug === slug);
  return project ? decorate(project) : undefined;
}

export function selectedProjects() {
  return projects.filter((project) => project.group === "selected");
}

export function alsoProjects() {
  return projects.filter((project) => project.group === "also");
}

export function backendProjects() {
  return projects.filter((project) => project.group === "backend");
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
