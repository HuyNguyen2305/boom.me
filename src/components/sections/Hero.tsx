import { profile } from "@/content/site";
import { Kbd } from "@/components/ui/Kbd";

export function Hero() {
  return (
    <section id="top" data-dive-stop data-depth="0 m" className="dot-grid relative overflow-hidden bg-depth-0">
      <div aria-hidden className="hero-light absolute inset-0" />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 sm:px-6 sm:py-24">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-driftwood">On Surface</p>
        <h1 className="max-w-[14ch] font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
          {profile.shortName}, <br />
          <span className="bg-gradient-to-r from-teal to-kelp bg-clip-text text-transparent">{profile.tagline}</span>
        </h1>
        <p className="max-w-[65ch] text-lg text-mist">{profile.intro}</p>
        <ul aria-label="How to control the fish" className="hidden flex-wrap gap-x-6 gap-y-3 text-sm text-mist sm:flex">
          <li className="flex items-center gap-2"><Kbd>↑</Kbd><Kbd>↓</Kbd> Dive and rise</li>
          <li className="flex items-center gap-2"><Kbd>←</Kbd><Kbd>→</Kbd> Swim</li>
          <li className="flex items-center gap-2"><Kbd>E</Kbd> Open a project</li>
        </ul>
        <p className="text-sm text-mist sm:hidden">Scroll to dive. Tap a project to open it.</p>
      </div>
    </section>
  );
}
