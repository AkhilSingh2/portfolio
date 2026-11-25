import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/button";
import { MotionDemo } from "@/components/motion-demo";
import { PageShell } from "@/components/page-shell";
import { Swatch } from "@/components/swatch";
import { TagList } from "@/components/tag";
import { colors, easings, elevations, motions, philosophy, radii, spaces, typeSteps } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Calibre",
  description:
    "Calibre is Akhilendra Singh's design system: principles, color, type, space, motion, and the components this site uses.",
};

export default function DesignSystemPage() {
  return (
    <PageShell>
      <article className="page system theme-bone">
        <header className="page-intro">
          <p className="eyebrow">Design system</p>
          <h1>Calibre</h1>
          <p className="lede">
            I named this system Calibre. It is the measure I use on this site, and it is the code this site runs.
            The palette, type, radii, and motion are Sutra UI’s tokens: indigo and cream, marigold and rani, Baloo 2
            and Inter, chunky corners, and a spring.
          </p>
        </header>

        <section className="system-block" id="philosophy" aria-labelledby="philosophy-title">
          <h2 id="philosophy-title">Principles</h2>
          <ol className="principles">
            {philosophy.map((item, index) => (
              <li key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="system-block" id="color" aria-labelledby="color-title">
          <h2 id="color-title">Color</h2>
          <p>Click a swatch to copy the variable and the computed value. These chips read the live CSS, not a second palette.</p>
          <div className="swatch-grid">
            {colors.map((color) => (
              <Swatch key={color.variable} name={color.name} variable={color.variable} role={color.role} />
            ))}
          </div>
        </section>

        <section className="system-block" id="type" aria-labelledby="type-title">
          <h2 id="type-title">Type</h2>
          <p>
            Baloo 2 for display. Inter for interface and body, with Noto Sans Devanagari named as the fallback.
            IBM Plex Mono for figures and tokens.
          </p>
          <div className="type-stack">
            {typeSteps.map((step) => (
              <div key={step.variable} className="type-row">
                <div className="type-meta">
                  <span>{step.name}</span>
                  <code>{step.variable}</code>
                </div>
                <p className={`type-sample type-${step.specimen}`} style={{ fontSize: `var(${step.variable})` }}>
                  {step.sample}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="system-block" id="space" aria-labelledby="space-title">
          <h2 id="space-title">Space</h2>
          <p>A 4-based scale, from a hair of padding to a section break. Components use the variables, not raw pixels.</p>
          <ul className="space-list">
            {spaces.map((space) => (
              <li key={space.variable}>
                <span className="space-bar" style={{ width: `var(${space.variable})` }} />
                <code>
                  {space.name} · {space.variable}
                </code>
              </li>
            ))}
          </ul>
        </section>

        <section className="system-block" id="radius" aria-labelledby="radius-title">
          <h2 id="radius-title">Radius</h2>
          <div className="radius-row">
            {radii.map((radius) => (
              <figure key={radius.variable}>
                <div className="radius-box" style={{ borderRadius: `var(${radius.variable})` }} />
                <figcaption>
                  <strong>{radius.name}</strong>
                  <code>{radius.variable}</code>
                  <span>{radius.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="system-block" id="elevation" aria-labelledby="elevation-title">
          <h2 id="elevation-title">Elevation</h2>
          <p>Most depth on the site is a change of tone, ink against bone. Shadows are rare and named.</p>
          <div className="elev-row">
            {elevations.map((item) => (
              <figure key={item.variable}>
                <div className="elev-box" style={{ boxShadow: `var(${item.variable})` }} />
                <figcaption>
                  <strong>{item.name}</strong>
                  <code>{item.variable}</code>
                  <span>{item.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="system-block" id="motion" aria-labelledby="motion-title">
          <h2 id="motion-title">Motion</h2>
          <p>
            Four durations, three easings. Scroll-scrubbed sequences use the same attitude: a handoff, then rest.
            <code> prefers-reduced-motion</code> drops the scrub and Lenis, and leaves the content in place.
          </p>
          <ul className="token-inline">
            {motions.map((item) => (
              <li key={item.variable}>
                <code>{item.variable}</code> {item.ms}ms — {item.note}
              </li>
            ))}
            {easings.map((item) => (
              <li key={item.variable}>
                <code>{item.variable}</code> {item.css}
              </li>
            ))}
          </ul>
          <MotionDemo />
        </section>

        <section className="system-block" id="components" aria-labelledby="components-title">
          <h2 id="components-title">Components</h2>
          <p>The same elements as the rest of the site. Nothing in this gallery is a lookalike.</p>

          <h3>Buttons</h3>
          <div className="specimen specimen-ink">
            <Button variant="solid">Solid</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="line">Line</Button>
          </div>
          <div className="specimen">
            <Button variant="solid">Solid on bone</Button>
            <Button variant="ghost">Ghost on bone</Button>
            <Button variant="line">Line on bone</Button>
          </div>

          <h3>Tags</h3>
          <TagList items={["React", "TypeScript", "Python", "Calibre"]} />

          <h3>Field</h3>
          <label className="field" htmlFor="specimen-name">
            <span>Name</span>
            <input id="specimen-name" name="specimen-name" placeholder="Akhilendra Singh" autoComplete="off" />
          </label>

          <h3>Project tile</h3>
          <Link className="project-tile" href="/work/online-chalisa" transitionTypes={["nav-forward"]}>
            <span className="eyebrow">Reader · 2026</span>
            <span className="project-tile-title">Online Chalisa</span>
            <span>Six languages, verse-synced audio, live.</span>
          </Link>

          <h3>Card</h3>
          <article className="card">
            <p className="eyebrow">Note</p>
            <h3>A card is a border and a measure.</h3>
            <p>If the type already groups the idea, the card does not get a shadow to prove it is a card.</p>
          </article>
        </section>
      </article>
    </PageShell>
  );
}
