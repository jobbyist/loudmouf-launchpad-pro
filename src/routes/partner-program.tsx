import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Handshake,
  Store,
  Megaphone,
  Share2,
  Camera,
  ShoppingBag,
  Percent,
  Headphones,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/partner-program")({
  head: () => ({
    meta: [
      { title: "Partner Program — LOUDMOUF™" },
      {
        name: "description",
        content:
          "Partner with LOUDMOUF™ as a reseller, ambassador, affiliate, influencer or e-commerce store. Earn 10% ongoing commission on memberships and 5% on yield referrals.",
      },
      { property: "og:title", content: "LOUDMOUF™ Partner Program" },
      {
        property: "og:description",
        content:
          "Strategic partnerships for resellers, ambassadors, affiliates and creators. Drive traffic, earn commission, grow with the Collective.",
      },
    ],
  }),
  component: PartnerProgramPage,
});

const PARTNER_TYPES = [
  {
    icon: Store,
    title: "Authorized Resellers",
    copy: "Stock and move LOUDMOUF™ through your retail or wholesale channels with full brand support.",
  },
  {
    icon: Megaphone,
    title: "Brand Ambassadors",
    copy: "Represent the Collective in your city — events, community and culture, with exclusive access.",
  },
  {
    icon: Share2,
    title: "Affiliate Marketers",
    copy: "Share your unique link, track conversions, and earn recurring commission on every member you bring in.",
  },
  {
    icon: Camera,
    title: "Influencers & Creators",
    copy: "Content that resonates with our audience. We back creators who align with the LOUDMOUF™ ethos.",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce Stores",
    copy: "Integrate LOUDMOUF™ into your online storefront and unlock partner pricing and co-marketing.",
  },
  {
    icon: Handshake,
    title: "Aligned Partners",
    copy: "Anyone with access to our ideal demographic who resonates with our brand identity and value proposition.",
  },
];

const BENEFITS = [
  {
    icon: Percent,
    title: "10% ongoing monthly commission",
    copy: "Earn 10% of the membership fee for every active member you refer — month after month.",
  },
  {
    icon: Sparkles,
    title: "5% on every yield secured",
    copy: "When your referrals lock in yield allocations, you earn 5% commission on those contributions.",
  },
  {
    icon: Headphones,
    title: "Dedicated support & resources",
    copy: "Partner toolkit, creative assets, and a direct line to our partner manager so you can maximise the alliance.",
  },
];

// Replace with your live Calendly event URL when ready
const CALENDLY_URL =
  "https://calendly.com/loudmouf/partner-intro?hide_gdpr_banner=1&primary_color=f5c518";

function PartnerProgramPage() {
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />

      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">
            Strategic Alliances
          </p>
          <h1 className="display mt-4 text-5xl sm:text-6xl md:text-7xl text-white">
            Partner with{" "}
            <span className="text-gradient-loud">LOUDMOUF™</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-white/70 leading-relaxed">
            We invite anyone with access to our ideal target demographic — potential
            club members who would be interested in joining our platform. If you align
            with our brand identity, value proposition and ethos, let&apos;s build together.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => setCalendlyOpen(true)}
              className="cta-gradient text-black font-semibold uppercase tracking-widest hover:opacity-90 px-8 py-6 text-sm"
            >
              Book An Introductory Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 mt-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">
              Who we work with
            </p>
            <h2 className="display mt-3 text-4xl sm:text-5xl text-white">
              Multiple ways in.
            </h2>
            <p className="mt-4 text-white/60">
              Partner in the capacity that fits how you already operate — and how you
              reach people who belong in the Collective.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNER_TYPES.map((p) => (
              <div
                key={p.title}
                className="glass rounded-2xl p-6 border border-white/10 hover:border-loud-yellow/30 transition"
              >
                <p.icon className="h-6 w-6 text-loud-yellow" />
                <h3 className="mt-4 font-display uppercase text-xl text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{p.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 mt-24">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full gradient-loud opacity-20 blur-3xl" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">
                Incentives
              </p>
              <h2 className="display mt-3 text-4xl sm:text-5xl text-white">
                Earn as the Collective grows.
              </h2>
              <p className="mt-4 max-w-xl text-white/60">
                Drive traffic to our website and earn ongoing rewards for every member
                and yield contribution you influence.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {BENEFITS.map((b) => (
                  <div key={b.title} className="space-y-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-loud-yellow/10">
                      <b.icon className="h-5 w-5 text-loud-yellow" />
                    </div>
                    <h3 className="font-semibold text-white">{b.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{b.copy}</p>
                  </div>
                ))}
              </div>
              <ul className="mt-10 space-y-2 text-sm text-white/70">
                {[
                  "Transparent tracking of referrals and commissions",
                  "Partner-only creative and messaging assets",
                  "Priority support from the LOUDMOUF™ partner team",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-loud-yellow mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 mt-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">
              How it calculates
            </p>
            <h2 className="display mt-3 text-4xl sm:text-5xl text-white">
              Commission, in numbers.
            </h2>
            <p className="mt-4 text-white/60">
              Two revenue streams, paid for as long as your referrals stay active and keep
              allocating yield. Figures below use current LOUDMOUF™ pricing.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="glass rounded-3xl border border-white/10 p-6 sm:p-8">
              <p className="text-[11px] uppercase tracking-widest text-loud-yellow font-semibold">
                Membership commission · 10%
              </p>
              <h3 className="mt-2 font-display uppercase text-2xl text-white">
                Ongoing monthly fee share
              </h3>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">
                You earn <span className="text-white font-medium">10% of the monthly membership
                fee</span> for every active member who joined via your partner link — for every
                month they remain subscribed.
              </p>
              <div className="mt-6 rounded-2xl bg-black/40 border border-white/10 p-4 font-mono text-sm space-y-2">
                <p className="text-white/50 text-[11px] uppercase tracking-widest not-italic font-sans">
                  Formula
                </p>
                <p className="text-white/90">
                  Monthly payout = active referrals × plan fee × 10%
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <p className="text-[11px] uppercase tracking-widest text-white/40">
                  Per active referral / month
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-white/50">Standard</p>
                    <p className="mt-1 text-white/70 text-sm">R99 × 10%</p>
                    <p className="mt-1 font-display text-2xl text-loud-yellow">R9.90</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-white/50">Premium</p>
                    <p className="mt-1 text-white/70 text-sm">R149 × 10%</p>
                    <p className="mt-1 font-display text-2xl text-loud-yellow">R14.90</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-loud-yellow/20 bg-loud-yellow/5 p-4">
                <p className="text-[11px] uppercase tracking-widest text-loud-yellow font-semibold">
                  Example
                </p>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">
                  20 Standard + 10 Premium active referrals ={" "}
                  <span className="text-white font-semibold">
                    (20 × R9.90) + (10 × R14.90) = R347 / month
                  </span>
                  , recurring while they stay members.
                </p>
              </div>
            </div>

            <div className="glass rounded-3xl border border-white/10 p-6 sm:p-8">
              <p className="text-[11px] uppercase tracking-widest text-loud-yellow font-semibold">
                Yield commission · 5%
              </p>
              <h3 className="mt-2 font-display uppercase text-2xl text-white">
                On every allocation secured
              </h3>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">
                When a member you referred secures a yield allocation, you earn{" "}
                <span className="text-white font-medium">5% of that contribution</span>. Yield
                requests are currently R350 per tin.
              </p>
              <div className="mt-6 rounded-2xl bg-black/40 border border-white/10 p-4 font-mono text-sm space-y-2">
                <p className="text-white/50 text-[11px] uppercase tracking-widest not-italic font-sans">
                  Formula
                </p>
                <p className="text-white/90">
                  Yield payout = allocations secured × R350 × 5%
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <p className="text-[11px] uppercase tracking-widest text-white/40">
                  Per allocation secured
                </p>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-widest text-white/50">
                    Yield contribution
                  </p>
                  <p className="mt-1 text-white/70 text-sm">R350 × 5%</p>
                  <p className="mt-1 font-display text-2xl text-loud-yellow">R17.50</p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-loud-yellow/20 bg-loud-yellow/5 p-4">
                <p className="text-[11px] uppercase tracking-widest text-loud-yellow font-semibold">
                  Example
                </p>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">
                  Your referrals secure 40 yield allocations in a month ={" "}
                  <span className="text-white font-semibold">
                    40 × R17.50 = R700
                  </span>{" "}
                  in yield commission for that period.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="text-[11px] uppercase tracking-widest text-loud-yellow font-semibold">
              Combined scenario
            </p>
            <h3 className="mt-2 font-display uppercase text-xl text-white">
              Membership + yield in one month
            </h3>
            <p className="mt-3 text-sm text-white/60 max-w-3xl leading-relaxed">
              20 Standard members, 10 Premium members, and 40 yield allocations secured by those
              referrals:
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="text-[10px] uppercase tracking-widest text-white/50">Membership</p>
                <p className="mt-2 text-sm text-white/70">R198 + R149</p>
                <p className="mt-1 font-display text-xl text-white">R347</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="text-[10px] uppercase tracking-widest text-white/50">Yield</p>
                <p className="mt-2 text-sm text-white/70">40 × R17.50</p>
                <p className="mt-1 font-display text-xl text-white">R700</p>
              </div>
              <div className="rounded-xl border border-loud-yellow/30 bg-loud-yellow/10 p-4">
                <p className="text-[10px] uppercase tracking-widest text-loud-yellow">Total that month</p>
                <p className="mt-2 text-sm text-white/70">R347 + R700</p>
                <p className="mt-1 font-display text-2xl text-loud-yellow">R1,047</p>
              </div>
            </div>
            <p className="mt-6 text-xs text-white/40 leading-relaxed">
              Membership commission continues every month those members remain active. Yield
              commission is earned each time a referred member secures a new allocation. Actual
              plan prices and yield contribution amounts may change; your partner dashboard always
              reflects the live rates used for payout.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 mt-24 text-center">
          <h2 className="display text-4xl sm:text-5xl text-white">
            Ready to talk?
          </h2>
          <p className="mt-4 text-white/60">
            Book a short introductory call with our partner manager. We&apos;ll walk through
            fit, structure, and how we can work together.
          </p>
          <Button
            onClick={() => setCalendlyOpen(true)}
            className="cta-gradient mt-8 text-black font-semibold uppercase tracking-widest hover:opacity-90 px-8 py-6 text-sm"
          >
            Book An Introductory Call
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </main>

      <Footer />

      <Dialog open={calendlyOpen} onOpenChange={setCalendlyOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-loud-ink border-white/10 p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-white text-xl font-display uppercase">
              Book An Introductory Call
            </DialogTitle>
            <p className="text-sm text-white/60">
              Choose a time that works for you — we&apos;ll discuss partnership options and next steps.
            </p>
          </DialogHeader>
          <div className="w-full h-[70vh] min-h-[480px]">
            <iframe
              title="Calendly — Partner introductory call"
              src={CALENDLY_URL}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
