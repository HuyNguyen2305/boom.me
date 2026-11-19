import { drawSprite } from "./entities/pixels";

// Round, outlined pixel fish (head left). Built from an ellipse so the shading and outline stay consistent.
const W = 32;
const H = 24;
const CX = 12.5;
const CY = 11.5;
const RX = 11.5;
const RY = 9.5;

export const FISH_W = W;
export const FISH_H = H;

const COLORS: Record<string, string> = {
  O: "#0f1720", P: "#0f1720", L: "#66d4ff", M: "#4aa3cc", D: "#2b5f95", W: "#e8e8e2", G: "#7d8a86",
};

function build(tailDy: number): string[] {
  const g: string[][] = Array.from({ length: H }, () => Array<string>(W).fill("."));
  const set = (c: number, r: number, v: string) => {
    if (r >= 0 && r < H && c >= 0 && c < W) g[r]![c] = v;
  };
  const span = (c: number) => {
    const u = (c - CX) / RX;
    return Math.abs(u) > 1 ? null : RY * Math.sqrt(1 - u * u);
  };

  // dorsal fin, leaning back
  for (let c = 15; c <= 22; c++) {
    const s = span(c);
    const bottom = s === null ? 4 : Math.ceil(CY - s) + 1;
    for (let r = Math.round((c - 15) * 0.55); r <= bottom; r++) set(c, r, "W");
  }
  // pelvic fin
  for (let c = 12; c <= 18; c++) {
    const s = span(c)!;
    for (let r = Math.floor(CY + s) - 1; r <= H - 1 - Math.round((c - 12) * 0.6); r++) set(c, r, "W");
  }
  // tail: a notched fan that flaps by shifting its centre
  const tc = CY + tailDy;
  for (let c = 24; c < W; c++) {
    const h = 3 + (c - 24) * 1.3;
    const notch = c >= 28 ? (c - 27) * 0.7 : 0;
    for (let r = Math.round(tc - h); r <= Math.round(tc + h); r++) if (Math.abs(r - tc) >= notch) set(c, r, "W");
  }
  // fin stripes
  for (let r = 0; r < H; r++) for (let c = 14; c < W; c++) if (g[r]![c] === "W" && (r + c * 2) % 5 === 0 && (c >= 24 || r < 6 || r > 19)) g[r]![c] = "G";
  // body, lit from the top left
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      const dx = (c - CX) / RX;
      const dy = (r - CY) / RY;
      if (dx * dx + dy * dy > 1) continue;
      const t = -dx * 0.55 - dy * 0.85;
      set(c, r, t > 0.3 ? "L" : t > -0.2 ? "M" : "D");
    }
  }
  for (let r = 8; r <= 15; r++) set(10 + Math.round(((r - CY) / 4) ** 2 * 1.2), r, "D"); // gill
  set(2, 13, "D");
  set(3, 13, "D");
  // outline every empty cell that touches the fish
  const edge: [number, number][] = [];
  for (let r = 0; r < H; r++)
    for (let c = 0; c < W; c++)
      if (g[r]![c] === "." && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dc, dr]) => (g[r + dr!]?.[c + dc!] ?? ".") !== "."))
        edge.push([c, r]);
  edge.forEach(([c, r]) => set(c, r, "O"));
  // eye: 5x5 ring, white inside, cross pupil
  for (let r = 6; r <= 10; r++) for (let c = 4; c <= 8; c++) set(c, r, r === 6 || r === 10 || c === 4 || c === 8 ? "O" : "W");
  [[6, 7], [5, 8], [6, 8], [7, 8], [6, 9]].forEach(([c, r]) => set(c!, r!, "P"));
  return g.map((row) => row.join(""));
}

const FRAMES = [build(-1), build(1)];

export function drawFish(ctx: CanvasRenderingContext2D, flap: boolean) {
  drawSprite(ctx, FRAMES[flap ? 0 : 1]!, COLORS, 0, 0, 1);
}
