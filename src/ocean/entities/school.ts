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

/** Shark / whale: a tapered body with a forked tail; two frames so the tail beats. */
function spindle(w: number, h: number, dorsal: boolean, tailDy: number): string[] {
  const bw = w - 6;
  const cy = 4 + h / 2;
  const g = grid(w, h + 8);
  const set = setter(g);
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

const SPR: Record<Kind, { frames: string[][]; pal: Pal; alpha: number; speed: number; glow?: boolean; spread?: number }> = {
  minnow: { frames: [FISH], pal: { B: "#3cc6c0", b: "#8fe3df", D: "#2a9a95", F: "#2a9a95", E: "#071c24", G: "#8fe3df" }, alpha: 0.42, speed: 70 },
  tang: { frames: [TANG], pal: { B: "#e0c25a", b: "#f3e3a0", D: "#b89a35", F: "#b89a35", E: "#071c24", G: "#f3e3a0" }, alpha: 0.42, speed: 50 },
  lantern: { frames: [FISH], pal: { B: "#2f6f86", b: "#4a97ae", D: "#1f4d5f", F: "#1f4d5f", E: "#b8f2ee", G: "#b8f2ee" }, alpha: 0.55, speed: 40, glow: true },
  shark: { frames: [spindle(32, 10, true, -1), spindle(32, 10, true, 1)], pal: { G: "#5d7482", W: "#aab9c0", D: "#44606e", F: "#44606e", E: "#0f1720" }, alpha: 0.36, speed: 90 },
  whale: { frames: [spindle(44, 16, false, -1), spindle(44, 16, false, 1)], pal: { G: "#3f6a8a", W: "#8aa9bf", D: "#2f536e", F: "#2f536e", E: "#0f1720" }, alpha: 0.3, speed: 45 },
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
  if (depth < 160) return [["shark", 1], ["jelly", 2], ["lantern", 3], ["tang", 1], ["horde", 1]];
  return [["whale", 1], ["octopus", 1], ["jelly", 2], ["lantern", 4]];
}

type Creature = {
  kind: Kind;
  band: number;
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
    const sw = Math.max(...rows.map((r) => r.length)) * 3 + (s.spread ?? 0);
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
    const pw = Math.max(...rows.map((r) => r.length)) * 3;
    for (const [dx, dy] of spots) {
      ctx.save();
      ctx.translate(x + dx + pw / 2, y + dy);
      ctx.scale(c.dir > 0 ? -1 : 1, 1); // sprites face left
      drawSprite(ctx, rows, s.pal, -pw / 2, 0, 3);
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
