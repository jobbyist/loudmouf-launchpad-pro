// Legally-defensible digital signature helper.
// Captures timestamp, IP address, agreement version, signature hash, and an
// acceptance record. Persisted locally for the Soft Launch — a follow-up will
// mirror this into the `member_signatures` table via the record-signature
// server route.
import { MEMBERSHIP_AGREEMENT_VERSION } from "./launch";

export interface SignatureRecord {
  agreementVersion: string;
  fullName: string;
  typedSignature: string;
  acceptedAt: string; // ISO
  ipAddress: string | null;
  userAgent: string;
  signatureHash: string; // SHA-256(fullName|typedSignature|acceptedAt|agreementVersion|ip)
  acceptanceStatements: string[];
}

const STORAGE_KEY = "loudmouf-membership-signature";

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function fetchIp(): Promise<string | null> {
  try {
    const res = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
    if (!res.ok) return null;
    const j = (await res.json()) as { ip?: string };
    return j.ip ?? null;
  } catch {
    return null;
  }
}

export async function createSignatureRecord(params: {
  fullName: string;
  typedSignature: string;
  acceptanceStatements: string[];
}): Promise<SignatureRecord> {
  const acceptedAt = new Date().toISOString();
  const ipAddress = await fetchIp();
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
  const payload = [
    params.fullName,
    params.typedSignature,
    acceptedAt,
    MEMBERSHIP_AGREEMENT_VERSION,
    ipAddress ?? "unknown",
  ].join("|");
  const signatureHash = await sha256(payload);

  const record: SignatureRecord = {
    agreementVersion: MEMBERSHIP_AGREEMENT_VERSION,
    fullName: params.fullName,
    typedSignature: params.typedSignature,
    acceptedAt,
    ipAddress,
    userAgent,
    signatureHash,
    acceptanceStatements: params.acceptanceStatements,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // ignore
  }

  // Best-effort persist server-side; fall back silently if unavailable.
  try {
    await fetch("/api/public/record-signature", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(record),
    });
  } catch {
    // ignore
  }

  return record;
}

export function readStoredSignature(): SignatureRecord | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SignatureRecord) : null;
  } catch {
    return null;
  }
}
