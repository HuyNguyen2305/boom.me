import { profile } from "@/content/site";
import { Chip } from "@/components/ui/Chip";
import { Section } from "./Section";

export function About() {
  return (
    <Section id="about" depth="−10 m" title="About" band="bg-depth-1">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,13rem)_1fr]">
        <div
          aria-hidden
          className="flex size-30 items-center justify-center border border-teal/20 bg-reef font-display text-4xl font-extrabold text-teal sm:aspect-square sm:size-auto"
        >
          {profile.initials}
        </div>
        <div className="flex flex-col gap-4">
          <p className="max-w-[65ch] leading-[1.65]">{profile.bio}</p>
          <ul className="flex flex-wrap gap-2">
            <li><Chip>{profile.location}</Chip></li>
            <li><Chip>{profile.role}</Chip></li>
            {profile.openToWork && <li><Chip className="border-kelp/50 text-kelp">Open to work</Chip></li>}
          </ul>
        </div>
      </div>
    </Section>
  );
}
