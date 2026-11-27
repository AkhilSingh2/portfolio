"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(max-width: 959px)").matches) {
      let frame = 0;
      let width = window.innerWidth;
      const paint = () => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        el.style.transform = `scaleX(${progress})`;
        document.documentElement.style.setProperty("--scroll", progress.toFixed(4));
      };
      const onScroll = () => {
        if (frame) return;
        frame = window.requestAnimationFrame(paint);
      };
      const onResize = () => {
        if (window.innerWidth === width) return;
        width = window.innerWidth;
        onScroll();
      };
      paint();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        if (frame) window.cancelAnimationFrame(frame);
      };
    }
    const onScroll = () => {
      const root = document.documentElement;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const max = root.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${progress})`;
      root.style.setProperty("--scroll", progress.toFixed(4));

      let reveal = 1;
      const footer = document.querySelector(".site-footer");
      if (!reduce && max > 0 && footer) {
        if (root.classList.contains("footer-reveal")) {
          const footerH = Number.parseFloat(getComputedStyle(root).getPropertyValue("--footer-h")) || footer.clientHeight;
          const into = window.scrollY - (max - footerH);
          reveal = footerH > 0 ? Math.min(1, Math.max(0, into / footerH)) : 1;
        } else {
          const rect = footer.getBoundingClientRect();
          reveal = 1 - Math.min(1, Math.max(0, rect.top / window.innerHeight));
        }
      }
      root.style.setProperty("--reveal", reveal.toFixed(4));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}
