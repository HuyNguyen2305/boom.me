import { profile } from "@/content/site";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Section } from "./Section";

export function Contact() {
  return (
    <Section id="contact" depth="−200 m · sea floor" title="Contact" band="bg-depth-4">
      <a href={`mailto:${profile.email}`} className="break-all font-display text-3xl font-bold sm:text-5xl">
        {profile.email}
      </a>
      <div className="flex flex-wrap items-center gap-4 text-teal">
        <CopyEmail email={profile.email} />
        <a href={profile.github}>GitHub</a>
        <a href={profile.linkedin}>LinkedIn</a>
        <a href="#top" className="ml-auto text-mist">Back to surface ↑</a>
      </div>
    </Section>
  );
}
