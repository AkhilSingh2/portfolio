import fs from "fs";
import path from "path";
import { resumeFilename as resumeName } from "@/lib/resume-file";

const publicDir = path.join(process.cwd(), "public");

const portraitNames = ["portrait.webp", "portrait.jpg", "portrait.jpeg", "portrait.png"] as const;

export type PortraitSource = {
  src: string;
  width: number;
  height: number;
  candidates: { src: string; width: number }[];
};

function exists(name: string) {
  return fs.existsSync(path.join(publicDir, name));
}

/** The committed headshot, then any older portrait file. Null keeps the monogram. */
export function getPortraitSource(): PortraitSource | null {
  if (exists("headshot.webp")) {
    const candidates = exists("headshot_400.webp") ? [{ src: "/headshot_400.webp", width: 400 }] : [];
    candidates.push({ src: "/headshot.webp", width: 800 });
    return { src: "/headshot.webp", width: 800, height: 800, candidates };
  }
  for (const name of portraitNames) {
    if (exists(name)) {
      return { src: `/${name}`, width: 800, height: 800, candidates: [{ src: `/${name}`, width: 800 }] };
    }
  }
  return null;
}

export function getResumeHref(): string | null {
  if (fs.existsSync(path.join(publicDir, resumeName))) return `/${resumeName}`;
  return null;
}

export const resumeFilename = resumeName;
