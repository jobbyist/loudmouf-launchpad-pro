import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

const CAP = 2000;
const STORAGE_KEY = "loudmouf-early-access-claimed";
// 30-day soft launch window
const LAUNCH_TS_KEY = "loudmouf-launch-ts";

function getLaunchTs() {
  if (typeof window === "undefined") return Date.now() + 30 * 24 * 3600 * 1000;
  const stored = window.localStorage.getItem(LAUNCH_TS_KEY);
  if (stored) return Number(stored);
  const ts = Date.now() + 30 * 24 * 3600 * 1000;
  window.localStorage.setItem(LAUNCH_TS_KEY, String(ts));
  return ts;
}

function useClaimed() {
  const [claimed, setClaimed] = useState(0);
  useEffect(() => {
    const read = () => {
      const v = Number(window.localStorage.getItem(STORAGE_KEY) || "137");
      setClaimed(Math.min(CAP, Math.max(0, v)));
    };
    read();
    const on = () => read();
    window.addEventListener("storage", on);
    window.addEventListener("loudmouf:early-access-claimed", on);
    return () => {
      window.removeEventListener("storage", on);
      window.removeEventListener("loudmouf:early-access-claimed", on);
    };
  }, []);
  return claimed;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function EarlyAccessBar() {
  const claimed = useClaimed();
  const [remaining, setRemaining] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = getLaunchTs();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setRemaining({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff / 3_600_000) % 24),
        m: Math.floor((diff / 60_000) % 60),
        s: Math.floor((diff / 1_000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const seatsLeft = CAP - claimed;
  const pct = (claimed / CAP) * 100;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-6xl m-3 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="grid gap-3 p-3 sm:p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.22em]">
              <Sparkles className="h-3.5 w-3.5 text-loud-yellow" />
              <span className="text-gradient-loud font-semibold">Early Access · 25% Off</span>
              <span className="text-white/50">· {seatsLeft.toLocaleString()} of {CAP.toLocaleString()} spots left</span>
            </div>
            <div className="mt-2">
              <Progress value={pct} className="h-1.5 bg-white/10" />
            </div>
            <p className="mt-1.5 text-[10px] text-white/50 hidden sm:block">
              Founding member perks · lifetime priority allocation · exclusive drop invites
            </p>
          </div>
          <div className="flex items-center gap-3 justify-between md:justify-end">
            <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm text-white tabular-nums">
              <span className="px-2 py-1 rounded bg-white/5">{pad(remaining.d)}d</span>
              <span className="px-2 py-1 rounded bg-white/5">{pad(remaining.h)}h</span>
              <span className="px-2 py-1 rounded bg-white/5">{pad(remaining.m)}m</span>
              <span className="px-2 py-1 rounded bg-white/5 hidden sm:inline-block">{pad(remaining.s)}s</span>
            </div>
            <a
              href="#preorder"
              className="cta-gradient inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-black shadow-lg"
            >
              Get Early Access
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Call this after a confirmed purchase to advance the counter. */
export function incrementEarlyAccessClaimed(by = 1) {
  if (typeof window === "undefined") return;
  const cur = Number(window.localStorage.getItem(STORAGE_KEY) || "137");
  const next = Math.min(CAP, cur + by);
  window.localStorage.setItem(STORAGE_KEY, String(next));
  window.dispatchEvent(new Event("loudmouf:early-access-claimed"));
}
