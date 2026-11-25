"use client";

import { useEffect, useRef } from "react";

function Line({ text, italic = false }: { text: string; italic?: boolean }) {
  return (
    <span className={italic ? "kinetic kinetic-italic" : "kinetic"}>
      {text.split("").map((char, index) => (
        <span className="mask" key={`${char}-${index}`}>
          <span className="glyph" style={{ animationDelay: `${index * 38}ms` }}>
            <span className="glyph-magnet">{char}</span>
          </span>
        </span>
      ))}
    </span>
  );
}

/** Name lockup. Letters ease toward the pointer, then settle. */
export function KineticName() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const readyDelay = reduce.matches ? 0 : 1500;
    const readyTimer = window.setTimeout(() => root.classList.add("is-ready"), readyDelay);

    if (reduce.matches || !fine.matches) {
      return () => window.clearTimeout(readyTimer);
    }

    const glyphs = [...root.querySelectorAll<HTMLElement>(".glyph-magnet")];
    const current = glyphs.map(() => ({ x: 0, y: 0, heat: 0 }));
    const target = glyphs.map(() => ({ x: 0, y: 0, heat: 0 }));
    let raf = 0;
    let live = false;

    const paint = () => {
      let moving = false;
      glyphs.forEach((node, index) => {
        const c = current[index];
        const t = target[index];
        c.x += (t.x - c.x) * 0.16;
        c.y += (t.y - c.y) * 0.16;
        c.heat += (t.heat - c.heat) * 0.16;
        if (Math.abs(t.x - c.x) > 0.05 || Math.abs(t.y - c.y) > 0.05 || Math.abs(t.heat - c.heat) > 0.004) {
          moving = true;
        }
        node.style.transform = `translate3d(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px, 0)`;
        node.style.setProperty("--heat", c.heat.toFixed(3));
      });
      if (moving) {
        raf = requestAnimationFrame(paint);
        return;
      }
      live = false;
      glyphs.forEach((node, index) => {
        if (target[index].x === 0 && target[index].y === 0 && target[index].heat === 0) {
          node.style.transform = "";
          node.style.setProperty("--heat", "0");
        }
      });
    };

    const kick = () => {
      if (live) return;
      live = true;
      raf = requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      glyphs.forEach((node, index) => {
        const rect = node.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const pull = Math.max(0, 1 - dist / 210);
        const eased = pull * pull;
        target[index].x = (dx / dist) * eased * 18;
        target[index].y = (dy / dist) * eased * 12;
        target[index].heat = eased;
      });
      kick();
    };

    const onLeave = () => {
      target.forEach((item) => {
        item.x = 0;
        item.y = 0;
        item.heat = 0;
      });
      kick();
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      window.clearTimeout(readyTimer);
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <h1 ref={ref} className="kinetic-name">
      <Line text="Akhilendra" />
      <Line text="Singh" italic />
    </h1>
  );
}
