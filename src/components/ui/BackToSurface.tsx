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
        const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
        scrollTo({ top: 0, behavior: calm ? "instant" : "smooth" });
      }}
    />
  );
}
