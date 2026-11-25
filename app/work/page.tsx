import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { WorkIndex } from "@/components/work-index";
import { selectedProjects, studyProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected work by Akhilendra Singh: AI products, a multilingual reader, fashion software, and earlier Vue studies.",
};

export default function WorkPage() {
  return (
    <PageShell>
      <article className="page work-page theme-bone">
        <header className="page-intro">
          <p className="eyebrow">Work</p>
          <h1>Selected work, then the early studies.</h1>
          <p className="lede">
            Case studies for the products and services. The 2021 pieces stay at the bottom, labelled as studies, so
            they do not pretend to be the current practice.
          </p>
        </header>
        <h2 id="selected-work" className="sr-only">
          Selected
        </h2>
        <WorkIndex projects={selectedProjects()} labelledBy="selected-work" />
        <section className="studies" aria-labelledby="studies-title">
          <h2 id="studies-title">Earlier studies, 2021</h2>
          <p>Vue exercises. Kept because they show the start of the full-stack work, not because they are the pitch.</p>
          <WorkIndex projects={studyProjects()} labelledBy="studies-title" />
        </section>
      </article>
    </PageShell>
  );
}
