import { useEffect, useState } from "react";

// 30-day campaign countdown, anchored to a fixed launch date so it doesn't
// reset on every visit. Update this once launch date is confirmed.
const LAUNCH_ISO = "2026-08-04T20:00:00+02:00"; // 30 days from build

function diff(target: number) {
  const now = Date.now();
  const d = Math.max(0, target - now);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

export function Countdown({ compact = false }: { compact?: boolean }) {
  const target = new Date(LAUNCH_ISO).getTime();
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const i = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(i);
  }, [target]);

  const items: Array<[string, number]> = [
    ["Days", t.days],
    ["Hrs", t.hours],
    ["Min", t.minutes],
    ["Sec", t.seconds],
  ];

  return (
    <div
      className={
        compact
          ? "flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-loud-yellow"
          : "flex flex-wrap items-end gap-3 sm:gap-5"
      }
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
