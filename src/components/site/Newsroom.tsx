import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Heart, MessageCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSeededArticles } from "@/lib/news";

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  source: string;
  source_url: string;
  cover: string | null;
  excerpt: string | null;
  published_at?: string;
}

export function Newsroom() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("newsroom_articles")
        .select("id, slug, title, source, source_url, cover, excerpt, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(6);
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
          })),
        );
      }
    })();
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
        {/* View All button removed as per request */}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 6).map((a) => (
          <ArticleCard key={a.id} a={a} />
        ))}
      </div>
    </section>
  );
}

function ArticleCard({ a }: { a: ArticleRow }) {
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
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
      setLikeCount(likes ?? 0);
      setCommentCount(comments ?? 0);
    })();
  }, [a.id]);

  const publishDate = a.published_at 
    ? new Date(a.published_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }) 
    : '';

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:border-loud-yellow/40 transition">
      {/* Article image thumbnail removed as per request */}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.28em] text-loud-yellow">{a.source}</p>
          {publishDate && (
            <p className="text-[10px] text-white/50 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {publishDate}
            </p>
          )}
        </div>
        <h3 className="mt-2 font-display text-xl leading-snug text-white line-clamp-2">
          <Link
            to="/newsroom/$slug"
            params={{ slug: a.slug }}
            className="hover:text-loud-yellow transition"
          >
            {a.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-white/60 line-clamp-3">{a.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <Heart className="h-4 w-4" /> {likeCount}
            </span>
            <Link
              to="/newsroom/$slug"
              params={{ slug: a.slug }}
              hash="comments"
              className="inline-flex items-center gap-1.5 hover:text-loud-yellow"
            >
              <MessageCircle className="h-4 w-4" /> {commentCount}
            </Link>
            <a
              href={a.source_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 hover:text-white"
            >
              <ExternalLink className="h-3 w-3" /> Source
            </a>
          </div>
          <Link
            to="/newsroom/$slug"
            params={{ slug: a.slug }}
            className="inline-flex items-center gap-1 uppercase tracking-widest text-[10px] text-loud-yellow hover:text-white"
          >
            Read <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
