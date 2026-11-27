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
      const dpr = phone ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
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
      const scale = Math.min(width * (phone ? 0.98 : 0.9) / Math.max(1, maxX - minX), height * (phone ? 0.96 : 0.86) / Math.max(1, maxY - minY));
      const yShift = phone ? -height * 0.02 : 0;
      const stride = phone ? 4 : 1;
      let drawn = strokes;
      let dot: { x: number; y: number; r: number; a: number } | null = null;
      if (shape === "knot") {
        const published = Number.parseFloat(document.documentElement.dataset.threadExit || "");
        let exit = Number.isFinite(published) ? published : 0;
        if (!phone && !Number.isFinite(published)) {
          const heading = document.querySelector(".ground h2");
          const headingTop = heading?.getBoundingClientRect().top ?? window.innerHeight * 2;
          const start = window.innerHeight * 1.02;
          const done = window.innerHeight * 0.7;
          exit = headingTop >= start ? 0 : Math.min(1, (start - headingTop) / (start - done));
        }
        const unwound = unwindDrawing(strokes, exit);
        if (!unwound) return;
        drawn = unwound.strokes;
        dot = unwound.dot;
      }
      const samples: { x: number; y: number }[] = [];
      for (const stroke of drawn) {
        if (stroke.length < 2) continue;
        ctx.beginPath();
        for (let index = 0; index < stroke.length; index += stride) {
          const x = width / 2 + stroke[index].x * scale;
          const y = height / 2 + yShift + stroke[index].y * scale;
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          if (!phone && index % 8 === 0) samples.push({ x, y });
        }
        const last = stroke[stroke.length - 1];
        ctx.lineTo(width / 2 + last.x * scale, height / 2 + yShift + last.y * scale);
        ctx.stroke();
      }
      if (dot && dot.a > 0.02) {
        ctx.save();
        ctx.globalAlpha = dot.a;
        ctx.fillStyle = "rgba(243, 236, 223, 0.95)";
        if (!phone) {
          ctx.shadowColor = "rgba(212, 196, 168, 0.95)";
          ctx.shadowBlur = 12;
        }
        ctx.beginPath();
        ctx.arc(width / 2 + dot.x * scale, height / 2 + yShift + dot.y * scale, phone ? 4 : Math.min(6.5, Math.max(1.6, dot.r * scale)), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      if (phone) return;
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
    if (phone) {
      draw();
      let widthSeen = window.innerWidth;
      const onResize = () => {
        if (window.innerWidth === widthSeen) return;
        widthSeen = window.innerWidth;
        draw();
      };
      window.addEventListener("resize", onResize);
      let frame = 0;
      let lastExit = "";
      const watch = () => {
        const exit = document.documentElement.dataset.threadExit || "";
        if (exit !== lastExit) {
          lastExit = exit;
          draw();
        }
        frame = window.requestAnimationFrame(watch);
      };
      if (shape === "knot") frame = window.requestAnimationFrame(watch);
      return () => {
        window.removeEventListener("resize", onResize);
        if (frame) window.cancelAnimationFrame(frame);
      };
    }
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
    let placedActive = -1;
    let placedWave = "";

    const place = (progress: number) => {
      const clamped = Math.min(1, Math.max(0, progress));
      const cursor = clamped * (beats.length - 1);
      const activeIndex = Math.min(beats.length - 1, Math.max(0, Math.round(cursor)));
      if (activeIndex !== placedActive) {
        cards.forEach((card, index) => {
          const active = index === activeIndex;
          card.style.opacity = active ? "1" : "0";
          card.style.visibility = active ? "visible" : "hidden";
          card.style.pointerEvents = active ? "auto" : "none";
          card.style.zIndex = active ? "2" : "1";
          card.classList.toggle("is-active", active);
        });
      }
      document.documentElement.dataset.threadProgress = clamped.toFixed(4);
      const wave = contentWave(clamped, beats.length);
      const waveKey = `${wave.x.toFixed(3)}:${wave.scale.toFixed(3)}`;
      if (waveKey !== placedWave) {
        placedWave = waveKey;
        root.style.setProperty("--content-x", wave.x.toFixed(4));
        root.style.setProperty("--content-scale", wave.scale.toFixed(4));
        window.__contentX = wave.x;
      }
      if (activeIndex !== placedActive) {
        placedActive = activeIndex;
        const shell = root.closest(".thread-shell");
        const copy = cards[activeIndex]?.querySelector(".thread-copy");
        if (shell instanceof HTMLElement && copy instanceof HTMLElement) {
          const spare = (root.offsetHeight - copy.offsetHeight) / 2 - 96;
          shell.style.marginBottom = spare > 48 ? `-${Math.round(spare)}px` : "";
        }
      }
    };

    const phoneShot = new Array<number>(cards.length).fill(-1);
    const phoneText = new Array<number>(cards.length).fill(-1);
    let held = 0;
    const placePhone = (progress: number) => {
      const clamped = Math.min(1, Math.max(0, progress));
      const cursor = clamped * (beats.length - 1);
      if (cursor >= held + 0.7) held = Math.min(beats.length - 1, Math.floor(cursor + 0.3));
      else if (cursor < held - 0.2) held = Math.max(0, Math.floor(cursor + 0.2));
      for (let cardIndex = 0; cardIndex < cards.length; cardIndex += 1) {
        const distance = Math.abs(cardIndex - cursor);
        const shot = reduce.matches ? (cardIndex === held ? 1 : 0) : distance >= 1 ? 0 : distance <= 0.12 ? 1 : Math.max(0, 1 - (distance - 0.12) / 0.88);
        const text = cardIndex === held ? 1 : 0;
        const card = cards[cardIndex];
        if (Math.abs(shot - phoneShot[cardIndex]) >= 0.015) {
          phoneShot[cardIndex] = shot;
          const frame = card.querySelector<HTMLElement>(".thread-shot");
          if (frame) frame.style.opacity = shot.toFixed(3);
          const mark = card.querySelector<HTMLElement>(".beat-mark");
          if (mark) mark.style.opacity = (frame ? shot : text).toFixed(3);
        }
        if (text !== phoneText[cardIndex]) {
          phoneText[cardIndex] = text;
          const copy = card.querySelector<HTMLElement>(".thread-copy");
          if (copy) copy.style.opacity = String(text);
          card.style.pointerEvents = text ? "auto" : "none";
          card.style.zIndex = text ? "2" : "1";
          card.classList.toggle("is-active", text === 1);
        }
      }
      const key = clamped.toFixed(3);
      if (document.documentElement.dataset.threadProgress !== key) document.documentElement.dataset.threadProgress = key;
    };

    if (!desktop.matches) {
      document.documentElement.classList.add("thread-phone");
      root.querySelectorAll<HTMLImageElement>(".thread-shot img").forEach((img) => {
        img.decoding = "sync";
        img.loading = "eager";
        if (img.decode) img.decode().catch(() => undefined);
      });
      placePhone(0);
      const runPhone = async () => {
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        const { gsap } = await import("gsap");
        if (dead) return;
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });
        const exitShare = 0.7 / (beats.length - 1 + 0.7);
        const storyHeight = Math.round(window.innerHeight * (beats.length - 1 + 0.7));
        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: `+=${storyHeight}`,
          pin: true,
          anticipatePin: 0,
          invalidateOnRefresh: false,
          onUpdate: (self) => {
            const storySpan = 1 - exitShare;
            const story = Math.min(1, self.progress / storySpan);
            const exit = Math.max(0, (self.progress - storySpan) / exitShare);
            placePhone(story);
            document.documentElement.dataset.threadExit = exit.toFixed(4);
          },
        });
        revert = () => trigger.kill();
        ScrollTrigger.refresh();
      };
      void runPhone();
      return () => {
        dead = true;
        revert?.();
        document.documentElement.classList.remove("thread-phone");
        delete document.documentElement.dataset.threadProgress;
        delete document.documentElement.dataset.threadExit;
      };
    }

    if (reduce.matches) {
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
