import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { ShopifyProduct } from "@/lib/shopify";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductModal, resolveProfile } from "./ProductModal";

export function ProductCard({ product, index }: { product: ShopifyProduct; index: number }) {
  const [open, setOpen] = useState(false);
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const cleanTitle = product.node.title.replace(/LOUDMOUF™\s*/i, "").replace(/—.*/, "").trim();
  const profile = resolveProfile(cleanTitle);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        className={cn(
          "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md",
          "hover:border-white/20 hover:-translate-y-1 transition-all duration-500",
        )}
      >
        <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60", profile.gradientClass)} />
        <div className="relative">
          <button
            onClick={() => setOpen(true)}
            className={cn(
              "relative block aspect-square w-full overflow-hidden rounded-2xl bg-black/40 ring-1 ring-white/10",
              "hover:ring-2 transition",
              `hover:${profile.ringClass}`,
            )}
            aria-label={`View ${cleanTitle} details`}
          >
            {image && (
              <img
                src={image.url}
                alt={image.altText ?? product.node.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
          </button>

          <div className="mt-5 flex items-start justify-between gap-3">
            <div>
              <p className={cn("text-[11px] uppercase tracking-[0.22em]", profile.accentClass)}>
                {profile.strain} · {profile.vibe.split(" · ")[0]}
              </p>
              <h3 className="display mt-1 text-3xl text-white">{cleanTitle}</h3>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl text-white leading-none">
                R{parseFloat(price.amount).toFixed(0)}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-white/40">per tin</p>
            </div>
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="cta-gradient mt-5 w-full text-black hover:opacity-90 uppercase tracking-widest text-xs font-semibold"
          >
            <Sparkles className="h-4 w-4 mr-1.5" /> Reserve My Share
          </Button>
        </div>
      </motion.div>

      <ProductModal open={open} onOpenChange={setOpen} product={product} />
    </>
  );
}
