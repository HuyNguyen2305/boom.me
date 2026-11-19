import { profile } from "@/content/site";

export function Hero() {
  return (
    <section id="top" data-dive-stop data-depth="0 m" className="dot-grid relative overflow-hidden bg-depth-0">
      <div aria-hidden className="hero-light absolute inset-0" />
      <div className="column relative flex flex-col gap-5 pt-10 pb-8 sm:pt-16 sm:pb-10">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-driftwood">On Surface</p>
        <h1 className="max-w-[14ch] font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
          {profile.shortName}, <br />
          <span className="bg-gradient-to-r from-teal to-kelp bg-clip-text text-transparent">{profile.tagline}</span>
        </h1>
        <p className="max-w-[65ch] text-lg text-mist">{profile.intro}</p>
        {/* the visible hint floats above the fish (canvas); this list is for screen readers */}
        <ul className="sr-only">
          <li>Down arrow: dive. Up arrow: rise.</li>
          <li>Left and right arrows: swim.</li>
          <li>E: open the project nearest the fish.</li>
        </ul>
        <p className="text-sm text-mist sm:hidden">Scroll to dive. Tap a project to open it.</p>
      </div>
    </section>
  );
}
