"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { KineticName } from "@/components/kinetic-name";
import { Magnetic } from "@/components/magnetic";
import { ShaderField } from "@/components/shader-field";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let dead = false;
    let revert: (() => void) | undefined;
    const run = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const copy = root.querySelector(".hero-copy");
        if (!copy) return;
        gsap.to(copy, {
          yPercent: -10,
          scale: 1.05,
          opacity: 0.35,
          ease: "none",
          transformOrigin: "0% 40%",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
      }, root);
      revert = () => ctx.revert();
    };
    void run();
    return () => {
      dead = true;
      revert?.();
    };
  }, []);

  return (
    <section className="hero theme-ink" ref={ref}>
      <ShaderField />
      <div className="hero-copy">
        <p className="eyebrow">
          <span>Full-stack engineer</span>
          <span className="dot" aria-hidden="true" />
          <span>Bangalore</span>
        </p>
        <KineticName />
        <p className="lede hero-lede">
          I design the interface and I stay through the API, the model, and the release.
        </p>
        <div className="hero-actions">
          <Magnetic>
            <Link className="btn btn-solid" href="/#work">
              Selected work
            </Link>
          </Magnetic>
          <Magnetic>
            <Link className="btn btn-ghost" href="/contact">
              Contact
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
