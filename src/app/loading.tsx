export default function Loading() {
  return (
    <main className="relative min-h-screen px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <div className="mx-auto w-[min(1200px,calc(100%-0.5rem))] space-y-4 pt-20">
        <div className="h-20 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          ))}
        </div>
      </div>
    </main>
  );
}
