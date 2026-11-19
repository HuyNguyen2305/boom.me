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
const HOOK = ["...S.", "...S.", "...S.", "...S.", "S..S.", "SS.S.", ".SSS."];

/** Fisherman in a wooden boat with his speech bubble, and the wave line on the surface. */
export function drawSurface(ctx: CanvasRenderingContext2D, w: World) {
  const sy = w.surfaceY - w.scrollY;
  if (sy < -80 || sy > w.h + 20) return;
  const t = w.reduced ? 0 : w.t;
  const bob = Math.sin(t / 900) * 2;

  const bx = Math.max(24, w.w * 0.16);
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
  ctx.strokeStyle = "rgb(220 235 234 / .6)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(hx + 14 * PX, hy - 9 * PX);
  ctx.lineTo(hx + 14 * PX, sy + 26 + bob);
  ctx.stroke();
  drawSprite(ctx, HOOK, { S: "#c8d4d6" }, hx + 14 * PX - 3 * PX - 1, sy + 26 + bob, PX); // hook on the end of the line

  if (w.w >= 640) {
    ctx.font = "12px ui-monospace, monospace";
    const msg = "Hi! Grab a fish and dive.";
    const tw = ctx.measureText(msg).width + 16;
    const mx = hx + 14 * PX + 16;
    ctx.fillStyle = "#0d2a33";
    ctx.strokeStyle = "rgb(60 198 192 / .5)";
    ctx.fillRect(mx, by - 34, tw, 26);
    ctx.strokeRect(mx, by - 34, tw, 26);
    ctx.fillStyle = "#dcebea";
    ctx.fillText(msg, mx + 8, by - 17);
  }

  // pixel wave line, drawn last so it overlaps the hull: 6px steps snapped to a 3px grid, foam on the crests
  const base = Math.round(sy);
  for (let x = 0; x < w.w; x += 6) {
    const s = Math.sin(x / 40 + t / 500);
    const y = Math.round((base + s * 3) / 3) * 3;
    ctx.fillStyle = "#3cc6c0";
    ctx.fillRect(x, y, 6, 4); // 4 tall on a 3px step so neighbours overlap: no seams
    if (s > 0.55) {
      ctx.fillStyle = "#9fe6e2";
      ctx.fillRect(x, y - 3, 6, 3);
    }
  }
}
