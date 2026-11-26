"use client";

import { useEffect, useRef } from "react";

type Motif = "tap" | "surface" | "signal" | "engine" | "scale" | "return";

function rose(t: number, turn: number, wobble: number) {
  const a = t * Math.PI * 2 * turn;
  const r = 0.18 + 0.62 * Math.sin(t * Math.PI) * (0.72 + 0.28 * Math.sin(a * 2));
  return {
    x: Math.cos(a) * r * (0.86 + wobble),
    y: Math.sin(a * 0.85) * r * 0.92 + (t - 0.5) * 0.08,
  };
}

function draw2d(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  motif: Motif,
  time: number,
  pointerX: number,
  pointerY: number,
) {
  ctx.clearRect(0, 0, width, height);
  const cx = width * (0.5 + pointerX * 0.04);
  const cy = height * (0.5 + pointerY * 0.04);
  const scale = Math.min(width, height) * 0.46;
  const stroke = (points: { x: number; y: number }[], color: string, widthPx: number) => {
    if (points.length < 2) return;
    ctx.beginPath();
    points.forEach((point, index) => {
      const x = cx + point.x * scale;
      const y = cy + point.y * scale;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = widthPx;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };
  const loop = (count: number, turn: number, phase: number) =>
    Array.from({ length: count }, (_, index) => rose((index / (count - 1) + phase) % 1, turn, Math.sin(time + phase)));

  if (motif === "tap" || motif === "return") {
    const spin = time * 0.15;
    for (let band = 0; band < 5; band += 1) {
      const phase = band * 0.16 + spin;
      stroke(loop(180, 3 + band * 0.35, phase), `rgba(212, 196, 168, ${0.28 + band * 0.1})`, band === 4 ? 1.6 : 1);
    }
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(243, 236, 223, 0.85)";
    ctx.fill();
    return;
  }
  if (motif === "surface") {
    const inset = 0.62;
    const rect = [
      { x: -inset, y: -0.42 },
      { x: inset, y: -0.42 },
      { x: inset, y: 0.42 },
      { x: -inset, y: 0.42 },
      { x: -inset, y: -0.42 },
    ];
    stroke(rect, "rgba(212, 196, 168, 0.85)", 1.4);
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 6; col += 1) {
        const x = -0.46 + col * 0.18;
        const y = -0.24 + row * 0.16;
        ctx.strokeStyle = "rgba(212, 196, 168, 0.45)";
        ctx.strokeRect(cx + x * scale, cy + y * scale, scale * 0.1, scale * 0.08);
      }
    }
    return;
  }
  if (motif === "signal") {
    const strand = (side: number) =>
      Array.from({ length: 80 }, (_, index) => {
        const t = index / 79;
        return { x: side + Math.sin(t * 10 + time + side) * 0.06, y: -0.7 + t * 1.4 };
      });
    stroke(strand(-0.22), "rgba(212, 196, 168, 0.9)", 1.5);
    stroke(strand(0.22), "rgba(230, 215, 188, 0.7)", 1.5);
    return;
  }
  if (motif === "engine") {
    const nodes = Array.from({ length: 18 }, (_, index) => {
      const a = index * 2.399 + time * 0.2;
      const r = 0.2 + (index % 5) * 0.12;
      return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.8 };
    });
    ctx.strokeStyle = "rgba(212, 196, 168, 0.35)";
    ctx.lineWidth = 1;
    nodes.forEach((node, index) => {
      const next = nodes[(index + 3) % nodes.length];
      ctx.beginPath();
      ctx.moveTo(cx + node.x * scale, cy + node.y * scale);
      ctx.lineTo(cx + next.x * scale, cy + next.y * scale);
      ctx.stroke();
    });
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(cx + node.x * scale, cy + node.y * scale, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212, 196, 168, 0.9)";
      ctx.fill();
    });
    return;
  }
  const lanes = 9;
  for (let lane = 0; lane < lanes; lane += 1) {
    const x = -0.7 + (lane / (lanes - 1)) * 1.4;
    const sway = Math.sin(time + lane) * 0.03;
    stroke(
      [
        { x: x + sway, y: -0.72 },
        { x: x * 0.2, y: 0.72 },
      ],
      "rgba(212, 196, 168, 0.55)",
      1.2,
    );
  }
}

export function ThreadMotif({ motif }: { motif: Motif }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const phone = window.matchMedia("(max-width: 959px)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const webgl = motif === "tap" && !phone && !saveData;

    let dead = false;
    let running = true;
    let frame = 0;
    const pointer = { x: 0, y: 0 };
    const onPointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    };
    host.addEventListener("pointermove", onPointer);
    const watch = new IntersectionObserver((entries) => {
      running = entries.some((entry) => entry.isIntersecting);
    });
    watch.observe(host);

    const resize2d = (ctx: CanvasRenderingContext2D) => {
      const rect = host.getBoundingClientRect();
      const dpr = 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return rect;
    };

    let dispose = () => {};

    const start2d = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const tick = (now: number) => {
        if (dead) return;
        if (running && !document.hidden) {
          const rect = resize2d(ctx);
          draw2d(ctx, rect.width, rect.height, motif, now / 1000, pointer.x, pointer.y);
        }
        frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
      dispose = () => window.cancelAnimationFrame(frame);
    };

    const start = async () => {
      if (!webgl) {
        start2d();
        return;
      }
      const THREE = await import("three");
      if (dead) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
      camera.position.z = 4.2;
      const lines: { positions: Float32Array; geometry: InstanceType<typeof THREE.BufferGeometry> }[] = [];
      for (let band = 0; band < 6; band += 1) {
        const count = 220;
        const positions = new Float32Array(count * 3);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const material = new THREE.LineBasicMaterial({
          color: band % 2 === 0 ? 0xd4c4a8 : 0xf3ecdf,
          transparent: true,
          opacity: 0.35 + band * 0.1,
        });
        scene.add(new THREE.Line(geometry, material));
        lines.push({ positions, geometry });
      }
      const resize = () => {
        const rect = host.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        renderer.setPixelRatio(dpr);
        renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
        camera.aspect = Math.max(rect.width, 1) / Math.max(rect.height, 1);
        camera.updateProjectionMatrix();
      };
      resize();
      const onResize = () => resize();
      window.addEventListener("resize", onResize);
      const started = performance.now();
      const tick = () => {
        if (dead) return;
        if (running && !document.hidden) {
          const time = (performance.now() - started) / 1000;
          lines.forEach((line, band) => {
            const count = line.positions.length / 3;
            for (let i = 0; i < count; i += 1) {
              const t = i / (count - 1);
              const a = t * Math.PI * 2 * (3.2 + band * 0.45) + time * 0.25 + band;
              const radius = 0.35 + 1.15 * Math.sin(t * Math.PI) * (0.75 + 0.25 * Math.sin(a * 1.5));
              line.positions[i * 3] = Math.cos(a) * radius + pointer.x * 0.18;
              line.positions[i * 3 + 1] = Math.sin(a * 0.72) * radius * 0.72 + (t - 0.5) * 0.4 + pointer.y * 0.12;
              line.positions[i * 3 + 2] = Math.sin(a) * radius * 0.35;
            }
            line.geometry.attributes.position.needsUpdate = true;
          });
          scene.rotation.y = time * 0.12 + pointer.x * 0.25;
          scene.rotation.x = pointer.y * 0.15;
          renderer.render(scene, camera);
        }
        frame = window.requestAnimationFrame(tick);
      };
      tick();
      dispose = () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", onResize);
        lines.forEach((line) => line.geometry.dispose());
        scene.traverse((node) => {
          const material = (node as { material?: { dispose?: () => void } }).material;
          material?.dispose?.();
        });
        renderer.dispose();
      };
    };
    void start();

    return () => {
      dead = true;
      dispose();
      watch.disconnect();
      host.removeEventListener("pointermove", onPointer);
    };
  }, [motif]);

  return (
    <div className={`thread-art thread-art-${motif}`} data-thread-art={motif}>
      <canvas ref={canvasRef} aria-hidden="true" />
      {motif === "tap" ? (
        <svg className="thread-static" viewBox="0 0 200 200" aria-hidden="true">
          <path
            d="M100 28 C70 48 130 70 100 96 C68 122 132 142 100 172"
            fill="none"
            stroke="#d4c4a8"
            strokeWidth="1.2"
          />
          <circle cx="100" cy="100" r="36" fill="none" stroke="#d4c4a8" strokeWidth="0.8" />
          <circle cx="100" cy="100" r="18" fill="none" stroke="#e6d7bc" strokeWidth="0.8" />
        </svg>
      ) : null}
    </div>
  );
}
