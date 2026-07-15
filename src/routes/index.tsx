import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchProducts } from "@/lib/shopify";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AgeGate } from "@/components/site/AgeGate";
import { Countdown } from "@/components/site/Countdown";
import { ProductCard } from "@/components/site/ProductCard";
import { Logo } from "@/components/site/Logo";
import { EarlyAccessBar } from "@/components/site/EarlyAccessBar";
import { OnboardingModal } from "@/components/site/OnboardingModal";
import { LoudAI } from "@/components/site/LoudAI";
import { PrivateCardSection } from "@/components/site/PrivateCardSection";
import { Newsroom } from "@/components/site/Newsroom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  ShieldCheck,
  Leaf,
  FlaskConical,
  Truck,
  Sparkles,
  Package,
  Star,
  Check,
  Mic,
} from "lucide-react";
import heroPoster from "@/assets/hero-poster.png.asset.json";
import heroVideo from "@/assets/hero.mp4.asset.json";
import storyImg from "@/assets/story.png.asset.json";
import adCreative from "@/assets/ad-creative.png.asset.json";
import { MEMBERSHIP_PLANS } from "@/lib/launch";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LOUDMOUF™ — Big Taste. Zero Smoke." },
      {
        name: "description",
        content:
          "SA’s first cannabis pouches made with high-grade THC and flavor-infused terpenes. Join the collective and secure your yield: Cheesecake, Blueberry & Bubblegum.",
      },
      { property: "og:title", content: "LOUDMOUF™ — Big Taste. Zero Smoke." },
      {
        property: "og:description",
        content:
          "SA’s first cannabis pouches made with high-grade THC and flavor-infused terpenes. Join the collective and secure your yield: Cheesecake, Blueberry & Bubblegum.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: adCreative.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: adCreative.url },
    ],
    links: [{ rel: "canonical", href: "https://loudmouf.co.za/" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(6),
    staleTime: 60_000,
  });

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <AgeGate />
      <Nav />

      {/* HERO */}
      <section id="home" className="relative pt-40 pb-24 sm:pt-48 sm:pb-32">
        {/* Floating brand X motifs */}
        <div className="pointer-events-none absolute inset-0 grid-noise" />
        <FloatingX className="top-24 left-[8%] text-loud-yellow/30 rotate-12" />
        <FloatingX className="top-64 right-[10%] text-loud-pink/40 -rotate-6" delay={0.6} />
        <FloatingX className="bottom-40 left-[15%] text-loud-blue/30 rotate-45" delay={1.2} />

        <div className="relative mx-auto max-w-7xl px-6 grid gap-16 lg:grid-cols-[1.05fr_1fr] items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] uppercase tracking-[0.25em] text-loud-yellow"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-loud-yellow animate-pulse" />
              Limited First Production Run · Drop 001
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="display mt-6 text-6xl sm:text-7xl md:text-8xl text-white"
            >
              <span className="text-gradient-loud">BIG</span> Taste.
              <br />
              <span className="text-gradient-loud">ZERO</span> Smoke.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 max-w-lg text-base sm:text-lg text-white/70"
            >
              South Africa's Private Lifestyle Club for premium cannabis pouches infused with
              true-grade terpenes. Exercise your constitutional right to private, personal
              cultivation within a supportive, members-only collective.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/membership"
                className="cta-gradient group inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-widest text-black shadow-xl hover:opacity-90 transition"
              >
                Become a Member{" "}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
              <a
                href="#product"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-widest text-white hover:bg-white/10"
              >
                Secure My Yield
              </a>
              <a
                href="#why"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-7 py-4 text-sm font-semibold uppercase tracking-widest text-white/80 hover:text-white hover:border-white/40"
              >
                Learn More
              </a>
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-10"
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/50 mb-3">
                Drop 001 launches in
              </p>
              <Countdown />
            </motion.div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-widest text-white/50">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-loud-yellow" /> Lab Tested
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-loud-yellow" /> Premium Quality
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-loud-yellow" /> 18+ Only
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-loud-yellow" /> Discreet Delivery
              </div>
            </div>
          </div>

          {/* Video / product showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-10 gradient-loud opacity-30 blur-3xl rounded-full" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 aspect-square glow-purple">
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={heroPoster.url}
                className="h-full w-full object-cover"
              >
                <source src={heroVideo.url} type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/70">
                <span>Drop 001 · Cheesecake · Blueberry · Bubblegum</span>
                <span className="rounded-full bg-loud-yellow/90 px-2 py-1 text-black font-semibold">
                  Limited
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <section aria-hidden className="border-y border-white/10 bg-black py-5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-10 pr-10 font-display uppercase text-2xl text-white/70"
            >
              {[
                "Big Taste",
                "Zero Smoke",
                "Discreet",
                "Potent",
                "Unapologetic",
                "South African",
                "Lab Tested",
                "18+ Only",
              ].map((w) => (
                <span key={w} className="flex items-center gap-10">
                  {w} <span className="text-loud-yellow">✕</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section id="product" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">The Flavours</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl text-white">
              Bold Flavours.
              <br />
              Zero Smoke.
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/60">
            Three signature strains crafted for every mood. Reserve your tin from the first
            production run — each shipment is capped.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(() => {
            const visible = products.filter(
              (p) => !/member\s*card/i.test(p.node.title),
            );
            if (visible.length === 0) {
              return (
                <div className="col-span-full glass rounded-3xl p-12 text-center text-white/60">
                  No products found. Loading the drop…
                </div>
              );
            }
            return visible.map((p, i) => (
              <ProductCard key={p.node.id} product={p} index={i} />
            ));
          })()}
        </div>
      </section>

      <PrivateCardSection />

      <Newsroom />

      {/* WHY LOUDMOUF */}
      <section
        id="why"
        className="relative bg-gradient-to-b from-transparent via-loud-pink/10 to-transparent py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">Why LOUDMOUF™</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl text-white">
              Built Different.
              <br />
              Made Loud.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Leaf,
                title: "Premium Cannabis",
                copy: "High-quality cannabis pouches crafted for maximum effect.",
              },
              {
                icon: ShieldCheck,
                title: "Discreet & Convenient",
                copy: "Smoke-free and odourless. Take it anywhere, anytime.",
              },
              {
                icon: FlaskConical,
                title: "Lab Tested",
                copy: "Every batch is lab tested for purity, potency and safety.",
              },
              {
                icon: Truck,
                title: "Discreet Delivery",
                copy: "Fast, discreet Courier Guy delivery straight to your door.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 hover:border-loud-yellow/40 hover:-translate-y-1 transition"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-loud-yellow/15 text-loud-yellow">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-sm uppercase tracking-widest text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-white/60">{f.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">How It Works</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl text-white">
            Three steps.
            <br />
            Zero friction.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              icon: Package,
              t: "Pre-Order",
              c: "Reserve your tin from Drop 001 with secure checkout via Shopify.",
            },
            {
              n: "02",
              icon: Sparkles,
              t: "Production",
              c: "Your tin is lab-tested, packed and readied at our Cape Town facility.",
            },
            {
              n: "03",
              icon: Truck,
              t: "Delivery",
              c: "The Courier Guy delivers discreetly in 3–5 working days across SA.",
            },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md overflow-hidden"
            >
              <div className="absolute -top-6 -right-4 font-display text-[8rem] leading-none text-white/[0.04]">
                {s.n}
              </div>
              <s.icon className="h-6 w-6 text-loud-yellow" />
              <h3 className="display mt-6 text-3xl text-white">{s.t}</h3>
              <p className="mt-3 text-sm text-white/60">{s.c}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 grid gap-14 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10"
          >
            <img
              src={storyImg.url}
              alt="LOUDMOUF brand story"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">The Movement</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl md:text-7xl text-white">
              Not a product.
              <br />
              <span className="text-gradient-loud">A statement.</span>
            </h2>
            <p className="mt-6 max-w-lg text-white/70 leading-relaxed">
              LOUDMOUF™ is for those who want the experience without the smoke. Born in South
              Africa, built for the unapologetic — musicians, creatives, hustlers and the crew that
              moves loud without ever needing to raise their voice.
            </p>
            <p className="mt-4 max-w-lg text-white/70 leading-relaxed">
              Big flavour. Zero smoke. Stay loud.
            </p>
            <div className="mt-8">
              <Logo className="text-6xl md:text-7xl" tone="gradient" />
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY / EARLY BATCH REVIEWS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">The Community</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Word on the street.</h2>
          <p className="mt-4 text-white/60">
            Verified reactions from founding members who tested the first small-batch run.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              name: "Thabo M.",
              city: "Johannesburg · Cheesecake",
              stars: 5,
              quote:
                "Discreet, smooth and hits clean. I finally have something that fits the studio schedule without lighting up between takes.",
            },
            {
              name: "Nadia R.",
              city: "Cape Town · Blueberry",
              stars: 5,
              quote:
                "The terpene profile is legit — proper blueberry finish, not a sweetened cover-up. My Sunday reset is sorted.",
            },
            {
              name: "Sipho D.",
              city: "Durban · Bubblegum",
              stars: 4,
              quote:
                "Feels premium the second you open the tin. Onboarding took a minute but the allocation tracker makes it worth it.",
            },
          ].map((r) => (
            <div key={r.name} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-1 text-loud-yellow">
                {[...Array(5)].map((_, k) => (
                  <Star
                    key={k}
                    className={`h-4 w-4 ${k < r.stars ? "fill-loud-yellow" : "text-white/20"}`}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm text-white/80 leading-relaxed">“{r.quote}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full gradient-loud text-[11px] font-semibold text-black">
                  {r.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{r.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">{r.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* FAQ */}
      <section id="faq" className="relative bg-black/40 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">FAQ</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Questions?</h2>
          </div>

          <Accordion type="single" collapsible className="mt-12 space-y-3">
            {[
              {
                q: "What exactly are LOUDMOUF™ pouches?",
                a: "LOUDMOUF™ are premium smoke-free cannabis pouches. Discreet, odourless and designed to deliver a clean, potent experience without lighting up.",
              },
              {
                q: "When does Drop 001 ship?",
                a: "Pre-orders open now. First production run ships within 4 weeks of the campaign closing. You'll get tracking via SMS and email as soon as your order dispatches.",
              },
              {
                q: "Where do you deliver?",
                a: "Anywhere in South Africa via The Courier Guy. Standard delivery is 3–5 working days for a flat R150 fee. Free delivery on orders over R800.",
              },
              {
                q: "How do I track my order?",
                a: "Head to the Track My Order page or check your account dashboard. Every order ships with a Courier Guy waybill number.",
              },
              {
                q: "What's your return policy?",
                a: "Returns and exchanges are valid for 7 days after fulfilment if the product is defective, damaged or the wrong item was delivered. Gift cards and sale items excluded.",
              },
              {
                q: "Is this legal in South Africa?",
                a: "LOUDMOUF™ is sold in compliance with South African cannabis regulations for adult personal use. Strictly 18+ only.",
              },
            ].map((item, i) => (
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

      {/* MEMBERSHIP */}
      <section id="membership" className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 gradient-loud opacity-10" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">Membership</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl text-white">
              Two ways in.
              <br />
              One collective.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {MEMBERSHIP_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl border p-8 backdrop-blur-md overflow-hidden ${plan.recommended ? "border-transparent bg-loud-ink" : "border-white/10 bg-white/[0.03]"}`}
              >
                {plan.recommended && (
                  <>
                    <span className="pointer-events-none absolute inset-0 rounded-3xl gradient-loud opacity-70" />
                    <span className="pointer-events-none absolute inset-[2px] rounded-[calc(1.5rem-2px)] bg-loud-ink" />
                  </>
                )}
                <div className="relative">
                  {plan.recommended && (
                    <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-loud-yellow">
                      <Star className="h-3 w-3" /> Recommended
                    </span>
                  )}
                  <h3 className="display mt-4 text-3xl text-white">{plan.name}</h3>
                  <p className="mt-2 text-sm text-white/60">{plan.tagline}</p>
                  <p className="mt-5 font-display text-5xl text-white">
                    R{plan.monthly}
                    <span className="text-xs uppercase tracking-widest text-white/50 ml-2">
                      / month
                    </span>
                  </p>
                  <ul className="mt-5 space-y-2 text-sm text-white/80">
                    {plan.benefits.slice(0, 5).map((b) => (
                      <li key={b} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-loud-yellow" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/membership"
                    className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-widest ${plan.recommended ? "cta-gradient text-black" : "bg-white text-black hover:bg-white/90"}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAUNCH SUMMIT */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center overflow-hidden relative">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full gradient-loud opacity-20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">Launch Summit</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl text-white">The Collective, live.</h2>
            <p className="mt-4 text-white/70 max-w-md">
              An invite-only night for founding members. Music, tastings, first-run allocations and
              the story behind LOUDMOUF™.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/launch"
                className="cta-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black"
              >
                Reserve Your Seat <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <Countdown />
          </div>
        </div>
      </section>

      {/* PODCAST */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-black/60 p-8 sm:p-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow flex items-center gap-2">
                <Mic className="h-3.5 w-3.5" /> The Big Mood Series
              </p>
              <h2 className="display mt-3 text-4xl sm:text-5xl text-white">Now streaming.</h2>
              <p className="mt-3 max-w-lg text-white/60 text-sm">
                Conversations with the artists, cultivators and creatives shaping the LOUDMOUF™
                Collective. Season One coming soon.
              </p>
            </div>
            <span className="rounded-full glass px-3 py-1.5 text-[10px] uppercase tracking-widest text-gradient-loud font-semibold">
              Season One · Coming Soon
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Spotify", "Apple Podcasts", "YouTube", "Substack", "TikTok"].map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-widest text-white/80"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] uppercase tracking-widest text-white/60">
          {[
            "18+ Members Only",
            "Private Members Club",
            "Secure Verification",
            "POPIA Compliant",
            "Verified Delivery Partner",
            "True Grade (In Progress)",
            "Kosher (In Progress)",
            "Proudly South African",
          ].map((b) => (
            <span key={b} className="glass rounded-full px-3 py-1.5">
              {b}
            </span>
          ))}
        </div>
      </section>

      <Footer />
      <EarlyAccessBar />
      <OnboardingModal />
      <LoudAI />
    </div>
  );
}

function FloatingX({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1 }}
      className={`pointer-events-none absolute animate-float select-none font-display text-8xl ${className}`}
      aria-hidden
    >
      ✕
    </motion.div>
  );
}
