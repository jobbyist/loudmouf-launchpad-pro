import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_brand_info",
  title: "Get LOUDMOUF brand info",
  description:
    "Get an overview of LOUDMOUF™ — South Africa's first premium cannabis nicotine-free pouch brand — including positioning, product format, and the Collective private-members club model.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      brand: "LOUDMOUF™",
      tagline: "Big Taste. Zero Smoke.",
      country: "South Africa",
      productFormat: "Smoke-free cannabis oral pouches with premium terpene profiles",
      flavors: ["Cheesecake", "Bubblegum", "Blueberry"],
      pricePerTinZar: 350,
      pouchesPerTin: 20,
      model:
        "The LOUDMOUF™ Collective is a private members-only lifestyle club operating under South Africa's private-use cannabis mandate framework. Allocations are for personal, non-commercial use by verified members 18+.",
      website: "https://loudmouf.co.za",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
