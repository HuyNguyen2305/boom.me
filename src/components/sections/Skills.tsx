import { skills } from "@/content/site";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkillArrows } from "@/components/ui/SkillArrows";
import { Section } from "./Section";

const box = "flex h-40 w-32 shrink-0 flex-col items-center justify-center gap-4 border border-teal/30 bg-reef sm:h-52 sm:w-44";

export function Skills() {
  return (
    <Section id="skills" depth="−40 m" title="Skills" band="bg-depth-2" className="overflow-x-clip">
      {skills.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-3"><EmptyState count={3} /></div>
      ) : (
        <div className="skills-bleed group/bleed">
              <div className="skills-fade">
          <ul className="skills-marquee" aria-label="Tools I use">
            {/* the list is rendered twice for a seamless loop; the copy is hidden from assistive tech */}
            {[0, 1].map((copy) =>
              skills.flatMap((g) => [
                <li key={`${copy}-${g.name}`} aria-hidden={copy ? true : undefined} className="skills-label">
                  {g.name}
                </li>,
                ...g.items.map((s) => (
                  <li key={`${copy}-${s.icon}`} className={box} title={`${s.name} · ${g.name}`} aria-hidden={copy ? true : undefined}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/skills/${s.icon}.svg`} alt="" width={80} height={80} className={`size-14 sm:size-20 ${s.detail ? "grayscale brightness-150" : "brightness-0 invert"}`} />
                    <span className="font-display text-sm font-semibold text-foam sm:text-base">{s.name}</span>
                  </li>
                )),
              ]),
            )}
          </ul>
              </div>
              <SkillArrows />
        </div>
      )}
    </Section>
  );
}
