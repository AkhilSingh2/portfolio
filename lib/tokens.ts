/** Names of the CSS variables in app/globals.css. Swatches read the live values. */

export const philosophy = [
  {
    title: "Hierarchy is the design",
    body: "If the type scale is doing its job, the page needs fewer boxes. Size, weight, and space create the order. Extra chrome shows up only when that order is still unclear.",
  },
  {
    title: "Color is a signal",
    body: "Ink and bone carry almost every surface. Ember is the one fire: a mark, a link, a focus ring, a control that can be used. If ember is everywhere, it is nowhere.",
  },
  {
    title: "Motion hands off",
    body: "A transition explains where you are going. A frame opens, a section yields, a shared image arrives on the next page. Motion does not loop to ask for attention. When the system asks for less motion, the content is simply there.",
  },
  {
    title: "The system is the artifact",
    body: "Tokens are CSS variables. The buttons, tags, and tiles on this page are the ones in the navigation and the case studies. A gallery that drifts from the product is a poster, not a system.",
  },
  {
    title: "Finish the quiet states",
    body: "Focus, empty, error, a small screen, reduced motion, a 404. A product that only has a hero is a poster too.",
  },
] as const;

export const colors = [
  { name: "Ink 950", variable: "--ink-950", role: "Night canvas, header, footer" },
  { name: "Ink 900", variable: "--ink-900", role: "Raised night surface" },
  { name: "Ink 800", variable: "--ink-800", role: "Inset panels on ink" },
  { name: "Ink 700", variable: "--ink-700", role: "Hairline on ink, strong" },
  { name: "Bone 50", variable: "--bone-50", role: "Paper sections, solid button" },
  { name: "Bone 100", variable: "--bone-100", role: "Paper inset" },
  { name: "Bone 200", variable: "--bone-200", role: "Paper rule, pressed" },
  { name: "Ink text", variable: "--ink-text", role: "Body text on bone" },
  { name: "Ash", variable: "--muted", role: "Secondary text, switches with theme" },
  { name: "Ember 500", variable: "--ember-500", role: "Signal fill, progress, mark" },
  { name: "Ember text", variable: "--ember-text", role: "Links. Lighter on ink, deeper on bone" },
  { name: "Sage 500", variable: "--sage-500", role: "Quiet secondary, rarely used" },
  { name: "Gold 400", variable: "--gold-400", role: "Reserved metal, not a second brand color" },
] as const;

export const typeSteps = [
  { name: "Meta", variable: "--t-0", sample: "Bangalore · 2026", specimen: "meta" },
  { name: "Small", variable: "--t-1", sample: "Secondary labels and captions", specimen: "sans" },
  { name: "Body", variable: "--t-2", sample: "The reading size for paragraphs and lists.", specimen: "sans" },
  { name: "Lead", variable: "--t-3", sample: "A short introduction under a title.", specimen: "sans" },
  { name: "Title 4", variable: "--t-4", sample: "Section titles on a small screen", specimen: "display" },
  { name: "Title 3", variable: "--t-5", sample: "Card and group titles", specimen: "display" },
  { name: "Title 2", variable: "--t-6", sample: "A section heading", specimen: "display" },
  { name: "Title 1", variable: "--t-7", sample: "Page title", specimen: "display" },
  { name: "Display", variable: "--t-8", sample: "Statement", specimen: "display" },
] as const;

export const spaces = [
  { name: "1", variable: "--space-1" },
  { name: "2", variable: "--space-2" },
  { name: "3", variable: "--space-3" },
  { name: "4", variable: "--space-4" },
  { name: "5", variable: "--space-5" },
  { name: "6", variable: "--space-6" },
  { name: "7", variable: "--space-7" },
  { name: "8", variable: "--space-8" },
  { name: "9", variable: "--space-9" },
  { name: "10", variable: "--space-10" },
] as const;

export const radii = [
  { name: "Sharp", variable: "--radius-0", note: "Buttons, cards, frames. The default." },
  { name: "Hair", variable: "--radius-1", note: "A 2px nick, almost never." },
  { name: "Soft", variable: "--radius-2", note: "Menus, if a corner is required." },
] as const;

export const elevations = [
  { name: "Flat", variable: "--elev-0", note: "A hairline. Most surfaces stop here." },
  { name: "Raised", variable: "--elev-1", note: "The mobile menu and a preview." },
  { name: "Deep", variable: "--elev-2", note: "One overlay. Depth is mostly tone, not blur." },
] as const;

export const motions = [
  { name: "Micro", variable: "--dur-1", ms: 120, note: "Hover color, focus." },
  { name: "UI", variable: "--dur-2", ms: 240, note: "Buttons, menus." },
  { name: "Section", variable: "--dur-3", ms: 480, note: "Page handoff." },
  { name: "Cinematic", variable: "--dur-4", ms: 800, note: "A scrubbed reveal, not a loop." },
] as const;

export const easings = [
  { name: "Out", variable: "--ease-out", css: "cubic-bezier(0.16, 1, 0.3, 1)" },
  { name: "In out", variable: "--ease-in-out", css: "cubic-bezier(0.65, 0, 0.35, 1)" },
  { name: "Standard", variable: "--ease-standard", css: "cubic-bezier(0.2, 0, 0, 1)" },
] as const;

export const skillGroups = [
  {
    title: "Frontend",
    items: [
      "React",
      "Next.js",
      "Vue.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Astro",
      "Storybook",
      "Electron.js",
      "Design systems",
      "Figma",
    ],
  },
  {
    title: "Backend and APIs",
    items: [
      "Python",
      "FastAPI",
      "Flask",
      "Node.js",
      "Express",
      "PostgreSQL",
      "MongoDB",
      "SQLite",
      "Supabase",
      "REST",
      "Celery",
      "SQS",
      "Strapi",
    ],
  },
  {
    title: "Cloud and DevOps",
    items: [
      "AWS",
      "S3",
      "ECR",
      "RDS",
      "IAM",
      "Amplify",
      "Docker",
      "Kubernetes",
      "Helm",
      "Terraform",
      "GitHub Actions",
      "Vercel",
      "Cloudflare Workers",
      "Railway",
    ],
  },
  {
    title: "AI",
    items: [
      "Claude",
      "Gemini",
      "Prompting",
      "RAG",
      "Embeddings",
      "FAISS",
      "CLIP",
      "FFmpeg",
    ],
  },
  {
    title: "Quality",
    items: ["Biome", "ESLint", "Ruff", "pytest", "Vitest", "Sentry", "SonarQube", "Monorepos"],
  },
] as const;
