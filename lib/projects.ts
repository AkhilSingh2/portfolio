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
  role: string;
  highlights: string[];
  stack: string[];
  repo?: string;
  live?: string;
  liveLabel?: string;
  reel: boolean;
  group: "selected" | "study";
  shots: Shot[];
  note?: string;
  with?: string;
};

const gh = "https://github.com/AkhilSingh2";

export const projects: Project[] = [
  {
    slug: "laa-pi",
    title: "laa-pi",
    kicker: "Local-first job search",
    year: "2026",
    summary:
      "A job-search copilot that finds roles, scores fit, and writes a one-page resume that can only use facts from your profile. You approve what gets sent.",
    problem:
      "Applying for roles is a loop of tailoring and form-filling. The useful part is repetitive. The risky part is a model inventing a skill, or a bot submitting something you have not read.",
    role: "Product design and engineering.",
    highlights: [
      "Discovery from the public Greenhouse, Lever, and Ashby board APIs, plus LinkedIn and Naukri collectors in a headed Playwright browser.",
      "Near-duplicate roles are merged with TF-IDF. Direct ATS listings win over LinkedIn, and LinkedIn over Naukri.",
      "Fit scoring uses a weighted rubric. A skill the model names that is not in the profile and the job text is dropped.",
      "The resume builder may only pick and order facts from the profile by index. Every rendered string is checked before the PDF is written.",
      "The copilot pauses on an OTP, CAPTCHA, login wall, or unknown question. LinkedIn and Naukri are never auto-submitted. Outreach is copy-only.",
      "A Streamlit dashboard covers Home, Jobs, Applications, Outreach, Command Center, Scheduler, and Settings. Seventy-two pytest tests run without a network or a browser.",
    ],
    stack: [
      "Python 3.12",
      "Streamlit",
      "SQLite",
      "Playwright",
      "Claude",
      "Pydantic",
      "WeasyPrint",
      "APScheduler",
      "Docker",
      "pytest",
    ],
    repo: `${gh}/laa-pi`,
    reel: true,
    group: "selected",
    note: "Screenshots use a fictional sample profile. The app runs locally, or as one Docker image with a password in front. It is not a public hosted product.",
    shots: [
      {
        src: "/work/laa-pi/home.webp",
        alt: "laa-pi home dashboard for a sample profile, with pipeline counts, quotas, and items that need review.",
        width: 1440,
        height: 900,
        caption: "Home. Quotas, pipeline, and anything that still needs a person.",
      },
      {
        src: "/work/laa-pi/jobs.webp",
        alt: "laa-pi jobs board with two sample roles, fit scores, and approve, apply, or remove actions.",
        width: 1440,
        height: 900,
        caption: "Jobs. Fit score on the card. Approve stays a separate action from apply.",
      },
      {
        src: "/work/laa-pi/applications.webp",
        alt: "laa-pi applications table listing discovered sample roles, fit scores, and status filters.",
        width: 1440,
        height: 900,
        caption: "Applications. Status, platform, and a CSV export.",
      },
    ],
  },
  {
    slug: "subtitle-vocab-explainer",
    title: "Subtitle Vocab Explainer",
    kicker: "Chrome extension",
    year: "2026",
    summary:
      "Explains a word or idiom in YouTube and Netflix captions, in the scene, without leaving the video. Dictionary mode is free. AI mode is optional.",
    problem:
      "Looking a word up from a caption means leaving the scene, losing the line it belonged to, and often getting a definition that ignores the idiom in front of you.",
    role: "Product, interface, and engineering. The repo includes a PRD, a competitor note, a UX spec, and a technical design.",
    highlights: [
      "Caption adapters for YouTube and Netflix. Idioms and phrasal verbs are underlined. Drag across a phrase to explain it.",
      "Smart pause: the video pauses while you read, and resumes only if the extension paused it.",
      "Free mode uses a dictionary, IPA, pronunciation, and an estimated level. AI mode asks Claude for the meaning in that line, at a chosen CEFR level.",
      "The card renders in a closed shadow DOM. The API key stays in the service worker and is covered by tests that refuse a build with an embedded key.",
      "Saved words, CSV export, no account. Two hundred and thirty-seven unit tests across twenty-two files.",
    ],
    stack: ["TypeScript", "React", "Vite", "Manifest V3", "Tailwind CSS", "Claude", "Vitest"],
    repo: `${gh}/subtitle-vocab-explainer`,
    reel: true,
    group: "selected",
    note: "The README's status is implementation, typecheck, and tests. A hands-on pass in Chrome is still listed before any store listing. Load it unpacked from the repo.",
    shots: [
      {
        src: "/work/subtitle-vocab-explainer/onboarding.webp",
        alt: "Subtitle Vocab Explainer onboarding: turn on captions, click a word, and optionally add an API key.",
        width: 680,
        height: 480,
        caption: "Onboarding. Three steps, then back to the video.",
      },
      {
        src: "/work/subtitle-vocab-explainer/popup.webp",
        alt: "Extension popup with language level, dictionary or AI mode, and smart pause.",
        width: 380,
        height: 340,
        caption: "Popup. Level, mode, and smart pause.",
      },
    ],
  },
  {
    slug: "online-chalisa",
    title: "Online Chalisa",
    kicker: "Multilingual reader",
    year: "2026",
    summary:
      "A reader for Hindu devotional texts in six languages, with verse-synced audio, offline transliteration, and a daily reading streak.",
    problem:
      "The texts are easy to find as scans and PDFs, and awkward to actually read: mixed scripts, no verse-level audio, and pages that were not designed for a phone.",
    role: "Design and engineering, with Aman Sharma.",
    with: "Aman Sharma",
    highlights: [
      "Chalisas, aartis, and paath stored as structured JSON, not as page images.",
      "Six locales: English, Hindi, Bengali, Telugu, Tamil, and Kannada. English lives at the root. Untranslated pages fall back to English instead of redirecting away.",
      "Devanagari is transliterated offline to Telugu, Tamil, Kannada, Bengali, and IAST, including Tamil's missing consonants. No runtime dictionary service.",
      "A script builds one ElevenLabs clip per verse, joins them with ffmpeg, and writes timestamps so the reader can highlight along.",
      "Reading streak, reader controls, WhatsApp share, sankalp page, generated sitemap, per-page Open Graph images, and a custom 404. Server-rendered on Cloudflare Workers.",
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
        alt: "Online Chalisa home page with a quiet invitation to read the Hanuman Chalisa and opening dohas in Hindi and English.",
        width: 1440,
        height: 900,
        caption: "Home. A reading room, not a feed.",
      },
      {
        src: "/work/onlinechalisa/reader.webp",
        alt: "Hanuman Chalisa reader in Devanagari with script tabs, type controls, and a verse-synced recitation player.",
        width: 1440,
        height: 900,
        caption: "Reader. Script switch, type size, and audio that follows the verse.",
      },
      {
        src: "/work/onlinechalisa/mobile.webp",
        alt: "Online Chalisa on a narrow screen, with the same reader layout stacked for a phone.",
        width: 585,
        height: 1266,
        caption: "The phone layout is the same reader, not a cut-down page.",
      },
    ],
  },
  {
    slug: "mymirro",
    title: "MyMirro",
    kicker: "AI styling app",
    year: "2025",
    summary:
      "A personal styling app: a style quiz, outfit recommendations, lookbooks, and a cart. Live at mymirro.in.",
    problem:
      "The product had to turn a style quiz into outfits, similar looks, and a path to the product, without the interface feeling like a catalogue search.",
    role: "Frontend on a small team. The work below is the part covered by his commits.",
    with: "Aditya Pratap Singh and Sanket Singh",
    highlights: [
      "The style-quiz flow, including the newer onboarding.",
      "Looks and outfit pages, and routing for a single piece inside an outfit.",
      "Lookbooks: create, rename, and a public or private setting.",
      "The recommendations UI, backed by API routes that proxy the recommendation service.",
      "Cart and product pages, client-side image caching, and analytics wiring for the storefront.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Framer Motion", "Vercel"],
    repo: `${gh}/mymirrowebsite`,
    live: "https://www.mymirro.in",
    liveLabel: "mymirro.in",
    reel: true,
    group: "selected",
    note: "A team product. The screenshots are the live app, including the product's own marketing lines.",
    shots: [
      {
        src: "/work/mymirro/home.webp",
        alt: "MyMirro home page with the style-quiz invitation and outfit photography.",
        width: 1440,
        height: 900,
        caption: "Home. The quiz is the way in.",
      },
      {
        src: "/work/mymirro/style-quiz.webp",
        alt: "MyMirro style quiz on a phone, asking for a name, gender, age, and occupation.",
        width: 585,
        height: 1266,
        caption: "Style quiz. One step, large targets, a visible progress bar.",
      },
      {
        src: "/work/mymirro/home-mobile.webp",
        alt: "MyMirro home page composed for a narrow screen.",
        width: 585,
        height: 1266,
        caption: "Home on a phone.",
      },
    ],
  },
  {
    slug: "mymirro-labs",
    title: "MyMirro Labs",
    kicker: "B2B marketing site",
    year: "2025",
    summary:
      "A marketing site for a B2B fashion-commerce platform: home, five solution pillars, about, FAQ, and a contact form that sends mail.",
    problem:
      "The platform needed a public explanation of five products that share one system, with a way to ask for a demo that actually arrives.",
    role: "Design and engineering of the site.",
    highlights: [
      "App Router pages for Home, About, FAQ, Contact, and pillars: AI Styling, Catalog Intelligence, Personalized Shopping, Omnichannel, and Phygital.",
      "Shared sections: hero, pillar cards, how it works, value, proof, and a closing call to action.",
      "Framer Motion for the section motion, kept secondary to the type.",
      "The contact form posts to a route handler that sends through Resend.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Resend", "Vercel"],
    repo: `${gh}/MyMirroLabs`,
    live: "https://my-mirro-labs.vercel.app",
    liveLabel: "Live site",
    reel: false,
    group: "selected",
    shots: [
      {
        src: "/work/mymirro-labs/home.webp",
        alt: "MyMirro Labs homepage with a large headline about AI-powered fashion commerce and a demo button.",
        width: 1440,
        height: 900,
        caption: "Home. One claim, one action.",
      },
      {
        src: "/work/mymirro-labs/pillar-ai-styling.webp",
        alt: "AI styling pillar page with a headline, a short explanation, and a two-column what-it-is section.",
        width: 1440,
        height: 900,
        caption: "A pillar page. The same section system, a different argument.",
      },
    ],
  },
  {
    slug: "mymirro-backend",
    title: "MyMirro recommendation API",
    kicker: "Embeddings and outfits",
    year: "2025",
    summary:
      "The API behind the styling app: outfit generation, similar outfits and products via FAISS, and colour recommendations from a selfie or a skin-tone hex.",
    problem:
      "The interface can only be as specific as the service behind it. Outfits need compatibility rules, similarity needs embeddings, and colour advice needs a face, not a guess from the product photo.",
    role: "API engineering, with Mayank Lakhani.",
    with: "Mayank Lakhani",
    highlights: [
      "Outfit generation from the catalogue and saved preferences, with compatibility rules.",
      "Similar outfits scored with sentence-transformer embeddings and a FAISS index across style, colour, formality, and pattern.",
      "Similar products in the same category, weighted by style, colour, and price preference.",
      "Skin-tone analysis with OpenCV, a Fitzpatrick type, and colour notes by category, plus a short reason on each recommendation.",
      "Embeddings are precomputed so the Railway process can start without rebuilding the index.",
    ],
    stack: ["Python", "Flask", "Flask-RESTX", "FAISS", "sentence-transformers", "OpenCV", "Supabase", "Docker", "Railway"],
    repo: `${gh}/mymirro-backend`,
    reel: false,
    group: "selected",
    note: "No product screenshot in the source set. The plate on this page is a map of the service, not a capture of a UI.",
    shots: [],
  },
  {
    slug: "color-analysis",
    title: "Colour analysis API",
    kicker: "Computer vision",
    year: "2025",
    summary:
      "Upload a face photo. The API returns undertone, contrast, the extracted skin colour, and a palette with a reason on each colour.",
    problem:
      "Colour advice that starts from a picked swatch ignores the face in front of the camera. The useful output is a small set of decisions, with a reason, not a histogram.",
    role: "API design and engineering.",
    highlights: [
      "Face detection and 68-point landmarks with dlib. Skin region with OpenCV.",
      "Dominant skin colour by k-means, then a classification for undertone (warm or cool) and contrast (low, medium, or high).",
      "Palette recommendations with a written reason per colour.",
      "POST /analyze, a health check, Swagger, a small test page, Docker, and a Railway config.",
    ],
    stack: ["Python", "Flask", "OpenCV", "dlib", "scikit-learn", "Docker"],
    repo: `${gh}/color-analysis`,
    reel: false,
    group: "selected",
    note: "No interface capture ships with the repo notes used here. This page does not invent a sample analysis.",
    shots: [],
  },
  {
    slug: "momogpt",
    title: "momoGPT",
    kicker: "Style, not a persona file",
    year: "2026",
    summary:
      "A chatbot that reads a WhatsApp export and replies in that person's vocabulary, emoji habits, message length, and punctuation.",
    problem:
      "A system prompt that says 'be casual' is not a texting style. The measurable parts are short: which words repeat, how long a message is, which emoji actually show up.",
    role: "Design and engineering.",
    highlights: [
      "A parser for common WhatsApp export formats, multi-line messages, and system lines, grouped by sender.",
      "An analyzer writes personality.json and a generated system prompt: signature phrases, emoji, punctuation, laughter, topics, response shape.",
      "Several exports can be merged when the same person appears under different names.",
      "Backends: OpenAI, Anthropic, or a free path that tries Ollama, then Groq, then OpenRouter. Terminal chat and a Flask web UI.",
    ],
    stack: ["Python", "Flask", "pandas", "OpenAI", "Anthropic", "Ollama", "Groq"],
    repo: `${gh}/momoGPT`,
    reel: false,
    group: "selected",
    note: "The screenshot is the bundled example persona, with replies stubbed. Real exports are gitignored. Only train on chats you have permission to use.",
    shots: [
      {
        src: "/work/momogpt/chat.webp",
        alt: "momoGPT web chat with the example persona replying in short, emoji-heavy messages.",
        width: 1280,
        height: 800,
        caption: "Web UI, example persona. Not a real chat export.",
      },
    ],
  },
  {
    slug: "todo-app",
    title: "Todo app",
    kicker: "Early full-stack study",
    year: "2021",
    summary: "A task manager with sign-up, drag-and-drop lists, and an admin view. Vue on the front, Express and SQLite behind it.",
    problem: "A first pass at auth, persistence, and a board you can reorder, built to learn the seams between a SPA and an API.",
    role: "Design and engineering. A learning project.",
    highlights: [
      "Register, log in, and a forgot-password screen. JWT on an Express API, passwords hashed with bcrypt.",
      "Tasks added, edited, and reordered with vuedraggable, plus a status board.",
      "An admin registration path and an admin page. SQLite for persistence.",
    ],
    stack: ["Vue 2", "Vuex", "Vue Router", "Express", "JWT", "SQLite"],
    repo: `${gh}/Todo-app`,
    reel: false,
    group: "study",
    shots: [],
  },
  {
    slug: "rete-calculator",
    title: "Rete calculator",
    kicker: "Node editor",
    year: "2021",
    summary: "A visual calculator: drop number and operator nodes on a canvas, wire them, and watch the result update.",
    problem: "A study in node editors. The question was how far Rete.js could go with a small, honest interaction instead of a diagram that only looks interactive.",
    role: "Design and engineering. A learning project.",
    highlights: [
      "Custom Rete components and a Vue number control.",
      "Plugins for connections, zoom and pan, the context menu, comments, undo and redo, and connection mastery.",
    ],
    stack: ["Vue 2", "Rete.js", "Vuex", "Vue Router"],
    repo: `${gh}/rete-calculator`,
    reel: false,
    group: "study",
    shots: [],
  },
  {
    slug: "blog-spa",
    title: "Blog SPA",
    kicker: "Early Vue study",
    year: "2021",
    summary: "A blog front end: a home page, a paginated list, a post, an author view, a contact page, and an add-post form, over a public REST API.",
    problem: "Practice in routing, shared state, and pagination against an API he did not control.",
    role: "Design and engineering. A learning project.",
    highlights: [
      "Vuex for the post list and the form.",
      "Pagination over JSONPlaceholder. The original scaffold text mentioned Firebase; the code talks to the REST API.",
    ],
    stack: ["Vue 2", "Vuex", "Vue Router", "Tailwind CSS"],
    repo: `${gh}/blogpost`,
    reel: false,
    group: "study",
    shots: [],
  },
  {
    slug: "countries-table",
    title: "Countries table",
    kicker: "Early Vue study",
    year: "2021",
    summary: "A sortable, paginated table of countries from the REST Countries API. A row expands to list languages.",
    problem: "A small study in tables: sort, page, and show the rest of a record without leaving the list.",
    role: "Design and engineering. A learning project.",
    highlights: [
      "Fetches countries and renders a paginated table.",
      "Sortable columns. An expanded row shows every language.",
    ],
    stack: ["Vue 2", "axios"],
    repo: `${gh}/Countries-Pagination`,
    reel: false,
    group: "study",
    note: "The REST Countries API this called has changed since 2021. It is kept as a record of the study, not as a live demo.",
    shots: [],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function selectedProjects() {
  return projects.filter((project) => project.group === "selected");
}

export function studyProjects() {
  return projects.filter((project) => project.group === "study");
}

export function reelProjects() {
  return projects.filter((project) => project.reel);
}

export function neighbors(slug: string) {
  const list = selectedProjects();
  const index = list.findIndex((project) => project.slug === slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? list[index - 1] : undefined,
    next: index < list.length - 1 ? list[index + 1] : undefined,
  };
}
