import type { World } from "../world";
import { drawSprite } from "./pixels";

const BOAT = [
  "......HHHH......",
  "......SSSS......",
  "......SBBS......",
  "....RRRRRRR.....",
  "....RRRRRRR.....",
  "WWWWWWWWWWWWWWWW",
  ".WWWWWWWWWWWWWW.",
  "..WWWWWWWWWWWW..",
];
const COLORS = { H: "#c98b55", S: "#e8c9a0", B: "#dcebea", R: "#7fbf7a", W: "#8a5a33" };
const MOON = [
  "..MMMM..",
  ".MMMM...",
  "MMMM....",
  "MMMM....",
  "MMMM....",
  ".MMMM...",
  "..MMMM..",
];

/** Sky strip: moon, waves, fisherman in a boat with a speech bubble. */
export function drawSurface(ctx: CanvasRenderingContext2D, w: World) {
  const sy = w.surfaceY - w.scrollY;
  if (sy < -120 || sy > w.h + 20) return;
  const t = w.reduced ? 0 : w.t;

  drawSprite(ctx, MOON, { M: "#dcebea" }, w.w - 120, sy - 120, 5);

  const bx = Math.max(24, w.w * 0.14);
  const bob = Math.sin(t / 900) * 2;
  const px = 5;
  const by = sy - 8 * px + bob + 6;
  drawSprite(ctx, BOAT, COLORS, bx, by, px);
  // fishing line into the water
  ctx.strokeStyle = "rgb(220 235 234 / .6)";
  ctx.beginPath();
  ctx.moveTo(bx + 16 * px, by + 3 * px);
  ctx.lineTo(bx + 16 * px + 20, sy + 60 + bob);
  ctx.stroke();
  // speech bubble
  if (w.w >= 640) {
    ctx.font = "12px ui-monospace, monospace";
    const msg = "Hi! Grab a fish and dive.";
    const tw = ctx.measureText(msg).width + 16;
    ctx.fillStyle = "#0d2a33";
    ctx.strokeStyle = "rgb(60 198 192 / .5)";
    ctx.fillRect(bx + 100, by - 34, tw, 26);
    ctx.strokeRect(bx + 100, by - 34, tw, 26);
    ctx.fillStyle = "#dcebea";
    ctx.fillText(msg, bx + 108, by - 17);
  }

  // wave line
  ctx.strokeStyle = "#3cc6c0";
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
