import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/community-guidelines")({
  head: () => ({
    meta: [
      { title: "Community Guidelines — LOUDMOUF™" },
      {
        name: "description",
        content:
          "How we conduct ourselves inside the LOUDMOUF™ Private Lifestyle Club — values, responsible private use, respect, safety and member expectations.",
      },
      { property: "og:title", content: "Community Guidelines — LOUDMOUF™" },
      {
        property: "og:description",
        content:
          "Values, respect, safety and member expectations inside the LOUDMOUF™ Private Lifestyle Club.",
      },
    ],
  }),
  component: () => (
    <SiteShell title="Community Guidelines" kicker="The Collective">
      <p>
        LOUDMOUF™ is a Private Lifestyle Club — not a retail shop. These guidelines describe how
        members conduct themselves inside the collective and what we expect of one another. By
        joining, you commit to upholding them.
      </p>

      <h2>1. Club Values</h2>
      <ul>
        <li>
          <strong>Discretion.</strong> What happens in the collective, stays in the collective.
        </li>
        <li>
          <strong>Respect.</strong> Every member is welcome, regardless of background, identity or
          experience.
        </li>
        <li>
          <strong>Craft.</strong> We take quality, provenance and true-grade cultivation seriously.
        </li>
        <li>
          <strong>Consent.</strong> Yield contributions are for personal, private, adult use only.
        </li>
      </ul>

      <h2>2. Responsible Private Use</h2>
      <p>
        Yield allocations are consumed privately by the member who requested them. Members must
        never resell, gift commercially, or supply allocations to persons under 18. Consumption in
        public places is prohibited by South African law.
      </p>

      <h2>3. Respect &amp; Safety</h2>
      <ul>
        <li>
          No harassment, discrimination, hate speech or threats — inside member spaces, events or
          public channels.
        </li>
        <li>
          No sharing of another member's identity, image, contact details or allocation history.
        </li>
        <li>
          Do not attend events or engage with the collective while under the influence to a degree
          that puts yourself or others at risk.
        </li>
      </ul>

      <h2>4. Privacy</h2>
      <p>
        Your SA ID, address and allocation history are strictly private. We never sell member data.
        See the <a href="/privacy-policy">Privacy Policy</a> for POPIA-compliant details.
      </p>

      <h2>5. Membership Expectations</h2>
      <ul>
        <li>Keep your account details, VerifyNow verification and delivery address current.</li>
        <li>Honour your monthly contribution — dormant accounts may be paused after 90 days.</li>
        <li>
          Report suspicious activity, safety concerns or code-of-conduct breaches to{" "}
          <a href="mailto:hi@loudmouf.co.za">hi@loudmouf.co.za</a>.
        </li>
      </ul>

      <h2>6. Constitutional Rights &amp; Legal Framing</h2>
      <p>
        LOUDMOUF™ operates on the basis of members' constitutional right to personal, private
        cultivation and use of cannabis in South Africa. The collective acts as an Agent under a
        Delegated Cultivation Mandate — never as a retail seller. Members remain the ultimate
        holders of their private-use rights.
      </p>

      <h2>7. Enforcement</h2>
      <p>
        Breach of these guidelines can result in a warning, membership suspension, or termination of
        your Agency Mandate without refund of the monthly membership contribution. Serious breaches
        (fraud, resale, supply to minors) will be reported to the relevant authorities.
      </p>

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
    </SiteShell>
  ),
});
