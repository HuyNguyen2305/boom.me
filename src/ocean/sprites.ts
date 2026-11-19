// 12x7 fish: T teal body, K kelp tail, E eye, . empty
const FISH = [
  "....TTTT....",
  "..TTTTTTTT.K",
  ".TTTTTTTTTKK",
  "TTETTTTTTTKK",
  ".TTTTTTTTTKK",
  "..TTTTTTTT.K",
  "....TTTT....",
];
const COLORS: Record<string, string> = { T: "#3cc6c0", K: "#7fbf7a", E: "#071c24" };

export const FISH_W = 12;
export const FISH_H = 7;

export function drawFish(ctx: CanvasRenderingContext2D, flap: boolean) {
  FISH.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = COLORS[row[x]!];
      if (!c) continue;
      // tail columns shift one pixel up/down to flap
      const dy = row[x] === "K" ? (flap ? -1 : 1) : 0;
      ctx.fillStyle = c;
      ctx.fillRect(x, y + dy, 1, 1);
    }
  });
}
