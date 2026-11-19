import type { World } from "../world";
import { drawSprite } from "./pixels";
import { diverSpan, drawSignDiver } from "./signdiver";

type Pal = Record<string, string>;

const PX = 3;
const SAND = 44; // depth of the sand strip; the Contact section leaves room above it so corals never cover its buttons

const grid = (w: number, h: number) => Array.from({ length: h }, () => Array<string>(w).fill("."));
const setter = (g: string[][]) => (c: number, r: number, v: string) => {
  if (r >= 0 && r < g.length && c >= 0 && c < g[0]!.length) g[r]![c] = v;
};
const join = (g: string[][]) => g.map((r) => r.join(""));
/** Small deterministic random generator so every sprite is identical on every load. */
const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// ---- medium corals (about 12-20 cells tall = 36-60px) ----
// C body, c lit tips, D shadow. No violet.

/** Forked branching coral. */
function branching(seed: number): string[] {
  const r = rng(seed);
  const g = grid(24, 22);
  const set = setter(g);
  const branch = (x: number, y: number, ang: number, len: number, depth: number) => {
    for (let i = 0; i < len; i++) {
      x += Math.sin(ang);
      y -= Math.cos(ang);
      const tip = depth > 0 && i > len - 3;
      for (let k = 0; k < (depth === 0 ? 2 : 1); k++) set(Math.round(x) + k, Math.round(y), depth === 0 ? "D" : tip ? "c" : "C");
    }
    if (depth < 2 && len > 3) {
      branch(x, y, ang - 0.5 - r() * 0.35, Math.floor(len * 0.74), depth + 1);
      branch(x, y, ang + 0.5 + r() * 0.35, Math.floor(len * 0.74), depth + 1);
      if (r() > 0.5) branch(x, y, ang + (r() - 0.5) * 0.3, Math.floor(len * 0.6), depth + 1);
    }
  };
  branch(11, 21, 0, 8, 0);
  return join(g);
}

/** Sea whip: a tall curved stem with short twigs. */
function whip(): string[] {
  const g = grid(14, 22);
  const set = setter(g);
  for (let y = 21; y >= 0; y--) {
    const x = Math.round(7 + Math.sin((21 - y) * 0.28) * 2.5);
    set(x, y, y > 14 ? "D" : "C");
    if (y % 4 === 0 && y < 18) for (let k = 1; k <= 2 + (y % 3); k++) set(x + (y % 8 === 0 ? k : -k), y - Math.floor(k / 2), k > 2 ? "c" : "C");
  }
  return join(g);
}

/** Table coral: a ridged plate on a short stem. */
function table(): string[] {
  const g = grid(24, 13);
  const set = setter(g);
  for (let y = 5; y < 13; y++) for (let x = 10; x <= 13; x++) set(x, y, x === 10 ? "C" : "D");
  for (let y = 0; y < 6; y++)
    for (let x = 0; x < 24; x++)
      if (((x - 11.5) / 11.5) ** 2 + ((y - 3) / 2.6) ** 2 <= 1) set(x, y, y === 0 ? "c" : x % 4 === 0 ? "D" : "C");
  return join(g);
}

/** Bubble coral: a cluster of round vesicles. */
function bubbles(): string[] {
  const g = grid(18, 13);
  const set = setter(g);
  [[4, 9, 3.5], [10, 7, 4.2], [15, 9, 3], [7, 3.8, 3.2], [13, 3.4, 3]].forEach(([cx, cy, r]) => {
    for (let y = 0; y < 13; y++)
      for (let x = 0; x < 18; x++) {
        const d = Math.hypot(x - cx!, y - cy!);
        if (d <= r!) set(x, y, d > r! - 1 ? "D" : x < cx! && y < cy! ? "c" : "C");
      }
  });
  return join(g);
}

/** Brain coral: a ridged dome. */
function brain(): string[] {
  const g = grid(22, 12);
  const set = setter(g);
  for (let y = 0; y < 12; y++)
    for (let x = 0; x < 22; x++)
      if (((x - 10.5) / 11) ** 2 + ((y - 11) / 11.5) ** 2 <= 1) set(x, y, (x + Math.round(Math.sin(y * 0.7) * 2.5)) % 3 === 0 ? "D" : y < 3 ? "c" : "C");
  return join(g);
}

/** Tube coral: a cluster of open tubes of different heights. */
function tubes(): string[] {
  const g = grid(16, 17);
  const set = setter(g);
  [[0, 9], [3, 14], [6, 11], [9, 17], [12, 8]].forEach(([x0, h]) => {
    for (let y = 17 - h!; y < 17; y++) for (let x = 0; x < 3; x++) set(x0! + x, y, y === 17 - h! ? "D" : x === 0 ? "c" : "C");
  });
  return join(g);
}

/** Sea anemone: a base with a crown of tentacles that wave (two frames). */
function anemone(f: number): string[] {
  const g = grid(15, 13);
  const set = setter(g);
  for (let y = 10; y < 13; y++) for (let x = 4; x <= 10; x++) set(x, y, "D");
  for (let i = 0; i < 9; i++)
    for (let y = 0; y < 10; y++) {
      const off = Math.round(Math.sin(f * Math.PI + i + y * 0.6) * 1.2 + (i - 4) * (9 - y) * 0.16);
      set(7 + off + (i - 4), y, y < 2 ? "L" : "C");
    }
  return join(g);
}

const STAR = ["...O...", "..OOO..", "OOOOOOO", ".OOOOO.", ".OO.OO.", "OO...OO"];
const SHELL = [".cccc.", "cCcCcC", ".CCCC.", "..CC.."];
const ROCK = ["...GGGG..", "..GGGGGG.", ".GGGGGGGG", "GgGGGGGGg", "GGGGGGGGG"];

type Spr = { frames: string[][]; pal: Pal };
const orange: Pal = { C: "#e0705a", c: "#f4a08a", D: "#a84434" };
const pink: Pal = { C: "#e58a9c", c: "#f6b8c4", D: "#a85468" };
const lime: Pal = { C: "#b4c452", c: "#dfe88a", D: "#7c8a30" };
const KINDS: Record<string, Spr> = {
  branch0: { frames: [branching(11)], pal: orange },
  branch1: { frames: [branching(23)], pal: pink },
  branch2: { frames: [branching(37)], pal: lime },
  whip: { frames: [whip()], pal: { C: "#d8604a", c: "#f08a6a", D: "#8a3a2a" } },
  table: { frames: [table()], pal: { C: "#3fae96", c: "#7fe0c4", D: "#2a7a68" } },
  bubble: { frames: [bubbles()], pal: { C: "#b8dc98", c: "#eaf8cc", D: "#78a458" } },
  brain0: { frames: [brain()], pal: { C: "#d9a441", c: "#f0c868", D: "#a87a22" } },
  brain1: { frames: [brain()], pal: { C: "#d89a7a", c: "#f0c0a4", D: "#a86a4c" } },
  tube0: { frames: [tubes()], pal: { C: "#e8c04a", c: "#f6dc84", D: "#7a5a18" } },
  tube1: { frames: [tubes()], pal: { C: "#e8885a", c: "#f6b08a", D: "#8a4a2a" } },
  anemone: { frames: [anemone(0), anemone(1)], pal: { C: "#3cc6c0", L: "#b8f2ee", D: "#2a7a76" } },
  star: { frames: [STAR], pal: { O: "#e0884a" } },
  shell: { frames: [SHELL], pal: { C: "#f0e0c0", c: "#c9b48e" } },
  rock: { frames: [ROCK], pal: { G: "#6a7a80", g: "#8a9aa0" } },
};

// ---- the wreck: a broken, sunken wooden ship lying bow-up in the sand ----
// P/p planks, S seams, R bare ribs, H holes, G/g algae, B barnacles, M mast and spars, T sail rags
function ship(): string[] {
  const W = 78;
  const H = 50;
  const g = grid(W, H);
  const set = setter(g);
  const r = rng(7);
  const shear = (x: number) => Math.round((58 - x) * 0.14); // stern sits lower, bow rises
  const put = (x: number, y: number, v: string) => set(x + 6, y + 14 + shear(x), v);

  for (let x = 0; x <= 58; x++) {
    const top = Math.round(8 - 5 * (x / 58));
    const bot = Math.round(14 + 12 * Math.sqrt(Math.max(0, 1 - ((x - 29) / 32) ** 2)));
    for (let y = top; y <= bot; y++) {
      const breach = x >= 22 && x <= 40 && y <= top + 7 + Math.round(Math.sin(x * 0.9) * 2);
      if (breach) {
        if (x % 4 === 0 && y > top) put(x, y, "R"); // only the ribs are left
        continue;
      }
      const v = r();
      let c = (y - top) % 3 === 2 ? "S" : Math.floor((y - top) / 3) % 2 ? "P" : "p";
      if (y === top && v > 0.3) c = "G";
      else if (v > 0.96) c = "B";
      else if (y <= top + 2 && v > 0.8) c = "g";
      put(x, y, c);
    }
  }
  [[14, 16], [14, 17], [15, 16], [15, 17], [13, 16], [13, 17], [14, 15], [14, 18]].forEach(([x, y]) => put(x!, y!, "H")); // porthole
  // snapped mast, leaning back, with a jagged top
  for (let y = 4; y >= -11 + (y % 2); y--) for (let k = 0; k < 3; k++) put(46 + k - Math.round((4 - y) * 0.18), y, k === 2 ? "S" : "M");
  for (let x = 36; x <= 53; x++) if (x < 44 || x > 46) put(x, -4 + (x > 46 ? 1 : 0), "M"); // yard arm, broken in the middle
  for (let y = -3; y <= 5; y++) for (let x = 36; x <= 43 - Math.floor((y + 3) / 2); x++) if (r() > 0.15) put(x, y, "T"); // torn sail
  for (let i = 0; i <= 9; i++) put(57 + i, 4 - Math.floor(i * 0.7), "M"); // bowsprit
  for (let y = 4; y >= -4; y--) put(0 + (y < 0 ? 1 : 0), y, "M"); // stern post
  [12, 21, 52].forEach((x0, i) => {
    for (let k = 0; k < 7 + i; k++) put(x0 + Math.round(Math.sin(k * 0.8 + i) * 1.4), 8 - Math.round(5 * (x0 / 58)) - k, k % 2 ? "G" : "g"); // weed on deck
  });
  return join(g);
}
const SHIP = ship();
const SHIP_PAL = {
  P: "#5a4129", p: "#6a4d32", S: "#33241a", R: "#44301f", H: "#071016", G: "#2f6a4a", g: "#4c8f5e",
  B: "#8c9490", M: "#6a4d32", T: "#7b8277",
};

// weighted so a few shapes repeat but never in a row of identical ones
const ORDER = [
  "branch0", "whip", "table", "bubble", "brain0", "tube0", "branch1", "kelp", "anemone", "grass", "branch2", "brain1",
  "whip", "kelp", "tube1", "table", "bubble", "branch0", "star", "grass", "branch1", "shell", "tube0", "rock", "kelp",
];

const seed = (i: number, n: number) => (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1;

/** Where the wreck lies: right of the content column, 4px pixels on wide screens. */
function wreck(width: number) {
  const px = width >= 1400 ? 4 : 3;
  const left = Math.round(width * 0.84 - (78 * px) / 2);
  return { px, left, right: left + 78 * px, show: width >= 900 };
}

type Item = { kind: string; x: number };
let cache: { w: number; items: Item[] } | null = null;
function layout(width: number): Item[] {
  if (cache?.w === width) return cache.items;
  const items: Item[] = [];
  let x = 12;
  for (let i = 0; x < width; i++) {
    const kind = ORDER[Math.floor(seed(i, 1) * ORDER.length)]!;
    const sw = kind === "kelp" || kind === "grass" ? 18 : KINDS[kind]!.frames[0]![0]!.length * PX;
    const ship = wreck(width);
    // keep the wreck clear: only pebbles, shells and stars may sit in front of it
    const [dl, dr] = diverSpan(width);
    const low = ["rock", "shell", "star"].includes(kind);
    const hidesWreck = ship.show && x + sw > ship.left && x < ship.right && !low;
    const hidesDiver = x + sw > dl && x < dr && !low; // the diver stands in a clearing
    if (!hidesWreck && !hidesDiver) items.push({ kind, x });
    x += sw + 6 + seed(i, 2) * 36;
  }
  cache = { w: width, items };
  return items;
}

/** Sand strip at the bottom of the last section: a sunken wreck on the right, medium corals, anemones, kelp and seagrass. */
export function drawSeafloor(ctx: CanvasRenderingContext2D, w: World) {
  const fy = Math.round(w.floorY - w.scrollY);
  if (fy > w.h + 140 || fy < -140) return;
  const sandTop = fy - SAND;
  const t = w.reduced ? 0 : w.t;

  // the wreck sits in the background, on the right, half buried
  const ship = wreck(w.w);
  if (ship.show) {
    ctx.globalAlpha = 0.9;
    drawSprite(ctx, SHIP, SHIP_PAL, ship.left, sandTop + 12 - 44 * ship.px, ship.px);
    ctx.globalAlpha = 1;
  }

  // tall seaweed, behind everything else: slim two-tone fronds that sway more toward the tip
  for (let x = 30, i = 0; x < w.w; x += 110 + seed(i, 5) * 90, i++) {
    const n = 20 + Math.floor(seed(i, 6) * 14); // 100 to 165px tall
    const lean = (seed(i, 7) - 0.5) * 10;
    for (let s = 0; s < n; s++) {
      const k = s / n;
      const sway = w.reduced ? 0 : Math.sin(t / 900 + i * 2 + s * 0.28) * (2 + k * 9);
      const px = Math.round(x + lean * k + sway);
      const y = sandTop + 8 - (s + 1) * 5;
      ctx.fillStyle = k < 0.5 ? "#3f8f58" : "#5fae6a";
      ctx.fillRect(px, y, 4, 6);
      if (s % 4 === 2) ctx.fillRect(px + (i % 2 ? 4 : -4), y + 1, 4, 3); // a leaf
    }
  }

  ctx.fillStyle = "#c98b55";
  ctx.fillRect(0, sandTop, w.w, SAND);
  ctx.fillStyle = "#a76f3f";
  for (let x = 0; x < w.w; x += 24) {
    ctx.fillRect(x + (x % 3) * 4, sandTop + 8, 4, 3);
    ctx.fillRect(x + 10 + (x % 5) * 3, sandTop + 24, 6, 3);
  }

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
  drawSignDiver(ctx, w, sandTop);
}
