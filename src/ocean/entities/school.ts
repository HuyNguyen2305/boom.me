import type { World } from "../world";
import { drawSprite } from "./pixels";

type Pal = Record<string, string>;
type Kind = "minnow" | "tang" | "clown" | "angel" | "puffer" | "bluetang" | "parrot" | "barracuda" | "turtle" | "lantern" | "shark" | "whale" | "octopus" | "jelly" | "horde" | "diver";
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

/**
 * A generic side-view fish (faces left): an ellipse body of length L and height H, a widening forked tail, an optional
 * dorsal and belly fin, and an eye. `paint(col, y01)` picks each body cell's colour letter (y01: 0 at the back, 1 at the belly).
 */
function fishShape(o: { L: number; H: number; tail: number; dorsal?: number; belly?: number; eye?: number; paint: (c: number, y01: number, r: number) => string }): string[] {
  const { L, H, tail, dorsal = 0, belly = 0 } = o;
  const W = L + tail;
  const cy = dorsal + H / 2;
  const g = grid(W, Math.ceil(dorsal + H + belly) + 1);
  const set = setter(g);
  const cx = L / 2;
  for (let c = 0; c < L; c++) {
    const half = (H / 2) * Math.sqrt(Math.max(0, 1 - ((c + 0.5 - cx) / (cx + 0.2)) ** 2));
    for (let r = Math.round(cy - half); r < Math.round(cy + half); r++) set(c, r, o.paint(c, (r - (cy - half)) / Math.max(1, 2 * half), r));
  }
  for (let k = 0; k < tail; k++) {
    const half = 0.8 + ((k + 1) / tail) * (H / 2) * 0.95;
    for (let r = Math.round(cy - half); r < Math.round(cy + half); r++) if (!(k === tail - 1 && Math.abs(r + 0.5 - cy) < H * 0.12)) set(L + k, r, "F"); // forked
  }
  for (let c = Math.round(L * 0.3); c < Math.round(L * 0.75); c++) {
    const h = Math.round(dorsal * (1 - Math.abs(c - L * 0.45) / (L * 0.32)));
    for (let r = Math.round(dorsal) - h; r < dorsal + 1; r++) if (g[r]?.[c] === ".") set(c, r, "F");
  }
  for (let c = Math.round(L * 0.35); c < Math.round(L * 0.65); c++) {
    const h = Math.round(belly * (1 - Math.abs(c - L * 0.5) / (L * 0.3)));
    for (let r = Math.round(dorsal + H) - 1; r < dorsal + H + h; r++) if (g[r]?.[c] === ".") set(c, r, "F");
  }
  const er = Math.round(cy - H * 0.12);
  set(2, er, "E");
  if (o.eye) set(2, er + 1, "E");
  return g.map((row) => row.join(""));
}

const CLOWN = fishShape({ L: 11, H: 7, tail: 4, dorsal: 2, belly: 1, paint: (c) => (c === 3 || c === 4 || c === 8 ? "W" : "B") });
const ANGEL = fishShape({ L: 9, H: 10, tail: 3, dorsal: 5, belly: 5, paint: (c) => (c % 3 === 1 ? "D" : "B") });
const PUFFER = fishShape({ L: 10, H: 9, tail: 2, dorsal: 1, belly: 1, eye: 1, paint: (c, y, r) => (y > 0.62 ? "b" : (c * 7 + r * 3) % 5 === 0 ? "D" : "B") });
const BLUETANG = fishShape({ L: 11, H: 8, tail: 4, dorsal: 2, belly: 1, paint: (c, y) => (c >= 4 && c <= 9 && y > 0.25 && y < 0.6 - (c - 4) * 0.04 ? "D" : "B") });
const PARROT = fishShape({ L: 12, H: 7, tail: 4, dorsal: 2, belly: 1, paint: (c, y) => (c < 2 ? "Y" : y < 0.3 ? "G" : y > 0.66 ? "P" : "B") });
const BARRACUDA = fishShape({ L: 19, H: 4, tail: 4, dorsal: 1, belly: 0, paint: (c, y) => (y < 0.4 ? "S" : "W") });

const RAMP = "abcdefg"; // the whale's blues, from the deepest (a) to near-white (g)

/** No black line: an edge cell steps one shade along the blue ramp: lighter on top, deeper on the sides and underneath. */
function softRim(rows: string[]): string[] {
  const at = (r: number, c: number) => rows[r]?.[c] ?? ".";
  return rows.map((row, r) =>
    [...row]
      .map((v, c) => {
        const i = RAMP.indexOf(v);
        if (i < 0) return v;
        if (at(r - 1, c) === ".") return RAMP[Math.min(6, i + 1)]!;
        if (at(r + 1, c) === "." || at(r, c - 1) === "." || at(r, c + 1) === ".") return RAMP[Math.max(0, i - 1)]!;
        return v;
      })
      .join(""),
  );
}

/** Fills a leaf-shaped lobe along a direction (the whale's flukes). Coordinates stay fractional: the caller rotates and rounds. */
function lobe(set: (c: number, r: number, v: string) => void, x: number, y: number, dx: number, dy: number, len: number, wid: number) {
  const n = Math.hypot(dx, dy);
  const [ux, uy] = [dx / n, dy / n];
  for (let k = 0; k <= len; k += 0.5) {
    const w = 0.5 + wid * Math.sin(Math.PI * Math.pow(k / len, 0.75));
    const cx = x + ux * k;
    const cy = y + uy * k - (k * k) / len * 0.12; // tips curl up
    for (let j = -w; j <= w; j += 0.25) set(cx - uy * j, cy + ux * j, j < -w * 0.3 ? "c" : "b");
  }
}

/**
 * Bends the rear of a straight sprite along a curved spine (tail tip up when beta > 0), pivoting at column x0 over
 * `len` cells, so the lower body and the tail move together. Returns the outlined rows.
 */
function bend(src: string[][], cy0: number, x0: number, len: number, betaDeg: number, W: number, H: number, oy: number, outlineColor: string | null = "O"): string[] {
  const k = ((betaDeg * Math.PI) / 180) / len;
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
  if (outlineColor) outline(g, outlineColor);
  return g.map((row) => row.join(""));
}

/** The shark drawn straight at 2px: outlined torpedo with a pointed snout, white belly, gill slits, tall dorsal and an upright crescent tail. */
function sharkSource() {
  const W = 80;
  const H = 46;
  const bw = 58;
  const cy = 24;
  const g = grid(W, H);
  const set = setter(g);
  const half = (c: number) => {
    const t = c / bw;
    const h = t < 0.38 ? 7.2 * Math.pow(t / 0.38, 0.8) : 7.2 * Math.pow(Math.max(0, 1 - (t - 0.38) / 0.62), 1.15);
    return Math.max(c > bw * 0.7 ? 2.1 : 0, h); // a sturdier tail root
  };
  // tail: one fat upright crescent polygon. Tall upper lobe, short lower lobe, concave trailing edge
  const tc = cy;
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
  return { g, cy };
}

/** The shark swims: the rear half of the body and the tail sway together, a little. */
function shark(betaDeg: number): string[] {
  const { g, cy } = sharkSource();
  return bend(g, cy, 24, 48, betaDeg, 86, 66, 34);
}

/**
 * The whale drawn straight, as a sperm whale (from the user's sketch): a huge blunt box of a head with rounded corners,
 * a flat back running all the way to the tail, a belly that sags under the head and then climbs to a thin tail, small
 * flukes. Head on the left. No lines or patterns: just a smooth ramp of blues from the deepest on the back to near-white
 * on the belly. Foreshortening shrinks the flukes as the tail passes level.
 */
function whaleSource(fluke: number) {
  const W = 152;
  const H = 96;
  const g = grid(W, H);
  const put = setter(g);
  const set = (x: number, y: number, v: string) => put(Math.round(x), Math.round(y), v);
  const [top, x0, headEnd, xe, hmax, rc] = [28, 3, 56, 132, 36, 8];
  // thickness: full height through the head, then a long taper that keeps narrowing toward the tail. The back stays flat.
  const thick = (x: number) => (x <= headEnd ? hmax : 4 + (hmax - 4) * Math.pow(1 - (x - headEnd) / (xe - headEnd), 1.35));
  for (const side of [-1, 1]) lobe(set, xe, top + thick(xe) / 2, 0.3, side * 0.95, (side < 0 ? 26 : 19) * fluke, side < 0 ? 6 : 5);
  for (let x = x0; x <= xe; x++) {
    let t = top;
    let b = top + thick(x);
    const dxf = x - x0;
    if (dxf < rc) {
      const k = rc - Math.sqrt(Math.max(0, rc * rc - (rc - dxf) ** 2)); // rounded corners on the head's front
      t += k;
      b -= k;
    }
    for (let y = Math.round(t); y <= Math.round(b); y++) {
      const fr = (y - t) / Math.max(1, b - t); // 0 at the back, 1 at the belly
      const f = fr - Math.max(0, x - 84) * 0.011; // toward the tail the white belly eases back into blue, with no vertical seams
      const step = f < 0.1 ? 0 : f < 0.28 ? 1 : f < 0.44 ? 2 : f < 0.58 ? 3 : f < 0.72 ? 4 : f < 0.86 ? 5 : 6;
      put(x, y, RAMP[step]!);
    }
  }
  [[14, top + 14], [15, top + 14], [14, top + 15], [15, top + 15]].forEach(([x, y]) => set(x!, y!, "E")); // small eye
  // the flipper joins the blue flank behind the head (not the pale belly); it is drawn after the bend
  const flipper = { x: 64, y: top + thick(64) * 0.45 };
  return { g, cy: top + thick(xe) / 2, flipper };
}

/** The whale swims: everything behind the head bends with the tail like a lever (tip up, level, tip down). */
function whale(betaDeg: number): string[] {
  const [x0, len, oy] = [56, 84, 76];
  const { g, cy, flipper } = whaleSource(0.4 + 0.6 * Math.abs(Math.sin((betaDeg * Math.PI) / 180)));
  const out = bend(g, cy, x0, len, betaDeg, 170, 132, oy, null).map((r) => [...r]);
  // the flipper stays attached to the flank where the bend carries it, but is not itself bent
  const k = ((betaDeg * Math.PI) / 180) / len;
  const [s, d] = [flipper.x - x0, flipper.y - cy];
  const nx = Math.abs(k) < 1e-6 ? flipper.x : x0 + Math.sin(k * s) / k + d * Math.sin(k * s);
  const ny = Math.abs(k) < 1e-6 ? oy + d : oy + (Math.cos(k * s) - 1) / k + d * Math.cos(k * s);
  for (let i = 0; i <= 15; i++) {
    const cx = nx + i * 0.9;
    const half = 1.5 + 3.4 * (1 - Math.pow(i / 15, 2.2));
    for (let x = Math.round(cx - half); x <= Math.round(cx + half); x++) {
      const row = out[Math.round(ny + i)];
      if (row && x >= 0 && x < row.length) row[x] = x <= cx - half + 1 ? "c" : x >= cx + half - 1 ? "a" : "b"; // blue, lighter on its leading edge
    }
  }
  return softRim(out.map((r) => r.join("")));
}

/**
 * Green sea turtle swimming left (3 frames of the front flipper: raised, level, down): a domed shell with a scute
 * pattern and a pale rim, a pale belly, a small head with an eye, a big paddle flipper and a short rear one.
 */
function turtle(f: number): string[] {
  const g = grid(26, 15);
  const set = setter(g);
  const stroke = (x0: number, y0: number, x1: number, y1: number, v: string, w = 2) => {
    for (let t = 0; t <= 1; t += 0.05) for (let k = 0; k < w; k++) set(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t) + k, v);
  };
  for (let y = 0; y < 15; y++)
    for (let x = 0; x < 26; x++) {
      if (((x - 14) / 9) ** 2 + ((y - 7) / 5.6) ** 2 <= 1 && y <= 8) set(x, y, (x + y * 2) % 5 === 0 || (x + y) % 7 === 0 ? "L" : y <= 3 ? "S" : "D"); // shell
      if (y === 8 && x >= 6 && x <= 22) set(x, y, "R"); // pale rim
      if (y === 9 && x >= 8 && x <= 21) set(x, y, "Y"); // belly
    }
  for (let y = 5; y <= 9; y++) for (let x = 1; x <= 6; x++) if (((x - 3.5) / 3) ** 2 + ((y - 7.2) / 2.3) ** 2 <= 1) set(x, y, "K"); // head and neck
  set(2, 6, "E");
  set(1, 8, "Y"); // beak
  stroke(23, 8, 25, 10, "F"); // tail and rear flipper
  stroke(18, 9, 22, 12, "F");
  const [ex, ey] = [[15, 3], [16, 9], [12, 13]][f]!;
  stroke(9, 8, ex!, ey!, "F", 3); // the big front flipper
  stroke(9, 8, ex!, ey!, "K", 1);
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
  shark: { frames: [10, 0, -10, 0].map(shark), pal: { G: "#4f6f8f", g: "#6f8dab", W: "#dce5ee", w: "#b4c2d0", D: "#2f455c", O: "#0e1620", E: "#0a0f14" }, alpha: 0.5, speed: 95, px: 2 },
  whale: { frames: [44, 24, 4, -18, -30, -18, 4, 24].map(whale), pal: { a: "#2c61b8", b: "#3d77cc", c: "#5a8fd8", d: "#7ba6e0", e: "#a3c2ec", f: "#c9dbf3", g: "#e8f0fb", E: "#12306c" }, alpha: 0.42, speed: 40, px: 2 },
  clown: { frames: [CLOWN], pal: { B: "#f08a2c", W: "#f4f1ea", F: "#d9661a", E: "#1b1210" }, alpha: 0.55, speed: 55 },
  angel: { frames: [ANGEL], pal: { B: "#e7d27a", D: "#4a7fbf", F: "#8fb3d8", E: "#101820" }, alpha: 0.5, speed: 38 },
  puffer: { frames: [PUFFER], pal: { B: "#d9b36a", b: "#f1e3b8", D: "#8a6a30", F: "#c49a4e", E: "#101820" }, alpha: 0.5, speed: 30 },
  bluetang: { frames: [BLUETANG], pal: { B: "#2e6fd6", D: "#0f2a5c", F: "#f0d34a", E: "#e8f0fb" }, alpha: 0.55, speed: 62 },
  parrot: { frames: [PARROT], pal: { G: "#3cb878", B: "#3cc6c0", P: "#e88aa8", Y: "#f0d34a", F: "#3cb878", E: "#101820" }, alpha: 0.5, speed: 48 },
  barracuda: { frames: [BARRACUDA], pal: { S: "#7f98a6", W: "#dce5ee", F: "#5f7684", E: "#101820" }, alpha: 0.5, speed: 110 },
  turtle: { frames: [turtle(0), turtle(1), turtle(2), turtle(1)], pal: { S: "#2f8a52", D: "#1f6a3e", L: "#5fbf7a", R: "#c9d98a", Y: "#e8e6b0", K: "#6a8f4a", F: "#3f9a5c", E: "#0b1a12" }, alpha: 0.7, speed: 24 },
  octopus: { frames: [octopus(0), octopus(1)], pal: { B: "#c0605a", b: "#d98078", D: "#8f3f3a", W: "#f0d6c8", E: "#3a1a18" }, alpha: 0.38, speed: 25 },
  jelly: { frames: [jelly(0), jelly(1)], pal: { B: "#8fe3df", b: "#dffaf8", D: "#5fb8b2" }, alpha: 0.42, speed: 18, glow: true },
  horde: { frames: [TINY], pal: { B: "#8fb3b6" }, alpha: 0.36, speed: 60, spread: 200 },
  diver: { frames: [diver(0), diver(1)], pal: { h: "#e8c9a0", M: "#8fd8f0", w: "#2d4258", W: "#5f87a8", O: "#e0883a", o: "#f0a860", K: "#3a4248", f: "#d8b640" }, alpha: 0.55, speed: 55 },
};

/** What lives in each layer, chosen by the layer's depth. Every layer has fish. */
function plan(depth: number): [Kind, number][] {
  if (depth < 8) return [["turtle", 2], ["minnow", 3], ["clown", 1], ["parrot", 1], ["bluetang", 1], ["horde", 1]];
  if (depth < 30) return [["minnow", 2], ["tang", 1], ["angel", 1], ["clown", 1], ["puffer", 1], ["parrot", 1], ["horde", 1]];
  if (depth < 80) return [["tang", 2], ["minnow", 2], ["bluetang", 1], ["angel", 1], ["puffer", 1], ["barracuda", 1], ["horde", 1], ["jelly", 1], ["diver", 1]];
  if (depth < 160) return [["jelly", 2], ["lantern", 3], ["barracuda", 1], ["puffer", 1], ["horde", 1]];
  // the short Works layers just above the floor: a tight lantern school, no octopus (that is the floor's)
  if (depth < 190) return [["lantern", 4], ["jelly", 1], ["puffer", 1], ["horde", 1]];
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
    const rows = s.frames[Math.floor(t / (c.kind === "jelly" || c.kind === "octopus" ? 500 : c.kind === "turtle" ? 420 : 280)) % s.frames.length]!;
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
      ctx.translate(Math.round(x + dx + pw / 2), Math.round(y + dy)); // whole pixels: a fractional offset shimmers while the page scrolls
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
