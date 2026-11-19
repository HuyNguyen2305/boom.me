import type { World } from "../world";

/** Sand strip at the bottom of the last section, with swaying kelp. */
export function drawSeafloor(ctx: CanvasRenderingContext2D, w: World) {
  const fy = w.floorY - w.scrollY;
  if (fy > w.h + 60 || fy < -60) return;
  ctx.fillStyle = "#c98b55";
  ctx.fillRect(0, fy - 24, w.w, 24);
  ctx.fillStyle = "#a76f3f";
  for (let x = 0; x < w.w; x += 32) ctx.fillRect(x + (x % 3) * 4, fy - 20, 6, 4);
  ctx.fillStyle = "#7fbf7a";
  for (let x = 40; x < w.w; x += 110) {
    for (let i = 0; i < 6; i++) {
      const sway = w.reduced ? 0 : Math.sin(w.t / 700 + x + i * 0.6) * i * 1.2;
      ctx.fillRect(x + sway, fy - 24 - (i + 1) * 8, 6, 8);
    }
  }
}
