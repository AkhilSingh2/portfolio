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
