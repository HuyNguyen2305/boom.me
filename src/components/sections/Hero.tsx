import { profile } from "@/content/site";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section id="top" data-dive-stop data-depth="0 m" className="dot-grid relative overflow-hidden bg-depth-0">
      <div aria-hidden className="hero-light absolute inset-0" />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 py-24 sm:px-6 sm:py-32">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-driftwood">0 m · surface</p>
        <h1 className="max-w-[14ch] font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
          {profile.name.split(" ").slice(-2).join(" ")}, <br />
          <span className="bg-gradient-to-r from-teal to-kelp bg-clip-text text-transparent">{profile.tagline}</span>
        </h1>
        <p className="max-w-[65ch] text-lg text-mist">{profile.intro}</p>
        <div className="flex flex-wrap gap-3">
          <Button href="#projects">Start the dive</Button>
          <Button href={profile.github} variant="secondary">GitHub</Button>
        </div>
      </div>
    </section>
  );
}
