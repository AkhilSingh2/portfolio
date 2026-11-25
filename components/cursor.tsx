"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    document.documentElement.classList.add("has-cursor");
    const onMove = (event: PointerEvent) => {
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      const target = event.target instanceof Element ? event.target.closest("a, button, input, textarea, summary") : null;
      el.classList.toggle("is-hot", Boolean(target));
    };
    const onMagnet = (event: PointerEvent) => {
      document.querySelectorAll<HTMLElement>(".magnetic").forEach((node) => {
        node.style.transform = "";
      });
      const el = event.target instanceof Element ? event.target.closest<HTMLElement>(".magnetic") : null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
    };
    window.addEventListener("pointermove", onMagnet, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMagnet);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
