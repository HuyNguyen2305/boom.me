import type { World } from "../world";
import { drawSprite } from "./pixels";

// h straw hat, n hat band, H brim shadow, S skin, E eye, b beard, G/g shirt, S hand, l/W/D/d wooden hull
const BOAT = [
  "..............hhhhhh",
  ".............hhhhhhhh",
  ".............nnnnnnnn",
  ".........hhhhhhhhhhhhhhhh",
  "..........HHHHHHHHHHHH",
  "..............SSSSSS",
  "..............SESSES",
  "..............SSSSSS",
  "..............bbbbbb",
  "..............bbbbbb",
  "............GGGGGGGGGG",
  "............GGGGGGGGGGSS",
  "............GGgGGGGGGGSS",
  "............GGGGGGGGGG",
  "llllllllllllllllllllllllllllllllllll",
  "WWDWWDWWDWWDWWDWWDWWDWWDWWDWWDWWDWWD",
  ".WWDWWDWWDWWDWWDWWDWWDWWDWWDWWDWWDW",
  "..DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
];
const COLORS = {
  h: "#e0b050", n: "#8a5a33", H: "#b88a35", S: "#e8c9a0", E: "#071c24", b: "#dcebea",
  G: "#7fbf7a", g: "#5a9a57", l: "#b07a45", W: "#8a5a33", D: "#6e4526", d: "#4e3019",
};
const PX = 3;
export const WIDE = 900;

/** Fisherman in a wooden boat on the water line, plus the wave line itself. */
export function drawBoat(ctx: CanvasRenderingContext2D, w: World) {
  const sy = w.surfaceY - w.scrollY;
  if (sy < -80 || sy > w.h + 20) return;
  const t = w.reduced ? 0 : w.t;
  const bob = Math.sin(t / 900) * 2;

  if (w.w >= WIDE) {
    // narrower screens give the whole sky to the shore and billboard
    const bx = Math.max(w.w / 2 - 18 * PX, w.shoreRight + 30);
    const by = sy - 17 * PX + bob + 4; // hull sits low in the water
    drawSprite(ctx, BOAT, COLORS, bx, by, PX);

    // rod from the hand, line dropping into the water
    const hx = bx + 24 * PX;
    const hy = by + 11.5 * PX;
    ctx.strokeStyle = "#6e4526";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + 14 * PX, hy - 9 * PX);
    ctx.stroke();
    ctx.strokeStyle = "rgb(255 255 255 / .7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hx + 14 * PX, hy - 9 * PX);
    ctx.lineTo(hx + 14 * PX, sy + 70 + bob);
    ctx.stroke();
  }

  // wave line, drawn last so it overlaps the hull and island
  ctx.strokeStyle = "#9fe6e2";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= w.w; x += 6) {
    const y = sy + Math.sin(x / 40 + t / 500) * 2;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.lineWidth = 1;
}
