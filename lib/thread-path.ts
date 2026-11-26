export const THREAD_CHAPTERS = 6;

export type Point = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smooth(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mix(a: Point, b: Point, t: number): Point {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

/** A single ribbon, in a -1…1 space with y pointing up. */
function form(chapter: number, t: number, strand: number): Point {
  if (chapter <= 0) {
    const y = 0.78 - t * 1.35;
    return { x: -0.04 + Math.sin(t * Math.PI) * 0.1, y };
  }
  if (chapter === 1) {
    const frame = frameOutline(t, 0.7, 0.34);
    return { x: frame.x * 0.72 + 0.34, y: frame.y * 0.7 + 0.34 };
  }
  if (chapter === 2) {
    const side = strand === 0 ? -0.18 : 0.18;
    const y = 0.72 - t * 1.4;
    return { x: side + Math.sin(t * 9 + strand * 1.4) * 0.035, y };
  }
  if (chapter === 3) {
    const y = 0.68 - t * 1.32;
    const spread = 0.08 + 0.22 * Math.sin(t * Math.PI);
    return { x: Math.sin(t * 7.5 + strand) * spread, y };
  }
  if (chapter === 4) {
    const lanes = 7;
    const lane = strand % lanes;
    const x = -0.72 + (lane / (lanes - 1)) * 1.44;
    return { x, y: 0.78 - t * 1.5 };
  }
  const knotAt = 0.78;
  if (t < knotAt) {
    const u = t / knotAt;
    return { x: Math.sin(u * Math.PI) * 0.22, y: -0.72 + u * 1.42 };
  }
  const u = (t - knotAt) / (1 - knotAt);
  const angle = u * Math.PI * 2;
  return { x: Math.cos(angle) * 0.1, y: 0.62 + Math.sin(angle) * 0.07 };
}

function frameOutline(t: number, w: number, h: number): Point {
  const radius = 0.06;
  const straightW = w - radius * 2;
  const straightH = h - radius * 2;
  const arc = (Math.PI * radius) / 2;
  const perimeter = 2 * (straightW + straightH) + 4 * arc;
  let d = t * perimeter;
  const edge = (length: number) => {
    if (d > length) {
      d -= length;
      return null;
    }
    return d / length;
  };
  const top = edge(straightW);
  if (top !== null) return { x: -w / 2 + radius + top * straightW, y: h / 2 };
  const tr = edge(arc);
  if (tr !== null) return corner(w / 2 - radius, h / 2 - radius, radius, -Math.PI / 2 + tr * (Math.PI / 2));
  const right = edge(straightH);
  if (right !== null) return { x: w / 2, y: h / 2 - radius - right * straightH };
  const br = edge(arc);
  if (br !== null) return corner(w / 2 - radius, -h / 2 + radius, radius, 0 + br * (Math.PI / 2));
  const bottom = edge(straightW);
  if (bottom !== null) return { x: w / 2 - radius - bottom * straightW, y: -h / 2 };
  const bl = edge(arc);
  if (bl !== null) return corner(-w / 2 + radius, -h / 2 + radius, radius, Math.PI / 2 + bl * (Math.PI / 2));
  const left = edge(straightH);
  if (left !== null) return { x: -w / 2, y: -h / 2 + radius + left * straightH };
  const tl = clamp(d / arc, 0, 1);
  return corner(-w / 2 + radius, h / 2 - radius, radius, Math.PI + tl * (Math.PI / 2));
}

function corner(cx: number, cy: number, radius: number, angle: number): Point {
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
}

export function threadCursor(progress: number): { index: number; local: number; morph: number; next: number } {
  const x = Math.min(THREAD_CHAPTERS - 1.0001, clamp(progress, 0, 1) * (THREAD_CHAPTERS - 1));
  const index = Math.floor(x);
  const local = x - index;
  const next = Math.min(THREAD_CHAPTERS - 1, index + 1);
  const morph = index === next ? 1 : local < 0.58 ? 0 : smooth((local - 0.58) / 0.42);
  return { index, local, morph, next };
}

export function sampleRibbon(progress: number, count: number, strand = 0): Point[] {
  const cursor = threadCursor(progress);
  const points: Point[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0 : i / (count - 1);
    const a = form(cursor.index, t, strand);
    const b = form(cursor.next, t, strand);
    points.push(mix(a, b, cursor.morph));
  }
  return points;
}

export function sampleField(progress: number, lanes: number, count: number): Point[][] {
  const cursor = threadCursor(progress);
  const weight = Math.max(chapterWeight(progress, 4), chapterWeight(progress, 3) * 0.35);
  if (weight < 0.04) return [];
  return Array.from({ length: lanes }, (_, lane) => {
    const points: Point[] = [];
    for (let i = 0; i < count; i += 1) {
      const t = i / (count - 1);
      const spread = form(4, t, lane);
      const spine = form(cursor.index, t, 0);
      points.push(mix(spine, spread, weight));
    }
    return points;
  });
}

export function sampleCloud(progress: number, count: number): Point[] {
  const weight = chapterWeight(progress, 3);
  if (weight < 0.04) return [];
  const points: Point[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = (i % 20) / 19;
    const spine = sampleRibbon(progress, 2, 0)[0];
    const along = form(3, t, i);
    const jitter = Math.sin(i * 12.9898) * 0.28;
    points.push({
      x: along.x + jitter * weight,
      y: lerp(spine.y, along.y, weight),
    });
  }
  return points;
}

export function chapterWeight(progress: number, index: number) {
  const x = clamp(progress, 0, 1) * (THREAD_CHAPTERS - 1);
  return Math.max(0, 1 - Math.abs(x - index));
}
