import { Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { ArrowRight, ExternalLink, Heart, MessageCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSeededArticles } from "@/lib/news";
import { ArticleSummaryModal, type ArticleForModal } from "./ArticleSummaryModal";

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  source: string;
  source_url: string;
  cover: string | null;
  excerpt: string | null;
  published_at?: string;
  summary_md?: string | null;
}

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

function ArticleCard({
  a,
  onOpen,
}: {
  a: ArticleRow;
  onOpen: (a: ArticleRow) => void;
}) {
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ count: likes }, { count: comments }] = await Promise.all([
        supabase
          .from("article_likes")
          .select("*", { count: "exact", head: true })
          .eq("article_id", a.id),
        supabase
          .from("article_comments")
          .select("*", { count: "exact", head: true })
          .eq("article_id", a.id)
          .eq("status", "approved"),
      ]);
      if (cancelled) return;
      setLikeCount(likes ?? 0);
      setCommentCount(comments ?? 0);
    })();
    return () => {
      cancelled = true;
    };
  }, [a.id]);

  const publishDate = a.published_at
    ? new Date(a.published_at).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <article
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:border-loud-yellow/40 transition cursor-pointer"
      onClick={() => onOpen(a)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(a);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Read summary of ${a.title}`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.28em] text-loud-yellow">{a.source}</p>
          {publishDate && (
            <p className="text-[10px] text-white/50 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {publishDate}
            </p>
          )}
        </div>
        <h3 className="mt-2 font-display text-xl leading-snug text-white line-clamp-2 group-hover:text-loud-yellow transition">
          {a.title}
        </h3>
        <p className="mt-2 text-sm text-white/60 line-clamp-3">{a.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <Heart className="h-4 w-4" /> {likeCount}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" /> {commentCount}
            </span>
            {a.source_url ? (
              <a
                href={a.source_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 hover:text-white"
                aria-label={`Open original article from ${a.source}`}
              >
                <ExternalLink className="h-3 w-3" /> Source
              </a>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-1 uppercase tracking-widest text-[10px] text-loud-yellow group-hover:text-white">
            Read Summary <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </article>
  );
}
