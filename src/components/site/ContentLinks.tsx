// Small, reusable components dropped between article paragraphs to build deep
// internal links from long-form Newsroom content into the commerce pages —
// used by the automated newsroom pipeline's rendering layer (see
// src/lib/internal-links.ts) so every generated article carries real,
// crawlable links to /membership, /store, /herbal-tinctures etc.
import type { ReactNode } from "react";
import { ArrowUpRight, Leaf, ShoppingBag, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ProductTeaserSpec {
  href: string;
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
  icon: LucideIcon;
  accent: string;
}

export const PRODUCT_TEASERS = {
  membership: {
    href: "/membership",
    eyebrow: "LOUDMOUF™ Membership",
    title: "Standard R99 · Premium R149 a month",
    copy: "Join the Private Lifestyle Club for member pricing and a monthly allocation of LOUDMOUF™ cannabis pouches.",
    cta: "See membership tiers",
    icon: Sparkles,
    accent: "#FFCC33",
  },
  store: {
    href: "/store",
    eyebrow: "Shop the Collection",
    title: "Cheesecake · Bubblegum · Blueberry",
    copy: "Big taste, zero smoke — discreet, lab-tested cannabis pouches infused with premium terpenes.",
    cta: "Shop LOUDMOUF™ pouches",
    icon: ShoppingBag,
    accent: "#FF3CA5",
  },
  tinctures: {
    href: "/herbal-tinctures",
    eyebrow: "Premium Herbal Tinctures",
    title: "Morning, Afternoon & Night — 100mg per bottle",
    copy: "Three lab-tested botanical tinctures built for a day-to-night ritual. Reserve your bottle now.",
    cta: "Explore the tinctures",
    icon: Leaf,
    accent: "#BF7826",
  },
  partners: {
    href: "/partner-program",
    eyebrow: "Partner Program",
    title: "Earn 10% commission as a LOUDMOUF™ Ambassador",
    copy: "Share your referral link and earn on every member you bring into the Collective.",
    cta: "Become a partner",
    icon: Users,
    accent: "#6B1DFF",
  },
} satisfies Record<string, ProductTeaserSpec>;

export type ProductTeaserId = keyof typeof PRODUCT_TEASERS;

export function ProductTeaserCard({ id }: { id: ProductTeaserId }) {
  const spec = PRODUCT_TEASERS[id];
  if (!spec) return null;
  const Icon = spec.icon;
  return (
    <a
      href={spec.href}
      className="not-prose group my-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 no-underline backdrop-blur-md transition hover:border-white/25 hover:bg-white/[0.05]"
      style={{ borderColor: `color-mix(in oklab, ${spec.accent} 25%, transparent)` }}
    >
      <div
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
        style={{ backgroundColor: `color-mix(in oklab, ${spec.accent} 22%, transparent)` }}
      >
        <Icon className="h-5 w-5" style={{ color: spec.accent }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">{spec.eyebrow}</p>
        <p className="mt-1 text-base font-semibold leading-snug text-white">{spec.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-white/60">{spec.copy}</p>
      </div>
      <span className="hidden shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-widest text-loud-yellow group-hover:text-white sm:inline-flex">
        {spec.cta} <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}

export function RelatedArticleLink({
  href,
  title,
  kicker = "Continue Reading",
}: {
  href: string;
  title: string;
  kicker?: string;
}) {
  return (
    <a
      href={href}
      className="not-prose group my-8 block rounded-2xl border border-loud-yellow/20 bg-loud-yellow/[0.04] p-5 no-underline transition hover:border-loud-yellow/40 hover:bg-loud-yellow/[0.08]"
    >
      <p className="text-[10px] uppercase tracking-[0.25em] text-loud-yellow">{kicker}</p>
      <p className="mt-2 flex items-center gap-2 text-lg font-semibold leading-snug text-white group-hover:text-loud-yellow">
        {title}
        <ArrowUpRight className="h-4 w-4 shrink-0" />
      </p>
    </a>
  );
}

export function InlineTextLink({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="font-semibold text-loud-yellow underline decoration-loud-yellow/40 underline-offset-4 transition hover:text-white hover:decoration-white/60"
    >
      {children}
    </a>
  );
}
