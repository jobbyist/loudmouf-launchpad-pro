export const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || '';

export async function initializePaystackPayment(email: string, amount: number, metadata: any = {}) {
  const response = await fetch('/api/paystack/initialize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, amount, metadata }),
  });
  return response.json();
}
