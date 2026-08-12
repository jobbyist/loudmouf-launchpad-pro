import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const InputSchema = z.object({
  said: z.string().regex(/^\d{13}$/),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
});

// Per-member attempt budget — verification is a paid, PII-sensitive lookup.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function overBudget(userId: string) {
  const now = Date.now();
  const entry = attempts.get(userId);
  if (!entry || entry.resetAt < now) {
    attempts.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export const verifySAIDServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data, context }) => {
    if (overBudget(context.userId)) {
      return {
        valid: false as const,
        reason: "Too many verification attempts. Please try again later.",
      };
    }

    const key = process.env.VERIFYNOW_API_KEY;
    if (!key) {
      return { valid: false as const, reason: "VerifyNow not configured on server." };
    }
    try {
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
          mode:
            process.env.NODE_ENV === "production" ||
            process.env.VERIFYNOW_MODE === "production"
              ? "production"
              : "sandbox",
        }),
      });
      if (!res.ok) {
        console.error("VerifyNow error", res.status);
        return { valid: false as const, reason: "Verification service unavailable." };
      }
      const raw = (await res.json()) as any;
      const verification =
        raw.results?.said_verification?.realTimeResults?.Verification || {};
      const realTimeStatus = raw.results?.said_verification?.realTimeResults?.Status;
      return {
        valid: !!(
          raw.success &&
          (realTimeStatus === "ID Number Valid" || verification.Status === "ID Number Valid")
        ),
        dob: verification.Dob,
        age: verification.Age,
        gender: (verification.Gender || "").toLowerCase() as "male" | "female" | undefined,
        citizenship: verification.Citizenship?.includes("South African") ? "SA" : "PR",
        reason: realTimeStatus || raw.results?.said_verification?.Status,
      };
    } catch (e) {
      console.error("VerifyNow request failed", e);
      return { valid: false as const, reason: "Verification service unavailable." };
    }
  });
