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

/** Where a shape sits for one step. Slots are viewport math so they can tween before the next card is shown. */
export function threadSlot(shape: string, vw: number, vh: number): ThreadSlot {
  const layout = threadLayouts[shape] ?? { placement: "behind" as const, scale: 0.66, shot: "left" as const, text: "left" as const };
  const pad = padFor(vw);
  if (layout.placement === "full-bleed") {
    return { cx: vw / 2, cy: vh * 0.5, maxW: vw * layout.scale, maxH: vh * 0.86, placement: "full-bleed" };
  }
  if (layout.placement === "left" || layout.placement === "right") {
    const contentW = vw * 0.48;
    const free =
      layout.placement === "left"
        ? { start: pad, end: vw - pad - contentW - 36 }
        : { start: pad + contentW + 36, end: vw - pad };
    return {
      cx: (free.start + free.end) / 2,
      cy: vh * 0.5,
      maxW: Math.max(120, free.end - free.start),
      maxH: vh * layout.scale,
      placement: layout.placement,
    };
  }
  const lean = layout.text === "right" ? -1 : 1;
  return {
    cx: vw / 2 + lean * vw * 0.07,
    cy: vh * 0.46,
    maxW: vw * 0.84,
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
