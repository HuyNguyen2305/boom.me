export type Stop = { top: number; depth: number };

// "−10 m" or "−200 m · sea floor" -> 10 / 200 (metres below the surface)
const parseDepth = (s: string) => Math.abs(parseFloat(s.replace("−", "-")));

export function readStops(): Stop[] {
  return [...document.querySelectorAll<HTMLElement>("[data-dive-stop]")].map((el) => ({
    top: el.getBoundingClientRect().top + scrollY,
    depth: parseDepth(el.dataset.depth ?? "0"),
  }));
}

/** Depth in metres at the vertical middle of the viewport, interpolated between stops. */
export function depthAt(stops: Stop[], y: number): number {
  const first = stops[0];
  const lastStop = stops[stops.length - 1];
  if (!first || !lastStop) return 0;
  if (y <= first.top) return first.depth;
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1]!;
    const b = stops[i]!;
    if (y <= b.top) return a.depth + ((y - a.top) / (b.top - a.top)) * (b.depth - a.depth);
  }
  return lastStop.depth;
}
