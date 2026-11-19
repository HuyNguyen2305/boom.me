import type { World } from "../world";
import { drawSprite } from "./pixels";

// Red and white sea mark with a dark cage and a lamp that blinks. r/w = shaded side.
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
];
const OFF = BODY.map((r) => r.replace(/Y/g, "K"));
const COLORS = { R: "#e0443d", r: "#a82822", W: "#f6f6f2", w: "#b4b9b4", K: "#3a4248", Y: "#ffd84d" };
const PX = 3;

/** Small marker buoy bobbing on the surface in the sky strip. */
export function drawBuoy(ctx: CanvasRenderingContext2D, w: World) {
  const sy = w.surfaceY - w.scrollY;
  if (sy < -80 || sy > w.h + 20) return;
  const t = w.reduced ? 0 : w.t;
  const x = w.w * 0.58;
  const bob = Math.sin(t / 700) * 1.5;
  const lamp = w.reduced || Math.floor(t / 700) % 2 === 0;

  ctx.strokeStyle = "rgb(220 235 234 / .35)"; // mooring line
  ctx.beginPath();
  ctx.moveTo(x, sy + 4);
  ctx.lineTo(x, sy + 40);
  ctx.stroke();

  ctx.save();
  ctx.translate(x, sy + 4 + bob);
  ctx.rotate(Math.sin(t / 1100) * 0.04);
  drawSprite(ctx, lamp ? BODY : OFF, COLORS, (-BODY[0]!.length * PX) / 2, -BODY.length * PX, PX);
  ctx.restore();
}
