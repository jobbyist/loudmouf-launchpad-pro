import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";
import {
  currentClaimed,
  diffToLaunch,
  MEMBER_CAP,
  MEMBERS_CLAIMED_BASELINE,
} from "@/lib/launch";

const STORAGE_KEY = "loudmouf-early-access-claimed";

function useClaimed() {
  const [claimed, setClaimed] = useState(MEMBERS_CLAIMED_BASELINE);
  useEffect(() => {
    const read = () => {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const stored = raw != null ? Number(raw) : MEMBERS_CLAIMED_BASELINE;
      setClaimed(currentClaimed(stored));
    };
    read();
    const id = setInterval(read, 60_000); // refresh past 5am SAST rollover
    const on = () => read();
    window.addEventListener("storage", on);
    window.addEventListener("loudmouf:early-access-claimed", on);
    return () => {
      clearInterval(id);
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
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRemaining(diffToLaunch());
    const id = setInterval(() => setRemaining(diffToLaunch()), 1000);
    return () => clearInterval(id);
  }, []);

  const seatsLeft = MEMBER_CAP - claimed;
  const pct = (claimed / MEMBER_CAP) * 100;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-6xl m-3 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="grid gap-3 p-3 sm:p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.22em]">
              <Sparkles className="h-3.5 w-3.5 text-loud-yellow" />
              <span className="text-gradient-loud font-semibold">Early Access · 25% Off</span>
              <span className="text-white/50">· 1634 out of 2000 spots left</span>
            </div>
            <div className="mt-2">
              <Progress value={pct} className="h-1.5 bg-white/10" />
            </div>
            <p className="mt-1.5 text-[10px] text-white/50 hidden sm:block">
              Founding member perks · lifetime priority allocation · exclusive drop invites
            </p>
          </div>
          <div className="flex items-center gap-3 justify-between md:justify-end">
            <div
              suppressHydrationWarning
              className="flex items-center gap-1.5 font-mono text-xs sm:text-sm text-white tabular-nums"
              data-mounted={mounted}
            >
              <span className="px-2 py-1 rounded bg-white/5">{pad(remaining.days)}d</span>
              <span className="px-2 py-1 rounded bg-white/5">{pad(remaining.hours)}h</span>
              <span className="px-2 py-1 rounded bg-white/5">{pad(remaining.minutes)}m</span>
              <span className="px-2 py-1 rounded bg-white/5 hidden sm:inline-block">
                {pad(remaining.seconds)}s
              </span>
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
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const cur = Math.max(
    MEMBERS_CLAIMED_BASELINE,
    raw != null ? Number(raw) : MEMBERS_CLAIMED_BASELINE,
  );
  const next = Math.min(MEMBER_CAP, cur + by);
  window.localStorage.setItem(STORAGE_KEY, String(next));
  window.dispatchEvent(new Event("loudmouf:early-access-claimed"));
}
