"use client";

/** A link laid over the diver's sign: scrolls all the way up, to the sky, not just to the hero. */
export function BackToSurface({ className }: { className: string }) {
  return (
    <a
      href="#top"
      aria-label="Back to the surface"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return scrollTo({ top: 0, behavior: "instant" });
        // Hand-rolled instead of behavior:"smooth": over this long a page the native smooth scroll sat still ~2s before moving.
        const from = scrollY;
        const ms = Math.min(1400, 500 + from / 4);
        const t0 = performance.now();
        const step = (now: number) => {
          const k = Math.min(1, (now - t0) / ms);
          scrollTo({ top: from * (1 - k) ** 3, behavior: "instant" });
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }}
    />
  );
}
