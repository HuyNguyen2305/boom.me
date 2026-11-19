import type { World } from "../world";
import { drawSprite } from "./pixels";

type Pal = Record<string, string>;
type Kind = "minnow" | "tang" | "lantern" | "shark" | "whale" | "octopus" | "jelly" | "horde";

// ---- sprites (all face left; 3px pixels, drawn at low opacity so the main fish stays the star) ----
// B body, b light, D dark, F tail/fin, E eye, G glow dot
const FISH = ["....DDD.....", "..BBBBBBB.F.", ".BEBBBBBBBFF", ".BBBBBBBBBFF", "..bGbGbGb.F.", "....bbb....."];
const TANG = FISH.map((r) => r.replace(/^(.{5})B/, "$1D")); // one dark stripe
const TINY = ["..BBB.B", "BBBBBBB", "..BBB.B"];

const grid = (w: number, h: number) => Array.from({ length: h }, () => Array<string>(w).fill("."));

/** Shark / whale: a tapered body with a forked tail; two frames so the tail beats. */
function spindle(w: number, h: number, dorsal: boolean, tailDy: number): string[] {
  const bw = w - 6;
  const cy = 4 + h / 2;
  const g = grid(w, h + 8);
  const set = (c: number, r: number, v: string) => {
    if (r >= 0 && r < g.length && c >= 0 && c < w) g[r]![c] = v;
  };
  const half = (c: number) => {
    const t = c / (bw - 1);
    const u = t < 0.38 ? (0.38 - t) / 0.38 : (t - 0.38) / 0.62;
    return (h / 2) * Math.sqrt(Math.max(0, 1 - u * u));
  };
  const tc = cy + tailDy;
  for (let c = bw - 1; c < w; c++) {
    const k = c - (bw - 1);
    const th = (h / 2) * 0.25 + k * (h / 2) * 0.16;
    const notch = k >= 3 ? (k - 2) * 0.9 : 0;
    for (let r = Math.round(tc - th); r <= Math.round(tc + th); r++) if (Math.abs(r - tc) >= notch) set(c, r, "F");
  }
  for (let c = 0; c < bw; c++) {
    const hh = half(c);
    for (let r = Math.round(cy - hh); r <= Math.round(cy + hh); r++) set(c, r, r > cy + hh * 0.3 ? "W" : "G");
  }
  if (dorsal) {
    const c0 = Math.round(bw * 0.4);
    for (let i = 0; i < 5; i++) for (let k = 1; k <= 5 - i; k++) set(c0 + i, Math.round(cy - half(c0 + i)) - k, "D");
  }
  const c1 = Math.round(bw * 0.33);
  for (let i = 0; i < 4; i++) for (let k = 1; k <= 4 - i; k++) set(c1 + i, Math.round(cy + half(c1 + i)) + k, "D");
  set(Math.round(bw * 0.1), Math.round(cy - h * 0.12), "E");
  return g.map((row) => row.join(""));
}

function octopus(f: number): string[] {
  const g = grid(15, 16);
  const set = (c: number, r: number, v: string) => {
    if (r >= 0 && r < 16 && c >= 0 && c < 15) g[r]![c] = v;
  };
  for (let r = 0; r <= 8; r++) for (let c = 0; c < 15; c++) if (((c - 7) / 7) ** 2 + ((r - 6) / 6.5) ** 2 <= 1) set(c, r, r < 3 ? "b" : "B");
  [[4, 5], [5, 5], [9, 5], [10, 5]].forEach(([c, r]) => set(c!, r!, "W"));
  set(5, 5, "E");
  set(9, 5, "E");
  [2, 4, 6, 8, 10, 12].forEach((base, i) => {
    for (let r = 9; r < 16; r++) {
      const o = Math.round(Math.sin(f * Math.PI + i * 0.9 + r * 0.5) * 1.5);
      set(base + o, r, "B");
      set(base + o + 1, r, "D");
    }
  });
  return g.map((row) => row.join(""));
}

function jelly(f: number): string[] {
  const g = grid(11, 14);
  const set = (c: number, r: number, v: string) => {
    if (r >= 0 && r < 14 && c >= 0 && c < 11) g[r]![c] = v;
  };
  const rx = f ? 4.4 : 5;
  for (let r = 0; r <= 6; r++) for (let c = 0; c < 11; c++) if (((c - 5) / rx) ** 2 + ((r - 6) / 6) ** 2 <= 1) set(c, r, r < 2 ? "b" : "B");
  for (let c = 1; c < 10; c += 2) set(c, 7, "D");
  [2, 4, 6, 8].forEach((base, i) => {
    for (let r = 8; r < 14; r++) set(base + Math.round(Math.sin(f * Math.PI + i + r * 0.7)), r, "D");
  });
  return g.map((row) => row.join(""));
}

const SPR: Record<Kind, { frames: string[][]; pal: Pal; alpha: number; from: number; to: number; glow?: boolean }> = {
  minnow: { frames: [FISH], pal: { B: "#3cc6c0", b: "#8fe3df", D: "#2a9a95", F: "#2a9a95", E: "#071c24", G: "#8fe3df" }, alpha: 0.38, from: 0, to: 70 },
  tang: { frames: [TANG], pal: { B: "#e0c25a", b: "#f3e3a0", D: "#b89a35", F: "#b89a35", E: "#071c24", G: "#f3e3a0" }, alpha: 0.38, from: 25, to: 160 },
  lantern: { frames: [FISH], pal: { B: "#2f6f86", b: "#4a97ae", D: "#1f4d5f", F: "#1f4d5f", E: "#b8f2ee", G: "#b8f2ee" }, alpha: 0.5, from: 100, to: 999, glow: true },
  shark: { frames: [spindle(32, 10, true, -1), spindle(32, 10, true, 1)], pal: { G: "#5d7482", W: "#aab9c0", D: "#44606e", F: "#44606e", E: "#0f1720" }, alpha: 0.32, from: 55, to: 999 },
  whale: { frames: [spindle(44, 16, false, -1), spindle(44, 16, false, 1)], pal: { G: "#3f6a8a", W: "#8aa9bf", D: "#2f536e", F: "#2f536e", E: "#0f1720" }, alpha: 0.26, from: 85, to: 999 },
  octopus: { frames: [octopus(0), octopus(1)], pal: { B: "#c0605a", b: "#d98078", D: "#8f3f3a", W: "#f0d6c8", E: "#3a1a18" }, alpha: 0.34, from: 120, to: 999 },
  jelly: { frames: [jelly(0), jelly(1)], pal: { B: "#8fe3df", b: "#dffaf8", D: "#5fb8b2" }, alpha: 0.4, from: 70, to: 999, glow: true },
  horde: { frames: [TINY], pal: { B: "#8fb3b6" }, alpha: 0.32, from: 5, to: 140 },
};

type Creature = { kind: Kind; x: number; y: number; speed: number; dir: 1 | -1; phase: number; members?: [number, number][] };

// deterministic pseudo-random so the sea is identical on every load
const seed = (i: number, n: number) => (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1;

export function createSchool(): Creature[] {
  const plan: [Kind, number, number][] = [
    ["minnow", 5, 0.45], ["tang", 3, 0.4], ["lantern", 4, 0.3], ["jelly", 3, 0.1],
    ["shark", 1, 0.55], ["whale", 1, 0.25], ["octopus", 1, 0.15], ["horde", 2, 0.35],
  ];
  const out: Creature[] = [];
  let i = 0;
  for (const [kind, n, speed] of plan) {
    for (let k = 0; k < n; k++, i++) {
      out.push({
        kind,
        x: seed(i, 1) * 2000,
        y: 0.12 + seed(i, 2) * 0.76,
        speed: speed * (0.7 + seed(i, 3) * 0.6),
        dir: seed(i, 4) > 0.5 ? 1 : -1,
        phase: seed(i, 5) * 6.28,
        // a horde is a loose ball of 16 small fish
        members: kind === "horde" ? Array.from({ length: 16 }, (_, m): [number, number] => [(seed(i + m, 6) - 0.5) * 190, (seed(i + m, 7) - 0.5) * 80]) : undefined,
      });
    }
  }
  return out;
}

const smooth = (depth: number, from: number, to: number) =>
  Math.min(1, Math.max(0, (depth - from) / 25)) * Math.min(1, Math.max(0, (to + 25 - depth) / 25));

/** Background sea life: each kind fades in at its own depth. Underwater only, never above the surface. */
export function drawSchool(ctx: CanvasRenderingContext2D, w: World, school: Creature[]) {
  const top = Math.max(0, w.surfaceY - w.scrollY);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, top, w.w, w.h - top);
  ctx.clip();
  const t = w.reduced ? 0 : w.t;
  for (const c of school) {
    const s = SPR[c.kind];
    const vis = smooth(w.depth, s.from, s.to);
    if (!w.reduced) c.x += c.speed * c.dir;
    if (vis <= 0.01) continue;
    const rows = s.frames[Math.floor(t / (c.kind === "jelly" || c.kind === "octopus" ? 500 : 280)) % s.frames.length]!;
    const sw = Math.max(...rows.map((r) => r.length)) * 3;
    const span = w.w + sw + 160;
    const x = (((c.x % span) + span) % span) - sw - 40;
    const bob = c.kind === "jelly" || c.kind === "octopus" ? Math.sin(t / 900 + c.phase) * 18 : Math.sin(t / 1200 + c.phase) * 4;
    const y = c.y * w.h + bob;
    ctx.globalAlpha = s.alpha * vis;
    if (s.glow) {
      ctx.shadowColor = "#b8f2ee";
      ctx.shadowBlur = 8;
    }
    const spots: [number, number][] = c.members
      ? c.members.map(([dx, dy], m) => [dx + Math.sin(t / 500 + m) * 6, dy + Math.cos(t / 600 + m * 1.7) * 4])
      : [[0, 0]];
    for (const [dx, dy] of spots) {
      ctx.save();
      ctx.translate(x + dx + sw / 2, y + dy);
      ctx.scale(c.dir > 0 ? -1 : 1, 1); // sprites face left
      drawSprite(ctx, rows, s.pal, -sw / 2, 0, 3);
      ctx.restore();
    }
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}
