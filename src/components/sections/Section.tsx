import type { ReactNode } from "react";

type Props = {
  id: string;
  depth: string;
  title: string;
  band: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, depth, title, band, className = "", children }: Props) {
  return (
    <section id={id} data-dive-stop data-depth={depth} className={`${band} scroll-mt-14 ${className}`}>
      <div className="column flex flex-col gap-8 py-16 sm:py-24">
        <header className="flex flex-col gap-3">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-driftwood">{depth}</p>
          <h2 className="font-display text-[2rem] font-bold tracking-[-0.02em]">{title}</h2>
        </header>
        {children}
      </div>
    </section>
  );
}
