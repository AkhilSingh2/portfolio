"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/button";
import { Media } from "@/components/media";
import { TagList } from "@/components/tag";
import { backendProjects, professionalProjects } from "@/lib/projects";
import { asset } from "@/lib/site";

const stripSlugs = ["media-composition", "localisation-pipeline", "marketing-site"];

const roles: Record<string, string> = {
  "ai-asset-platform": "Frontend-leaning full-stack",
  "media-composition": "Pipeline and autoscaling",
  "localisation-pipeline": "Ingestion and the review screen",
  "finance-platform": "Monorepo and revenue recognition",
  "cloud-infrastructure": "Infrastructure as code",
  "marketing-site": "Public site migration",
};

type GsapApi = typeof import("gsap").gsap;

function useScene(setup: (gsap: GsapApi, root: HTMLElement) => void) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let dead = false;
    let revert: (() => void) | undefined;

    const run = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (dead || reduce.matches) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => setup(gsap, root), root);
      revert = () => ctx.revert();
      ScrollTrigger.refresh();
    };

    void run();
    return () => {
      dead = true;
      revert?.();
      root.classList.remove("is-reel");
    };
  }, [setup]);

  return ref;
}

function stageBackend(gsap: GsapApi, root: HTMLElement) {
  const line = root.querySelector("[data-flow]");
  const heads = root.querySelectorAll("[data-reveal]");
  const cards = root.querySelectorAll("[data-card]");
  const pans = root.querySelectorAll(".shot img");
  gsap.from(heads, {
    y: 28,
    scale: 1.06,
    opacity: 0,
    duration: 0.75,
    stagger: 0.08,
    ease: "power3.out",
    transformOrigin: "0% 100%",
    scrollTrigger: { trigger: root, start: "top 80%" },
  });
  const flow = gsap.timeline({
    scrollTrigger: { trigger: root, start: "top 72%", end: "top 38%", scrub: 0.45 },
  });
  if (line) flow.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "none" }, 0);
  flow.fromTo(
    cards,
    { y: 36, opacity: 0, clipPath: "inset(14% 0 0 0)" },
    { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", stagger: 0.2, duration: 0.45, ease: "power2.out" },
    0.12,
  );
  if (pans.length) {
    gsap.fromTo(
      pans,
      { scale: 1.16, yPercent: 3 },
      {
        scale: 1,
        yPercent: -3,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  }
}

function stageProfessional(gsap: GsapApi, root: HTMLElement) {
  const heads = root.querySelectorAll("[data-reveal]");
  const track = root.querySelector<HTMLElement>("[data-track]");
  const cards = root.querySelectorAll("[data-card]");
  gsap.from(heads, {
    y: 28,
    scale: 1.06,
    opacity: 0,
    duration: 0.75,
    stagger: 0.08,
    ease: "power3.out",
    transformOrigin: "0% 100%",
    scrollTrigger: { trigger: root, start: "top 82%" },
  });

  const wide = window.matchMedia("(min-width: 960px)").matches && track;
  if (wide && track) {
    root.classList.add("is-reel");
    const distance = () => Math.max(0, track.scrollWidth - (track.parentElement?.clientWidth ?? track.scrollWidth));
    if (distance() > 32) {
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${distance() + 120}`,
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }
    gsap.from(cards, {
      clipPath: "inset(0 12% 0 0)",
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: root, start: "top 78%" },
    });
    return;
  }

  gsap.from(cards, {
    y: 32,
    opacity: 0,
    clipPath: "inset(10% 0 0 0)",
    duration: 0.7,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: { trigger: root, start: "top 80%" },
  });
}

function stageSystems(gsap: GsapApi, root: HTMLElement) {
  const heads = root.querySelectorAll("[data-reveal]");
  const left = root.querySelector("[data-side='left']");
  const right = root.querySelector("[data-side='right']");
  const frames = root.querySelectorAll("[data-frame]");
  gsap.from(heads, {
    y: 28,
    scale: 1.06,
    opacity: 0,
    duration: 0.75,
    stagger: 0.08,
    ease: "power3.out",
    transformOrigin: "0% 100%",
    scrollTrigger: { trigger: root, start: "top 80%" },
  });
  const slide = { trigger: root, start: "top 72%", end: "top 42%", scrub: 0.5 };
  if (left) gsap.from(left, { x: -72, opacity: 0, ease: "none", scrollTrigger: { ...slide } });
  if (right) gsap.from(right, { x: 72, opacity: 0, ease: "none", scrollTrigger: { ...slide } });
  if (frames[0]) {
    gsap.from(frames[0], {
      clipPath: "inset(0 100% 0 0)",
      ease: "none",
      scrollTrigger: { trigger: root, start: "top 70%", end: "top 40%", scrub: 0.5 },
    });
  }
  if (frames[1]) {
    gsap.from(frames[1], {
      clipPath: "inset(0 0 0 100%)",
      ease: "none",
      scrollTrigger: { trigger: root, start: "top 70%", end: "top 40%", scrub: 0.5 },
    });
  }
  const pictures = root.querySelectorAll("[data-frame] img");
  if (pictures.length) {
    gsap.fromTo(
      pictures,
      { scale: 1.16 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top 85%", end: "bottom top", scrub: true },
      },
    );
  }
}

export function BackendWork() {
  const items = backendProjects();
  const ref = useScene(stageBackend);

  return (
    <section className="home-block theme-bone" id="apis" aria-labelledby="api-title" ref={ref}>
      <header className="section-head">
        <p className="eyebrow" data-reveal>
          Backend and APIs
        </p>
        <h2 id="api-title" data-reveal>
          Services the screens call.
        </h2>
        <p data-reveal>Outfit search and colour analysis stand on their own. The studies stay on the routes, the failures, and what is not deployed.</p>
      </header>
      <div className="api-flowline" aria-hidden="true">
        <span data-flow />
      </div>
      <div className="api-grid">
        {items.map((project) => {
          const shot = project.shots[0];
          return (
            <article className="study-card" data-card key={project.slug}>
              {shot ? (
                <div className="shot shot-plate">
                  <Media src={shot.src} alt="" width={shot.width} height={shot.height} sizes="(min-width: 800px) 46vw, 100vw" />
                </div>
              ) : null}
              <div className="gallery-body">
                <p className="gallery-kicker">{project.kicker}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <TagList items={project.stack.slice(0, 5)} />
                <div className="study-links">
                  <Link className="text-link" href={`/work/${project.slug}`}>
                    Case study
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ProfessionalWork() {
  const items = professionalProjects().filter((project) => stripSlugs.includes(project.slug));
  const ordered = stripSlugs
    .map((slug) => items.find((project) => project.slug === slug))
    .filter((project) => project !== undefined);
  const ref = useScene(stageProfessional);

  return (
    <section className="home-block theme-ink pro-stage" id="professional" aria-labelledby="professional-title" ref={ref}>
      <header className="section-head">
        <p className="eyebrow" data-reveal>
          Professional work · 2024–2026
        </p>
        <h2 id="professional-title" data-reveal>
          Anonymised studies from a games and media company.
        </h2>
        <p data-reveal>No codenames, and no internal detail. Three of the studies, then the rest of the index.</p>
      </header>
      <div className="pro-window">
        <div className="pro-track" data-track>
          {ordered.map((project) => {
            const shot = project.shots[0];
            return (
              <article className="study-card" data-card key={project.slug}>
                {shot ? (
                  <div className="shot shot-plate">
                    <Media src={shot.src} alt="" width={shot.width} height={shot.height} sizes="(min-width: 960px) 36rem, 100vw" />
                  </div>
                ) : null}
                <div className="gallery-body">
                  <p className="gallery-kicker">{roles[project.slug] ?? project.year}</p>
                  <h3>
                    <Link href={`/work/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p className="study-outcome">
                    <span>Outcome</span>
                    <span>{project.outcome}</span>
                  </p>
                  <div className="study-links">
                    <Link className="text-link" href={`/work/${project.slug}`}>
                      Case study
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <p className="home-more">
        <Link className="text-link" href="/work">
          See all work
        </Link>
      </p>
    </section>
  );
}

export function SystemPair() {
  const ref = useScene(stageSystems);

  return (
    <section className="home-block theme-bone" id="systems" aria-labelledby="systems-title" ref={ref}>
      <header className="section-head">
        <p className="eyebrow" data-reveal>
          Design systems
        </p>
        <h2 id="systems-title" data-reveal>
          Two systems, held to the same frame.
        </h2>
        <p data-reveal>Calibre is this site. Sutra UI is the gallery edition for the tools. The frames match, and neither one is the page.</p>
      </header>
      <div className="system-pair">
        <article className="system-tile" data-side="left">
          <div className="shot" data-frame>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/work/calibre/studio.webp")}
              alt="Calibre, the design system page: ivory ground, the name, and the measured stats"
              width={1440}
              height={900}
            />
          </div>
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
        <article className="system-tile" data-side="right">
          <div className="shot" data-frame>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/work/sutra-ui/home-dark.webp")}
              alt="Sutra UI in the dark theme, ivory type on a near-black page"
              width={1600}
              height={1000}
            />
          </div>
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
