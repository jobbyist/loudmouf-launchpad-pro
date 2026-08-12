import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

// Trigger news scrape on server start (fire-and-forget, non-blocking for startup)
(async () => {
  try {
    console.log("[STARTUP] Running additional newsroom scrape...");
    const { runNewsroomScrape } = await import("@/lib/news.server");
    await runNewsroomScrape(3);
    console.log("[STARTUP] Newsroom scrape completed");
  } catch (e) {
    console.error("[STARTUP] Scrape failed:", e);
  }
})();

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware],
}));
