import { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBasket, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useUIStore } from "@/stores/uiStore";
import { incrementEarlyAccessClaimed } from "./EarlyAccessBar";
import { membershipFeeFor } from "@/lib/launch";
import { useEffect as useEffectReact, useState } from "react";

function useMemberTier(): "standard" | "premium" | null {
  const [tier, setTier] = useState<"standard" | "premium" | null>(null);
  useEffectReact(() => {
    try {
      const raw = window.localStorage.getItem("loudmouf-member-profile");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { tier?: string };
      if (parsed.tier === "standard" || parsed.tier === "premium") setTier(parsed.tier);
    } catch {
      /* ignore */
    }
  }, []);
  return tier;
}

export function CartDrawer() {
  const { cartOpen: open, setCartOpen: setOpen } = useUIStore();
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } =
    useCartStore();
  const memberTier = useMemberTier();
  const membershipFee = membershipFeeFor(memberTier);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const itemsSubtotal = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const totalPrice = itemsSubtotal + membershipFee;
  const currency = items[0]?.price.currencyCode ?? "ZAR";

  useEffect(() => {
    if (open) syncCart();
  }, [open, syncCart]);

  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) {
      incrementEarlyAccessClaimed(totalItems);
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full glass hover:glow-purple transition"
          aria-label="Open member basket"
        >
          <ShoppingBasket className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-loud-yellow text-black">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-loud-ink border-l border-white/10">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl uppercase">
            Your Allocation Basket
          </SheetTitle>
          <SheetDescription>
            {totalItems === 0
              ? "No allocations requested yet."
              : `${totalItems} yield share${totalItems !== 1 ? "s" : ""} · ready to confirm.`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-4 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 grid place-items-center text-center">
              <div>
                <ShoppingBasket className="mx-auto h-10 w-10 text-white/30" />
                <p className="mt-3 text-sm text-white/50">Your basket is empty.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-black/40">
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img
                          src={item.product.node.images.edges[0].node.url}
                          alt={item.product.node.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold">{item.product.node.title}</h4>
                      <p className="text-xs text-white/50">
                        {item.selectedOptions
                          ?.filter((o) => o.value !== "Default Title")
                          .map((o) => o.value)
                          .join(" · ") || "1 Tin · Yield Share"}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-loud-yellow">
                        {item.price.currencyCode === "ZAR" ? "R" : item.price.currencyCode + " "}
                        {parseFloat(item.price.amount).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-white/40 hover:text-white"
                        onClick={() => removeItem(item.variantId)}
                        aria-label="Remove allocation"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 border-white/20"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-xs tabular-nums">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 border-white/20"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>Items subtotal</span>
                  <span className="tabular-nums">
                    {currency === "ZAR" ? "R" : currency + " "}
                    {itemsSubtotal.toFixed(2)}
                  </span>
                </div>
                {membershipFee > 0 && (
                  <div className="flex items-center justify-between text-sm text-loud-yellow">
                    <span>
                      {memberTier === "premium" ? "Premium" : "Standard"} Membership · monthly
                    </span>
                    <span className="tabular-nums">R{membershipFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>Delivery</span>
                  <span>R150 · 3–5 days</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm uppercase tracking-widest text-white/60">
                    Contribution Total
                  </span>
                  <span className="font-display text-2xl">
                    {currency === "ZAR" ? "R" : currency + " "}
                    {totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-widest text-white/60">
                    Contribution Subtotal
                  </span>
                  <span className="font-display text-2xl">
                    {currency === "ZAR" ? "R" : currency + " "}
                    {totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={checkout}
                  size="lg"
                  disabled={items.length === 0 || isLoading || isSyncing}
                  className="cta-gradient w-full text-black hover:opacity-90 font-semibold uppercase tracking-widest"
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" /> Confirm Contribution
                    </>
                  )}
                </Button>
                <p className="text-[10px] text-center uppercase tracking-widest text-white/40">
                  Secure member portal · Visa · Mastercard · Apple Pay · EFT
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
