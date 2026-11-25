import type { Metadata } from "next";
import { Button } from "@/components/button";
import { PageShell } from "@/components/page-shell";
import { getResumeHref } from "@/lib/assets";
import { selectedProjects } from "@/lib/projects";
import { asset, person } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: "Akhilendra Singh, full-stack engineer in Bangalore. Frontend first, design through delivery.",
};

export default function ResumePage() {
  const href = getResumeHref();
  return (
    <PageShell>
      <article className="page resume-page theme-bone">
        <p className="eyebrow">Resume</p>
        <h1>{person.name}</h1>
        <p className="lede">
          Full-stack engineer, frontend first. {person.location}. {person.availability}.
        </p>
        <section>
          <h2>Practice</h2>
          <p>
            I take a product from the interface through the API and the release. Recent public work includes a cited
            research agent, a multi-tenant SaaS starter, a realtime board, product analytics, a local-first expense
            ledger, a scroll-driven launch site, and Online Chalisa.
          </p>
        </section>
        <section>
          <h2>Selected work</h2>
          <ul className="plain-list">
            {selectedProjects().slice(0, 8).map((project) => (
              <li key={project.slug}>
                <a href={project.repo}>{project.title}</a> — {project.summary}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Stack</h2>
          <p>
            React, Next.js, TypeScript, Vue, Python, FastAPI, Flask, Postgres, SQLite, AWS, Docker, Cloudflare
            Workers, GSAP, and design systems.
          </p>
        </section>
        <div className="hero-actions">
          {href ? (
            <a className="btn btn-solid" href={asset(href)} download>
              Download PDF
            </a>
          ) : null}
          <Button href="/contact" variant={href ? "ghost" : "solid"}>
            Contact
          </Button>
          <Button href={`mailto:${person.email}`} variant="line">
            {person.email}
          </Button>
        </div>
      </article>
    </PageShell>
  );
}
