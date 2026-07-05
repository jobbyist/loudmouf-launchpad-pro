import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "ZAR";

  useEffect(() => {
    if (open) syncCart();
  }, [open, syncCart]);

  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full glass hover:glow-purple transition"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-loud-yellow text-black">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-loud-ink border-l border-white/10">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl uppercase">Your Cart</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Nothing here yet." : `${totalItems} item${totalItems !== 1 ? "s" : ""} — ready when you are.`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-4 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 grid place-items-center text-center">
              <div>
                <ShoppingCart className="mx-auto h-10 w-10 text-white/30" />
                <p className="mt-3 text-sm text-white/50">Your cart is empty.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-3">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
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
                        {item.selectedOptions?.filter((o) => o.value !== "Default Title").map((o) => o.value).join(" · ") || "1 Tin"}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-loud-yellow">
                        {item.price.currencyCode === "ZAR" ? "R" : item.price.currencyCode + " "}
                        {parseFloat(item.price.amount).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-white/40 hover:text-white" onClick={() => removeItem(item.variantId)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-6 w-6 border-white/20" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-xs tabular-nums">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6 border-white/20" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>Delivery</span>
                  <span>R150 · 3–5 days · Courier Guy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-widest text-white/60">Subtotal</span>
                  <span className="font-display text-2xl">
                    {currency === "ZAR" ? "R" : currency + " "}
                    {totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={checkout}
                  size="lg"
                  disabled={items.length === 0 || isLoading || isSyncing}
                  className="w-full bg-loud-yellow text-black hover:bg-loud-yellow/90 font-semibold uppercase tracking-widest"
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" /> Secure Checkout
                    </>
                  )}
                </Button>
                <p className="text-[10px] text-center uppercase tracking-widest text-white/40">
                  Powered by Shopify · Visa · Mastercard · Apple Pay
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
