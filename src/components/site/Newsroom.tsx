import { Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSeededArticles } from "@/lib/news";
import { ArticleSummaryModal, type ArticleForModal } from "./ArticleSummaryModal";
import { ArticleCard, type ArticleRow } from "./ArticleCard";

interface NewsroomProps {
  /** Max articles to show. Homepage should pass 4; full Newsroom page uses 20. */
  limit?: number;
  /** When true, shows a “View All Stories” link to /newsroom. */
  showViewAll?: boolean;
}

export function Newsroom({ limit = 20, showViewAll = false }: NewsroomProps) {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleForModal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("newsroom_articles")
        .select("id, slug, title, source, source_url, cover, excerpt, published_at, summary_md")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(Math.min(limit, 20));
      if (cancelled) return;
      if (data && data.length > 0) {
        setArticles(data as ArticleRow[]);
      } else {
        setArticles(
          getSeededArticles().map((a) => ({
            id: a.slug,
            slug: a.slug,
            title: a.title,
            source: a.source,
            source_url: a.sourceUrl,
            cover: a.cover,
            excerpt: a.excerpt,
            summary_md: a.summary,
          })),
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  const openArticle = useCallback((a: ArticleRow) => {
    setSelectedArticle({
      id: a.id,
      slug: a.slug,
      title: a.title,
      source: a.source,
      source_url: a.source_url,
      cover: a.cover,
      excerpt: a.excerpt,
      summary_md: a.summary_md,
      published_at: a.published_at,
    });
    setIsModalOpen(true);
  }, []);

  const handleModalOpenChange = useCallback((open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setTimeout(() => setSelectedArticle(null), 200);
    }
  }, []);

  return (
    <section
      id="newsroom"
      className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32"
      aria-label="Newsroom"
    >
      <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">Newsroom</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl text-white">
            Signals from the <span className="text-gradient-loud">plant world.</span>
          </h2>
          <p className="mt-4 text-white/60">
            Explore curated cannabis and culture related coverage that shapes how the Collective
            grows, regulates and consumes.
          </p>
        </div>
        {showViewAll && (
          <Link
            to="/newsroom"
            className="inline-flex items-center gap-2 rounded-full border border-loud-yellow/40 bg-loud-yellow/10 px-5 py-2.5 text-xs uppercase tracking-widest text-loud-yellow hover:bg-loud-yellow/20 hover:text-white transition"
          >
            View All Stories <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} a={a} onOpen={openArticle} />
        ))}
      </div>

      <ArticleSummaryModal
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        article={selectedArticle}
      />
    </section>
  );
}
