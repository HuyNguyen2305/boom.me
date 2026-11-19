import type { World } from "../world";
import { drawSprite } from "./pixels";

const CLOUD = [
  "........WWWWWW",
  "......WWWWWWWWWW..WWW",
  "...WWWWWWWWWWWWWWWWWWWW",
  ".WWWWWWWWWWWWWWWWWWWWWWWW",
  "WWWWWWWWWWWWWWWWWWWWWWWWW",
  "sWWWWWWWWWWWWWWWWWWWWWWss",
  ".ssssWWWWWWWWWWWWWWsssss",
];
const CLOUDS = [
  { y: 0.14, speed: 0.012, offset: 0.1, px: 4 },
  { y: 0.3, speed: 0.02, offset: 0.55, px: 3 },
  { y: 0.2, speed: 0.008, offset: 0.85, px: 5 },
];

/** Pixel sun: shaded disc with eight rays. */
function drawSun(ctx: CanvasRenderingContext2D, cx: number, cy: number, px: number) {
  for (let dy = -13; dy <= 13; dy++) {
    for (let dx = -13; dx <= 13; dx++) {
      const d2 = dx * dx + dy * dy;
      const ray = (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) && d2 >= 100 && d2 <= 190;
      if (d2 > 64 && !ray) continue;
      ctx.fillStyle = ray ? "#ffd84d" : d2 <= 20 ? "#fff0a0" : d2 <= 52 ? "#ffd84d" : "#f5b82e";
      ctx.fillRect(cx + dx * px, cy + dy * px, px, px);
    }
  }
}

/** Everything above the water: sun and drifting clouds. */
export function drawSky(ctx: CanvasRenderingContext2D, w: World) {
  const sy = w.surfaceY - w.scrollY;
  if (sy < -20) return;
  const t = w.reduced ? 0 : w.t;

  drawSun(ctx, w.w * 0.68, sy - w.surfaceY * 0.7, 4);

  for (const c of CLOUDS) {
    const span = w.w + 240;
    const x = ((c.offset * span + t * c.speed) % span) - 120;
    ctx.globalAlpha = 0.92;
    drawSprite(ctx, CLOUD, { W: "#ffffff", s: "#d6ecfa" }, x, sy - w.surfaceY * (1 - c.y), c.px);
    ctx.globalAlpha = 1;
  }

}
