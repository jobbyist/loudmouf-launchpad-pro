// Transactional email via Resend (https://resend.com). Server-only module —
// never import this from a route file or *.functions.ts that ships to the
// client bundle; load it inside server handlers, same convention as
// client.server.ts.
const RESEND_API = "https://api.resend.com/emails";

export const WEBMASTER_EMAIL = "hi@loudmouf.co.za";

interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/** Fire-and-log: a failed email should never fail the underlying payment flow. */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not configured — skipping send:", input.subject);
    return;
  }
  const from = process.env.RESEND_FROM_EMAIL || "LOUDMOUF™ <orders@loudmouf.co.za>";
  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[email] send failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("[email] send error", err);
  }
}

function formatZar(amount: number): string {
  return `R${amount.toLocaleString("en-ZA")}`;
}

function emailShell(title: string, bodyHtml: string): string {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;color:#111;padding:8px;">
  <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#999;margin:0 0 16px;">LOUDMOUF™</p>
  <h1 style="font-size:20px;margin:0 0 16px;">${title}</h1>
  ${bodyHtml}
  <p style="margin-top:28px;font-size:12px;color:#999;border-top:1px solid #eee;padding-top:16px;">
    LOUDMOUF™ · Big Taste. Zero Smoke. · Questions? Reply to this email or write to
    <a href="mailto:${WEBMASTER_EMAIL}" style="color:#999;">${WEBMASTER_EMAIL}</a>.
  </p>
</div>`;
}

function summaryTable(rows: Array<[string, string]>): string {
  const cells = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 0;color:#666;">${label}</td><td style="padding:6px 0;text-align:right;font-weight:600;">${value}</td></tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin:16px 0;">${cells}</table>`;
}

export interface TinctureReservationEmailInput {
  reference: string;
  productName: string;
  tier: string;
  quantity: number;
  amountZar: number;
  email: string;
}

/**
 * Sends a customer order-confirmation email and an internal notification to
 * the webmaster once a herbal-tincture reservation clears with Paystack.
 * Called from both /api/public/paystack/verify (the return-from-checkout
 * redirect) and /api/public/hooks/paystack-webhook (Paystack's server
 * webhook) — callers are responsible for only invoking this once per
 * reference (i.e. on the pending -> paid transition) to avoid duplicates.
 */
export async function sendTinctureReservationEmails(
  input: TinctureReservationEmailInput,
): Promise<void> {
  const { reference, productName, tier, quantity, amountZar, email } = input;

  const customerHtml = emailShell(
    "Reservation confirmed 🌿",
    `
    <p>Your LOUDMOUF™ reservation is confirmed — thanks for your order.</p>
    ${summaryTable([
      ["Product", `${productName} (${tier})`],
      ["Quantity", String(quantity)],
      ["Total paid", formatZar(amountZar)],
      ["Reference", reference],
    ])}
    <p>We'll be in touch with delivery details shortly.</p>
  `,
  );

  const webmasterHtml = emailShell(
    "New paid reservation",
    `
    ${summaryTable([
      ["Customer", email],
      ["Product", `${productName} (${tier})`],
      ["Quantity", String(quantity)],
      ["Amount", formatZar(amountZar)],
      ["Reference", reference],
    ])}
  `,
  );

  await Promise.all([
    sendEmail({
      to: email,
      subject: `Your LOUDMOUF™ reservation is confirmed — ${productName}`,
      html: customerHtml,
      replyTo: WEBMASTER_EMAIL,
    }),
    sendEmail({
      to: WEBMASTER_EMAIL,
      subject: `New paid reservation — ${productName} × ${quantity} (${reference})`,
      html: webmasterHtml,
    }),
  ]);
}
