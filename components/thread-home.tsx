"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Media } from "@/components/media";
import { ResumeDownload } from "@/components/resume-download";
import { ThreadField } from "@/components/thread-field";
import { threadDrawings } from "@/lib/thread-art";
import { contentWave, threadLayouts } from "@/lib/thread-layout";
import { unwindDrawing } from "@/lib/thread-shapes";
import { applyVeil, holesForOverlap, publishVeil, renderVeil } from "@/lib/thread-veil";
import { getProject, type Shot } from "@/lib/projects";
import { person } from "@/lib/site";

type Beat = {
  id: string;
  shape: string;
  anchor?: string;
  hero?: boolean;
  close?: boolean;
  slug?: string;
  line?: string;
};

const beats: Beat[] = [
  { id: "tap", shape: "phone", hero: true },
  { id: "lyra", shape: "headphones", slug: "kinetic", anchor: "work" },
  { id: "chalisa", shape: "book", slug: "online-chalisa" },
  { id: "sutra", shape: "nib", slug: "sutra-ui" },
  { id: "tandem", shape: "bubbles", slug: "tandem" },
  { id: "buzzroom", shape: "buzzer", slug: "buzzroom" },
  { id: "mymirro", shape: "shirt", slug: "mymirro" },
  { id: "docmind", shape: "document", slug: "docmind" },
  { id: "quorum", shape: "microphone", slug: "meeting-actions" },
  { id: "pulse", shape: "chart", slug: "pulse" },
  { id: "cadence", shape: "stopwatch", slug: "cadence" },
  { id: "kwalee", shape: "globe", slug: "marketing-site", anchor: "professional", line: "Kwalee's public site, moved to Next.js. I led the migration." },
  { id: "launchpad", shape: "car", slug: "launchpad" },
  { id: "knot", shape: "knot", close: true },
];

function sentence(text: string) {
  const cut = text.split(/(?<=\.)\s/)[0];
  return cut || text;
}

function BeatMark({ shape }: { shape: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const phone = window.matchMedia("(max-width: 959px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!phone && !reduce) return;
    const strokes = threadDrawings[shape];
    if (!strokes) return;
    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(243, 236, 223, 0.55)";
      ctx.lineWidth = 1.35;
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (const stroke of strokes) {
        for (const point of stroke) {
          minX = Math.min(minX, point.x);
          maxX = Math.max(maxX, point.x);
          minY = Math.min(minY, point.y);
          maxY = Math.max(maxY, point.y);
        }
      }
      const scale = Math.min(width * 0.9 / Math.max(1, maxX - minX), height * 0.86 / Math.max(1, maxY - minY));
      const yShift = -height * 0.02;
      let drawn = strokes;
      let dot: { x: number; y: number; r: number; a: number } | null = null;
      if (shape === "knot") {
        const heading = document.querySelector(".ground h2");
        const headingTop = heading?.getBoundingClientRect().top ?? window.innerHeight * 2;
        const start = window.innerHeight * 1.02;
        const done = window.innerHeight * 0.7;
        const exit = headingTop >= start ? 0 : Math.min(1, (start - headingTop) / (start - done));
        const unwound = unwindDrawing(strokes, exit);
        if (!unwound) return;
        drawn = unwound.strokes;
        dot = unwound.dot;
      }
      const samples: { x: number; y: number }[] = [];
      for (const stroke of drawn) {
        let length = 0;
        for (let index = 1; index < stroke.length; index += 1) {
          length += Math.hypot(stroke[index].x - stroke[index - 1].x, stroke[index].y - stroke[index - 1].y);
        }
        if (length < 0.05) continue;
        ctx.beginPath();
        stroke.forEach((point, index) => {
          const x = width / 2 + point.x * scale;
          const y = height / 2 + yShift + point.y * scale;
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          if (index % 8 === 0) samples.push({ x, y });
        });
        ctx.stroke();
      }
      if (dot && dot.a > 0.02) {
        ctx.save();
        ctx.globalAlpha = dot.a;
        ctx.fillStyle = "rgba(212, 196, 168, 0.9)";
        ctx.shadowColor = "rgba(212, 196, 168, 0.95)";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(width / 2 + dot.x * scale, height / 2 + yShift + dot.y * scale, Math.min(6.5, Math.max(1.6, dot.r * scale)), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 20 || rect.bottom < 0 || rect.top > window.innerHeight) return;
      const score = Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2) + Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
      const current = window.__threadMarkScore;
      if (current !== undefined && score > current) return;
      window.__threadMarkScore = score;
      const pageSamples = samples.map((point) => ({ x: rect.left + point.x, y: rect.top + point.y }));
      window.__threadSamples = pageSamples;
      window.__threadShape = shape;
      const card = canvas.closest(".thread-beat");
      const copy = card?.querySelector(".thread-copy");
      const blocks = card
        ? [...card.querySelectorAll(".thread-copy h1, .thread-copy h2, .thread-copy p, .thread-copy a, .thread-shot")].map((node) => node.getBoundingClientRect())
        : [];
      const holes = holesForOverlap(pageSamples, blocks, rect);
      if (copy instanceof HTMLElement) copy.classList.toggle("is-veiled", holes.length > 0);
      if (!holes.length) {
        canvas.style.maskImage = "";
        canvas.style.setProperty("-webkit-mask-image", "");
        window.__threadVeil = () => 1;
      } else {
        const mask = renderVeil(rect.width, rect.height, holes);
        applyVeil(canvas, mask);
        publishVeil({ canvas: mask, left: rect.left, top: rect.top, width: rect.width, height: rect.height });
      }
      window.setTimeout(() => {
        delete window.__threadMarkScore;
      }, 0);
    };
    draw();
    const stage = canvas.closest(".thread-stage");
    window.addEventListener("resize", draw);
    window.addEventListener("scroll", draw, { passive: true });
    stage?.addEventListener("scroll", draw, { passive: true });
    return () => {
      window.removeEventListener("resize", draw);
      window.removeEventListener("scroll", draw);
      stage?.removeEventListener("scroll", draw);
    };
  }, [shape]);

  return <canvas ref={ref} className="beat-mark" width={320} height={180} aria-hidden="true" />;
}

export function ThreadHome() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [light, setLight] = useState<{ shot: Shot; title: string } | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 960px)");
    const cards = [...track.querySelectorAll<HTMLElement>(".thread-beat")];
    let dead = false;
    let revert: (() => void) | undefined;

    const place = (progress: number) => {
      const clamped = Math.min(1, Math.max(0, progress));
      const cursor = clamped * (beats.length - 1);
      cards.forEach((card, index) => {
        const active = index === Math.min(beats.length - 1, Math.max(0, Math.round(cursor)));
        card.style.transform = "translate3d(0, 0, 0)";
        card.style.opacity = active ? "1" : "0";
        card.style.visibility = active ? "visible" : "hidden";
        card.style.pointerEvents = active ? "auto" : "none";
        card.style.zIndex = active ? "2" : "1";
        card.classList.toggle("is-active", active);
        const shot = card.querySelector<HTMLElement>(".thread-shot");
        if (shot) shot.style.transform = "none";
      });
      document.documentElement.dataset.threadProgress = clamped.toFixed(4);
      const wave = contentWave(clamped, beats.length);
      root.style.setProperty("--content-x", wave.x.toFixed(4));
      root.style.setProperty("--content-scale", wave.scale.toFixed(4));
      window.__contentX = wave.x;
      const shell = root.closest(".thread-shell");
      const copy = root.querySelector(".thread-beat.is-active .thread-copy");
      if (shell instanceof HTMLElement && copy instanceof HTMLElement) {
        const spare = (root.offsetHeight - copy.offsetHeight) / 2 - 96;
        shell.style.marginBottom = spare > 48 ? `-${Math.round(spare)}px` : "";
      }
    };

    if (reduce.matches || !desktop.matches) {
      return () => {
        delete document.documentElement.dataset.threadProgress;
      };
    }

    document.documentElement.classList.add("enhance");
    place(0);

    const run = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { gsap } = await import("gsap");
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);
      const exitShare = 0.7 / (beats.length - 1 + 0.7);
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${window.innerHeight * (beats.length - 1 + 0.7)}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const storySpan = 1 - exitShare;
          const story = Math.min(1, self.progress / storySpan);
          const exit = Math.max(0, (self.progress - storySpan) / exitShare);
          place(story);
          document.documentElement.dataset.threadExit = exit.toFixed(4);
        },
      });
      revert = () => trigger.kill();
      ScrollTrigger.refresh();
    };
    void run();

    return () => {
      dead = true;
      revert?.();
      document.documentElement.classList.remove("enhance");
      delete document.documentElement.dataset.threadProgress;
      delete document.documentElement.dataset.threadExit;
    };
  }, []);

  useEffect(() => {
    if (!light) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLight(null);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [light]);

  return (
    <div className="thread-shell">
      <ThreadField />
      <section className="thread-home" id="thread" ref={rootRef} aria-label="The thread">
        <div className="thread-stage" data-obstacle>
          <div className="thread-track" ref={trackRef}>
            {beats.map((beat, index) => {
              const project = beat.slug ? getProject(beat.slug) : undefined;
              const shot = project?.shots.find((item) => item.src.includes("dashboard")) ?? project?.shots[0];
              return (
                <article
                  className={`thread-beat thread-chapter${index === 0 ? " is-active" : ""}`}
                  data-chapter={beat.id}
                  data-placement={threadLayouts[beat.shape]?.placement ?? "behind"}
                  data-shot={threadLayouts[beat.shape]?.shot ?? "left"}
                  id={beat.anchor}
                  key={beat.id}
                >
                  <BeatMark shape={beat.shape} />
                  <div className="thread-panel">
                  {beat.hero ? (
                    <div className="thread-copy">
                      <p className="thread-kicker">
                        <span>00</span>
                        <span aria-hidden="true">—</span>
                        <span>Tap</span>
                      </p>
                      <h1>{person.name}</h1>
                      <p className="thread-role">Full-stack engineer · frontend to backend, AI</p>
                      <p className="thread-intro">
                        I build the interface and the system behind it: screens, APIs, and the models that answer.
                      </p>
                      <p className="thread-status">{person.availability}</p>
                      <div className="thread-actions">
                        <Link className="btn btn-solid" href="/#work">
                          View work
                        </Link>
                        <ResumeDownload className="btn btn-ghost">Resume</ResumeDownload>
                      </div>
                      <p className="thread-tagline">
                        One tap, carried <em>end to end</em>.
                      </p>
                    </div>
                  ) : beat.close ? (
                    <div className="thread-copy">
                      <p className="thread-kicker">
                        <span>{String(index).padStart(2, "0")}</span>
                        <span aria-hidden="true">—</span>
                        <span>Return</span>
                      </p>
                      <h2>
                        The thread ties <em>off</em>.
                      </h2>
                      <p className="thread-intro">One line, from the first tap to the signature.</p>
                      <p className="thread-sign">
                        <span>{person.name}</span>
                      </p>
                    </div>
                  ) : project && shot ? (
                    <>
                      <div className="thread-screens">
                        <button type="button" className="thread-shot" onClick={() => setLight({ shot, title: project.title })}>
                          <Media src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(min-width: 960px) 50vw, 100vw" priority={index < 2} />
                        </button>
                      </div>
                      <div className="thread-copy">
                        <p className="thread-kicker">
                          <span>{String(index).padStart(2, "0")}</span>
                          <span aria-hidden="true">—</span>
                          <span>{project.kicker}</span>
                        </p>
                        <h2>{project.title}</h2>
                        <p className="thread-intro">{beat.line ?? sentence(project.summary)}</p>
                        <p className="thread-meta">
                          <Link href={`/work/${project.slug}`}>Case study</Link>
                          {project.live ? (
                            <a href={project.live} target="_blank" rel="noreferrer">
                              Live site <span aria-hidden="true">↗</span>
                            </a>
                          ) : null}
                          {project.repo ? (
                            <a href={project.repo} target="_blank" rel="noreferrer">
                              Code <span aria-hidden="true">↗</span>
                            </a>
                          ) : null}
                        </p>
                      </div>
                    </>
                  ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      {light ? (
        <div className="thread-lightbox" role="dialog" aria-modal="true" aria-label={light.title}>
          <button type="button" className="thread-lightbox-backdrop" aria-label="Close" onClick={() => setLight(null)} />
          <figure>
            <Media src={light.shot.src} alt={light.shot.alt} width={light.shot.width} height={light.shot.height} sizes="90vw" priority />
            <figcaption>
              {light.title}
              <button type="button" onClick={() => setLight(null)}>
                Close
              </button>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  );
}
