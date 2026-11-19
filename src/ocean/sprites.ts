// 24x14 fish, head on the left. D back fin, T body, L belly, g gill, K/k tail, W/E eye
const FISH = [
  ".......DDDDDD",
  ".....DDDDDDDDDD.....K",
  "...TTTTTTTTTTTTT...KKK",
  "..TTTTTTTTTTTTTTT.KKKK",
  ".TTTWETTTTTTTTTTTTKKKKk",
  ".TTTEETTgTTTTTTTTTKKKk",
  "TTTTTTTTgTTTTTTTTTKKk",
  "TTLLTTTTgTTTTTTTTTKKKk",
  ".LLLLLLLLLLLLLLLLKKKKk",
  ".LLLLLLLLLLLLLLLLKKKk",
  "..LLLLLLLLLLLLLLL.KKKK",
  "...LLLLLLLLLLLLL...KKK",
  ".....TTTTTTTTT.....K",
  ".......TTTTT",
];
const COLORS: Record<string, string> = {
  D: "#2a9a95", T: "#3cc6c0", L: "#8fe3df", g: "#2a9a95",
  K: "#7fbf7a", k: "#5a9a57", E: "#071c24", W: "#ffffff",
};

export const FISH_W = 24;
export const FISH_H = 14;

export function drawFish(ctx: CanvasRenderingContext2D, flap: boolean) {
  FISH.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = COLORS[row[x]!];
      if (!c) continue;
      // tail cells shift one pixel up/down to flap
      const dy = row[x] === "K" || row[x] === "k" ? (flap ? -1 : 1) : 0;
      ctx.fillStyle = c;
      ctx.fillRect(x, y + dy, 1, 1);
    }
  });
}
