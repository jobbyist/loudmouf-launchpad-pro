// VerifyNow SAID verification client.
// See VERIFYNOW_SETUP.md for the full integration guide.
//
// This module intentionally runs client-side with a local checksum fallback
// so onboarding is functional out-of-the-box. The real VerifyNow REST call
// requires a server-side function (Lovable Cloud) that holds the API key —
// wire it in `callVerifyNowServer` once the secret + endpoint are configured.

export interface SAIDInfo {
  valid: boolean;
  dob?: string; // ISO date
  age?: number;
  gender?: "male" | "female";
  citizenship?: "SA" | "PR";
  reason?: string;
}

/**
 * Validate a South African ID number using the Luhn checksum
 * (aka the "ID verification" algorithm SARS/DHA publish).
 * Returns parsed DOB, age, gender and citizenship on success.
 */
export function parseSAID(said: string): SAIDInfo {
  const id = said.replace(/\s+/g, "");
  if (!/^\d{13}$/.test(id)) {
    return { valid: false, reason: "SA ID must be 13 digits." };
  }

  // DOB
  const yy = parseInt(id.slice(0, 2), 10);
  const mm = parseInt(id.slice(2, 4), 10);
  const dd = parseInt(id.slice(4, 6), 10);
  const currentYY = new Date().getFullYear() % 100;
  const century = yy <= currentYY ? 2000 : 1900;
  const year = century + yy;
  const dob = new Date(Date.UTC(year, mm - 1, dd));
  if (dob.getUTCFullYear() !== year || dob.getUTCMonth() !== mm - 1 || dob.getUTCDate() !== dd) {
    return { valid: false, reason: "Invalid date of birth in ID." };
  }

  // Gender: SSSS >= 5000 = male
  const genderDigits = parseInt(id.slice(6, 10), 10);
  const gender: SAIDInfo["gender"] = genderDigits >= 5000 ? "male" : "female";

  // Citizenship
  const citizenshipDigit = parseInt(id.charAt(10), 10);
  const citizenship: SAIDInfo["citizenship"] = citizenshipDigit === 0 ? "SA" : "PR";

  // Luhn checksum on the full 13 digits
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    const d = parseInt(id.charAt(i), 10);
    if (i % 2 === 0) {
      sum += d;
    } else {
      const doubled = d * 2;
      sum += doubled > 9 ? doubled - 9 : doubled;
    }
  }
  if (sum % 10 !== 0) {
    return { valid: false, reason: "ID checksum failed. Please check the number." };
  }

  // Age
  const now = new Date();
  let age = now.getUTCFullYear() - year;
  const mDelta = now.getUTCMonth() - (mm - 1);
  if (mDelta < 0 || (mDelta === 0 && now.getUTCDate() < dd)) age -= 1;

  return {
    valid: true,
    dob: dob.toISOString().slice(0, 10),
    age,
    gender,
    citizenship,
  };
}

/**
 * Server-backed VerifyNow call. Requires an edge/server function proxying to
 * https://api.verifynow.co.za with the VERIFYNOW_API_KEY secret.
 * See VERIFYNOW_SETUP.md.
 */
async function callVerifyNowServer(payload: {
  said: string;
  firstName: string;
  lastName: string;
}): Promise<SAIDInfo | null> {
  try {
    const { verifySAIDServerFn } = await import("./verifynow.functions");
    const result = await verifySAIDServerFn({ data: payload });
    // If the server said "not configured", fall back to local parse.
    if (!result.valid && /not configured/i.test(result.reason ?? "")) return null;
    return result as SAIDInfo;
  } catch {
    return null;
  }
}

export async function verifySAID(
  said: string,
  firstName: string,
  lastName: string,
): Promise<SAIDInfo> {
  // Try server-backed VerifyNow first (production path)
  const server = await callVerifyNowServer({ said, firstName, lastName });
  if (server) return server;

  // Fallback: local checksum + age gate (development / no-Cloud path)
  const info = parseSAID(said);
  if (!info.valid) return info;
  if ((info.age ?? 0) < 18) {
    return { ...info, valid: false, reason: "You must be 18 or older to join the Collective." };
  }
  return info;
}
