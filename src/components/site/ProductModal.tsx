import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, ShieldCheck, Leaf, Flame } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";
import trueGrade from "@/assets/true-grade.webp.asset.json";

export interface ProfileMeta {
  strain: "Sativa" | "Indica" | "Hybrid";
  vibe: string;
  thc: number; // 0-100 scale, visual
  terpenes: Array<{ name: string; pct: number; note: string }>;
  effects: string[];
  composition: string[];
  flavor: string;
  accentClass: string; // tailwind text color class
  ringClass: string;
  gradientClass: string;
}

export const PROFILES: Record<string, ProfileMeta> = {
  cheesecake: {
    strain: "Sativa",
    vibe: "Uplifting · Creative · Energising",
    thc: 78,
    flavor: "Sweet cream, warm vanilla, toasted graham & a whisper of citrus zest.",
    terpenes: [
      { name: "Limonene", pct: 34, note: "Bright citrus lift, mood elevation." },
      { name: "Caryophyllene", pct: 28, note: "Peppery warmth, gentle body ease." },
      { name: "Myrcene", pct: 22, note: "Earthy, smooth mellow undertone." },
      { name: "Pinene", pct: 16, note: "Fresh, clear-headed focus." },
    ],
    effects: ["Uplifted mood", "Creative flow", "Sociable energy", "Daytime clarity"],
    composition: ["Premium true-grade terpenes", "Smoke-free pouch", "Tobacco-free", "Discreet & odourless"],
    accentClass: "text-loud-yellow",
    ringClass: "ring-loud-yellow/40",
    gradientClass: "from-loud-yellow/25 via-loud-yellow/5 to-transparent",
  },
  blueberry: {
    strain: "Indica",
    vibe: "Calming · Relaxing · Smooth",
    thc: 74,
    flavor: "Ripe blueberry compote, forest berries & a soft floral finish.",
    terpenes: [
      { name: "Myrcene", pct: 38, note: "Deep body calm, restful ease." },
      { name: "Linalool", pct: 24, note: "Floral, soothing wind-down." },
      { name: "Caryophyllene", pct: 22, note: "Tension release, peppery warmth." },
      { name: "Humulene", pct: 16, note: "Grounded, herbal balance." },
    ],
    effects: ["Deep relaxation", "Evening wind-down", "Restful sleep support", "Body ease"],
    composition: ["Premium true-grade terpenes", "Smoke-free pouch", "Tobacco-free", "Discreet & odourless"],
    accentClass: "text-[color:var(--loud-blue-bright)]",
    ringClass: "ring-[color:var(--loud-blue-bright)]/40",
    gradientClass: "from-[color:var(--loud-blue-bright)]/25 via-[color:var(--loud-blue-bright)]/5 to-transparent",
  },
  bubblegum: {
    strain: "Hybrid",
    vibe: "Balanced · Euphoric · Feel-good",
    thc: 76,
    flavor: "Nostalgic pink bubblegum, candied berry & a playful sugar-rush finish.",
    terpenes: [
      { name: "Caryophyllene", pct: 30, note: "Balance & warmth." },
      { name: "Limonene", pct: 26, note: "Bright, mood-lifting sparkle." },
      { name: "Myrcene", pct: 24, note: "Smooth, easy-going body." },
      { name: "Terpinolene", pct: 20, note: "Sweet, playful top-note." },
    ],
    effects: ["Balanced euphoria", "Social spark", "Playful mood", "Anytime ease"],
    composition: ["Premium true-grade terpenes", "Smoke-free pouch", "Tobacco-free", "Discreet & odourless"],
    accentClass: "text-loud-pink",
    ringClass: "ring-loud-pink/40",
    gradientClass: "from-loud-pink/25 via-loud-pink/5 to-transparent",
  },
};

export function resolveProfile(title: string) {
  const k = title.toLowerCase();
  for (const key of Object.keys(PROFILES)) if (k.includes(key)) return { key, ...PROFILES[key] };
  return { key: "cheesecake", ...PROFILES.cheesecake };
}

export function ProductModal({
  open,
  onOpenChange,
  product,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: ShopifyProduct;
}) {
  const cleanTitle = product.node.title.replace(/LOUDMOUF™\s*/i, "").replace(/—.*/, "").trim();
  const profile = resolveProfile(cleanTitle);
  const images = product.node.images.edges.map((e) => e.node);
  const [active, setActive] = useState(0);
  const variant = product.node.variants.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const { addItem, isLoading } = useCartStore();

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-loud-ink border-white/10 p-0 overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="grid md:grid-cols-2">
          {/* Gallery */}
          <div className={cn("relative p-6 bg-gradient-to-br", profile.gradientClass)}>
            <div className={cn("relative aspect-square overflow-hidden rounded-2xl bg-black/40 ring-1", profile.ringClass)}>
              {images[active] && (
                <img
                  src={images[active].url}
                  alt={images[active].altText ?? cleanTitle}
                  className="h-full w-full object-cover"
                />
              )}
              <img
                src={trueGrade.url}
                alt="True Grade Quality"
                className="absolute bottom-3 right-3 h-16 w-16 opacity-90"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button
                    key={img.url}
                    onClick={() => setActive(i)}
                    className={cn(
                      "aspect-square overflow-hidden rounded-lg bg-black/40 ring-1 transition",
                      i === active ? profile.ringClass : "ring-white/10",
                    )}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 space-y-5">
            <div>
              <p className={cn("text-[11px] uppercase tracking-[0.25em]", profile.accentClass)}>
                {profile.strain} · {profile.vibe}
              </p>
              <DialogTitle className="display mt-1 text-4xl text-white">{cleanTitle}</DialogTitle>
              <DialogDescription className="mt-2 text-sm text-white/60">
                {profile.flavor}
              </DialogDescription>
            </div>

            {/* THC scale */}
            <div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-white/60">
                <span className="flex items-center gap-1.5"><Flame className="h-3.5 w-3.5" /> Potency</span>
                <span className={profile.accentClass}>{profile.thc}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full cta-gradient"
                  style={{ width: `${profile.thc}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[9px] uppercase tracking-widest text-white/30">
                <span>Mellow</span><span>Balanced</span><span>Loud</span>
              </div>
            </div>

            {/* Terpene profile */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/60 mb-2">Terpene Profile</p>
              <div className="space-y-2">
                {profile.terpenes.map((t) => (
                  <div key={t.name} className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{t.name}</span>
                      <span className={cn("tabular-nums", profile.accentClass)}>{t.pct}%</span>
                    </div>
                    <div className="mt-1 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                      <div className={cn("h-full", profile.accentClass.replace("text-", "bg-"))} style={{ width: `${t.pct * 2}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-white/50">{t.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Effects + composition */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-white/60 mb-2">Effects</p>
                <ul className="space-y-1 text-xs text-white/70">
                  {profile.effects.map((e) => (
                    <li key={e} className="flex items-center gap-1.5"><Leaf className="h-3 w-3 text-loud-yellow" />{e}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-white/60 mb-2">Composition</p>
                <ul className="space-y-1 text-xs text-white/70">
                  {profile.composition.map((e) => (
                    <li key={e} className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-loud-yellow" />{e}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-end justify-between pt-2 border-t border-white/10">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Member contribution</p>
                <p className="font-display text-3xl text-white leading-none mt-1">
                  R{parseFloat(price.amount).toFixed(0)}
                  <span className="ml-2 text-xs align-middle text-white/40 line-through">R{(parseFloat(price.amount) / 0.75).toFixed(0)}</span>
                </p>
                <p className={cn("mt-1 text-[10px] uppercase tracking-widest", profile.accentClass)}>Early access · 25% off</p>
              </div>
              <Button
                onClick={handleAdd}
                disabled={isLoading || !variant}
                className="cta-gradient text-black hover:opacity-90 uppercase tracking-widest text-xs font-semibold px-6"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <><Plus className="h-4 w-4 mr-1" /> Secure This Yield Share</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
