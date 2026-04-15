export default function DealLoading() {
  return (
    <main className="relative min-h-screen px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <div className="mx-auto w-[min(1200px,calc(100%-0.5rem))] space-y-4 pt-20">
        <div className="h-16 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          <div className="space-y-3">
            <div className="h-8 w-3/4 animate-pulse rounded-xl bg-white/5" />
            <div className="h-6 w-1/2 animate-pulse rounded-xl bg-white/5" />
            <div className="h-12 w-1/3 animate-pulse rounded-xl bg-white/5" />
            <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
          </div>
        </div>
        <div className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
      </div>
    </main>
  );
}
