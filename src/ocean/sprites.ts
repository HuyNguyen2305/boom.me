import { drawSprite } from "./entities/pixels";

// Chubby outlined pixel fish, head on the left. Body is an ellipse so shading and outline stay clean.
const W = 36;
const H = 28;
const CX = 14;
const CY = 15;
const RX = 13;
const RY = 10.5;

export const FISH_W = W;
export const FISH_H = H;

const COLORS: Record<string, string> = {
  O: "#0f1720", P: "#0f1720", H: "#a8e8ff", L: "#66d4ff", M: "#4aa3cc", D: "#2b5f95",
  W: "#f0f0ea", G: "#8a9692",
};

function build(tailDy: number): string[] {
  const g: string[][] = Array.from({ length: H }, () => Array<string>(W).fill("."));
  const set = (c: number, r: number, v: string) => {
    if (r >= 0 && r < H && c >= 0 && c < W) g[r]![c] = v;
  };
  const half = (c: number) => {
    const u = (c - CX) / RX;
    return Math.abs(u) > 1 ? null : RY * Math.sqrt(1 - u * u);
  };

  // dorsal fin sweeping back
  for (let c = 15; c <= 25; c++) {
    const h = half(c);
    const bottom = h === null ? 6 : Math.ceil(CY - h) + 1;
    for (let r = Math.round((c - 15) * 0.45); r <= bottom; r++) set(c, r, (c - 15 + r) % 4 === 0 ? "G" : "W");
  }
  // pelvic fin
  for (let c = 13; c <= 20; c++) {
    const h = half(c)!;
    for (let r = Math.floor(CY + h) - 1; r <= H - 1 - Math.round((c - 13) * 0.5); r++) set(c, r, (c + r) % 3 === 0 ? "G" : "W");
  }
  // tail: notched fan that flaps by shifting its centre; dashed grey stripes
  const tc = CY + tailDy;
  for (let c = 27; c < W; c++) {
    const h = 3 + (c - 27) * 1.0;
    const notch = c >= 31 ? (c - 30) * 0.9 : 0;
    for (let r = Math.round(tc - h); r <= Math.round(tc + h); r++)
      if (Math.abs(r - tc) >= notch) set(c, r, c >= 29 && r % 3 === 1 && c % 4 !== 0 ? "G" : "W");
  }
  // body lit from the top left
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      const dx = (c - CX) / RX;
      const dy = (r - CY) / RY;
      if (dx * dx + dy * dy > 1) continue;
      const t = -dx * 0.55 - dy * 0.85;
      set(c, r, t > 0.66 ? "H" : t > 0.3 ? "L" : t > -0.2 ? "M" : "D");
    }
  }
  for (let r = 11; r <= 20; r++) set(12 + Math.round(((r - CY) / 5) ** 2 * 1.5), r, "D"); // gill line
  // outline every empty cell that touches the fish
  const edge: [number, number][] = [];
  for (let r = 0; r < H; r++)
    for (let c = 0; c < W; c++)
      if (g[r]![c] === "." && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dc, dr]) => (g[r + dr!]?.[c + dc!] ?? ".") !== "."))
        edge.push([c, r]);
  edge.forEach(([c, r]) => set(c, r, "O"));
  // smile
  [[2, 18], [3, 19], [4, 19], [5, 19], [6, 18]].forEach(([c, r]) => set(c!, r!, "O"));
  // big eye: 7x7 ring, white inside, cross pupil
  for (let r = 9; r <= 15; r++) for (let c = 5; c <= 11; c++) set(c, r, r === 9 || r === 15 || c === 5 || c === 11 ? "O" : "W");
  [[8, 11], [7, 12], [8, 12], [9, 12], [8, 13]].forEach(([c, r]) => set(c!, r!, "P"));
  return g.map((row) => row.join(""));
}

const FRAMES = [build(-1), build(1)];

export function drawFish(ctx: CanvasRenderingContext2D, flap: boolean) {
  drawSprite(ctx, FRAMES[flap ? 0 : 1]!, COLORS, 0, 0, 1);
}
