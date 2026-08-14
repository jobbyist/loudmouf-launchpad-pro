import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Music, Sparkles } from "lucide-react";

export const Route = createFileRoute("/launch")({
  head: () => ({
    meta: [
      { title: "THE LOUDMOUF LAUNCH SUMMIT ‘26" },
      {
        name: "description",
        content:
          "THE LOUDMOUF LAUNCH SUMMIT ‘26 — Friday 30 October 2026. Fully booked. Members-only event for the Loudmouf Collective.",
      },
      { property: "og:title", content: "THE LOUDMOUF LAUNCH SUMMIT ‘26" },
      {
        property: "og:description",
        content: "Friday 30 October 2026 · Fully booked. Intimate members-only summit.",
      },
    ],
  }),
  component: LaunchPage,
});

function LaunchPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      <Nav />
      <section className="relative pt-40 pb-24">
        <div className="pointer-events-none absolute inset-0 grid-noise" />
        <div className="relative mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-gradient-loud font-semibold">
              Members-Only · Strictly 18+
            </p>
            <h1 className="display mt-4 text-5xl sm:text-7xl text-white">
              THE LOUDMOUF LAUNCH <span className="text-gradient-loud">SUMMIT ‘26</span>
            </h1>
            <p className="mt-5 max-w-2xl text-white/70 text-base sm:text-lg">
              An intimate evening for founding members of the Loudmouf Collective. Live music,
              curated tastings, and the first-ever public unveiling of Drop 001. Capacity is
              deliberately small — this summit is fully booked.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Calendar, label: "Date", value: "Friday · 30 October 2026" },
              { icon: MapPin, label: "Location", value: "Cape Town · Address on confirmation" },
              { icon: Music, label: "Programme", value: "Live set · Tasting · Community" },
            ].map((c) => (
              <div key={c.label} className="glass rounded-2xl p-5">
                <c.icon className="h-5 w-5 text-loud-yellow" />
                <p className="mt-3 text-[11px] uppercase tracking-widest text-white/50">
                  {c.label}
                </p>
                <p className="mt-1 text-sm text-white">{c.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.3em] text-loud-yellow">
                What to expect
              </p>
              <ul className="mt-5 space-y-4 text-sm text-white/70">
                <li className="flex gap-3">
                  <Sparkles className="h-4 w-4 text-loud-yellow shrink-0 mt-0.5" /> First look at
                  the full Drop 001 range — Cheesecake, Blueberry, Bubblegum.
                </li>
                <li className="flex gap-3">
                  <Sparkles className="h-4 w-4 text-loud-yellow shrink-0 mt-0.5" /> Curated terpene
                  tastings with our head horticulturist.
                </li>
                <li className="flex gap-3">
                  <Sparkles className="h-4 w-4 text-loud-yellow shrink-0 mt-0.5" /> Founding-member
                  perks — priority allocation, lifetime discount.
                </li>
                <li className="flex gap-3">
                  <Sparkles className="h-4 w-4 text-loud-yellow shrink-0 mt-0.5" /> Live music,
                  curated food, and the community you've been waiting for.
                </li>
              </ul>
              <p className="mt-6 text-[11px] uppercase tracking-widest text-white/40">
                Strictly private · 18+ only · Attendance by invitation.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md">
              <div className="space-y-4">
                <div>
                  <h2 className="display text-3xl text-white">RSVP closed</h2>
                  <p className="mt-1 text-xs text-white/50">
                    Capacity has been reached. Thank you to everyone who reserved a seat.
                  </p>
                </div>
                <Button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed opacity-70 bg-white/10 text-white uppercase tracking-widest text-xs font-semibold border border-white/20"
                  aria-disabled="true"
                >
                  NO RSVP - FULLY BOOKED
                </Button>
                <p className="text-[10px] text-center uppercase tracking-widest text-white/40">
                  Confirmed guests will receive location details closer to the date.
                </p>
                <div className="pt-4 text-center">
                  <Link
                    to="/"
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-white/10"
                  >
                    Back to home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
