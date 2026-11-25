import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Media } from "@/components/media";
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
  return { title: project.title, description: project.summary };
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
              <Media src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} priority />
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
          <dl className="case-meta">
            <div>
              <dt>Links</dt>
              <dd className="case-links">
                <a href={project.repo} target="_blank" rel="noreferrer">
                  Repository
                </a>
                {project.pr ? (
                  <a href={project.pr} target="_blank" rel="noreferrer">
                    Pull request
                  </a>
                ) : null}
                {project.live ? (
                  <a href={project.live} target="_blank" rel="noreferrer">
                    {project.liveLabel ?? "Live"}
                  </a>
                ) : null}
              </dd>
            </div>
          </dl>

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
          <section aria-labelledby="outcome-title">
            <h2 id="outcome-title">Outcome</h2>
            <p>{project.outcome}</p>
          </section>
          {hero ? <p className="case-caption">{hero.caption}</p> : null}
          {gallery.length > 0 ? (
            <section className="case-gallery" aria-label="Screenshots">
              {gallery.map((shot) => (
                <figure key={shot.src}>
                  <Media src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} />
                  <figcaption>{shot.caption}</figcaption>
                </figure>
              ))}
            </section>
          ) : null}
          <nav className="case-next" aria-label="More work">
            <Link href="/work">All work</Link>
            {prev ? (
              <Link href={`/work/${prev.slug}`}>
                <span className="eyebrow">Previous</span>
                {prev.title}
              </Link>
            ) : null}
            {next ? (
              <Link href={`/work/${next.slug}`}>
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
