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

/** Pixel sun: shaded disc with eight rays, built once as string art. */
const SUN = Array.from({ length: 27 }, (_, i) => {
  const dy = i - 13;
  return Array.from({ length: 27 }, (_, j) => {
    const dx = j - 13;
    const d2 = dx * dx + dy * dy;
    const ray = (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) && d2 >= 100 && d2 <= 190;
    if (ray) return "Y";
    return d2 > 64 ? "." : d2 <= 20 ? "c" : d2 <= 52 ? "Y" : "o";
  }).join("");
});
const SUN_COLORS = { Y: "#ffd84d", c: "#fff0a0", o: "#f5b82e" };

/** Everything above the water: sun and drifting clouds. */
export function drawSky(ctx: CanvasRenderingContext2D, w: World) {
  const sy = w.surfaceY - w.scrollY;
  if (sy < -20) return;
  const t = w.reduced ? 0 : w.t;

  drawSprite(ctx, SUN, SUN_COLORS, w.w * 0.68 - 13 * 4, sy - w.surfaceY * 0.7 - 13 * 4, 4);

  for (const c of CLOUDS) {
    const span = w.w + 240;
    const x = ((c.offset * span + t * c.speed) % span) - 120;
    ctx.globalAlpha = 0.92;
    drawSprite(ctx, CLOUD, { W: "#ffffff", s: "#d6ecfa" }, x, sy - w.surfaceY * (1 - c.y), c.px);
    ctx.globalAlpha = 1;
  }

}
