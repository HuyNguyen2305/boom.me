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

/** Island with a coconut palm, sitting on the water line at x. */
function drawIsland(ctx: CanvasRenderingContext2D, x: number, sy: number) {
  const px = 3;
  // sand mound: stacked rows, widest at the water, with a darker speckle pattern
  const widths = [56, 50, 44, 38, 30, 22, 14];
  widths.forEach((cells, r) => {
    const y = sy - (r + 1) * px + 3;
    for (let c = 0; c < cells; c++) {
      ctx.fillStyle = (c + r * 3) % 7 === 0 ? "#c9a566" : r > 3 ? "#d9b873" : "#e8c98a";
      ctx.fillRect(x - (cells * px) / 2 + c * px, y, px, px);
    }
  });
  // trunk: curves to the right as it climbs
  const base = sy - widths.length * px + 3;
  const height = 24;
  let tx = x - 2 * px;
  for (let i = 0; i < height; i++) {
    tx = x - 2 * px + Math.round(Math.sin((i / height) * 1.4) * 7) * px;
    ctx.fillStyle = i % 3 === 0 ? "#6e4526" : "#8a5a33";
    ctx.fillRect(tx, base - (i + 1) * px, 2 * px, px);
  }
  const top = base - height * px;
  // fronds radiate and droop; two greens plus a light tip
  const fronds: [number, number][] = [[-1, 0.6], [-1, 0.1], [-0.6, -0.6], [0, -0.8], [0.6, -0.6], [1, 0.1], [1, 0.6]];
  fronds.forEach(([vx, vy], f) => {
    for (let k = 1; k <= 16; k++) {
      const d = k * 0.75; // step in cells, so fronds read as solid leaves
      ctx.fillStyle = k === 16 ? "#8fe08f" : (k + f) % 2 ? "#2f8f4e" : "#46a85a";
      ctx.fillRect(tx + vx * d * px * 1.2, top + vy * d * px + d * d * 0.12 * px, px * 1.5, px * 1.5);
    }
  });
  ctx.fillStyle = "#5b3a1e";
  [[-2, 1], [0, 2], [2, 1]].forEach(([dx, dy]) => ctx.fillRect(tx + dx! * px, top + dy! * px, 2 * px, 2 * px));
}

/** Everything above the water: sun, drifting clouds, island with coconut palm. */
export function drawSky(ctx: CanvasRenderingContext2D, w: World) {
  const sy = w.surfaceY - w.scrollY;
  if (sy < -20) return;
  const t = w.reduced ? 0 : w.t;

  drawSun(ctx, w.w * 0.74, sy - w.surfaceY * 0.7, 4);

  for (const c of CLOUDS) {
    const span = w.w + 240;
    const x = ((c.offset * span + t * c.speed) % span) - 120;
    ctx.globalAlpha = 0.92;
    drawSprite(ctx, CLOUD, { W: "#ffffff", s: "#d6ecfa" }, x, sy - w.surfaceY * (1 - c.y), c.px);
    ctx.globalAlpha = 1;
  }

  if (w.w >= 640) drawIsland(ctx, w.w * 0.9, sy);
}
