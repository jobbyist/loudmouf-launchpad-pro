import { defineMcp, auth } from "@lovable.dev/mcp-js";
import listFlavors from "./tools/list-flavors";
import getLaunchInfo from "./tools/get-launch-info";
import listMembershipTiers from "./tools/list-membership-tiers";
import getBrandInfo from "./tools/get-brand-info";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL ?? "";

export default defineMcp({
  name: "loudmouf-mcp",
  title: "LOUDMOUF™ Collective",
  version: "0.1.0",
  instructions:
    "MCP server for LOUDMOUF™ — South Africa's first premium cannabis pouch brand. Use these tools to answer questions about flavors, pricing, launch timing, remaining founder spots, and the Collective private-membership tiers.",
  auth: auth.oauth.issuer({
    issuer: `${SUPABASE_URL}/auth/v1`,
    jwksUri: `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
    acceptedAudiences: "authenticated",
    resourceName: "LOUDMOUF™ Collective MCP",
  }),
  tools: [listFlavors, getLaunchInfo, listMembershipTiers, getBrandInfo],
});
