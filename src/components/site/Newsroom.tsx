import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Heart, MessageCircle, ExternalLink } from "lucide-react";
import { getAllArticles } from "@/lib/news";

function useLikes(slug: string) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    try {
      const c = Number(localStorage.getItem(`loudmouf-news-likes-${slug}`) ?? 0);
      setCount(isNaN(c) ? 0 : c);
      setLiked(localStorage.getItem(`loudmouf-news-liked-${slug}`) === "1");
    } catch {
      /* ignore */
    }
  }, [slug]);
  function toggle() {
    const next = !liked;
    const nextCount = Math.max(0, count + (next ? 1 : -1));
    setLiked(next);
    setCount(nextCount);
    try {
      localStorage.setItem(`loudmouf-news-likes-${slug}`, String(nextCount));
      localStorage.setItem(`loudmouf-news-liked-${slug}`, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }
  return { liked, count, toggle };
}

function useCommentCount(slug: string) {
  const [n, setN] = useState(0);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`loudmouf-news-comments-${slug}`);
      const arr = raw ? JSON.parse(raw) : [];
      setN(Array.isArray(arr) ? arr.length : 0);
    } catch {
      /* ignore */
    }
  }, [slug]);
  return n;
}

function ArticleCard({ article }: { article: ReturnType<typeof getAllArticles>[number] }) {
  const { liked, count, toggle } = useLikes(article.slug);
  const comments = useCommentCount(article.slug);
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:border-loud-yellow/40 transition">
      <Link
        to="/newsroom/$slug"
        params={{ slug: article.slug }}
        className="block aspect-[16/10] overflow-hidden"
      >
        <img
          src={article.cover}
          alt=""
          className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
      </Link>
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-loud-yellow">
          {article.source}
        </p>
        <h3 className="mt-2 font-display text-xl leading-snug text-white line-clamp-2">
          <Link
            to="/newsroom/$slug"
            params={{ slug: article.slug }}
            className="hover:text-loud-yellow transition"
          >
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-white/60 line-clamp-3">{article.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggle}
              className={`inline-flex items-center gap-1.5 hover:text-loud-pink transition ${
                liked ? "text-loud-pink" : ""
              }`}
              aria-pressed={liked}
              aria-label={liked ? "Unlike article" : "Like article"}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> {count}
            </button>
            <Link
              to="/newsroom/$slug"
              params={{ slug: article.slug }}
              className="inline-flex items-center gap-1.5 hover:text-loud-yellow"
              hash="comments"
            >
              <MessageCircle className="h-4 w-4" /> {comments}
            </Link>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 hover:text-white"
            >
              <ExternalLink className="h-3 w-3" /> Source
            </a>
          </div>
          <Link
            to="/newsroom/$slug"
            params={{ slug: article.slug }}
            className="inline-flex items-center gap-1 uppercase tracking-widest text-[10px] text-loud-yellow hover:text-white"
          >
            Read <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Newsroom() {
  const articles = getAllArticles();
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
            Signal from the <span className="text-gradient-loud">plant world.</span>
          </h2>
          <p className="mt-4 text-white/60">
            Long-form summaries of the cannabis coverage that shapes how the Collective grows,
            regulates and consumes. Every article links back to its original source.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  );
}
