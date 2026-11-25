"use client";

import Link from "next/link";
import { Media } from "@/components/media";
import type { Project } from "@/lib/projects";

export function WorkIndex({ projects, labelledBy }: { projects: Project[]; labelledBy: string }) {
  return (
    <div className="tilt-grid">
      <ol aria-labelledby={labelledBy}>
        {projects.map((project, index) => {
          const shot = project.shots[0];
          return (
            <li key={project.slug}>
              <Link
                href={`/work/${project.slug}`}
                className="tilt-card"
                onPointerMove={(event) => {
                  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                  if (!window.matchMedia("(pointer: fine)").matches) return;
                  const card = event.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const px = (event.clientX - rect.left) / rect.width - 0.5;
                  const py = (event.clientY - rect.top) / rect.height - 0.5;
                  card.style.transform = `rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
                }}
                onPointerLeave={(event) => {
                  event.currentTarget.style.transform = "";
                }}
              >
                <span className="work-num">{String(index + 1).padStart(2, "0")}</span>
                {shot ? (
                  <span className="tilt-media">
                    <Media src={shot.src} alt="" width={shot.width} height={shot.height} />
                  </span>
                ) : null}
                <span className="work-title">
                  {project.title}
                  <span className="work-kicker">{project.kicker}</span>
                </span>
                {project.tags && project.tags.length > 0 ? (
                  <span className="stack-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </span>
                ) : null}
                <span className="work-year">{project.year}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
