import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import type { TinctureProduct } from "@/lib/tinctures";

const WHATSAPP_NUMBER = "27680200749";
const REDIRECT_SECONDS = 10;

function buildWhatsAppUrl(product: TinctureProduct) {
  const message = `Hi LOUDMOUF, I'd like to enquire about / place an order for the ${product.flavourLine} tincture (${product.potencyLabel}).`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function ReserveWhatsAppModal({
  product,
  open,
  onOpenChange,
}: {
  product: TinctureProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const redirected = useRef(false);

  useEffect(() => {
    if (!open) return;
    setSecondsLeft(REDIRECT_SECONDS);
    redirected.current = false;

    const interval = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (!open || secondsLeft > 0 || redirected.current) return;
    redirected.current = true;
    window.location.href = buildWhatsAppUrl(product);
  }, [open, secondsLeft, product]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-loud-ink border-white/10">
        <DialogHeader>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: product.color }}
          >
            {product.index} · {product.daypart}
          </p>
          <DialogTitle className="display text-3xl text-white leading-tight">
            Reserve {product.flavourLine}
          </DialogTitle>
          <DialogDescription className="text-white/60 text-sm pt-1">
            Online checkout is temporarily unavailable. You'll be redirected to WhatsApp in{" "}
            <span className="font-semibold text-white">{secondsLeft}</span> second
            {secondsLeft === 1 ? "" : "s"} to make an enquiry or place your order directly with the
            LOUDMOUF™ team.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <div
            className="rounded-2xl border p-4 text-sm text-white/70 leading-relaxed"
            style={{ borderColor: product.color, backgroundColor: product.colorSoft }}
          >
            {product.flavourLine} · {product.potencyLabel} · R{product.priceZar}
          </div>

          <a
            href={buildWhatsAppUrl(product)}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-xs font-semibold uppercase tracking-widest text-black hover:bg-white/90 h-12"
          >
            <MessageCircle className="h-4 w-4" /> Continue to WhatsApp now
          </a>

          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-white/60 hover:text-white uppercase tracking-widest text-xs font-semibold"
          >
            Cancel
          </Button>

          <p className="text-center text-[10px] uppercase tracking-widest text-white/30">
            Card checkout returns soon — enquiries handled via WhatsApp in the meantime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
