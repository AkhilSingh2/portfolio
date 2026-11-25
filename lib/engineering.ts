export const stackTags = ["Frontend", "Backend", "Data", "Infra", "AI"] as const;

export type StackTag = (typeof stackTags)[number];

export type ApiEndpoint = {
  method: string;
  path: string;
  purpose: string;
};

export type Engineering = {
  heading: "Backend" | "Engineering";
  summary: string;
  flow?: string[];
  endpoints?: ApiEndpoint[];
  examples?: { label: string; code: string }[];
  points: string[];
};

export const projectTags: Record<string, StackTag[]> = {
  kinetic: ["Frontend"],
  docmind: ["Frontend", "Backend", "Data", "AI"],
  launchpad: ["Frontend", "Backend", "Data", "Infra"],
  tandem: ["Frontend", "Backend", "Data"],
  pulse: ["Frontend", "Backend", "Data"],
  "online-chalisa": ["Frontend", "Infra"],
  spendsense: ["Frontend", "Data"],
  "laa-pi": ["Frontend", "Backend", "Data", "AI", "Infra"],
  "subtitle-vocab-explainer": ["Frontend", "AI"],
  "sutra-ui": ["Frontend"],
  devkit: ["Frontend"],
  "meeting-actions": ["Frontend", "Backend", "AI"],
  "india-salary-tax": ["Frontend", "Data"],
  "cgpa-upi": ["Frontend"],
  mymirro: ["Frontend", "Data"],
  momogpt: ["Frontend", "Backend", "AI"],
  "mymirro-recommendation-api": ["Backend", "Data", "AI", "Infra"],
  "colour-analysis-api": ["Backend", "AI", "Infra"],
  "ai-asset-platform": ["Frontend", "Backend", "AI", "Infra"],
  "media-composition": ["Backend", "Infra"],
  "localisation-pipeline": ["Frontend", "Backend", "AI"],
  "finance-platform": ["Frontend", "Backend"],
  "cloud-infrastructure": ["Infra"],
  "marketing-site": ["Frontend", "Backend"],
};

export const engineeringNotes: Record<string, Engineering> = {
  kinetic: {
    heading: "Engineering",
    summary:
      "Lyra is a static Vite site. There is no API server. The headphone is a React Three Fiber scene, and the scroll film is GSAP.",
    points: [
      "package.json builds with tsc and Vite, and the test script is Playwright.",
      "tests/smoke.spec.ts is the browser smoke test.",
      "The hero canvas imports @react-three/fiber. Scroll reveals import GSAP ScrollTrigger.",
      "Nothing in the repo listens for HTTP routes.",
    ],
  },
  docmind: {
    heading: "Backend",
    summary:
      "Next.js route handlers sit beside the UI. The store is selected at runtime. Postgres, when used, goes through Drizzle, and the schema includes a vector column.",
    flow: ["Browser", "Route handlers", "Store", "Postgres or the local store"],
    endpoints: [
      { method: "POST", path: "/api/chat", purpose: "Answer a question from messages, optionally limited to document ids." },
      { method: "GET", path: "/api/documents", purpose: "List document summaries." },
      { method: "POST", path: "/api/documents", purpose: "Add a file, note, or public URL." },
      { method: "GET", path: "/api/documents/:id", purpose: "Read one document." },
      { method: "POST", path: "/api/documents/restore", purpose: "Restore documents." },
      { method: "GET", path: "/api/session", purpose: "Read the session." },
      { method: "POST", path: "/api/session", purpose: "Write the session." },
      { method: "GET", path: "/api/health", purpose: "Health check." },
    ],
    examples: [
      {
        label: "Chat body",
        code: '{ "messages": [{ "role": "user", "content": "…" }], "documentIds": ["…"] }',
      },
    ],
    points: [
      "POST /api/chat returns 400 with “Write a question first.” when the latest user text is empty.",
      "A multipart upload over 4 MB is rejected. PDF text is extracted in the handler. Other accepted types are Markdown and text.",
      "If llmProvider is mock, the handler calls mockChatResponse. Otherwise it calls liveChatResponse.",
      "lib/db/schema.ts imports pgvector’s vector type. lib/store/pg.ts uses Drizzle cosineDistance.",
      "docker-compose.yml is in the repo for the database.",
    ],
  },
  launchpad: {
    heading: "Backend",
    summary:
      "LaunchPad’s data lives in Postgres through Drizzle. Sessions use better-auth’s Drizzle adapter. Stripe is optional and stays off until it is configured.",
    flow: ["Next.js app", "Drizzle", "Postgres", "Stripe webhook when configured"],
    endpoints: [
      { method: "GET", path: "/api/health", purpose: "Runs select 1. Returns ok true, or ok false with 503." },
      { method: "POST", path: "/api/stripe/webhook", purpose: "Verifies a Stripe signature and stores a billing event." },
      { method: "ALL", path: "/api/auth/[...all]", purpose: "better-auth catch-all." },
    ],
    examples: [
      {
        label: "Webhook without Stripe",
        code: '{ "error": "Stripe is not configured." }',
      },
    ],
    points: [
      "Organisations store stripe_customer_id and stripe_subscription_id.",
      "The webhook returns 400 when the stripe-signature header is missing, and 400 again when constructEvent throws.",
      "Handled event types in the route are checkout.session.completed, customer.subscription.updated, and customer.subscription.deleted. Anything else is ignored.",
      "The seed writes stub Stripe ids, not live ones.",
    ],
  },
  tandem: {
    heading: "Backend",
    summary:
      "The Next.js app is the client. A separate Hocuspocus process owns the websocket and the document snapshots.",
    flow: ["Browser Y.Doc", "Hocuspocus websocket", "SQLite or Postgres"],
    endpoints: [
      { method: "GET", path: "/health", purpose: "JSON ok true, service tandem-ws, and the store kind." },
      { method: "GET", path: "/healthz", purpose: "Same health payload." },
      { method: "WS", path: "websocket", purpose: "Yjs sync for a room id." },
    ],
    points: [
      "The default listen port is 1234, overridable with WS_PORT. The host defaults to 0.0.0.0.",
      "onLoadDocument throws if the room id fails isRoomId.",
      "Snapshots are stored in a documents table: name, snapshot, updated_at. SQLite uses WAL. Postgres is the other store kind.",
      "The client connects with HocuspocusProvider and a websocket URL from websocketUrl().",
      "deploy/Dockerfile is the server image.",
    ],
  },
  pulse: {
    heading: "Backend",
    summary:
      "Events enter through one Next.js route, are validated with Zod, and are written to Postgres. Rollups run in the same transaction as the insert.",
    flow: ["SDK", "POST /api/ingest", "Postgres", "Rollups"],
    endpoints: [
      { method: "POST", path: "/api/ingest", purpose: "Accept a batch for the project that owns the API key." },
      { method: "GET", path: "/api/ingest", purpose: "Describe the POST shape and the rate limit." },
      { method: "OPTIONS", path: "/api/ingest", purpose: "CORS preflight." },
    ],
    examples: [
      {
        label: "Ingest body",
        code: '{ "events": [{ "name": "signup", "anonymousId": "anon-1234", "sessionId": "sess-1234" }] }',
      },
      {
        label: "Ingest result",
        code: '{ "accepted": 1, "duplicates": 0 }',
      },
    ],
    points: [
      "The key is a Bearer token or the X-Api-Key header. Missing and unknown keys return 401.",
      "events must contain 1 to 100 items. An empty batch fails validation.",
      "A body over 300,000 bytes returns 413. The limiter allows a burst of 600 and refills 10 per second. A limited request returns 429 with Retry-After.",
      "ingestEvents returns accepted and duplicates. Duplicates are the events that were not inserted.",
      "Dockerfile and docker-compose.yml are in the repo.",
    ],
  },
  "online-chalisa": {
    heading: "Engineering",
    summary:
      "Online Chalisa is an Astro site. Verse text and translations live in the repository. There is no application API.",
    points: [
      "package.json builds with Astro and can deploy with Wrangler.",
      "The dependency list is Astro, Tailwind, and the Cloudflare adapter. There is no database client.",
      "scripts/gen-recitation.mjs is the audio script. Playback is a file in the site, not a streaming service.",
      "Copy for six languages lives in src/i18n.",
    ],
  },
  spendsense: {
    heading: "Engineering",
    summary:
      "SpendSense keeps the ledger on the phone. expo-sqlite is the primary driver. A local driver exists when SQLite is not open. There is no backend service in this repo.",
    points: [
      "src/data/sqlite.ts imports expo-sqlite and sets kind to sqlite.",
      "src/data/persistence.ts types the driver as sqlite or local.",
      "parseExpense, money, budgets, recurring, and sync have unit tests under src.",
      "Nothing in src calls a hosted API.",
    ],
  },
  "laa-pi": {
    heading: "Backend",
    summary:
      "laa-pi is a Python app you run on your own machine. Streamlit is the UI. SQLAlchemy stores state in SQLite. Job boards are collected in-process. There is no hosted multi-tenant API in the repo.",
    flow: ["Streamlit", "Pipeline", "SQLite", "Playwright or a board API"],
    points: [
      "core/db.py builds a sqlite+pysqlite URL, in memory or on a file path.",
      "Without an AI key the matcher stays on a deterministic heuristic. With a key it can call Anthropic or an OpenAI-compatible API.",
      "engine/resume_builder.py checks every rendered string against the profile before WeasyPrint writes the PDF.",
      "Greenhouse, Lever, and Ashby are read as board APIs. LinkedIn and Naukri go through Playwright and are not auto-submitted.",
      "Dockerfile, docker-compose.yml, and railway.json are present. pytest covers the matcher, resume builder, and connectors.",
    ],
  },
  "subtitle-vocab-explainer": {
    heading: "Engineering",
    summary:
      "This is a Chrome extension. Captions are read in the page. Definitions can come from dictionaryapi.dev. An optional model call uses a key stored in chrome.storage.local. There is no server in this repo.",
    points: [
      "The manifest allows https://api.dictionaryapi.dev/* plus one API host permission.",
      "Settings are chrome.storage.sync. The API key and saved words are chrome.storage.local.",
      "Idioms ship in the extension. Lemma, cache, caption, and storage behaviour have Vitest files.",
      "The extension does not run its own database.",
    ],
  },
  "sutra-ui": {
    heading: "Engineering",
    summary:
      "Sutra UI is a pnpm workspace of tokens and React components. It publishes a stylesheet, not a service.",
    points: [
      "packages/tokens exports W3C tokens, CSS variables, and a contrastRatio function.",
      "contrast.test.ts checks light, dark, and high-contrast pairs.",
      "packages/react is tested with Vitest. The docs app is a separate package.",
      "Theme and locale are read from localStorage in the browser. There is no API route.",
    ],
  },
  devkit: {
    heading: "Engineering",
    summary:
      "DevKit is a static Next.js export. Every tool runs in the browser. A service worker caches pages you have opened. The pasted text is not uploaded.",
    points: [
      "lib/jwt, lib/json, lib/cron, lib/hash, and the other tool folders each have a Vitest file.",
      "e2e/smoke.spec.ts is Playwright. GitHub workflows ci.yml and pages.yml build and publish the site.",
      "The JWT screen decodes the token locally. The README and the decoder tests describe that path.",
      "There is no server process and no database.",
    ],
  },
  "meeting-actions": {
    heading: "Backend",
    summary:
      "Quorum extracts a meeting in a Next.js route. The default path is a heuristic over the transcript. An LLM engine is optional and only cites cue ids that exist in the text.",
    flow: ["Paste or file", "POST /api/extract", "Heuristic or LLM", "Cited meeting"],
    endpoints: [
      { method: "POST", path: "/api/extract", purpose: "Turn a transcript file or JSON body into a meeting record." },
      { method: "POST", path: "/api/export", purpose: "Export a meeting." },
      { method: "GET", path: "/api/status", purpose: "Status of the app." },
    ],
    examples: [
      {
        label: "JSON body",
        code: '{ "text": "…", "meetingDate": "2026-01-15", "engine": "auto" }',
      },
      {
        label: "Result",
        code: '{ "meeting": { "cues": [] } }',
      },
    ],
    points: [
      "A file must be .docx, .vtt, .srt, or .txt, at most 2 MB. Pasted text is capped at 200,000 characters.",
      "engine is auto, heuristic, or llm. meetingDate must be YYYY-MM-DD.",
      "The prompt tells the model to cite only cue ids that appear in the transcript.",
      "lib/env.ts defaults LLM_PROVIDER to openai when a model is used. No model is required for the heuristic path.",
    ],
  },
  "india-salary-tax": {
    heading: "Engineering",
    summary:
      "Aayam is a static calculator. Tax, salary, HRA, and the rent-receipt PDF run in the browser. There is no account and no upload.",
    points: [
      "Rules for the year live in lib/tax-rules.ts, version 2025-26.1, with the previous year still selectable.",
      "Vitest covers slab edges, the section 87A rebate, the old-regime cliff, surcharge, HRA’s three limits, CTC splits, and state professional tax.",
      "The rent-receipt PDF is built on the device. tests/pdf.test.ts covers that path.",
      "Sutra UI is vendored so CI can npm ci without cloning the design system. The site builds to a static out folder.",
    ],
  },
  "cgpa-upi": {
    heading: "Engineering",
    summary:
      "Hundredmark is two browser tools. University formulas are data in the repo. The UPI QR is built on the device and is not sent to a server.",
    points: [
      "src/lib/cgpa.ts and src/data/presets.ts hold the conversions. Each preset names the board document it quotes.",
      "src/lib/upi.ts builds a upi://pay link, checks the VPA, and omits a blank amount and note.",
      "Vitest covers VPA shapes and the link. Playwright covers the routes.",
      "Sutra UI is vendored. There is no API process.",
    ],
  },
  mymirro: {
    heading: "Engineering",
    summary:
      "The MyMirro site is a Next.js app that talks to Supabase from the browser for auth, outfits, and products. The recommendation service is a separate repository.",
    flow: ["Next.js", "Supabase client", "Auth, outfits, products"],
    points: [
      "useAuth signs in, signs up, and signs out with supabase.auth.",
      "Outfit and product hooks query Supabase tables directly. They do not call the Flask routes.",
      "Paystack’s checkout script is a dependency for payments.",
      "The Flask API, FAISS index, and Railway process live in mymirro-backend, not in this repo.",
    ],
  },
  momogpt: {
    heading: "Backend",
    summary:
      "momoGPT’s web UI is Flask. The chat process keeps the conversation in memory and calls a model provider from the machine that runs the app.",
    endpoints: [
      { method: "GET", path: "/", purpose: "Render the chat page." },
      { method: "POST", path: "/chat", purpose: "Send one message and return the reply." },
      { method: "POST", path: "/reset", purpose: "Clear the conversation." },
      { method: "GET", path: "/history", purpose: "Return the messages held by the process." },
    ],
    examples: [
      { label: "Chat body", code: '{ "message": "…" }' },
      { label: "Chat result", code: '{ "response": "…", "success": true }' },
    ],
    points: [
      "An empty message returns 400 and { error: \"Empty message\" }.",
      "app_free.py exposes the same four routes for the free-model build.",
      "History is whatever the process still holds. The repo does not add a database.",
    ],
  },
  "mymirro-recommendation-api": {
    heading: "Backend",
    summary:
      "Flask-RESTX serves /api/v1. Swagger UI is at /swagger/ when the process is running. The repo’s Railway guide uses a placeholder host, so this study links the repository only.",
    flow: ["Client", "Flask-RESTX /api/v1", "Supabase", "FAISS index"],
    endpoints: [
      { method: "POST", path: "/api/v1/outfits/generate", purpose: "Build outfits for a user id and store them." },
      { method: "GET", path: "/api/v1/outfits/{user_id}", purpose: "List saved outfits. Query: limit, min_score, style." },
      { method: "GET", path: "/api/v1/outfits/{outfit_id}/similar", purpose: "FAISS neighbours. Query: count." },
      { method: "POST", path: "/api/v1/products/{product_id}/similar", purpose: "Same-category products. Body: count, diverse, personalized." },
      { method: "POST", path: "/api/v1/color/analyze", purpose: "Skin tone from an image or a hex, not both." },
      { method: "POST", path: "/api/v1/color/analyze-photo", purpose: "Photo-only colour analysis." },
      { method: "POST", path: "/api/v1/color/analyze-hex", purpose: "Hex-only colour analysis." },
      { method: "GET", path: "/api/v1/health", purpose: "Status plus which optional services imported." },
      { method: "GET", path: "/api/v1/utils/warmup", purpose: "Load the similarity models." },
    ],
    examples: [
      { label: "Generate", code: '{ "user_id": 2, "regenerate": false }' },
      { label: "Colour, one field", code: '{ "hex_color": "#FDB4A6" }' },
    ],
    points: [
      "Generate returns success, message, user_id, outfits_count, generation_time_seconds, and data_source. The stored outfit includes top, bottom, score, and why_picked_explanation.",
      "If FAISS and sentence-transformers did not import, generate and the outfit list return 503.",
      "Colour analyze returns 400 when the body has neither image nor hex_color, and 400 when it has both.",
      "On Railway the generate handler sets OMP, MKL, NUMEXPR, and OPENBLAS thread counts to 2 for that call, then restores them.",
      "Debug and test namespaces exist in the code. They are not part of the product surface described here.",
    ],
  },
  "colour-analysis-api": {
    heading: "Backend",
    summary:
      "A Flask app finds a face, samples even-lit skin, and returns an undertone, a contrast, and a palette. Swagger UI is at /api/docs. No public base URL is committed.",
    flow: ["Base64 image", "OpenCV and dlib", "k-means", "Palette"],
    endpoints: [
      { method: "GET", path: "/", purpose: "HTML form that posts an image." },
      { method: "POST", path: "/analyze", purpose: "Read undertone, contrast, skin colours, and recommendations." },
      { method: "GET", path: "/health", purpose: "Returns status healthy." },
      { method: "GET", path: "/api/docs", purpose: "Swagger UI, reading /static/swagger.json." },
    ],
    examples: [
      { label: "Request", code: '{ "image": "<base64>" }' },
      {
        label: "Response fields",
        code: '{ "undertone": "Warm", "contrast": "Medium", "skin_colors": [{ "rgb": [], "hex": "" }], "recommended_colors": [{ "rgb": [], "hex": "", "explanation": "" }] }',
      },
    ],
    points: [
      "A body without image returns 400 and { error: \"No image data provided\" }.",
      "Undertone is the string Warm or Cool. Contrast is Low, Medium, or High. The palette table is keyed by that pair.",
      "Face landmarks use dlib’s 68-point predictor. PREDICTOR_PATH defaults to ./shape_predictor_68_face_landmarks.dat, which is not in git.",
      "Dockerfile, docker-compose.yml, and railway.json describe how to run it. The Railway doc does not name a live host.",
    ],
  },
  "ai-asset-platform": {
    heading: "Backend",
    summary:
      "Proprietary work at Kwalee. Described without code, internal names, or confidential detail. The browser talks to a Python API, and render work runs on workers.",
    flow: ["React app", "FastAPI", "SQS", "Celery workers"],
    points: [
      "A signature identifies a render or a recipe. The same signature is not queued twice.",
      "Generation waits for an approval, so compute is not spent on an unapproved batch.",
      "A retry uses the same signature and updates the existing record instead of inserting another.",
    ],
  },
  "media-composition": {
    heading: "Backend",
    summary:
      "Proprietary work at Kwalee. FFmpeg workers compose the media. Helm and KEDA scale them.",
    flow: ["Job", "Queue", "FFmpeg worker", "Stored media"],
    points: [
      "The worker covers video, GIFs, audio overrides, chroma-key, and VP9 in one pipeline.",
      "Sample rate is normalised, tracks are aligned, and a stream that ends early is treated as complete input.",
      "The fleet handles up to 20,000 tasks a day.",
    ],
  },
  "localisation-pipeline": {
    heading: "Backend",
    summary:
      "Proprietary work at Kwalee. I co-developed the ingestion and built the review frontend. The model scores translations. It does not replace the agency.",
    flow: ["Translation files", "Ingestion", "Gemini chrF", "Slack alert", "Review screen"],
    points: [
      "The pipelines cover 30+ locales.",
      "Gemini compares an agency translation with a reference and records a chrF score.",
      "A Slack alert marks a score that a person should read.",
    ],
  },
  "finance-platform": {
    heading: "Backend",
    summary:
      "Proprietary work at Kwalee. One monorepo, one revenue-recognition module, and an accounting API. The bug was a write that ran twice.",
    flow: ["React app", "FastAPI", "Recognition module", "Accounting API"],
    points: [
      "The recognition rules live in one module used by the React app and the FastAPI service.",
      "The accounting system is NetSuite, called through its API.",
      "The upsert key is the business event, not the attempt. A second delivery updates that row and does not add the amount again.",
    ],
  },
  "cloud-infrastructure": {
    heading: "Engineering",
    summary:
      "Proprietary work at Kwalee. Infrastructure is declared, and non-production is not the production account.",
    flow: ["Terraform", "Separate accounts", "ECR, RDS, S3, IAM", "Helm and KEDA"],
    points: [
      "ECR, RDS, S3, and IAM are Terraform, once per environment.",
      "Non-production and production are separate accounts. Amplify apps were moved off a legacy account.",
      "Helm and KEDA scale the media workers, up to 20,000 tasks a day.",
    ],
  },
  "marketing-site": {
    heading: "Engineering",
    summary:
      "Proprietary work at Kwalee. The public marketing site moved to Next.js and a headless CMS.",
    flow: ["Next.js", "Strapi", "Page"],
    points: [
      "Independent content requests run in parallel.",
      "Hydration is limited to the parts that change on the client.",
      "Each route ships only the bundle it uses. Page load times fell by 45%.",
    ],
  },
};
