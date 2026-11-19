import { drawSprite } from "./entities/pixels";

// The spec's fish (teal body, kelp tail, head left) on a finer grid: 24 x 14 cells at 3px = 72 x 42.
const W = 24;
const H = 14;
const CX = 8.5;
const CY = 6.5;
const RX = 8.5;
const RY = 6.5;

export const FISH_W = W;
export const FISH_H = H;

const COLORS = { H: "#6fdcd6", T: "#3cc6c0", D: "#2a9a95", K: "#7fbf7a", k: "#5a9a57", E: "#071c24", W: "#dcebea" };

function build(tailDy: number): string[] {
  const g: string[][] = Array.from({ length: H }, () => Array<string>(W).fill("."));
  const set = (c: number, r: number, v: string) => {
    if (r >= 0 && r < H && c >= 0 && c < W) g[r]![c] = v;
  };
  // tail: a notched fan that flaps by shifting its centre
  const tc = CY + tailDy;
  for (let c = 16; c < W; c++) {
    const half = 1.5 + (c - 16) * 0.9;
    const notch = c >= 20 ? (c - 19) * 0.8 : 0;
    for (let r = Math.round(tc - half); r <= Math.round(tc + half); r++)
      if (Math.abs(r - tc) >= notch) set(c, r, (r + c) % 4 === 0 ? "k" : "K");
  }
  // body: lighter back, teal middle, darker belly
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      const dx = (c - CX) / RX;
      const dy = (r - CY) / RY;
      if (dx * dx + dy * dy > 1) continue;
      const t = -dy * 0.9 - dx * 0.2;
      set(c, r, t > 0.5 ? "H" : t > -0.35 ? "T" : "D");
    }
  }
  for (let r = 4; r <= 9; r++) set(7, r, "D"); // gill
  set(0, 8, "D"); // mouth
  [[3, 5, "W"], [4, 5, "E"], [3, 6, "E"], [4, 6, "E"]].forEach(([c, r, v]) => set(c as number, r as number, v as string)); // eye
  return g.map((row) => row.join(""));
}

const FRAMES = [build(-1), build(1)];

export function drawFish(ctx: CanvasRenderingContext2D, flap: boolean) {
  drawSprite(ctx, FRAMES[flap ? 0 : 1]!, COLORS, 0, 0, 1);
}
