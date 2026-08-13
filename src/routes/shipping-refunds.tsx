import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/shipping-refunds")({
  head: () => ({
    meta: [
      { title: "Shipping & Refunds — LOUDMOUF™" },
      {
        name: "description",
        content:
          "LOUDMOUF™ ships across South Africa via our reliable and discreet delivery partner — 3–5 working days for R99. Free delivery for premium members. 7-day returns policy for defective, damaged or incorrect items.",
      },
      { property: "og:title", content: "Shipping & Refunds — LOUDMOUF™" },
      {
        property: "og:description",
        content: "3–5 day discreet delivery across South Africa. 7-day returns for defective, damaged or incorrect items.",
      },
    ],
  }),
  component: () => (
    <SiteShell title="Shipping & Refunds" kicker="Legal">
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

      <h2>Shipping Policy</h2>

      <h3>1. Where We Ship</h3>
      <p>
        We deliver to all major addresses across the <strong>Republic of South Africa</strong> via{" "}
        <strong>our reliable and discreet delivery partner</strong>. We do not currently ship internationally.
      </p>

      <h3>2. Delivery Times</h3>
      <ul>
        <li>
          <strong>Standard delivery:</strong> 3–5 working days after dispatch.
        </li>
        <li>
          Reserve and Drop 001 items ship within 4 weeks of the campaign closing — you'll receive
          a dispatch email as soon as your tin leaves our facility.
        </li>
      </ul>

      <h3>3. Delivery Fees</h3>
      <ul>
        <li>
          Flat courier fee: <strong>R99</strong> per order.
        </li>
        <li>
          <strong>Free delivery</strong> for premium members.
        </li>
      </ul>

      <h3>4. Discreet Packaging</h3>
      <p>Every LOUDMOUF™ order is packed in plain, unbranded outer packaging for your privacy.</p>

      <h3>5. Age Verification on Delivery</h3>
      <p>
        Our delivery partner may request proof of age (18+) on delivery. Please ensure a valid ID is
        available at the delivery address.
      </p>

      <h3>6. Failed Deliveries</h3>
      <p>
        If a delivery cannot be completed after two attempts, the order will be returned to us.
        Re-delivery will incur an additional courier fee.
      </p>

      <h2>Returns & Refunds Policy</h2>
      <p>
        We stand behind every tin of LOUDMOUF™. If something isn't right, we'll make it right —
        within the terms below and in line with the South African Consumer Protection Act, 2008.
      </p>

      <h3>1. 7-Day Return Window</h3>
      <p>
        You may request a return or exchange within{" "}
        <strong>7 days of the order being fulfilled</strong> (delivered) if the product is:
      </p>
      <ul>
        <li>Defective on arrival;</li>
        <li>Damaged in transit; or</li>
        <li>Not the item you ordered.</li>
      </ul>

      <h3>2. Exclusions</h3>
      <p>The following items cannot be returned or exchanged:</p>
      <ul>
        <li>Gift cards.</li>
        <li>Products purchased on sale or with a promotional discount.</li>
        <li>Items that have been opened, used or tampered with (unless defective on arrival).</li>
      </ul>

      <h3>3. Questions</h3>
      <p>
        For shipping inquiries, return requests, or general questions, contact us at{" "}
        <a href="mailto:hi@loudmouf.co.za">hi@loudmouf.co.za</a> or WhatsApp{" "}
        <a href="https://wa.me/27680200749">+27 68 020 0749</a>.
      </p>
    </SiteShell>
  ),
});

