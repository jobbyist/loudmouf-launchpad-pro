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
    const base = process.env.VERIFYNOW_BASE_URL ?? "https://api.verifynow.co.za/v1";
    if (!key) {
      return { valid: false as const, reason: "VerifyNow not configured on server." };
    }
    try {
      const res = await fetch(`${base}/said/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": key,
          Authorization: `Bearer ${key}`,
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
      const raw = (await res.json()) as {
        verified?: boolean;
        dateOfBirth?: string;
        age?: number;
        gender?: string;
        citizenship?: string;
        message?: string;
      };
      return {
        valid: !!raw.verified,
        dob: raw.dateOfBirth,
        age: raw.age,
        gender: raw.gender?.toLowerCase() as "male" | "female" | undefined,
        citizenship: (raw.citizenship as "SA" | "PR" | undefined) ?? undefined,
        reason: raw.message,
      };
    } catch (e) {
      return {
        valid: false as const,
        reason: e instanceof Error ? e.message : "VerifyNow request failed",
      };
    }
  });
