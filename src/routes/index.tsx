import { createFileRoute } from "@tanstack/react-router";
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
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ShieldCheck, Leaf, FlaskConical, Truck, Sparkles, Package, Clock, MessageSquare, Star } from "lucide-react";

// Import asset JSON files - these contain URLs to Lovable.dev hosted assets
import heroPoster from "@/assets/hero-poster.png.asset.json";
import heroVideo from "@/assets/hero.mp4.asset.json";
import storyImg from "@/assets/story.png.asset.json";
import productsHero from "@/assets/products-hero.png.asset.json";
import adCreative from "@/assets/ad-creative.png.asset.json";

// Helper to safely get asset URL from .asset.json
const getAssetUrl = (asset: { url?: string } | undefined): string => {
  if (!asset?.url) {
    console.warn('Asset URL not found, using fallback');
    return '/placeholder.png';
  }
  // In production, convert relative URLs to absolute if needed
  if (asset.url.startsWith('/__l5e/')) {
    return `https://storage.googleapis.com/gpt-engineer-file-uploads${asset.url.replace('/__l5e/', '/')}`;
  }
  return asset.url;
};

import { useState } from 'react';
import AmbassadorModal from '@/components/site/AmbassadorModal'; // Adjust path if needed

// Inside your component:
const [isAmbassadorModalOpen, setIsAmbassadorModalOpen] = useState(false);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LOUDMOUF™ — Big Taste. Zero Smoke. Pre-Order Now." },
      {
        name: "description",
        content:
          "Premium South African cannabis pouches. Discreet. Potent. Unapologetic. Reserve the first production run of LOUDMOUF™ — Cheesecake, Blueberry and Bubblegum. Free delivery over R800.",
      },
      { property: "og:title", content: "LOUDMOUF™ — Big Taste. Zero Smoke." },
      { property: "og:description", content: "Reserve the first production run of LOUDMOUF™ premium cannabis pouches. 18+ only." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: getAssetUrl(adCreative) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: getAssetUrl(adCreative) },
    ],
    links: [{ rel: "canonical", href: "https://app.loudmouf.co.za/" }],
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
        <FloatingX className="top-64 right-[10%] text-loud-purple/40 -rotate-6" delay={0.6} />
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
              <span className="italic text-loud-yellow">Big</span> Taste.
              <br />
              <span className="italic text-loud-purple">Zero</span> Smoke.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 max-w-lg text-base sm:text-lg text-white/70"
            >
              South Africa's first cannabis pouches infused with premium true-grade terpenes. Exercise your constitutional right to personal cultivation within a supportive, members-only collective.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#preorder"
                className="cta-gradient group inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-widest text-black shadow-xl hover:opacity-90 transition"
              >
                Join The Collective <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </a>
              <a
                href="#product"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-widest text-white hover:bg-white/10"
              >
                View Yield Profiles
              </a>
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-10"
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/50 mb-3">Drop 001 launches in</p>
              <Countdown />
            </motion.div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-widest text-white/50">
              <div className="flex items-center gap-2"><Leaf className="h-4 w-4 text-loud-yellow" /> Lab Tested</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-loud-yellow" /> Premium Quality</div>
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-loud-yellow" /> 18+ Only</div>
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-loud-yellow" /> Discreet Delivery</div>
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
                poster={getAssetUrl(heroPoster)}
                className="h-full w-full object-cover"
              >
                <source src={getAssetUrl(heroVideo)} type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/70">
                <span>Drop 001 · Cheesecake · Blueberry · Bubblegum</span>
                <span className="rounded-full bg-loud-yellow/90 px-2 py-1 text-black font-semibold">Limited Drop</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <section aria-hidden className="border-y border-white/10 bg-black py-5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 pr-10 font-display uppercase text-2xl text-white/70">
              {["Big Taste", "Zero Smoke", "Discreet", "Potent", "Unapologetic", "South African", "Lab Tested", "18+ Only"].map((w) => (
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
            <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Bold Flavours.<br />Zero Smoke.</h2>
          </div>
          <p className="max-w-md text-sm text-white/60">
            Three signature strains crafted for every mood. Reserve your tin from the first production run — each shipment
            is capped.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <div className="col-span-full glass rounded-3xl p-12 text-center text-white/60">
              No products found. Loading the drop…
            </div>
          ) : (
            products.map((p, i) => <ProductCard key={p.node.id} product={p} index={i} />)
          )}
        </div>
      </section>

      {/* WHY LOUDMOUF */}
      <section id="why" className="relative bg-gradient-to-b from-transparent via-loud-purple/10 to-transparent py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">Why LOUDMOUF™?</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Built Different.<br />Made Loud.</h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Leaf, title: "Premium Cannabis", copy: "High-quality cannabis pouches crafted for maximum effect." },
              { icon: ShieldCheck, title: "Discreet & Convenient", copy: "Smoke-free and odourless. Take it anywhere, anytime." },
              { icon: FlaskConical, title: "Lab Tested", copy: "Every batch is lab tested for purity, potency and safety." },
              { icon: Truck, title: "Discreet Delivery", copy: "Fast, discreet Courier Guy delivery straight to your door." },
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
          <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Three steps.<br />Zero friction.</h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", icon: Package, t: "Pre-Order", c: "Secure your yield from Drop 001 with secure checkout via Shopify." },
            { n: "02", icon: Sparkles, t: "Production", c: "Your tin is lab-tested, packed and readied at our Cape Town facility." },
            { n: "03", icon: Truck, t: "Delivery", c: "Our courier partner delivers your yield discreetly within 3–5 working days across South Africa." },
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
            <img src={getAssetUrl(storyImg)} alt="LOUDMOUF brand story" className="h-full w-full object-cover" />
          </motion.div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">The Movement</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl md:text-7xl text-white">
              Not a product.
              <br />
              <span className="text-gradient-loud">A statement.</span>
            </h2>
            <p className="mt-6 max-w-lg text-white/70 leading-relaxed">
              LOUDMOUF™ is for those who want the experience without the smoke. Born in South Africa, built for the
              unapologetic — musicians, creatives, hustlers and the crew that moves loud without ever needing to raise
              their voice.
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

      {/* COMMUNITY / REVIEWS + PRESS + AMBASSADOR */}
<section className="mx-auto max-w-7xl px-6 py-24">
  <div className="max-w-2xl">
    <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">The Community</p>
    <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Word on the street.</h2>
    <p className="mt-4 text-white/60">
      Real excitement building for Drop 001. Here’s what early community members are saying.
    </p>
  </div>

  {/* 3 Community Reviews (4–5 Stars) */}
  <div className="mt-10 grid gap-6 md:grid-cols-3">
    {/* Review 1 */}
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-1 text-loud-yellow">
        {[...Array(5)].map((_, k) => (
          <Star key={k} className="h-5 w-5 fill-current" />
        ))}
      </div>
      <p className="mt-4 text-white">
        "I've been waiting for something this fresh in the space. The quality and vibe are next level. 
        Can't wait to get my hands on Drop 001 — this is going to be epic! 😮‍💨🔥"
      </p>
      <div className="mt-6 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
        <div>
          <div className="font-medium text-white">@SiphoTheCreator</div>
          <div className="text-xs text-white/50">Cape Town • Founding Member</div>
        </div>
      </div>
    </div>

    {/* Review 2 */}
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-1 text-loud-yellow">
        {[...Array(5)].map((_, k) => (
          <Star key={k} className="h-5 w-5 fill-current" />
        ))}
      </div>
      <p className="mt-4 text-white">
        "Loudmouf is bringing real culture and premium drops together. The hype is real — 
        already telling all my friends to lock in for the first release. This is the one! 🤞💯"
      </p>
      <div className="mt-6 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500" />
        <div>
          <div className="font-medium text-white">@southsidemohammed</div>
          <div className="text-xs text-white/50">Johannesburg • Musician/Artist</div>
        </div>
      </div>
    </div>

    {/* Review 3 */}
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-1 text-loud-yellow">
        {[...Array(4)].map((_, k) => (
          <Star key={k} className="h-5 w-5 fill-current" />
        ))}
        <Star className="h-5 w-5 text-white/30" />
      </div>
      <p className="mt-4 text-white">
        "The branding, the energy, the community focus — Loudmouf is different. 
        Super excited for Drop 001. This feels like the start of something special."
      </p>
      <div className="mt-6 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500" />
        <div>
          <div className="font-medium text-white">@NandiVibes</div>
          <div className="text-xs text-white/50">Durban • Influencer</div>
        </div>
      </div>
    </div>
  </div>

  {/* Press Logos */}
  <div className="mt-16">
    <p className="text-center text-xs uppercase tracking-[0.3em] text-white/50 mb-6">
      AS FEATURED IN
    </p>
    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-75">
      <img 
        src="/logos/businessbagel.svg" 
        alt="Business Bagel" 
        className="h-8 w-auto grayscale hover:grayscale-0 transition-all" 
      />
      <img 
        src="/logos/gravitas.svg" 
        alt="Gravitas Industries" 
        className="h-8 w-auto grayscale hover:grayscale-0 transition-all" 
      />
      <img 
        src="/logos/nsbc.svg" 
        alt="NSBC Africa" 
        className="h-8 w-auto grayscale hover:grayscale-0 transition-all" 
      />
    </div>
  </div>

  {/* Brand Ambassador CTA Button */}
  <div className="mt-16 flex justify-center">
    <button 
      onClick={() => setIsAmbassadorModalOpen(true)}
      className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-black font-medium hover:bg-loud-yellow transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <span>Become a Loudmouf Brand Ambassador</span>
      <span className="text-xl group-hover:rotate-12 transition-transform">✦</span>
    </button>
  </div>

  <p className="text-center mt-4 text-xs text-white/50">
    For social media influencers & creators • Limited spots for Drop 001
  </p>

  {/* Ambassador Modal */}
  <AmbassadorModal 
    isOpen={isAmbassadorModalOpen} 
    onClose={() => setIsAmbassadorModalOpen(false)} 
  />
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
              <AccordionItem key={i} value={`item-${i}`} className="glass rounded-2xl border-white/10 px-6">
                <AccordionTrigger className="text-left text-white hover:no-underline uppercase tracking-wider text-sm">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 pb-5">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* PRE-ORDER CTA */}
      <section id="preorder" className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 gradient-loud opacity-25" />
        <div className="absolute inset-0 grid-noise" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">Reserve Your Tin</p>
          <h2 className="display mt-4 text-6xl sm:text-7xl md:text-8xl text-white">
            Drop 001 is <span className="italic text-loud-yellow">loud</span>.
            <br />
            And limited.
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-white/70">
            Only 2,000 tins from the first production run. Reserve yours before the campaign closes.
          </p>

          <div className="mt-10 mx-auto max-w-md">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-white/60 mb-2">
              <span>Founding members · limited to 2,000</span>
              <span className="text-gradient-loud font-semibold">25% off</span>
            </div>
            <Progress value={62} className="h-2 bg-white/10" />
          </div>

          <div className="mt-10 flex justify-center">
            <Countdown />
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="#product"
              className="cta-gradient group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-widest text-black shadow-xl hover:opacity-90 transition"
            >
              Reserve My Monthly Share <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </a>
            <a
              href="https://wa.me/27680200749"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white hover:bg-white/10"
            >
              <MessageSquare className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-widest text-white/50">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-loud-yellow" /> Secure Online Payments</div>
            <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-loud-yellow" /> Founding Member Portal</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-loud-yellow" /> Launch Summit Access Pass</div>
          </div>

            <img src={getAssetUrl(productsHero)} alt="LOUDMOUF product lineup" className="mx-auto w-full rounded-3xl border border-white/10" loading="lazy" />
        </div>
      </section>

      <Footer />
      <EarlyAccessBar />
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
