import { createFileRoute } from "@tanstack/react-router";

interface PaystackVerifyData {
  status: "success" | "failed" | "abandoned" | string;
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
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const Route = createFileRoute("/api/public/paystack/verify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const reference = new URL(request.url).searchParams.get("reference");
        if (!reference || reference.length > 200) return jsonError("missing_reference", 400);

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) return jsonError("payments_not_configured", 503);

        let payload: { status: boolean; message?: string; data?: PaystackVerifyData };
        try {
          const res = await fetch(
            `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
            { headers: { Authorization: `Bearer ${secretKey}` } },
          );
          payload = await res.json();
          if (!res.ok || !payload.status || !payload.data) {
            return jsonError(payload.message ?? "verify_failed", 502);
          }
        } catch (err) {
          console.error("[paystack] verify request error", err);
          return jsonError("paystack_unreachable", 502);
        }

        const data = payload.data;
        const status =
          data.status === "success" ? "paid" : data.status === "failed" ? "failed" : "pending";

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
              status,
              paystack_data: data as never,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "reference" },
          );
        } catch (err) {
          console.error("[paystack] failed to persist verified reservation", err);
        }

        return Response.json({
          status,
          productName: data!.metadata?.product_name ?? "LOUDMOUF Herbal Tincture",
          quantity: data!.metadata?.quantity ?? 1,
          amountZar: data!.amount / 100,
          email: data!.customer?.email ?? null,
        });
      },
    },
  },
});
