import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  said: z.string().regex(/^\d{13}$/),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
});

export const verifySAIDServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.VERIFYNOW_API_KEY;
    if (!key) {
      return { valid: false as const, reason: "VerifyNow not configured on server." };
    }
    try {
      // Safe idempotency key (works in edge/Deno/Node without relying on crypto in all contexts)
      const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const res = await fetch(`https://www.verifynow.co.za/api/external/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          reportType: "said_verification",
          idNumber: data.said,
          mode: (process.env.NODE_ENV === 'production' || process.env.VERIFYNOW_MODE === 'production') ? 'production' : 'sandbox',
        }),
      });
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'No error body');
        return { valid: false as const, reason: `VerifyNow ${res.status}: ${errorText}` };
      }
      const raw = (await res.json()) as any;
      const verification = raw.results?.said_verification?.realTimeResults?.Verification || {};
      const realTimeStatus = raw.results?.said_verification?.realTimeResults?.Status;
      return {
        valid: !!(raw.success && (realTimeStatus === 'ID Number Valid' || verification.Status === 'ID Number Valid')),
        dob: verification.Dob,
        age: verification.Age,
        gender: (verification.Gender || '').toLowerCase() as "male" | "female" | undefined,
        citizenship: verification.Citizenship?.includes('South African') ? 'SA' : 'PR',
        reason: realTimeStatus || raw.results?.said_verification?.Status,
      };
    } catch (e) {
      return {
        valid: false as const,
        reason: e instanceof Error ? e.message : "VerifyNow request failed",
      };
    }
  });
