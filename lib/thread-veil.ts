export type VeilHole = { x: number; y: number; w: number; h: number };

type VeilState = { canvas: HTMLCanvasElement; left: number; top: number; width: number; height: number };

declare global {
  interface Window {
    __threadVeil?: (x: number, y: number) => number;
    __threadPlacement?: string;
  }
}

/** White outside the words, 0.15 inside the text rect, feathered past its edge. */
export function renderVeil(width: number, height: number, hole: VeilHole | null) {
  const canvas = document.createElement("canvas");
  const step = 4;
  canvas.width = Math.max(1, Math.ceil(width / step));
  canvas.height = Math.max(1, Math.ceil(height / step));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return canvas;
  const image = ctx.createImageData(canvas.width, canvas.height);
  const data = image.data;
  const feather = 40;
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const px = x * step + step / 2;
      const py = y * step + step / 2;
      let amount = 1;
      if (hole && hole.w > 8 && hole.h > 8) {
        const dx = px < hole.x ? hole.x - px : px > hole.x + hole.w ? px - (hole.x + hole.w) : 0;
        const dy = py < hole.y ? hole.y - py : py > hole.y + hole.h ? py - (hole.y + hole.h) : 0;
        const dist = Math.hypot(dx, dy);
        amount = dist === 0 ? 0.15 : 0.15 + 0.85 * Math.min(1, dist / feather);
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
