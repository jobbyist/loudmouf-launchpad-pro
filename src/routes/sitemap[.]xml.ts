import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://loudmouf.co.za";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/membership", changefreq: "weekly", priority: "0.9" },
          { path: "/newsroom", changefreq: "daily", priority: "0.9" },
          { path: "/referrals", changefreq: "monthly", priority: "0.7" },
          { path: "/launch", changefreq: "weekly", priority: "0.7" },
          { path: "/community-guidelines", changefreq: "yearly", priority: "0.5" },
          { path: "/track-my-order", changefreq: "monthly", priority: "0.6" },
          { path: "/shipping-policy", changefreq: "yearly", priority: "0.4" },
          { path: "/refund-policy", changefreq: "yearly", priority: "0.4" },
          { path: "/privacy-policy", changefreq: "yearly", priority: "0.4" },
          { path: "/terms", changefreq: "yearly", priority: "0.4" },
          { path: "/contact", changefreq: "yearly", priority: "0.4" },
        ];

        // Add published newsroom articles.
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const supa = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            { auth: { persistSession: false } },
          );
          const { data } = await supa
            .from("newsroom_articles")
            .select("slug, published_at")
            .eq("status", "published")
            .order("published_at", { ascending: false })
            .limit(500);
          for (const a of data ?? []) {
            entries.push({
              path: `/newsroom/${a.slug}`,
              lastmod: a.published_at,
              changefreq: "weekly",
              priority: "0.6",
            });
          }
        } catch {
          /* skip dynamic entries if DB unreachable */
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
