import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Heart, MessageCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { stripMarkdown } from "@/lib/utils";

export interface ArticleRow {
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

export function ArticleCard({ a }: { a: ArticleRow }) {
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
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md transition hover:border-loud-yellow/40">
      <a href={`/newsroom/${a.slug}`} className="block p-5" aria-label={`Read ${a.title}`}>
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
        <p className="mt-2 text-sm text-white/60 line-clamp-3">{stripMarkdown(a.excerpt)}</p>
      </a>
      <div className="flex items-center justify-between px-5 pb-5 text-xs text-white/60">
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
              className="inline-flex items-center gap-1.5 hover:text-white"
              aria-label={`Open original article from ${a.source}`}
            >
              <ExternalLink className="h-3 w-3" /> Source
            </a>
          ) : null}
        </div>
        <a
          href={`/newsroom/${a.slug}`}
          className="inline-flex items-center gap-1 uppercase tracking-widest text-[10px] text-loud-yellow group-hover:text-white"
        >
          Read Summary <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
}
