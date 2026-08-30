import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

interface PaystackChargeEvent {
  event: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    customer?: { email?: string };
    metadata?: {
      product_id?: string;
      product_name?: string;
      tier?: string;
      quantity?: number;
    } | null;
  };
}

export const Route = createFileRoute("/api/public/hooks/paystack-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        
        if (!secret) {
          console.error("[paystack] webhook received but PAYSTACK_SECRET_KEY is not configured");
          return new Response("Not configured", { status: 503 });
        }

        const raw = await request.text();

        const signature = request.headers.get("x-paystack-signature") ?? "";
        const expected = createHmac("sha512", secret).update(raw, "utf8").digest("hex");
        const a = Buffer.from(signature);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: PaystackChargeEvent;
        try {
          event = JSON.parse(raw) as PaystackChargeEvent;
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }

        if (event.event === "charge.success") {
          const data = event.data;
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            await supabaseAdmin.from("tincture_reservations").upsert(
              {
                reference: data.reference,
                product_id: data.metadata?.product_id ?? "unknown",
                product_name: data.metadata?.product_name ?? "LOUDMOUF Herbal Tincture",
                tier: data.metadata?.tier ?? "unknown",
                email: data.customer?.email ?? "unknown",
                quantity: data.metadata?.quantity ?? 1,
                unit_amount_cents: data.metadata?.quantity
                  ? Math.round(data.amount / data.metadata.quantity)
                  : data.amount,
                amount_cents: data.amount,
                currency: data.currency ?? "ZAR",
                status: "paid",
                paystack_data: data as never,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "reference" },
            );
          } catch (err) {
            console.error("[paystack] webhook failed to persist reservation", err);
          }
        }

        return Response.json({ ok: true });
      },
    },
  },
});
