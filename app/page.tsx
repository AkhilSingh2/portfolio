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

      <Reveal>
      <section className="about-band theme-bone" id="about" aria-labelledby="about-title">
        <div className="about-grid">
          <Portrait size="small" />
          <div>
            <p className="eyebrow">02 — About</p>
            <h2 id="about-title">I start at the interface and I do not leave at the mock.</h2>
            <p>
              I am a full-stack engineer in {person.location.split(",")[0]}. The screen is where I begin, because that
              is where the product is judged. I stay for the API, the data, and the deploy. Lately the work has a model
              in it, and I keep one rule: the model does not get to invent the facts.
            </p>
            <p>
              {person.availability}. The public record is the case studies: a cited research agent, a multi-tenant
              SaaS starter, a live collaborative board, product analytics, a local-first ledger, and a reader that is
              already on the public internet.
            </p>
            <Button href="/about" variant="solid" transitionTypes={["nav-forward"]}>
              About the practice
            </Button>
          </div>
        </div>
      </section>
      </Reveal>

      <WorkReel projects={reelProjects()} />

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
            Calibre is the system this site is built with. Ink and bone carry the page. Ember is the one signal.
            Motion hands a section to the next one. The tokens are the CSS variables, not a slide.
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
