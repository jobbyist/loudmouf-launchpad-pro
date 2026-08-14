import { Link } from "@tanstack/react-router";
import { Home, Info, ShoppingBag, Tag, MoreHorizontal, Newspaper, Users, Mail, Calendar, Ticket } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const primaryLinks = [
  { label: "Home", href: "/", type: "route" as const, icon: Home },
  { label: "About", href: "/about", type: "route" as const, icon: Info },
  { label: "Merch", href: "/store", type: "route" as const, icon: ShoppingBag },
  { label: "Pricing", href: "/membership", type: "route" as const, icon: Tag },
];

const moreLinks = [
  { label: "Events", href: "/launch", type: "route" as const, icon: Ticket },
  { label: "Newsroom", href: "/newsroom", type: "route" as const, icon: Newspaper },
  { label: "Partners", href: "/partner-program", type: "route" as const, icon: Users },
  { label: "Contact", href: "/contact", type: "route" as const, icon: Mail },
];

function NavItem({
  label,
  href,
  type,
  icon: Icon,
}: {
  label: string;
  href: string;
  type: "route" | "hash";
  icon: typeof Home;
}) {
  const className =
    "flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-white/70 transition hover:text-loud-yellow";
  return type === "route" ? (
    <Link to={href} className={className}>
      <Icon className="h-4 w-4" />
      <span className="text-[9px] uppercase tracking-widest">{label}</span>
    </Link>
  ) : (
    <a href={href} className={className}>
      <Icon className="h-4 w-4" />
      <span className="text-[9px] uppercase tracking-widest">{label}</span>
    </a>
  );
}

export function BottomNav() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav
        aria-label="Primary"
        className="glass pointer-events-auto mx-auto m-3 flex max-w-md items-stretch gap-1 rounded-2xl px-2 py-1.5 shadow-2xl"
      >
        {primaryLinks.map((l) => (
          <NavItem key={l.label} {...l} />
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-white/70 transition hover:text-loud-yellow"
              aria-label="More links"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="text-[9px] uppercase tracking-widest">More</span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            sideOffset={12}
            className="glass w-56 rounded-2xl border-white/10 bg-transparent p-2 text-white shadow-2xl"
          >
            <div className="flex flex-col">
              {moreLinks.map((l) =>
                l.type === "route" ? (
                  <Link
                    key={l.label}
                    to={l.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-loud-yellow"
                  >
                    <l.icon className="h-4 w-4" />
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-loud-yellow"
                  >
                    <l.icon className="h-4 w-4" />
                    {l.label}
                  </a>
                ),
              )}
            </div>
          </PopoverContent>
        </Popover>
      </nav>
    </div>
  );
}
