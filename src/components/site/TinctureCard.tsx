import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TinctureProduct } from "@/lib/tinctures";
import { ReserveTinctureModal } from "./ReserveTinctureModal";

export function TinctureCard({ product, index }: { product: TinctureProduct; index: number }) {
  const [open, setOpen] = useState(false);
  const unavailable = product.strain === "Indica";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md hover:border-white/20 hover:-translate-y-1 transition-all duration-500 shadow-xl ring-1 ring-white/5"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${product.color}, transparent 70%)`,
          }}
        />

        <div className="relative">
          <div className="flex items-center justify-between">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ backgroundColor: product.colorSoft, color: mixWithWhite(product.color) }}
            >
              {product.index} · {product.daypart}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              {product.strain}
            </span>
          </div>

          <div className="relative mt-5 aspect-square w-full overflow-hidden rounded-2xl bg-black/40 ring-1 ring-white/10">
            <img
              src={product.image}
              alt={product.imageAlt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <h3 className="display mt-5 text-2xl sm:text-3xl text-white leading-[1.05]">
            {product.flavourLine}
          </h3>
          <p className="mt-2 text-sm text-white/60 leading-relaxed">{product.effectsLine}</p>

          <div className="mt-4 flex items-center justify-between">
            <span
              className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest"
              style={{ borderColor: product.color, color: mixWithWhite(product.color) }}
            >
              {product.potencyLabel}
            </span>
            <div className="text-right">
              <p className="font-display text-3xl text-white leading-none">R{product.priceZar}</p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-white/40">
                {product.volumeLabel.split("·")[0].trim()}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setOpen(true)}
            disabled={unavailable}
            className="mt-5 w-full bg-white text-black hover:bg-white/90 uppercase tracking-widest text-xs font-semibold shadow-lg shadow-black/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {unavailable ? (
              "UNAVAILABLE"
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1.5" /> Reserve Now
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <ReserveTinctureModal product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}

function mixWithWhite(hex: string) {
  return `color-mix(in oklab, ${hex} 70%, white)`;
}
