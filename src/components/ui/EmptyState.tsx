export function EmptyState({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex min-h-32 items-center justify-center border border-dashed border-mist/30 text-mist">
          Coming soon
        </div>
      ))}
    </>
  );
}
