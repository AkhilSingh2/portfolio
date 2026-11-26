import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EngineeringBlock } from "@/components/engineering-block";
import { DeviceFrame } from "@/components/device-frame";
import { SutraShowcase } from "@/components/sutra-showcase";
import { PageShell } from "@/components/page-shell";
import { TagList } from "@/components/tag";
import { LiveLink, liveDomain } from "@/components/live-link";
import { pageMeta } from "@/lib/meta";
import { getProject, neighbors, projects } from "@/lib/projects";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return pageMeta("Work", "Case studies by Akhilendra Singh.", "/work");
  return pageMeta(project.title, project.summary, `/work/${project.slug}`);
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { prev, next } = neighbors(project.slug);
  const [hero, ...gallery] = project.shots;

  return (
    <PageShell>
      <article className="case theme-bone">
        <header className={hero ? "case-hero" : "case-hero case-hero-plain"}>
          {hero ? (
            <div className="case-media">
              <DeviceFrame shot={hero} priority />
            </div>
          ) : null}
          <div className="case-title">
            <p className="eyebrow">
              {project.kicker}
              <span className="dot" aria-hidden="true" />
              {project.year}
            </p>
            <h1>{project.title}</h1>
            <p className="lede">{project.summary}</p>
          </div>
        </header>

        <div className="case-body">
          {project.repo || project.live ? (
          <dl className="case-meta">
            <div>
              <dt>Links</dt>
              <dd className="case-links">
                {project.repo ? (
                <a href={project.repo} target="_blank" rel="noreferrer">
                  Repository
                </a>
                ) : null}
                {project.pr ? (
                  <a href={project.pr} target="_blank" rel="noreferrer">
                    Pull request
                  </a>
                ) : null}
                {project.live ? <LiveLink href={project.live} domain={liveDomain(project.liveLabel)} /> : null}
              </dd>
            </div>
          </dl>
          ) : null}

          <section aria-labelledby="problem-title">
            <h2 id="problem-title">Problem</h2>
            <p>{project.problem}</p>
          </section>
          <section aria-labelledby="built-title">
            <h2 id="built-title">What I built</h2>
            <p>{project.built}</p>
            <ul className="plain-list">
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          {project.stack.length > 0 ? (
            <section aria-labelledby="stack-title">
              <h2 id="stack-title">Stack</h2>
              <TagList items={project.stack} />
            </section>
          ) : null}
          {project.engineering ? <EngineeringBlock note={project.engineering} /> : null}
          <section aria-labelledby="outcome-title">
            <h2 id="outcome-title">Outcome</h2>
            <p>{project.outcome}</p>
          </section>
          {project.slug === "sutra-ui" ? <SutraShowcase /> : null}
          {hero ? <p className="case-caption">{hero.caption}</p> : null}
          {gallery.length > 0 ? (
            <section className="case-gallery" aria-label="Screenshots">
              {gallery.map((shot) => (
                <figure key={shot.src}>
                  <DeviceFrame shot={shot} />
                  <figcaption>{shot.caption}</figcaption>
                </figure>
              ))}
            </section>
          ) : null}
          <nav className="case-next" aria-label="More work">
            <div className="case-prev">
              {prev ? (
                <Link href={`/work/${prev.slug}`} title={prev.title}>
                  <span className="case-next-label">
                    <span aria-hidden="true">← </span>
                    <span className="case-next-full">Previous</span>
                    <span className="case-next-short">Prev</span>
                  </span>
                  <span className="case-next-title">{prev.title}</span>
                </Link>
              ) : null}
            </div>
            <div className="case-all">
              <Link href="/work">
                <span className="case-next-full">All work</span>
                <span className="case-next-short">All</span>
              </Link>
            </div>
            <div className="case-forward">
              {next ? (
                <Link href={`/work/${next.slug}`} title={next.title}>
                  <span className="case-next-label">
                    <span className="case-next-full">Next</span>
                    <span className="case-next-short">Next</span>
                    <span aria-hidden="true"> →</span>
                  </span>
                  <span className="case-next-title">{next.title}</span>
                </Link>
              ) : null}
            </div>
          </nav>
        </div>
      </article>
    </PageShell>
  );
}
