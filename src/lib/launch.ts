// Single source of truth for the Soft Launch countdown + member capacity.
// Consumed by Countdown, EarlyAccessBar, membership sections and MCP.
export const LAUNCH_ISO = "2026-09-15T20:00:00+02:00";
export const LAUNCH_TS = new Date(LAUNCH_ISO).getTime();

export const MEMBER_CAP = 2000;
// User-facing "spots left" starts at 234 → claimed baseline = 2000 - 234 = 1766.
export const MEMBERS_CLAIMED_BASELINE = 1766;

// Baseline anchor: 15 Jul 2026 05:00 SAST (UTC+2). Every SAST-day that has
// elapsed since this anchor at 05:00 SAST adds 2–3 additional claimed spots
// (deterministic pseudo-random per day so all clients agree).
export const CLAIMED_TICK_ANCHOR_ISO = "2026-07-15T05:00:00+02:00";
const CLAIMED_TICK_ANCHOR_TS = new Date(CLAIMED_TICK_ANCHOR_ISO).getTime();

function dailySeed(dayIndex: number): number {
  // Small deterministic 2–3 value from day index (mulberry32-ish).
  let x = dayIndex * 2654435761;
  x = (x ^ (x >>> 15)) >>> 0;
  return 2 + (x % 2); // 2 or 3
}

export function computeDailyClaimedDelta(now: number = Date.now()): number {
  const elapsed = now - CLAIMED_TICK_ANCHOR_TS;
  if (elapsed <= 0) return 0;
  const fullDays = Math.floor(elapsed / 86_400_000);
  let sum = 0;
  for (let i = 0; i < fullDays; i++) sum += dailySeed(i);
  return sum;
}

export function currentClaimed(persistedClaimed: number, now: number = Date.now()): number {
  const withDaily = MEMBERS_CLAIMED_BASELINE + computeDailyClaimedDelta(now);
  return Math.min(MEMBER_CAP, Math.max(persistedClaimed, withDaily));
}

export const MEMBERSHIP_AGREEMENT_VERSION = "2026.09.v1";

export function diffToLaunch(now: number = Date.now()) {
  const d = Math.max(0, LAUNCH_TS - now);
  return {
    days: Math.floor(d / 86_400_000),
    hours: Math.floor((d / 3_600_000) % 24),
    minutes: Math.floor((d / 60_000) % 60),
    seconds: Math.floor((d / 1_000) % 60),
  };
}

// Membership plans — canonical Standard / Premium model.
export const MEMBERSHIP_PLANS = [
  {
    id: "standard" as const,
    name: "Standard Membership",
    monthly: 99,
    tagline: "Enter the Collective.",
    recommended: false,
    benefits: [
      "Private Members Portal",
      "Personal Allocation Tracker",
      "Community Access",
      "VerifyNow Identity Verification",
      "Delegated Cultivation Management",
      "Basic Member Support",
    ],
    cta: "Become a Standard Member",
  },
  {
    id: "premium" as const,
    name: "Premium Membership",
    monthly: 149,
    tagline: "Everything in Standard, elevated.",
    recommended: true,
    benefits: [
      "LOUDMOUF™ Rewards Card",
      "Loyalty Points & Cashback Rewards",
      "Priority Yield Processing",
      "Priority Merchandise Drops",
      "Priority Event Access",
      "Enhanced Allocation Insights",
      "Premium Support",
    ],
    cta: "Become a Premium Member",
  },
];

export const YIELD_CONTRIBUTION_PER_TIN = 350;

export function estimateMonthlyContribution(planMonthly: number, allocationRequests: number) {
  return planMonthly + allocationRequests * YIELD_CONTRIBUTION_PER_TIN;
}

export function membershipFeeFor(tier: string | undefined | null): number {
  if (tier === "premium") return 149;
  if (tier === "standard") return 99;
  return 0;
}
