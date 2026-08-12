import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { CartDrawer } from "./CartDrawer";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "/#home", type: "hash" as const },
  { label: "Yield Profiles", href: "/#product", type: "hash" as const },
  { label: "Membership", href: "/membership", type: "route" as const },
  { label: "Newsroom", href: "/newsroom", type: "route" as const },
  { label: "Dashboard", href: "/member-dashboard", type: "route" as const },
  { label: "Referrals", href: "/referrals", type: "route" as const },
  { label: "Community", href: "/community-guidelines", type: "route" as const },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 sm:px-6 py-2 transition-all ${
            scrolled ? "glass" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-[12px] uppercase tracking-[0.18em] text-white/80">
            {links.map((l) =>
              l.type === "route" ? (
                <Link key={l.href} to={l.href} className="hover:text-loud-yellow transition">
                  {l.label}
                </Link>
              ) : (
                <a key={l.href} href={l.href} className="hover:text-loud-yellow transition">
                  {l.label}
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/membership"
              className="cta-gradient hidden sm:inline-flex items-center rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-black shadow-md"
            >
              Become a Member
            </Link>
            <CartDrawer />
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full glass"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden mx-auto mt-2 max-w-7xl glass rounded-3xl p-6">
            <nav className="flex flex-col gap-4 text-sm uppercase tracking-widest">
              {links.map((l) =>
                l.type === "route" ? (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className="text-white/80 hover:text-loud-yellow"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-white/80 hover:text-loud-yellow"
                  >
                    {l.label}
                  </a>
                ),
              )}
              <Link
                to="/membership"
                onClick={() => setOpen(false)}
                className="cta-gradient mt-2 inline-flex items-center justify-center rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-widest text-black"
              >
                Become a Member
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
