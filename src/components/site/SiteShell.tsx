import type { ReactNode } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export function SiteShell({
  children,
  title,
  kicker,
}: {
  children: ReactNode;
  title: string;
  kicker?: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="pt-40 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          {kicker && (
            <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">{kicker}</p>
          )}
          <h1 className="display mt-2 text-5xl md:text-6xl text-white">{title}</h1>
          <div className="prose prose-invert prose-headings:font-display prose-headings:uppercase prose-p:text-white/70 prose-a:text-loud-yellow max-w-none mt-10">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
