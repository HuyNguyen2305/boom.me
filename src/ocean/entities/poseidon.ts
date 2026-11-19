// Poseidon statue, built from shaded primitives (ellipses, limbs, polygons) so the light stays consistent: it comes from the upper left.
// The statue looks to the LEFT, torso turned toward us, trident held in the far (right) hand.
// Ramps run dark -> light: body 01234, hair/beard fghij, cloth pqrst, gold ABCDE, plinth uvwxy, moss m, eye e, gem Zz.

export const STATUE_W = 46;
export const STATUE_H = 88;

type G = string[][];
const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

function tools(seed: number) {
  const g: G = Array.from({ length: STATUE_H }, () => Array<string>(STATUE_W).fill("."));
  const r = rng(seed);
  const put = (x: number, y: number, v: string) => {
    const [cx, cy] = [Math.round(x), Math.round(y)];
    if (cy >= 0 && cy < STATUE_H && cx >= 0 && cx < STATUE_W) g[cy]![cx] = v;
  };
  /** brightness 0..1 from a surface normal; light from the upper left */
  const lit = (nx: number, ny: number) => 0.5 - 0.5 * (nx * 0.8 + ny * 0.6);
  const pick = (ramp: string, b: number, grain = 0.07) => {
    let i = Math.floor(b * ramp.length);
    if (r() < grain) i += r() < 0.5 ? -1 : 1; // weathered speckle
    return ramp[Math.max(0, Math.min(ramp.length - 1, i))]!;
  };
  const ell = (cx: number, cy: number, rx: number, ry: number, ramp: string, grain?: number) => {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const nx = (x - cx) / rx;
        const ny = (y - cy) / ry;
        if (nx * nx + ny * ny <= 1) put(x, y, pick(ramp, lit(nx, ny), grain));
      }
  };
  /** a capsule between two points with radii r0 -> r1 */
  const limb = (x0: number, y0: number, x1: number, y1: number, r0: number, r1: number, ramp: string, grain?: number) => {
    const [dx, dy] = [x1 - x0, y1 - y0];
    const L2 = dx * dx + dy * dy || 1;
    const R = Math.max(r0, r1) + 1;
    for (let y = Math.floor(Math.min(y0, y1) - R); y <= Math.ceil(Math.max(y0, y1) + R); y++)
      for (let x = Math.floor(Math.min(x0, x1) - R); x <= Math.ceil(Math.max(x0, x1) + R); x++) {
        const t = Math.max(0, Math.min(1, ((x - x0) * dx + (y - y0) * dy) / L2));
        const [px, py] = [x0 + dx * t, y0 + dy * t];
        const rad = r0 + (r1 - r0) * t;
        const d = Math.hypot(x - px, y - py);
        if (d <= rad) put(x, y, pick(ramp, lit((x - px) / rad, (y - py) / rad), grain));
      }
  };
  const inside = (pts: [number, number][], x: number, y: number) => {
    let hit = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i]!;
      const [xj, yj] = pts[j]!;
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
  };
  /** a filled polygon shaded across its bounding box, with an optional per-cell shade tweak (folds, curls) */
  const poly = (pts: [number, number][], ramp: string, tweak?: (x: number, y: number) => number, grain = 0.06) => {
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    for (let y = Math.floor(y0); y <= Math.ceil(y1); y++)
      for (let x = Math.floor(x0); x <= Math.ceil(x1); x++)
        if (inside(pts, x + 0.5, y + 0.5)) {
          const nx = ((x - x0) / (x1 - x0 || 1)) * 2 - 1;
          const ny = ((y - y0) / (y1 - y0 || 1)) * 2 - 1;
          let i = Math.floor(lit(nx * 0.8, ny * 0.5) * ramp.length) + (tweak ? tweak(x, y) : 0);
          if (grain > r()) i += r() < 0.5 ? -1 : 1;
          put(x, y, ramp[Math.max(0, Math.min(ramp.length - 1, i))]!);
        }
  };
  return { g, put, ell, limb, poly, r };
}

function poseidon(): string[] {
  const { g, put, ell, limb, poly, r } = tools(11);
  const M = "01234";
  const H = "fghij";
  const C = "pqrst";
  const GOLD = "ABCDE";
  const P = "uvwxy";

  // plinth: a stepped block with a lit top edge
  poly([[3, 82], [42, 82], [42, 87], [3, 87]], P, (x, y) => (y === 82 ? 2 : y > 85 ? -1 : 0), 0.12);
  poly([[6, 77], [39, 77], [39, 82], [6, 82]], P, (x, y) => (y === 77 ? 2 : 0), 0.12);
  for (let k = 0; k < 7; k++) put(4 + Math.floor(r() * 38), 82 + Math.floor(r() * 5), "m"); // moss and chips

  // legs, then the drape over them
  limb(28, 58, 28, 75, 3.6, 2.7, M); // back leg
  ell(31, 76, 4.2, 1.5, M);
  limb(19, 58, 17, 75, 4, 2.9, M); // front leg, a step to the left
  ell(13, 76, 5, 1.7, M);
  [[10, 76], [12, 77]].forEach(([x, y]) => put(x!, y!, "1")); // toes
  // the cloth hangs to the knee with a wavy hem and vertical folds
  const hem = (x: number) => 66 + Math.round(Math.sin(x * 0.9) * 1.4);
  poly([[12, 42], [33, 42], [35, 56], [34, 70], [12, 70], [10, 56]], C, (x) => (x % 4 === 0 ? -1 : x % 4 === 2 ? 1 : 0));
  for (let x = 9; x <= 36; x++) for (let y = hem(x) + 1; y <= 71; y++) if (g[y]![x] !== "." && "pqrst".includes(g[y]![x]!)) put(x, y, "."); // wavy hem
  poly([[12, 41], [33, 41], [33, 45], [12, 45]], C, () => -1); // belt

  // torso, turned toward the viewer
  poly([[10, 24], [35, 24], [34, 34], [31, 44], [14, 44], [11, 34]], M);
  ell(10, 27, 4.6, 4.4, M); // shoulders
  ell(35, 27, 4.6, 4.4, M);
  const pec = (cx: number) => {
    for (let a = 0; a < Math.PI; a += 0.12) put(cx + Math.cos(a) * 5.2, 31.5 + Math.sin(a) * 3.2, "1");
  };
  pec(17);
  pec(28);
  for (let y = 33; y <= 41; y++) put(22, y, "1"); // linea alba
  [36, 39].forEach((y) => {
    for (let x = 19; x <= 25; x++) if (x !== 22) put(x, y, "1"); // abs
  });
  for (let x = 14; x <= 20; x++) put(x, 25, "3"); // collarbone light
  for (let x = 24; x <= 31; x++) put(x, 25, "3");
  // himation sash across the chest, from the far shoulder to the near hip
  limb(33, 25, 15, 43, 2.5, 2.2, C, 0.1);

  // arms
  limb(10, 28, 6, 36, 3.8, 3.1, M); // near arm hangs a little forward
  limb(6, 36, 3, 42, 3.1, 2.3, M);
  ell(2.5, 43.5, 2.2, 2.8, M);
  limb(36, 28, 38, 35, 3.8, 3.1, M); // far arm bent up to the trident
  limb(38, 35, 40.5, 30, 2.8, 2.4, M);
  ell(40.5, 29, 2.6, 3.1, M); // fist

  // neck in shadow, head in profile looking left
  limb(22, 19, 22, 25, 2.9, 3.3, "0011");
  ell(25, 10.5, 6.2, 7.2, H, 0.1); // hair mass behind the face
  ell(20.5, 13, 5.4, 6.8, M); // face
  [[15, 11, "3"], [14, 12, "3"], [14, 13, "4"], [13, 14, "4"], [14, 14, "3"], [14, 15, "1"]].forEach(([x, y, v]) => put(x as number, y as number, v as string)); // nose
  [15, 16, 17, 18, 19].forEach((x) => put(x, 9, "0")); // heavy brow
  [16, 17].forEach((x) => put(x, 10, "0"));
  put(17, 11, "e");
  put(18, 11, "e");
  [15, 16].forEach((x) => put(x, 16, "2")); // lips
  [15, 16, 17, 18].forEach((x) => put(x, 15, "1")); // moustache
  [17, 18, 19].forEach((x) => put(x, 12, "3")); // cheekbone light
  // beard: flowing curls from the jaw, three lobes
  poly([[16, 17], [27, 17], [28, 23], [24, 31], [20, 29], [17, 24]], H, (x, y) => ((y + (x >> 1)) % 3 === 0 ? -1 : 0), 0.1);
  for (let y = 19; y <= 29; y += 3) for (let x = 18; x <= 27; x += 3) if (g[y]![x] !== ".") put(x, y + 1, "f"); // curl shadows
  for (let x = 19; x <= 30; x += 2) for (let y = 3; y <= 8; y++) if (g[y]![x] !== ".") put(x, y, y % 2 ? "g" : "i"); // hair strands

  // crown: a jewelled gold band that rides the brow, seven tapering rays with ball tips (the middle one tallest), a teal gem
  // between every pair of rays and a scroll of waves along the band. Rays and band are shaded gold, lit on the left.
  const band = (x: number) => Math.round(7 - (x - 15) * 0.1); // the band rises a little toward the back of the head
  for (let x = 15; x <= 31; x++) {
    put(x, band(x) - 1, "D"); // lit top rim
    put(x, band(x), x % 4 === 1 ? "A" : x % 2 ? "B" : "C"); // wave scroll
    put(x, band(x) + 1, "B");
    put(x, band(x) + 2, "A"); // shadowed lower rim
  }
  [17, 21, 25, 29].forEach((x) => {
    put(x, band(x), "Z");
    put(x, band(x) + 1, "z"); // gems
  });
  [[16, 3], [18.5, 4], [21.5, 5], [24, 7], [26.5, 5], [29, 4], [31, 3]].forEach(([x, h]) => {
    const by = band(x!) - 1;
    limb(x!, by, x!, by - h!, 1.2, 0.5, GOLD, 0);
    put(x!, by - h! - 1, "D"); // ball tip
    put(x!, by - h! - 2, "E");
  });
  put(24, band(24) + 1, "Z"); // the central gem, a little larger
  put(23, band(23) + 1, "Z");
  put(24, band(24), "Z");
  put(23, band(23), "Z");

  // the trident: ringed golden staff, crossbar, three barbed prongs, glints on the lit side
  limb(41, 4, 41, 77, 1.3, 1.3, GOLD, 0);
  for (let y = 16; y <= 70; y += 9) {
    put(40, y, "B");
    put(41, y, "B");
    put(42, y, "A"); // rings
  }
  limb(35, 11, 45, 11, 1.1, 1.1, GOLD, 0); // crossbar
  limb(35, 11, 35, 3, 1, 0.5, GOLD, 0);
  limb(45, 11, 45, 3, 1, 0.5, GOLD, 0);
  limb(41, 11, 41, 0, 1.1, 0.5, GOLD, 0);
  [[34, 4], [36, 4], [44, 4], [46, 4], [40, 2], [42, 2]].forEach(([x, y]) => put(x!, y!, "C")); // barbs
  [[41, 0], [35, 3], [45, 3], [40, 12], [40, 30], [40, 50]].forEach(([x, y]) => put(x!, y!, "E"));

  return g.map((row) => row.join(""));
}

const ramp = (letters: string, colors: string[]) => Object.fromEntries(colors.map((c, i) => [letters[i]!, c]));

/** The chosen statue: aged bronze gone teal-green with a gold trident and crown. */
export const POSEIDON = poseidon();
export const POSEIDON_PAL: Record<string, string> = {
  ...ramp("01234", ["#17413d", "#255e56", "#38796d", "#56a090", "#8fd0bd"]), // body
  ...ramp("fghij", ["#10302e", "#194540", "#23605a", "#2f7a72", "#43998d"]), // hair and beard
  ...ramp("pqrst", ["#1b3a3a", "#285250", "#386a66", "#4c847d", "#6ba399"]), // drape
  ...ramp("uvwxy", ["#242a2c", "#363f42", "#4a565a", "#62727a", "#7c8e96"]), // plinth
  ...ramp("ABCDE", ["#7a5410", "#b8861c", "#f0c640", "#ffe27a", "#fffbe0"]), // gold
  m: "#4f7d52",
  e: "#1a2328",
  Z: "#7fe8dc",
  z: "#2a9a90",
};
