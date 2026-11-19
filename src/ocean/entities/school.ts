import type { World } from "../world";
import { drawSprite } from "./pixels";

const SMALL = ["..SS", "SSSS", "..SS"];
export type Fish = { x: number; y: number; speed: number; dir: 1 | -1 };

const COUNT = 9;
// deterministic pseudo-random so the school is identical on every load
const seed = (i: number, n: number) => (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1;

export function createSchool(): Fish[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    x: seed(i, 1) * 1600,
    y: 0.1 + seed(i, 2) * 0.8,
    speed: 0.15 + seed(i, 3) * 0.25,
    dir: seed(i, 4) > 0.5 ? 1 : -1,
  }));
}

/** Background fish: teal near the surface, yellow mid-water, glowing lantern fish in the deep. */
export function drawSchool(ctx: CanvasRenderingContext2D, w: World, school: Fish[]) {
  const color = w.depth < 40 ? "#3cc6c0" : w.depth < 150 ? "#e0c25a" : "#b8f2ee";
  ctx.globalAlpha = 0.28;
  if (w.depth >= 150) {
    ctx.shadowColor = "#b8f2ee";
    ctx.shadowBlur = 8;
  }
  for (const f of school) {
    if (!w.reduced) f.x += f.speed * f.dir * 2;
    const span = w.w + 40;
    const x = (((f.x % span) + span) % span) - 20;
    ctx.save();
    if (f.dir < 0) {
      ctx.translate(x + 16, 0);
      ctx.scale(-1, 1);
      ctx.translate(-x, 0);
    }
    drawSprite(ctx, SMALL, { S: color }, x, f.y * w.h, 4);
    ctx.restore();
  }
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}
