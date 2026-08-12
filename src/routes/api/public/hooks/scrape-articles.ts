import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/scrape-articles")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Fail closed: the shared secret is mandatory.
        const secret = process.env.SCRAPE_HOOK_SECRET;
        if (!secret) {
          console.error("SCRAPE_HOOK_SECRET not set — rejecting request");
          return new Response("Server config error", { status: 500 });
        }
        if (request.headers.get("x-hook-secret") !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }
        let body: { max?: number } = {};
        try {
          body = (await request.json()) as { max?: number };
        } catch {
          /* empty body ok */
        }
        const { runNewsroomScrape } = await import("@/lib/news.server");
        const max = Math.min(Math.max(1, body.max ?? 4), 8);
        try {
          const result = await runNewsroomScrape(max);
          return Response.json({ ok: true, ...result });
        } catch (e) {
          console.error("Newsroom scrape failed", e);
          return Response.json({ ok: false, error: "Scrape failed" }, { status: 500 });
        }
      },
      GET: async () => Response.json({ ok: true, hint: "POST to trigger a scrape run" }),
    },
  },
});
