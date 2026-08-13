import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

/**
 * Static CDN image asset only — not a Shopify API dependency.
 */
const MEMBER_CARD_IMAGE =
  "https://github.com/user-attachments/assets/f7c25d2f-743a-47b0-95ad-da6ff3146fb1";

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
          <div className="relative rounded-[28px] border border-white/15 shadow-2xl overflow-hidden bg-black/40">
          className="relative"
            <img
              src={MEMBER_CARD_IMAGE}
              alt="LOUDMOUF Premium Private Club Member Card illustrative preview"
              className="w-full h-auto object-contain select-none"
              draggable={false}
              loading="lazy"
              decoding="async"
              width={800}
              height={504}
            />
          </div>
          <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-white/40">
            Illustrative preview · your card details are unique
          </p>
        </motion.div>
      </div>
    </section>
  );
}
