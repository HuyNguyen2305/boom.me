export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-7 items-center justify-center border border-teal/40 bg-reef px-1.5 py-0.5 font-mono text-xs text-foam">
      {children}
    </kbd>
  );
}
