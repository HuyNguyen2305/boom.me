import { projects } from "@/content/site";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "./Section";

export function Projects() {
  return (
    <Section id="projects" depth="−120 m" title="Projects" band="bg-depth-3" className="ripple-lines">
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.length === 0 ? (
          <EmptyState count={3} />
        ) : (
          projects.map((p, i) => (
            <article
              key={p.title}
              data-project={i}
              className={`flex flex-col gap-3 border border-teal/20 bg-reef/80 p-4 backdrop-blur-sm hover:border-teal/50 motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 ${i === 0 ? "sm:col-span-2" : ""}`}
            >
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={`${p.title} screenshot`} className="aspect-video w-full object-cover" />
              )}
              <h3 className="font-display text-lg font-bold">{p.title}</h3>
              <p className="text-sm text-mist">{p.description}</p>
              <ul className="flex flex-wrap gap-2">
                {p.tech.map((t) => <li key={t}><Chip>{t}</Chip></li>)}
              </ul>
              <button
                type="button"
                data-open-project={i}
                className="mt-auto self-start text-sm text-teal underline-offset-4 hover:underline"
              >
                View details <span aria-hidden className="hidden font-mono text-xs text-mist sm:inline">· press E</span>
              </button>
            </article>
          ))
        )}
      </div>
    </Section>
  );
}
