import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

const STARTERS = [
  "Explain Membership",
  "Compare Yield Profiles",
  "Track My Allocation",
  "Membership Benefits",
  "Community Guidelines",
];

const DISMISS_KEY = "loudmouf-loud-ai-dismissed";

/**
 * LOUD AI — dismissible glassmorphic notch pinned to the middle-right edge.
 * Click to expand a chat panel; the small "×" collapses it back to a notch;
 * the notch's chevron hides it entirely for the session (persisted).
 */
export function LoudAI() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === "1") setHidden(true);
    } catch {
      // ignore
    }
  }, []);

  function dismiss() {
    setOpen(false);
    setHidden(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (hidden) {
    return (
      <button
        onClick={() => {
          setHidden(false);
          try {
            window.sessionStorage.removeItem(DISMISS_KEY);
          } catch {
            // ignore
          }
        }}
        aria-label="Show LOUD AI"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 rounded-l-lg border border-r-0 border-white/10 bg-loud-ink/80 backdrop-blur-xl px-1.5 py-2 text-white/50 hover:text-white shadow-lg"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="mr-2 w-[320px] rounded-2xl border border-white/10 bg-loud-ink/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-label="LOUD AI Assistant"
          >
            <div className="relative p-4 border-b border-white/10">
              <div className="absolute inset-0 pointer-events-none gradient-loud opacity-10" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full gradient-loud">
                    <Sparkles className="h-4 w-4 text-black" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">LOUD AI</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/50">
                      Member Concierge
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close LOUD AI"
                  className="rounded-full p-1 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-xs text-white/60">
                Hi — I'm LOUD AI. Pick a starter or DM the collective concierge on WhatsApp.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {STARTERS.map((s) => (
                  <a
                    key={s}
                    href="https://wa.me/27680200749"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] uppercase tracking-widest rounded-full border border-white/15 bg-white/5 px-2.5 py-1.5 text-white/80 hover:border-loud-yellow/40 hover:text-loud-yellow transition"
                  >
                    {s}
                  </a>
                ))}
              </div>
              <p className="pt-2 text-[10px] uppercase tracking-widest text-white/40">
                Full AI chat launches with Sprint 2 · Powered by Gemini
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notch */}
      <div className="relative flex flex-col items-stretch">
        <button
          onClick={dismiss}
          aria-label="Dismiss LOUD AI"
          className="absolute -top-2 -left-2 grid h-5 w-5 place-items-center rounded-full border border-white/15 bg-loud-ink text-white/50 hover:text-white shadow"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close LOUD AI" : "Open LOUD AI"}
          aria-expanded={open}
          className="group relative flex flex-col items-center gap-2 rounded-l-2xl border border-r-0 border-white/10 bg-loud-ink/80 backdrop-blur-xl px-2.5 py-4 shadow-2xl"
        >
          <span className="absolute inset-0 rounded-l-2xl gradient-loud opacity-20 group-hover:opacity-40 transition" />
          <span className="relative flex flex-col items-center gap-2">
            <MessageCircle className="h-4 w-4 text-loud-yellow" />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gradient-loud"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              LOUD AI
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
