import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Copy, Gift, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/referrals")({
  head: () => ({
    meta: [
      { title: "Referrals · LOUDMOUF™ Collective — 10% Monthly Commission" },
      {
        name: "description",
        content:
          "Earn 10% ongoing monthly commission on membership fees and 10% on new-member yield allocations. Join the LOUDMOUF™ Collective Ambassador Programme.",
      },
      { property: "og:title", content: "LOUDMOUF™ Referrals — 10% Commission" },
      {
        property: "og:description",
        content:
          "Promote LOUDMOUF™ and earn 10% recurring commission on every member you introduce to the Collective.",
      },
    ],
  }),
  component: ReferralsPage,
});

function ReferralsPage() {
  const [code, setCode] = useState<string | null>(null);
  const [totals, setTotals] = useState({ signups: 0, pendingCents: 0, paidCents: 0 });
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) {
        setSignedIn(false);
        return;
      }
      setSignedIn(true);
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", userRes.user.id)
        .maybeSingle();
      setCode(profile?.referral_code ?? null);
      const { data: attrs } = await supabase
        .from("referral_attributions")
        .select("commission_cents, status");
      const rows = attrs ?? [];
      setTotals({
        signups: rows.length,
        pendingCents: rows
          .filter((r) => r.status === "pending" || r.status === "approved")
          .reduce((s, r) => s + (r.commission_cents ?? 0), 0),
        paidCents: rows
          .filter((r) => r.status === "paid")
          .reduce((s, r) => s + (r.commission_cents ?? 0), 0),
      });
    })();
  }, []);

  const link = code ? `https://loudmouf.co.za/?ref=${code}` : "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-loud-yellow">
            Ambassador Programme
          </p>
          <h1 className="display mt-3 text-5xl sm:text-6xl md:text-7xl text-white">
            Promote LOUDMOUF™.
            <br />
            <span className="text-gradient-loud">Earn 10% recurring.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Share your personal link. Every member who joins the Collective through you earns you
            an ongoing <strong className="text-white">10% monthly commission</strong> on their
            membership fee and a <strong className="text-white">one-off 10% commission</strong> on
            their first yield allocation.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Users, k: "Referred Members", v: totals.signups },
              {
                icon: TrendingUp,
                k: "Pending Commission",
                v: `R${(totals.pendingCents / 100).toFixed(2)}`,
              },
              {
                icon: Gift,
                k: "Paid Out",
                v: `R${(totals.paidCents / 100).toFixed(2)}`,
              },
            ].map((s) => (
              <div key={s.k} className="glass rounded-2xl p-5">
                <s.icon className="h-5 w-5 text-loud-yellow" />
                <p className="mt-3 text-[11px] uppercase tracking-widest text-white/50">{s.k}</p>
                <p className="mt-1 font-display text-3xl text-white">{s.v}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 glass rounded-3xl p-6">
            {signedIn === false ? (
              <div className="text-center py-6">
                <p className="text-sm text-white/70">
                  Sign in or create your member account to activate your referral link.
                </p>
                <Link
                  to="/auth"
                  className="mt-4 inline-flex items-center rounded-full bg-white text-black px-6 py-3 text-xs uppercase tracking-widest font-semibold"
                >
                  Sign in to Continue
                </Link>
              </div>
            ) : code ? (
              <>
                <p className="text-[11px] uppercase tracking-widest text-white/50">Your link</p>
                <div className="mt-3 flex gap-2">
                  <input
                    readOnly
                    value={link}
                    className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-3 text-sm text-white font-mono"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(link);
                      toast.success("Link copied");
                    }}
                    className="bg-white text-black hover:bg-white/90 uppercase text-xs tracking-widest font-semibold"
                  >
                    <Copy className="h-4 w-4 mr-1.5" /> Copy
                  </Button>
                </div>
                <p className="mt-3 text-xs text-white/50">
                  Referral code: <span className="font-mono text-white">{code}</span>
                </p>
              </>
            ) : (
              <p className="text-sm text-white/60">Loading your ambassador link…</p>
            )}
          </div>

          <div className="mt-12 prose prose-invert max-w-none text-white/70">
            <h2 className="text-white">How the programme works</h2>
            <ol>
              <li>Sign in and copy your unique referral link above.</li>
              <li>Share it with your community — social, WhatsApp, email, in person.</li>
              <li>
                When someone joins the Collective through your link and completes onboarding,
                we attribute their membership and any yield allocations to you.
              </li>
              <li>
                You earn <strong>10% of their monthly membership</strong> for as long as they
                remain a member, and <strong>10% of every yield allocation</strong> they place.
              </li>
              <li>Payouts are processed monthly by EFT (minimum R500 balance).</li>
            </ol>
            <p className="text-xs">
              Commissions are subject to the LOUDMOUF™ Ambassador Terms. Fraudulent or self-
              referrals are void. LOUDMOUF™ reserves the right to change commission rates with
              30 days' notice to active ambassadors.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
