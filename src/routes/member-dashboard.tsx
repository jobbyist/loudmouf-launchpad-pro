import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { LoudAI } from "@/components/site/LoudAI";
import {
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Gift,
  Leaf,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/member-dashboard")({
  head: () => ({
    meta: [
      { title: "Member Dashboard — LOUDMOUF™" },
      {
        name: "description",
        content:
          "Your LOUDMOUF™ member portal — membership status, personal allocation tracker, yield history, rewards balance and community updates.",
      },
      { property: "og:title", content: "Member Dashboard — LOUDMOUF™" },
      {
        property: "og:description",
        content: "Your LOUDMOUF™ personal allocation tracker, yield history and rewards balance.",
      },
    ],
  }),
  component: MemberDashboard,
});

interface StoredMember {
  firstName?: string;
  lastName?: string;
  email?: string;
  tier?: "standard" | "premium";
  verifiedAt?: string;
}

function MemberDashboard() {
  const [member, setMember] = useState<StoredMember | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("loudmouf-member-profile");
      if (raw) setMember(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const tierLabel =
    member?.tier === "premium" ? "Premium" : member?.tier === "standard" ? "Standard" : "Guest";
  const verified = !!member?.verifiedAt;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <Nav />

      <section className="relative pt-36 pb-10 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 grid-noise" />
        <div className="relative mx-auto max-w-6xl px-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs uppercase tracking-[0.3em] text-loud-yellow"
          >
            Member Portal
          </motion.p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h1 className="display text-5xl sm:text-6xl text-white">
              Welcome{member?.firstName ? `, ${member.firstName}` : ""}.
            </h1>
            <div className="flex items-center gap-3">
              <span className="glass rounded-full px-3 py-1.5 text-[11px] uppercase tracking-widest text-white/80 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-loud-yellow" /> {tierLabel} Member
              </span>
              <span className="glass rounded-full px-3 py-1.5 text-[11px] uppercase tracking-widest text-white/80 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-loud-yellow" />
                {verified ? "Verified" : "Verification pending"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-24 space-y-6">
        {/* Top status cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            icon={CreditCard}
            title="Membership"
            body={`${tierLabel} · R${member?.tier === "premium" ? 149 : 99}/mo`}
            cta={{ label: "Manage plan", href: "/membership" }}
          />
          <Card
            icon={Leaf}
            title="Current Cycle"
            body="0 yield shares requested"
            cta={{ label: "Request allocation", href: "/#product" }}
          />
          <Card
            icon={Wallet}
            title="Rewards Balance"
            body={
              member?.tier === "premium" ? "0 pts · Cashback active" : "Upgrade to Premium to earn"
            }
            cta={{
              label: member?.tier === "premium" ? "View rewards" : "Upgrade",
              href: "/membership",
            }}
          />
        </div>

        {/* Secondary grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatBlock icon={FileText} title="Yield History" hint="No allocations yet" />
          <StatBlock icon={Bell} title="Notifications" hint="You're all caught up" />
          <StatBlock
            icon={Calendar}
            title="Events"
            hint="Launch Summit · 11 Aug 2026"
            href="/launch"
          />
          <StatBlock icon={Gift} title="Merch Drops" hint="Priority list coming soon" />
        </div>

        {/* Documents */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
          <h2 className="font-display text-2xl uppercase text-white">Documents</h2>
          <p className="mt-1 text-sm text-white/60">Your active agreements and policies.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { label: "Membership Agreement", to: "/terms" },
              { label: "Community Guidelines", to: "/community-guidelines" },
              { label: "Privacy Policy", to: "/privacy-policy" },
              { label: "Refund Policy", to: "/refund-policy" },
            ].map((d) => (
              <Link
                key={d.to}
                to={d.to}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:border-loud-yellow/40 hover:text-loud-yellow transition"
              >
                <span>{d.label}</span>
                <span className="text-[10px] uppercase tracking-widest text-white/40">View →</span>
              </Link>
            ))}
          </div>
        </div>

        {!member && (
          <div className="rounded-3xl border border-loud-yellow/30 bg-loud-yellow/5 p-6 text-sm text-white/80">
            <p className="font-semibold uppercase tracking-widest text-loud-yellow text-xs">
              Not a member yet?
            </p>
            <p className="mt-2">This dashboard becomes yours the moment you complete onboarding.</p>
            <Link
              to="/membership"
              className="cta-gradient mt-4 inline-flex items-center rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-black"
            >
              Become a Member
            </Link>
          </div>
        )}
      </section>

      <Footer />
      <LoudAI />
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  body,
  cta,
}: {
  icon: typeof Sparkles;
  title: string;
  body: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 text-loud-yellow">
        <Icon className="h-4 w-4" />
        <p className="text-[11px] uppercase tracking-widest">{title}</p>
      </div>
      <p className="mt-3 font-display text-2xl text-white">{body}</p>
      <Link
        to={cta.href}
        className="mt-4 inline-flex text-xs uppercase tracking-widest text-white/70 hover:text-loud-yellow"
      >
        {cta.label} →
      </Link>
    </div>
  );
}

function StatBlock({
  icon: Icon,
  title,
  hint,
  href,
}: {
  icon: typeof Sparkles;
  title: string;
  hint: string;
  href?: string;
}) {
  const Wrap: React.ElementType = href ? Link : "div";
  const props = href ? { to: href } : {};
  return (
    <Wrap
      {...props}
      className="block rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-loud-yellow/30 transition"
    >
      <Icon className="h-4 w-4 text-loud-yellow" />
      <p className="mt-3 text-sm font-semibold text-white uppercase tracking-widest">{title}</p>
      <p className="mt-1 text-xs text-white/50">{hint}</p>
    </Wrap>
  );
}
