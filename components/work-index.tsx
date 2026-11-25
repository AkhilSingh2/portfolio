"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/lib/projects";

export function WorkIndex({
  projects,
  labelledBy,
}: {
  projects: Project[];
  labelledBy: string;
}) {
  const [active, setActive] = useState(0);
  const current = projects[active];
  const shot = current?.shots[0];

  return (
    <div className="work-index">
      <ol aria-labelledby={labelledBy}>
        {projects.map((project, index) => (
          <li key={project.slug} className={index === active ? "is-active" : undefined}>
            <Link
              href={`/work/${project.slug}`}
              transitionTypes={["nav-forward"]}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              <span className="work-num">{String(index + 1).padStart(2, "0")}</span>
              <span className="work-title">
                {project.title}
                <span className="work-kicker">{project.kicker}</span>
              </span>
              <span className="work-year">{project.year}</span>
            </Link>
          </li>
        ))}
      </ol>
      <aside className="work-preview">
        {shot ? (
          <Image src={shot.src} alt="" width={shot.width} height={shot.height} sizes="(min-width: 960px) 38vw, 100vw" />
        ) : (
          <div className="plate">
            <p className="eyebrow">{current?.kicker}</p>
            <p>{current?.title}</p>
            <p className="plate-note">No interface capture</p>
          </div>
        )}
        <p>{current?.summary}</p>
      </aside>
    </div>
  );
}
