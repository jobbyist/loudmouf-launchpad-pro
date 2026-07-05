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
      <div className="glass max-w-md w-full rounded-3xl p-8 text-center">
        <Logo className="text-3xl mx-auto" />
        <h2 className="display mt-6 text-3xl text-white">Are you 18 or older?</h2>
        <p className="mt-3 text-sm text-white/70">
          LOUDMOUF™ is an 18+ cannabis product. By entering you confirm you are of legal age in your jurisdiction.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button size="lg" onClick={accept} className="flex-1 bg-loud-yellow text-black hover:bg-loud-yellow/90 font-semibold">
            Yes, I'm 18+
          </Button>
          <a
            href="https://www.google.com"
            className="flex-1 inline-flex items-center justify-center rounded-md border border-white/20 px-5 py-3 text-sm font-medium text-white/80 hover:bg-white/5"
          >
            Leave site
          </a>
        </div>
        <p className="mt-6 text-[11px] uppercase tracking-widest text-white/40">
          Keep out of reach of children & animals.
        </p>
      </div>
    </div>
  );
}
