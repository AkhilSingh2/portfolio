import Link from "next/link";
import { Button } from "@/components/button";
import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { Marquee } from "@/components/marquee";
import { PageShell } from "@/components/page-shell";
import { Portrait } from "@/components/portrait";
import { TagList } from "@/components/tag";
import { WorkReel } from "@/components/work-reel";
import { Reveal } from "@/components/reveal";
import { reelProjects } from "@/lib/projects";
import { resumeEducation, resumePlace, resumeRoles, resumeSummary } from "@/lib/resume";
import { person } from "@/lib/site";
import { skillGroups } from "@/lib/tokens";

const steps = [
  {
    title: "Frame",
    body: "Name the person, the job to be done, and what done means. Write the constraints down before the first rectangle.",
  },
  {
    title: "Shape",
    body: "Flows, type, and the states that get skipped: empty, error, loading, a screen that is too small, a keyboard.",
  },
  {
    title: "Build",
    body: "A typed interface, an API that matches the screens, and tests on the parts that can lie or break.",
  },
  {
    title: "Release",
    body: "Performance, accessibility, a real URL. Then watch the first session that is not yours.",
  },
];

export default function HomePage() {
  return (
    <PageShell>
      <Hero />
      <Marquee />
      <Manifesto />

      <section className="about-band theme-bone" id="about" aria-labelledby="about-title">
        <div className="about-grid about-grid-full">
          <Portrait size="small" />
          <div>
            <p className="eyebrow">02 — About</p>
            <h2 id="about-title">I start at the interface and I do not leave at the mock.</h2>
            <p>
              I am a full-stack engineer in {person.location.split(",")[0]}. The screen is where I begin, because that
              is where the product is judged. I stay for the API, the data, and the deploy. Lately the work has a model
              in it, and I keep one rule: the model does not get to invent the facts.
            </p>
            <p>{resumeSummary}</p>
            <p>
              {person.availability}. {resumePlace}.
            </p>
            <Button href="/about" variant="solid" transitionTypes={["nav-forward"]}>
              About the practice
            </Button>
          </div>
          <aside className="about-facts" aria-labelledby="resume-facts">
            <h3 id="resume-facts">From the resume</h3>
            <ol>
              {resumeRoles.map((role) => (
                <li key={role.id}>
                  <strong>{role.title}</strong>
                  <span>{role.org}</span>
                  <span>{role.dates}</span>
                </li>
              ))}
              <li>
                <strong>{resumeEducation.degree}</strong>
                <span>{resumeEducation.school}</span>
                <span>{resumeEducation.dates}</span>
              </li>
            </ol>
            <Button href="/resume" variant="line">
              Read the resume
            </Button>
          </aside>
        </div>
      </section>

      <WorkReel projects={reelProjects()} />

      <section className="api-strip theme-ink" id="apis" aria-labelledby="api-title">
        <div className="section-head">
          <p className="eyebrow">Backend and APIs</p>
          <h2 id="api-title">The screen is where it starts.</h2>
          <p>Outfit search and colour analysis are services of their own. The rest of the work is tagged the same way.</p>
        </div>
        <div className="hero-actions">
          <Button href="/work/mymirro-recommendation-api" variant="solid">
            Recommendation API
          </Button>
          <Button href="/work/colour-analysis-api" variant="ghost">
            Colour Analysis API
          </Button>
          <Link className="btn btn-line" href="/work/?tag=Backend">
            All backend work
          </Link>
        </div>
        <ul className="api-strip-list">
          <li>
            <Link href="/work/ai-asset-platform">AI asset platform</Link>
          </li>
          <li>
            <Link href="/work/media-composition">Media composition</Link>
          </li>
          <li>
            <Link href="/work/localisation-pipeline">Localisation pipeline</Link>
          </li>
          <li>
            <Link href="/work/finance-platform">Finance platform</Link>
          </li>
          <li>
            <Link href="/work/cloud-infrastructure">Cloud infrastructure</Link>
          </li>
          <li>
            <Link href="/work/marketing-site">Marketing site</Link>
          </li>
        </ul>
        <p className="api-strip-note">Proprietary work at Kwalee, described without code or confidential detail.</p>
      </section>

      <section className="process theme-bone" id="process" aria-labelledby="process-title">
        <div className="section-head">
          <p className="eyebrow">04 — Design to delivery</p>
          <h2 id="process-title">How the work moves.</h2>
        </div>
        <ol className="process-list">
          {steps.map((step, index) => (
            <li key={step.title} className="rise">
              <span className="process-num">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="skills theme-ink" id="stack" aria-labelledby="stack-title">
        <div className="section-head">
          <p className="eyebrow">05 — Stack</p>
          <h2 id="stack-title">Tools, grouped the way the work actually splits.</h2>
        </div>
        <div className="skill-grid">
          {skillGroups.map((group) => (
            <section key={group.title} className="skill-group rise" aria-labelledby={`skill-${group.title}`}>
              <h3 id={`skill-${group.title}`}>{group.title}</h3>
              <TagList items={group.items} />
            </section>
          ))}
        </div>
      </section>

      <section className="system-teaser theme-bone" aria-labelledby="calibre-title">
        <div className="teaser-copy">
          <p className="eyebrow">06 — Calibre</p>
          <h2 id="calibre-title">A design system with a name, a measure, and the code to prove it.</h2>
          <p>
            Calibre is the system this site is built with. Near-black and warm ivory carry the page. Champagne is the
            signal. The tokens are the CSS variables, and the charts on the system page are measured.
          </p>
          <Button href="/design-system" variant="solid" transitionTypes={["nav-forward"]}>
            Open the system
          </Button>
        </div>
        <div className="teaser-board" aria-hidden="true">
          <span className="teaser-swatch" style={{ background: "var(--ink-950)" }} />
          <span className="teaser-swatch" style={{ background: "var(--bone-50)" }} />
          <span className="teaser-swatch" style={{ background: "var(--ember-500)" }} />
          <span className="teaser-swatch" style={{ background: "var(--sage-500)" }} />
          <p className="teaser-type">
            Aa <em>Aa</em>
          </p>
        </div>
      </section>

      <section className="sutra-band theme-bone" aria-labelledby="sutra-home-title">
        <p className="eyebrow">Sutra UI</p>
        <h2 id="sutra-home-title">A separate system, for the tools.</h2>
        <p>
          Sutra UI is the gallery edition for calculators and converters: ivory and ink, antique gold as a line,
          Fraunces for the title, and Kalamkari as a hairline. This site stays on Calibre. The docs are live.
        </p>
        <div className="hero-actions">
          <Button href="/work/sutra-ui" variant="solid" transitionTypes={["nav-forward"]}>
            Open the showcase
          </Button>
          <a className="btn btn-line" href="https://akhilsingh2.github.io/sutra-ui/" target="_blank" rel="noreferrer">
            Live docs
          </a>
        </div>
      </section>

      <section className="contact theme-ink" id="contact" aria-labelledby="contact-title">
        <p className="eyebrow">07 — Contact</p>
        <h2 id="contact-title">
          <a href={`mailto:${person.email}`}>
            akhisingh2211
            <wbr />
            @gmail.com
          </a>
        </h2>
        <ul className="contact-links">
          <li>
            <a href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={person.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <Button href="/contact" variant="line">
              Write to me
            </Button>
          </li>
          <li>{person.location}</li>
        </ul>
      </section>
    </PageShell>
  );
}
