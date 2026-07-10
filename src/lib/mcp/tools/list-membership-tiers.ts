import { defineTool } from "@lovable.dev/mcp-js";

const TIERS = [
  {
    id: "pink",
    name: "Pink Tier",
    tagline: "Entry-level personal allocation",
    monthlyPriceZarMin: 350,
    monthlyPriceZarMax: 550,
    monthlyAllocationPouchesMin: 10,
    monthlyAllocationPouchesMax: 25,
  },
  {
    id: "yellow",
    name: "Yellow Tier",
    tagline: "Mid-level balanced allocation",
    monthlyPriceZarMin: 650,
    monthlyPriceZarMax: 950,
    monthlyAllocationPouchesMin: 30,
    monthlyAllocationPouchesMax: 60,
  },
  {
    id: "blue",
    name: "Deep Blue Tier",
    tagline: "Premium full allocation",
    monthlyPriceZarMin: 1050,
    monthlyPriceZarMax: 1250,
    monthlyAllocationPouchesMin: 65,
    monthlyAllocationPouchesMax: 90,
  },
];

export default defineTool({
  name: "list_membership_tiers",
  title: "List Collective membership tiers",
  description:
    "Return the LOUDMOUF™ Collective private-membership tiers (Pink, Yellow, Deep Blue) with monthly contribution ranges in ZAR and monthly pouch allocation ranges.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(TIERS, null, 2) }],
    structuredContent: { tiers: TIERS },
  }),
});
