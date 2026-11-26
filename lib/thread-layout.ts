export type ThreadPlacement = "full-bleed" | "right" | "left" | "behind";

export type ThreadLayout = {
  placement: ThreadPlacement;
  /** Fraction of viewport height, or of width for a full-bleed shape. */
  scale: number;
  shot: "left" | "right";
  /** Which side the words sit on, so a centred shape can lean away from them. */
  text: "left" | "right";
};

export const threadLayouts: Record<string, ThreadLayout> = {
  phone: { placement: "behind", scale: 0.66, shot: "left", text: "left" },
  headphones: { placement: "behind", scale: 0.68, shot: "left", text: "right" },
  book: { placement: "behind", scale: 0.66, shot: "right", text: "left" },
  nib: { placement: "right", scale: 0.62, shot: "left", text: "left" },
  bubbles: { placement: "behind", scale: 0.66, shot: "left", text: "right" },
  buzzer: { placement: "left", scale: 0.58, shot: "right", text: "right" },
  shirt: { placement: "right", scale: 0.64, shot: "left", text: "left" },
  document: { placement: "left", scale: 0.62, shot: "right", text: "right" },
  microphone: { placement: "left", scale: 0.66, shot: "right", text: "right" },
  chart: { placement: "right", scale: 0.64, shot: "left", text: "left" },
  stopwatch: { placement: "left", scale: 0.62, shot: "right", text: "right" },
  globe: { placement: "behind", scale: 0.68, shot: "right", text: "left" },
  car: { placement: "full-bleed", scale: 0.98, shot: "left", text: "right" },
  knot: { placement: "behind", scale: 0.56, shot: "left", text: "left" },
};

export type ThreadSlot = {
  cx: number;
  cy: number;
  maxW: number;
  maxH: number;
  placement: ThreadPlacement;
};

function padFor(vw: number) {
  return Math.min(40, Math.max(20, vw * 0.022));
}

/** 0 is content on the left, 0.5 centred, 1 on the right. The sequence is left, centre, right, centre, and back. */
export function contentAlignAt(index: number) {
  const phase = ((index % 4) + 4) % 4;
  if (phase === 0) return 0;
  if (phase === 2) return 1;
  return 0.5;
}

export function contentWave(progress: number, count: number) {
  const span = Math.max(1, count - 1);
  const scaled = Math.min(span, Math.max(0, progress) * span);
  const index = Math.floor(scaled);
  const next = Math.min(span, index + 1);
  const local = index === next ? 0 : scaled - index;
  const t = local * local * (3 - 2 * local);
  const x = contentAlignAt(index) + (contentAlignAt(next) - contentAlignAt(index)) * t;
  const scale = 1 - 0.06 * Math.sin(local * Math.PI);
  return { x, scale };
}

/** Where a shape sits. `align` is the content wave so the object glides with the words. */
export function threadSlot(shape: string, vw: number, vh: number, align = 0.5): ThreadSlot {
  const layout = threadLayouts[shape] ?? { placement: "behind" as const, scale: 0.66, shot: "left" as const, text: "left" as const };
  const pad = padFor(vw);
  if (layout.placement === "full-bleed") {
    return { cx: vw / 2, cy: vh * 0.5, maxW: vw * layout.scale, maxH: vh * 0.86, placement: "full-bleed" };
  }
  if (layout.placement === "left" || layout.placement === "right") {
    const edgeW = vw * 0.32;
    const span = Math.max(0, vw - pad * 2 - edgeW);
    const objectX = 1 - align;
    const centered = 1 - Math.min(1, Math.abs(align - 0.5) * 2);
    const edgeCx = pad + edgeW / 2 + objectX * span;
    return {
      cx: edgeCx + (vw / 2 - edgeCx) * centered,
      cy: vh * 0.5,
      maxW: vw * (0.32 + centered * 0.28),
      maxH: vh * layout.scale,
      placement: centered > 0.65 ? "behind" : objectX > 0.5 ? "right" : "left",
    };
  }
  return {
    cx: vw / 2 + (0.5 - align) * vw * 0.22,
    cy: vh * 0.46,
    maxW: vw * 0.7,
    maxH: vh * layout.scale,
    placement: "behind",
  };
}

export function mixSlot(from: ThreadSlot, to: ThreadSlot, amount: number): ThreadSlot {
  const t = amount * amount * (3 - 2 * amount);
  return {
    cx: from.cx + (to.cx - from.cx) * t,
    cy: from.cy + (to.cy - from.cy) * t,
    maxW: from.maxW + (to.maxW - from.maxW) * t,
    maxH: from.maxH + (to.maxH - from.maxH) * t,
    placement: t < 0.5 ? from.placement : to.placement,
  };
}
