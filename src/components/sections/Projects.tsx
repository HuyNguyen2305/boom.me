import { projects } from "@/content/site";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "./Section";

const PER_LAYER = 2; // projects per layer: add a project to site.ts and a new layer appears at 3, 5, ...
const FROM_M = 120; // first Works layer depth
const FLOOR_M = 200; // Contact sea floor; Works layers spread evenly between FROM_M and here

type Item = (typeof projects)[number];

function Card({ p, i }: { p: Item; i: number }) {
  return (
    <article
      data-project={i}
      className="group relative flex cursor-pointer flex-col gap-2 border border-teal/30 bg-reef p-3 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:border-teal hover:shadow-[0_0_0_1px_var(--color-teal),0_0_18px_rgb(60_198_192/0.4)] data-[active]:border-teal data-[active]:shadow-[0_0_0_1px_var(--color-teal),0_0_18px_rgb(60_198_192/0.4)] has-[:focus-visible]:border-teal motion-safe:hover:-translate-y-0.5"
    >
      {p.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.image} alt={`${p.title} screenshot`} className="aspect-[2/1] w-full object-cover object-top" />
      )}
      <h3 className="font-display text-base font-bold">
        {/* the stretched ::after makes the whole card the click target */}
        <button type="button" data-open-project={i} className="text-left after:absolute after:inset-0">
          {p.title}
        </button>
      </h3>
      <p className="line-clamp-2 text-xs text-mist">{p.description}</p>
      <ul className="flex flex-wrap gap-1.5">
        {p.tech.map((t) => <li key={t}><Chip>{t}</Chip></li>)}
      </ul>
      <span
        aria-hidden
        className="pointer-events-none absolute -top-3 right-3 hidden items-center gap-1.5 border border-teal/50 bg-abyss/85 px-2 py-1 font-mono text-xs text-foam opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-data-[active]:opacity-100 sm:flex"
      >
        <kbd className="border border-teal/50 px-1 text-teal">E</kbd> View Project
      </span>
    </article>
  );
}

export function Projects() {
  if (projects.length === 0) {
    return (
      <Section id="works" depth={`−${FROM_M} m`} title="Works" band="bg-depth-3" className="ripple-lines">
        <div className="grid gap-3 sm:grid-cols-3"><EmptyState count={3} /></div>
      </Section>
    );
  }
  const layers = Array.from({ length: Math.ceil(projects.length / PER_LAYER) }, (_, k) => projects.slice(k * PER_LAYER, (k + 1) * PER_LAYER));
  return (
    <>
      {layers.map((group, k) => (
        <Section
          key={k}
          id={k ? `works-${k + 1}` : "works"}
          depth={`−${FROM_M + Math.round((k * (FLOOR_M - FROM_M)) / layers.length)} m`}
          title={k ? undefined : "Works"}
          label={k ? `Works, layer ${k + 1}` : undefined}
          band="bg-depth-3"
          className={`ripple-lines ${k ? "border-t border-teal/15" : ""}`}
          inner={k ? "gap-4 py-10 sm:py-12" : undefined}
        >
          {/* three columns keep the card size; the third stays free for the fish lane */}
          <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.map((p, j) => <Card key={p.title} p={p} i={k * PER_LAYER + j} />)}
          </div>
        </Section>
      ))}
    </>
  );
}
