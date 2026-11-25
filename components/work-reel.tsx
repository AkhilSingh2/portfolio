"use client";

import Link from "next/link";
import { Media } from "@/components/media";
import { useEffect, useRef } from "react";
import { TagList } from "@/components/tag";
import type { Project } from "@/lib/projects";

export function WorkReel({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia("(min-width: 960px) and (prefers-reduced-motion: no-preference)");
    let token = 0;
    let dead = false;
    let started = false;
    let revert: (() => void) | undefined;

    const clearInert = () => {
      root.querySelectorAll<HTMLElement>("[data-slide]").forEach((slide) => {
        slide.removeAttribute("inert");
      });
    };

    const destroy = () => {
      revert?.();
      revert = undefined;
      clearInert();
    };

    const setup = async () => {
      const mine = ++token;
      destroy();
      const film = mq.matches;
      document.documentElement.classList.toggle("enhance", film);
      if (!film) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (dead || mine !== token || !mq.matches) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", root);
        const frames = slides.map((slide) => slide.querySelector<HTMLElement>("[data-frame]"));
        const copies = slides.map((slide) => slide.querySelector<HTMLElement>("[data-copy]"));
        if (frames.some((frame) => !frame) || copies.some((copy) => !copy)) return;

        const restBox = () => ({
          top: "23%",
          left: "46%",
          width: "49%",
          height: "54%",
          right: "auto",
          bottom: "auto",
        });
        const fullBox = () => ({
          top: "8%",
          left: "6%",
          width: "88%",
          height: "84%",
          right: "auto",
          bottom: "auto",
        });
        const beat = 1;

        const setCurrent = (index: number) => {
          slides.forEach((slide, slideIndex) => {
            if (slideIndex === index) slide.removeAttribute("inert");
            else slide.setAttribute("inert", "");
          });
        };

        gsap.set(frames, { ...fullBox(), autoAlpha: 0 });
        gsap.set(frames[0], { ...restBox(), autoAlpha: 1 });
        gsap.set(copies, { autoAlpha: 1, y: 0 });
        gsap.set(slides, { autoAlpha: 0 });
        gsap.set(slides[0], { autoAlpha: 1 });
        setCurrent(0);

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * slides.length}`,
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const settled = Math.min(slides.length - 1, Math.round(self.progress * (slides.length - 1)));
              setCurrent(self.progress > 0.98 ? slides.length - 1 : settled);
            },
          },
        });

        slides.forEach((_, index) => {
          const start = index * beat;
          if (index > 0) {
            timeline.set(slides[index - 1], { autoAlpha: 0 }, start);
            timeline.set(slides[index], { autoAlpha: 1 }, start);
            timeline.fromTo(frames[index], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, start);
            timeline.fromTo(frames[index], fullBox(), { ...restBox(), duration: 0.38 }, start);
          }
          if (index < slides.length - 1) {
            timeline.to(frames[index], { ...fullBox(), duration: 0.3 }, start + 0.52);
          } else {
            timeline.to(frames[index], { duration: 0.35 }, start + 0.55);
          }
        });
      }, root);

      revert = () => ctx.revert();
      ScrollTrigger.refresh();
    };

    const start = () => {
      if (started) return;
      started = true;
      void setup();
      mq.addEventListener("change", onChange);
    };
    const onChange = () => {
      void setup();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) start();
      },
      { rootMargin: "200px" },
    );
    observer.observe(root);

    return () => {
      dead = true;
      observer.disconnect();
      mq.removeEventListener("change", onChange);
      destroy();
    };
  }, [projects.length]);

  return (
    <section className="reel theme-ink" id="work" ref={rootRef} aria-label="Selected work">
      <div className="reel-stage">
        <p className="reel-kicker">
          <span className="eyebrow">03 — Selected work</span>
          <Link href="/work" className="reel-all">
            See all work
          </Link>
        </p>
        {projects.map((project, index) => {
          const shot = project.shots[0];
          return (
            <article className="reel-slide" data-slide key={project.slug}>
              <div className="reel-frame" data-frame>
                  {shot ? (
                    <Media src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} priority={index === 0} />
                  ) : null}
              </div>
              <div className="reel-copy" data-copy>
                <p className="reel-index">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                    <span className="reel-total"> / {String(projects.length).padStart(2, "0")}</span>
                  </span>
                </p>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
                <TagList items={project.stack.slice(0, 5)} />
                <Link href={`/work/${project.slug}`} transitionTypes={["nav-forward"]} className="text-link">
                  Case study
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
