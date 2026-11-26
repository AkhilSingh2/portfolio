"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LiveLink, liveDomain } from "@/components/live-link";
import { Media } from "@/components/media";
import { ThreadField } from "@/components/thread-field";
import { threadChapters } from "@/lib/thread-chapters";
import type { Shot } from "@/lib/projects";
import { person } from "@/lib/site";

const chapters = threadChapters();

function framesFor(chapter: (typeof chapters)[number]): { projectTitle: string; slug: string; live?: string; liveLabel?: string; shot: Shot }[] {
  if (chapter.projects.length === 1) {
    const project = chapter.projects[0];
    return project.shots.slice(0, 2).map((shot, shotIndex) => ({
      projectTitle: shot.caption || project.title,
      slug: project.slug,
      live: shotIndex === 0 ? project.live : undefined,
      liveLabel: shotIndex === 0 ? project.liveLabel : undefined,
      shot,
    }));
  }
  return chapter.projects.slice(0, 3).flatMap((project) => {
    const shot = project.shots[0];
    if (!shot) return [];
    return [{ projectTitle: project.title, slug: project.slug, live: project.live, liveLabel: project.liveLabel, shot }];
  });
}

export function ThreadHome() {
  const rootRef = useRef<HTMLElement>(null);
  const [light, setLight] = useState<{ shot: Shot; title: string } | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 960px)");
    const chaptersEls = [...root.querySelectorAll<HTMLElement>("[data-chapter]")];
    let dead = false;
    let revert: (() => void) | undefined;

    const publish = (progress: number, activeIndex?: number) => {
      const clamped = Math.min(1, Math.max(0, progress));
      document.documentElement.dataset.threadProgress = clamped.toFixed(4);
      const index = activeIndex ?? Math.min(chaptersEls.length - 1, Math.round(clamped * (chaptersEls.length - 1)));
      chaptersEls.forEach((chapter, chapterIndex) => chapter.classList.toggle("is-active", chapterIndex === index));
    };

    if (reduce.matches || !desktop.matches) {
      const onScroll = () => {
        const rect = root.getBoundingClientRect();
        const total = root.offsetHeight - window.innerHeight;
        publish(total > 0 ? -rect.top / total : 0);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        delete document.documentElement.dataset.threadProgress;
      };
    }

    document.documentElement.classList.add("enhance");
    publish(0);

    const run = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.set(chaptersEls, { autoAlpha: 0 });
        gsap.set(chaptersEls[0], { autoAlpha: 1 });
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * chaptersEls.length * 0.85}`,
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => publish(self.progress, Math.min(chaptersEls.length - 1, Math.floor(self.progress * timeline.duration() + 0.04))),
          },
        });
        chaptersEls.forEach((chapter, index) => {
          const frames = chapter.querySelectorAll(".thread-shot");
          if (index > 0) {
            timeline.fromTo(chapter, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16 }, index);
            timeline.to(chaptersEls[index - 1], { autoAlpha: 0, duration: 0.16 }, index);
            if (frames.length) {
              timeline.fromTo(frames, { clipPath: "inset(8% 6% 8% 6%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.22 }, index);
            }
          } else if (frames.length) {
            gsap.set(frames, { clipPath: "inset(0% 0% 0% 0%)" });
          }
        });
      }, root);
      revert = () => ctx.revert();
      ScrollTrigger.refresh();
    };
    void run();

    return () => {
      dead = true;
      revert?.();
      delete document.documentElement.dataset.threadProgress;
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
        {chapters.map((chapter, index) => {
          const frames = framesFor(chapter);
          return (
            <article
              className={`thread-chapter${index === 0 ? " is-active" : ""}`}
              data-chapter={chapter.id}
              id={chapter.id === "surface" ? "work" : chapter.id === "scale" ? "professional" : undefined}
              key={chapter.id}
            >
              <p className="thread-kicker">
                <span>{String(index).padStart(2, "0")}</span>
                <span aria-hidden="true">—</span>
                <span>{chapter.label}</span>
              </p>
              <h2>
                {chapter.title} <em>{chapter.accent}</em>.
              </h2>
              <p className="thread-intro">{chapter.intro}</p>
              {frames.length ? (
                <ul className="thread-screens">
                  {frames.map((frame) => (
                    <li key={`${frame.slug}-${frame.shot.src}`}>
                      <button type="button" className="thread-shot" onClick={() => setLight({ shot: frame.shot, title: frame.projectTitle })}>
                        <Media src={frame.shot.src} alt={frame.shot.alt} width={frame.shot.width} height={frame.shot.height} sizes="(min-width: 960px) 30vw, 100vw" priority={index === 1} />
                      </button>
                      <div className="thread-meta">
                        <Link href={`/work/${frame.slug}`}>{frame.projectTitle}</Link>
                        {frame.live ? <LiveLink href={frame.live} domain={liveDomain(frame.liveLabel)} /> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="thread-birth">A cursor meets the ink. The thread starts here.</p>
              )}
              {chapter.signature ? (
                <p className="thread-sign">
                  <span>{person.name.split(" ")[0]}</span>
                  <Link href="/contact">Write a note</Link>
                </p>
              ) : null}
            </article>
          );
        })}
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
