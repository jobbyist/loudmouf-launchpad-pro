import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

interface ShopifyLineItem {
  title?: string;
  sku?: string;
  variant_title?: string;
  quantity?: number;
}
interface ShopifyOrder {
  id: number | string;
  email?: string;
  total_price?: string;
  currency?: string;
  financial_status?: string;
  fulfillment_status?: string;
  line_items?: ShopifyLineItem[];
  note_attributes?: Array<{ name: string; value: string }>;
}

function extractTier(order: ShopifyOrder): string | null {
  const items = order.line_items ?? [];
  for (const li of items) {
    const t = `${li.title ?? ""} ${li.variant_title ?? ""} ${li.sku ?? ""}`.toLowerCase();
    if (t.includes("premium")) return "premium";
    if (t.includes("standard")) return "standard";
  }
  return null;
}

function extractReferralCode(order: ShopifyOrder): string | null {
  const attrs = order.note_attributes ?? [];
  for (const a of attrs) {
    if (a.name?.toLowerCase() === "referral_code" || a.name?.toLowerCase() === "ref") {
      return a.value?.slice(0, 20) ?? null;
    }
  }
  return null;
}

export const Route = createFileRoute("/api/public/hooks/shopify-orders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
        if (secret) {
          const sig = request.headers.get("x-shopify-hmac-sha256") ?? "";
          const expected = createHmac("sha256", secret).update(raw, "utf8").digest("base64");
          const a = Buffer.from(sig);
          const b = Buffer.from(expected);
          if (a.length !== b.length || !timingSafeEqual(a, b)) {
            return new Response("Invalid signature", { status: 401 });
          }
        }

        let order: ShopifyOrder;
        try {
          order = JSON.parse(raw) as ShopifyOrder;
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const shopifyOrderId = String(order.id);
        const tier = extractTier(order);
        const totalCents = order.total_price
          ? Math.round(parseFloat(order.total_price) * 100)
          : null;

        // Look up user by email
        let userId: string | null = null;
        if (order.email) {
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("email", order.email)
            .maybeSingle();
          userId = profile?.id ?? null;
        }

        await supabaseAdmin
          .from("shopify_orders")
          .upsert(
            {
              shopify_order_id: shopifyOrderId,
              email: order.email ?? null,
              user_id: userId,
              tier,
              total_cents: totalCents,
              currency: order.currency ?? "ZAR",
              status: "received",
              financial_status: order.financial_status ?? null,
              fulfillment_status: order.fulfillment_status ?? null,
              raw: order as unknown as Record<string, unknown>,
            },
            { onConflict: "shopify_order_id" },
          );

        // Referral attribution: 10% membership OR 10% yield sale
        const refCode = extractReferralCode(order);
        if (refCode && totalCents) {
          const { data: referrer } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("referral_code", refCode)
            .maybeSingle();
          if (referrer?.id) {
            const eventType = tier ? "membership" : "yield_order";
            const commissionCents = Math.round(totalCents * 0.1);
            await supabaseAdmin.from("referral_attributions").insert({
              referrer_user_id: referrer.id,
              referred_user_id: userId,
              referred_email: order.email ?? null,
              source: "shopify",
              event_type: eventType,
              commission_cents: commissionCents,
              status: "pending",
              shopify_order_id: shopifyOrderId,
            });
          }
        }

        return Response.json({ ok: true });
      },
    },
  },
});
