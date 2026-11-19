import type { ReactNode } from "react";

type Props = {
  id: string;
  depth: string;
  title: string;
  band: string;
  className?: string;
  /** replaces the default vertical padding and gap of the inner column */
  inner?: string;
  children: ReactNode;
};

export function Section({ id, depth, title, band, className = "", inner = "gap-8 py-12 sm:py-16", children }: Props) {
  return (
    <section id={id} data-dive-stop data-depth={depth} className={`${band} scroll-mt-14 ${className}`}>
      <div className={`column flex w-full flex-col ${inner}`}>
        <header className="flex flex-col gap-3">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-driftwood">{depth}</p>
          <h2 className="font-display text-[2rem] font-bold tracking-[-0.02em]">{title}</h2>
        </header>
        {children}
      </div>
    </section>
  );
}
