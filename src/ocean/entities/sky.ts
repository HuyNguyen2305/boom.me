import type { World } from "../world";
import { drawSprite } from "./pixels";

// full round moon with a few craters; soft glow drawn behind it
const MOON = Array.from({ length: 19 }, (_, i) => {
  const dy = i - 9;
  return Array.from({ length: 19 }, (_, j) => {
    const dx = j - 9;
    const d2 = dx * dx + dy * dy;
    if (d2 > 81) return ".";
    const crater = [[-3, -3, 2], [3, 1, 3], [-2, 4, 1.5], [4, -4, 1.5]].some(([cx, cy, r]) => (dx - cx!) ** 2 + (dy - cy!) ** 2 <= r! * r!);
    return crater ? "c" : d2 > 64 ? "m" : "M";
  }).join("");
});
const MOON_COLORS = { M: "#dcebea", m: "#a8c4c6", c: "#bcd2d2" };

// dim night clouds: lit top edge, body, shaded belly
const CLOUD = [
  "........hhhhh",
  "......hhbbbbbbb..hhh",
  "...hhhbbbbbbbbbbhbbbbb",
  ".hhbbbbbbbbbbbbbbbbbbbbbb",
  "hbbbbbbbbbbbbbbbbbbbbbbbbb",
  "sbbbbbbbbbbbbbbbbbbbbbbbss",
  ".sssbbbbbbbbbbbbbbbbsssss",
];
const CLOUD_COLORS = { h: "#3a6574", b: "#284b58", s: "#1d3a46" };
// y offset from the top of the sky strip (below the 56px navbar), drift speed, scale, start
const CLOUDS = [
  { y: 66, speed: 0.012, px: 4, at: 0.08 },
  { y: 92, speed: 0.02, px: 3, at: 0.3 },
  { y: 72, speed: 0.008, px: 5, at: 0.52 },
  { y: 104, speed: 0.016, px: 3, at: 0.7 },
  { y: 62, speed: 0.01, px: 3, at: 0.9 },
];

/** The night sky strip: round moon and a few drifting clouds. */
export function drawSky(ctx: CanvasRenderingContext2D, w: World) {
  const top = -w.scrollY;
  if (top < -160) return;
  const t = w.reduced ? 0 : w.t;

  for (const c of CLOUDS) {
    const span = w.w + 300;
    const x = ((c.at * span + t * c.speed) % span) - 150;
    ctx.globalAlpha = 0.85;
    drawSprite(ctx, CLOUD, CLOUD_COLORS, x, top + c.y, c.px);
  }
  ctx.globalAlpha = 1;

  const mx = w.w * 0.8;
  const my = top + 58;
  const glow = ctx.createRadialGradient(mx + 38, my + 38, 20, mx + 38, my + 38, 90);
  glow.addColorStop(0, "rgb(220 235 234 / .18)");
  glow.addColorStop(1, "rgb(220 235 234 / 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(mx - 60, my - 60, 200, 200);
  drawSprite(ctx, MOON, MOON_COLORS, mx, my, 4);
}
