export type VeilHole = { x: number; y: number; w: number; h: number };

type VeilState = { canvas: HTMLCanvasElement; left: number; top: number; width: number; height: number };

declare global {
  interface Window {
    __threadVeil?: (x: number, y: number) => number;
    __threadPlacement?: string;
    __contentX?: number;
  }
}

function outside(px: number, py: number, hole: VeilHole) {
  const dx = px < hole.x ? hole.x - px : px > hole.x + hole.w ? px - (hole.x + hole.w) : 0;
  const dy = py < hole.y ? hole.y - py : py > hole.y + hole.h ? py - (hole.y + hole.h) : 0;
  return Math.hypot(dx, dy);
}

/** Full strength everywhere the line misses the words and the picture. Dim only inside rects it actually crosses. */
export function renderVeil(width: number, height: number, holes: VeilHole[] | null) {
  const canvas = document.createElement("canvas");
  const step = 4;
  canvas.width = Math.max(1, Math.ceil(width / step));
  canvas.height = Math.max(1, Math.ceil(height / step));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return canvas;
  const image = ctx.createImageData(canvas.width, canvas.height);
  const data = image.data;
  const feather = 28;
  const active = (holes ?? []).filter((hole) => hole.w > 4 && hole.h > 4);
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const px = x * step + step / 2;
      const py = y * step + step / 2;
      let amount = 1;
      for (const hole of active) {
        const dist = outside(px, py, hole);
        const here = dist === 0 ? 0.15 : 0.15 + 0.85 * Math.min(1, dist / feather);
        amount = Math.min(amount, here);
      }
      const index = (y * canvas.width + x) * 4;
      data[index] = 255;
      data[index + 1] = 255;
      data[index + 2] = 255;
      data[index + 3] = Math.round(amount * 255);
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

type Box = { left: number; top: number; right: number; bottom: number };

export function holesForOverlap(samples: { x: number; y: number }[], rects: Box[], origin: { left: number; top: number }): VeilHole[] {
  const pad = 8;
  return rects
    .filter((rect) => rect.right - rect.left > 2 && rect.bottom - rect.top > 2)
    .filter((rect) =>
      samples.some((point) => point.x >= rect.left - pad && point.x <= rect.right + pad && point.y >= rect.top - pad && point.y <= rect.bottom + pad),
    )
    .map((rect) => ({
      x: rect.left - origin.left,
      y: rect.top - origin.top,
      w: rect.right - rect.left,
      h: rect.bottom - rect.top,
    }));
}

export function applyVeil(element: HTMLElement, mask: HTMLCanvasElement) {
  const url = mask.toDataURL();
  const value = `url("${url}")`;
  element.style.maskImage = value;
  element.style.setProperty("-webkit-mask-image", value);
  element.style.maskSize = "100% 100%";
  element.style.setProperty("-webkit-mask-size", "100% 100%");
  element.style.maskRepeat = "no-repeat";
  element.style.setProperty("-webkit-mask-repeat", "no-repeat");
  element.style.maskMode = "alpha";
}

export function publishVeil(state: VeilState) {
  window.__threadVeil = (x: number, y: number) => {
    const ctx = state.canvas.getContext("2d");
    if (!ctx || state.width < 1 || state.height < 1) return 1;
    const px = Math.round(((x - state.left) / state.width) * (state.canvas.width - 1));
    const py = Math.round(((y - state.top) / state.height) * (state.canvas.height - 1));
    if (px < 0 || py < 0 || px >= state.canvas.width || py >= state.canvas.height) return 1;
    return ctx.getImageData(px, py, 1, 1).data[3] / 255;
  };
}
