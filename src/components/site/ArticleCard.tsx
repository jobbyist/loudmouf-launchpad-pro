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

export function ArticleCard({
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
        <p className="mt-2 text-sm text-white/60 line-clamp-3">{stripMarkdown(a.excerpt)}</p>
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
