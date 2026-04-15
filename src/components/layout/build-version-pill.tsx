/** Build-time env from `next.config.ts` (Vercel/GitHub SHA when available). */
export function BuildVersionPill() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "v0.1 beta";
  const buildId = process.env.NEXT_PUBLIC_BUILD_ID?.trim() ?? "";

  return (
    <div
      className="pointer-events-none fixed right-3 top-3 z-[60] select-none rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white/80 shadow-lg backdrop-blur-md dark:bg-black/55 sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[11px]"
      aria-label={`Sürüm ${version}${buildId ? `, derleme ${buildId}` : ""}`}
    >
      <span className="text-white/95">{version}</span>
      {buildId ? <span className="ml-1.5 font-mono text-white/55 normal-case">· {buildId}</span> : null}
    </div>
  );
}
