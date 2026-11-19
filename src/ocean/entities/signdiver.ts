import type { World } from "../world";
import { drawSprite } from "./pixels";

// A deep-sea diver in a bolted brass helmet standing on the sand, holding a sign that says "Back to the surface".
// The Contact section lays a transparent link over the sign (see Contact.tsx), so the geometry here is shared:
// PX, the sign's cell box and the horizontal centre must stay in step with the classes there.
const PX = 3;
const W = 24;
const H = 64; // 192px tall
const SIGN = { col: 23, rows: 17, w: 36 }; // the board hangs from the pole at col 23, 36 cells wide, 17 rows tall

/** Horizontal centre of the diver's body: 62% across, centred on narrow screens. */
export const diverX = (width: number) => (width < 640 ? width * 0.5 : width * 0.62);
/** Left and right edge of the diver and its sign on screen, so the layout can keep corals out of the way. */
export const diverSpan = (width: number) => [diverX(width) - 48, diverX(width) + 36 + SIGN.w * PX + 8] as const;

const PAL = {
  B: "#c9953a", b: "#9a6d22", h: "#f0cf7a", d: "#6d4a16", // brass: base, shade, highlight, deep shade
  G: "#1f5b70", g: "#7ccbdc", V: "#0c2733", // porthole glass, glint, dark inside
  N: "#3b556b", n: "#2c4254", p: "#6f8796", q: "#93a8b4", // suit, suit shade/folds, plates
  L: "#7b8287", K: "#242a2f", S: "#7a5a3a", W: "#8a6a45", R: "#b9c2c8", // lead, boot, leather/glove, pole, steel
};

function build(): string[] {
  const g: string[][] = Array.from({ length: H }, () => Array<string>(W).fill("."));
  const set = (c: number, r: number, v: string) => {
    if (r >= 0 && r < H && c >= 0 && c < W) g[r]![c] = v;
  };
  const fill = (c0: number, c1: number, r0: number, r1: number, v: string) => {
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) set(c, r, v);
  };

  fill(23, 23, 2, 63, "W"); // the pole, held up beside the diver

  // legs: suit with knee pads and folds, laced weighted boots with brass toe caps
  fill(5, 9, 43, 59, "N");
  fill(13, 17, 43, 59, "N");
  fill(9, 9, 43, 59, "n");
  fill(17, 17, 43, 59, "n");
  fill(5, 9, 50, 51, "p");
  fill(13, 17, 50, 51, "p");
  [46, 47, 55, 56].forEach((r) => { fill(6, 7, r, r, "n"); fill(14, 15, r, r, "n"); });
  fill(3, 10, 60, 63, "K");
  fill(12, 19, 60, 63, "K");
  fill(3, 10, 60, 60, "L");
  fill(12, 19, 60, 60, "L");
  fill(3, 4, 61, 63, "B"); // toe caps point outward
  fill(18, 19, 61, 63, "B");
  fill(3, 4, 61, 61, "h");
  fill(18, 19, 61, 61, "h");
  [6, 8, 14, 16].forEach((c) => set(c, 61, "S")); // laces
  fill(3, 10, 63, 63, "d");
  fill(12, 19, 63, 63, "d");

  // torso: canvas suit with folds, a weight belt of lead blocks, a knife on the hip
  fill(4, 18, 25, 42, "N");
  fill(15, 18, 25, 42, "n");
  [29, 30, 34, 35, 38].forEach((r) => { fill(6, 9, r, r, "n"); fill(11, 13, r, r, "n"); });
  fill(4, 18, 40, 42, "L");
  for (let c = 5; c <= 17; c += 3) fill(c, c + 1, 40, 42, "K");
  fill(10, 12, 40, 42, "h");
  set(11, 41, "b");
  fill(5, 6, 43, 48, "K"); // knife sheath
  fill(5, 6, 42, 42, "S");
  set(5, 43, "R");

  // arms: the left hangs with a brass cuff and a leather glove, the right reaches up to the pole
  fill(1, 3, 25, 42, "N");
  fill(1, 1, 25, 42, "n");
  fill(1, 3, 43, 44, "b");
  fill(1, 3, 45, 49, "S");
  fill(19, 20, 26, 27, "N");
  fill(20, 21, 24, 25, "N");
  fill(21, 22, 22, 23, "N");
  fill(21, 22, 21, 21, "b");
  fill(22, 23, 17, 20, "S");

  // the helmet: a segmented brass dome with a top knob, rivet seams, a grilled front window and two side lights
  for (let r = 1; r <= 17; r++) {
    for (let c = 3; c <= 19; c++) {
      const d = Math.hypot(c - 11, r - 9);
      if (d > 8.4) continue;
      const light = (11 - c) * 0.55 + (9 - r) * 0.55; // light from the upper left
      set(c, r, d > 7.2 ? "d" : light > 4.4 ? "h" : light > -1.8 ? "B" : "b");
    }
  }
  fill(6, 6, 3, 15, "b"); // dome seams
  fill(16, 16, 3, 15, "d");
  for (let r = 4; r <= 14; r += 2) { set(6, r, "h"); set(16, r, "h"); } // rivets
  for (let r = 1; r <= 17; r++) {
    for (let c = 3; c <= 19; c++) {
      const d = Math.hypot(c - 11, r - 9);
      if (d <= 4.7) set(c, r, d > 3.8 ? "d" : "G");
    }
  }
  fill(8, 9, 6, 7, "g"); // glint
  fill(9, 13, 10, 12, "V"); // the dark inside, lower right
  fill(8, 14, 9, 9, "d"); // the guard bars
  fill(11, 11, 6, 12, "d");
  fill(4, 4, 8, 10, "G");
  fill(18, 18, 8, 10, "G");
  fill(10, 12, 0, 0, "h"); // top knob
  fill(10, 12, 1, 1, "B");
  fill(3, 19, 17, 17, "d");

  // corselet: a bolted brass collar with the air hose connector
  fill(3, 19, 18, 24, "b");
  fill(3, 19, 18, 18, "B");
  for (let c = 4; c <= 18; c += 2) set(c, 19, "h");
  fill(14, 17, 21, 23, "d");
  fill(15, 16, 22, 22, "h");
  fill(5, 10, 21, 23, "B");
  fill(5, 10, 21, 21, "h");
  return g.map((row) => row.join(""));
}

const SPRITE = build();

/** The diver stands with its boots in the sand at `sandTop`; call it after the corals so it is never hidden. */
export function drawSignDiver(ctx: CanvasRenderingContext2D, w: World, sandTop: number) {
  const t = w.reduced ? 0 : w.t;
  const x0 = Math.round(diverX(w.w) - 11 * PX - PX / 2);
  const y0 = Math.round(sandTop + 10 - H * PX);

  // air hose from the helmet's back, swaying up toward the surface
  ctx.fillStyle = "#1f2a33";
  for (let s = 0; s < 16; s++) {
    const sway = w.reduced ? 0 : Math.sin(t / 900 + s * 0.35) * s * 0.6;
    ctx.fillRect(Math.round(x0 + 3 * PX + sway - (s < 4 ? s * PX : 4 * PX)), y0 + 5 * PX - s * PX, PX, PX + 1);
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
  ctx.font = "700 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("BACK TO THE", bx + PX * 3, y0 + 21);
  ctx.fillText("SURFACE", bx + PX * 3, y0 + 40);
  const ax = bx + bw - PX * 7; // arrow: head then stem
  [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]].forEach(([c, r]) => ctx.fillRect(ax + c! * PX, y0 + 28 + r! * PX, PX, PX));

  // bubbles from the helmet valve
  if (!w.reduced) {
    ctx.strokeStyle = "rgb(143 179 182 / 0.7)";
    for (let i = 0; i < 3; i++) {
      const k = ((t / 2600 + i / 3) % 1);
      ctx.strokeRect(Math.round(x0 + 11 * PX + Math.sin(k * 9 + i) * 5), Math.round(y0 - k * 70), 4, 4);
    }
  }
}
