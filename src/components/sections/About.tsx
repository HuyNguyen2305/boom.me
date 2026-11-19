import { profile } from "@/content/site";
import { Chip } from "@/components/ui/Chip";
import { Section } from "./Section";

export function About({ className }: { className?: string }) {
  return (
    <Section id="about" depth="−10 m" title="About" band="bg-depth-1" className={className} inner="gap-4 py-6 sm:py-8">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,11rem)_1fr]">
        <div className="flex size-30 items-center justify-center border border-teal/20 bg-reef p-3 sm:aspect-square sm:size-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/avatar.png"
            alt={`Pixel-art portrait of ${profile.shortName}`}
            width={476}
            height={838}
            className="size-full object-contain [image-rendering:pixelated]"
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="max-w-[44ch] font-display text-xl font-bold leading-tight tracking-[-0.02em] sm:text-2xl">{profile.bio}</p>
          <ul className="grid gap-px border border-teal/20 bg-teal/20 sm:grid-cols-2 lg:grid-cols-5">
            {profile.highlights.map((h) => (
              <li key={h.label} className="flex flex-col gap-0.5 bg-reef px-4 py-3 sm:first:col-span-2 lg:first:col-span-1">
                <span className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-teal">{h.label}</span>
                <span className="text-sm text-mist">{h.text}</span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-2">
            <li><Chip>{profile.location}</Chip></li>
            {profile.openToWork && <li><Chip className="border-kelp/50 text-kelp">Open to work</Chip></li>}
          </ul>
        </div>
      </div>
    </Section>
  );
}
