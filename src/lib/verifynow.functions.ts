import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const verifySAIDServerFn = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        said: z.string().regex(/^\d{13}$/),
        firstName: z.string().min(1).max(80),
        lastName: z.string().min(1).max(80),
      })
      .parse(data),
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
