import { profile } from "@/content/site";
import { Kbd } from "@/components/ui/Kbd";

/**
 * The hero is the sky: a short shore on the left with a billboard on it. Its bottom edge is the
 * water surface (data-surface); the engine draws the sun, clouds, palms, boat and buoy around it.
 */
export function Hero() {
  return (
    <section
      id="top"
      data-dive-stop
      data-surface
      data-depth="0 m"
      className="relative h-[380px] bg-gradient-to-b from-sky-top to-sky-bottom sm:h-[470px]"
    >
      <div
        aria-hidden
        data-shore
        className="absolute bottom-0 left-0 h-12 w-full bg-[linear-gradient(#5bbf6a_0_8px,#46a85a_8px_12px,#e8c98a_12px_36px,#d9b873_36px)] sm:w-[min(40rem,70vw)] sm:[clip-path:polygon(0_0,91%_0,91%_25%,94%_25%,94%_50%,97%_50%,97%_75%,100%_75%,100%_100%,0_100%)]"
      />
      <div
        data-billboard
        className="absolute bottom-[44px] left-4 right-4 z-[15] sm:right-auto sm:left-6 sm:w-[min(26rem,46vw)] lg:left-12"
      >
        <div className="flex flex-col gap-3 border-4 border-[#8a5a33] bg-abyss px-5 py-4 sm:px-6 sm:py-5">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-driftwood">On Surface</p>
          <div>
            <p className="font-display text-lg font-semibold text-mist">{profile.shortName}</p>
            <h1 className="max-w-[9ch] font-display text-[clamp(2rem,4.6vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              {profile.role}
            </h1>
          </div>
          <p className="max-w-[65ch] text-sm text-mist">{profile.intro}</p>
          <ul aria-label="How to control the fish" className="hidden flex-wrap gap-x-5 gap-y-2 text-xs text-mist sm:flex">
            <li className="flex items-center gap-2"><Kbd>↑</Kbd><Kbd>↓</Kbd> Dive and rise</li>
            <li className="flex items-center gap-2"><Kbd>←</Kbd><Kbd>→</Kbd> Swim</li>
            <li className="flex items-center gap-2"><Kbd>E</Kbd> Open a project</li>
          </ul>
          <p className="text-xs text-mist sm:hidden">Scroll to dive. Tap a project to open it.</p>
        </div>
        <div aria-hidden className="flex justify-around px-10">
          <span className="h-6 w-2 bg-[#6e4526]" />
          <span className="h-6 w-2 bg-[#6e4526]" />
        </div>
      </div>
    </section>
  );
}
