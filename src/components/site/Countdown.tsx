import { useEffect, useState } from "react";
import { diffToLaunch, LAUNCH_TS } from "@/lib/launch";

/**
 * Drop 001 countdown. Anchored to LAUNCH_TS in `src/lib/launch.ts`
 * so the sticky EarlyAccessBar and hero countdown stay in sync.
 *
 * Renders zeroes during SSR / first paint to avoid hydration mismatches
 * (Date.now() differs between server + client), then updates every second.
 */
const ZERO = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function Countdown({ compact = false }: { compact?: boolean }) {
  const [t, setT] = useState(ZERO);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setT(diffToLaunch());
    const i = setInterval(() => setT(diffToLaunch()), 1000);
    return () => clearInterval(i);
  }, []);

  const items: Array<[string, number]> = [
    ["Days", t.days],
    ["Hrs", t.hours],
    ["Min", t.minutes],
    ["Sec", t.seconds],
  ];

  return (
    <div
      suppressHydrationWarning
      className={
        compact
          ? "flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-loud-yellow"
          : "flex flex-wrap items-end gap-3 sm:gap-5"
      }
      data-launch-ts={LAUNCH_TS}
      data-mounted={mounted}
    >
      {items.map(([label, val]) => (
        <div
          key={label}
          className={
            compact
              ? "flex items-baseline gap-1"
              : "glass rounded-2xl px-4 py-3 sm:px-6 sm:py-4 min-w-[72px] sm:min-w-[92px] text-center"
          }
        >
          <div
            className={
              compact
                ? "text-loud-yellow font-semibold"
                : "font-display text-4xl sm:text-5xl md:text-6xl leading-none text-white tabular-nums"
            }
          >
            {String(val).padStart(2, "0")}
          </div>
          <div
            className={
              compact
                ? "text-white/60"
                : "mt-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/60"
            }
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
