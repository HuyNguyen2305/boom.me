const cache = new WeakMap<string[], Map<string, HTMLCanvasElement>>();

/** Renders a string-art sprite (one canvas pixel per cell) once; non-"." chars map to colours. */
function spriteCanvas(rows: string[], colors: Record<string, string>) {
  const key = Object.values(colors).join();
  let byColors = cache.get(rows);
  if (!byColors) cache.set(rows, (byColors = new Map()));
  let c = byColors.get(key);
  if (!c) {
    c = document.createElement("canvas");
    c.width = Math.max(...rows.map((r) => r.length));
    c.height = rows.length;
    const g = c.getContext("2d")!;
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const col = colors[row[x]!];
        if (!col) continue;
        g.fillStyle = col;
        g.fillRect(x, y, 1, 1);
      }
    });
    byColors.set(key, c);
  }
  return c;
}

/**
 * Draws a sprite scaled by px. Blitting one pre-rendered bitmap (nearest neighbour) instead of
 * one fillRect per cell avoids hairline gaps between pixels at fractional device scales.
 */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  colors: Record<string, string>,
  x: number,
  y: number,
  px: number,
) {
  const c = spriteCanvas(rows, colors);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(c, Math.round(x), Math.round(y), c.width * px, c.height * px);
}
