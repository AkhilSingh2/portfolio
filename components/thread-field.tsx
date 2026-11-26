"use client";

import { useEffect, useRef } from "react";
import { threadDrawing, type Point } from "@/lib/thread-shapes";

type Rect = { left: number; top: number; right: number; bottom: number; width: number; height: number };
type Slot = { x: number; y: number; w: number; h: number };

declare global {
  interface Window {
    __threadSamples?: { x: number; y: number }[];
    __threadShape?: string;
    __threadMarkScore?: number;
  }
}

function readProgress() {
  const home = document.querySelector(".thread-home");
  if (!(home instanceof HTMLElement)) return 0;
  const spacer = home.closest(".pin-spacer");
  const host = spacer instanceof HTMLElement ? spacer : home;
  const top = host.getBoundingClientRect().top + window.scrollY;
  const span = Math.max(1, host.offsetHeight - window.innerHeight);
  return Math.min(1, Math.max(0, (window.scrollY - top) / span));
}

/** While the story is pinned the knot stays put. Once it unpins, the drawing leaves with that block and does not draw over Now. */
function storyMotion(): { shift: number } | null {
  const home = document.querySelector(".thread-home");
  if (!(home instanceof HTMLElement)) return null;
  const rect = home.getBoundingClientRect();
  if (rect.bottom < 72 || rect.top > 12) return null;
  const ground = document.querySelector(".ground");
  if (ground && rect.top < -8) {
    const groundTop = ground.getBoundingClientRect().top;
    if (groundTop < window.innerHeight * 0.42) return null;
  }
  return { shift: Math.min(0, rect.top) };
}

function shown(element: Element) {
  const chapter = element.closest(".thread-chapter");
  if (chapter) {
    const style = getComputedStyle(chapter);
    if (style.visibility === "hidden" || Number(style.opacity) < 0.35) return false;
  }
  const rect = element.getBoundingClientRect();
  return rect.width > 2 && rect.height > 2 && rect.bottom > 0 && rect.top < window.innerHeight;
}

function obstacles(): Rect[] {
  const nodes = document.querySelectorAll("[data-obstacle], header.site-nav, .thread-beat.is-active .thread-shot, .thread-beat.is-active .thread-copy, .thread-beat.is-active .thread-screens");
  return [...nodes].filter((element) => !element.closest(".ground") && shown(element)).map((element) => {
    const rect = element.getBoundingClientRect();
    const pad = 18;
    return {
      left: rect.left - pad,
      top: rect.top - pad,
      right: rect.right + pad,
      bottom: rect.bottom + pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    };
  });
}

function hits(points: { x: number; y: number }[], blocks: Rect[]) {
  return points.some((point) =>
    blocks.some((block) => point.x >= block.left && point.x <= block.right && point.y >= block.top && point.y <= block.bottom),
  );
}

function bands(blocks: Rect[]): Slot[] {
  const margin = 12;
  const top = 88;
  const bottom = window.innerHeight - margin;
  const wide = blocks.filter((block) => block.left < window.innerWidth * 0.75 && block.right > window.innerWidth * 0.25);
  const intervals = wide
    .map((block) => [Math.max(top, block.top), Math.min(bottom, block.bottom)] as [number, number])
    .filter(([start, end]) => end > start)
    .sort((a, b) => a[0] - b[0]);
  const slots: Slot[] = [];
  let cursor = top;
  for (const [start, end] of intervals) {
    if (start - cursor > 56) slots.push({ x: margin, y: cursor + 4, w: window.innerWidth - margin * 2, h: start - cursor - 8 });
    cursor = Math.max(cursor, end);
  }
  if (bottom - cursor > 56) slots.push({ x: margin, y: cursor + 4, w: window.innerWidth - margin * 2, h: bottom - cursor - 8 });
  return slots;
}

function anchorY() {
  const copy = document.querySelector(".thread-chapter.is-active .thread-copy");
  if (!copy) return null;
  const rect = copy.getBoundingClientRect();
  if (rect.height > 20 && rect.bottom > 48 && rect.top < window.innerHeight - 24) return rect.top + rect.height / 2;
  return null;
}

function slotsFor(blocks: Rect[]): Slot[] {
  const slots: Slot[] = [];
  const gap = document.querySelector(".thread-chapter.is-active .thread-gap");
  if (gap && shown(gap)) {
    const rect = gap.getBoundingClientRect();
    if (rect.width > 80 && rect.height > 72) slots.push({ x: rect.left + 10, y: rect.top + 8, w: rect.width - 20, h: rect.height - 16 });
  }
  const margin = 20;
  const content = blocks.filter((block) => block.right - block.left < window.innerWidth * 0.85);
  let contentRight = margin;
  for (const block of content) contentRight = Math.max(contentRight, block.right);
  const right: Slot = {
    x: contentRight + 16,
    y: 28,
    w: window.innerWidth - contentRight - margin - 16,
    h: window.innerHeight - 56,
  };
  if (right.w > 140 && right.h > 160) slots.push(right);
  slots.push(...bands(blocks));
  return slots.sort((a, b) => b.w * b.h - a.w * a.h);
}

function bounds(strokes: Point[][]) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const stroke of strokes) {
    for (const point of stroke) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
  }
  return { minX, maxX, minY, maxY, w: Math.max(0.001, maxX - minX), h: Math.max(0.001, maxY - minY) };
}

function place(drawing: Point[][], slot: Slot, blocks: Rect[], focusY: number) {
  const box = bounds(drawing);
  const phone = window.innerWidth < 960;
  const target = window.innerHeight * (phone ? 0.3 : 0.5);
  let scale = Math.min(target / box.h, (slot.w * 0.94) / box.w, (slot.h * 0.92) / box.h);
  const midX = (box.minX + box.maxX) / 2;
  const midY = (box.minY + box.maxY) / 2;
  const slotCx = slot.x + slot.w / 2;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    let originY = focusY - midY * scale;
    const top = originY + box.minY * scale;
    const bottom = originY + box.maxY * scale;
    if (top < slot.y) originY += slot.y - top;
    if (bottom > slot.y + slot.h) originY -= bottom - (slot.y + slot.h);
    const originX = slotCx - midX * scale;
    const strokes = drawing.map((stroke) => stroke.map((point) => ({ x: originX + point.x * scale, y: originY + point.y * scale })));
    if (!hits(strokes.flat(), blocks)) return strokes;
    scale *= 0.84;
  }
  return null;
}

function paint2d(ctx: CanvasRenderingContext2D, strokes: { x: number; y: number }[][]) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);
  if (!strokes.length) return;
  const phone = window.innerWidth < 960;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const points of strokes) {
    if (points.length < 2) continue;
    let length = 0;
    for (let index = 1; index < points.length; index += 1) length += Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y);
    if (length < 8) continue;
    ctx.strokeStyle = "rgba(212, 196, 168, 0.28)";
    ctx.lineWidth = phone ? 5 : 8;
    ctx.shadowColor = "rgba(212, 196, 168, 0.8)";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    points.forEach((point, index) => (index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)));
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(243, 236, 223, 0.95)";
    ctx.lineWidth = phone ? 1.15 : 1.45;
    ctx.stroke();
  }
  ctx.restore();
}

export function ThreadField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = window.matchMedia("(max-width: 959px)").matches;
    if (reduce || phone) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const webgl = !reduce && !phone && !saveData;

    let dead = false;
    let running = true;
    let frame = 0;
    const host = canvas.parentElement;

    const watch = new IntersectionObserver((entries) => {
      running = entries.some((entry) => entry.isIntersecting);
    });
    if (host) watch.observe(host);

    const layout = () => {
      const motion = storyMotion();
      if (!running || !motion) {
        window.__threadSamples = [];
        return [];
      }
      const focus = anchorY();
      if (focus == null) {
        window.__threadSamples = [];
        return [];
      }
      const drawing = threadDrawing(readProgress(), { reduced: reduce });
      const blocks = obstacles();
      for (const slot of slotsFor(blocks)) {
        const strokes = place(drawing.strokes, slot, blocks, focus);
        if (strokes) {
          window.__threadSamples = strokes.flat();
          window.__threadShape = drawing.name;
          return strokes;
        }
      }
      window.__threadSamples = [];
      window.__threadShape = drawing.name;
      return [];
    };

    const resize2d = (ctx: CanvasRenderingContext2D) => {
      const dpr = phone ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let dispose = () => {};

    const start2d = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const draw = () => {
        resize2d(ctx);
        paint2d(ctx, layout());
      };
      if (reduce) {
        draw();
        window.addEventListener("scroll", draw, { passive: true });
        window.addEventListener("resize", draw);
        dispose = () => {
          window.removeEventListener("scroll", draw);
          window.removeEventListener("resize", draw);
        };
        return;
      }
      const tick = () => {
        if (dead) return;
        if (!document.hidden) draw();
        frame = window.requestAnimationFrame(tick);
      };
      tick();
      dispose = () => window.cancelAnimationFrame(frame);
    };

    const start = async () => {
      if (!webgl) {
        start2d();
        return;
      }
      const THREE = await import("three");
      if (dead) {
        return;
      }
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
      camera.position.z = 5;
      const ribbon = (strokes: { x: number; y: number }[][], halfWidth: number) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const positions: number[] = [];
        const indices: number[] = [];
        const toNdc = (x: number, y: number) => [(x / width) * 2 - 1, 1 - (y / height) * 2, 0];
        for (const points of strokes) {
          let length = 0;
          for (let index = 1; index < points.length; index += 1) length += Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y);
          if (length < 8) continue;
          const base = positions.length / 3;
          for (let index = 0; index < points.length; index += 1) {
            const previous = points[Math.max(0, index - 1)];
            const next = points[Math.min(points.length - 1, index + 1)];
            let dx = next.x - previous.x;
            let dy = next.y - previous.y;
            const span = Math.hypot(dx, dy) || 1;
            dx /= span;
            dy /= span;
            positions.push(...toNdc(points[index].x + -dy * halfWidth, points[index].y + dx * halfWidth));
            positions.push(...toNdc(points[index].x - -dy * halfWidth, points[index].y - dx * halfWidth));
          }
          for (let index = 0; index < points.length - 1; index += 1) {
            const start = base + index * 2;
            indices.push(start, start + 1, start + 2, start + 1, start + 3, start + 2);
          }
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setIndex(indices);
        return geometry;
      };
      const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xd4c4a8, transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide });
      const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xf3ecdf, transparent: true, opacity: 0.96, depthWrite: false, side: THREE.DoubleSide });
      const glow = new THREE.Mesh(new THREE.BufferGeometry(), glowMaterial);
      const core = new THREE.Mesh(new THREE.BufferGeometry(), coreMaterial);
      scene.add(glow, core);
      const resize = () => {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight, false);
      };
      resize();
      window.addEventListener("resize", resize);
      const tick = () => {
        if (dead) return;
        if (!document.hidden) {
          const strokes = layout();
          glow.geometry.dispose();
          core.geometry.dispose();
          glow.geometry = ribbon(strokes, 6);
          core.geometry = ribbon(strokes, 1.2);
          renderer.render(scene, camera);
        }
        frame = window.requestAnimationFrame(tick);
      };
      tick();
      dispose = () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        glow.geometry.dispose();
        core.geometry.dispose();
        glowMaterial.dispose();
        coreMaterial.dispose();
        renderer.dispose();
      };
    };

    void start();
    return () => {
      dead = true;
      dispose();
      watch.disconnect();
      delete window.__threadSamples;
      delete window.__threadShape;
    };
  }, []);

  return <canvas ref={canvasRef} className="thread-field" aria-hidden="true" />;
}
