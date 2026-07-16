import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getArticleBySlug } from "@/lib/news";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ExternalLink, Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface DbArticle {
  id: string;
  slug: string;
  title: string;
  source: string;
  source_url: string;
  cover: string | null;
  excerpt: string | null;
  summary_md: string;
  published_at: string;
}

export const Route = createFileRoute("/newsroom/$slug")({
  loader: async ({ params }) => {
    // Try Supabase first via server function
    const { getArticle } = await import("@/lib/news.functions");
    const dbArticle = await getArticle({ data: { slug: params.slug } });
    if (dbArticle) {
      return {
        article: {
          id: dbArticle.id,
          slug: dbArticle.slug,
          title: dbArticle.title,
          source: dbArticle.source,
          sourceUrl: dbArticle.source_url,
          cover: dbArticle.cover ?? "",
          excerpt: dbArticle.excerpt ?? "",
          summary: dbArticle.summary_md,
          publishedAt: dbArticle.published_at,
        },
      };
    }
    const seed = getArticleBySlug(params.slug);
    if (!seed) throw notFound();
    return {
      article: { id: seed.slug, ...seed },
    };
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

interface CommentRow {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
}

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const articleId = article.id;

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      setUserId(userRes.user?.id ?? null);
      const [likesRes, commentsRes, myLikeRes] = await Promise.all([
        supabase
          .from("article_likes")
          .select("*", { count: "exact", head: true })
          .eq("article_id", articleId),
        supabase
          .from("article_comments")
          .select("id, author_name, body, created_at")
          .eq("article_id", articleId)
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(50),
        userRes.user
          ? supabase
              .from("article_likes")
              .select("article_id")
              .eq("article_id", articleId)
              .eq("user_id", userRes.user.id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      setLikeCount(likesRes.count ?? 0);
      setComments((commentsRes.data ?? []) as CommentRow[]);
      setLiked(!!myLikeRes.data);
    })();
  }, [articleId]);

  async function toggleLike() {
    if (!userId) {
      toast.error("Sign in to like articles");
      return;
    }
    if (liked) {
      await supabase
        .from("article_likes")
        .delete()
        .eq("article_id", articleId)
        .eq("user_id", userId);
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
    } else {
      await supabase.from("article_likes").insert({ article_id: articleId, user_id: userId });
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  }

  async function submitComment(e: FormEvent) {
    e.preventDefault();
    if (!userId) {
      toast.error("Sign in to comment");
      return;
    }
    const trimmedName = name.trim().slice(0, 60);
    const trimmedBody = body.trim().slice(0, 1000);
    if (!trimmedName || !trimmedBody) return;
    const { error } = await supabase.from("article_comments").insert({
      article_id: articleId,
      user_id: userId,
      author_name: trimmedName,
      body: trimmedBody,
      status: "pending",
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Comment submitted", {
        description: "It will appear once a moderator approves it.",
      });
      setBody("");
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
            {paragraphs.map((p: string, i: number) => (
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
