import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const KEY = "loudmouf-age-verified";

export function AgeGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  if (!open) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
      <div className="max-w-md w-full rounded-3xl p-8 sm:p-10 text-center shadow-2xl bg-[#0a0a0a] border border-[#d4af37]/30 relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#d4af37]/5 to-transparent pointer-events-none" />

        <div className="relative">
          <Logo className="text-4xl mx-auto" />

          <h2 className="display mt-8 text-3xl sm:text-4xl text-white uppercase tracking-tight">
            ARE YOU 18 OR OLDER?
          </h2>

          <p className="mt-5 text-sm sm:text-base text-white/70 leading-relaxed max-w-sm mx-auto">
            LOUDMOUF™ is an 18+ members-only platform. By entering you confirm you are of
            legal age in your jurisdiction.
          </p>

          {/* Buttons always side-by-side to match design reference */}
          <div className="mt-8 flex flex-row gap-3 w-full">
            <Button
              onClick={accept}
              className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-[#ff8c00] via-[#ff1493] to-[#6b1dff] hover:opacity-90 text-white font-semibold rounded-full px-5 text-sm sm:text-base shadow-lg hover:shadow-[0_0_20px_rgba(255,20,147,0.35)] transition-all duration-300 border-0"
            >
              Yes, I&apos;m 18+
            </Button>
            <a
              href="https://www.google.com"
              className="flex-1 h-12 sm:h-14 inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-5 text-sm sm:text-base font-semibold text-white/90 hover:bg-white/5 hover:border-white/40 transition-all duration-300"
            >
              Leave site
            </a>
          </div>

          <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-white/30 font-medium">
            KEEP OUT OF REACH OF CHILDREN & ANIMALS.
          </p>
        </div>
      </div>
    </div>
  );
}
