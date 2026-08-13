import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Instagram, Send, Apple, Smartphone, Music2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, type FormEvent } from "react";

function PayBadge({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-white/15 bg-white/[0.06] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/80">
      {label}
    </div>
  );
}

function StoreBadge({
  icon: Icon,
  top,
  bottom,
}: {
  icon: typeof Apple;
  top: string;
  bottom: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-white/80">
      <Icon className="h-5 w-5" />
      <div className="leading-tight">
        <p className="text-[8px] uppercase tracking-widest text-white/50">{top}</p>
        <p className="text-[11px] font-semibold">{bottom}</p>
      </div>
      <span className="ml-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[8px] uppercase tracking-widest text-gradient-loud font-semibold">
        Soon
      </span>
    </div>
  );
}

export function Footer() {
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleNewsletterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    const endpoint = import.meta.env.VITE_FORMBACKEND_NEWSLETTER_ENDPOINT;

    if (!emailInput?.value) return;

    setNewsletterStatus("loading");

    // Endpoint will be configured later via env. If present, POST to Formbackend.
    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailInput.value }),
        });
        if (res.ok) {
          setNewsletterStatus("success");
          emailInput.value = "";
          setTimeout(() => setNewsletterStatus("idle"), 3000);
        } else {
          setNewsletterStatus("error");
        }
      } catch (error) {
        console.error("Newsletter error:", error);
        setNewsletterStatus("error");
      }
    } else {
      // Placeholder behaviour until endpoint is set
      console.info("Formbackend newsletter endpoint not configured yet. Email:", emailInput.value);
      setNewsletterStatus("success");
      emailInput.value = "";
      setTimeout(() => setNewsletterStatus("idle"), 3000);
    }
  }

  return (
    <footer className="relative border-t border-white/10 bg-black pb-28">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link to="/" className="inline-block" aria-label="LOUDMOUF home">
            <Logo size="lg" />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-white/60">
            A Private Lifestyle Club for members who want the experience without the smoke.
            Discreet. Potent. Community-first.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="glass grid h-10 w-10 place-items-center rounded-full hover:text-loud-yellow"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com/loudmoufza"
              aria-label="X (Twitter)"
              className="glass grid h-10 w-10 place-items-center rounded-full hover:text-loud-yellow"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a
              href="https://tiktok.com/@loudmoufza"
              aria-label="TikTok"
              className="glass grid h-10 w-10 place-items-center rounded-full hover:text-loud-yellow"
            >
              <Music2 className="h-4 w-4" />
            </a>
            <a
              href="https://whatsapp.com/channel/0029Vb89KpN002T3sx7ZMN3K"
              aria-label="WhatsApp"
              className="glass grid h-10 w-10 place-items-center rounded-full hover:text-loud-yellow"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            </a>
            <a
              href="https://wa.me/27680200749"
              aria-label="WhatsApp Direct Message"
              className="glass grid h-10 w-10 place-items-center rounded-full hover:text-loud-yellow"
            >
              <Send className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-gradient-loud font-semibold">
            The Collective
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <a href="/#product" className="hover:text-white">
                Available Yield Profiles
              </a>
            </li>
            <li>
              <Link to="/membership" className="hover:text-white">
                Membership Plans
              </Link>
            </li>
            <li>
              <Link to="/member-dashboard" className="hover:text-white">
                Member Dashboard
              </Link>
            </li>
            <li>
              <Link to="/launch" className="hover:text-white">
                Launch Summit
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-gradient-loud font-semibold">
            Legal
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link to="/shipping-refunds" className="hover:text-white">
                Shipping & Refunds
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white">
                Membership Agreement
              </Link>
            </li>
            <li>
              <Link to="/community-guidelines" className="hover:text-white">
                Community Guidelines
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-white">
                Privacy Statement
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact Support
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-gradient-loud font-semibold">
            Stay in the loop
          </h4>
          <p className="mt-4 text-sm text-white/60">
            Founding-member updates, exclusive drops, community events.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="mt-4 flex gap-2">
            <Input
              type="email"
              name="email"
              placeholder="you@loud.co"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              disabled={newsletterStatus === "loading"}
            />
            <Button
              type="submit"
              className="cta-gradient text-black hover:opacity-90"
              disabled={newsletterStatus === "loading"}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          {newsletterStatus === "success" && (
            <p className="mt-2 text-xs text-loud-yellow">Thanks — you&apos;re on the list.</p>
          )}
          {newsletterStatus === "error" && (
            <p className="mt-2 text-xs text-red-400">Something went wrong. Please try again.</p>
          )}

          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
              Secure payment
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <PayBadge label="Visa" />
              <PayBadge label="Mastercard" />
              <PayBadge label="Apple Pay" />
              <PayBadge label="EFT" />
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Coming soon</p>
            <div className="flex flex-wrap items-center gap-2">
              <StoreBadge icon={Apple} top="Download on the" bottom="App Store" />
              <StoreBadge icon={Smartphone} top="Get it on" bottom="Google Play" />
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
              Delivery Partner
            </p>
            <div className="rounded-md border border-white/15 bg-white/[0.06] px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-white/80 inline-block">
              Verified SA Delivery Partner · 3–5 days
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-widest text-white/40">
          <p>© 2026 LOUDMOUF™ · Gravitas Industries (Pty) Ltd · CK 2024/596436/07</p>
          <p className="text-gradient-loud font-semibold">
            18+ Private Members Only · Keep out of reach of children
          </p>
        </div>
      </div>
    </footer>
  );
}
