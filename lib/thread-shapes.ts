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
  const scaled = Math.min(0.9999, Math.max(0, progress)) * threadOrder.length;
  const index = Math.min(threadOrder.length - 1, Math.floor(scaled));
  const local = scaled - index;
  const name = threadOrder[index];
  const object = threadDrawings[name];
  if (options?.reduced) {
    if (progress < 0.02) return { name: "thread", strokes: thread };
    return { name, strokes: object };
  }
  const formed = local < 0.28 ? local / 0.28 : local > 0.72 ? (1 - local) / 0.28 : 1;
  const towardThread = local > 0.72;
  const strokes = towardThread ? mixAll(object, thread, 1 - formed) : mixAll(thread, object, formed);
  const showing = formed > 0.62 ? name : "thread";
  if (index === threadOrder.length - 1) {
    const end = Math.min(1, local / 0.55);
    return { name: end > 0.62 ? name : "thread", strokes: mixAll(thread, object, end) };
  }
  return { name: showing, strokes };
}
