import type { World } from "../world";
import { drawSprite } from "./pixels";

// A deep-sea diver in a bolted brass helmet standing on the sand, holding a sign that says "Back to the surface".
// The Contact section lays a transparent link over the sign (see Contact.tsx), so the geometry here is shared:
// PX, the sign's cell box and the horizontal centre must stay in step with the classes there.
const PX = 3;
const W = 20;
const H = 42;
const SIGN = { col: 19, rows: 15, w: 34 }; // the board hangs from the pole at col 19, 34 cells wide, 15 rows tall

/** Horizontal centre of the diver's body: 62% across, centred on narrow screens. */
export const diverX = (width: number) => (width < 640 ? width * 0.5 : width * 0.62);
/** Left edge and right edge of the diver and its sign on screen, so the layout can keep corals out of the way. */
export const diverSpan = (width: number) => [diverX(width) - 40, diverX(width) + 40 + (SIGN.w + 1) * PX] as const;

const PAL = {
  B: "#c9953a", b: "#9a6d22", h: "#f0cf7a", d: "#6d4a16", // brass: base, shade, highlight, deep shade
  G: "#1f5b70", g: "#7ccbdc", V: "#0c2733", // porthole glass, glint, dark inside
  N: "#3b556b", n: "#2c4254", p: "#6f8796", q: "#93a8b4", // suit, suit shade, chest plate, plate highlight
  L: "#7b8287", K: "#242a2f", S: "#7a5a3a", W: "#8a6a45", // lead, boot, glove, pole
};

function build(): string[] {
  const g: string[][] = Array.from({ length: H }, () => Array<string>(W).fill("."));
  const set = (c: number, r: number, v: string) => {
    if (r >= 0 && r < H && c >= 0 && c < W) g[r]![c] = v;
  };
  const fill = (c0: number, c1: number, r0: number, r1: number, v: string) => {
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) set(c, r, v);
  };

  fill(19, 19, 2, 41, "W"); // the pole, held up beside the diver

  // legs and weighted boots
  fill(3, 6, 29, 37, "N");
  fill(9, 12, 29, 37, "N");
  fill(6, 6, 29, 37, "n");
  fill(12, 12, 29, 37, "n");
  fill(2, 7, 38, 41, "K");
  fill(9, 14, 38, 41, "K");
  fill(2, 7, 38, 38, "L");
  fill(9, 14, 38, 38, "L");

  // torso, a lead chest plate and a weight belt
  fill(2, 14, 15, 28, "N");
  fill(12, 14, 15, 28, "n");
  fill(5, 11, 16, 22, "p");
  fill(5, 11, 16, 16, "q");
  [[5, 16], [11, 16], [5, 22], [11, 22]].forEach(([c, r]) => set(c!, r!, "h"));
  fill(2, 14, 26, 27, "L");
  set(8, 26, "h");
  set(8, 27, "h");

  // arms: the left hangs, the right is raised to the pole
  fill(0, 1, 16, 27, "N");
  fill(0, 1, 28, 30, "S");
  fill(15, 16, 16, 17, "N");
  fill(17, 18, 15, 16, "N");
  fill(18, 19, 13, 15, "S");

  // the helmet: a brass dome with a bolted collar, one big front porthole and two small side ones
  for (let r = 0; r <= 12; r++) {
    for (let c = 1; c <= 15; c++) {
      const d = Math.hypot(c - 8, r - 6);
      if (d > 6.4) continue;
      const light = (8 - c) * 0.5 + (6 - r) * 0.5; // light from the upper left
      set(c, r, d > 5.4 ? "d" : light > 3.2 ? "h" : light > -1.5 ? "B" : "b");
    }
  }
  for (let r = 0; r <= 12; r++) {
    for (let c = 1; c <= 15; c++) {
      const d = Math.hypot(c - 8, r - 6);
      if (d <= 3.3) set(c, r, d > 2.5 ? "d" : "G");
    }
  }
  fill(6, 7, 4, 5, "g");
  fill(8, 10, 7, 9, "V");
  set(2, 6, "G");
  set(14, 6, "G");
  set(8, 0, "h");
  fill(2, 14, 12, 14, "b");
  fill(2, 14, 12, 12, "B");
  for (let c = 2; c <= 14; c += 2) set(c, 13, "h");
  return g.map((row) => row.join(""));
}

const SPRITE = build();

/** The diver stands with its boots in the sand at `sandTop`; call it after the corals so it is never hidden. */
export function drawSignDiver(ctx: CanvasRenderingContext2D, w: World, sandTop: number) {
  const t = w.reduced ? 0 : w.t;
  const x0 = Math.round(diverX(w.w) - 8 * PX - PX / 2);
  const y0 = Math.round(sandTop + 10 - H * PX);

  // air hose from the helmet's back, swaying up toward the surface
  ctx.fillStyle = "#1f2a33";
  for (let s = 0; s < 14; s++) {
    const sway = w.reduced ? 0 : Math.sin(t / 900 + s * 0.35) * s * 0.6;
    ctx.fillRect(Math.round(x0 + 15 * PX + sway + (s < 4 ? s * PX : 4 * PX)), y0 + 5 * PX - s * PX, PX, PX + 1);
  }

  drawSprite(ctx, SPRITE, PAL, x0, y0, PX);

  // the sign: a pale board on the pole, text in the page's mono face, a small up arrow
  const bx = x0 + SIGN.col * PX;
  const bw = SIGN.w * PX;
  const bh = SIGN.rows * PX;
  ctx.fillStyle = "#5b4529";
  ctx.fillRect(bx, y0, bw, bh);
  ctx.fillStyle = "#e6d5ae";
  ctx.fillRect(bx + PX, y0 + PX, bw - PX * 2, bh - PX * 2);
  ctx.fillStyle = "#d4c096";
  ctx.fillRect(bx + PX, y0 + bh - PX * 2, bw - PX * 2, PX); // a darker lower edge
  ctx.fillStyle = "#2b2113";
  ctx.font = "700 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("BACK TO THE", bx + PX * 3, y0 + 18);
  ctx.fillText("SURFACE", bx + PX * 3, y0 + 34);
  const ax = bx + bw - PX * 7; // arrow: head then stem
  [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]].forEach(([c, r]) => ctx.fillRect(ax + c! * PX, y0 + 22 + r! * PX, PX, PX));

  // bubbles from the helmet valve
  if (!w.reduced) {
    ctx.strokeStyle = "rgb(143 179 182 / 0.7)";
    for (let i = 0; i < 3; i++) {
      const k = ((t / 2600 + i / 3) % 1);
      ctx.strokeRect(Math.round(x0 + 8 * PX + Math.sin(k * 9 + i) * 5), Math.round(y0 - k * 70), 4, 4);
    }
  }
}
