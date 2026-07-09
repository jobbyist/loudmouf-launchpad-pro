# VerifyNow SAID Verification — Setup

LOUDMOUF™ onboarding uses [VerifyNow](https://www.verifynow.co.za/api-docs) to confirm each applicant's South African ID number, DOB and legal age before granting Collective membership.

The client (`src/lib/verifynow.ts`) ships with a **local checksum + age gate fallback** so onboarding is fully functional out of the box. To flip it to the real VerifyNow REST API you need to add a small server-side proxy that holds the API key — the key must never live in the browser bundle.

---

## 1. Get your VerifyNow credentials

1. Sign up at <https://www.verifynow.co.za> and complete KYC.
2. In the merchant dashboard, generate an **API Key** for the "SA ID Verification" product.
3. Note your assigned base URL (usually `https://api.verifynow.co.za/v1`).

## 2. Enable Lovable Cloud

The API key is a secret and must be stored server-side. In Lovable:

- Open the **More → Cloud** panel and click **Enable Cloud**.
- After it provisions, add two secrets:
  - `VERIFYNOW_API_KEY` — the key from step 1
  - `VERIFYNOW_BASE_URL` — e.g. `https://api.verifynow.co.za/v1`

## 3. Add the server function

Create `src/lib/verifynow.functions.ts`:

```ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const verifySAIDServerFn = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({
      said: z.string().regex(/^\d{13}$/),
      firstName: z.string().min(1).max(80),
      lastName: z.string().min(1).max(80),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    const key = process.env.VERIFYNOW_API_KEY!;
    const base = process.env.VERIFYNOW_BASE_URL ?? "https://api.verifynow.co.za/v1";
    const res = await fetch(`${base}/said/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": key,
      },
      body: JSON.stringify({
        idNumber: data.said,
        firstName: data.firstName,
        lastName: data.lastName,
      }),
    });
    if (!res.ok) {
      return { valid: false as const, reason: `VerifyNow ${res.status}` };
    }
    const raw = await res.json();
    // Map VerifyNow response → our SAIDInfo shape
    return {
      valid: !!raw.verified,
      dob: raw.dateOfBirth,
      age: raw.age,
      gender: raw.gender?.toLowerCase(),
      citizenship: raw.citizenship,
      reason: raw.message,
    };
  });
```

## 4. Point the client at the server function

Replace the `callVerifyNowServer` implementation in `src/lib/verifynow.ts` with:

```ts
import { verifySAIDServerFn } from "./verifynow.functions";

async function callVerifyNowServer(payload) {
  try {
    return await verifySAIDServerFn({ data: payload });
  } catch {
    return null;
  }
}
```

That's it — the onboarding modal will now route through your real VerifyNow account.

## 5. Local development / no-Cloud mode

If Cloud is not enabled, the client falls back to `parseSAID()`, which:

- Validates the 13-digit format
- Verifies the Luhn checksum used by DHA
- Parses DOB, age, gender and SA/PR citizenship
- Rejects applicants under 18

This is safe for staging but is **not** a substitute for the real VerifyNow lookup in production, which additionally checks that the ID is registered to the supplied name and is not flagged as deceased or fraudulent.

## Data handling

- SAIDs and personal data are POSTed to the server function over HTTPS.
- Do **not** log full ID numbers. Store only a masked form (`900101******`) and the verification result in your database of record.
- Comply with POPIA: obtain explicit consent (the onboarding modal captures this) and document the retention period in your privacy policy.
