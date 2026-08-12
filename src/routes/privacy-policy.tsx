import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — LOUDMOUF™" },
      {
        name: "description",
        content: "How LOUDMOUF™ collects, uses and protects your personal information under POPIA.",
      },
      { property: "og:title", content: "Privacy Policy — LOUDMOUF™" },
      {
        property: "og:description",
        content: "LOUDMOUF™ privacy practices under South African POPIA.",
      },
    ],
  }),
  component: () => (
    <SiteShell title="Privacy Policy" kicker="Legal">
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
        This Privacy Policy explains how LOUDPACK™ ("we", "us", "our"), the owner of the 
        LOUDMOUF™ trademark, collects, uses, stores and protects your personal information when you visit{" "}
        <a href="https://loudmouf.co.za">loudmouf.co.za</a> or purchase LOUDMOUF™ products. We
        comply with the Protection of Personal Information Act, 2013 (POPIA).
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Name, email, phone number, delivery address and billing address.</li>
        <li>
          Order history, payment confirmations (payment card details are processed by Shopify
          Payments / third-party providers, not stored by us).
        </li>
        <li>Age verification (18+) and device / browser data via cookies and analytics.</li>
      </ul>

      <h2>2. How We Use It</h2>
      <ul>
        <li>To process, fulfil and deliver your order via The Courier Guy.</li>
        <li>To send order updates, tracking and customer service communication.</li>
        <li>
          To send marketing communication (only with your consent — you can unsubscribe at any
          time).
        </li>
        <li>To comply with legal, regulatory and age-verification obligations.</li>
      </ul>

      <h2>3. Sharing</h2>
      <p>
        We share personal information only with trusted operators required to run our business:
        Shopify (e-commerce & checkout), The Courier Guy (delivery), payment processors, and
        email/analytics providers. We do not sell your data.
      </p>

      <h2>4. Cookies</h2>
      <p>
        We use cookies for cart persistence, analytics and essential site functionality. You can
        disable cookies in your browser but some site features may not work.
      </p>

      <h2>5. Your POPIA Rights</h2>
      <ul>
        <li>Access, correct, or delete your personal information.</li>
        <li>Withdraw marketing consent at any time.</li>
        <li>Lodge a complaint with the Information Regulator of South Africa.</li>
      </ul>

      <h2>6. Data Security & Retention</h2>
      <p>
        We use industry-standard measures to protect personal information and retain it only as long
        as required for business or legal purposes.
      </p>

      <h2>7. Contact the Information Officer</h2>
      <p>
        Email <a href="mailto:hi@loudmouf.co.za">hi@loudmouf.co.za</a> or WhatsApp{" "}
        <a href="https://wa.me/27680200749">+27 68 020 0749</a>.
      </p>
    </SiteShell>
  ),
});
