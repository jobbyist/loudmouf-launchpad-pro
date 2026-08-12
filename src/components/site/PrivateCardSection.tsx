import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";

export function PrivateCardSection() {
  return (
    <section
      id="member-card"
      className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32"
      aria-label="Private Club Member Card"
    >
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">
            The Private Club Member Card
          </p>
          <h2 className="display mt-3 text-5xl sm:text-6xl text-white">
            One card. <span className="text-gradient-loud">All access.</span>
          </h2>
          <p className="mt-6 max-w-lg text-white/70 leading-relaxed">
            The LOUDMOUF™ Rewards Card is the physical key to the Collective. Loyalty
            points, cashback on allocations, priority yield processing, event invites and
            member-only drops — all linked to your verified profile.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-white/70">
            {[
              "Contactless entry to Launch Summit & member events",
              "1 point per R1 contributed · redeemable against yield shares",
              "5% cashback on all Premium allocations",
              "Priority allocation window on every drop",
              "Concierge line & member-only merchandise",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-loud-yellow mt-0.5 flex-shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/membership"
              className="cta-gradient inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-widest text-black shadow-xl hover:opacity-90"
            >
              Claim My Card <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/50">
              <ShieldCheck className="h-4 w-4 text-loud-yellow" /> Included with Premium
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-10 gradient-loud opacity-25 blur-3xl rounded-full" />
          <div className="relative rounded-[28px] border border-white/15 bg-gradient-to-br from-loud-pink/40 via-black/80 to-[color:var(--loud-blue-bright)]/40 p-6 aspect-[1.586/1] shadow-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-30 grid-noise pointer-events-none" />
            <div className="relative flex flex-col justify-between h-full text-white">
              <div className="flex items-start justify-between">
                <Logo size="md" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-loud-yellow">
                  Premium · 2026
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                  Member Number
                </p>
                <p className="font-mono text-xl sm:text-2xl mt-1 tracking-widest tabular-nums">
                  4207 · 0000 · 0234
                </p>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                      Member Since
                    </p>
                    <p className="text-sm mt-1">09 / 26</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                      Tier
                    </p>
                    <p className="text-sm mt-1 text-gradient-loud font-semibold">
                      Premium · Loud
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-white/40">
            Illustrative preview · your card details are unique
          </p>
        </motion.div>
      </div>
    </section>
  );
}
