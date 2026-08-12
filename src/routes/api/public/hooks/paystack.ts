import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/paystack")({
  server: {
    handlers: {
      GET: async () => new Response("Paystack webhook endpoint", { status: 200 }),
      POST: async ({ request }) => {
        try {
          const rawBody = await request.text();
          const signature = request.headers.get("x-paystack-signature");
          const secret = process.env.PAYSTACK_SECRET_KEY;

          // Fail closed: never process an unverified webhook.
          if (!secret) {
            console.error("PAYSTACK_SECRET_KEY not set — rejecting webhook");
            return new Response("Server config error", { status: 500 });
          }
          if (!signature) {
            return new Response("Invalid signature", { status: 401 });
          }

          const { createHmac, timingSafeEqual } = await import("crypto");
          const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
          const a = Buffer.from(signature);
          const b = Buffer.from(expected);
          if (a.length !== b.length || !timingSafeEqual(a, b)) {
            return new Response("Invalid signature", { status: 401 });
          }

          const event = JSON.parse(rawBody);
          if (event.event === "charge.success") {
            console.log("Verified Paystack charge.success", event.data?.reference);
          }

          return new Response(JSON.stringify({ status: "success" }), { status: 200 });
        } catch {
          return new Response("Error", { status: 400 });
        }
      },
    },
  },
});
