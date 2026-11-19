"use client";

const STEP = 2; // boxes per click
const TWEEN = 320; // ms

/** Slides the sibling marquee by whole boxes by seeking its CSS animation, so the loop keeps running underneath. */
function shift(btn: HTMLElement, dir: 1 | -1) {
  const track = btn.closest(".skills-bleed")?.querySelector<HTMLElement>(".skills-marquee");
  const anim = track?.getAnimations()[0];
  const box = track?.querySelector<HTMLElement>("li:not(.skills-label)");
  if (!track || !anim || !box) return;
  const loopPx = track.scrollWidth / 2 + 8; // one copy plus half the 1rem gap, matching the keyframe
  const dur = Number(anim.effect?.getComputedTiming().duration);
  const delta = (dir * STEP * (box.offsetWidth + 16) * dur) / loopPx;
  const start = performance.now();
  let done = 0;
  const tick = (now: number) => {
    const p = Math.min((now - start) / TWEEN, 1);
    const eased = 1 - (1 - p) ** 3; // ease-out
    const t = Number(anim.currentTime) + (eased - done) * delta;
    anim.currentTime = ((t % dur) + dur) % dur; // wrap: the loop is seamless
    done = eased;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// bare thin chevrons: a generous invisible hit area (80x192px) around each one, no box; hover brightens and nudges the chevron the way it will move the row
const btn =
  "group/arrow absolute top-1/2 z-10 grid h-48 w-20 -translate-y-1/2 place-items-center text-teal/70 " +
  "opacity-0 transition-[opacity,color] duration-150 ease-out hover:text-teal " +
  "group-hover/bleed:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 motion-reduce:hidden";

function Chevron({ flip }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      width="16"
      height="64"
      viewBox="0 0 16 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`drop-shadow-[0_0_6px_var(--color-abyss)] transition-transform duration-150 ease-out group-active/arrow:scale-90 ${
        flip ? "rotate-180 group-hover/arrow:-translate-x-0.5" : "group-hover/arrow:translate-x-0.5"
      }`}
    >
      <path d="M3 2 13 32 3 62" />
    </svg>
  );
}

export function SkillArrows() {
  return (
    <>
      <button type="button" aria-label="Previous skills" onClick={(e) => shift(e.currentTarget, -1)} className={`${btn} left-0`}>
        <Chevron flip />
      </button>
      <button type="button" aria-label="Next skills" onClick={(e) => shift(e.currentTarget, 1)} className={`${btn} right-0`}>
        <Chevron />
      </button>
    </>
  );
}
