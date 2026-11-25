import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { absUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/work", "/design-system", "/about", "/contact", "/resume", ...projects.map((project) => `/work/${project.slug}`)];
  return paths.map((path) => ({
    url: absUrl(path),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path.startsWith("/work/") ? 0.7 : 0.8,
  }));
}
