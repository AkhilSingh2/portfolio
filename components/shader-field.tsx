"use client";

import { useEffect, useRef } from "react";

/**
 * Champagne spotlight clipped to the hero.
 * Fine pointers lerp toward the cursor. Touch drifts on its own.
 * Reduced motion leaves the light where the stylesheet put it.
 */
export function ShaderField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduce.matches) return;

    let tx = 0.74;
    let ty = 0.22;
    let x = tx;
    let y = ty;
    let raf = 0;
    let running = true;
    let visible = true;
    let drift = 0;
    const pointer = fine.matches;

    const paint = () => {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      el.style.setProperty("--lx", x.toFixed(4));
      el.style.setProperty("--ly", y.toFixed(4));
      el.style.setProperty("--dx", (x - 0.5).toFixed(4));
      el.style.setProperty("--dy", (y - 0.4).toFixed(4));
    };

    const frame = () => {
      if (!running || !visible) {
        raf = 0;
        return;
      }
      if (!pointer) {
        drift += 0.0042;
        tx = 0.66 + Math.sin(drift) * 0.16;
        ty = 0.3 + Math.cos(drift * 0.67) * 0.11;
      }
      paint();
      const settled = pointer && Math.abs(tx - x) < 0.0006 && Math.abs(ty - y) < 0.0006;
      if (settled) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && running && visible) raf = requestAnimationFrame(frame);
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      tx = Math.min(1.05, Math.max(-0.05, (event.clientX - rect.left) / rect.width));
      ty = Math.min(1.05, Math.max(-0.05, (event.clientY - rect.top) / rect.height));
      start();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(el);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
        raf = 0;
      } else {
        running = true;
        start();
      }
    };

    const onReduce = () => {
      if (!reduce.matches) return;
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
      el.style.removeProperty("--lx");
      el.style.removeProperty("--ly");
      el.style.removeProperty("--dx");
      el.style.removeProperty("--dy");
    };

    if (pointer) window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    reduce.addEventListener("change", onReduce);
    start();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      reduce.removeEventListener("change", onReduce);
    };
  }, []);

  return (
    <div className="shader-field" ref={ref} aria-hidden="true">
      <span className="spot" />
      <span className="parallax parallax-mid">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
      </span>
      <span className="parallax parallax-near">
        <span className="orb orb-c" />
      </span>
    </div>
  );
}
