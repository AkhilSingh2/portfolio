import { threadDrawings, threadOrder, type Point } from "@/lib/thread-art";

export type { Point };

const thread = threadDrawings.thread;

function mix(from: Point[], to: Point[], amount: number): Point[] {
  return from.map((point, index) => ({
    x: point.x + (to[index].x - point.x) * amount,
    y: point.y + (to[index].y - point.y) * amount,
  }));
}

function mixAll(from: Point[][], to: Point[][], amount: number): Point[][] {
  return from.map((stroke, index) => mix(stroke, to[index], amount));
}

export type ThreadDot = { x: number; y: number; r: number; a: number };

function centroid(strokes: Point[][]) {
  let x = 0;
  let y = 0;
  let count = 0;
  for (const stroke of strokes) {
    for (const point of stroke) {
      x += point.x;
      y += point.y;
      count += 1;
    }
  }
  return { x: x / Math.max(1, count), y: y / Math.max(1, count) };
}

/** Scroll 0–1 past the closing: the knot contracts to a dot, holds, then fades. 1 means gone. */
export function unwindDrawing(strokes: Point[][], exit: number): { strokes: Point[][]; dot: ThreadDot | null } | null {
  if (exit <= 0) return { strokes, dot: null };
  if (exit >= 0.88) return null;
  const contract = Math.min(1, exit / 0.4);
  const center = centroid(strokes);
  const collapsed = strokes.map((stroke) =>
    stroke.map((point) => ({
      x: point.x + (center.x - point.x) * contract,
      y: point.y + (center.y - point.y) * contract,
    })),
  );
  let dot: ThreadDot | null = null;
  if (exit > 0.32) {
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
    const span = Math.max(maxX - minX, maxY - minY, 1);
    const fade = exit < 0.58 ? Math.min(1, (exit - 0.32) / 0.1) : Math.max(0, 1 - (exit - 0.58) / 0.28);
    const radius = (span > 24 ? 8 : span * 0.08) * Math.max(0.15, fade);
    dot = { x: center.x, y: center.y, r: radius, a: fade };
  }
  return { strokes: collapsed, dot };
}

export const threadShapeNames: Record<string, string> = {
  thread: "a loose thread",
  hand: "a finger tapping",
  phone: "a smartphone",
  headphones: "over-ear headphones",
  record: "a vinyl record",
  book: "an open book",
  diya: "a diya",
  nib: "a pen nib",
  grid: "a component grid",
  bubbles: "two chat bubbles",
  dish: "a satellite dish",
  buzzer: "a quiz buzzer",
  trophy: "a trophy",
  shirt: "a shirt on a hanger",
  camera: "a camera",
  document: "a document and magnifier",
  microphone: "a studio microphone",
  chart: "a rising bar chart",
  stopwatch: "a stopwatch",
  skyline: "a city skyline",
  globe: "a globe",
  car: "a formula car",
  rocket: "a rocket",
  knot: "a signature knot",
};

/** Scroll progress alone drives the line. Between objects it relaxes back into the thread. */
export function threadDrawing(progress: number, options?: { reduced?: boolean }): { name: string; strokes: Point[][] } {
  const span = Math.max(1, threadOrder.length - 1);
  const scaled = Math.min(span, Math.max(0, progress) * span);
  const index = Math.min(threadOrder.length - 1, Math.floor(scaled));
  const local = scaled - index;
  const name = threadOrder[index];
  const object = threadDrawings[name];
  if (options?.reduced) {
    if (progress < 0.02) return { name: "thread", strokes: thread };
    return { name, strokes: object };
  }
  if (index === threadOrder.length - 1) return { name, strokes: object };
  const next = threadDrawings[threadOrder[index + 1]];
  if (local < 0.5) {
    const amount = local / 0.5;
    return { name: amount < 0.45 ? name : "thread", strokes: mixAll(object, thread, amount) };
  }
  const amount = (local - 0.5) / 0.5;
  return { name: amount > 0.55 ? threadOrder[index + 1] : "thread", strokes: mixAll(thread, next, amount) };
}
