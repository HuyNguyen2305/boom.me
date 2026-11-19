import type { World } from "../world";
import { drawSprite } from "./pixels";

// Red and white sea mark with a dark cage, a blinking lamp and a steel float under the water.
// r/w = shaded side. Rows 0-14 float above the surface, rows 15+ are submerged.
const BODY = [
  ".......YY.......",
  ".......KK.......",
  "......KKKK......",
  "......RRRr......",
  "......RRRr......",
  ".....WWWWww.....",
  ".....WWWWww.....",
  "....RRRRRRrr....",
  "....RRRRRRrr....",
  "...WWWWWWWWww...",
  "...WWWWWWWWww...",
  "..RRRRRRRRRRrr..",
  "..RRRRRRRRRRrr..",
  ".WWWWWWWWWWWWww.",
  ".KKKKKKKKKKKKKK.",
  "..SSSSSSSSSSss..",
  "..SSSSSSSSSSss..",
  "...SSSSSSSSss...",
  "....SSSSSSss....",
  ".....SSSSss.....",
  "......SSss......",
];
const ABOVE = 15;
const OFF = BODY.map((r) => r.replace(/Y/g, "K"));
const COLORS = { R: "#e0443d", r: "#a82822", W: "#f6f6f2", w: "#b4b9b4", K: "#3a4248", Y: "#ffd84d", S: "#6f8a96", s: "#506a76" };
const PX = 3;

/** Small marker buoy bobbing on the surface in the sky strip, its steel float visible under the water. */
export function drawBuoy(ctx: CanvasRenderingContext2D, w: World) {
  const sy = w.surfaceY - w.scrollY;
  if (sy < -80 || sy > w.h + 20) return;
  const t = w.reduced ? 0 : w.t;
  const x = w.w * 0.58;
  const lamp = w.reduced || Math.floor(t / 700) % 2 === 0;
  const rows = lamp ? BODY : OFF;

  ctx.save();
  ctx.translate(x, sy + Math.sin(t / 700) * 1.5);
  ctx.rotate(Math.sin(t / 1100) * 0.04);
  const x0 = (-BODY[0]!.length * PX) / 2;
  const y0 = -ABOVE * PX;
  // submerged part: dimmer, clipped below the waterline
  ctx.save();
  ctx.beginPath();
  ctx.rect(-80, 0, 160, 120);
  ctx.clip();
  ctx.globalAlpha = 0.55;
  drawSprite(ctx, rows, COLORS, x0, y0, PX);
  ctx.restore();
  // floating part, full strength, clipped above the waterline
  ctx.beginPath();
  ctx.rect(-80, -160, 160, 160);
  ctx.clip();
  drawSprite(ctx, rows, COLORS, x0, y0, PX);
  ctx.restore();
}
