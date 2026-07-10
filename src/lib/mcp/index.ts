import { defineMcp } from "@lovable.dev/mcp-js";
import listFlavors from "./tools/list-flavors";
import getLaunchInfo from "./tools/get-launch-info";
import listMembershipTiers from "./tools/list-membership-tiers";
import getBrandInfo from "./tools/get-brand-info";

export default defineMcp({
  name: "loudmouf-mcp",
  title: "LOUDMOUF™ Collective",
  version: "0.1.0",
  instructions:
    "Public MCP server for LOUDMOUF™ — South Africa's first premium cannabis pouch brand. Use these tools to answer questions about flavors, pricing, launch timing, remaining founder spots, and the Collective private-membership tiers.",
  tools: [listFlavors, getLaunchInfo, listMembershipTiers, getBrandInfo],
});
