import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { EarlyAccessBar } from "@/components/site/EarlyAccessBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, MapPin, Music, Sparkles, PartyPopper } from "lucide-react";

export const Route = createFileRoute("/launch")({
  head: () => ({
    meta: [
      { title: "The Loudmouf Launch · Members-Only Event · RSVP" },
      { name: "description", content: "Reserve your spot for the official Loudmouf private members club launch event. Discreet. Intimate. Unforgettable." },
      { property: "og:title", content: "The Loudmouf Launch · Members Only" },
      { property: "og:description", content: "Reserve your spot for the official Loudmouf launch event." },
    ],
  }),
  component: LaunchPage,
});

const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Please share your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  guests: z.coerce.number().min(1).max(4),
  message: z.string().trim().max(500).optional(),
});

function LaunchPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = rsvpSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      guests: fd.get("guests"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setSubmitting(true);
    try {
      const existing = JSON.parse(window.localStorage.getItem("loudmouf-rsvps") || "[]");
      existing.push({ ...parsed.data, ts: Date.now() });
      window.localStorage.setItem("loudmouf-rsvps", JSON.stringify(existing));
      await new Promise((r) => setTimeout(r, 500));
      setDone(true);
      toast.success("You're on the list. We'll be in touch.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      <Nav />
      <section className="relative pt-40 pb-24">
        <div className="pointer-events-none absolute inset-0 grid-noise" />
        <div className="relative mx-auto max-w-5xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gradient-loud font-semibold">Members-Only · Strictly 18+</p>
            <h1 className="display mt-4 text-5xl sm:text-7xl text-white">
              The Loudmouf <span className="text-gradient-loud">Launch</span>
            </h1>
            <p className="mt-5 max-w-2xl text-white/70 text-base sm:text-lg">
              An intimate evening for founding members of the Loudmouf Collective. Live music, curated tastings, and the first-ever public unveiling of Drop 001. RSVP is required — capacity is deliberately small.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Calendar, label: "Date", value: "Saturday · 15 Aug 2026" },
              { icon: MapPin, label: "Location", value: "Cape Town · Address on RSVP" },
              { icon: Music, label: "Programme", value: "Live set · Tasting · Community" },
            ].map((c) => (
              <div key={c.label} className="glass rounded-2xl p-5">
                <c.icon className="h-5 w-5 text-loud-yellow" />
                <p className="mt-3 text-[11px] uppercase tracking-widest text-white/50">{c.label}</p>
                <p className="mt-1 text-sm text-white">{c.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.3em] text-loud-yellow">What to expect</p>
              <ul className="mt-5 space-y-4 text-sm text-white/70">
                <li className="flex gap-3"><Sparkles className="h-4 w-4 text-loud-yellow shrink-0 mt-0.5" /> First look at the full Drop 001 range — Cheesecake, Blueberry, Bubblegum.</li>
                <li className="flex gap-3"><Sparkles className="h-4 w-4 text-loud-yellow shrink-0 mt-0.5" /> Curated terpene tastings with our head horticulturist.</li>
                <li className="flex gap-3"><Sparkles className="h-4 w-4 text-loud-yellow shrink-0 mt-0.5" /> Founding-member perks — priority allocation, lifetime discount.</li>
                <li className="flex gap-3"><Sparkles className="h-4 w-4 text-loud-yellow shrink-0 mt-0.5" /> Live music, curated food, and the community you've been waiting for.</li>
              </ul>
              <p className="mt-6 text-[11px] uppercase tracking-widest text-white/40">
                Strictly private · 18+ only · Attendance by invitation.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md">
              {done ? (
                <div className="text-center py-10">
                  <PartyPopper className="mx-auto h-10 w-10 text-loud-yellow" />
                  <h2 className="display mt-4 text-3xl text-white">You're on the list.</h2>
                  <p className="mt-3 text-sm text-white/60">We'll send location details and event kit info to your inbox closer to the date.</p>
                  <Link to="/" className="mt-6 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs uppercase tracking-widest text-white">
                    Back to home
                  </Link>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <h2 className="display text-3xl text-white">Reserve your spot</h2>
                    <p className="mt-1 text-xs text-white/50">Non-transferable. We'll confirm within 48 hours.</p>
                  </div>
                  <div>
                    <Label htmlFor="name" className="text-xs uppercase tracking-widest text-white/60">Full name</Label>
                    <Input id="name" name="name" required maxLength={80} className="mt-1 bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="email" className="text-xs uppercase tracking-widest text-white/60">Email</Label>
                      <Input id="email" name="email" type="email" required maxLength={255} className="mt-1 bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-xs uppercase tracking-widest text-white/60">Phone</Label>
                      <Input id="phone" name="phone" required maxLength={20} className="mt-1 bg-white/5 border-white/10 text-white" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="guests" className="text-xs uppercase tracking-widest text-white/60">Guests (incl. you)</Label>
                    <Input id="guests" name="guests" type="number" min={1} max={4} defaultValue={1} required className="mt-1 bg-white/5 border-white/10 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-xs uppercase tracking-widest text-white/60">Anything we should know?</Label>
                    <Textarea id="message" name="message" maxLength={500} rows={3} className="mt-1 bg-white/5 border-white/10 text-white" />
                  </div>
                  <Button type="submit" disabled={submitting} className="cta-gradient w-full text-black uppercase tracking-widest text-xs font-semibold">
                    {submitting ? "Submitting…" : "Confirm My RSVP"}
                  </Button>
                  <p className="text-[10px] text-center uppercase tracking-widest text-white/40">
                    By RSVPing you confirm you are 18+ and understand this is a private members event.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <EarlyAccessBar />
    </div>
  );
}
