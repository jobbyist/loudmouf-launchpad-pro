import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "LOUDMOUF™ Store — Coming Soon" },
      {
        name: "description",
        content:
          "Official LOUDMOUF™ merchandise is coming soon. Sign up to be the first to know when the collection drops on September 1, 2026. Exclusive apparel and accessories for the collective.",
      },
      { property: "og:title", content: "LOUDMOUF™ Store — Coming Soon" },
      {
        property: "og:description",
        content: "Official LOUDMOUF™ merchandise launching September 1, 2026. Be first in line.",
      },
    ],
    links: [{ rel: "canonical", href: "https://loudmouf.co.za/store" }],
  }),
  component: StorePage,
});

const LAUNCH_DATE = new Date("2026-09-01T00:00:00").getTime();

function StorePage() {
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = LAUNCH_DATE - now;

      if (diff <= 0) {
        setLaunched(true);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleNewsletterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "81aa79f6-d934-470b-9f94-76c430ef4faa");
    formData.append("from_name", "LOUDMOUF Store Notification");
    formData.append("subject", "Store Launch Notification Signup");

    if (!formData.get("email")) return;

    setNewsletterStatus("loading");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setNewsletterStatus("idle");
        form.reset();
        setThankYouOpen(true);
      } else {
        console.error("Web3Forms error:", data);
        setNewsletterStatus("error");
      }
    } catch (error) {
      console.error("Newsletter error:", error);
      setNewsletterStatus("error");
    }
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      <Nav />

      {/* Hero */}
      <section className="relative pt-40 pb-24">
        <div className="pointer-events-none absolute inset-0 grid-noise" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="display text-5xl sm:text-7xl md:text-8xl text-white">
              LOUDMOUF™ MERCH<br />
              <span className="text-gradient-loud">IS COMING.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-white/70 text-base sm:text-lg">
              Official LOUDMOUF™ merchandise is almost here. Sign up to be the first to know when
              the collection drops.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Merchandise Teaser */}
      <section className="relative py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-12 sm:p-16 backdrop-blur-md overflow-hidden">
            <div className="absolute inset-0 gradient-loud opacity-10" />
            <div className="relative text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">
                Coming Soon
              </p>
              <h2 className="display mt-3 text-4xl sm:text-5xl text-white">
                The Collection.
              </h2>
              <p className="mt-4 text-white/60 max-w-xl mx-auto">
                Premium apparel and accessories designed for the collective. Bold, discreet, and
                unmistakably LOUDMOUF™.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section className="relative py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="glass rounded-3xl p-8 sm:p-12 text-center">
            {!launched ? (
              <>
                <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">
                  Launching In
                </p>
                <div className="mt-8 flex flex-wrap justify-center items-end gap-3 sm:gap-5">
                  {[
                    ["Days", countdown.days],
                    ["Hours", countdown.hours],
                    ["Minutes", countdown.minutes],
                    ["Seconds", countdown.seconds],
                  ].map(([label, val]) => (
                    <div
                      key={label as string}
                      className="glass rounded-2xl px-4 py-3 sm:px-6 sm:py-4 min-w-[72px] sm:min-w-[92px]"
                    >
                      <div className="font-display text-4xl sm:text-5xl md:text-6xl leading-none text-white tabular-nums">
                        {String(val).padStart(2, "0")}
                      </div>
                      <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/60">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <h2 className="display text-5xl sm:text-6xl text-gradient-loud">
                THE WAIT IS OVER.
              </h2>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="glass rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="display text-3xl sm:text-4xl text-white">GET THE DROP FIRST</h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto">
              Join the LOUDMOUF™ list and we'll let you know the moment official merchandise goes
              live — plus you'll receive a free discount voucher for your first purchase.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                name="email"
                placeholder="you@loud.co"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 flex-1"
                disabled={newsletterStatus === "loading"}
              />
              <Button
                type="submit"
                className="cta-gradient text-black hover:opacity-90 font-semibold uppercase tracking-widest px-6"
                disabled={newsletterStatus === "loading"}
              >
                {newsletterStatus === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Notify Me"
                )}
              </Button>
            </form>
            {newsletterStatus === "error" && (
              <p className="mt-3 text-xs text-red-400">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>
      </section>

      <Dialog open={thankYouOpen} onOpenChange={setThankYouOpen}>
        <DialogContent className="max-w-md bg-loud-ink border-white/10">
          <DialogHeader className="items-center text-center sm:text-center">
            <CheckCircle2 className="h-12 w-12 text-loud-yellow mb-2" />
            <DialogTitle className="text-white text-2xl font-display uppercase">
              You&apos;re on the list
            </DialogTitle>
            <DialogDescription className="text-white/70 text-base pt-2">
              We'll notify you the moment LOUDMOUF™ merchandise drops. Your discount voucher will
              be included in the launch email.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => setThankYouOpen(false)}
              className="cta-gradient text-black font-semibold uppercase tracking-widest hover:opacity-90"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
