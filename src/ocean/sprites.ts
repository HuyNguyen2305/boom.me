import { drawSprite } from "./entities/pixels";

// The main fish: a blue-grey tuna with yellow fins, a small eye and a crescent tail, at 2px pixels (40 x 25 cells).
// The body is shaded top to bottom through a blue-grey ramp. The rear half bends as a travelling wave, so the whole
// tail sweeps smoothly: 8 frames of one full stroke.
const W = 40;
const H = 25;
const CY = 12;
const FRAMES_N = 8;

export const FISH_W = W;
export const FISH_H = H;

// a: back ... f: belly; Y/y/z: yellow fin tones; E: eye
const COLORS = {
  a: "#34495f", b: "#44607a", c: "#587b97", d: "#7699b0", e: "#a3bccb", f: "#d3e0e8",
  Y: "#f0c43c", y: "#d9a72b", z: "#f6dd7a", E: "#0a1822", m: "#2a3d50",
};

function build(phase: number): string[] {
  const g: string[][] = Array.from({ length: H }, () => Array<string>(W).fill("."));
  const bend = (c: number) => (c <= 14 ? 0 : 4.2 * Math.sin(phase) * ((c - 14) / 25) ** 2);
  const set = (c: number, r: number, v: string) => {
    const rr = Math.round(r + bend(c));
    if (rr >= 0 && rr < H && c >= 0 && c < W) g[rr]![c] = v;
  };
  // body half-thickness by column: a pointed snout, fullest at c 12, then a long taper to a slim tail stalk
  const half = (c: number) => {
    if (c < 0 || c > 31) return 0;
    if (c <= 12) return 6.6 * Math.sin((Math.PI / 2) * Math.min(1, (c + 0.6) / 13)) ** 0.85;
    return 1.2 + (6.6 - 1.2) * (1 - (c - 12) / 19) ** 1.3;
  };
  const topOf = (c: number) => CY - half(c);
  const botOf = (c: number) => CY + half(c);

  // crescent tail: a solid fan with a notch, darker at the leading edge and paler at the tips
  for (let k = 0; k < 10; k++) {
    const spread = 0.6 + k * 0.55;
    const th = 2;
    for (let d = 0; d <= Math.ceil(spread + th); d++) {
      if (k >= 4 && d < spread - th) continue;
      if (d > spread + th) continue;
      const v = k < 4 ? "y" : k > 6 ? "z" : "Y";
      set(30 + k, CY + d, v);
      if (d) set(30 + k, CY - d, v);
    }
  }
  // dorsal fins, finlets, pectoral and anal fins: yellow, swept back
  [1, 3, 4, 4, 3, 3, 2, 1].forEach((h, i) => {
    const c = 10 + i;
    const t = Math.round(topOf(c));
    for (let r = t - h; r <= t; r++) set(c, r, r === t - h ? "z" : "Y");
  });
  [1, 2, 2, 1].forEach((h, i) => {
    const c = 20 + i;
    const t = Math.round(topOf(c));
    for (let r = t - h; r <= t; r++) set(c, r, "Y");
  });
  [1, 2, 2, 1].forEach((h, i) => {
    const c = 21 + i;
    const b = Math.round(botOf(c));
    for (let r = b; r <= b + h; r++) set(c, r, "Y");
  });
  for (let i = 0; i < 6; i++) {
    const c = 24 + i;
    if (i % 2 === 0) set(c, Math.round(topOf(c)) - 1, "y");
    else set(c, Math.round(botOf(c)) + 1, "y");
  }
  for (let i = 0; i < 5; i++) for (let r = 0; r <= 3 - Math.floor(i / 2); r++) set(10 + i, CY + 3 + r + Math.floor(i / 2), i === 0 ? "y" : "Y"); // pectoral

  // body: vertical blue-grey gradient (dark back, silver belly), gently lighter toward the head
  for (let c = 0; c < 32; c++) {
    const h = half(c);
    const t0 = CY - h;
    const hh = h * 2;
    for (let r = Math.ceil(t0); r <= Math.floor(CY + h); r++) {
      const rel = (r - t0) / hh;
      const i = Math.max(0, Math.min(5, Math.floor(rel * 6.4 - 0.2 + (c < 8 ? 0.3 : 0))));
      set(c, r, "abcdef"[i]!);
    }
  }
  // mouth line and a small eye
  set(0, CY + 1, "m");
  set(1, CY + 1, "m");
  for (let r = CY - 3; r <= CY - 2; r++) for (let c = 4; c <= 5; c++) set(c, r, "E");
  return g.map((row) => row.join(""));
}

const FRAMES = Array.from({ length: FRAMES_N }, (_, i) => build((i / FRAMES_N) * Math.PI * 2));

export function drawFish(ctx: CanvasRenderingContext2D, t: number, fast: boolean) {
  drawSprite(ctx, FRAMES[Math.floor(t / (fast ? 70 : 120)) % FRAMES_N]!, COLORS, 0, 0, 1);
}
