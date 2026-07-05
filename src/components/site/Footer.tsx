import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Instagram, Facebook, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo className="text-3xl" />
          <p className="mt-4 max-w-xs text-sm text-white/60">
            LOUDMOUF™ is for those who want the experience without the smoke. Big flavour. Zero smoke. Stay loud.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="https://instagram.com" aria-label="Instagram" className="glass grid h-10 w-10 place-items-center rounded-full hover:text-loud-yellow">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="glass grid h-10 w-10 place-items-center rounded-full hover:text-loud-yellow">
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/27680200749"
              aria-label="WhatsApp"
              className="glass grid h-10 w-10 place-items-center rounded-full hover:text-loud-yellow"
            >
              <Send className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-loud-yellow">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><a href="/#product" className="hover:text-white">All Flavours</a></li>
            <li><a href="/#preorder" className="hover:text-white">Pre-Order</a></li>
            <li><Link to="/track-my-order" className="hover:text-white">Track My Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-loud-yellow">Information</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/shipping-policy" className="hover:text-white">Shipping Policy</Link></li>
            <li><Link to="/refund-policy" className="hover:text-white">Returns & Refunds</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-loud-yellow">Newsletter</h4>
          <p className="mt-4 text-sm text-white/60">Exclusive drops, early access, community perks.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-4 flex gap-2"
          >
            <Input type="email" placeholder="you@loud.co" className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
            <Button type="submit" className="bg-loud-yellow text-black hover:bg-loud-yellow/90">
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {["VISA", "Mastercard", "Apple Pay", "EFT"].map((p) => (
              <span key={p} className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-widest text-white/70">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-widest text-white/40">
          <p>© {new Date().getFullYear()} Gravitas Industries (Pty) Ltd t/a LOUDPACK™ · CK 2024/596436/07</p>
          <p className="text-loud-yellow">18+ Only · Adults Only · Keep out of reach of children</p>
        </div>
      </div>
    </footer>
  );
}
