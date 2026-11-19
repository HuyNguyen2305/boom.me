import type { World } from "../world";
import { drawSprite } from "./pixels";

// Flat-shaded palms: light edge on every frond, serrated leaflets below, ringed trunk, coconuts.
const COLORS = {
  l: "#8fe88f", g: "#46a14e", d: "#2f7a3a", T: "#b07a2a", B: "#8f6320", S: "#6e4a18", N: "#5e3f15",
  C: "#4a2f12", c: "#7a5028",
};
const W = 60;
const H = 56;
const BASE = 30; // trunk base column
const CROWN = 28; // crown row

function build(lean: number): string[] {
  const g: string[][] = Array.from({ length: H }, () => Array<string>(W).fill("."));
  const set = (c: number, r: number, v: string) => {
    if (r >= 0 && r < H && c >= 0 && c < W) g[r]![c] = v;
  };
  const trunkX = (r: number) => BASE + Math.round((Math.sin(((H - 1 - r) / (H - 1 - CROWN)) * 1.3) / Math.sin(1.3)) * lean);

  for (let r = H - 1; r >= CROWN; r--) {
    const t = (H - 1 - r) / (H - 1 - CROWN);
    const w = Math.round(7 - t * 3) + Math.max(0, r - (H - 4)); // last rows flare into roots
    const x0 = trunkX(r) - Math.floor(w / 2);
    for (let i = 0; i < w; i++) {
      const ring = r % 4 === 0;
      set(x0 + i, r, i === 0 ? "T" : i >= w - 2 ? "S" : ring ? "N" : "B");
    }
  }
  const cx = trunkX(CROWN);

  // fronds: [dx, dy, length, droop]
  const fronds = [
    [-1, 0.15, 21, 1.4], [-0.9, -0.35, 20, 1.1], [-0.55, -0.75, 17, 0.8], [-0.15, -0.95, 13, 0.45],
    [0.15, -0.95, 13, 0.45], [0.55, -0.75, 17, 0.8], [0.9, -0.35, 20, 1.1], [1, 0.15, 21, 1.4],
  ];
  for (const [vx, vy, len, droop] of fronds) {
    for (let k = 0; k <= len!; k++) {
      const x = Math.round(cx + vx! * k);
      const y = Math.round(CROWN + vy! * k * 0.9 + (droop! * k * k * 0.26) / len!);
      const th = Math.max(2, Math.round(5 * (1 - k / len!)));
      for (let j = 0; j < th; j++) set(x, y + j, j === 0 ? "l" : j === th - 1 ? "d" : "g");
      // drooping leaflets give the frond its serrated lower edge
      if (k > 2 && k % 2 === 0) {
        const tooth = Math.max(1, Math.round(3.5 * (1 - k / len!)));
        for (let j = 0; j < tooth; j++) set(x, y + th + j, j === tooth - 1 ? "d" : "g");
      }
    }
  }
  // coconut cluster under the crown
  [[-3, 1], [0, 2], [3, 1], [-1, 4]].forEach(([dx, dy]) => {
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) set(cx + dx! + a, CROWN + dy! + b, a === 0 && b === 0 ? "c" : "C");
  });
  // grass tufts at the base
  [-6, -4, 5, 7].forEach((dx) => {
    set(BASE + dx, H - 1, "g");
    set(BASE + dx, H - 2, "l");
  });
  return g.map((row) => row.join(""));
}

const TREES = { right: build(9), left: build(-8) };

/** A palm whose trunk base sits at x on the shore top. */
function drawPalm(ctx: CanvasRenderingContext2D, rows: string[], x: number, ground: number, px: number) {
  drawSprite(ctx, rows, COLORS, x - BASE * px, ground - H * px + px, px);
}

/** Palms on the shore, beside the billboard (the shore itself is DOM: see Hero). */
export function drawShore(ctx: CanvasRenderingContext2D, w: World) {
  const ground = w.surfaceY - w.scrollY - 44; // top of the shore, over the grass
  if (ground < -320 || ground > w.h + 20 || w.w < 640) return;
  const bl = w.billboardLeft;
  const br = w.billboardRight;
  // one big palm right of the billboard, two more on the shore to its left when there is room
  const trees: [string[], number, number][] = [
    [TREES.right, br + 118, 5],
    [TREES.left, bl - 100, 4],
    [TREES.right, bl - 230, 3],
  ];
  for (const [rows, x, px] of trees) if (x - 22 * px >= -10) drawPalm(ctx, rows, x, ground, px);
}
