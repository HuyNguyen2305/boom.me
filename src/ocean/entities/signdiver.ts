import type { World } from "../world";
import { drawSprite } from "./pixels";

// A deep-sea diver in a brass helmet standing on the sand, holding a sign that says "Back to the surface".
// The Contact section lays a transparent link over the sign (see Contact.tsx), so the geometry here is shared:
// PX, the sign's cell box and the horizontal centre must stay in step with the classes there.
const PX = 3;
const W = 22;
const H = 56; // 168px tall
const BODY = 10; // column of the body's centre
const SIGN = { col: 21, rows: 15, w: 36 }; // the board hangs from the pole at col 21, 36 cells wide, 15 rows tall

/** Horizontal centre of the diver's body: 62% across, centred on narrow screens. */
const diverX = (width: number) => (width < 640 ? width * 0.5 : width * 0.62);
/** Left and right edge of the diver and its sign on screen, so the layout can keep corals out of the way. */
export const diverSpan = (width: number) => [diverX(width) - 44, diverX(width) + 32 + SIGN.w * PX + 8] as const;

const PAL = {
  B: "#c9953a", b: "#9a6d22", h: "#f0cf7a", d: "#6d4a16", // brass: base, shade, highlight, rim
  G: "#1f5b70", g: "#7ccbdc", V: "#0c2733", // porthole glass, glint, dark inside
  N: "#3b556b", n: "#2c4254", // suit, suit shade
  L: "#7b8287", K: "#242a2f", S: "#7a5a3a", W: "#8a6a45", // weight belt, boot, glove, pole
};

function build(): string[] {
  const g: string[][] = Array.from({ length: H }, () => Array<string>(W).fill("."));
  const set = (c: number, r: number, v: string) => {
    if (r >= 0 && r < H && c >= 0 && c < W) g[r]![c] = v;
  };
  const fill = (c0: number, c1: number, r0: number, r1: number, v: string) => {
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) set(c, r, v);
  };

  fill(21, 21, 2, 55, "W"); // the pole

  // legs and boots
  fill(5, 8, 37, 51, "N");
  fill(12, 15, 37, 51, "N");
  fill(8, 8, 37, 51, "n");
  fill(15, 15, 37, 51, "n");
  fill(3, 9, 52, 55, "K");
  fill(11, 17, 52, 55, "K");
  fill(3, 9, 52, 52, "L");
  fill(11, 17, 52, 52, "L");

  // torso and a plain weight belt
  fill(4, 16, 21, 36, "N");
  fill(13, 16, 21, 36, "n");
  fill(4, 16, 34, 35, "L");
  fill(9, 11, 34, 35, "h");

  // arms: the left hangs, the right reaches up to the pole; both the same thickness, hands the same size
  fill(1, 3, 21, 36, "N");
  fill(1, 1, 21, 36, "n");
  fill(1, 3, 37, 40, "S");
  fill(17, 19, 23, 26, "N");
  fill(19, 22, 18, 22, "S"); // a big glove closed around the pole

  // helmet: a plain brass dome with one round window and a knob on top
  for (let r = 1; r <= 15; r++) {
    for (let c = 3; c <= 17; c++) {
      const d = Math.hypot(c - BODY, r - 8);
      if (d > 7.4) continue;
      const light = (BODY - c) * 0.55 + (8 - r) * 0.55; // light from the upper left
      set(c, r, d > 6.4 ? "d" : light > 4 ? "h" : light > -1.5 ? "B" : "b");
    }
  }
  for (let r = 1; r <= 15; r++) {
    for (let c = 3; c <= 17; c++) {
      const d = Math.hypot(c - BODY, r - 8);
      if (d <= 4.3) set(c, r, d > 3.5 ? "d" : "G");
    }
  }
  fill(7, 8, 5, 6, "g");
  fill(10, 13, 9, 11, "V");
  fill(9, 11, 0, 0, "h");

  // collar
  fill(3, 17, 16, 20, "b");
  fill(3, 17, 16, 16, "B");
  return g.map((row) => row.join(""));
}

const SPRITE = build();

/** The diver stands with its boots in the sand at `sandTop`; call it after the corals so it is never hidden. */
export function drawSignDiver(ctx: CanvasRenderingContext2D, w: World, sandTop: number) {
  const t = w.reduced ? 0 : w.t;
  const x0 = Math.round(diverX(w.w) - BODY * PX - PX / 2);
  const y0 = Math.round(sandTop + 10 - H * PX);

  // air hose from the helmet's left, swaying up toward the surface
  ctx.fillStyle = "#1f2a33";
  for (let s = 0; s < 12; s++) {
    const sway = w.reduced ? 0 : Math.sin(t / 900 + s * 0.35) * s * 0.6;
    ctx.fillRect(Math.round(x0 + 3 * PX + sway - (s < 3 ? s * PX : 3 * PX)), y0 + 5 * PX - s * PX, PX, PX + 1);
  }

  drawSprite(ctx, SPRITE, PAL, x0, y0, PX);

  // the sign: a pale board on the pole, text in a mono face
  const bx = x0 + SIGN.col * PX;
  const bw = SIGN.w * PX;
  const bh = SIGN.rows * PX;
  ctx.fillStyle = "#5b4529";
  ctx.fillRect(bx, y0, bw, bh);
  ctx.fillStyle = "#e6d5ae";
  ctx.fillRect(bx + PX, y0 + PX, bw - PX * 2, bh - PX * 2);
  ctx.fillStyle = "#2b2113";
  ctx.font = "700 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("BACK TO THE", bx + PX * 4, y0 + 19);
  ctx.fillText("SURFACE", bx + PX * 4, y0 + 36);

  // bubbles from the helmet knob
  if (!w.reduced) {
    ctx.strokeStyle = "rgb(143 179 182 / 0.7)";
    for (let i = 0; i < 3; i++) {
      const k = (t / 2600 + i / 3) % 1;
      ctx.strokeRect(Math.round(x0 + BODY * PX + Math.sin(k * 9 + i) * 5), Math.round(y0 - k * 70), 4, 4);
    }
  }
}
