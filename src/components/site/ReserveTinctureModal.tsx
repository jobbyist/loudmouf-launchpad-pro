import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus, ShieldCheck } from "lucide-react";
import type { TinctureProduct } from "@/lib/tinctures";

export function ReserveTinctureModal({
  product,
  open,
  onOpenChange,
}: {
  product: TinctureProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = product.priceZar * quantity;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirmed || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/public/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, email, quantity }),
      });
      const data = await res.json();
      if (!res.ok || !data.authorizationUrl) {
        if (data?.error === "payments_not_configured") {
          toast.error("Payments aren't live yet", {
            description: "Reservations open shortly — check back soon or join the waitlist below.",
          });
        } else {
          toast.error("Couldn't start checkout", {
            description: "Please try again in a moment.",
          });
        }
        return;
      }
      window.location.href = data.authorizationUrl;
    } catch (err) {
      console.error("Reserve tincture error", err);
      toast.error("Couldn't start checkout", { description: "Please try again in a moment." });
    } finally {
      setLoading(false);
    }
  }

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
            Secure your bottle now for R{product.priceZar} — pay securely with Paystack.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor={emailId} className="text-xs uppercase tracking-widest text-white/60">
              Email address
            </Label>
            <Input
              id={emailId}
              type="email"
              required
              placeholder="you@loud.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-white/60">Quantity</Label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={loading || quantity <= 1}
                aria-label="Decrease quantity"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white hover:border-white/40 disabled:opacity-40"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center font-display text-2xl text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                disabled={loading || quantity >= 10}
                aria-label="Increase quantity"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white hover:border-white/40 disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <span className="ml-auto font-display text-3xl text-white">
                R{total.toLocaleString("en-ZA")}
              </span>
            </div>
          </div>

          <label className="flex items-start gap-2.5 text-xs text-white/60 leading-relaxed">
            <Checkbox
              checked={confirmed}
              onCheckedChange={(v) => setConfirmed(v === true)}
              disabled={loading}
              className="mt-0.5"
            />
            I confirm I'm 18+ and located where this product may lawfully be purchased. Reservation
            secures allocation; final sale is subject to compliance review.
          </label>

          <Button
            type="submit"
            disabled={!confirmed || loading}
            className="w-full bg-white text-black hover:bg-white/90 uppercase tracking-widest text-xs font-semibold h-12"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 mr-1.5" /> Continue to secure payment
              </>
            )}
          </Button>

          <p className="text-center text-[10px] uppercase tracking-widest text-white/30">
            Payments processed securely by Paystack
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
