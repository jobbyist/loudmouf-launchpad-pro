import { defineTool } from "@lovable.dev/mcp-js";
import { SHOPIFY_STOREFRONT_URL, SHOPIFY_STOREFRONT_TOKEN, STOREFRONT_QUERY } from "@/lib/shopify";

export default defineTool({
  name: "list_flavors",
  title: "List LOUDMOUF flavors",
  description:
    "Return all LOUDMOUF™ cannabis pouch flavors currently on the Shopify storefront — title, description, price (ZAR), image, and Shopify handle.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async () => {
    const res = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query: STOREFRONT_QUERY, variables: { first: 20, query: null } }),
    });
    if (!res.ok) {
      return {
        content: [{ type: "text", text: `Shopify Storefront error: HTTP ${res.status}` }],
        isError: true,
      };
    }
    const json = (await res.json()) as {
      data?: { products?: { edges?: Array<{ node: Record<string, unknown> }> } };
    };
    const edges = json.data?.products?.edges ?? [];
    const flavors = edges.map(({ node }) => {
      const n = node as {
        id: string;
        title: string;
        description: string;
        handle: string;
        priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
        images: { edges: Array<{ node: { url: string; altText: string | null } }> };
      };
      return {
        id: n.id,
        title: n.title,
        handle: n.handle,
        description: n.description,
        price: {
          amount: Number(n.priceRange.minVariantPrice.amount),
          currency: n.priceRange.minVariantPrice.currencyCode,
        },
        image: n.images.edges[0]?.node.url ?? null,
      };
    });
    return {
      content: [{ type: "text", text: JSON.stringify(flavors, null, 2) }],
      structuredContent: { flavors },
    };
  },
});
