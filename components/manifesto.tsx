"use client";

import { useEffect, useRef } from "react";

const lines = ["Design the interface.", "Build the system behind it.", "Ship it."];

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
        gsap.set(items, { autoAlpha: 0, y: 24 });
        gsap.set(items[0], { autoAlpha: 1, y: 0 });
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
        });
      }, root);
      revert = () => ctx.revert();
    };

    void setup();
    const onChange = () => {
      void setup();
    };
    mq.addEventListener("change", onChange);
    return () => {
      dead = true;
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
      </div>
    </section>
  );
}
