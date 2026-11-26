"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { href: "#playground", label: "Workbench" },
  { href: "#philosophy", label: "Principles" },
  { href: "#tokens", label: "Tokens" },
  { href: "#motion", label: "Motion" },
  { href: "#measured", label: "Measured" },
] as const;

export function CalibreNav() {
  const scroller = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<(typeof links)[number]["href"]>(links[0].href);

  useEffect(() => {
    const nav = document.querySelector(".site-nav");
    let frameId = 0;
    const measure = () => {
      if (!nav) return;
      const bottom = Math.ceil(nav.getBoundingClientRect().bottom);
      document.documentElement.style.setProperty("--nav-bottom", `${bottom}px`);
    };
    const schedule = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(measure);
    };
    measure();
    void document.fonts.ready.then(measure);
    const observer = new ResizeObserver(schedule);
    if (nav) observer.observe(nav);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  useEffect(() => {
    const nodes = links
      .map((link) => document.querySelector(link.href))
      .filter((node): node is Element => node instanceof Element);
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const next = visible[0]?.target.id;
        if (next) setActive(`#${next}` as (typeof links)[number]["href"]);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.2, 0.45] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const bar = scroller.current;
    if (!bar) return;
    const current = bar.querySelector<HTMLElement>(`[href="${active}"]`);
    if (!current) return;
    const left = current.offsetLeft - (bar.clientWidth - current.clientWidth) / 2;
    bar.scrollTo({ left: Math.max(0, left), behavior: "auto" });
  }, [active]);

  useEffect(() => {
    const bar = scroller.current;
    const shell = frame.current;
    if (!bar || !shell) return;
    const fade = () => {
      const max = bar.scrollWidth - bar.clientWidth;
      shell.style.setProperty("--fade-left", bar.scrollLeft > 6 ? "1" : "0");
      shell.style.setProperty("--fade-right", max - bar.scrollLeft > 6 ? "1" : "0");
    };
    fade();
    bar.addEventListener("scroll", fade, { passive: true });
    window.addEventListener("resize", fade);
    return () => {
      bar.removeEventListener("scroll", fade);
      window.removeEventListener("resize", fade);
    };
  }, []);

  return (
    <div className="calibre-nav-frame" ref={frame}>
      <nav className="calibre-nav" aria-label="On this page" ref={scroller}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={active === link.href ? "true" : undefined}
            onClick={() => {
              const target = document.querySelector(link.href);
              if (target instanceof HTMLDetailsElement) target.open = true;
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
