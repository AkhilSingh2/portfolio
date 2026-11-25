"use client";

import { useEffect, useRef } from "react";

const lines = ["Design the interface.", "Build the system behind it.", "Ship it."];

const stages = [
  { index: "01", title: "Design", note: "The interface" },
  { index: "02", title: "Build", note: "The system" },
  { index: "03", title: "Ship", note: "The release" },
];

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
      document.documentElement.classList.toggle("enhance", mq.matches);
      if (!mq.matches) return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (dead || mine !== token || !mq.matches) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>("[data-line]", root);
        const figure = root.querySelector<HTMLElement>(".practice-figure");
        const mark = (index: number) => {
          if (figure) figure.dataset.stage = String(index);
        };
        gsap.set(items, { autoAlpha: 0, y: 24 });
        gsap.set(items[0], { autoAlpha: 1, y: 0 });
        mark(0);
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.35}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        });
        items.forEach((item, index) => {
          if (index === 0) return;
          timeline.to(items[index - 1], { autoAlpha: 0, y: -20, duration: 0.35 }, index - 0.15);
          timeline.to(item, { autoAlpha: 1, y: 0, duration: 0.45 }, index - 0.05);
          timeline.call(mark, [index], index - 0.02);
        });
      }, root);
      revert = () => ctx.revert();
    };

    const onChange = () => {
      void setup();
    };
    let armed = false;
    const arm = () => {
      if (armed) return;
      armed = true;
      void setup();
      mq.addEventListener("change", onChange);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) arm();
      },
      { rootMargin: "120px" },
    );
    observer.observe(root);
    return () => {
      dead = true;
      observer.disconnect();
      mq.removeEventListener("change", onChange);
      revert?.();
    };
  }, []);

  return (
    <section className="manifesto theme-ink" id="practice" ref={rootRef} aria-labelledby="practice-title">
      <div className="manifesto-stage">
        <p className="eyebrow">01 — Practice</p>
        <h2 id="practice-title" className="sr-only">
          Design the interface. Build the system behind it. Ship it.
        </h2>
        <div className="manifesto-lines" aria-hidden="true">
          {lines.map((line) => (
            <p key={line} data-line>
              {line}
            </p>
          ))}
        </div>
        <figure className="practice-figure" data-stage="0" aria-hidden="true">
          <svg className="practice-mark" viewBox="0 0 24 148">
            <line className="mark-track" x1="8" y1="8" x2="8" y2="140" />
            <line className="mark-draw" pathLength="1" x1="8" y1="8" x2="8" y2="140" />
            <circle cx="8" cy="8" r="3.2" />
            <circle cx="8" cy="74" r="3.2" />
            <circle cx="8" cy="140" r="3.2" />
          </svg>
          <ol>
            {stages.map((stage) => (
              <li className="practice-card" key={stage.index}>
                <span>{stage.index}</span>
                <strong>{stage.title}</strong>
                <em>{stage.note}</em>
              </li>
            ))}
          </ol>
        </figure>
      </div>
    </section>
  );
}
