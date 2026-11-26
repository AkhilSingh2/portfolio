"use client";

import { useEffect, useRef } from "react";
import { threadDrawing, type Point } from "@/lib/thread-shapes";

type Rect = { left: number; top: number; right: number; bottom: number; width: number; height: number };
type Slot = { x: number; y: number; w: number; h: number };

declare global {
  interface Window {
    __threadSamples?: { x: number; y: number }[];
    __threadShape?: string;
  }
}

function readProgress() {
  const value = Number.parseFloat(document.documentElement.dataset.threadProgress || "0");
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
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
  const nodes = document.querySelectorAll("[data-obstacle], header.site-nav, .site-footer");
  return [...nodes].filter(shown).map((element) => {
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
  const footerTop = document.querySelector(".site-footer")?.getBoundingClientRect().top ?? window.innerHeight;
  const limit = Math.min(window.innerHeight - margin, footerTop - 12);
  const right: Slot = {
    x: contentRight + 16,
    y: 96,
    w: window.innerWidth - contentRight - margin - 16,
    h: limit - 96,
  };
  if (right.w > 150 && right.h > 160) slots.push(right);
  slots.push(...bands(blocks));
  return slots.sort((a, b) => b.w * b.h - a.w * a.h);
}

function place(drawing: Point[], slot: Slot, blocks: Rect[]) {
  let scale = Math.min(slot.w, slot.h) * 0.48;
  const cx = slot.x + slot.w / 2;
  const cy = slot.y + slot.h / 2;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const points = drawing.map((point) => ({ x: cx + point.x * scale, y: cy + point.y * scale }));
    if (!hits(points, blocks)) return points;
    scale *= 0.78;
  }
  return null;
}

function paint2d(ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);
  if (points.length < 2) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(212, 196, 168, 0.28)";
  ctx.lineWidth = 10;
  ctx.shadowColor = "rgba(212, 196, 168, 0.85)";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  points.forEach((point, index) => (index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)));
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(243, 236, 223, 0.95)";
  ctx.lineWidth = 1.7;
  ctx.stroke();
  ctx.restore();
}

export function ThreadField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = window.matchMedia("(max-width: 959px)").matches;
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
      const active = [...document.querySelectorAll("[data-chapter]")].findIndex((element) => element.classList.contains("is-active"));
      const local = Number.parseFloat(document.documentElement.dataset.threadLocal || "");
      const drawing = threadDrawing(readProgress(), active >= 0 ? active : undefined, Number.isFinite(local) ? local : undefined);
      const blocks = obstacles();
      for (const slot of slotsFor(blocks)) {
        const points = place(drawing.points, slot, blocks);
        if (points) {
          window.__threadSamples = points;
          window.__threadShape = drawing.name;
          return points;
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
        if (running && !document.hidden) draw();
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
      const ribbon = (points: { x: number; y: number }[], halfWidth: number) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const positions: number[] = [];
        const indices: number[] = [];
        const toNdc = (x: number, y: number) => [(x / width) * 2 - 1, 1 - (y / height) * 2, 0];
        for (let index = 0; index < points.length; index += 1) {
          const previous = points[Math.max(0, index - 1)];
          const next = points[Math.min(points.length - 1, index + 1)];
          let dx = next.x - previous.x;
          let dy = next.y - previous.y;
          const length = Math.hypot(dx, dy) || 1;
          dx /= length;
          dy /= length;
          positions.push(...toNdc(points[index].x + -dy * halfWidth, points[index].y + dx * halfWidth));
          positions.push(...toNdc(points[index].x - -dy * halfWidth, points[index].y - dx * halfWidth));
        }
        for (let index = 0; index < points.length - 1; index += 1) {
          const start = index * 2;
          indices.push(start, start + 1, start + 2, start + 1, start + 3, start + 2);
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
        if (running && !document.hidden) {
          const points = layout();
          glow.geometry.dispose();
          core.geometry.dispose();
          glow.geometry = ribbon(points, 7);
          core.geometry = ribbon(points, 1.35);
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
