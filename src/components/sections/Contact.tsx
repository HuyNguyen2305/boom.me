import { profile } from "@/content/site";
import { BackToSurface } from "@/components/ui/BackToSurface";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Section } from "./Section";

export function Contact() {
  return (
    <Section id="contact" depth="−200 m · sea floor" title="Contact" band="bg-depth-4" className="relative pb-72 sm:pb-80">
      <a href={`mailto:${profile.email}`} className="break-all font-display text-3xl font-bold sm:text-5xl">
        {profile.email}
      </a>
      <div className="flex flex-wrap items-center gap-4 text-teal">
        <CopyEmail email={profile.email} />
        <a href={profile.github}>GitHub</a>
        <a href={profile.linkedin}>LinkedIn</a>
      </div>
      {/* The sign the pixel diver holds (drawn in ocean/entities/signdiver.ts): this link sits exactly over it.
          Offsets: sand 44px − 10 + (64 − 17 rows) × 3px up from the floor; the pole is 12 cells × 3px right of the body centre. */}
      <BackToSurface className="absolute bottom-[175px] left-[calc(62%+35px)] z-10 h-[51px] w-[108px] cursor-pointer rounded-sm max-sm:left-[calc(50%+35px)]" />
    </Section>
  );
}
