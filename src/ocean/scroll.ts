export type Stop = { top: number; depth: number };

// "−10 m" or "−200 m · sea floor" -> 10 / 200 (metres below the surface)
const parseDepth = (s: string) => Math.abs(parseFloat(s.replace("−", "-")));

const stopEls = () => [...document.querySelectorAll<HTMLElement>("[data-dive-stop]")];

export function readStops(): Stop[] {
  return stopEls().map((el) => ({
    top: el.getBoundingClientRect().top + scrollY,
    depth: parseDepth(el.dataset.depth ?? "0"),
  }));
}

/** Document y of the water surface: the bottom edge of the sky block. */
export function readSurface(): number {
  const sky = document.querySelector("[data-surface]");
  return sky ? sky.getBoundingClientRect().bottom + scrollY : 0;
}

/** Document y of the bottom of the last stop (the sea floor). */
export function readFloor(): number {
  const last = stopEls().at(-1);
  return last ? last.getBoundingClientRect().bottom + scrollY : document.documentElement.scrollHeight;
}

/** Depth in metres at document y, interpolated between stops. */
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
