import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Server-side price table — the client never decides what it is charged.
const TIER_PRICES_ZAR: Record<string, number> = {
  standard: 99,
  premium: 149,
};

const BodySchema = z.object({
  email: z.string().email().max(200),
  metadata: z
    .object({
      tier: z.enum(["standard", "premium"]),
    })
    .passthrough(),
});

export const Route = createFileRoute("/api/paystack/initialize")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const parsed = BodySchema.safeParse(await request.json());
          if (!parsed.success) {
            return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
          }
          const { email, metadata } = parsed.data;
          const amountZar = TIER_PRICES_ZAR[metadata.tier];
          if (!amountZar) {
            return new Response(JSON.stringify({ error: "Unknown membership tier" }), {
              status: 400,
            });
          }

          const secret = process.env.PAYSTACK_SECRET_KEY;
          if (!secret) {
            return new Response(JSON.stringify({ error: "Server config error" }), { status: 500 });
          }

          const res = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${secret}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              amount: Math.round(amountZar * 100), // cents — derived server-side only
              metadata: { ...metadata, tier: metadata.tier, amount_zar: amountZar },
              callback_url: `${new URL(request.url).origin}/membership?payment=success`,
            }),
          });

          const data = await res.json();
          return new Response(JSON.stringify(data), { status: res.status });
        } catch {
          return new Response(JSON.stringify({ error: "Failed to initialize" }), { status: 500 });
        }
      },
    },
  },
});
