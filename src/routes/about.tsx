import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Logo } from "@/components/site/Logo";
import {
  Sparkles,
  Users,
  Newspaper,
  Package,
  Mic,
  Calendar,
  Brain,
  ShoppingBag,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LOUDMOUF™" },
      {
        name: "description",
        content:
          "LOUDMOUF™ is an 18+ members-only platform combining culture, community, content, and premium cannabis products. Discover our brand philosophy, ecosystem, LOUD AI, merchandise, events, and the vision behind South Africa's boldest cannabis lifestyle collective.",
      },
      { property: "og:title", content: "About LOUDMOUF™" },
      {
        property: "og:description",
        content:
          "An 18+ members-only platform for premium cannabis culture, content, community, and products. Built for the unapologetic.",
      },
    ],
    links: [{ rel: "canonical", href: "https://loudmouf.co.za/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      <Nav />

      {/* Hero */}
      <section className="relative pt-40 pb-24">
        <div className="pointer-events-none absolute inset-0 grid-noise" />
        <div className="relative mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-gradient-loud font-semibold">
              About LOUDMOUF™
            </p>
            <h1 className="display mt-4 text-5xl sm:text-7xl text-white">
              Built for the <span className="text-gradient-loud">Unapologetic.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-white/70 text-base sm:text-lg">
              LOUDMOUF™ is more than a product — it's a platform, a community, and a movement for
              those who want the experience without the smoke.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is LOUDMOUF™? */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="glass rounded-3xl p-8 sm:p-12">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">
              What is LOUDMOUF™?
            </p>
            <h2 className="display mt-3 text-4xl sm:text-5xl text-white">
              Big Taste. Zero Smoke.
            </h2>
            <div className="mt-6 space-y-4 text-white/70 leading-relaxed">
              <p>
                LOUDMOUF™ is South Africa's first private lifestyle club built around premium
                cannabis pouches infused with true-grade terpenes. We're a members-only collective
                where culture meets convenience, and quality is non-negotiable.
              </p>
              <p>
                Founded for musicians, creatives, hustlers, and everyone who moves loud without
                needing to raise their voice — LOUDMOUF™ delivers the experience, the community,
                and the products you won't find anywhere else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-transparent via-loud-pink/10 to-transparent">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">Our Philosophy</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl text-white">
              Culture over hype.<br />Community over scale.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Premium by Design",
                copy: "Every product, every interaction, every piece of content is crafted to reflect a lifestyle — not a transaction.",
              },
              {
                title: "Discreet & Intentional",
                copy: "We operate in the space between loud and low-key. Bold enough to stand out, refined enough to blend in.",
              },
              {
                title: "Built for the Collective",
                copy: "LOUDMOUF™ isn't just for early adopters — it's for the culture-makers, the risk-takers, and the community that moves together.",
              },
              {
                title: "Authentically South African",
                copy: "Born in Cape Town, rooted in local culture, and proudly building something the world hasn't seen before.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-sm uppercase tracking-widest text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-white/60">{item.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Ecosystem */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">The Ecosystem</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl text-white">
              More than pouches.
            </h2>
            <p className="mt-4 text-white/60">
              LOUDMOUF™ is a full-spectrum platform — products, content, community, AI, events, and
              culture, all in one place.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Package,
                title: "Yield Profiles",
                copy: "Premium cannabis pouches in three signature strains: Cheesecake, Blueberry, Bubblegum.",
              },
              {
                icon: Users,
                title: "Members-Only Access",
                copy: "Standard and Premium memberships unlock exclusive drops, community perks, and priority allocations.",
              },
              {
                icon: Newspaper,
                title: "Newsroom",
                copy: "Editorial content covering culture, cannabis, business, policy, and the people shaping the industry.",
              },
              {
                icon: Mic,
                title: "The Big Mood Series",
                copy: "A podcast and video series exploring cannabis culture, creativity, and the South African landscape.",
              },
              {
                icon: ShoppingBag,
                title: "Merchandise",
                copy: "Official LOUDMOUF™ apparel and accessories. Coming September 2026.",
              },
              {
                icon: Calendar,
                title: "Launch Summit",
                copy: "An intimate, members-only event for the collective. First summit: October 30, 2026.",
              },
              {
                icon: Brain,
                title: "LOUD AI",
                copy: "Your personal concierge for membership, products, platform navigation, and community questions.",
              },
              {
                icon: Sparkles,
                title: "Community",
                copy: "A private space for members to connect, share, and grow the culture together.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 hover:border-loud-yellow/40 hover:-translate-y-1 transition"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-loud-yellow/15 text-loud-yellow">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-sm uppercase tracking-widest text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-white/60">{item.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 backdrop-blur-md overflow-hidden relative">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full gradient-loud opacity-20 blur-3xl" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">The Vision</p>
              <h2 className="display mt-3 text-4xl sm:text-5xl text-white">
                Not a product.<br />
                <span className="text-gradient-loud">A statement.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-white/70 leading-relaxed">
                LOUDMOUF™ is building the future of cannabis culture in South Africa. We're not
                just selling pouches — we're creating a lifestyle, a platform, and a community that
                redefines what it means to be loud.
              </p>
              <p className="mt-4 max-w-2xl text-white/70 leading-relaxed">
                From premium products and editorial content to AI-powered support and members-only
                events, we're building an ecosystem that reflects the culture we come from and the
                future we're moving toward.
              </p>
              <p className="mt-4 max-w-2xl text-white/70 leading-relaxed">
                Big flavour. Zero smoke. Stay loud.
              </p>
              <div className="mt-8">
                <Logo className="text-6xl md:text-7xl" tone="gradient" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="display text-4xl sm:text-5xl text-white">
            Ready to join the collective?
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Become a member and get access to exclusive drops, premium content, and a community
            that moves loud.
          </p>
          <div className="mt-8">
            <a
              href="/membership"
              className="cta-gradient inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-widest text-black shadow-xl hover:opacity-90 transition"
            >
              Become a Member
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
