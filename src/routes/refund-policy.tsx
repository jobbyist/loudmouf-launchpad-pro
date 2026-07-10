import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Returns & Refunds — LOUDMOUF™" },
      {
        name: "description",
        content:
          "LOUDMOUF™ 7-day returns policy for defective, damaged or incorrect items delivered in South Africa.",
      },
      { property: "og:title", content: "Returns & Refunds — LOUDMOUF™" },
      {
        property: "og:description",
        content: "7-day returns for defective, damaged or incorrect items.",
      },
    ],
  }),
  component: () => (
    <SiteShell title="Returns & Refunds" kicker="Legal">
      <p>
        <em>
          Last updated:{" "}
          {new Date().toLocaleDateString("en-ZA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </em>
      </p>
      <p>
        We stand behind every tin of LOUDMOUF™. If something isn't right, we'll make it right —
        within the terms below and in line with the South African Consumer Protection Act, 2008.
      </p>

      <h2>1. 7-Day Return Window</h2>
      <p>
        You may request a return or exchange within{" "}
        <strong>7 days of the order being fulfilled</strong> (delivered) if the product is:
      </p>
      <ul>
        <li>Defective on arrival;</li>
        <li>Damaged in transit; or</li>
        <li>Not the item you ordered.</li>
      </ul>

      <h2>2. Exclusions</h2>
      <p>The following items cannot be returned or exchanged:</p>
      <ul>
        <li>Gift cards.</li>
        <li>Products purchased on sale or with a promotional discount.</li>
        <li>Items that have been opened, used or tampered with (unless defective on arrival).</li>
      </ul>

      <h2>3. How to Request a Return</h2>
      <ol>
        <li>
          Email <a href="mailto:hi@loudmouf.co.za">hi@loudmouf.co.za</a> or WhatsApp{" "}
          <a href="https://wa.me/27680200749">+27 68 020 0749</a> within 7 days of delivery with
          your order number and clear photos of the issue.
        </li>
        <li>We'll confirm approval and arrange collection via The Courier Guy where applicable.</li>
        <li>
          Once inspected, an approved return will be refunded to the original payment method within
          10 working days, or exchanged for a replacement of equal value.
        </li>
      </ol>

      <h2>4. Cancellations</h2>
      <p>
        Orders may be cancelled before dispatch for a full refund. Once dispatched, the return
        process above applies.
      </p>

      <h2>5. Delivery Charges</h2>
      <p>
        Where a return is approved due to our error (defective, damaged or incorrect item), we cover
        the return courier fee. Return delivery for change-of-mind orders is not offered on cannabis
        products for compliance and safety reasons.
      </p>
    </SiteShell>
  ),
});
