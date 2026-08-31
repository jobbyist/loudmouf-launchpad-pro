import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AgeGate } from "@/components/site/AgeGate";
import { NotificationBar } from "@/components/site/NotificationBar";
import { TinctureCard } from "@/components/site/TinctureCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sunrise,
  Sun,
  Moon,
  Leaf,
  FlaskConical,
  ShieldCheck,
  Package,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { TINCTURE_PRODUCTS, TINCTURE_GOLD } from "@/lib/tinctures";

export const Route = createFileRoute("/herbal-tinctures")({
  head: () => ({
    meta: [
      { title: "Premium Herbal Tinctures — LOUDMOUF™" },
      {
        name: "description",
        content:
          "Morning, Afternoon & Night — three 100mg botanical tinctures from LOUDMOUF™. Goji Berry & Ginseng, Passionflower & Holy Basil, Soursop & Blue Chamomile. Reserve your bottle now.",
      },
      { property: "og:title", content: "Premium Herbal Tinctures — LOUDMOUF™" },
      {
        property: "og:description",
        content:
          "A day-to-night ritual in three formulas. 10ml botanical tinctures, lab-tested, 100mg per bottle. Reserve now.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://loudmouf.co.za/herbal-tinctures" }],
  }),
  component: HerbalTincturesPage,
});

const RANGE_OVERVIEW = [
  {
    icon: Sunrise,
    daypart: "Morning / Sunrise",
    title: "Focus & Vitality",
    tags: "Energising · Mental clarity · Morning ritual",
    color: TINCTURE_PRODUCTS[0].color,
  },
  {
    icon: Sun,
    daypart: "Afternoon",
    title: "Equilibrium & Clarity",
    tags: "Balancing · Afternoon reset · Non-drowsy",
    color: TINCTURE_PRODUCTS[1].color,
  },
  {
    icon: Moon,
    daypart: "Night / Sunset",
    title: "Deep Rest & Recovery",
    tags: "Calming · Wind-down · Evening ritual",
    color: TINCTURE_PRODUCTS[2].color,
  },
];

const TRUST_POINTS = [
  {
    icon: FlaskConical,
    title: "Lab-Tested Potency",
    copy: "Every batch carries a certificate of analysis confirming 100mg THC per 10ml bottle.",
  },
  {
    icon: Leaf,
    title: "Real Botanicals",
    copy: "A fruit base, a soothing note and a functional adaptogen in every formula — no fillers.",
  },
  {
    icon: Package,
    title: "Matte Black Glass",
    copy: "10ml matte black dropper bottle with a bamboo-veneer collar cap and glass pipette.",
  },
  {
    icon: ShieldCheck,
    title: "Discreet Delivery",
    copy: "Plain, unbranded outer packaging shipped anywhere in South Africa in 3–5 working days.",
  },
];

const FAQ_ITEMS = [
  {
    q: "How do I use a LOUDMOUF™ tincture?",
    a: "Use the bamboo pipette to place your desired amount under the tongue and hold for 30–60 seconds before swallowing. Start low and go slow — wait at least 45 minutes before taking more.",
  },
  {
    q: "What does “100mg” mean for a 10ml bottle?",
    a: "Each 10ml bottle contains 100mg of cannabis-derived THC distillate as the active ingredient, alongside the botanical spirit base, fruit note and functional herb listed on the label.",
  },
  {
    q: "Which one should I start with?",
    a: "Morning (Sativa) for energising, mood-lifting daytime use; Afternoon (Hybrid) for a non-drowsy midday reset; Night (Indica) for a calming evening wind-down. Many members keep all three for a full day-to-night ritual.",
  },
  {
    q: "Is this legal, and who can buy it?",
    a: "LOUDMOUF™ Herbal Tinctures are sold in compliance with South African cannabis regulations for adult personal use. You must be 18+ and located where this product may lawfully be purchased.",
  },
  {
    q: "How does Reserve Now work?",
    a: "Reserve Now opens secure checkout powered by Paystack. Your card, EFT or mobile money payment confirms your allocation for the batch — you'll receive email confirmation once payment clears.",
  },
  {
    q: "Is this medical advice?",
    a: "No. Functional language like “calming” or “energising” is descriptive, not a medical claim. Effects are individual — this product is not intended to diagnose, treat, cure or prevent any condition.",
  },
];

function useVerifyReturningPayment() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference");
    if (!reference) return;

    (async () => {
      try {
        const res = await fetch(
          `/api/public/paystack/verify?reference=${encodeURIComponent(reference)}`,
        );
        const data = await res.json();
        if (res.ok && data.status === "paid") {
          toast.success("Reservation confirmed!", {
            description: `${data.productName} × ${data.quantity} — R${data.amountZar}. Check your email for confirmation.`,
          });
        } else if (res.ok && data.status === "pending") {
          toast("Payment is still processing", {
            description: "We'll confirm your reservation by email as soon as it clears.",
          });
        } else {
          toast.error("Payment wasn't completed", {
            description: "Your reservation wasn't confirmed. Feel free to try again.",
          });
        }
      } catch (err) {
        console.error("Verify payment error", err);
      } finally {
        params.delete("reference");
        const cleanUrl = window.location.pathname + (params.toString() ? `?${params}` : "");
        window.history.replaceState({}, "", cleanUrl);
      }
    })();
  }, []);
}

function HerbalTincturesPage() {
  useVerifyReturningPayment();
  const [activeIngredient, setActiveIngredient] = useState(TINCTURE_PRODUCTS[0].id);
  const activeProduct =
    TINCTURE_PRODUCTS.find((p) => p.id === activeIngredient) ?? TINCTURE_PRODUCTS[0];

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <AgeGate />
      <NotificationBar />
      <Nav />

      {/* Hero */}
      <section className="relative pt-40 pb-20 sm:pt-48 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 grid-noise" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] uppercase tracking-[0.25em] text-loud-yellow"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-loud-yellow animate-pulse" />
            Featured Collection
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="display mt-6 text-5xl sm:text-7xl md:text-8xl text-white"
          >
            Premium Herbal <span className="text-gradient-loud">Tinctures</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/70"
          >
            A day-to-night ritual in three formulas — Sativa for the morning, Hybrid for the
            afternoon, Indica for the night. A shared logic runs through all three: a fruit base, a
            soothing note and a functional botanical, tuned to a different moment.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#collection"
              className="cta-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black shadow-lg"
            >
              <Sparkles className="h-4 w-4" /> Shop the Collection
            </a>
            <a
              href="#formula"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white"
            >
              See the Formula <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </div>

        {/* Range overview */}
        <div className="relative mx-auto mt-16 max-w-6xl px-6 grid gap-5 md:grid-cols-3">
          {RANGE_OVERVIEW.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md"
              style={{ borderColor: `color-mix(in oklab, ${r.color} 35%, transparent)` }}
            >
              <div
                className="grid h-10 w-10 place-items-center rounded-full"
                style={{ backgroundColor: `color-mix(in oklab, ${r.color} 25%, transparent)` }}
              >
                <r.icon
                  className="h-5 w-5"
                  style={{ color: `color-mix(in oklab, ${r.color} 70%, white)` }}
                />
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-white/50">
                {r.daypart}
              </p>
              <h3 className="display mt-1 text-2xl sm:text-3xl text-white">{r.title}</h3>
              <p className="mt-2 text-xs uppercase tracking-widest text-white/40">{r.tags}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product collection */}
      <section id="collection" className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">The Range</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl text-white">
            Three SKUs, side by side.
          </h2>
          <p className="mt-4 text-white/60">
            10ml botanical spirit base · 100mg per bottle · reserve your allocation from R275 each.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TINCTURE_PRODUCTS.map((p, i) => (
            <TinctureCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Formula breakdown */}
      <section id="formula" className="relative bg-black/40 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">About the Formula</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl text-white">
              What's actually inside.
            </h2>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {TINCTURE_PRODUCTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveIngredient(p.id)}
                className="rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition"
                style={{
                  borderColor: p.color,
                  backgroundColor: activeIngredient === p.id ? p.colorSoft : "transparent",
                  color: activeIngredient === p.id ? "white" : "rgba(255,255,255,0.6)",
                }}
              >
                {p.index} · {p.strain}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr] items-start">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border p-8"
              style={{ borderColor: activeProduct.color, backgroundColor: activeProduct.colorSoft }}
            >
              <p className="font-display text-3xl text-white leading-tight">
                {activeProduct.potencyLabel}
              </p>
              <p className="mt-6 text-lg italic text-white/80">“{activeProduct.quote}”</p>
              <p className="mt-6 text-sm text-white/70 leading-relaxed">
                {activeProduct.description}
              </p>
            </motion.div>

            <div className="space-y-5">
              {activeProduct.ingredients.map((ing) => (
                <div
                  key={ing.name}
                  className="border-l-2 pl-4"
                  style={{ borderColor: activeProduct.color }}
                >
                  <h4 className="text-lg font-semibold text-white">{ing.name}</h4>
                  <p className="mt-1 text-sm text-white/60">{ing.role}</p>
                </div>
              ))}
              <div className="border-l-2 pl-4 border-white/20">
                <h4 className="text-lg font-semibold text-white">
                  Cannabis-Derived THC Distillate
                </h4>
                <p className="mt-1 text-sm text-white/60">
                  Active ingredient — sourced &amp; lab-tested. 100mg per 10ml bottle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / packaging */}
      <section className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">Production Guide</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Built to a standard.</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_POINTS.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md"
            >
              <t.icon className="h-6 w-6" style={{ color: TINCTURE_GOLD }} />
              <h3 className="mt-4 text-base font-semibold text-white">{t.title}</h3>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">{t.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative bg-black/40 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">FAQ</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Questions?</h2>
          </div>
          <Accordion type="single" collapsible className="mt-12 space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="glass rounded-2xl border-white/10 px-6"
              >
                <AccordionTrigger className="text-left text-white hover:no-underline uppercase tracking-wider text-sm">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 pb-5">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#99291D]/15 via-[#CCCB40]/10 to-[#B7BADB]/15 p-10 sm:p-16 text-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 gradient-loud opacity-5" />
          <p className="relative text-xs uppercase tracking-[0.3em] text-loud-yellow">
            Morning. Afternoon. Night.
          </p>
          <h2 className="relative display mt-4 text-4xl sm:text-6xl text-white">
            Reserve your ritual.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/70">
            Limited first batch. Lab-tested, 100mg per bottle, delivered discreetly anywhere in
            South Africa.
          </p>
          <a
            href="#collection"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-semibold uppercase tracking-widest text-black shadow-lg hover:bg-white/90"
          >
            <Sparkles className="h-4 w-4" /> Reserve Now
          </a>
        </div>
        <p className="mt-8 text-center text-[11px] text-white/40 leading-relaxed max-w-2xl mx-auto">
          Functional benefit language is descriptive, not a medical claim. LOUDMOUF™ Herbal
          Tinctures are for adult (18+) use only, in accordance with South African cannabis
          regulations. Keep out of reach of children and animals.
        </p>
      </section>

      <Footer />
    </div>
  );
}
