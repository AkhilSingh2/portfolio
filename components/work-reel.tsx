"use client";

import Link from "next/link";
import { LiveLink, liveDomain } from "@/components/live-link";
import { Media } from "@/components/media";
import { useEffect, useRef } from "react";
import type { Project } from "@/lib/projects";

const openMask = "inset(0% 0% 0% 0%)";

export function WorkReel({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const desktopQuery = window.matchMedia("(min-width: 960px)");
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
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
      document.documentElement.classList.remove("enhance");
    };

    const setup = async () => {
      const mine = ++token;
      destroy();
      if (reduceQuery.matches) return;
      const film = desktopQuery.matches;
      document.documentElement.classList.toggle("enhance", film);

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (dead || mine !== token || reduceQuery.matches) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", root);
        if (!slides.length) return;

        if (!film) {
          slides.forEach((slide) => {
            const type = slide.querySelector("[data-type]");
            gsap.set(slide.querySelector("[data-mask]"), { clipPath: openMask });
            gsap.set(slide.querySelector("img"), { scale: 1 });
            if (type) {
              gsap.from(type, {
                y: 16,
                duration: 0.55,
                ease: "power3.out",
                scrollTrigger: { trigger: slide, start: "top 88%", toggleActions: "play none none none" },
              });
            }
          });
          return;
        }

        const setCurrent = (index: number) => {
          slides.forEach((slide, slideIndex) => {
            if (slideIndex === index) slide.removeAttribute("inert");
            else slide.setAttribute("inert", "");
          });
        };

        gsap.set(slides, { autoAlpha: 0 });
        gsap.set(slides[0], { autoAlpha: 1 });
        setCurrent(0);

        const beat = 1;
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * slides.length * 0.95}`,
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const settled = Math.min(slides.length - 1, Math.round(self.progress * (slides.length - 1)));
              setCurrent(self.progress > 0.98 ? slides.length - 1 : settled);
            },
          },
        });

        slides.forEach((slide, index) => {
          const mask = slide.querySelector("[data-mask]");
          const image = slide.querySelector("img");
          const type = slide.querySelector("[data-type]");
          const start = index * beat;
          if (index > 0) {
            timeline.fromTo(slide, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 }, start);
            timeline.to(slides[index - 1], { autoAlpha: 0, duration: 0.22 }, start);
          }
          if (type) gsap.set(type, { opacity: 1, y: 0, scale: 1 });
          if (mask) gsap.set(mask, { clipPath: openMask });
          if (image) gsap.set(image, { scale: 1 });
        });
      }, root);

      const refresh = () => {
        if (!dead && mine === token) ScrollTrigger.refresh();
      };
      window.addEventListener("load", refresh);
      void document.fonts.ready.then(refresh);
      revert = () => {
        window.removeEventListener("load", refresh);
        ctx.revert();
      };
      refresh();
    };

    const start = () => {
      if (started) return;
      started = true;
      void setup();
      desktopQuery.addEventListener("change", onChange);
      reduceQuery.addEventListener("change", onChange);
    };
    const onChange = () => {
      started = false;
      start();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) start();
      },
      { rootMargin: "240px" },
    );
    observer.observe(root);

    return () => {
      dead = true;
      observer.disconnect();
      desktopQuery.removeEventListener("change", onChange);
      reduceQuery.removeEventListener("change", onChange);
      destroy();
    };
  }, [projects.length]);

  return (
    <section className="reel theme-ink" id="work" ref={rootRef} aria-label="Selected work">
      <div className="reel-stage">
        <p className="reel-kicker">
          <span className="eyebrow">Selected work</span>
          <Link href="/work" className="reel-all">
            See all work
          </Link>
        </p>
        {projects.map((project, index) => {
          const shot = project.shots[0];
          return (
            <article className="reel-slide" data-slide key={project.slug}>
              <div className="reel-frame" data-frame>
                <div className="reel-mask" data-mask>
                  {shot ? (
                    <Media src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} priority={index === 0} />
                  ) : null}
                </div>
              </div>
              <div className="reel-copy" data-copy>
                <div className="reel-type" data-type>
                  <p className="reel-index">
                    <span>
                      {String(index + 1).padStart(2, "0")}
                      <span className="reel-total"> / {String(projects.length).padStart(2, "0")}</span>
                    </span>
                  </p>
                  <h2>{project.title}</h2>
                  <p>{project.summary}</p>
                  <span className="reel-links">
                    <Link href={`/work/${project.slug}`} transitionTypes={["nav-forward"]} className="text-link">
                      Case study
                    </Link>
                    {project.live ? <LiveLink href={project.live} domain={liveDomain(project.liveLabel)} /> : null}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
