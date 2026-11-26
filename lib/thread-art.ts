export type Point = { x: number; y: number };

const COUNT = 640;
const STROKES = 8;

type Command = { op: string; args: number[] };

const arity: Record<string, number> = { M: 2, L: 2, H: 1, V: 1, C: 6, Q: 4, Z: 0 };

function commands(d: string): Command[] {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  const out: Command[] = [];
  let op = "";
  let args: number[] = [];
  const flush = () => {
    if (!op) return;
    out.push({ op, args });
    const upper = op.toUpperCase();
    if (upper === "M") op = op === "M" ? "L" : "l";
    args = [];
  };
  for (const token of tokens) {
    if (/[a-zA-Z]/.test(token)) {
      if (args.length) flush();
      op = token;
      args = [];
      if (arity[op.toUpperCase()] === 0) flush();
      continue;
    }
    args.push(Number(token));
    if (op && args.length === arity[op.toUpperCase()]) flush();
  }
  return out;
}

function sample(d: string): Point[][] {
  const strokes: Point[][] = [];
  let current: Point[] = [];
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  const add = (px: number, py: number) => {
    current.push({ x: px, y: py });
    x = px;
    y = py;
  };
  const curve = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number, steps: number) => {
    for (let i = 1; i <= steps; i += 1) {
      const t = i / steps;
      const u = 1 - t;
      add(
        u * u * u * x + 3 * u * u * t * ax + 3 * u * t * t * bx + t * t * t * cx,
        u * u * u * y + 3 * u * u * t * ay + 3 * u * t * t * by + t * t * t * cy,
      );
    }
  };
  const quad = (ax: number, ay: number, bx: number, by: number) => {
    for (let i = 1; i <= 10; i += 1) {
      const t = i / 10;
      const u = 1 - t;
      add(u * u * x + 2 * u * t * ax + t * t * bx, u * u * y + 2 * u * t * ay + t * t * by);
    }
  };
  for (const command of commands(d)) {
    const relative = command.op === command.op.toLowerCase();
    const op = command.op.toUpperCase();
    const a = command.args;
    const abs = (index: number, origin: number) => (relative ? origin + a[index] : a[index]);
    if (op === "M") {
      if (current.length > 1) strokes.push(current);
      current = [];
      x = abs(0, x);
      y = abs(1, y);
      startX = x;
      startY = y;
      current.push({ x, y });
    } else if (op === "L") {
      add(abs(0, x), abs(1, y));
    } else if (op === "H") {
      add(abs(0, x), y);
    } else if (op === "V") {
      add(x, abs(0, y));
    } else if (op === "C") {
      const x1 = abs(0, x);
      const y1 = abs(1, y);
      const x2 = abs(2, x);
      const y2 = abs(3, y);
      const x3 = abs(4, x);
      const y3 = abs(5, y);
      curve(x1, y1, x2, y2, x3, y3, 14);
    } else if (op === "Q") {
      const x1 = abs(0, x);
      const y1 = abs(1, y);
      const x2 = abs(2, x);
      const y2 = abs(3, y);
      quad(x1, y1, x2, y2);
    } else if (op === "Z") {
      add(startX, startY);
    }
  }
  if (current.length > 1) strokes.push(current);
  return strokes;
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
    const t = Math.min(1, Math.max(0, (target - lengths[previous]) / span));
    out.push({
      x: points[previous].x + (points[cursor].x - points[previous].x) * t,
      y: points[previous].y + (points[cursor].y - points[previous].y) * t,
    });
  }
  return out;
}

function circle(cx: number, cy: number, r: number): string {
  return `M ${cx - r} ${cy} C ${cx - r} ${cy - r * 0.55} ${cx - r * 0.55} ${cy - r} ${cx} ${cy - r} C ${cx + r * 0.55} ${cy - r} ${cx + r} ${cy - r * 0.55} ${cx + r} ${cy} C ${cx + r} ${cy + r * 0.55} ${cx + r * 0.55} ${cy + r} ${cx} ${cy + r} C ${cx - r * 0.55} ${cy + r} ${cx - r} ${cy + r * 0.55} ${cx - r} ${cy}`;
}

function prepare(parts: string[]): Point[][] {
  const raw = parts.flatMap((part) => sample(part));
  const resampled = raw.slice(0, STROKES).map((stroke) => resample(stroke));
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const stroke of resampled) {
    for (const point of stroke) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
  }
  const height = maxY - minY || 1;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const scale = 2 / height;
  const fitted = resampled.map((stroke) => stroke.map((point) => ({ x: (point.x - cx) * scale, y: (point.y - cy) * scale })));
  const seed = fitted[0]?.[0] ?? { x: 0, y: 0 };
  while (fitted.length < STROKES) fitted.push(Array.from({ length: COUNT }, () => ({ x: seed.x, y: seed.y })));
  return fitted;
}

const threadWave = Array.from({ length: 64 }, (_, index) => {
  const t = index / 63;
  return `${index === 0 ? "M" : "L"} ${50 + Math.sin(t * Math.PI * 2.2) * 7} ${6 + t * 88}`;
}).join(" ");

export const threadOrder = [
  "hand",
  "phone",
  "headphones",
  "record",
  "book",
  "diya",
  "nib",
  "grid",
  "bubbles",
  "dish",
  "buzzer",
  "trophy",
  "shirt",
  "camera",
  "document",
  "microphone",
  "chart",
  "stopwatch",
  "skyline",
  "globe",
  "car",
  "rocket",
  "knot",
] as const;

export const threadDrawings: Record<string, Point[][]> = {
  thread: prepare([threadWave]),
  hand: prepare([
    "M 78 16 C 62 18 56 40 58 64 C 60 96 66 124 78 140 C 88 154 112 150 118 128 C 126 100 122 60 116 36 C 110 16 94 12 78 16 Z",
    "M 86 36 C 94 30 108 36 106 52",
    "M 66 72 C 84 66 112 74 116 68",
    "M 68 98 C 86 92 110 100 114 94",
    "M 36 168 H 150",
  ]),
  phone: prepare([
    "M 62 14 H 138 C 150 14 158 22 158 36 V 116 C 158 130 150 138 138 138 H 62 C 50 138 42 130 42 116 V 36 C 42 22 50 14 62 14 Z",
    "M 54 32 H 146 V 112 H 54 Z",
    "M 88 22 H 112",
    "M 96 124 H 104",
    circle(78, 22, 2.2),
  ]),
  headphones: prepare([
    "M 46 96 C 46 36 154 36 154 96",
    "M 58 78 C 58 48 142 48 142 78",
    "M 18 84 H 62 C 74 84 80 92 80 104 V 142 C 80 156 70 166 56 166 H 28 C 14 166 6 156 6 142 V 104 C 6 92 12 84 18 84 Z",
    "M 22 104 H 64 V 146 H 22 Z",
    "M 138 84 H 182 C 194 84 200 92 200 104 V 142 C 200 156 190 166 176 166 H 148 C 134 166 126 156 126 142 V 104 C 126 92 132 84 138 84 Z",
    "M 142 104 H 184 V 146 H 142 Z",
  ]),
  record: prepare([
    circle(100, 76, 58),
    circle(100, 76, 42),
    circle(100, 76, 28),
    circle(100, 76, 14),
    circle(100, 76, 3),
    "M 100 22 L 108 34",
  ]),
  book: prepare([
    "M 28 28 C 60 20 78 36 100 48 C 122 36 140 20 172 28 L 172 118 C 140 108 122 120 100 128 C 78 120 60 108 28 118 Z",
    "M 100 48 L 100 128",
    "M 48 52 C 64 46 80 56 92 64",
    "M 48 70 C 66 64 82 74 92 82",
    "M 152 52 C 136 46 120 56 108 64",
    "M 152 70 C 134 64 118 74 108 82",
  ]),
  diya: prepare([
    "M 100 18 C 90 36 86 48 92 58 C 96 52 104 52 108 58 C 114 48 110 36 100 18",
    "M 100 62 C 70 62 42 78 48 98 C 70 112 130 112 152 98 C 158 78 130 62 100 62",
    "M 64 96 C 82 104 118 104 136 96",
    "M 92 58 L 100 70 L 108 58",
  ]),
  nib: prepare([
    "M 100 18 L 78 92 C 74 104 86 112 100 112 C 114 112 126 104 122 92 Z",
    "M 100 18 L 100 96",
    "M 86 78 H 114",
    "M 92 18 C 92 8 108 8 108 18",
    "M 84 112 C 70 128 60 132 48 128",
  ]),
  grid: prepare([
    "M 36 36 H 104 V 96 H 36 Z",
    "M 120 36 H 188 V 96 H 120 Z",
    "M 36 112 H 104 V 172 H 36 Z",
    "M 120 112 H 188 V 172 H 120 Z",
    "M 104 66 H 120 M 70 96 V 112 M 154 96 V 112",
  ]),
  bubbles: prepare([
    "M 24 28 H 96 C 108 28 116 36 116 48 V 70 C 116 82 108 90 96 90 H 52 L 36 108 L 40 90 H 24 C 12 90 4 82 4 70 V 48 C 4 36 12 28 24 28 Z",
    "M 22 46 H 90 M 22 60 H 72",
    "M 124 48 H 196 C 208 48 216 56 216 68 V 90 C 216 102 208 110 196 110 H 168 L 184 128 L 160 110 H 124 C 112 110 104 102 104 90 V 68 C 104 56 112 48 124 48 Z",
    "M 122 66 H 190 M 122 80 H 160",
  ]),
  dish: prepare([
    "M 36 86 C 52 40 148 40 164 86",
    "M 46 86 C 60 54 140 54 154 86",
    "M 100 58 L 100 28",
    "M 100 86 L 100 132",
    "M 72 132 H 128",
    "M 86 28 H 114",
  ]),
  buzzer: prepare([
    "M 48 78 H 152 C 164 78 170 88 170 100 V 118 H 30 V 100 C 30 88 36 78 48 78 Z",
    circle(100, 62, 28),
    circle(100, 62, 12),
    "M 70 118 H 130 V 128 H 70 Z",
    "M 100 34 V 22",
  ]),
  trophy: prepare([
    "M 70 24 H 130 V 70 C 130 98 70 98 70 70 Z",
    "M 70 36 C 48 36 40 58 52 70",
    "M 130 36 C 152 36 160 58 148 70",
    "M 92 98 H 108 V 116 H 78 V 128 H 122 V 116 H 108",
    "M 86 40 H 114",
  ]),
  shirt: prepare([
    "M 100 16 C 94 28 86 34 78 36 L 36 52 L 48 70 L 70 58 L 70 120 H 130 L 130 58 L 152 70 L 164 52 L 122 36 C 114 34 106 28 100 16",
    "M 92 16 C 96 28 104 28 108 16",
    "M 78 36 C 88 48 112 48 122 36",
    "M 70 80 H 130",
  ]),
  camera: prepare([
    "M 28 48 H 58 L 70 36 H 150 C 162 36 170 44 170 56 V 108 C 170 120 162 128 150 128 H 40 C 28 128 20 120 20 108 V 60 C 20 48 28 48 28 48 Z",
    circle(108, 84, 26),
    circle(108, 84, 12),
    "M 150 52 H 164",
    "M 36 36 H 58 V 48",
  ]),
  document: prepare([
    "M 36 16 H 112 L 136 40 V 132 H 36 Z",
    "M 112 16 V 40 H 136",
    "M 52 58 H 112 M 52 74 H 104 M 52 90 H 90",
    circle(118, 96, 22),
    "M 134 112 L 156 134",
    "M 108 86 H 128",
  ]),
  microphone: prepare([
    "M 78 24 H 122 C 132 24 138 32 138 44 V 72 C 138 92 122 104 100 104 C 78 104 62 92 62 72 V 44 C 62 32 68 24 78 24 Z",
    "M 70 44 H 130 M 70 58 H 130 M 70 72 H 130",
    "M 74 104 C 60 112 54 128 70 136 H 130 C 146 128 140 112 126 104",
    "M 100 136 V 156",
    "M 72 156 H 128",
  ]),
  chart: prepare([
    "M 28 20 V 128 H 176",
    "M 44 108 V 128 H 64 V 108 Z M 76 88 V 128 H 96 V 88 Z M 108 64 V 128 H 128 V 64 Z M 140 36 V 128 H 160 V 36 Z",
    "M 40 112 L 70 92 L 104 74 L 150 40",
  ]),
  stopwatch: prepare([
    circle(100, 86, 48),
    circle(100, 86, 40),
    "M 100 86 L 100 58",
    "M 100 86 L 124 98",
    "M 86 30 H 114 V 40 H 86 Z",
    "M 100 18 V 30",
  ]),
  skyline: prepare([
    "M 12 120 L 12 78 L 36 78 L 36 96 L 52 96 L 52 52 L 58 46 L 64 52 L 64 70 L 88 70 L 88 40 L 112 40 L 112 64 L 136 64 L 136 28 L 142 22 L 148 28 L 148 86 L 176 86 L 176 60 L 198 60 L 198 120",
    "M 22 90 H 30 M 22 102 H 30 M 96 52 H 104 M 96 64 H 104 M 124 40 H 132 M 124 52 H 132 M 160 96 H 168 M 186 74 H 194",
  ]),
  globe: prepare([
    circle(100, 78, 52),
    "M 48 78 H 152",
    "M 100 26 C 78 40 78 116 100 130",
    "M 100 26 C 122 40 122 116 100 130",
    "M 62 52 C 80 60 120 60 138 52",
    "M 62 104 C 80 96 120 96 138 104",
  ]),
  car: prepare([
    "M 16 70 L 16 22 L 54 28 L 54 40 L 22 48 L 22 58 L 54 64 L 54 74 L 16 70",
    "M 48 58 C 70 50 92 34 112 42 L 120 56 C 132 30 176 24 196 50 L 250 56 L 292 64 L 312 72 L 312 84 L 274 76 L 240 68",
    "M 118 66 C 160 56 230 58 258 72 L 176 90 L 112 88 C 90 84 86 72 104 64",
    "M 128 56 C 142 42 174 40 188 54",
    circle(84, 92, 26),
    circle(84, 92, 10) + " L 84 66 L 84 118 L 58 92 L 110 92",
    circle(258, 90, 26),
    circle(258, 90, 10) + " L 258 64 L 258 116 L 232 90 L 284 90",
  ]),
  rocket: prepare([
    "M 100 12 C 118 36 124 70 124 96 L 76 96 C 76 70 82 36 100 12 Z",
    "M 76 78 L 52 108 L 76 100",
    "M 124 78 L 148 108 L 124 100",
    circle(100, 58, 10),
    "M 86 96 C 92 118 108 118 114 96",
    "M 92 108 C 96 124 104 124 108 108",
  ]),
  knot: prepare([
    "M 40 70 C 40 36 160 36 160 70 C 160 104 40 104 40 78 C 40 52 150 56 132 80 C 114 104 70 96 78 72 C 86 50 130 58 120 78",
  ]),
};
