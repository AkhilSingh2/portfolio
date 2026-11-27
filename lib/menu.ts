import { getProject, projects, type Project } from "@/lib/projects";

const groups = [
  { id: "ai", label: "AI", slugs: ["docmind", "meeting-actions", "laa-pi", "momogpt", "cadence", "mymirro"] },
  { id: "saas", label: "SaaS and realtime", slugs: ["launchpad", "tandem", "pulse", "buzzroom"] },
  { id: "mobile", label: "Mobile", slugs: ["spendsense"] },
  {
    id: "utility",
    label: "Utility tools",
    slugs: ["devkit", "india-salary-tax", "cgpa-upi", "subtitle-vocab-explainer"],
  },
  { id: "open", label: "Open source and Devotional", slugs: ["kinetic", "online-chalisa"] },
  { id: "systems", label: "Design systems", slugs: ["sutra-ui"] },
  { id: "backend", label: "Backend and APIs", slugs: ["mymirro-recommendation-api", "colour-analysis-api"] },
  {
    id: "professional",
    label: "Professional work",
    slugs: [
      "ai-asset-platform",
      "media-composition",
      "localisation-pipeline",
      "finance-platform",
      "cloud-infrastructure",
      "amplify-accounts",
      "marketing-site",
    ],
  },
] as const;

export type WorkGroup = { id: string; label: string; projects: Project[] };

export function workGroups(): WorkGroup[] {
  const used = new Set<string>();
  const result = groups.map((group) => ({
    id: group.id,
    label: group.label,
    projects: group.slugs.map((slug) => {
      const project = getProject(slug);
      if (!project) throw new Error(`Missing project ${slug}`);
      used.add(slug);
      return project;
    }),
  }));
  const missing = projects.filter((project) => !used.has(project.slug)).map((project) => project.slug);
  if (missing.length) throw new Error(`Ungrouped projects: ${missing.join(", ")}`);
  return result;
}

const liveOrder = ["india-salary-tax", "cgpa-upi", "devkit", "online-chalisa"] as const;

export function liveTools(): Project[] {
  return liveOrder.map((slug) => {
    const project = getProject(slug);
    if (!project?.live) throw new Error(`Missing live tool ${slug}`);
    return project;
  });
}

export function featuredProject(): Project {
  const project = getProject("kinetic");
  if (!project) throw new Error("Missing featured project");
  return project;
}
