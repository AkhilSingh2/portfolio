export type Point = { x: number; y: number };

const COUNT = 96;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Author points in a 0–100 box become a centered -1…1 drawing. */
function box(points: [number, number][]): Point[] {
  return points.map(([x, y]) => ({ x: (x - 50) / 42, y: (y - 50) / 42 }));
}

function circle(cx: number, cy: number, r: number, from: number, to: number, steps: number): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i += 1) {
    const angle = from + ((to - from) * i) / steps;
    points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
  }
  return points;
}

function resample(points: Point[], count = COUNT): Point[] {
  if (points.length < 2) return Array.from({ length: count }, () => points[0] ?? { x: 0, y: 0 });
  const lengths = [0];
  for (let i = 1; i < points.length; i += 1) {
    lengths.push(lengths[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  const total = lengths[lengths.length - 1] || 1;
  const out: Point[] = [];
  let cursor = 1;
  for (let i = 0; i < count; i += 1) {
    const target = (total * i) / (count - 1);
    while (cursor < lengths.length - 1 && lengths[cursor] < target) cursor += 1;
    const previous = cursor - 1;
    const span = lengths[cursor] - lengths[previous] || 1;
    const t = clamp((target - lengths[previous]) / span, 0, 1);
    out.push({
      x: points[previous].x + (points[cursor].x - points[previous].x) * t,
      y: points[previous].y + (points[cursor].y - points[previous].y) * t,
    });
  }
  return out;
}

const shapes: Record<string, Point[]> = {
  thread: resample(
    box(
      Array.from({ length: 48 }, (_, index) => {
        const t = index / 47;
        return [50 + Math.sin(t * Math.PI * 2.4) * 12, 8 + t * 84] as [number, number];
      }),
    ),
  ),
  cursor: resample(
    box([
      [50, 8],
      [18, 72],
      [40, 62],
      [34, 90],
      [48, 74],
      [58, 90],
      [52, 62],
      [78, 72],
      [50, 8],
    ]),
  ),
  spark: resample(
    box([
      [50, 6],
      [58, 36],
      [90, 28],
      [66, 50],
      [88, 78],
      [54, 64],
      [50, 94],
      [46, 64],
      [12, 78],
      [34, 50],
      [10, 28],
      [42, 36],
      [50, 6],
    ]),
  ),
  headphones: resample(
    box([
      ...circle(30, 64, 14, Math.PI * 0.5, Math.PI * 2.5, 18),
      [30, 50],
      [38, 28],
      [50, 16],
      [62, 28],
      [70, 50],
      ...circle(70, 64, 14, -Math.PI * 0.5, Math.PI * 1.5, 18),
    ]),
  ),
  diya: resample(
    box([
      [50, 14],
      [42, 32],
      [50, 28],
      [58, 32],
      [50, 14],
      [50, 36],
      [28, 58],
      [36, 74],
      [64, 74],
      [72, 58],
      [50, 36],
    ]),
  ),
  petal: resample(
    box(
      Array.from({ length: 64 }, (_, index) => {
        const t = (index / 63) * Math.PI * 2;
        const r = 18 + 16 * Math.abs(Math.cos(t * 2));
        return [50 + Math.cos(t) * r, 50 + Math.sin(t) * r] as [number, number];
      }),
    ),
  ),
  cursors: resample(
    box([
      [22, 18],
      [8, 48],
      [18, 42],
      [18, 42],
      [46, 58],
      [78, 42],
      [88, 48],
      [74, 18],
      [78, 42],
      [46, 58],
    ]),
  ),
  controller: resample(
    box([
      [18, 40],
      [28, 32],
      [72, 32],
      [82, 40],
      [86, 58],
      [74, 70],
      [26, 70],
      [14, 58],
      [18, 40],
      [32, 48],
      ...circle(32, 52, 7, 0, Math.PI * 2, 10),
      [32, 48],
      [68, 46],
      ...circle(68, 50, 7, 0, Math.PI * 2, 10),
    ]),
  ),
  shirt: resample(
    box([
      [50, 10],
      [50, 22],
      [42, 30],
      [16, 42],
      [24, 54],
      [34, 46],
      [34, 88],
      [66, 88],
      [66, 46],
      [76, 54],
      [84, 42],
      [58, 30],
      [50, 22],
    ]),
  ),
  document: resample(
    box([
      [28, 12],
      [64, 12],
      [72, 22],
      [72, 88],
      [28, 88],
      [28, 12],
      [36, 32],
      [60, 32],
      [36, 44],
      [58, 44],
      [62, 62],
      ...circle(62, 64, 10, 0, Math.PI * 2, 12),
      [70, 74],
      [82, 88],
    ]),
  ),
  microphone: resample(
    box([
      ...circle(50, 28, 14, Math.PI, Math.PI * 3, 16),
      [36, 28],
      [36, 40],
      [30, 52],
      [70, 52],
      [64, 40],
      [64, 28],
      [50, 42],
      [50, 70],
      [36, 78],
      [64, 78],
    ]),
  ),
  chart: resample(
    box([
      [18, 16],
      [18, 84],
      [86, 84],
      [18, 84],
      [28, 70],
      [42, 62],
      [54, 46],
      [68, 34],
      [82, 16],
    ]),
  ),
  heartbeat: resample(
    box([
      [6, 52],
      [28, 52],
      [36, 52],
      [42, 18],
      [50, 84],
      [58, 36],
      [64, 52],
      [94, 52],
    ]),
  ),
  fan: resample(
    box(
      [0, 1, 2, 3, 4, 5, 6].flatMap((lane, index) => {
        const x = 16 + lane * 11;
        const tip: [number, number] = [x, 14];
        const root: [number, number] = [50, 88];
        return index % 2 === 0 ? [root, tip] : [tip, root];
      }),
    ),
  ),
  globe: resample(
    box([
      ...circle(50, 50, 32, 0, Math.PI * 2, 28),
      ...Array.from({ length: 16 }, (_, index) => {
        const t = index / 15;
        return [18 + t * 64, 50 + Math.sin(t * Math.PI) * 10] as [number, number];
      }),
      [50, 18],
      [50, 82],
    ]),
  ),
  car: resample(
    box([
      ...circle(30, 68, 12, Math.PI * 0.2, Math.PI * 2.2, 14),
      [42, 68],
      [58, 68],
      ...circle(72, 68, 12, Math.PI, Math.PI * 3, 14),
      [84, 62],
      [90, 52],
      [74, 48],
      [60, 36],
      [36, 34],
      [24, 46],
      [18, 40],
      [28, 46],
      [24, 56],
      [30, 56],
    ]),
  ),
  knot: resample(
    box(
      Array.from({ length: 72 }, (_, index) => {
        const t = (index / 71) * Math.PI * 2;
        const r = 16 + 10 * Math.sin(t * 2);
        return [50 + Math.cos(t) * r, 50 + Math.sin(t * 2) * 18] as [number, number];
      }),
    ),
  ),
};

const order = [
  "cursor",
  "spark",
  "headphones",
  "diya",
  "petal",
  "cursors",
  "controller",
  "shirt",
  "document",
  "microphone",
  "chart",
  "heartbeat",
  "fan",
  "globe",
  "car",
  "knot",
] as const;

export const threadShapeNames = {
  cursor: "a hand cursor tapping",
  spark: "a spark",
  headphones: "headphones",
  diya: "a diya",
  petal: "a petal",
  cursors: "two cursors",
  controller: "a game controller",
  shirt: "a shirt on a hanger",
  document: "a document and magnifier",
  microphone: "a microphone",
  chart: "a rising chart",
  heartbeat: "a heartbeat",
  fan: "a fan of strands",
  globe: "a globe",
  car: "a race car",
  knot: "a signature knot",
} as const;

function mix(from: Point[], to: Point[], amount: number): Point[] {
  return from.map((point, index) => ({
    x: point.x + (to[index].x - point.x) * amount,
    y: point.y + (to[index].y - point.y) * amount,
  }));
}

/** Scroll progress alone drives the line: thread, then each object, relaxing to a thread between them. */
export function threadDrawing(progress: number, options?: { reduced?: boolean }): { name: string; points: Point[] } {
  const thread = shapes.thread;
  const scaled = clamp(progress, 0, 0.9999) * order.length;
  const index = Math.min(order.length - 1, Math.floor(scaled));
  const local = scaled - index;
  const name = order[index];
  const object = shapes[name];
  if (options?.reduced) {
    if (progress < 0.03) return { name: "thread", points: thread };
    return { name, points: object };
  }
  if (index === order.length - 1) {
    return { name: local > 0.45 ? name : "thread", points: mix(thread, object, local) };
  }
  if (local < 0.58) {
    const amount = local / 0.58;
    return { name: amount > 0.55 ? name : "thread", points: mix(thread, object, amount) };
  }
  const amount = (local - 0.58) / 0.42;
  return { name: amount < 0.45 ? name : "thread", points: mix(object, thread, amount) };
}
