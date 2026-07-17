import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/api/paystack/initialize')({
  POST: async ({ request }) => {
    try {
      const { email, amount, metadata } = await request.json();
      const secret = process.env.PAYSTACK_SECRET_KEY;

      if (!secret) {
        return new Response(JSON.stringify({ error: 'Server config error' }), { status: 500 });
      }

      const res = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100), // to kobo
          metadata,
          callback_url: `${new URL(request.url).origin}/membership?payment=success`,
        }),
      });

      const data = await res.json();
      return new Response(JSON.stringify(data), { status: res.status });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to initialize' }), { status: 500 });
    }
  },
});
