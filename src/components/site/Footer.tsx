import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Instagram, Facebook, Send, Apple, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function PayBadge({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-white/15 bg-white/[0.06] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/80">
      {label}
    </div>
  );
}

function StoreBadge({ icon: Icon, top, bottom }: { icon: typeof Apple; top: string; bottom: string }) {
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
  return (
    <footer className="relative border-t border-white/10 bg-black pb-28">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo size="lg" />
          <p className="mt-4 max-w-xs text-sm text-white/60">
            A private members collective for those who want the experience without the smoke. Discreet. Potent. Community-first.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="https://instagram.com" aria-label="Instagram" className="glass grid h-10 w-10 place-items-center rounded-full hover:text-loud-yellow">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="glass grid h-10 w-10 place-items-center rounded-full hover:text-loud-yellow">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://wa.me/27680200749" aria-label="WhatsApp" className="glass grid h-10 w-10 place-items-center rounded-full hover:text-loud-yellow">
              <Send className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-gradient-loud font-semibold">The Collective</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><a href="/#product" className="hover:text-white">Yield Profiles</a></li>
            <li><a href="/#preorder" className="hover:text-white">Reserve My Share</a></li>
            <li><Link to="/launch" className="hover:text-white">Launch Event</Link></li>
            <li><Link to="/track-my-order" className="hover:text-white">Track My Allocation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-gradient-loud font-semibold">Membership</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/shipping-policy" className="hover:text-white">Delivery Policy</Link></li>
            <li><Link to="/refund-policy" className="hover:text-white">Returns & Exchanges</Link></li>
            <li><Link to="/terms" className="hover:text-white">Membership Agreement</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-gradient-loud font-semibold">Stay in the loop</h4>
          <p className="mt-4 text-sm text-white/60">Founding-member updates, exclusive drops, community events.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex gap-2">
            <Input type="email" placeholder="you@loud.co" className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
            <Button type="submit" className="cta-gradient text-black hover:opacity-90">
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Secure payment</p>
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
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-widest text-white/40">
          <p>© {new Date().getFullYear()} Gravitas Industries (Pty) Ltd t/a LOUDMOUF™ · CK 2024/596436/07</p>
          <p className="text-gradient-loud font-semibold">18+ Private Members Only · Keep out of reach of children</p>
        </div>
      </div>
    </footer>
  );
}
