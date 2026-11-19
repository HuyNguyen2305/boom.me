export function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`border border-mist/60 px-2 py-0.5 font-mono text-xs ${className}`}>{children}</span>
  );
}
