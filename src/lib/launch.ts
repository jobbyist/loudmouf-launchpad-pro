// Single source of truth for the Soft Launch countdown + member capacity.
// Consumed by Countdown, EarlyAccessBar, membership sections and MCP.
export const LAUNCH_ISO = "2026-08-11T20:00:00+02:00";
export const LAUNCH_TS = new Date(LAUNCH_ISO).getTime();

export const MEMBER_CAP = 2000;
export const MEMBERS_CLAIMED_BASELINE = 1674;

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
