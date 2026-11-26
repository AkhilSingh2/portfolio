"use client";

import { useEffect, useRef } from "react";
import { chapterWeight, sampleCloud, sampleField, sampleRibbon, threadCursor, type Point } from "@/lib/thread-path";

const GOLD = "rgba(212, 196, 168, 0.92)";
const GOLD_SOFT = "rgba(212, 196, 168, 0.28)";

function readProgress() {
  const raw = Number.parseFloat(document.documentElement.dataset.threadProgress || "0");
  return Number.isFinite(raw) ? raw : 0;
}

function paint2d(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  ctx.clearRect(0, 0, width, height);
  const toX = (point: Point) => ((point.x + 1) / 2) * width;
  const toY = (point: Point) => ((1 - point.y) / 2) * height;
  const stroke = (points: Point[], color: string, widthPx: number) => {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(toX(points[0]), toY(points[0]));
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(toX(points[i]), toY(points[i]));
    ctx.strokeStyle = color;
    ctx.lineWidth = widthPx;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const signal = chapterWeight(progress, 2);
  const scale = chapterWeight(progress, 4);
  stroke(sampleRibbon(progress, 90, 0), GOLD_SOFT, 7);
  stroke(sampleRibbon(progress, 140, 0), GOLD, 1.7);
  if (signal > 0.05) stroke(sampleRibbon(progress, 120, 1), `rgba(212, 196, 168, ${0.75 * signal})`, 1.4);
  if (scale > 0.08) {
    for (const lane of sampleField(progress, 7, 24)) stroke(lane, `rgba(212, 196, 168, ${0.35 * scale})`, 1);
  }
  const cloud = sampleCloud(progress, 70);
  if (cloud.length) {
    const alpha = chapterWeight(progress, 3);
    ctx.fillStyle = `rgba(212, 196, 168, ${0.55 * alpha})`;
    for (const point of cloud) {
      ctx.beginPath();
      ctx.arc(toX(point), toY(point), 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const born = chapterWeight(progress, 0);
  if (born > 0.05) {
    const origin = sampleRibbon(progress, 2, 0)[0];
    ctx.beginPath();
    ctx.arc(toX(origin), toY(origin), 5 + born * 4, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(243, 236, 223, ${0.8 * born})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
}

export function ThreadField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(max-width: 959px)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce) return;

    let dead = false;
    let frame = 0;
    let running = true;
    document.documentElement.dataset.threadLive = "1";
    const host = canvas.parentElement;

    const visible = () => running && !document.hidden && !dead;

    const stop = () => {
      dead = true;
      window.cancelAnimationFrame(frame);
    };

    const watch = new IntersectionObserver(
      (entries) => {
        running = entries.some((entry) => entry.isIntersecting);
        document.documentElement.dataset.threadLive = running ? "1" : "0";
      },
      { rootMargin: "120px" },
    );
    if (host) watch.observe(host);

    const start2d = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const resize = () => {
        const dpr = 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      window.addEventListener("resize", resize);
      const tick = () => {
        if (dead) return;
        if (visible()) paint2d(ctx, window.innerWidth, window.innerHeight, readProgress());
        frame = window.requestAnimationFrame(tick);
      };
      tick();
      return () => window.removeEventListener("resize", resize);
    };

    let cleanup2d: (() => void) | undefined;

    const start = async () => {
      if (coarse || saveData) {
        cleanup2d = start2d();
        return;
      }
      const THREE = await import("three");
      if (dead) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 2;
      const count = 180;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.LineBasicMaterial({ color: 0xd4c4a8, transparent: true, opacity: 0.95 });
      const glowMaterial = new THREE.LineBasicMaterial({ color: 0xd4c4a8, transparent: true, opacity: 0.28 });
      const line = new THREE.Line(geometry, material);
      const glow = new THREE.Line(geometry, glowMaterial);
      scene.add(glow, line);

      const forkGeometry = new THREE.BufferGeometry();
      const forkPositions = new Float32Array(140 * 3);
      forkGeometry.setAttribute("position", new THREE.BufferAttribute(forkPositions, 3));
      const fork = new THREE.Line(forkGeometry, new THREE.LineBasicMaterial({ color: 0xd4c4a8, transparent: true, opacity: 0 }));
      scene.add(fork);

      const fieldLines = Array.from({ length: 7 }, () => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(24 * 3), 3));
        const mesh = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xd4c4a8, transparent: true, opacity: 0 }));
        scene.add(mesh);
        return mesh;
      });

      const cloudGeometry = new THREE.BufferGeometry();
      cloudGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(70 * 3), 3));
      const cloud = new THREE.Points(
        cloudGeometry,
        new THREE.PointsMaterial({ color: 0xe6d7bc, size: 0.012, transparent: true, opacity: 0, sizeAttenuation: false }),
      );
      scene.add(cloud);

      const write = (buffer: Float32Array, points: Point[]) => {
        for (let i = 0; i < points.length; i += 1) {
          buffer[i * 3] = points[i].x * 0.86;
          buffer[i * 3 + 1] = points[i].y * 0.86;
          buffer[i * 3 + 2] = 0;
        }
      };

      const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height, false);
        const aspect = width / Math.max(height, 1);
        camera.left = -aspect;
        camera.right = aspect;
        camera.top = 1;
        camera.bottom = -1;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      const tick = () => {
        if (dead) return;
        if (visible()) {
          const progress = readProgress();
          const cursor = threadCursor(progress);
          write(positions, sampleRibbon(progress, count, 0));
          geometry.attributes.position.needsUpdate = true;
          const forkMat = fork.material as InstanceType<typeof THREE.LineBasicMaterial>;
          forkMat.opacity = chapterWeight(progress, 2) * 0.8;
          write(forkPositions, sampleRibbon(progress, 140, 1));
          forkGeometry.attributes.position.needsUpdate = true;
          const lanes = sampleField(progress, 7, 24);
          fieldLines.forEach((mesh, index) => {
            const mat = mesh.material as InstanceType<typeof THREE.LineBasicMaterial>;
            mat.opacity = lanes.length ? chapterWeight(progress, 4) * 0.4 : 0;
            const attr = mesh.geometry.getAttribute("position") as InstanceType<typeof THREE.BufferAttribute>;
            if (lanes[index]) write(attr.array as Float32Array, lanes[index]);
            attr.needsUpdate = true;
          });
          const dots = sampleCloud(progress, 70);
          const cloudMat = cloud.material as InstanceType<typeof THREE.PointsMaterial>;
          cloudMat.opacity = dots.length ? chapterWeight(progress, 3) * 0.7 : 0;
          const cloudAttr = cloudGeometry.getAttribute("position") as InstanceType<typeof THREE.BufferAttribute>;
          if (dots.length) write(cloudAttr.array as Float32Array, dots);
          cloudAttr.needsUpdate = true;
          glowMaterial.opacity = 0.22 + (cursor.index === 0 ? 0.15 : 0);
          renderer.render(scene, camera);
        }
        frame = window.requestAnimationFrame(tick);
      };
      tick();

      return () => {
        window.removeEventListener("resize", resize);
        geometry.dispose();
        forkGeometry.dispose();
        cloudGeometry.dispose();
        material.dispose();
        glowMaterial.dispose();
        fieldLines.forEach((mesh) => {
          mesh.geometry.dispose();
          (mesh.material as { dispose: () => void }).dispose();
        });
        (fork.material as { dispose: () => void }).dispose();
        (cloud.material as { dispose: () => void }).dispose();
        renderer.dispose();
      };
    };

    let cleanup3d: (() => void) | undefined;
    void start().then((done) => {
      if (dead) done?.();
      else cleanup3d = done;
    });

    return () => {
      stop();
      watch.disconnect();
      delete document.documentElement.dataset.threadLive;
      cleanup2d?.();
      cleanup3d?.();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="thread-field" aria-hidden="true" />
      <svg className="thread-static" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 8 C46 28 58 42 50 62 C44 76 52 84 50 92" fill="none" stroke="#d4c4a8" strokeWidth="0.6" />
        <circle cx="50" cy="92" r="2.2" fill="none" stroke="#d4c4a8" strokeWidth="0.6" />
      </svg>
    </>
  );
}
