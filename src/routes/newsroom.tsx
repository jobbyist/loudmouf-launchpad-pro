import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { NewsroomFeed } from "@/components/site/NewsroomFeed";
import { listArticles } from "@/lib/news.functions";
import type { ArticleRow } from "@/components/site/ArticleCard";

const PAGE_SIZE = 5;

export const Route = createFileRoute("/newsroom")({
  loader: async () => {
    const articles = await listArticles({ data: { limit: PAGE_SIZE, offset: 0 } });
    return { articles: articles as ArticleRow[] };
  },
  head: () => ({
    meta: [
      { title: "LOUDMOUF™ Newsroom — Cannabis Signal & Long-Form Summaries" },
      {
        name: "description",
        content:
          "Curated long-form summaries of cannabis coverage that shapes the LOUDMOUF™ Collective — law, science and product innovation, always linked to the original source.",
      },
      { property: "og:title", content: "LOUDMOUF™ Newsroom" },
      {
        property: "og:description",
        content:
          "Long-form cannabis summaries curated for the LOUDMOUF™ Collective.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsroomPage,
});

function NewsroomPage() {
  const { articles } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="pt-32">
        <NewsroomFeed initialArticles={articles} pageSize={PAGE_SIZE} />
      </main>
      <Footer />
    </div>
  );
}
