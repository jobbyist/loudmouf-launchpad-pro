import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — LOUDMOUF™" },
      {
        name: "description",
        content: "The terms governing purchase and use of LOUDMOUF™ products in South Africa.",
      },
      { property: "og:title", content: "Terms & Conditions — LOUDMOUF™" },
      { property: "og:description", content: "LOUDMOUF™ terms of sale and use, South Africa." },
    ],
  }),
  component: () => (
    <SiteShell title="Terms & Conditions" kicker="Legal">
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
        These Terms & Conditions govern your access to and use of{" "}
        <a href="https://loudmouf.co.za">loudmouf.co.za</a> and the purchase of LOUDMOUF™ products.
        By using this site or placing an order you agree to be bound by these terms.
      </p>

      <h2>1. About Us</h2>
      <p>
        LOUDMOUF™ is a registered trademark owned and operated by{" "}
        <strong>LOUDPACK™</strong> (registration number 2024/596436/07), a South African company.
      </p>

      <h2>2. Age Restriction (18+)</h2>
      <p>
        LOUDMOUF™ products contain cannabis and are strictly for adults aged 18 and older. By
        purchasing you confirm you are of legal age and that purchase is lawful in your
        jurisdiction. We reserve the right to cancel any order where age cannot be verified.
      </p>

      <h2>3. Products & Compliance</h2>
      <p>
        LOUDMOUF™ cannabis pouches are sold in compliance with the Cannabis for Private Purposes
        Act, 2024 and other applicable South African legislation. Products are for personal use only
        and may not be resold.
      </p>

      <h2>4. Orders, Pricing & Payment</h2>
      <ul>
        <li>All prices are shown in South African Rand (ZAR) and include applicable VAT.</li>
        <li>
          Payment is processed securely via Shopify Payments and supports Visa, Mastercard, Apple
          Pay and EFT.
        </li>
        <li>An order is accepted once payment has cleared and a confirmation email is issued.</li>
      </ul>

      <h2>5. Delivery</h2>
      <p>
        See our <a href="/shipping-policy">Shipping Policy</a> for full delivery terms.
      </p>

      <h2>6. Returns & Refunds</h2>
      <p>
        See our <a href="/refund-policy">Returns & Refunds Policy</a>.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        LOUDMOUF™ and LOUDPACK™ are protected trademarks. All site content, branding, photography and copy are protected. You may not copy, reproduce or distribute any
        content without written permission.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, we are not liable for any indirect or consequential
        damages arising from the use of our products or website. Nothing in these terms limits
        liability that cannot lawfully be excluded under the Consumer Protection Act, 2008.
      </p>

      <h2>9. Governing Law</h2>
      <p>These terms are governed by the laws of the Republic of South Africa.</p>

      <h2>10. Contact</h2>
      <p>
        Email <a href="mailto:hi@loudmouf.co.za">hi@loudmouf.co.za</a> · WhatsApp{" "}
        <a href="https://wa.me/27680200749">+27 68 020 0749</a>.
      </p>
    </SiteShell>
  ),
});
