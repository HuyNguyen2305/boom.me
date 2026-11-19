import type { World } from "../world";
import { drawSprite } from "./pixels";

const CLOUD = [
  "....WWW.....",
  "..WWWWWWW.WW",
  "WWWWWWWWWWWW",
];
const CLOUDS = [
  { y: 0.14, speed: 0.012, offset: 0.1, px: 8 },
  { y: 0.3, speed: 0.02, offset: 0.55, px: 6 },
  { y: 0.2, speed: 0.008, offset: 0.85, px: 10 },
];

/** Pixel sun: a disc with eight short rays. */
function drawSun(ctx: CanvasRenderingContext2D, cx: number, cy: number, px: number) {
  ctx.fillStyle = "#ffd84d";
  for (let dy = -6; dy <= 6; dy++) {
    for (let dx = -6; dx <= 6; dx++) {
      const d2 = dx * dx + dy * dy;
      const ray = (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) && d2 >= 30 && d2 <= 72;
      if (d2 <= 16 || ray) ctx.fillRect(cx + dx * px, cy + dy * px, px, px);
    }
  }
}

/** Island with a coconut palm, sitting on the water line at x. */
function drawIsland(ctx: CanvasRenderingContext2D, x: number, sy: number) {
  const px = 6;
  // sand mound: four stacked rows, widest at the water
  [["#e8c98a", 26], ["#e8c98a", 20], ["#d9b873", 14], ["#d9b873", 8]].forEach(([c, cells], r) => {
    const w = (cells as number) * px;
    ctx.fillStyle = c as string;
    ctx.fillRect(x - w / 2, sy - (r + 1) * px + 4, w, px);
  });
  // trunk leaning right
  const top = sy - 4 * px - 10 * px;
  ctx.fillStyle = "#8a5a33";
  for (let i = 0; i < 10; i++) ctx.fillRect(x - 3 * px + Math.floor(i / 3) * px, sy - 4 * px - (i + 1) * px + 4, px, px);
  const tx = x - 3 * px + 3 * px;
  // fronds radiate and droop
  const fronds: [number, number][] = [[-1, 0.5], [-1, 0], [0, -0.8], [1, 0], [1, 0.5]];
  fronds.forEach(([vx, vy], f) => {
    for (let k = 1; k <= 5; k++) {
      ctx.fillStyle = (k + f) % 2 ? "#2f8f4e" : "#5bbf6a";
      ctx.fillRect(tx + vx * k * px, top + vy * k * px + k * k * 0.3 * px, px, px);
    }
  });
  ctx.fillStyle = "#5b3a1e";
  [[-1, 1], [0, 1.4], [1, 1]].forEach(([dx, dy]) => ctx.fillRect(tx + dx! * px * 0.8, top + dy! * px, px * 0.8, px * 0.8));
}

/** Everything above the water: sun, drifting clouds, island with coconut palm. */
export function drawSky(ctx: CanvasRenderingContext2D, w: World) {
  const sy = w.surfaceY - w.scrollY;
  if (sy < -20) return;
  const t = w.reduced ? 0 : w.t;

  drawSun(ctx, w.w * 0.82, sy - w.surfaceY * 0.7, 6);

  for (const c of CLOUDS) {
    const span = w.w + 240;
    const x = ((c.offset * span + t * c.speed) % span) - 120;
    ctx.globalAlpha = 0.92;
    drawSprite(ctx, CLOUD, { W: "#ffffff" }, x, sy - w.surfaceY * (1 - c.y) - 0, c.px);
    ctx.globalAlpha = 1;
  }

  drawIsland(ctx, Math.max(90, w.w * 0.1), sy);
}
