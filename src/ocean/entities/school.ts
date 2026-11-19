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

/** Dark outline around every filled cell, as in classic pixel sprites. */
function outline(g: string[][], v = "O") {
  const edge: [number, number][] = [];
  g.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell === "." && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dc, dr]) => (g[r + dr!]?.[c + dc!] ?? ".") !== ".")) edge.push([c, r]);
    }),
  );
  edge.forEach(([c, r]) => (g[r]![c] = v));
}

/** Fills a leaf-shaped lobe along a direction (the whale's flukes). Coordinates stay fractional: the caller rotates and rounds. */
function lobe(set: (c: number, r: number, v: string) => void, x: number, y: number, dx: number, dy: number, len: number, wid: number) {
  const n = Math.hypot(dx, dy);
  const [ux, uy] = [dx / n, dy / n];
  for (let k = 0; k <= len; k += 0.5) {
    const w = 0.5 + wid * Math.sin(Math.PI * Math.pow(k / len, 0.75));
    const cx = x + ux * k;
    const cy = y + uy * k - (k * k) / len * 0.12; // tips curl up
    for (let j = -w; j <= w; j += 0.25) set(cx - uy * j, cy + ux * j, j < -w * 0.3 ? "h" : "G");
  }
}

/** Shark at 2px: outlined torpedo with a pointed snout, white belly, gill slits, tall dorsal and an upright crescent tail. */
function shark(tailDy: number): string[] {
  const W = 80;
  const H = 46;
  const bw = 58;
  const cy = 24;
  const g = grid(W, H);
  const set = setter(g);
  const half = (c: number) => {
    const t = c / bw;
    const h = t < 0.38 ? 7.2 * Math.pow(t / 0.38, 0.8) : 7.2 * Math.pow(Math.max(0, 1 - (t - 0.38) / 0.62), 1.15);
    return Math.max(c > bw * 0.7 ? 1.3 : 0, h);
  };
  // tail: one fat upright crescent polygon. Tall upper lobe, short lower lobe, concave trailing edge
  const tc = cy + tailDy;
  const poly: [number, number][] = [[bw - 3, tc - 1], [bw + 14, tc - 22], [bw + 8, tc - 5], [bw + 12, tc + 11], [bw - 3, tc + 2]];
  const inside = (x: number, y: number) => {
    let hit = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i]!;
      const [xj, yj] = poly[j]!;
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
  };
  for (let r = tc - 23; r <= tc + 13; r++) for (let c = bw - 4; c < W; c++) if (inside(c + 0.5, r + 0.5)) set(c, r, r < tc - 6 ? "g" : "G");
  // body: slate back, white belly with a pale streak
  for (let c = 0; c < bw; c++) {
    const hh = half(c);
    for (let r = Math.round(cy - hh); r <= Math.round(cy + hh); r++) {
      const frac = (r - cy) / Math.max(hh, 0.5);
      const belly = 0.22 + Math.sin(c * 0.35) * 0.1;
      let v = frac > belly ? "W" : frac > -0.45 ? "g" : "G";
      if (v === "W" && frac > belly + 0.35 && c > 26 && c < 50 && (c + r) % 3 === 0) v = "w";
      set(c, r, v);
    }
  }
  // tall dorsal triangle, upright back edge
  for (let c = 24; c <= 36; c++) {
    const h = c <= 31 ? ((c - 24) / 7) * 13 : Math.max(0, ((36 - c) / 5) * 13);
    for (let r = Math.round(cy - half(c) - h); r <= Math.round(cy - half(c)); r++) set(c, r, c < 28 && r < cy - half(c) - h + 2 ? "g" : "G");
  }
  [0, 1, 2, 3, 2, 1].forEach((h, i) => {
    const t = Math.round(cy - half(46 + i));
    for (let r = t - h; r <= t; r++) set(46 + i, r, "G"); // second dorsal
    const b = Math.round(cy + half(48 + i));
    for (let r = b; r <= b + h; r++) set(48 + i, r, "G"); // anal fin
  });
  [0, 1, 2, 3, 4, 3, 1].forEach((h, i) => {
    const b = Math.round(cy + half(36 + i));
    for (let r = b; r <= b + h; r++) set(36 + i, r, "G"); // pelvic fin
  });
  for (let i = 0; i < 12; i++) {
    const c = 21 + i;
    const len = Math.max(0, Math.round(7 - i * 0.7));
    for (let k = 0; k <= len; k++) set(c + Math.floor(k * 0.7), Math.round(cy + half(c)) + k, "g"); // swept pectoral fin
  }
  for (let k = 0; k < 4; k++) for (let r = cy - 4; r <= cy + 1; r++) set(21 + k * 2 - (r > cy - 2 ? 1 : 0), r, "D"); // gill slits
  [[8, cy - 2], [9, cy - 2], [8, cy - 1], [9, cy - 1]].forEach(([c, r]) => set(c!, r!, "E")); // eye
  for (let c = 3; c <= 11; c++) set(c, Math.round(cy + 2.5 - c * 0.12), "D"); // mouth
  outline(g);
  return g.map((row) => row.join(""));
}

/** The whale drawn straight: tapered body, a long tail arm and flukes. Foreshortening shrinks the flukes as the tail passes level. */
function whaleSource(fluke: number) {
  const W = 112;
  const H = 64;
  const cx = 37;
  const cy = 32;
  const g = grid(W, H);
  const put = setter(g);
  const set = (x: number, y: number, v: string) => put(Math.round(x), Math.round(y), v);
  // tail arm: a straight limb that thins toward the flukes
  const [hx, hy, L] = [62, cy + 1, 34];
  for (let i = 0; i <= 200; i++) {
    const u = i / 200;
    const r = 6.4 - u * 3;
    for (let dy = -5; dy <= 5; dy += 0.5) for (let dx = -5; dx <= 5; dx += 0.5) if (dx * dx + dy * dy <= r * r) set(hx + u * L + dx, hy + dy, dy < -r * 0.35 ? "h" : dy > r * 0.4 ? "d" : "G");
  }
  // two flukes spread at right angles to the arm, swept back a little
  for (const side of [-1, 1]) lobe(set, hx + L, hy, 0.3, side * 0.95, 19 * fluke, 4.6);
  // body: a boxy superellipse (big blunt head) whose rear half narrows into the arm
  const rx = 35;
  const ry = 16;
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      const dx = (c - cx) / rx;
      const taper = dx > 0.23 ? 1 - 0.62 * Math.pow((dx - 0.23) / 0.77, 1.5) : 1;
      const dy = (r - cy) / (ry * taper);
      if (Math.abs(dx) ** 3.2 + Math.abs(dy) ** 2.2 > 1) continue;
      const dyo = (r - cy) / ry;
      let v = dyo < -0.55 ? "h" : "G";
      if (dx * 0.9 + dyo * 0.6 > 0.62) v = "d"; // shaded rear flank, a soft diagonal
      const throat = cy + 4 + Math.sin(c * 0.9) * 1.1 + (c - 4) * 0.05 + Math.max(0, c - 36) * 0.85; // jagged pale throat, rising into the flank
      if (r > throat) v = (c * 7 + r * 3) % 11 === 0 ? "w" : "W";
      else if (r > throat - 2 && r <= throat && c < 62) v = "d"; // dark seam above the throat
      put(c, r, v);
    }
  }
  [[13, 27], [14, 27], [13, 28], [14, 28], [13, 29], [14, 29]].forEach(([c, r]) => put(c!, r!, "E")); // eye
  [[15, 27], [15, 28], [15, 29]].forEach(([c, r]) => put(c!, r!, "e"));
  for (let i = 0; i < 12; i++) {
    const x = 38 + Math.round(i * 0.8);
    const y = cy + 12 + i;
    const w = Math.max(2, 5 - Math.floor(i / 3));
    for (let k = 0; k < w; k++) put(x + k, y, k === w - 1 ? "h" : "G"); // short flipper, light along its lower edge
  }
  return { g, cy };
}

/**
 * Whale at 2px. The rear half of the whole body, tail arm and flukes bend together along one curved spine that pivots
 * at the middle of the body, like a lever: tip up (beta > 0), level, tip down (beta < 0).
 */
function whale(betaDeg: number): string[] {
  const beta = (betaDeg * Math.PI) / 180;
  const { g: src, cy: cy0 } = whaleSource(0.4 + 0.6 * Math.abs(Math.sin(beta)));
  const W = 120;
  const H = 100;
  const oy = 56; // row of the body's centre line in the output
  const x0 = 32; // where the spine starts to bend
  const k = beta / 64;
  const g = grid(W, H);
  const put = setter(g);
  src.forEach((row, y) =>
    row.forEach((v, x) => {
      if (v === ".") return;
      for (const ox of [-0.25, 0.25]) {
        for (const oyy of [-0.25, 0.25]) {
          const s = x + ox - x0;
          const d = y + oyy - cy0;
          if (s <= 0 || Math.abs(k) < 1e-6) put(Math.round(x + ox), Math.round(oy + d), v);
          else put(Math.round(x0 + Math.sin(k * s) / k + d * Math.sin(k * s)), Math.round(oy + (Math.cos(k * s) - 1) / k + d * Math.cos(k * s)), v);
        }
      }
    }),
  );
  outline(g);
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
  shark: { frames: [shark(-1), shark(1)], pal: { G: "#4f6f8f", g: "#6f8dab", W: "#dce5ee", w: "#b4c2d0", D: "#2f455c", O: "#0e1620", E: "#0a0f14" }, alpha: 0.5, speed: 95, px: 2 },
  whale: { frames: [80, 45, 5, -30, -55, -30, 5, 45].map(whale), pal: { G: "#3b74c4", h: "#6a9be0", d: "#2a58a0", W: "#8f9db3", w: "#c3cfe2", O: "#16336a", E: "#0a0f1a", e: "#f0f4fa" }, alpha: 0.42, speed: 40, px: 2 },
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
