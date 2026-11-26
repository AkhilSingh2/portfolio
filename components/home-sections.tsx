import Link from "next/link";
import { Button } from "@/components/button";
import { LiveLink, liveDomain } from "@/components/live-link";
import { Media } from "@/components/media";
import { ParallaxFrame } from "@/components/parallax-frame";
import { TagList } from "@/components/tag";
import { backendProjects, professionalProjects, projects, type Project } from "@/lib/projects";
import { asset } from "@/lib/site";

const featuredSlugs = ["docmind", "launchpad", "cadence", "buzzroom", "tandem", "online-chalisa"];

const roles: Record<string, string> = {
  "ai-asset-platform": "Frontend-leaning full-stack",
  "media-composition": "Pipeline and autoscaling",
  "localisation-pipeline": "Ingestion and the review screen",
  "finance-platform": "Monorepo and revenue recognition",
  "cloud-infrastructure": "Infrastructure as code",
  "marketing-site": "Public site migration",
};

function featuredProjects() {
  return featuredSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));
}

function StudyLinks({ project }: { project: Project }) {
  return (
    <div className="study-links">
      <Link className="text-link" href={`/work/${project.slug}`}>
        Case study
      </Link>
      {project.live ? <LiveLink href={project.live} domain={liveDomain(project.liveLabel)} /> : null}
    </div>
  );
}

export function SelectedWork() {
  const items = featuredProjects();
  return (
    <section className="home-block theme-ink" id="work" aria-labelledby="work-title">
      <header className="section-head">
        <p className="eyebrow">Selected work</p>
        <h2 id="work-title">Full-stack products, shown end to end.</h2>
        <p>The strongest work first: the interface, the service behind it, and a public URL when one exists.</p>
      </header>
      <div className="work-gallery">
        {items.map((project, index) => {
          const shot = project.shots[0];
          return (
            <article className="gallery-card reveal-card" key={project.slug} style={{ animationDelay: `${index * 70}ms` }}>
              {shot ? (
                <ParallaxFrame className="shot">
                  <Media
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    priority={index < 2}
                    sizes="(min-width: 800px) 46vw, 100vw"
                  />
                </ParallaxFrame>
              ) : null}
              <div className="gallery-body">
                <p className="gallery-kicker">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {project.kicker}
                </p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <TagList items={project.stack.slice(0, 4)} />
                <StudyLinks project={project} />
              </div>
            </article>
          );
        })}
      </div>
      <p className="home-more">
        <Link className="text-link" href="/work">
          See all work
        </Link>
      </p>
    </section>
  );
}

export function BackendWork() {
  const items = backendProjects();
  return (
    <section className="home-block theme-bone" id="apis" aria-labelledby="api-title">
      <header className="section-head">
        <p className="eyebrow">Backend and APIs</p>
        <h2 id="api-title">Services the screens call.</h2>
        <p>Outfit search and colour analysis stand on their own. The studies stay on the routes, the failures, and what is not deployed.</p>
      </header>
      <div className="api-grid">
        {items.map((project) => {
          const shot = project.shots[0];
          return (
            <article className="study-card reveal-card" key={project.slug}>
              {shot ? (
                <ParallaxFrame className="shot shot-plate">
                  <Media src={shot.src} alt="" width={shot.width} height={shot.height} sizes="(min-width: 800px) 46vw, 100vw" />
                </ParallaxFrame>
              ) : null}
              <div className="gallery-body">
                <p className="gallery-kicker">{project.kicker}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <TagList items={project.stack.slice(0, 5)} />
                <StudyLinks project={project} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ProfessionalWork() {
  const items = professionalProjects();
  return (
    <section className="home-block theme-ink" id="professional" aria-labelledby="professional-title">
      <header className="section-head">
        <p className="eyebrow">Professional work · 2024–2026</p>
        <h2 id="professional-title">Anonymised studies from a games and media company.</h2>
        <p>No codenames, and no internal detail. Each card is the role, the problem, the stack, and the outcome.</p>
      </header>
      <div className="pro-grid">
        {items.map((project) => {
          const shot = project.shots[0];
          return (
            <article className="study-card reveal-card" key={project.slug}>
              {shot ? (
                <ParallaxFrame className="shot shot-plate">
                  <Media src={shot.src} alt="" width={shot.width} height={shot.height} sizes="(min-width: 1100px) 30vw, (min-width: 700px) 46vw, 100vw" />
                </ParallaxFrame>
              ) : null}
              <div className="gallery-body">
                <p className="gallery-kicker">{roles[project.slug] ?? project.year}</p>
                <h3>
                  <Link href={`/work/${project.slug}`}>{project.title}</Link>
                </h3>
                <p>{project.problem}</p>
                <TagList items={project.stack.slice(0, 4)} />
                <p className="study-outcome">
                  <span>Outcome</span>
                  <span>{project.outcome}</span>
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function SystemPair() {
  return (
    <section className="home-block theme-bone" id="systems" aria-labelledby="systems-title">
      <header className="section-head">
        <p className="eyebrow">Design systems</p>
        <h2 id="systems-title">Two systems, held to the same frame.</h2>
        <p>Calibre is this site. Sutra UI is the gallery edition for the tools. The frames match, and neither one is the page.</p>
      </header>
      <div className="system-pair">
        <article className="system-tile">
          <ParallaxFrame className="shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/work/calibre/studio.webp")}
              alt="Calibre, the design system page: ivory ground, the name, and the measured stats"
              width={1440}
              height={900}
            />
          </ParallaxFrame>
          <div className="gallery-body">
            <p className="gallery-kicker">Calibre</p>
            <h3>Ink, ivory, champagne.</h3>
            <p>Near-black and warm ivory carry the page. Champagne is the only signal. The system page is the tokens, measured.</p>
            <div className="study-links">
              <Button href="/design-system" variant="solid" transitionTypes={["nav-forward"]}>
                Open the system
              </Button>
            </div>
          </div>
        </article>
        <article className="system-tile">
          <ParallaxFrame className="shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/work/sutra-ui/home-dark.webp")}
              alt="Sutra UI in the dark theme, ivory type on a near-black page"
              width={1600}
              height={1000}
            />
          </ParallaxFrame>
          <div className="gallery-body">
            <p className="gallery-kicker">Sutra UI</p>
            <h3>The dark theme, in the same frame.</h3>
            <p>Ivory and ink for calculators and converters, antique gold as a line. This portfolio stays on Calibre. The docs are live.</p>
            <div className="study-links">
              <Button href="/work/sutra-ui" variant="solid" transitionTypes={["nav-forward"]}>
                Open the showcase
              </Button>
              <a className="btn btn-line" href="https://akhilsingh2.github.io/sutra-ui/" target="_blank" rel="noreferrer">
                Live docs
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
