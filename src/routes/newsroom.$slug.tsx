import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getArticleBySlug } from "@/lib/news";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ExternalLink, Heart, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

const COMMENT_COOLDOWN_MS = 60_000;
const MAX_COMMENTS_PER_HOUR = 5;
const HONEYPOT_FIELD = "website_url";
const GUEST_ID_KEY = "loudmouf-guest-id";

function getGuestId(): string {
  if (typeof window === "undefined") return "guest";
  try {
    let key = localStorage.getItem(GUEST_ID_KEY);
    if (!key) {
      key = crypto.randomUUID();
      localStorage.setItem(GUEST_ID_KEY, key);
    }
    return key;
  } catch {
    return `guest-${Math.random().toString(36).slice(2, 12)}`;
  }
}

function checkCommentRateLimit(): { allowed: boolean; reason?: string } {
  if (typeof window === "undefined") return { allowed: true };
  try {
    const raw = localStorage.getItem("loudmouf-comment-ts");
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const recent = timestamps.filter((t) => now - t < 60 * 60 * 1000);
    if (recent.length >= MAX_COMMENTS_PER_HOUR) {
      return { allowed: false, reason: "Too many comments in the last hour. Please wait." };
    }
    const last = recent[recent.length - 1];
    if (last && now - last < COMMENT_COOLDOWN_MS) {
      return { allowed: false, reason: "Please wait a minute before commenting again." };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

function recordCommentTimestamp() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("loudmouf-comment-ts");
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const recent = timestamps.filter((t) => now - t < 60 * 60 * 1000);
    recent.push(now);
    localStorage.setItem("loudmouf-comment-ts", JSON.stringify(recent));
  } catch {
    // ignore
  }
}

function makeMathChallenge(): { a: number; b: number; answer: number; prompt: string } {
  const a = Math.floor(Math.random() * 12) + 2;
  const b = Math.floor(Math.random() * 12) + 2;
  return { a, b, answer: a + b, prompt: `What is ${a} + ${b}?` };
}

export const Route = createFileRoute("/newsroom/$slug")({
  loader: async ({ params }) => {
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
          scripts: [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                headline: loaderData.article.title,
                description: loaderData.article.excerpt,
                datePublished: loaderData.article.publishedAt,
                image: loaderData.article.cover || undefined,
                mainEntityOfPage: loaderData.article.sourceUrl,
                url: `https://loudmouf.co.za/newsroom/${loaderData.article.slug}`,
                isBasedOn: loaderData.article.sourceUrl,
                author: { "@type": "Organization", name: loaderData.article.source },
                publisher: {
                  "@type": "Organization",
                  name: "LOUDMOUF™",
                  url: "https://loudmouf.co.za",
                },
              }),
            },
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
  const [honeypot, setHoneypot] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [math, setMath] = useState(() => makeMathChallenge());
  const [mathAnswer, setMathAnswer] = useState("");
  const articleId = article.id;

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id ?? null;
      setUserId(uid);
      const guestId = getGuestId();

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
        uid
          ? supabase
              .from("article_likes")
              .select("id")
              .eq("article_id", articleId)
              .eq("user_id", uid)
              .maybeSingle()
          : supabase
              .from("article_likes")
              .select("id")
              .eq("article_id", articleId)
              .eq("guest_id", guestId)
              .maybeSingle(),
      ]);
      setLikeCount(likesRes.count ?? 0);
      setComments((commentsRes.data ?? []) as CommentRow[]);
      setLiked(!!myLikeRes.data);
    })();
  }, [articleId]);

  async function toggleLike() {
    if (userId) {
      if (liked) {
        const { error } = await supabase
          .from("article_likes")
          .delete()
          .eq("article_id", articleId)
          .eq("user_id", userId);
        if (error) {
          toast.error("Could not update like");
          return;
        }
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        const { error } = await supabase
          .from("article_likes")
          .insert({ article_id: articleId, user_id: userId, guest_id: null });
        if (error && error.code !== "23505") {
          toast.error("Could not update like");
          return;
        }
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
      return;
    }

    const guestId = getGuestId();
    if (liked) {
      const { error } = await supabase
        .from("article_likes")
        .delete()
        .eq("article_id", articleId)
        .eq("guest_id", guestId);
      if (error) {
        toast.error("Could not update like");
        return;
      }
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
    } else {
      const { error } = await supabase
        .from("article_likes")
        .insert({ article_id: articleId, user_id: null, guest_id: guestId });
      if (error && error.code !== "23505") {
        toast.error(error.message || "Could not update like");
        return;
      }
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  }

  async function submitComment(e: FormEvent) {
    e.preventDefault();

    if (honeypot.trim()) {
      toast.success("Comment posted");
      setBody("");
      setMath(makeMathChallenge());
      setMathAnswer("");
      return;
    }

    const rate = checkCommentRateLimit();
    if (!rate.allowed) {
      toast.error(rate.reason ?? "Please slow down.");
      return;
    }

    const parsed = Number.parseInt(mathAnswer.trim(), 10);
    if (!Number.isFinite(parsed) || parsed !== math.answer) {
      toast.error("Incorrect answer to the math question. Please try again.");
      setMath(makeMathChallenge());
      setMathAnswer("");
      return;
    }

    const trimmedName = name.trim().slice(0, 60);
    const trimmedBody = body.trim().slice(0, 1000);
    if (!trimmedName || !trimmedBody) return;

    if (
      /(https?:\/\/|www\.|\.com|\.xyz|crypto|viagra|casino)/i.test(trimmedBody) &&
      trimmedBody.split(/\s+/).length < 8
    ) {
      toast.error("Comment looks like spam. Please write a longer, relevant comment.");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("article_comments")
        .insert({
          article_id: articleId,
          user_id: userId,
          author_name: trimmedName,
          body: trimmedBody,
          status: "approved",
        })
        .select("id, author_name, body, created_at")
        .single();
      if (error) {
        toast.error(error.message);
      } else {
        recordCommentTimestamp();
        if (data) setComments((prev) => [data as CommentRow, ...prev]);
        toast.success("Comment posted");
        setBody("");
        setMath(makeMathChallenge());
        setMathAnswer("");
      }
    } finally {
      setSubmitting(false);
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
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-white/80 hover:border-loud-yellow/40 hover:text-loud-yellow"
            >
              <ExternalLink className="h-3 w-3" /> Read Original Article
            </a>
            <button
              type="button"
              onClick={toggleLike}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition",
                liked
                  ? "border-loud-pink/60 bg-loud-pink/15 text-loud-pink"
                  : "border-white/15 bg-white/5 text-white/80 hover:border-loud-pink/40",
              )}
              aria-pressed={liked}
              aria-label={liked ? "Unlike article" : "Like article"}
            >
              <Heart className={cn("h-3 w-3", liked && "fill-current")} /> {likeCount}
            </button>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
              <MessageCircle className="h-3.5 w-3.5" /> {comments.length}
            </span>
          </div>

          <div className="prose prose-invert prose-lg mt-10 max-w-none text-white/80">
            {paragraphs.map((p, i) => (
              <p key={i} className="mb-4 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <p className="mt-8 text-[10px] uppercase tracking-widest text-white/40">
            Summary curated by LOUDMOUF™ · original reporting © {article.source}.
          </p>

          <section id="comments" className="mt-16 border-t border-white/10 pt-10">
            <h2 className="display text-3xl text-white flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-loud-yellow" /> Discussion
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Join the conversation — keep it constructive. No account required.
            </p>
            <form onSubmit={submitComment} className="mt-6 space-y-3">
              <input
                type="text"
                name={HONEYPOT_FIELD}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px] opacity-0 h-0 w-0"
                aria-hidden="true"
              />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or member handle"
                maxLength={60}
                required
                className="bg-white/5 border-white/10 text-white"
              />
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Add to the conversation…"
                maxLength={1000}
                rows={4}
                required
                className="bg-white/5 border-white/10 text-white"
              />
              <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                <div className="flex-1">
                  <label
                    htmlFor="page-math-captcha"
                    className="text-[11px] uppercase tracking-widest text-white/50"
                  >
                    Spam check · {math.prompt}
                  </label>
                  <Input
                    id="page-math-captcha"
                    inputMode="numeric"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    placeholder="Your answer"
                    required
                    className="mt-1.5 bg-white/5 border-white/10 text-white"
                    aria-label={math.prompt}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting || !name.trim() || !body.trim() || !mathAnswer.trim()}
                  className="cta-gradient text-black uppercase tracking-widest text-xs font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-2" /> Posting…
                    </>
                  ) : (
                    "Post Comment"
                  )}
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
                      <p className="text-sm font-semibold text-white">{c.author_name}</p>
                      <span className="text-[10px] uppercase tracking-widest text-white/40">
                        {new Date(c.created_at).toLocaleString("en-ZA")}
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
