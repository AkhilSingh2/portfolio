export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

/** Prefix a public-folder path so GitHub Pages (/portfolio) and Vercel (/) both resolve. */
export function asset(path: string) {
  if (!path || path.startsWith("http") || path.startsWith("mailto:") || path.startsWith("data:")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

function trimSlash(url: string) {
  return url.replace(/\/$/, "");
}

/**
 * Public site origin, including the GitHub Pages base path when one is set.
 * Set NEXT_PUBLIC_SITE_URL in production so canonicals match the real domain.
 */
export const siteUrl = trimSlash(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (basePath ? `https://akhilsingh2.github.io${basePath}` : "http://localhost:3000"),
);

export function absUrl(path = "/") {
  if (path === "/" || path === "") return `${siteUrl}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (/\.[a-z0-9]+$/i.test(normalized)) return `${siteUrl}${normalized}`;
  return `${siteUrl}${normalized.endsWith("/") ? normalized : `${normalized}/`}`;
}

export const person = {
  name: "Akhilendra Singh",
  role: "Full-stack engineer, frontend-first",
  location: "Bangalore, India",
  locality: "Bangalore",
  country: "IN",
  email: "akhisingh2211@gmail.com",
  linkedin: "https://www.linkedin.com/in/akhilendra22/",
  github: "https://github.com/AkhilSingh2",
  availability: "Open to senior frontend and full-stack roles",
  description:
    "Full-stack engineer, frontend-first, in Bangalore. Design through delivery: React, Next.js, TypeScript, Vue, Python, and AI-powered products.",
} as const;
