import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { fetchProducts } from "@/lib/shopify";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AgeGate } from "@/components/site/AgeGate";
import { Countdown } from "@/components/site/Countdown";
import { ProductCard } from "@/components/site/ProductCard";
import { Logo } from "@/components/site/Logo";
import { OnboardingModal } from "@/components/site/OnboardingModal";
import { LoudAI } from "@/components/site/LoudAI";
import { PrivateCardSection } from "@/components/site/PrivateCardSection";
import { Newsroom } from "@/components/site/Newsroom";
import { NotificationBar } from "@/components/site/NotificationBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
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
  const [bigMoodModalOpen, setBigMoodModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <AgeGate />
      <NotificationBar />
      <Nav />
      <section id="home" className="relative pt-40 pb-24 sm:pt-48 sm:pb-32">
        <div className="pointer-events-none absolute inset-0 grid-noise" />
        <FloatingX className="top-24 left-[8%] text-loud-yellow/30 rotate-12" />
        <FloatingX className="top-64 right-[10%] text-loud-pink/40 -rotate-6" delay={0.6} />
        <FloatingX className="bottom-40 left-[15%] text-loud-blue/30 rotate-45" delay={1.2} />
        <div className="relative mx-auto max-w-7xl px-6 grid gap-16 lg:grid-cols-[1.05fr_1fr] items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] uppercase tracking-[0.25em] text-loud-yellow">
              <span className="h-1.5 w-1.5 rounded-full bg-loud-yellow animate-pulse" />
              Limited First Production Run · Drop 001
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="display mt-6 text-6xl sm:text-7xl md:text-8xl text-white">
              <span className="text-gradient-loud">BIG</span> Taste.<br /><span className="text-gradient-loud">ZERO</span> Smoke.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-6 max-w-lg text-base sm:text-lg text-white/70">
              South Africa's Private Lifestyle Club for premium cannabis pouches infused with true-grade terpenes. Exercise your constitutional right to private, personal cultivation within a supportive, members-only collective.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/membership" className="cta-gradient group inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-widest text-black shadow-xl hover:opacity-90 transition">
                Become a Member <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
              <a href="#product" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-widest text-white hover:bg-white/10">Secure My Yield</a>
              <a href="#why" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-7 py-4 text-sm font-semibold uppercase tracking-widest text-white/80 hover:text-white hover:border-white/40">Learn More</a>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="mt-10">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/50 mb-3">Drop 001 launches in</p>
              <Countdown />
            </motion.div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-widest text-white/50">
              <div className="flex items-center gap-2"><Leaf className="h-4 w-4 text-loud-yellow" /> Lab Tested</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-loud-yellow" /> Premium Quality</div>
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-loud-yellow" /> 18+ Only</div>
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-loud-yellow" /> Discreet Delivery</div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }} className="relative">
            <div className="absolute -inset-10 gradient-loud opacity-30 blur-3xl rounded-full" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 aspect-square glow-purple">
              <video autoPlay muted loop playsInline poster={heroPoster.url} className="h-full w-full object-cover">
                <source src={heroVideo.url} type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/70">
                <span>Drop 001 · Cheesecake · Blueberry · Bubblegum</span>
                <span className="rounded-full bg-loud-yellow/90 px-2 py-1 text-black font-semibold">Limited</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section aria-hidden className="border-y border-white/10 bg-black py-5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 pr-10 font-display uppercase text-2xl text-white/70">
              {["Big Taste", "Zero Smoke", "Discreet", "Potent", "Unapologetic", "South African", "Lab Tested", "18+ Only"].map((w) => (
                <span key={w} className="flex items-center gap-10">{w} <span className="text-loud-yellow">✕</span></span>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section id="product" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">The Flavours</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Bold Flavours.<br />Zero Smoke.</h2>
          </div>
          <p className="max-w-md text-sm text-white/60">Three signature strains crafted for every mood. Reserve your tin from the first production run — each shipment is capped.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(() => {
            const visible = products.filter((p) => !/member\s*card/i.test(p.node.title));
            if (visible.length === 0) return <div className="col-span-full glass rounded-3xl p-12 text-center text-white/60">No products found. Loading the drop…</div>;
            return visible.map((p, i) => <ProductCard key={p.node.id} product={p} index={i} />);
          })()}
        </div>
      </section>
      <PrivateCardSection />
      <Newsroom limit={4} showViewAll />
      <section id="why" className="relative bg-gradient-to-b from-transparent via-loud-pink/10 to-transparent py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">Why LOUDMOUF™</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Built Different.<br />Made Loud.</h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Leaf, title: "Premium Cannabis", copy: "High-quality cannabis pouches crafted for maximum effect." },
              { icon: ShieldCheck, title: "Discreet & Convenient", copy: "Smoke-free and odourless. Take it anywhere, anytime." },
              { icon: FlaskConical, title: "Lab Tested", copy: "Every batch is lab tested for purity, potency and safety." },
              { icon: Truck, title: "Discreet Delivery", copy: "Fast, discreet and affordable delivery straight to your doorstep." },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass rounded-2xl p-6 hover:border-loud-yellow/40 hover:-translate-y-1 transition">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-loud-yellow/15 text-loud-yellow"><f.icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-sm uppercase tracking-widest text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-white/60">{f.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">How It Works</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Three steps.<br />Zero friction.</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", icon: Package, t: "Reserve", c: "Reserve your tin from our exclusive, limited drops with secure online payment options and direct bank transfer accepted." },
            { n: "02", icon: Sparkles, t: "Production", c: "Your yield is harvested, allocated, lab-tested, carefully packed and shipped into our Cape Town facility for distribution." },
            { n: "03", icon: Truck, t: "Delivery", c: "When your items are ready for delivery, you’ll be notified and our delivery partner delivers discreetly to your doorstep within 3–5 working days anywhere in SA." },
          ].map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md overflow-hidden">
              <div className="absolute -top-6 -right-4 font-display text-[8rem] leading-none text-white/[0.04]">{s.n}</div>
              <s.icon className="h-6 w-6 text-loud-yellow" />
              <h3 className="display mt-6 text-3xl text-white">{s.t}</h3>
              <p className="mt-3 text-sm text-white/60">{s.c}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 grid gap-14 lg:grid-cols-2 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10">
            <img src="https://github.com/user-attachments/assets/6d4f2607-0cc4-4cd6-9757-5ee6f987fae9" alt="LOUDMOUF brand story" className="h-full w-full object-cover" />
          </motion.div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">The Movement</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl md:text-7xl text-white">Not a product.<br /><span className="text-gradient-loud">A statement.</span></h2>
            <p className="mt-6 max-w-lg text-white/70 leading-relaxed">LOUDMOUF™ is for those who want the experience without the smoke. Born in South Africa, built for the unapologetic — musicians, creatives, hustlers and the crew that moves loud without ever needing to raise their voice.</p>
            <p className="mt-4 max-w-lg text-white/70 leading-relaxed">Big flavour. Zero smoke. Stay loud.</p>
            <div className="mt-8"><Logo className="text-6xl md:text-7xl" tone="gradient" /></div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">The Community</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Word on the street.</h2>
          <p className="mt-4 text-white/60">Verified reactions from founding members who tested the first small-batch run.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { name: "Thabo M.", city: "Johannesburg · Cheesecake", stars: 5, quote: "Discreet, smooth and hits clean. I finally have something that fits the studio schedule without lighting up between takes." },
            { name: "Nadia R.", city: "Cape Town · Blueberry", stars: 5, quote: "The terpene profile is legit — proper blueberry finish, not a sweetened cover-up. My Sunday reset is sorted." },
            { name: "Sipho D.", city: "Durban · Bubblegum", stars: 4, quote: "Feels premium the second you open the tin. Onboarding took a minute but the allocation tracker makes it worth it." },
          ].map((r) => (
            <div key={r.name} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-1 text-loud-yellow">{[...Array(5)].map((_, k) => (<Star key={k} className={`h-4 w-4 ${k < r.stars ? "fill-loud-yellow" : "text-white/20"}`} />))}</div>
              <p className="mt-4 text-sm text-white/80 leading-relaxed">“{r.quote}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full gradient-loud text-[11px] font-semibold text-black">{r.name.split(" ").map((s) => s[0]).join("")}</div>
                <div>
                  <p className="text-xs font-semibold text-white">{r.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">{r.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section id="faq" className="relative bg-black/40 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">FAQ</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Questions?</h2>
          </div>
          <Accordion type="single" collapsible className="mt-12 space-y-3">
            {[
              { q: "What exactly are LOUDMOUF™ pouches?", a: "LOUDMOUF™ are premium smoke-free cannabis pouches. Discreet, odourless and designed to deliver a clean, potent experience without lighting up." },
              { q: "When does Drop 001 ship?", a: "Reserves open now. First production run ships within 4 weeks of the campaign closing. You'll get tracking via SMS and email as soon as your order dispatches." },
              { q: "Where do you deliver?", a: "Anywhere in South Africa via our reliable and discreet delivery partner. Standard delivery time is 3–5 working days for a flat R99 fee. Premium members enjoy free nationwide delivery." },
              { q: "Is this legal in South Africa?", a: "LOUDMOUF™ is sold in compliance with South African cannabis regulations for adult personal use. Strictly 18+ only." },
              { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards (Visa, Mastercard), Apple Pay, and direct bank transfer (EFT). All payments are processed securely through our payment gateway." },
              { q: "How does the membership work?", a: "Choose between Standard (R99/month) or Premium (R149/month) membership. Your monthly membership fee gives you access to the Collective, and you request yield allocations separately at R350 per tin." },
              { q: "What if I'm not satisfied with my order?", a: "We offer a 7-day return window for defective, damaged, or incorrect items. Contact us at hi@loudmouf.co.za and we'll make it right. Please note that opened or used products cannot be returned unless defective." },
              { q: "How discreet is the packaging?", a: "Every order arrives in plain, unbranded outer packaging with no visible LOUDMOUF™ branding. Your privacy is our priority." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="glass rounded-2xl border-white/10 px-6">
                <AccordionTrigger className="text-left text-white hover:no-underline uppercase tracking-wider text-sm">{item.q}</AccordionTrigger>
                <AccordionContent className="text-white/60 pb-5">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      <section id="membership" className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 gradient-loud opacity-10" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">Membership</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl text-white">Two ways in.<br />One collective.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {MEMBERSHIP_PLANS.map((plan) => (
              <div key={plan.id} className={`relative rounded-3xl border p-8 backdrop-blur-md overflow-hidden ${plan.recommended ? "border-transparent bg-loud-ink" : "border-white/10 bg-white/[0.03]"}`}>
                {plan.recommended && (<><span className="pointer-events-none absolute inset-0 rounded-3xl gradient-loud opacity-70" /><span className="pointer-events-none absolute inset-[2px] rounded-[calc(1.5rem-2px)] bg-loud-ink" /></>)}
                <div className="relative">
                  {plan.recommended && (<span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-loud-yellow"><Star className="h-3 w-3" /> Recommended</span>)}
                  <h3 className="display mt-4 text-3xl text-white">{plan.name}</h3>
                  <p className="mt-2 text-sm text-white/60">{plan.tagline}</p>
                  <p className="mt-5 font-display text-5xl text-white">R{plan.monthly}<span className="text-xs uppercase tracking-widest text-white/50 ml-2">/ month</span></p>
                  <ul className="mt-5 space-y-2 text-sm text-white/80">{plan.benefits.slice(0, 5).map((b) => (<li key={b} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-loud-yellow" /><span>{b}</span></li>))}</ul>
                  <Link to="/membership" className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-widest ${plan.recommended ? "cta-gradient text-black" : "bg-white text-black hover:bg-white/90"}`}>{plan.cta}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center overflow-hidden relative">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full gradient-loud opacity-20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">Launch Summit</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl text-white">The Collective, live.</h2>
            <p className="mt-4 text-white/70 max-w-md">An invite-only night for founding members. Music, tastings, first-run allocations and the story behind LOUDMOUF™.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link to="/launch" className="cta-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black">Reserve Your Seat <ArrowRight className="h-4 w-4" /></Link></div>
          </div>
          <div className="relative"><Countdown /></div>
        </div>
      </section>
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="relative rounded-3xl p-[2px] bg-gradient-to-r from-loud-yellow via-loud-pink to-loud-blue animate-gradient-x">
          <div className="rounded-3xl bg-black/60 p-8 sm:p-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow flex items-center gap-2"><Mic className="h-3.5 w-3.5" /> The Big Mood Series</p>
                <h2 className="display mt-3 text-4xl sm:text-5xl text-white">Now streaming.</h2>
                <p className="mt-3 max-w-lg text-white/60 text-sm">Conversations with the artists, cultivators and creatives shaping the LOUDMOUF™ Collective. Season One coming soon.</p>
              </div>
              <span className="rounded-full glass px-3 py-1.5 text-[10px] uppercase tracking-widest text-white font-bold">SEASON ONE · COMING SOON</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">{["Spotify", "Apple Podcasts", "YouTube", "Substack", "TikTok"].map((p) => (<span key={p} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-widest text-white/80">{p}</span>))}</div>
            <div className="mt-6">
              <Button onClick={() => setBigMoodModalOpen(true)} className="cta-gradient text-black font-semibold uppercase tracking-widest hover:opacity-90">
                View The Program
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={bigMoodModalOpen} onOpenChange={setBigMoodModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-loud-ink border-white/10">
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <img src="https://github.com/user-attachments/assets/9590cef8-0e82-45c6-8e2f-88e1a818dbf4" alt="The Big Mood Series" className="h-16 w-auto" />
              </div>
              <DialogTitle className="text-center text-white text-2xl font-display uppercase">The Big Mood Series</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 text-white/80">
              <p className="text-center leading-relaxed">
                We dive into the trends, the people, the business, the plant and everything in between. From local changemakers to global disruptors — we spark conversations that matter.
              </p>
              <p className="text-center font-semibold text-white">
                Big guests. Bigger insights. All in The Big Mood.
              </p>

              <div className="space-y-6 mt-8">
                <h3 className="text-xl font-display uppercase text-loud-yellow text-center">Season 1 Episodes</h3>
                
                <div className="glass rounded-2xl p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-loud-yellow font-display text-xl">01</span>
                    <div>
                      <h4 className="font-semibold text-white text-lg">The Green Rush</h4>
                      <p className="text-sm text-loud-yellow/80 mb-2">Building the Future of Cannabis in SA</p>
                      <p className="text-sm text-white/70">
                        South Africa's cannabis economy is being built right now. We map the players, the money and the openings nobody's talking about yet.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-loud-yellow font-display text-xl">02</span>
                    <div>
                      <h4 className="font-semibold text-white text-lg">High Culture</h4>
                      <p className="text-sm text-loud-yellow/80 mb-2">Weed, Art & The New Creative Economy</p>
                      <p className="text-sm text-white/70">
                        From studio sessions to gallery walls — how cannabis is quietly funding and fuelling a new wave of South African creativity.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-loud-yellow font-display text-xl">03</span>
                    <div>
                      <h4 className="font-semibold text-white text-lg">From Plug to CEO</h4>
                      <p className="text-sm text-loud-yellow/80 mb-2">Stories of the New Cannabis Wave</p>
                      <p className="text-sm text-white/70">
                        The people who moved from informal supply to registered enterprise, and what it actually took to make that jump legit.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-loud-yellow font-display text-xl">04</span>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Women In Weed</h4>
                      <p className="text-sm text-loud-yellow/80 mb-2">Leading Loud & Proud</p>
                      <p className="text-sm text-white/70">
                        The founders, growers and educators leading South Africa's cannabis industry — and why the room is finally starting to look different.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-loud-yellow font-display text-xl">05</span>
                    <div>
                      <h4 className="font-semibold text-white text-lg">The Science of High</h4>
                      <p className="text-sm text-loud-yellow/80 mb-2">Terpenes, Entourage & You</p>
                      <p className="text-sm text-white/70">
                        A plain-English breakdown of terpenes and the entourage effect — the science behind why every strain hits differently.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-loud-yellow font-display text-xl">06</span>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Smoking Mirrors</h4>
                      <p className="text-sm text-loud-yellow/80 mb-2">Busting Cannabis Myths in 2025</p>
                      <p className="text-sm text-white/70">
                        We put the internet's favourite weed myths on trial — what's true, what's outdated, and what was never real to begin with.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-loud-yellow font-display text-xl">07</span>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Legalize It Right</h4>
                      <p className="text-sm text-loud-yellow/80 mb-2">Policy, Politics & Progress</p>
                      <p className="text-sm text-white/70">
                        Where South African cannabis law actually stands today, what's still stuck in Parliament, and who's fighting to move it.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-loud-yellow font-display text-xl">08</span>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Weed & Wellness</h4>
                      <p className="text-sm text-loud-yellow/80 mb-2">Healing Beyond The High</p>
                      <p className="text-sm text-white/70">
                        Sleep, pain, anxiety, focus — the wellness use cases driving a quieter, more clinical side of cannabis culture.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-loud-yellow font-display text-xl">09</span>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Global Loud Pack</h4>
                      <p className="text-sm text-loud-yellow/80 mb-2">What the World Can Learn from SA</p>
                      <p className="text-sm text-white/70">
                        South Africa versus the world — how local cannabis culture compares, and where it's actually setting the pace.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-loud-yellow font-display text-xl">10</span>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Next Gen Stoners</h4>
                      <p className="text-sm text-loud-yellow/80 mb-2">Gen Z, Cannabis & Culture</p>
                      <p className="text-sm text-white/70">
                        How the youngest generation of consumers is rewriting the rules — different habits, different values, same plant.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </section>
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] uppercase tracking-widest text-white/60">
          {["18+ Members Only", "Private Members Club", "Secure Verification", "POPIA Compliant", "Verified Delivery Partner", "True Grade (In Progress)", "Kosher (In Progress)", "Proudly South African"].map((b) => (<span key={b} className="glass rounded-full px-3 py-1.5">{b}</span>))}
        </div>
      </section>
      <Footer />
      <OnboardingModal />
      <LoudAI />
    </div>
  );
}

function FloatingX({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 1 }} className={`pointer-events-none absolute animate-float select-none font-display text-8xl ${className}`} aria-hidden>
      ✕
    </motion.div>
  );
}
