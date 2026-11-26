import { getProject, type Project } from "@/lib/projects";

export type ThreadChapter = {
  id: string;
  label: string;
  title: string;
  accent: string;
  intro: string;
  projects: Project[];
  signature?: boolean;
};

const chapters: { id: string; label: string; title: string; accent: string; intro: string; slugs: string[]; signature?: boolean }[] = [
  {
    id: "tap",
    label: "Tap",
    title: "One tap, carried",
    accent: "end to end",
    intro: "I start at the screen and stay with it through the interface, the wire, the model, and the release.",
    slugs: [],
  },
  {
    id: "surface",
    label: "Surface",
    title: "The thread",
    accent: "weaves the interface",
    intro: "Motion, a reading room, and a system for the tools. The outline draws first. Then the real screen.",
    slugs: ["kinetic", "online-chalisa", "sutra-ui"],
  },
  {
    id: "signal",
    label: "Signal",
    title: "Then it",
    accent: "splits, and stays in sync",
    intro: "Two cursors on one board, a room full of phones, and the API that dresses an outfit.",
    slugs: ["tandem", "buzzroom", "mymirro-recommendation-api"],
  },
  {
    id: "engine",
    label: "Engine",
    title: "It passes through",
    accent: "the model",
    intro: "A cited answer, the decisions from a transcript, and the chart of what happened.",
    slugs: ["docmind", "meeting-actions", "pulse"],
  },
  {
    id: "scale",
    label: "Scale",
    title: "Then it",
    accent: "multiplies",
    intro: "Anonymised studies from a games and media company. Composition, locales, and a faster first view.",
    slugs: ["media-composition", "localisation-pipeline", "marketing-site"],
  },
  {
    id: "return",
    label: "Return",
    title: "The answer",
    accent: "comes back up",
    intro: "A launch, from the first click to the plan written on the server. The thread ties off here.",
    slugs: ["launchpad"],
    signature: true,
  },
];

export function threadChapters(): ThreadChapter[] {
  return chapters.map((chapter) => ({
    id: chapter.id,
    label: chapter.label,
    title: chapter.title,
    accent: chapter.accent,
    intro: chapter.intro,
    signature: chapter.signature,
    projects: chapter.slugs.map((slug) => {
      const project = getProject(slug);
      if (!project) throw new Error(`Missing thread project ${slug}`);
      return project;
    }),
  }));
}
