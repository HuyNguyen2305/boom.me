import type { World } from "../world";
import { drawSprite } from "./pixels";

// Red and white sea mark: striped cone with a rust ring, a dark cage and a lamp that blinks.
// R/W lit side, r/w shaded side, K cage, Y lamp
const BODY = [
  "........YYYY........",
  "........YYYY........",
  ".......KKKKKK.......",
  ".......K.KK.K.......",
  ".......K.KK.K.......",
  ".......KKKKKK.......",
  ".......RRRRrr.......",
  ".......RRRRrr.......",
  "......RRRRRRrr......",
  "......WWWWWWww......",
  ".....WWWWWWWWww.....",
  ".....WWWWWWWWww.....",
  "....RRRRRRRRRRrr....",
  "....RRRRRRRRRRrr....",
  "...RRRRRRRRRRRRrr...",
  "...WWWWWWWWWWWWww...",
  "..WWWWWWWWWWWWWWww..",
  "..WWWWWWWWWWWWWWww..",
  ".RRRRRRRRRRRRRRRRrr.",
  ".RRRRRRRRRRRRRRRRrr.",
  "KKKKKKKKKKKKKKKKKKKK",
  "KSSSSSSSSSSSSSSSSSSK",
  ".KKKKKKKKKKKKKKKKKK.",
];
const PX = 5;
const COLORS = { R: "#e0443d", r: "#a82822", W: "#f6f6f2", w: "#b4b9b4", K: "#3a4248", S: "#8a4b2a", Y: "#ffd84d" };
const OFF = BODY.map((r) => r.replace(/Y/g, "K"));

/** Marker buoy bobbing at the surface, right above the fish lane. */
export function drawBuoy(ctx: CanvasRenderingContext2D, w: World, x: number) {
  const sy = w.surfaceY - w.scrollY;
  if (sy < -120 || sy > w.h + 20) return;
  const t = w.reduced ? 0 : w.t;
  const bob = Math.sin(t / 700) * 2;
  const tilt = Math.sin(t / 1100) * 0.04;
  const lamp = w.reduced || Math.floor(t / 700) % 2 === 0;

  ctx.strokeStyle = "rgb(255 255 255 / .45)"; // mooring line
  ctx.beginPath();
  ctx.moveTo(x, sy + 8);
  ctx.lineTo(x, sy + 52);
  ctx.stroke();

  ctx.save();
  ctx.translate(x, sy + 8 + bob);
  ctx.rotate(tilt);
  drawSprite(ctx, lamp ? BODY : OFF, COLORS, (-BODY[0]!.length * PX) / 2, -BODY.length * PX, PX);
  ctx.restore();
}
