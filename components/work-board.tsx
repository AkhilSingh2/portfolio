"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { WorkIndex } from "@/components/work-index";
import { stackTags, type StackTag } from "@/lib/engineering";
import type { Project } from "@/lib/projects";
import { basePath } from "@/lib/site";

const filters = ["All", ...stackTags] as const;
type Filter = (typeof filters)[number];

function isFilter(value: string | null): value is Filter {
  return filters.some((item) => item === value);
}

function tagFromLocation(): Filter {
  const value = new URLSearchParams(window.location.search).get("tag");
  return isFilter(value) ? value : "All";
}

export function WorkBoard({ projects }: { projects: Project[] }) {
  const fromUrl = useSyncExternalStore(
    () => () => undefined,
    tagFromLocation,
    () => "All" as Filter,
  );
  const [chosen, setChosen] = useState<Filter | null>(null);
  const filter = chosen ?? fromUrl;

  const choose = (next: Filter) => {
    setChosen(next);
    const path = next === "All" ? `${basePath}/work/` : `${basePath}/work/?tag=${encodeURIComponent(next)}`;
    window.history.replaceState(null, "", path);
  };

  const visible = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((project) => project.tags?.includes(filter as StackTag));
  }, [filter, projects]);

  const selected = visible.filter((project) => project.group === "selected");
  const backend = visible.filter((project) => project.group === "backend");
  const professional = visible.filter((project) => project.group === "professional");
  const also = visible.filter((project) => project.group === "also");

  return (
    <div className="work-board">
      <div className="work-filters" role="toolbar" aria-label="Filter by stack">
        {filters.map((item) => (
          <button key={item} type="button" aria-pressed={filter === item} onClick={() => choose(item)}>
            {item}
          </button>
        ))}
      </div>
      {filter === "All" ? (
        <>
          <h2 id="selected-work" className="sr-only">
            Selected
          </h2>
          <WorkIndex projects={selected} labelledBy="selected-work" />
          <section className="studies" aria-labelledby="backend-title">
            <h2 id="backend-title">Backend and APIs</h2>
            <p>Services with their own routes. The screens that call them are listed separately.</p>
            <WorkIndex projects={backend} labelledBy="backend-title" />
          </section>
          <section className="studies" aria-labelledby="professional-title">
            <h2 id="professional-title">Professional work</h2>
            <p>Work at Kwalee, described without code or confidential detail.</p>
            <WorkIndex projects={professional} labelledBy="professional-title" />
          </section>
          <section className="studies" aria-labelledby="also-title">
            <h2 id="also-title">Also in public</h2>
            <p>Team products and experiments that sit beside the work above.</p>
            <WorkIndex projects={also} labelledBy="also-title" />
          </section>
        </>
      ) : (
        <section className="studies" aria-labelledby="filtered-title">
          <h2 id="filtered-title">{filter}</h2>
          <p>
            {visible.length} {visible.length === 1 ? "project" : "projects"} tagged {filter}.
          </p>
          {visible.length > 0 ? <WorkIndex projects={visible} labelledBy="filtered-title" /> : <p>Nothing in this tag.</p>}
        </section>
      )}
    </div>
  );
}
