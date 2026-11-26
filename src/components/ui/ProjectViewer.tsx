"use client";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/types";
import { fishXBus, fishYBus } from "@/ocean/events";
import { Chip } from "./Chip";

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/** The project card the fish is touching (its centre within PAD px of the card), or null. */
const PAD = 20;
function cardNearFish(): number | null {
  const x = fishXBus.get();
  const y = fishYBus.get();
  if (!x && !y) return null; // engine has not drawn a frame yet
  let hit: number | null = null;
  document.querySelectorAll<HTMLElement>("[data-project]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (x >= r.left - PAD && x <= r.right + PAD && y >= r.top - PAD && y <= r.bottom + PAD) hit = Number(el.dataset.project);
  });
  return hit;
}

/** Screenshot viewer: big image, caption, thumbnails. Left/right arrows flip; mounted only while the window is open. */
function Gallery({ shots, title }: { shots: NonNullable<Project["gallery"]>; title: string }) {
  const [{ i, dir }, setView] = useState({ i: 0, dir: 1 });
  const go = (d: number) => setView((v) => ({ i: (v.i + d + shots.length) % shots.length, dir: d }));
  const jump = (n: number) => setView((v) => ({ i: n, dir: n > v.i ? 1 : -1 }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      go(e.key === "ArrowLeft" ? -1 : 1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shots.length]);

  const shot = shots[i]!; // i is always in range: go() wraps it
  const btn = "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center border border-teal/40 bg-reef/80 text-teal active:scale-[0.97]";
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative flex h-[clamp(14rem,56vh,32rem)] items-center justify-center overflow-hidden border border-teal/20 bg-depth-3 p-3 sm:p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={shot.src}
          src={shot.src}
          alt={`${title}: ${shot.caption}`}
          style={{ "--from": dir > 0 ? "2.5rem" : "-2.5rem" } as React.CSSProperties}
          className="shot-in max-h-full max-w-full border border-teal/20 object-contain"
        />
        <button type="button" aria-label="Previous screenshot" onClick={() => go(-1)} className={`${btn} left-2`}>‹</button>
        <button type="button" aria-label="Next screenshot" onClick={() => go(1)} className={`${btn} right-2`}>›</button>
      </div>
      <figcaption className="flex items-baseline justify-between gap-4 text-sm text-mist" aria-live="polite">
        <span>{shot.caption}</span>
        <span className="shrink-0 font-mono text-xs">{i + 1}/{shots.length}</span>
      </figcaption>
      <ul className="flex gap-2 overflow-x-auto pb-1">
        {shots.map((s, n) => (
          <li key={s.src} className="shrink-0">
            <button
              type="button"
              onClick={() => jump(n)}
              aria-label={`Show screenshot ${n + 1}`}
              aria-current={n === i}
              className={`block h-14 w-20 border bg-depth-3 ${n === i ? "border-teal" : "border-teal/20 opacity-70 hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt="" loading="lazy" className="size-full object-contain p-0.5" />
            </button>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function ProjectViewer({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const byKeyboard = useRef(false); // opened with Enter/Space on a title: keep focus there after closing
  const [open, setOpen] = useState<number | null>(null);
  const p = open === null ? null : projects[open];

  useEffect(() => {
    const dlg = ref.current!;
    if (open !== null && !dlg.open) {
      dlg.showModal();
      // the window grows out of (and shrinks back into) the card it was opened from; the dialog is centred, so its box is known without reading a transformed rect
      const card = document.querySelector<HTMLElement>(`[data-project="${open}"]`)?.getBoundingClientRect();
      if (card) {
        const clamp = (v: number, max: number) => Math.min(Math.max(v, 0), max);
        const ox = clamp(card.left + card.width / 2, innerWidth) - (innerWidth - dlg.offsetWidth) / 2;
        const oy = clamp(card.top + card.height / 2, innerHeight) - (innerHeight - dlg.offsetHeight) / 2;
        dlg.style.transformOrigin = `${ox}px ${oy}px`;
      }
    }
    if (open === null && dlg.open) dlg.close();
  }, [open]);

  // Mark the card the fish is next to; Projects styles [data-active] as the glow + "E View Project" hint.
  useEffect(() => {
    let last: number | null = null;
    return fishYBus.subscribe(() => {
      const i = cardNearFish();
      if (i === last) return;
      last = i;
      document.querySelectorAll<HTMLElement>("[data-project]").forEach((el) => {
        el.toggleAttribute("data-active", Number(el.dataset.project) === i);
      });
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "e" || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
      if (ref.current?.open) return;
      const hovered = document.querySelector<HTMLElement>("[data-project]:hover");
      const i = hovered ? Number(hovered.dataset.project) : cardNearFish();
      if (i !== null) { byKeyboard.current = false; setOpen(i); }
    };
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-open-project]");
      if (btn) { byKeyboard.current = e.detail === 0; setOpen(Number(btn.dataset.openProject)); }
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
        onClose={() => {
          setOpen(null);
          // the browser hands focus back to the card's title; left there it shows a focus ring and glow as soon as an arrow key steers the fish
          const f = document.activeElement;
          if (!byKeyboard.current && f instanceof HTMLElement && f.closest("[data-project]")) f.blur();
        }}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        aria-labelledby="project-title"
        className="project m-auto max-h-[92vh] w-[min(92vw,52rem)] overflow-y-auto border border-teal/30 bg-reef p-0 text-foam"
      >
        {p && (
          <div className="project-body flex flex-col gap-4 p-6">
            <div className="flex items-start gap-3">
              <h3 id="project-title" className="mr-auto font-display text-2xl font-bold tracking-[-0.02em]">{p.title}</h3>
              {(p.live || p.repo) && (
                <a
                  href={p.live ?? p.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 shrink-0 items-center gap-2 border border-teal bg-teal px-4 font-display text-sm font-bold text-reef transition-[box-shadow,transform] duration-150 ease-out hover:shadow-[0_0_14px_rgb(60_198_192/0.5)] active:scale-[0.97]"
                >
                  Open Project
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9" />
                  </svg>
                </a>
              )}
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close project"
                className="grid size-10 shrink-0 place-items-center border border-teal/40 text-teal transition-[border-color,box-shadow,transform] duration-150 ease-out hover:border-teal hover:shadow-[0_0_0_1px_var(--color-teal),0_0_14px_rgb(60_198_192/0.45)] focus-visible:border-teal active:scale-[0.97]"
              >
                <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>
            {p.gallery?.length ? (
              <Gallery key={p.title} shots={p.gallery} title={p.title} />
            ) : (
              <div className="flex aspect-video items-center justify-center border border-teal/20 bg-depth-3 font-display text-4xl font-extrabold text-teal/60">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={`${p.title} screenshot`} className="size-full object-cover" />
              ) : (
                <span aria-hidden>{p.title.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            )}
            <p className="leading-[1.65]">{p.details}</p>
            <h4 className="font-display text-sm font-bold uppercase tracking-[0.08em] text-teal">My part</h4>
            <ul className="-mt-2 list-disc space-y-1 pl-5 text-sm text-mist">
              {p.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
            <ul className="flex flex-wrap gap-2">
              {p.tech.map((t) => <li key={t}><Chip>{t}</Chip></li>)}
            </ul>
            {p.live && p.repo && (
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className="self-start text-sm text-teal underline-offset-4 hover:underline">
                Source code
              </a>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
