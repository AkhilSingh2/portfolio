import fs from "fs";
import path from "path";
import { resumeFilename as resumeName } from "@/lib/resume-file";

const publicDir = path.join(process.cwd(), "public");

const portraitNames = ["portrait.webp", "portrait.jpg", "portrait.jpeg", "portrait.png"] as const;

export function getPortraitSrc(): string | null {
  for (const name of portraitNames) {
    if (fs.existsSync(path.join(publicDir, name))) return `/${name}`;
  }
  return null;
}

export function getResumeHref(): string | null {
  if (fs.existsSync(path.join(publicDir, resumeName))) return `/${resumeName}`;
  return null;
}

export const resumeFilename = resumeName;
