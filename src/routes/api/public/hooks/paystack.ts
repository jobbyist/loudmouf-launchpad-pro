import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/api/public/hooks/paystack')({
  GET: () => new Response('Paystack webhook endpoint', { status: 200 }),
  POST: async ({ request }) => {
    try {
      const rawBody = await request.text();
      const signature = request.headers.get('x-paystack-signature');
      const secret = process.env.PAYSTACK_SECRET_KEY;

      if (!secret) {
        console.error('PAYSTACK_SECRET_KEY not set');
        return new Response('Server config error', { status: 500 });
      }

      // Verify signature
      const crypto = await import('crypto');
      const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

      if (hash !== signature) {
        console.error('Invalid Paystack signature');
        return new Response('Invalid signature', { status: 401 });
      }

      const event = JSON.parse(rawBody);
      console.log('Paystack webhook event:', event.event);

      // Handle charge.success for membership
      if (event.event === 'charge.success') {
        const data = event.data;
        const email = data.customer.email;
        const amount = data.amount / 100; // to Rand
        const reference = data.reference;

        // TODO: Update Supabase profile or membership status
        // For now, log and assume enable yield
        console.log(`Membership payment verified for ${email}: R${amount} ref ${reference}`);
        // Enable yield allocation in dashboard via profile update or flag
      }

      return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
    } catch (error) {
      console.error('Webhook error:', error);
      return new Response('Error', { status: 400 });
    }
  },
});
