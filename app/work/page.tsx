import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { WorkIndex } from "@/components/work-index";
import { alsoProjects, selectedProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies by Akhilendra Singh: research agents, SaaS, realtime collaboration, analytics, motion, and live products.",
};

export default function WorkPage() {
  return (
    <PageShell>
      <article className="page work-page theme-bone">
        <header className="page-intro">
          <p className="eyebrow">Work</p>
          <h1>The work I can show.</h1>
          <p className="lede">
            Each card opens a case study: the problem, what I built, the stack, and where the code lives. Live sites
            are linked only when they are actually live.
          </p>
        </header>
        <h2 id="selected-work" className="sr-only">
          Selected
        </h2>
        <WorkIndex projects={selectedProjects()} labelledBy="selected-work" />
        <section className="studies" aria-labelledby="also-title">
          <h2 id="also-title">Also in public</h2>
          <p>Team products and experiments that sit beside the work above.</p>
          <WorkIndex projects={alsoProjects()} labelledBy="also-title" />
        </section>
      </article>
    </PageShell>
  );
}
