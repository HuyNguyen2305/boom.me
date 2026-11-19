import type { World } from "../world";
import { drawSprite } from "./pixels";

type Pal = Record<string, string>;
type Kind = "minnow" | "tang" | "lantern" | "shark" | "whale" | "octopus" | "jelly" | "horde" | "diver";
export type Band = { top: number; bottom: number; depth: number };

// ---- sprites (all face left; 3px pixels) ----
// B body, b light, D dark, F tail/fin, E eye, G glow dot
const FISH = ["....DDD.....", "..BBBBBBB.F.", ".BEBBBBBBBFF", ".BBBBBBBBBFF", "..bGbGbGb.F.", "....bbb....."];
const TANG = FISH.map((r) => r.replace(/^(.{5})B/, "$1D")); // one dark stripe
const TINY = ["..BBB.B", "BBBBBBB", "..BBB.B"];

const grid = (w: number, h: number) => Array.from({ length: h }, () => Array<string>(w).fill("."));
const setter = (g: string[][]) => (c: number, r: number, v: string) => {
  if (r >= 0 && r < g.length && c >= 0 && c < g[0]!.length) g[r]![c] = v;
};

/** Shark at 2px (76 x 40 cells): slim, with gill slits, lateral line, eye, five fins and a heterocercal tail. */
function shark(tailDy: number): string[] {
  const W = 76;
  const H = 40;
  const bw = 60;
  const cy = 20;
  const g = grid(W, H);
  const set = setter(g);
  const half = (c: number) => {
    const t = c / (bw - 1);
    const u = t < 0.34 ? (0.34 - t) / 0.34 : (t - 0.34) / 0.66;
    return Math.max(c > bw * 0.6 ? 1.2 : 0, 6.4 * Math.pow(Math.max(0, 1 - u * u), 0.7));
  };
  // tail first so the body overlaps its root: upper lobe longer, lighter trailing edge
  const tc = cy + tailDy;
  for (let k = 0; k < W - bw + 3; k++) {
    const c = bw - 3 + k;
    const up = 2 + k * 0.95;
    const down = 1.6 + k * 0.42;
    const notch = k >= 6 ? (k - 5) * 0.45 : 0;
    for (let r = Math.round(tc - up); r <= Math.round(tc + down); r++)
      if (r < tc - notch || r > tc + notch) set(c, r, c === W - 1 || r === Math.round(tc - up) ? "g" : "D");
  }
  // body: slate back, lighter flank, white belly; a dithered seam between the tones
  for (let c = 0; c < bw; c++) {
    const hh = half(c);
    for (let r = Math.round(cy - hh); r <= Math.round(cy + hh); r++) {
      const frac = (r - cy) / Math.max(hh, 0.5);
      const belly = 0.38 + Math.sin(c * 0.4) * 0.07;
      let v = frac > belly ? "W" : frac > -0.1 ? "g" : "G";
      if (Math.abs(frac + 0.1) < 0.09 && (c + r) % 2 === 0) v = v === "g" ? "G" : "g";
      if (Math.abs(frac - belly) < 0.08 && (c + r) % 2 === 0) v = v === "W" ? "g" : "W";
      set(c, r, v);
    }
    if (c > 16 && c < bw - 6 && c % 2 === 0) set(c, Math.round(cy - 0.8), "l"); // lateral line
  }
  for (let k = 0; k < 5; k++) for (let r = cy - 3; r <= cy + 2; r++) set(Math.round(17 + k * 2.6) - Math.floor((r - (cy - 3)) / 3), r, "D"); // five gill slits
  [[8, cy - 2], [9, cy - 2], [8, cy - 1], [9, cy - 1]].forEach(([c, r], i) => set(c!, r!, i === 0 ? "W" : "E")); // eye with a glint
  set(4, cy - 2, "D"); // nostril
  for (let c = 2; c <= 12; c++) set(c, Math.round(cy + 2.4 - c * 0.16), "D"); // mouth
  // first dorsal: tall and swept back, with a lighter leading edge
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 6, 3, 1].forEach((h, i) => {
    const c = 23 + i;
    const base = Math.round(cy - half(c));
    for (let r = base - h; r <= base; r++) set(c, r, r === base - h ? "g" : "D");
  });
  [1, 2, 3, 3, 2, 1].forEach((h, i) => {
    const t = Math.round(cy - half(44 + i));
    for (let r = t - h; r <= t; r++) set(44 + i, r, "D"); // second dorsal
    const b = Math.round(cy + half(46 + i));
    for (let r = b; r <= b + h; r++) set(46 + i, r, "D"); // anal fin
  });
  [1, 2, 2, 1].forEach((h, i) => {
    const b = Math.round(cy + half(34 + i));
    for (let r = b; r <= b + h; r++) set(34 + i, r, "D"); // pelvic fin
  });
  for (let i = 0; i < 14; i++) {
    const c = 20 + i;
    const len = Math.max(0, Math.round(10 - i * 0.75));
    for (let k = 1; k <= len; k++) set(c + Math.floor(k * 0.5), Math.round(cy + half(c)) + k, k > len - 2 ? "g" : "D"); // pectoral
  }
  for (let i = 0; i < 14; i++) set(10 + ((i * 7) % 34), cy - 4 + ((i * 3) % 6), "l"); // speckles
  return g.map((row) => row.join(""));
}

/** Whale at 2px (105 x 52 cells): tubercles, pleats, scars, barnacles, a long banded flipper and notched flukes. */
function whale(tailDy: number): string[] {
  const W = 105;
  const H = 52;
  const bw = 84;
  const cy = 21;
  const g = grid(W, H);
  const set = setter(g);
  const half = (c: number) => {
    const t = c / (bw - 1);
    const u = t < 0.3 ? (0.3 - t) / 0.3 : (t - 0.3) / 0.7;
    return Math.max(c > bw * 0.6 ? 2.4 : 0, 15 * Math.pow(Math.max(0, 1 - u * u), 0.6));
  };
  const tc = cy + tailDy * 3;
  for (let k = 0; k < W - bw + 3; k++) {
    const c = bw - 3 + k;
    const e = 2.4 + k * 0.62;
    const notch = k >= 11 ? (k - 10) * 0.9 : 0;
    for (let r = Math.round(tc - e * 1.1); r <= Math.round(tc + e * 0.85); r++)
      if (Math.abs(r - tc) >= notch) set(c, r, k > 17 || (k > 6 && r % 4 === 0) ? "F" : "f"); // ridged flukes
  }
  for (let c = 0; c < bw; c++) {
    const hh = half(c);
    for (let r = Math.round(cy - hh); r <= Math.round(cy + hh); r++) {
      const frac = (r - cy) / Math.max(hh, 0.5);
      let v = frac > 0.3 ? "W" : frac > -0.35 ? "g" : "G";
      if (v === "W" && c > 10 && c < 54 && frac > 0.45 && r % 2 === 0 && c % 7 !== 0) v = "w"; // throat pleats
      if (Math.abs(frac + 0.35) < 0.07 && (c + r) % 2 === 0) v = v === "g" ? "G" : "g"; // dithered seam
      set(c, r, v);
    }
  }
  for (let c = 0; c <= 34; c++) set(c, Math.round(cy + 3 + c * 0.11), "D"); // long mouth line
  for (let c = 12; c <= 17; c++) set(c, cy, "D"); // eyelid
  [[13, cy + 1], [14, cy + 1], [15, cy + 1], [13, cy + 2], [14, cy + 2], [15, cy + 2]].forEach(([c, r], i) => set(c!, r!, i === 0 ? "W" : "E"));
  [23, 24, 25].forEach((c) => set(c, Math.round(cy - half(c)) - 1, "D")); // blowhole
  [2, 5, 8, 11, 14, 17].forEach((c) => set(c, Math.round(cy - half(c)), "B")); // snout tubercles
  [4, 8, 12].forEach((c) => set(c, Math.round(cy + half(c)), "B")); // chin
  for (let i = 0; i < 16; i++) {
    const c = 30 + ((i * 11) % 44);
    const r = cy - 6 + ((i * 5) % 11);
    set(c, r, "B");
    if (i % 3 === 0) set(c + 1, r, "w"); // scars
  }
  // long flipper: scalloped leading edge, pale tip, a few barnacles
  const base = Math.round(cy + half(27)) - 3;
  for (let i = 0; i < 25; i++) {
    const x = 27 + Math.round(i * 1.1);
    const y = base + Math.round(i * 0.58);
    for (let k = 0; k < 4; k++) set(x, y + k, k === 0 ? "F" : "f");
    if (i % 4 === 0) set(x, y - 1, "F");
    if (i % 7 === 3) set(x, y + 4, "B");
  }
  [0, 1, 2, 3, 4, 4, 3, 2, 1].forEach((h, i) => {
    const c = 60 + i;
    for (let r = Math.round(cy - half(c)) - h; r <= Math.round(cy - half(c)); r++) set(c, r, r === Math.round(cy - half(c)) - h ? "g" : "G"); // dorsal
  });
  return g.map((row) => row.join(""));
}

function octopus(f: number): string[] {
  const g = grid(15, 16);
  const set = setter(g);
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
  const set = setter(g);
  const rx = f ? 4.4 : 5;
  for (let r = 0; r <= 6; r++) for (let c = 0; c < 11; c++) if (((c - 5) / rx) ** 2 + ((r - 6) / 6) ** 2 <= 1) set(c, r, r < 2 ? "b" : "B");
  for (let c = 1; c < 10; c += 2) set(c, 7, "D");
  [2, 4, 6, 8].forEach((base, i) => {
    for (let r = 8; r < 14; r++) set(base + Math.round(Math.sin(f * Math.PI + i + r * 0.7)), r, "D");
  });
  return g.map((row) => row.join(""));
}

/** Scuba diver swimming left: mask, tank, wetsuit and yellow fins that kick. */
function diver(f: number): string[] {
  const g = grid(27, 12);
  const set = setter(g);
  for (let r = 2; r <= 7; r++) for (let c = 0; c <= 5; c++) if (((c - 2.5) / 3) ** 2 + ((r - 4.5) / 3) ** 2 <= 1) set(c, r, "h");
  [[0, 4], [1, 4], [2, 4], [0, 5], [1, 5], [2, 5]].forEach(([c, r]) => set(c!, r!, "M")); // mask
  for (let r = 5; r <= 8; r++) for (let c = 6; c <= 18; c++) set(c, r, r === 6 ? "W" : "w"); // torso, stripe
  for (let c = 0; c <= 6; c++) set(c, 8, c < 2 ? "h" : "w"); // arm reaching forward
  for (let r = 1; r <= 4; r++) for (let c = 9; c <= 13; c++) set(c, r, c === 9 ? "o" : "O"); // tank
  set(8, 1, "K");
  set(8, 2, "K");
  const k = f ? 1 : 0; // legs kick
  for (let c = 19; c <= 22; c++) for (let r = 5 + k; r <= 6 + k; r++) set(c, r, "w");
  for (let c = 23; c <= 26; c++) for (let r = 4 + k; r <= 8 + k; r++) set(c, r, "f"); // fin
  return g.map((row) => row.join(""));
}

const SPR: Record<Kind, { frames: string[][]; pal: Pal; alpha: number; speed: number; glow?: boolean; spread?: number; px?: number }> = {
  minnow: { frames: [FISH], pal: { B: "#3cc6c0", b: "#8fe3df", D: "#2a9a95", F: "#2a9a95", E: "#071c24", G: "#8fe3df" }, alpha: 0.42, speed: 70 },
  tang: { frames: [TANG], pal: { B: "#e0c25a", b: "#f3e3a0", D: "#b89a35", F: "#b89a35", E: "#071c24", G: "#f3e3a0" }, alpha: 0.42, speed: 50 },
  lantern: { frames: [FISH], pal: { B: "#2f6f86", b: "#4a97ae", D: "#1f4d5f", F: "#1f4d5f", E: "#b8f2ee", G: "#b8f2ee" }, alpha: 0.55, speed: 40, glow: true },
  shark: { frames: [shark(-1), shark(1)], pal: { G: "#4a6172", g: "#7893a5", W: "#c4d2da", D: "#33495a", l: "#3f5666", E: "#0b1116" }, alpha: 0.5, speed: 95, px: 2 },
  whale: { frames: [whale(-1), whale(1)], pal: { G: "#365d7c", g: "#4f7b9c", W: "#a9c4d4", w: "#86a6bb", D: "#26445c", f: "#3f6a8a", F: "#6a95b2", E: "#0b1116", B: "#9fb4bf" }, alpha: 0.42, speed: 40, px: 2 },
  octopus: { frames: [octopus(0), octopus(1)], pal: { B: "#c0605a", b: "#d98078", D: "#8f3f3a", W: "#f0d6c8", E: "#3a1a18" }, alpha: 0.38, speed: 25 },
  jelly: { frames: [jelly(0), jelly(1)], pal: { B: "#8fe3df", b: "#dffaf8", D: "#5fb8b2" }, alpha: 0.42, speed: 18, glow: true },
  horde: { frames: [TINY], pal: { B: "#8fb3b6" }, alpha: 0.36, speed: 60, spread: 200 },
  diver: { frames: [diver(0), diver(1)], pal: { h: "#e8c9a0", M: "#8fd8f0", w: "#2d4258", W: "#5f87a8", O: "#e0883a", o: "#f0a860", K: "#3a4248", f: "#d8b640" }, alpha: 0.55, speed: 55 },
};

/** What lives in each layer, chosen by the layer's depth. Every layer has fish. */
function plan(depth: number): [Kind, number][] {
  if (depth < 8) return [["minnow", 3], ["horde", 1]];
  if (depth < 30) return [["minnow", 3], ["tang", 1], ["horde", 1]];
  if (depth < 80) return [["tang", 3], ["minnow", 2], ["horde", 1], ["jelly", 1], ["diver", 1]];
  if (depth < 160) return [["jelly", 2], ["lantern", 3], ["tang", 1], ["horde", 1]];
  return [["octopus", 1], ["jelly", 2], ["lantern", 4]];
}

type Creature = {
  kind: Kind;
  band: number;
  roam?: boolean; // swims in a different layer each pass (never the bottom one)
  u: number; // 0..1 height inside its band
  dir: 1 | -1;
  p: number; // 0..1 progress across the screen
  wait: number; // ms before it swims in again
  phase: number;
  members?: [number, number][];
};

// deterministic pseudo-random so the first frame is identical on every load
const seed = (i: number, n: number) => (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1;

export function createSchool() {
  const creatures: Creature[] = [];
  let bands: Band[] = [];
  return {
    creatures,
    lastT: 0,
    get bands() {
      return bands;
    },
    /** (Re)measure the layers. Creatures are made once, the first time layers are known. */
    layout(next: Band[]) {
      bands = next;
      if (creatures.length || !next.length) return;
      let i = 0;
      next.forEach((b, band) => {
        for (const [kind, n] of plan(b.depth)) {
          for (let k = 0; k < n; k++, i++) {
            creatures.push({
              kind,
              band,
              u: seed(i, 2),
              dir: seed(i, 4) > 0.5 ? 1 : -1,
              p: seed(i, 1) * 0.95,
              wait: 0,
              phase: seed(i, 5) * 6.28,
              // a horde is a loose ball of 16 small fish
              members: kind === "horde" ? Array.from({ length: 16 }, (_, m): [number, number] => [(seed(i + m, 6) - 0.5) * 190, (seed(i + m, 7) - 0.5) * 80]) : undefined,
            });
          }
        }
      });
      // sharks and whales roam: any layer except the bottom one
      (["shark", "whale"] as const).forEach((kind, k) => {
        creatures.push({ kind, band: 0, roam: true, u: seed(90 + k, 2), dir: k ? -1 : 1, p: 0.2 + k * 0.4, wait: 0, phase: k * 2 });
      });
      creatures.forEach((c) => c.roam && (c.band = Math.floor(seed(c.phase + 90, 3) * Math.max(1, next.length - 1))));
    },
  };
}

type School = ReturnType<typeof createSchool>;

/**
 * Sea life lives in the page, one set per layer. Each creature swims across the screen on its own,
 * fades in near one side and out near the other, rests, then comes back somewhere else in its layer.
 * Nothing here follows the main fish. Underwater only.
 */
export function drawSchool(ctx: CanvasRenderingContext2D, w: World, school: School) {
  const top = Math.max(0, w.surfaceY - w.scrollY);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, top, w.w, w.h - top);
  ctx.clip();
  const t = w.reduced ? 0 : w.t;
  const dt = w.reduced ? 0 : Math.max(0, Math.min(60, w.t - school.lastT));
  school.lastT = w.t;

  for (const c of school.creatures) {
    const s = SPR[c.kind];
    const b = school.bands[c.band];
    if (!b) continue;
    const rows = s.frames[Math.floor(t / (c.kind === "jelly" || c.kind === "octopus" ? 500 : 280)) % s.frames.length]!;
    const px = s.px ?? 3; // the big animals are drawn at 2px pixels for more detail
    const sw = Math.max(...rows.map((r) => r.length)) * px + (s.spread ?? 0);
    const travel = Math.max(200, w.w - 80 - sw);

    if (c.wait > 0) {
      c.wait -= dt;
      continue;
    }
    c.p += ((dt / 1000) * s.speed) / travel;
    if (c.p >= 1) {
      c.p = 0;
      c.wait = 800 + Math.random() * 4000;
      c.dir = Math.random() > 0.5 ? 1 : -1;
      c.u = Math.random();
      if (c.roam) c.band = Math.floor(Math.random() * Math.max(1, school.bands.length - 1));
      continue;
    }

    const y = b.top + (0.1 + 0.8 * c.u) * (b.bottom - b.top) - w.scrollY + Math.sin(t / 1100 + c.phase) * (c.kind === "jelly" ? 10 : 3);
    if (y < -80 || y > w.h + 80) continue;
    const x = 40 + (c.dir > 0 ? c.p : 1 - c.p) * travel + (s.spread ?? 0) / 2;
    const edge = Math.min(1, Math.min(c.p, 1 - c.p) / 0.15); // fade in and out at the sides

    ctx.globalAlpha = s.alpha * edge;
    if (s.glow) {
      ctx.shadowColor = "#b8f2ee";
      ctx.shadowBlur = 8;
    }
    const spots: [number, number][] = c.members
      ? c.members.map(([dx, dy], m) => [dx + Math.sin(t / 500 + m) * 6, dy + Math.cos(t / 600 + m * 1.7) * 4])
      : [[0, 0]];
    const pw = Math.max(...rows.map((r) => r.length)) * px;
    for (const [dx, dy] of spots) {
      ctx.save();
      ctx.translate(x + dx + pw / 2, y + dy);
      ctx.scale(c.dir > 0 ? -1 : 1, 1); // sprites face left
      drawSprite(ctx, rows, s.pal, -pw / 2, 0, px);
      ctx.restore();
    }
    ctx.shadowBlur = 0;

    if (c.kind === "diver" && !w.reduced) {
      // exhaled bubbles rise from the diver's regulator
      const hx = x + (c.dir > 0 ? pw - 6 : 6);
      for (let k = 0; k < 3; k++) {
        const rise = ((t / 30 + k * 22) % 66);
        ctx.strokeStyle = "rgb(220 235 234 / .6)";
        ctx.strokeRect(Math.round(hx + Math.sin(t / 400 + k) * 4), Math.round(y - rise), 4, 4);
      }
    }
  }
  ctx.restore();
}
