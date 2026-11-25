import { profile } from "@/content/site";
import { BackToSurface } from "@/components/ui/BackToSurface";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Section } from "./Section";

// same look as the Copy email button
const btn = "border-[1.5px] border-teal/50 px-4 py-2.5 text-teal hover:border-teal";

export function Contact() {
  return (
    // the wrapper, not the Section's padded column, is the link's positioning box: the sign is drawn against the section bottom and viewport width
    <div className="relative">
    <Section id="contact" depth="−200 m · sea floor" title="Contact" band="bg-depth-4" className="pb-44 sm:pb-44">
      {/* one line at any width: the size follows the column width (about 16.5 em of text), capped at 3rem */}
      <a href={`mailto:${profile.email}`} className="whitespace-nowrap font-display text-[min(3rem,calc((100vw-2rem)/16.5))] font-bold sm:text-[min(3rem,calc((100vw-3rem)/16.5))]">
        {profile.email}
      </a>
      <div className="flex flex-wrap items-center gap-4 text-teal">
        <CopyEmail email={profile.email} />
        <a href={profile.github} className={btn} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={profile.linkedin} className={btn} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </Section>
      {/* The sign the pixel diver holds (drawn in ocean/entities/signdiver.ts): this link sits exactly over it.
          Offsets: sand 44px − 10 + (56 − 15 rows) × 3px up from the floor; the pole is 11 cells × 3px right of the body centre. */}
      <BackToSurface className="absolute bottom-[157px] left-[calc(62%+32px)] h-[45px] w-[108px] cursor-pointer rounded-sm z-30 max-sm:left-[calc(50%+32px)]" />
    </div>
  );
}
