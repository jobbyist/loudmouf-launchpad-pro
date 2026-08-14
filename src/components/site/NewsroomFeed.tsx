import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ArticleCard, type ArticleRow } from "./ArticleCard";
import { ArticleSummaryModal, type ArticleForModal } from "./ArticleSummaryModal";
import { listArticles } from "@/lib/news.functions";

interface NewsroomFeedProps {
  initialArticles: ArticleRow[];
  pageSize: number;
}

function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.03] p-5"
    >
      <div className="flex items-center justify-between">
        <div className="h-2.5 w-20 rounded bg-white/10" />
        <div className="h-2.5 w-16 rounded bg-white/10" />
      </div>
      <div className="mt-4 h-5 w-4/5 rounded bg-white/10" />
      <div className="mt-2 h-5 w-3/5 rounded bg-white/10" />
      <div className="mt-4 h-3 w-full rounded bg-white/5" />
      <div className="mt-2 h-3 w-2/3 rounded bg-white/5" />
    </motion.div>
  );
}

export function NewsroomFeed({ initialArticles, pageSize }: NewsroomFeedProps) {
  const [articles, setArticles] = useState<ArticleRow[]>(initialArticles);
  const [selectedArticle, setSelectedArticle] = useState<ArticleForModal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialArticles.length === pageSize);
  const offsetRef = useRef(initialArticles.length);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const next = await listArticles({
        data: { limit: pageSize, offset: offsetRef.current },
      });
      setArticles((prev) => [...prev, ...(next as ArticleRow[])]);
      offsetRef.current += next.length;
      setHasMore(next.length === pageSize);
    } catch (err) {
      console.error("Failed to load more newsroom articles", err);
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, pageSize]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

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
      <div className="max-w-2xl mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">Newsroom</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl text-white">
          Signals from the <span className="text-gradient-loud">plant world.</span>
        </h1>
        <p className="mt-4 text-white/60">
          Explore curated cannabis and culture related coverage that shapes how the Collective
          grows, regulates and consumes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} a={a} onOpen={openArticle} />
        ))}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} delay={i * 0.08} />)}
      </div>

      {hasMore ? (
        <div ref={sentinelRef} className="mt-10 flex items-center justify-center">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading more stories…
            </div>
          )}
        </div>
      ) : articles.length > 0 ? (
        <p className="mt-10 text-center text-xs uppercase tracking-widest text-white/40">
          You've reached the end of the Newsroom.
        </p>
      ) : null}

      <ArticleSummaryModal
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        article={selectedArticle}
      />
    </section>
  );
}
