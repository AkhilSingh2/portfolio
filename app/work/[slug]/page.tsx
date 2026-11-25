import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { TagList } from "@/components/tag";
import { getProject, neighbors, projects } from "@/lib/projects";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Work" };
  return {
    title: project.title,
    description: project.summary,
  };
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
              <Image
                src={hero.src}
                alt={hero.alt}
                width={hero.width}
                height={hero.height}
                priority
                sizes="100vw"
              />
            </div>
          ) : (
            <div className="empty-capture">
              <p className="eyebrow">No interface capture</p>
              <p>The notes for this project do not include a screenshot. What follows is the work itself.</p>
            </div>
          )}
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
          <dl className="case-meta">
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            {project.with ? (
              <div>
                <dt>With</dt>
                <dd>{project.with}</dd>
              </div>
            ) : null}
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>Links</dt>
              <dd className="case-links">
                {project.repo ? (
                  <a href={project.repo} target="_blank" rel="noreferrer">
                    Repository
                  </a>
                ) : null}
                {project.live ? (
                  <a href={project.live} target="_blank" rel="noreferrer">
                    {project.liveLabel ?? "Live"}
                  </a>
                ) : null}
                {!project.repo && !project.live ? <span>No public link</span> : null}
              </dd>
            </div>
          </dl>

          <section aria-labelledby="problem-title">
            <h2 id="problem-title">Problem</h2>
            <p>{project.problem}</p>
          </section>

          <section aria-labelledby="did-title">
            <h2 id="did-title">What shipped in the repo</h2>
            <ul className="plain-list">
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="stack-title">
            <h2 id="stack-title">Stack</h2>
            <TagList items={project.stack} />
          </section>

          {project.note ? <p className="case-note">{project.note}</p> : null}

          {gallery.length > 0 ? (
            <section className="case-gallery" aria-label="Screenshots">
              {gallery.map((shot) => (
                <figure key={shot.src}>
                  <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(min-width: 900px) 70vw, 100vw" />
                  <figcaption>{shot.caption}</figcaption>
                </figure>
              ))}
            </section>
          ) : null}

          {hero ? <p className="case-caption">{hero.caption}</p> : null}

          <nav className="case-next" aria-label="More work">
            <Link href="/work" transitionTypes={["nav-back"]}>
              All work
            </Link>
            {prev ? (
              <Link href={`/work/${prev.slug}`} transitionTypes={["nav-back"]}>
                <span className="eyebrow">Previous</span>
                {prev.title}
              </Link>
            ) : null}
            {next ? (
              <Link href={`/work/${next.slug}`} transitionTypes={["nav-forward"]}>
                <span className="eyebrow">Next</span>
                {next.title}
              </Link>
            ) : null}
          </nav>
        </div>
      </article>
    </PageShell>
  );
}
