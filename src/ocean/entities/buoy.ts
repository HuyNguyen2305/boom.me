import type { World } from "../world";
import { drawSprite } from "./pixels";

// Red and white sea mark: striped cone, dark cage on top, a lamp that blinks.
const BUOY = [
  ".......YY.......",
  ".......KK.......",
  "......KKKK......",
  "......RRRR......",
  "......RRRR......",
  ".....WWWWWW.....",
  ".....WWWWWW.....",
  "....RRRRRRRR....",
  "....RRRRRRRR....",
  "...WWWWWWWWWW...",
  "...WWWWWWWWWW...",
  "..RRRRRRRRRRRR..",
  "..RRRRRRRRRRRR..",
  ".WWWWWWWWWWWWWW.",
  ".KKKKKKKKKKKKKK.",
];
const PX = 3;
const COLORS = { R: "#d8352f", r: "#9b2420", W: "#f2f2ee", w: "#b9bdb8", K: "#3a4248", Y: "#ffd84d" };

// the right-hand cells of each row are shaded darker so the cone reads as round
const SHADED = BUOY.map((row) => {
  const last = row.search(/[^.][.]*$/);
  return row.slice(0, last - 1) + row.slice(last - 1, last + 1).replace(/R/g, "r").replace(/W/g, "w") + row.slice(last + 1);
});

/** Marker buoy bobbing at the surface, right above the fish lane. */
export function drawBuoy(ctx: CanvasRenderingContext2D, w: World, x: number) {
  const sy = w.surfaceY - w.scrollY;
  if (sy < -60 || sy > w.h + 20) return;
  const t = w.reduced ? 0 : w.t;
  const bob = Math.sin(t / 700) * 2;
  const tilt = Math.sin(t / 1100) * 0.05;
  const lamp = w.reduced || Math.floor(t / 700) % 2 === 0;

  ctx.strokeStyle = "rgb(255 255 255 / .45)"; // mooring line
  ctx.beginPath();
  ctx.moveTo(x, sy + 6);
  ctx.lineTo(x, sy + 46);
  ctx.stroke();

  ctx.save();
  ctx.translate(x, sy + 6 + bob);
  ctx.rotate(tilt);
  const rows = lamp ? SHADED : SHADED.map((r) => r.replace(/Y/g, "K"));
  drawSprite(ctx, rows, COLORS, -8 * PX, -BUOY.length * PX, PX);
  ctx.restore();
}
