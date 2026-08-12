export const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || '';

// The amount is decided server-side from the tier — never sent from the browser.
export async function initializePaystackPayment(
  email: string,
  tier: 'standard' | 'premium',
  metadata: Record<string, unknown> = {},
) {
  const response = await fetch('/api/paystack/initialize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, metadata: { ...metadata, tier } }),
  });
  return response.json();
}
