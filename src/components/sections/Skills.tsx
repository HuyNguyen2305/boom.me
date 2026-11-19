import { skills } from "@/content/site";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "./Section";

export function Skills() {
  return (
    <Section id="skills" depth="−40 m" title="Skills" band="bg-depth-1">
      <div className="grid gap-4 sm:grid-cols-3">
        {skills.length === 0 ? (
          <EmptyState count={3} />
        ) : (
          skills.map((g) => (
            <div key={g.name} className="flex flex-col gap-3 border border-teal/20 bg-reef/80 p-4">
              <h3 className="font-display text-lg font-bold">{g.name}</h3>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((s) => <li key={s}><Chip>{s}</Chip></li>)}
              </ul>
            </div>
          ))
        )}
      </div>
    </Section>
  );
}
