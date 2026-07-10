import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, MessageCircle } from "lucide-react";

const STARTERS = [
  "Explain Membership",
  "Compare Yield Profiles",
  "Track My Allocation",
  "Membership Benefits",
  "Community Guidelines",
];

/**
 * Floating LOUD AI assistant.
 * Static shell for the Soft Launch — wire to Lovable AI Gateway (Gemini)
 * once the backend function `loud-ai-chat` is deployed. See PRODUCTION_STATUS_REPORT.
 */
export function LoudAI() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-28 right-4 sm:right-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[320px] rounded-2xl border border-white/10 bg-loud-ink/95 backdrop-blur-xl shadow-2xl overflow-hidden"
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

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open LOUD AI"
        className="group relative inline-flex items-center gap-2 rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-2xl"
      >
        <span className="absolute inset-0 rounded-full gradient-loud opacity-90 animate-pulse" />
        <span className="absolute inset-[2px] rounded-full bg-loud-ink/90 backdrop-blur-xl" />
        <span className="relative flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-loud-yellow" />
          <span className="text-gradient-loud">LOUD AI</span>
        </span>
      </button>
    </div>
  );
}
