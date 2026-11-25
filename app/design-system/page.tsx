import type { Metadata } from "next";
import Link from "next/link";
import { CalibreCharts } from "@/components/calibre-charts";
import { CalibreNav } from "@/components/calibre-nav";
import { CalibreReference } from "@/components/calibre-reference";
import { CalibreWorkbench } from "@/components/calibre-workbench";
import { MotionDemo } from "@/components/motion-demo";
import { PageShell } from "@/components/page-shell";
import { TagList } from "@/components/tag";
import { calibreMetrics } from "@/lib/calibre-metrics";
import { easings, motions, philosophy } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Calibre",
  description:
    "Calibre is Akhilendra Singh's design system: principles, color, type, space, motion, and the components this site uses.",
};

export default function DesignSystemPage() {
  const home = calibreMetrics.lighthouse.find((item) => item.route === "/portfolio/");
  const contrast = calibreMetrics.contrast.reduce((best, item) => (item.ratio > best.ratio ? item : best));
  const lcp = home ? `${home.lcpMs} ms` : "—";
  const score = home ? String(home.score) : "—";
  const cls = home ? home.cls.toFixed(3) : "—";

  return (
    <PageShell>
      <article className="page system theme-bone">
        <header className="calibre-hero">
          <p className="eyebrow">Design system</p>
          <h1>Calibre</h1>
          <p className="lede">Near-black and warm ivory carry the page. Champagne is the signal.</p>
        </header>

        <ul className="calibre-stats" aria-label="Measured headlines from this build">
          <li>
            <strong>{score}</strong>
            <span>Lighthouse performance, home</span>
          </li>
          <li>
            <strong>{lcp}</strong>
            <span>Largest contentful paint</span>
          </li>
          <li>
            <strong>{cls}</strong>
            <span>Cumulative layout shift</span>
          </li>
          <li>
            <strong>{contrast.ratio.toFixed(1)}:1</strong>
            <span>{contrast.name}</span>
          </li>
        </ul>

        <section className="system-block calibre-anchor" id="playground" aria-labelledby="playground-title">
          <h2 id="playground-title">Workbench</h2>
          <p>These are the controls the site uses. Each one changes state when you use it.</p>
          <CalibreWorkbench />
        </section>

        <CalibreNav />

        <section className="system-block calibre-anchor" id="philosophy" aria-labelledby="philosophy-title">
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

        <section className="system-block calibre-anchor" id="tokens" aria-labelledby="tokens-title">
          <h2 id="tokens-title">Tokens</h2>
          <p>One group at a time. The values are the CSS variables in the stylesheet.</p>
          <CalibreReference />
        </section>

        <details className="system-fold calibre-anchor" id="motion">
          <summary>
            <span className="fold-title" id="motion-title">
              Motion
            </span>
            <span className="fold-hint">Four durations, three easings, one track</span>
          </summary>
          <div className="fold-body">
            <p>
              Scroll-scrubbed sequences use the same attitude: a handoff, then rest.
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
          </div>
        </details>

        <details className="system-fold calibre-anchor" id="measured">
          <summary>
            <span className="fold-title" id="measured-title">
              Measured
            </span>
            <span className="fold-hint">Lighthouse, bundles, contrast, type, space</span>
          </summary>
          <div className="fold-body">
            <p>
              These charts are the current build and the tokens in the source. A route that is slower is still on the
              chart.
            </p>
            <CalibreCharts />
          </div>
        </details>

        <section className="system-block" aria-labelledby="pieces-title">
          <h2 id="pieces-title">In use</h2>
          <p>A tag row and a project tile, the same elements as the work index.</p>
          <TagList items={["React", "TypeScript", "Python", "Calibre"]} />
          <Link className="project-tile" href="/work/online-chalisa" transitionTypes={["nav-forward"]}>
            <span className="eyebrow">Reader · 2026</span>
            <span className="project-tile-title">Online Chalisa</span>
            <span>Six languages, verse-synced audio, live.</span>
          </Link>
        </section>
      </article>
    </PageShell>
  );
}
