import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/track-my-order")({
  head: () => ({
    meta: [
      { title: "Track My Order — LOUDMOUF™" },
      {
        name: "description",
        content: "Track your LOUDMOUF™ order via The Courier Guy waybill or your order number.",
      },
      { property: "og:title", content: "Track My Order — LOUDMOUF™" },
      { property: "og:description", content: "Track your LOUDMOUF™ order with The Courier Guy." },
    ],
  }),
  component: TrackOrder,
});

function TrackOrder() {
  const [waybill, setWaybill] = useState("");

  return (
    <SiteShell title="Track My Order" kicker="Shipping Status">
      <p>
        Every LOUDMOUF™ order ships with The Courier Guy. Enter your waybill number below to jump
        straight to live tracking, or check the confirmation email we sent with your order.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (waybill.trim())
            window.open(
              `https://www.thecourierguy.co.za/track?tracking=${encodeURIComponent(waybill.trim())}`,
              "_blank",
            );
        }}
        className="not-prose mt-8 flex flex-col sm:flex-row gap-3"
      >
        <Input
          value={waybill}
          onChange={(e) => setWaybill(e.target.value)}
          placeholder="Enter waybill / tracking number"
          className="bg-white/5 border-white/10 text-white"
        />
        <Button
          type="submit"
          className="bg-loud-yellow text-black hover:bg-loud-yellow/90 uppercase tracking-widest font-semibold"
        >
          Track <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <h2>Need help?</h2>
      <p>
        WhatsApp us on <a href="https://wa.me/27680200749">+27 68 020 0749</a> or email{" "}
        <a href="mailto:hi@loudmouf.co.za">hi@loudmouf.co.za</a> with your order number and we'll
        sort you out fast.
      </p>
    </SiteShell>
  );
}
