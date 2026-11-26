"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const stages = [
  {
    index: "01",
    title: "Design",
    note: "The interface",
    body: "Calibre is the system on this site: near-black, warm ivory, champagne as the only signal. Sutra UI carries the same restraint into the calculators. Both were drawn in Figma before the components existed.",
    tools: ["Figma", "Sutra UI", "Calibre"],
    links: [
      { href: "/design-system", label: "Calibre" },
      { href: "/work/sutra-ui", label: "Sutra UI" },
    ],
  },
  {
    index: "02",
    title: "Build",
    note: "The system",
    body: "The recommendation service is Flask-RESTX under /api/v1. Outfit generation takes a user id and writes to Supabase. A separate finance study shares one recognition module between a React app and FastAPI.",
    tools: ["Flask", "FastAPI", "Supabase", "Postgres"],
    links: [
      { href: "/work/mymirro-recommendation-api", label: "Recommendation API" },
      { href: "/work/finance-platform", label: "Finance platform" },
    ],
  },
  {
    index: "03",
    title: "Ship",
    note: "The release",
    body: "Public sites go out through GitHub Actions. The infrastructure study declares ECR, RDS, S3, and IAM in Terraform, moves hosted apps onto Amplify, and scales workers with Helm and KEDA.",
    tools: ["GitHub Actions", "Docker", "Amplify", "Helm"],
    links: [{ href: "/work/cloud-infrastructure", label: "Cloud infrastructure" }],
  },
] as const;

export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mq = window.matchMedia("(min-width: 960px) and (prefers-reduced-motion: no-preference)");
    let revert: (() => void) | undefined;
    let dead = false;
    let token = 0;

    const setup = async () => {
      const mine = ++token;
      revert?.();
      revert = undefined;
      root.classList.toggle("is-driven", mq.matches);
      if (!mq.matches) return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (dead || mine !== token || !mq.matches) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const stage = root.querySelector<HTMLElement>("[data-stage]");
        const line = root.querySelector<HTMLElement>("[data-line]");
        const artifacts = gsap.utils.toArray<HTMLElement>("[data-artifact]", root);
        const marks = gsap.utils.toArray<HTMLElement>("[data-mark]", root);
        if (!stage || artifacts.length === 0) return;
        const paint = (progress: number) => {
          if (line) line.style.transform = `scaleY(${progress})`;
          const active = Math.min(artifacts.length - 1, Math.round(progress * (artifacts.length - 1)));
          artifacts.forEach((node, index) => {
            const centre = artifacts.length === 1 ? 0 : index / (artifacts.length - 1);
            const distance = Math.abs(progress - centre);
            const shown = Math.max(0, 1 - distance * 2.15);
            node.style.opacity = shown.toFixed(3);
            node.style.visibility = shown > 0.04 ? "visible" : "hidden";
            node.style.clipPath = `inset(${((1 - shown) * 10).toFixed(2)}% 0 ${((1 - shown) * 14).toFixed(2)}% 0)`;
            node.style.transform = `translate3d(0, ${((1 - shown) * 10).toFixed(2)}px, 0)`;
          });
          marks.forEach((mark, index) => {
            mark.dataset.on = index === active ? "true" : "false";
          });
        };
        paint(0);
        ScrollTrigger.create({
          trigger: stage,
          start: "top 62%",
          end: "bottom 48%",
          scrub: 0.45,
          invalidateOnRefresh: true,
          onUpdate: (self) => paint(self.progress),
        });
      }, root);
      revert = () => ctx.revert();
      ScrollTrigger.refresh();
    };

    const onChange = () => {
      void setup();
    };
    void document.fonts.ready.then(() => {
      if (!dead) void setup();
    });
    mq.addEventListener("change", onChange);
    return () => {
      dead = true;
      mq.removeEventListener("change", onChange);
      revert?.();
      root.classList.remove("is-driven");
    };
  }, []);

  return (
    <section className="practice theme-ink" id="practice" ref={rootRef} aria-labelledby="practice-title">
      <div className="practice-frame">
        <header className="practice-intro">
          <p className="eyebrow">01 — Practice</p>
          <h2 id="practice-title">From the interface to the release.</h2>
          <p className="practice-lead">Each stage is a piece of work I can open, not a slogan.</p>
          <div className="practice-rail-wrap">
            <span className="practice-rail-line" aria-hidden="true">
              <i data-line="" />
            </span>
            <ol className="practice-rail">
              {stages.map((stage) => (
                <li key={stage.index} data-mark="" data-on={stage.index === "01" ? "true" : "false"}>
                  <span>{stage.index}</span>
                  <strong>{stage.title}</strong>
                  <em>{stage.note}</em>
                </li>
              ))}
            </ol>
          </div>
        </header>
        <div className="practice-stage" data-stage="">
          <article className="practice-artifact" data-artifact="">
            <p className="practice-kicker">Design · Calibre tokens</p>
            <pre className="practice-code">
              <code>
                {`--ink-950:   #100e0c;
--bone-50:   #f3ecdf;
--ember-500: #d4c4a8;`}
              </code>
            </pre>
            <p>{stages[0].body}</p>
            <ul className="practice-tools">
              {stages[0].tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
            <p className="practice-links">
              {stages[0].links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </p>
          </article>
          <article className="practice-artifact" data-artifact="">
            <p className="practice-kicker">Build · Recommendation API</p>
            <ol className="practice-flow">
              <li>Client</li>
              <li>
                <code>POST /api/v1/outfits/generate</code>
              </li>
              <li>Flask-RESTX</li>
              <li>Supabase</li>
            </ol>
            <p>{stages[1].body}</p>
            <ul className="practice-tools">
              {stages[1].tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
            <p className="practice-links">
              {stages[1].links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </p>
          </article>
          <article className="practice-artifact" data-artifact="">
            <p className="practice-kicker">Ship · Infrastructure</p>
            <ol className="practice-flow">
              <li>GitHub Actions</li>
              <li>Docker</li>
              <li>Amplify</li>
              <li>Helm · Kubernetes</li>
            </ol>
            <p>{stages[2].body}</p>
            <ul className="practice-tools">
              {stages[2].tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
            <p className="practice-links">
              {stages[2].links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
