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
