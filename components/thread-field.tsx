"use client";

import { useEffect, useRef } from "react";
import { contentWave, mixSlot, threadSlot } from "@/lib/thread-layout";
import { threadDrawing, unwindDrawing, type Point, type ThreadDot } from "@/lib/thread-shapes";
import { threadDrawings, threadOrder } from "@/lib/thread-art";
import { applyVeil, holesForOverlap, publishVeil, renderVeil } from "@/lib/thread-veil";

declare global {
  interface Window {
    __threadSamples?: { x: number; y: number }[];
    __threadShape?: string;
    __threadMarkScore?: number;
  }
}

function readProgress() {
  const published = Number.parseFloat(document.documentElement.dataset.threadProgress || "");
  if (Number.isFinite(published)) return Math.min(1, Math.max(0, published));
  const home = document.querySelector(".thread-home");
  if (!(home instanceof HTMLElement)) return 0;
  const spacer = home.closest(".pin-spacer");
  const host = spacer instanceof HTMLElement ? spacer : home;
  const top = host.getBoundingClientRect().top + window.scrollY;
  const span = Math.max(1, host.offsetHeight - window.innerHeight);
  return Math.min(1, Math.max(0, (window.scrollY - top) / span));
}

function readExit() {
  const value = Number.parseFloat(document.documentElement.dataset.threadExit || "0");
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
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

function anchorY() {
  const copy = document.querySelector(".thread-chapter.is-active .thread-copy");
  if (!copy) return null;
  const rect = copy.getBoundingClientRect();
  if (rect.height > 20 && rect.bottom > 48 && rect.top < window.innerHeight - 24) return rect.top + rect.height / 2;
  return null;
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

/** 1 on a settled object, 0 when the line has relaxed back into the thread between steps. */
function settledShape(progress: number) {
  const span = Math.max(1, threadOrder.length - 1);
  const scaled = Math.min(span, Math.max(0, progress) * span);
  const index = Math.min(span, Math.floor(scaled));
  if (index >= span) return { name: threadOrder[index], weight: 1 };
  const local = scaled - index;
  if (local <= 0.5) return { name: threadOrder[index], weight: 1 - local / 0.5 };
  return { name: threadOrder[index + 1], weight: (local - 0.5) / 0.5 };
}

/** Fit the drawing in the slot for this scroll position, sliding toward the next step's slot. */
function placeLarge(drawing: Point[][], progress: number) {
  const span = Math.max(1, threadOrder.length - 1);
  const scaled = Math.min(span, Math.max(0, progress) * span);
  const index = Math.min(span, Math.floor(scaled));
  const next = Math.min(span, index + 1);
  const wave = contentWave(scaled / span, threadOrder.length);
  const slot = mixSlot(
    threadSlot(threadOrder[index], window.innerWidth, window.innerHeight, wave.x),
    threadSlot(threadOrder[next], window.innerWidth, window.innerHeight, wave.x),
    index === next ? 0 : scaled - index,
  );
  window.__contentX = wave.x;
  window.__threadPlacement = slot.placement;
  const box = bounds(drawing);
  let scale = Math.min(slot.maxW / box.w, slot.maxH / box.h);
  const centered = 1 - Math.min(1, Math.abs(wave.x - 0.5) * 2);
  if (centered > 0 && slot.placement !== "full-bleed") {
    const { name, weight } = settledShape(progress);
    const own = bounds(threadDrawings[name] ?? drawing);
    const panel = Math.min(window.innerWidth * 0.46, 34 * 16);
    const cover = (panel + 96) / own.w;
    const ownFit = Math.min(slot.maxW / own.w, slot.maxH / own.h);
    if (cover > ownFit && ownFit > 0) scale *= 1 + (cover / ownFit - 1) * centered * weight;
  }
  const originX = slot.cx - ((box.minX + box.maxX) / 2) * scale;
  const originY = slot.cy - ((box.minY + box.maxY) / 2) * scale;
  return drawing.map((stroke) => stroke.map((point) => ({ x: originX + point.x * scale, y: originY + point.y * scale })));
}

let veilKey = "";

function clearVeil(canvas: HTMLCanvasElement) {
  if (veilKey === "none") return;
  veilKey = "none";
  canvas.style.maskImage = "";
  canvas.style.setProperty("-webkit-mask-image", "");
  window.__threadVeil = () => 1;
  document.querySelector(".thread-chapter.is-active .thread-copy")?.classList.remove("is-veiled");
}

function syncVeil(canvas: HTMLCanvasElement, samples: { x: number; y: number }[]) {
  const copy = document.querySelector(".thread-chapter.is-active .thread-copy");
  const host = canvas.getBoundingClientRect();
  if (!(copy instanceof HTMLElement) || host.width < 20) {
    clearVeil(canvas);
    return;
  }
  const nodes = document.querySelectorAll(
    ".thread-chapter.is-active .thread-copy h1, .thread-chapter.is-active .thread-copy h2, .thread-chapter.is-active .thread-copy p, .thread-chapter.is-active .thread-copy a, .thread-chapter.is-active .thread-shot",
  );
  const holes = holesForOverlap(
    samples,
    [...nodes].map((node) => node.getBoundingClientRect()),
    host,
  );
  const key = holes.length ? holes.map((hole) => `${Math.round(hole.x)}:${Math.round(hole.y)}:${Math.round(hole.w)}:${Math.round(hole.h)}`).join("|") : "none";
  if (key === veilKey) return;
  veilKey = key;
  if (!holes.length) {
    canvas.style.maskImage = "";
    canvas.style.setProperty("-webkit-mask-image", "");
    window.__threadVeil = () => 1;
    copy.classList.remove("is-veiled");
    return;
  }
  const mask = renderVeil(host.width, host.height, holes);
  applyVeil(canvas, mask);
  publishVeil({ canvas: mask, left: host.left, top: host.top, width: host.width, height: host.height });
  copy.classList.add("is-veiled");
}

function paintDot(ctx: CanvasRenderingContext2D, dot: ThreadDot) {
  if (dot.a <= 0.02) return;
  ctx.save();
  ctx.globalAlpha = dot.a;
  ctx.fillStyle = "rgba(212, 196, 168, 0.45)";
  ctx.shadowColor = "rgba(212, 196, 168, 0.95)";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, dot.r * 2.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(243, 236, 223, 0.98)";
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, dot.r * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paint2d(ctx: CanvasRenderingContext2D, strokes: { x: number; y: number }[][], dot: ThreadDot | null) {
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
    ctx.strokeStyle = "rgba(212, 196, 168, 0.18)";
    ctx.lineWidth = phone ? 5 : 8;
    ctx.shadowColor = "rgba(212, 196, 168, 0.8)";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    points.forEach((point, index) => (index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)));
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(243, 236, 223, 0.62)";
    ctx.lineWidth = phone ? 1.15 : 1.45;
    ctx.stroke();
  }
  if (dot) paintDot(ctx, dot);
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

    let frameDot: ThreadDot | null = null;

    const layout = () => {
      frameDot = null;
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
      const placed = placeLarge(drawing.strokes, readProgress());
      const unwound = unwindDrawing(placed, readExit());
      if (!unwound) {
        window.__threadSamples = [];
        window.__threadShape = "dot";
        return [];
      }
      frameDot = unwound.dot;
      window.__threadSamples = unwound.dot
        ? [...unwound.strokes.flat(), { x: unwound.dot.x, y: unwound.dot.y }]
        : unwound.strokes.flat();
      window.__threadShape = unwound.dot ? "dot" : drawing.name;
      return unwound.strokes;
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
        const strokes = layout();
        syncVeil(canvas, window.__threadSamples || []);
        paint2d(ctx, strokes, frameDot);
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
      const dotGlowMaterial = new THREE.MeshBasicMaterial({ color: 0xd4c4a8, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide });
      const dotCoreMaterial = new THREE.MeshBasicMaterial({ color: 0xf3ecdf, transparent: true, opacity: 1, depthWrite: false, side: THREE.DoubleSide });
      const dotGlow = new THREE.Mesh(new THREE.BufferGeometry(), dotGlowMaterial);
      const dotCore = new THREE.Mesh(new THREE.BufferGeometry(), dotCoreMaterial);
      scene.add(glow, core, dotGlow, dotCore);
      const disc = (x: number, y: number, radius: number) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const toNdc = (px: number, py: number) => [(px / width) * 2 - 1, 1 - (py / height) * 2, 0];
        const positions = [...toNdc(x, y)];
        const indices: number[] = [];
        const steps = 28;
        for (let index = 0; index <= steps; index += 1) {
          const angle = (index / steps) * Math.PI * 2;
          positions.push(...toNdc(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius));
        }
        for (let index = 1; index <= steps; index += 1) indices.push(0, index, index + 1);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setIndex(indices);
        return geometry;
      };
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
          syncVeil(canvas, window.__threadSamples || []);
          const ink = frameDot?.a ?? 1;
          glowMaterial.opacity = 0.2 * ink;
          coreMaterial.opacity = 0.62 * ink;
          glow.geometry.dispose();
          core.geometry.dispose();
          glow.geometry = ribbon(strokes, 6);
          core.geometry = ribbon(strokes, 1.2);
          if (frameDot && frameDot.a > 0.02) {
            dotGlow.geometry.dispose();
            dotCore.geometry.dispose();
            dotGlow.geometry = disc(frameDot.x, frameDot.y, frameDot.r * 2.6);
            dotCore.geometry = disc(frameDot.x, frameDot.y, Math.max(2.4, frameDot.r * 0.7));
            dotGlowMaterial.opacity = 0.55 * frameDot.a;
            dotCoreMaterial.opacity = frameDot.a;
            dotGlow.visible = true;
            dotCore.visible = true;
          } else {
            dotGlow.visible = false;
            dotCore.visible = false;
          }
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
        dotGlow.geometry.dispose();
        dotCore.geometry.dispose();
        dotGlowMaterial.dispose();
        dotCoreMaterial.dispose();
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
      delete window.__threadPlacement;
      delete window.__threadVeil;
      veilKey = "";
    };
  }, []);

  return <canvas ref={canvasRef} className="thread-field" aria-hidden="true" />;
}
