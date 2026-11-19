/** Draws a string-art sprite; each non-"." char maps to a colour. */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  colors: Record<string, string>,
  x: number,
  y: number,
  px: number,
) {
  rows.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      const c = colors[row[rx]!];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x + rx * px), Math.round(y + ry * px), px, px);
    }
  });
}
