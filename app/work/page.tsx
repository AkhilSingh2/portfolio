import { PageShell } from "@/components/page-shell";
import { WorkBoard } from "@/components/work-board";
import { pageMeta } from "@/lib/meta";
import { decorate, projects } from "@/lib/projects";

export const metadata = pageMeta(
  "Work",
  "Case studies by Akhilendra Singh: research agents, SaaS, realtime collaboration, analytics, motion, and live products.",
  "/work",
);

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
        <WorkBoard projects={projects.map((project) => decorate(project))} />
      </article>
    </PageShell>
  );
}
