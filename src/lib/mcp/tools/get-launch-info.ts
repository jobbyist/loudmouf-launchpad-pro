import { defineTool } from "@lovable.dev/mcp-js";
import {
  LAUNCH_ISO,
  LAUNCH_TS,
  MEMBER_CAP,
  MEMBERS_CLAIMED_BASELINE,
  diffToLaunch,
} from "@/lib/launch";

export default defineTool({
  name: "get_launch_info",
  title: "Get LOUDMOUF launch info",
  description:
    "Get the LOUDMOUF™ Collective Drop 001 launch date, time-until-launch, member cap (2000), and current founder-tier spots claimed vs remaining.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: false },
  handler: () => {
    const now = Date.now();
    const diff = diffToLaunch(now);
    const info = {
      launchAt: LAUNCH_ISO,
      launchTimestamp: LAUNCH_TS,
      timeUntilLaunch: diff,
      hasLaunched: now >= LAUNCH_TS,
      memberCap: MEMBER_CAP,
      spotsClaimed: MEMBERS_CLAIMED_BASELINE,
      spotsRemaining: MEMBER_CAP - MEMBERS_CLAIMED_BASELINE,
      earlyAccessDiscountPct: 25,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
