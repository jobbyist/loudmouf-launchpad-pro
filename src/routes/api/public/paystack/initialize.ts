import { createFileRoute } from "@tanstack/react-router";
import { randomUUID } from "crypto";
import { z } from "zod";
import { getTinctureProduct, TINCTURE_PRODUCTS } from "@/lib/tinctures";

const bodySchema = z.object({
  productId: z.enum(TINCTURE_PRODUCTS.map((p) => p.id) as [string, ...string[]]),
  email: z.string().trim().email().max(200),
  quantity: z.number().int().min(1).max(10),
});

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const Route = createFileRoute("/api/public/paystack/initialize")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return jsonError("invalid_json", 400);
        }
        const parsed = bodySchema.safeParse(raw);
        if (!parsed.success) return jsonError("invalid_payload", 400);
        const { productId, email, quantity } = parsed.data;

        const product = getTinctureProduct(productId);
        if (!product) return jsonError("unknown_product", 400);

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
          console.error("[paystack] PAYSTACK_SECRET_KEY is not configured");
          return jsonError("payments_not_configured", 503);
        }

        const unitAmountCents = Math.round(product.priceZar * 100);
        const amountCents = unitAmountCents * quantity;
        const reference = `lm-tinct-${randomUUID()}`;
        const origin = new URL(request.url).origin;

        let paystackData: {
          status: boolean;
          message?: string;
          data?: { authorization_url: string; access_code: string; reference: string };
        };
        try {
          const res = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${secretKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              amount: amountCents,
              currency: "ZAR",
              reference,
              callback_url: `${origin}/herbal-tinctures?reference=${reference}`,
              metadata: {
                product_id: product.id,
                product_name: product.name,
                tier: product.strain,
                quantity,
                custom_fields: [
                  { display_name: "Product", variable_name: "product", value: product.name },
                  { display_name: "Quantity", variable_name: "quantity", value: String(quantity) },
                ],
              },
            }),
          });
          paystackData = await res.json();
          if (!res.ok || !paystackData.status || !paystackData.data) {
            console.error("[paystack] initialize failed", paystackData);
            return jsonError(paystackData.message ?? "paystack_initialize_failed", 502);
          }
        } catch (err) {
          console.error("[paystack] initialize request error", err);
          return jsonError("paystack_unreachable", 502);
        }

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin.from("tincture_reservations").insert({
            reference,
            product_id: product.id,
            product_name: product.name,
            tier: product.strain,
            email,
            quantity,
            unit_amount_cents: unitAmountCents,
            amount_cents: amountCents,
            currency: "ZAR",
            status: "pending",
          });
        } catch (err) {
          // Non-fatal: Paystack is the source of truth for payment status, and the
          // webhook/verify handlers upsert the reservation once a reference exists.
          console.error("[paystack] failed to record pending reservation", err);
        }

        return Response.json({
          authorizationUrl: paystackData.data!.authorization_url,
          reference,
        });
      },
    },
  },
});
