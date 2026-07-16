import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — LOUDMOUF™" },
      {
        name: "description",
        content:
          "LOUDMOUF™ ships across South Africa via The our delivery partner — 3–5 working days for R150. Free over R800.",
      },
      { property: "og:title", content: "Shipping Policy — LOUDMOUF™" },
      {
        property: "og:description",
        content: "3–5 day discreet our delivery partner delivery across South Africa.",
      },
    ],
  }),
  component: () => (
    <SiteShell title="Shipping Policy" kicker="Delivery">
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

      <h2>1. Where We Ship</h2>
      <p>
        We deliver to all major addresses across the <strong>Republic of South Africa</strong> via{" "}
        <strong>The our delivery partner</strong>. We do not currently ship internationally.
      </p>

      <h2>2. Delivery Times</h2>
      <ul>
        <li>
          <strong>Standard delivery:</strong> 3–5 working days after dispatch.
        </li>
        <li>
          Reserve and Drop 001 items ship within 4 weeks of the campaign closing — you'll receive
          a dispatch email as soon as your tin leaves our facility.
        </li>
      </ul>

      <h2>3. Delivery Fees</h2>
      <ul>
        <li>
          Flat courier fee: <strong>R150</strong> per order.
        </li>
        <li>
          <strong>Free delivery</strong> on all orders over <strong>R800</strong>.
        </li>
      </ul>

      <h2>4. Discreet Packaging</h2>
      <p>Every LOUDMOUF™ order is packed in plain, unbranded outer packaging for your privacy.</p>

      <h2>5. Tracking</h2>
      <p>
        As soon as your order dispatches, you'll receive a tracking link and our delivery partner waybill
        number via email and SMS. You can also track your order any time on our{" "}
        <a href="/track-my-order">Track My Order</a> page.
      </p>

      <h2>6. Age Verification on Delivery</h2>
      <p>
        The our delivery partner may request proof of age (18+) on delivery. Please ensure a valid ID is
        available at the delivery address.
      </p>

      <h2>7. Failed Deliveries</h2>
      <p>
        If a delivery cannot be completed after two attempts, the order will be returned to us.
        Re-delivery will incur an additional courier fee.
      </p>

      <h2>8. Questions</h2>
      <p>
        Email <a href="mailto:hi@loudmouf.co.za">hi@loudmouf.co.za</a> or WhatsApp{" "}
        <a href="https://wa.me/27680200749">+27 68 020 0749</a>.
      </p>
    </SiteShell>
  ),
});
