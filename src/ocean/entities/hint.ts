import type { World } from "../world";

const LINES = ["↓ Dive    ↑ Rise", "←  →  Swim", "E   Open a work"];

/** Controls hint floating just above the fish; fades once the visitor has steered or scrolled. */
export function drawHint(ctx: CanvasRenderingContext2D, w: World, alpha: number) {
  if (alpha < 0.02 || w.w < 640) return;
  const bw = 196;
  const bh = 78;
  const x = Math.round(Math.min(w.w - bw - 8, Math.max(8, w.fishX - bw / 2)));
  const y = Math.round(w.fishY - 34 - bh);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#0d2a33";
  ctx.fillRect(x, y, bw, bh);
  ctx.strokeStyle = "rgb(60 198 192 / .5)";
  ctx.strokeRect(x + 0.5, y + 0.5, bw - 1, bh - 1);
  ctx.fillStyle = "#0d2a33"; // pointer square toward the fish
  ctx.fillRect(Math.round(w.fishX) - 5, y + bh, 10, 6);
  ctx.fillStyle = "#dcebea";
  ctx.font = "12px ui-monospace, monospace";
  LINES.forEach((l, i) => ctx.fillText(l, x + 14, y + 26 + i * 20));
  ctx.restore();
}
