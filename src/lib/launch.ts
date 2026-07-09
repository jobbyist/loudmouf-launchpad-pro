// Single source of truth for the Drop 001 launch countdown.
// Homepage `Countdown` and sticky `EarlyAccessBar` both read this.
export const LAUNCH_ISO = "2026-08-11T20:00:00+02:00";
export const LAUNCH_TS = new Date(LAUNCH_ISO).getTime();

export const MEMBER_CAP = 2000;
export const MEMBERS_CLAIMED_BASELINE = 767;

export function diffToLaunch(now: number = Date.now()) {
  const d = Math.max(0, LAUNCH_TS - now);
  return {
    days: Math.floor(d / 86_400_000),
    hours: Math.floor((d / 3_600_000) % 24),
    minutes: Math.floor((d / 60_000) % 60),
    seconds: Math.floor((d / 1_000) % 60),
  };
}
