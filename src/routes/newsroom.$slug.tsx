import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getArticleBySlug } from "@/lib/news";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ExternalLink, Heart, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/newsroom/$slug")({
  loader: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.article.title} · LOUDMOUF™ Newsroom` },
            { name: "description", content: loaderData.article.excerpt },
            { property: "og:title", content: loaderData.article.title },
            { property: "og:description", content: loaderData.article.excerpt },
            { property: "og:type", content: "article" },
            { property: "og:image", content: loaderData.article.cover },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:image", content: loaderData.article.cover },
          ],
        }
      : {},
  errorComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background text-white">
      <p>Article failed to load.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background text-white">
      <p>Article not found.</p>
    </div>
  ),
  component: ArticlePage,
});

interface Comment {
  id: string;
  name: string;
  body: string;
  createdAt: string;
}

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const slug = article.slug;

  useEffect(() => {
    try {
      setLikeCount(Number(localStorage.getItem(`loudmouf-news-likes-${slug}`) ?? 0) || 0);
      setLiked(localStorage.getItem(`loudmouf-news-liked-${slug}`) === "1");
      const raw = localStorage.getItem(`loudmouf-news-comments-${slug}`);
      setComments(raw ? (JSON.parse(raw) as Comment[]) : []);
    } catch {
      /* ignore */
    }
  }, [slug]);

  function toggleLike() {
    const next = !liked;
    const c = Math.max(0, likeCount + (next ? 1 : -1));
    setLiked(next);
    setLikeCount(c);
    try {
      localStorage.setItem(`loudmouf-news-likes-${slug}`, String(c));
      localStorage.setItem(`loudmouf-news-liked-${slug}`, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function submitComment(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim().slice(0, 60);
    const trimmedBody = body.trim().slice(0, 1000);
    if (!trimmedName || !trimmedBody) return;
    const next: Comment[] = [
      ...comments,
      {
        id: crypto.randomUUID(),
        name: trimmedName,
        body: trimmedBody,
        createdAt: new Date().toISOString(),
      },
    ];
    setComments(next);
    setBody("");
    try {
      localStorage.setItem(`loudmouf-news-comments-${slug}`, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  const paragraphs = article.summary.split(/\n+/).filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="pt-32 pb-24">
        <article className="mx-auto max-w-3xl px-6">
          <Link
            to="/newsroom"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 hover:text-loud-yellow"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Newsroom
          </Link>
          <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-loud-yellow">
            {article.source} · {new Date(article.publishedAt).toLocaleDateString("en-ZA")}
          </p>
          <h1 className="display mt-3 text-4xl sm:text-5xl md:text-6xl text-white leading-tight">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-white/70">{article.excerpt}</p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-white/80 hover:border-loud-yellow/40 hover:text-loud-yellow"
            >
              <ExternalLink className="h-3 w-3" /> Read original
            </a>
            <button
              type="button"
              onClick={toggleLike}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition ${
                liked
                  ? "border-loud-pink/60 bg-loud-pink/15 text-loud-pink"
                  : "border-white/15 bg-white/5 text-white/80 hover:border-loud-pink/40"
              }`}
              aria-pressed={liked}
            >
              <Heart className={`h-3 w-3 ${liked ? "fill-current" : ""}`} /> {likeCount}
            </button>
          </div>

          <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
            <img
              src={article.cover}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="prose prose-invert prose-lg mt-10 max-w-none text-white/80">
            {paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <p className="mt-10 text-xs uppercase tracking-widest text-white/40">
            Summary curated by LOUDMOUF™ · original reporting © {article.source}.
          </p>

          {/* Comments */}
          <section id="comments" className="mt-16 border-t border-white/10 pt-10">
            <h2 className="display text-3xl text-white flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-loud-yellow" /> Discussion
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Comments are stored locally to your device. Community moderation launches with
              Sprint 3.
            </p>
            <form onSubmit={submitComment} className="mt-6 space-y-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or member handle"
                maxLength={60}
                className="bg-white/5 border-white/10 text-white"
              />
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Add to the conversation…"
                maxLength={1000}
                rows={4}
                className="bg-white/5 border-white/10 text-white"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!name.trim() || !body.trim()}
                  className="cta-gradient text-black uppercase tracking-widest text-xs font-semibold"
                >
                  Post Comment
                </Button>
              </div>
            </form>
            <ul className="mt-8 space-y-4">
              {comments.length === 0 ? (
                <li className="text-sm text-white/50">Be the first to comment.</li>
              ) : (
                comments.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-semibold text-white">{c.name}</p>
                      <span className="text-[10px] uppercase tracking-widest text-white/40">
                        {new Date(c.createdAt).toLocaleString("en-ZA")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/80 whitespace-pre-wrap">{c.body}</p>
                  </li>
                ))
              )}
            </ul>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
