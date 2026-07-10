import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { EarlyAccessBar } from "@/components/site/EarlyAccessBar";
import { OnboardingModal } from "@/components/site/OnboardingModal";
import { LoudAI } from "@/components/site/LoudAI";
import { Check, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MEMBERSHIP_PLANS,
  YIELD_CONTRIBUTION_PER_TIN,
  estimateMonthlyContribution,
} from "@/lib/launch";
import { useUIStore } from "@/stores/uiStore";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership — LOUDMOUF™ Private Lifestyle Club" },
      {
        name: "description",
        content:
          "Two paths into the LOUDMOUF™ Collective. Standard at R99/month or Premium at R149/month with Rewards Card, loyalty, cashback and priority access.",
      },
      { property: "og:title", content: "Membership — LOUDMOUF™ Private Lifestyle Club" },
      {
        property: "og:description",
        content:
          "Standard R99 or Premium R149 with LOUDMOUF™ Rewards Card, cashback and priority access.",
      },
    ],
  }),
  component: MembershipPage,
});

function MembershipPage() {
  const [allocations, setAllocations] = useState(2);
  const openOnboarding = useUIStore((s) => s.openOnboarding);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <Nav />

      <section className="relative pt-36 pb-12 sm:pt-44">
        <div className="pointer-events-none absolute inset-0 grid-noise" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.3em] text-loud-yellow"
          >
            Membership
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="display mt-4 text-5xl sm:text-6xl md:text-7xl text-white"
          >
            Two ways to join <br className="hidden sm:block" />
            the <span className="text-gradient-loud">Collective.</span>
          </motion.h1>
          <p className="mx-auto mt-6 max-w-xl text-white/70">
            LOUDMOUF™ is a Private Lifestyle Club. Choose the monthly contribution that fits your
            lifestyle — yield allocations are requested separately at R{YIELD_CONTRIBUTION_PER_TIN}{" "}
            per tin.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {MEMBERSHIP_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative rounded-3xl border p-8 backdrop-blur-md overflow-hidden",
                plan.recommended
                  ? "border-transparent bg-loud-ink"
                  : "border-white/10 bg-white/[0.03]",
              )}
            >
              {plan.recommended && (
                <>
                  <span className="pointer-events-none absolute inset-0 rounded-3xl gradient-loud opacity-70" />
                  <span className="pointer-events-none absolute inset-[2px] rounded-[calc(1.5rem-2px)] bg-loud-ink" />
                </>
              )}
              <div className="relative">
                {plan.recommended && (
                  <div className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-loud-yellow">
                    <Star className="h-3 w-3" /> Recommended
                  </div>
                )}
                <h3 className="display mt-4 text-4xl text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-white/60">{plan.tagline}</p>

                <div className="mt-6 flex items-end gap-2">
                  <span className="font-display text-6xl text-white leading-none">
                    R{plan.monthly}
                  </span>
                  <span className="pb-1.5 text-xs uppercase tracking-widest text-white/50">
                    / month
                  </span>
                </div>

                <ul className="mt-6 space-y-2.5 text-sm text-white/80">
                  {plan.benefits.map((b) => (
                    <li key={b} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-loud-yellow" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={openOnboarding}
                  className={cn(
                    "mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-widest",
                    plan.recommended
                      ? "cta-gradient text-black hover:opacity-90"
                      : "bg-white text-black hover:bg-white/90 shadow-lg",
                  )}
                >
                  <Sparkles className="h-4 w-4" /> {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contribution calculator */}
      <section className="relative mx-auto max-w-4xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">
            Contribution Calculator
          </p>
          <h2 className="display mt-3 text-3xl sm:text-4xl text-white">
            Estimate your monthly contribution.
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Monthly membership + yield allocation requests × R{YIELD_CONTRIBUTION_PER_TIN} = total
            monthly contribution.
          </p>

          <div className="mt-6">
            <label htmlFor="alloc" className="text-xs uppercase tracking-widest text-white/60">
              Yield allocation requests · {allocations} tin{allocations !== 1 ? "s" : ""} / month
            </label>
            <input
              id="alloc"
              type="range"
              min={0}
              max={8}
              step={1}
              value={allocations}
              onChange={(e) => setAllocations(Number(e.target.value))}
              className="mt-3 w-full accent-loud-yellow"
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {MEMBERSHIP_PLANS.map((plan) => {
              const total = estimateMonthlyContribution(plan.monthly, allocations);
              return (
                <div key={plan.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-[11px] uppercase tracking-widest text-white/50">{plan.name}</p>
                  <p className="mt-1 text-sm text-white/60">
                    R{plan.monthly} + {allocations} × R{YIELD_CONTRIBUTION_PER_TIN}
                  </p>
                  <p className="mt-2 font-display text-4xl text-gradient-loud">
                    R{total.toLocaleString("en-ZA")}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">
                    Total monthly
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-8 text-center text-xs uppercase tracking-widest text-white/40">
          Already a member?{" "}
          <Link to="/member-dashboard" className="text-loud-yellow hover:opacity-80">
            Open your dashboard →
          </Link>
        </p>
      </section>

      <Footer />
      <EarlyAccessBar />
      <OnboardingModal />
      <LoudAI />
    </div>
  );
}
