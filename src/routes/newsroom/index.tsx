import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { Heart, MessageCircle, Clock } from "lucide-react";
import { getThumbnailPlaceholder } from "@/lib/articleThumbnails";

export const Route = createFileRoute("/newsroom/")({
  head: () => ({
    meta: [
      { title: "Newsroom — LOUDMOUF™" },
      { name: "description", content: "Cannabis culture, music, and lifestyle content curated for the LOUDMOUF™ Collective." },
      { property: "og:title", content: "Newsroom — LOUDMOUF™" },
      { property: "og:description", content: "Cannabis culture, music, and lifestyle content curated for the LOUDMOUF™ Collective." },
    ],
  }),
  component: NewsroomPage,
});

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail_url: string | null;
  reading_time: number;
  published_at: string;
  source_name: string;
}

function NewsroomPage() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["newsroom-articles-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as Article[];
    },
  });

  return (
    <SiteShell title="Newsroom" kicker="Culture & Lifestyle">
      <p className="text-white/70 mb-12 max-w-2xl">
        Cannabis culture, music, and lifestyle content from around the world and across South Africa. Fresh daily.
      </p>

      {isLoading ? (
        <div className="text-white/60">Loading articles...</div>
      ) : articles.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <p className="text-white/60">No articles available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const thumbnailUrl = article.thumbnail_url || getThumbnailPlaceholder(article.title);

            return (
              <Link
                key={article.id}
                to={`/newsroom/${article.slug}`}
                className="block glass rounded-2xl overflow-hidden border border-white/10 hover:border-loud-yellow/40 transition group"
              >
                <div className="aspect-video overflow-hidden">
                  <img src={thumbnailUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-loud-yellow mb-2">
                    <span>{article.source_name}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.reading_time} min</span>
                  </div>
                  <h3 className="text-lg font-display text-white mb-2 group-hover:text-loud-yellow transition line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-2">{article.excerpt}</p>
                  <div className="mt-3 text-xs text-white/40">
                    {new Date(article.published_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </SiteShell>
  );
}
