import { drawSprite } from "./entities/pixels";

// The main fish (teal body, kelp tail, head left) at 2px pixels: 36 x 21 cells = 72 x 42.
// Smooth shading only: three clean tones and a soft highlight band, no scale marks, no stipple, no white in the eye.
const W = 36;
const H = 21;
const CX = 13;
const CY = 10;
const RX = 13;
const RY = 9.5;

export const FISH_W = W;
export const FISH_H = H;

const COLORS = { D: "#2a9a95", T: "#3cc6c0", H: "#5fdcd5", L: "#8fe3df", K: "#7fbf7a", k: "#68a864", E: "#06222a" };

function build(tailDy: number): string[] {
  const g: string[][] = Array.from({ length: H }, () => Array<string>(W).fill("."));
  const set = (c: number, r: number, v: string) => {
    if (r >= 0 && r < H && c >= 0 && c < W) g[r]![c] = v;
  };
  const top = (c: number) => {
    const u = (c - CX) / RX;
    return Math.abs(u) > 1 ? null : CY - RY * Math.sqrt(1 - u * u);
  };

  // tail: a notched fan; it flaps by shifting its centre. Solid kelp with a slightly darker trailing edge
  const tc = CY + tailDy;
  for (let c = 24; c < W; c++) {
    const k = c - 24;
    const half = 2.2 + k * 0.7;
    const notch = k >= 6 ? (k - 5) * 0.75 : 0;
    for (let r = Math.round(tc - half); r <= Math.round(tc + half); r++) if (Math.abs(r - tc) >= notch) set(c, r, c >= W - 2 ? "k" : "K");
  }
  // dorsal, pectoral and anal fins: solid
  [0, 1, 2, 3, 4, 4, 4, 3, 3, 2, 1].forEach((h, i) => {
    const c = 10 + i;
    const t = top(c);
    if (t === null) return;
    for (let r = Math.round(t) - h; r <= Math.round(t); r++) set(c, r, "K");
  });
  for (let i = 0; i < 5; i++) for (let r = CY + 2; r <= CY + 2 + (4 - i); r++) set(12 + i, r, i === 0 ? "k" : "K");
  [1, 2, 2, 1].forEach((h, i) => {
    const t = top(18 + i);
    if (t === null) return;
    const bottom = Math.round(2 * CY - t);
    for (let r = bottom; r <= bottom + h; r++) set(18 + i, r, "K");
  });
  // body: dark back, teal flank, light belly, with one soft highlight band along the upper flank
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      const dx = (c - CX) / RX;
      const dy = (r - CY) / RY;
      if (dx * dx + dy * dy > 1) continue;
      let v = dy < -0.5 ? "D" : dy > 0.45 ? "L" : "T";
      if (v === "T" && dy < -0.28 && dx > -0.55 && dx < 0.6) v = "H";
      set(c, r, v);
    }
  }
  [[1, 12], [2, 12], [3, 13]].forEach(([c, r]) => set(c!, r!, "D")); // mouth
  // eye: a plain dark disc (no white)
  for (let r = 7; r <= 10; r++) for (let c = 3; c <= 6; c++) if (!((r === 7 || r === 10) && (c === 3 || c === 6))) set(c, r, "E");
  return g.map((row) => row.join(""));
}

const FRAMES = [build(-1), build(1)];

export function drawFish(ctx: CanvasRenderingContext2D, flap: boolean) {
  drawSprite(ctx, FRAMES[flap ? 0 : 1]!, COLORS, 0, 0, 1);
}
