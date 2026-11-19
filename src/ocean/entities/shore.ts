import type { World } from "../world";
import { drawSprite } from "./pixels";

// Flat-shaded palms: light edge on each frond, dark underside, notched trunk.
const COLORS = { l: "#7fdc7f", g: "#46a14e", d: "#2f7a3a", B: "#8f6320", N: "#5e3f15", C: "#4a2f12" };
const W = 52;
const H = 50;
const BASE = 24; // trunk base column

function build(lean: number): string[] {
  const g: string[][] = Array.from({ length: H }, () => Array<string>(W).fill("."));
  const set = (c: number, r: number, v: string) => {
    if (r >= 0 && r < H && c >= 0 && c < W) g[r]![c] = v;
  };
  const crownRow = 22;
  const trunkX = (r: number) => BASE + Math.round((Math.sin(((H - 1 - r) / (H - 1 - crownRow)) * 1.3) / Math.sin(1.3)) * lean);
  for (let r = H - 1; r >= crownRow; r--) {
    const t = (H - 1 - r) / (H - 1 - crownRow);
    const w = Math.round(5 - t * 2);
    const x = trunkX(r);
    for (let i = 0; i < w; i++) set(x - Math.floor(w / 2) + i, r, r % 5 === 0 && i < 2 ? "N" : "B");
  }
  const cx = trunkX(crownRow);
  // fronds: [dx, dy, length, droop]
  const fronds = [[-1, 0.1, 16, 1.1], [-0.85, -0.45, 15, 0.9], [-0.35, -0.85, 12, 0.6], [0.35, -0.85, 12, 0.6], [0.85, -0.45, 15, 0.9], [1, 0.1, 16, 1.1]];
  for (const [vx, vy, len, droop] of fronds) {
    for (let k = 0; k <= len!; k++) {
      const x = Math.round(cx + vx! * k);
      const y = Math.round(crownRow + vy! * k * 0.9 + (droop! * k * k * 0.28) / len!);
      const th = Math.max(1, Math.round(4.2 * (1 - k / len!)));
      for (let j = 0; j < th; j++) set(x, y + j, j === 0 ? "l" : j === th - 1 && th >= 3 ? "d" : "g");
    }
  }
  [[-2, 23], [-1, 23], [1, 24], [2, 24], [0, 25]].forEach(([dx, dy]) => set(cx + dx!, dy!, "C")); // coconuts
  return g.map((row) => row.join(""));
}

const TREES = { right: build(7), left: build(-6) };

/** A palm whose trunk base sits at x on the shore top. */
function drawPalm(ctx: CanvasRenderingContext2D, rows: string[], x: number, ground: number, px: number) {
  drawSprite(ctx, rows, COLORS, x - BASE * px, ground - H * px + px, px);
}

/** Palms on the shore, beside the billboard (the shore itself is DOM: see Hero). */
export function drawShore(ctx: CanvasRenderingContext2D, w: World) {
  const ground = w.surfaceY - w.scrollY - 44; // top of the shore, over the grass
  if (ground < -160 || ground > w.h + 20 || w.w < 640) return;
  const trees: [string[], number, number][] = [
    [TREES.right, w.shoreEnd - 18, 3],
    [TREES.left, w.shoreEnd - 78, 2],
    [TREES.right, w.shoreEnd - 118, 2],
  ];
  for (const [rows, x, px] of trees) if (x - 18 * px > w.billboardRight) drawPalm(ctx, rows, x, ground, px);
}
