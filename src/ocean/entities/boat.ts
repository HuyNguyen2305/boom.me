import type { World } from "../world";
import { drawSprite } from "./pixels";

// h straw hat, S skin, E eye, b beard, G shirt, W/D wooden hull
const BOAT = [
  ".......hhh........",
  "......hhhhh.......",
  "....hhhhhhhhh.....",
  ".......SSSS.......",
  ".......SESS.......",
  ".......bbbb.......",
  "......GGGGGG......",
  "......GGGGGG......",
  "WWDWWDWWDWWDWWDWWW",
  ".WWDWWDWWDWWDWWDW.",
  "..WWWWWWWWWWWWWW..",
];
const COLORS = { h: "#e0b050", S: "#e8c9a0", E: "#071c24", b: "#dcebea", G: "#7fbf7a", W: "#8a5a33", D: "#6e4526" };
const PX = 5;

/** Fisherman in a wooden boat on the water line, plus the wave line itself. */
export function drawBoat(ctx: CanvasRenderingContext2D, w: World) {
  const sy = w.surfaceY - w.scrollY;
  if (sy < -80 || sy > w.h + 20) return;
  const t = w.reduced ? 0 : w.t;
  const bob = Math.sin(t / 900) * 2;

  const bx = w.w * 0.34;
  const by = sy - 11 * PX + bob + 10; // hull sits low in the water
  drawSprite(ctx, BOAT, COLORS, bx, by, PX);

  // rod from the hand, line dropping into the water
  const hx = bx + 12 * PX;
  const hy = by + 6 * PX;
  ctx.strokeStyle = "#6e4526";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(hx, hy);
  ctx.lineTo(hx + 7 * PX, hy - 4 * PX);
  ctx.stroke();
  ctx.strokeStyle = "rgb(255 255 255 / .7)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(hx + 7 * PX, hy - 4 * PX);
  ctx.lineTo(hx + 7 * PX, sy + 70 + bob);
  ctx.stroke();

  // wave line, drawn last so it overlaps the hull and island
  ctx.strokeStyle = "#9fe6e2";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= w.w; x += 8) {
    const y = sy + Math.sin(x / 40 + t / 500) * 2;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.lineWidth = 1;
}
