import type { World } from "../world";
import { drawSprite } from "./pixels";

type Pal = Record<string, string>;
const PX = 3;

const grid = (w: number, h: number) => Array.from({ length: h }, () => Array<string>(w).fill("."));
const setter = (g: string[][]) => (c: number, r: number, v: string) => {
  if (r >= 0 && r < g.length && c >= 0 && c < g[0]!.length) g[r]![c] = v;
};
const join = (g: string[][]) => g.map((r) => r.join(""));

// ---- bottom life: every sprite stands on the sand; no violet anywhere ----
// staghorn coral: branching, lit on the left
const STAG = [
  "..C...C..C....",
  "..C...C..C.C..",
  ".CC..CC..CCC..",
  ".CC..CC..CC...",
  "..CC.CC.CCC...",
  "..CCCCCCCCC...",
  "...CCCCCCC....",
  "....CCCCC.....",
  "....CCCCC.....",
  "...DCCCCCD....",
].map((r) => r.replace("C", "c"));

/** Brain coral: a ridged dome. */
function brain(): string[] {
  const g = grid(16, 8);
  const set = setter(g);
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 16; c++)
      if (((c - 7.5) / 8) ** 2 + ((r - 7) / 7.5) ** 2 <= 1) set(c, r, (c + Math.round(Math.sin(r * 0.8) * 2)) % 3 === 0 ? "D" : r < 2 ? "c" : "C");
  return join(g);
}

/** Sea fan: a mesh fan on a short stem. */
function fan(): string[] {
  const g = grid(15, 16);
  const set = setter(g);
  for (let r = 0; r < 13; r++) for (let c = 0; c < 15; c++) if (Math.abs(c - 7) <= 1 + r * 0.5 && (c + r) % 2 === 0) set(c, r, Math.abs(c - 7) >= r * 0.5 ? "c" : "C");
  for (let r = 13; r < 16; r++) set(7, r, "D");
  return join(g);
}

/** Tube sponge: three open tubes of different heights. */
function tubes(): string[] {
  const g = grid(11, 12);
  const set = setter(g);
  [[0, 8], [4, 12], [8, 6]].forEach(([x0, h]) => {
    for (let r = 12 - h!; r < 12; r++) for (let c = 0; c < 3; c++) set(x0! + c, r, r === 12 - h! ? "D" : c === 0 ? "c" : "C");
  });
  return join(g);
}

/** Sea anemone: a base with a crown of tentacles that wave (two frames). */
function anemone(f: number): string[] {
  const g = grid(13, 11);
  const set = setter(g);
  for (let r = 8; r < 11; r++) for (let c = 3; c <= 9; c++) set(c, r, "D");
  for (let i = 0; i < 7; i++) {
    for (let r = 0; r < 8; r++) {
      const off = Math.round(Math.sin(f * Math.PI + i + r * 0.6) * 1.2 + (i - 3) * (7 - r) * 0.18);
      set(6 + off + (i - 3), r, r < 2 ? "L" : "C");
    }
  }
  return join(g);
}

const STAR = ["...O...", "..OOO..", "OOOOOOO", ".OOOOO.", ".OO.OO.", "OO...OO"];
const SHELL = [".cccc.", "cCcCcC", ".CCCC.", "..CC.."];
const ROCK = ["...GGGG..", "..GGGGGG.", ".GGGGGGGG", "GgGGGGGGg", "GGGGGGGGG"];

type Spr = { frames: string[][]; pal: Pal };
const KINDS: Record<string, Spr> = {
  stag: { frames: [STAG], pal: { C: "#e0705a", c: "#f2967f", D: "#a84434" } },
  brain: { frames: [brain()], pal: { C: "#d9a441", c: "#f0c868", D: "#a87a22" } },
  fan: { frames: [fan()], pal: { C: "#d8504a", c: "#f08070", D: "#8a2e2a" } },
  tube: { frames: [tubes()], pal: { C: "#e8c04a", c: "#f6dc84", D: "#7a5a18" } },
  anemone: { frames: [anemone(0), anemone(1)], pal: { C: "#3cc6c0", L: "#b8f2ee", D: "#2a7a76" } },
  star: { frames: [STAR], pal: { O: "#e0884a" } },
  shell: { frames: [SHELL], pal: { C: "#f0e0c0", c: "#c9b48e" } },
  rock: { frames: [ROCK], pal: { G: "#6a7a80", g: "#8a9aa0" } },
};
// weighted so staghorn and fans are common and the odd shell, star or rock breaks them up
const ORDER = ["stag", "kelp", "fan", "brain", "grass", "anemone", "tube", "stag", "kelp", "star", "grass", "fan", "shell", "rock", "brain", "kelp"];

const seed = (i: number, n: number) => (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1;

type Item = { kind: string; x: number };
let cache: { w: number; items: Item[] } | null = null;
function layout(width: number): Item[] {
  if (cache?.w === width) return cache.items;
  const items: Item[] = [];
  let x = 12;
  for (let i = 0; x < width; i++) {
    const kind = ORDER[Math.floor(seed(i, 1) * ORDER.length)]!;
    items.push({ kind, x });
    const sw = kind === "kelp" || kind === "grass" ? 16 : (KINDS[kind]!.frames[0]![0]!.length) * PX;
    x += sw + 10 + seed(i, 2) * 50;
  }
  cache = { w: width, items };
  return items;
}

/** Sand strip at the bottom of the last section with kelp, seagrass, corals, anemones and shells. */
export function drawSeafloor(ctx: CanvasRenderingContext2D, w: World) {
  const fy = Math.round(w.floorY - w.scrollY);
  if (fy > w.h + 80 || fy < -80) return;
  const sandTop = fy - 24;
  ctx.fillStyle = "#c98b55";
  ctx.fillRect(0, sandTop, w.w, 24);
  ctx.fillStyle = "#a76f3f";
  for (let x = 0; x < w.w; x += 24) ctx.fillRect(x + (x % 3) * 4, fy - 20, 4, 3);

  const t = w.reduced ? 0 : w.t;
  const ground = sandTop + 4; // sprites sink a little into the sand
  for (const [i, it] of layout(w.w).entries()) {
    if (it.kind === "kelp" || it.kind === "grass") {
      const n = it.kind === "kelp" ? 10 : 6;
      ctx.fillStyle = it.kind === "kelp" ? "#7fbf7a" : "#5aa05a";
      for (const lean of it.kind === "kelp" ? [0] : [-6, 0, 6]) {
        for (let s = 0; s < n; s++) {
          const sway = w.reduced ? 0 : Math.sin(t / 700 + it.x + s * 0.6) * s * 0.7;
          ctx.fillRect(Math.round(it.x + lean + sway), ground - (s + 1) * 5, 4, 6); // 6 tall on a 5 step: no seams
        }
      }
      continue;
    }
    const spr = KINDS[it.kind]!;
    const rows = spr.frames[Math.floor(t / 600 + i) % spr.frames.length]!;
    drawSprite(ctx, rows, spr.pal, it.x, ground - rows.length * PX, PX);
  }
}
