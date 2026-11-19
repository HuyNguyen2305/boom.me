"use client";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/types";
import { Chip } from "./Chip";

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/** The project card nearest the fish (42% down the screen) that is on screen, or null. */
function cardNearFish(): number | null {
  const band = innerHeight * 0.42;
  let best: { i: number; d: number } | null = null;
  document.querySelectorAll<HTMLElement>("[data-project]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const d = band >= r.top && band <= r.bottom ? 0 : Math.min(Math.abs(band - r.top), Math.abs(band - r.bottom));
    if (!best || d < best.d) best = { i: Number(el.dataset.project), d };
  });
  return best ? (best as { i: number }).i : null;
}

export function ProjectViewer({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const p = open === null ? null : projects[open];

  useEffect(() => {
    const dlg = ref.current!;
    if (open !== null && !dlg.open) dlg.showModal();
    if (open === null && dlg.open) dlg.close();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "e" || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
      if (ref.current?.open) return;
      const i = cardNearFish();
      if (i !== null) setOpen(i);
    };
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-open-project]");
      if (btn) setOpen(Number(btn.dataset.openProject));
    };
    addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <>
      <dialog
        ref={ref}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        aria-labelledby="project-title"
        className="project m-auto w-[min(92vw,40rem)] border border-teal/30 bg-reef p-0 text-foam"
      >
        {p && (
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 id="project-title" className="font-display text-2xl font-bold tracking-[-0.02em]">{p.title}</h3>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="border border-teal/40 px-2 py-1 font-mono text-xs text-teal active:scale-[0.97]"
              >
                Close · Esc
              </button>
            </div>
            <div className="flex aspect-video items-center justify-center border border-teal/20 bg-depth-3 font-display text-4xl font-extrabold text-teal/60">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={`${p.title} screenshot`} className="size-full object-cover" />
              ) : (
                <span aria-hidden>{p.title.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <p className="leading-[1.65]">{p.details}</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-mist">
              {p.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
            <ul className="flex flex-wrap gap-2">
              {p.tech.map((t) => <li key={t}><Chip>{t}</Chip></li>)}
            </ul>
            {(p.repo || p.live) && (
              <div className="flex gap-4 text-sm text-teal">
                {p.repo && <a href={p.repo}>Repo</a>}
                {p.live && <a href={p.live}>Live</a>}
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
