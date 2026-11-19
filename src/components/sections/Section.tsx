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
      <div className="mx-auto flex w-full flex-col gap-8 px-4 py-16 sm:px-6 sm:py-24 lg:pr-48 lg:pl-12">
        <header className="flex flex-col gap-3">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-driftwood">{depth}</p>
          <h2 className="font-display text-[2rem] font-bold tracking-[-0.02em]">{title}</h2>
        </header>
        {children}
      </div>
    </section>
  );
}
