import { useEffect, useState, type FormEvent } from "react";
import Markdown from "markdown-to-jsx";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ExternalLink,
  Heart,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn, stripMarkdown } from "@/lib/utils";

export interface ArticleForModal {
  id: string;
  slug: string;
  title: string;
  source: string;
  source_url: string;
  cover: string | null;
  excerpt: string | null;
  summary_md?: string | null;
  published_at?: string;
}

interface CommentRow {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
}

interface ArticleSummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: ArticleForModal | null;
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

export function ArticleSummaryModal({
  open,
  onOpenChange,
  article,
}: ArticleSummaryModalProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [math, setMath] = useState(() => makeMathChallenge());
  const [mathAnswer, setMathAnswer] = useState("");

  const articleId = article?.id ?? null;

  // Inject JSON-LD NewsArticle schema while modal is open (SEO for summary popups)
  useEffect(() => {
    if (!open || !article) return;

    const scriptId = "loudmouf-article-jsonld";
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const schema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: article.excerpt ? stripMarkdown(article.excerpt) : undefined,
      datePublished: article.published_at ?? undefined,
      image: article.cover || undefined,
      mainEntityOfPage: article.source_url || undefined,
      url: `https://loudmouf.co.za/newsroom/${article.slug}`,
      isBasedOn: article.source_url || undefined,
      author: { "@type": "Organization", name: article.source },
      publisher: {
        "@type": "Organization",
        name: "LOUDMOUF™",
        url: "https://loudmouf.co.za",
      },
    };

    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [open, article]);

  useEffect(() => {
    if (!open || !article) {
      setSummary(null);
      setComments([]);
      setLiked(false);
      setLikeCount(0);
      setMath(makeMathChallenge());
      setMathAnswer("");
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser();
        if (cancelled) return;
        const uid = userRes.user?.id ?? null;
        setUserId(uid);
        const guestId = getGuestId();

        let summaryText = article.summary_md ?? null;
        if (!summaryText) {
          const { data: row } = await supabase
            .from("newsroom_articles")
            .select("summary_md")
            .eq("id", article.id)
            .maybeSingle();
          if (!cancelled) summaryText = row?.summary_md ?? null;
        }
        if (!cancelled) setSummary(summaryText || null);

        const [likesRes, commentsRes, myLikeRes] = await Promise.all([
          supabase
            .from("article_likes")
            .select("*", { count: "exact", head: true })
            .eq("article_id", article.id),
          supabase
            .from("article_comments")
            .select("id, author_name, body, created_at")
            .eq("article_id", article.id)
            .eq("status", "approved")
            .order("created_at", { ascending: false })
            .limit(50),
          uid
            ? supabase
                .from("article_likes")
                .select("id")
                .eq("article_id", article.id)
                .eq("user_id", uid)
                .maybeSingle()
            : supabase
                .from("article_likes")
                .select("id")
                .eq("article_id", article.id)
                .eq("guest_id", guestId)
                .maybeSingle(),
        ]);

        if (cancelled) return;
        setLikeCount(likesRes.count ?? 0);
        setComments((commentsRes.data ?? []) as CommentRow[]);
        setLiked(!!myLikeRes.data);
      } catch (err) {
        console.error("Article modal load error", err);
        if (!cancelled) {
          setSummary(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, article]);

  async function toggleLike() {
    if (!articleId || !article) return;

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
    if (!articleId || !article) return;

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
    if (!trimmedName || !trimmedBody) {
      toast.error("Name and comment are required.");
      return;
    }

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
        toast.error(error.message || "Could not submit comment");
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

  const hasSummary = Boolean(summary && summary.trim());

  const publishDate =
    article?.published_at
      ? new Date(article.published_at).toLocaleDateString("en-ZA", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl w-[calc(100%-2rem)] sm:w-full bg-loud-ink border-white/10 p-0 overflow-hidden max-h-[75vh] sm:max-h-[min(92vh,900px)] flex flex-col gap-0 shadow-2xl"
        aria-describedby={undefined}
        onOpenAutoFocus={(e) => {
          const title = (e.currentTarget as HTMLElement).querySelector(
            "[data-article-modal-title]",
          );
          if (title instanceof HTMLElement) {
            e.preventDefault();
            title.focus();
          }
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        {article ? (
          <>
            <div
              className="overflow-y-auto overscroll-contain scroll-smooth flex-1 min-h-0 px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4 touch-pan-y"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="flex items-center justify-between gap-3 pr-12">
                <p className="text-[11px] uppercase tracking-[0.3em] text-loud-yellow">
                  {article.source}
                  {publishDate ? ` · ${publishDate}` : ""}
                </p>
              </div>

              <DialogTitle
                className="display mt-3 text-3xl sm:text-4xl text-white leading-tight outline-none"
                data-article-modal-title
                tabIndex={-1}
              >
                {article.title}
              </DialogTitle>

              {article.excerpt ? (
                <DialogDescription className="mt-3 text-base text-white/70">
                  {stripMarkdown(article.excerpt)}
                </DialogDescription>
              ) : (
                <DialogDescription className="sr-only">
                  Article summary for {article.title}
                </DialogDescription>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {article.source_url ? (
                  <a
                    href={article.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-white/80 hover:border-loud-yellow/40 hover:text-loud-yellow transition"
                  >
                    <ExternalLink className="h-3 w-3" /> Read Original Article
                  </a>
                ) : null}
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

              {/* Cover image intentionally omitted from summary modal */}

              <div className="prose prose-invert prose-base mt-8 max-w-none text-white/80">
                {loading ? (
                  <div className="flex items-center gap-2 text-white/50 py-8">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading summary…
                  </div>
                ) : hasSummary ? (
                  <Markdown
                    options={{
                      overrides: {
                        a: { props: { target: "_blank", rel: "noopener noreferrer" } },
                      },
                    }}
                  >
                    {summary as string}
                  </Markdown>
                ) : (
                  <p className="text-white/50 py-6">
                    Summary is not available yet. Check back after the next curation run, or read the
                    original article.
                  </p>
                )}
              </div>

              <p className="mt-6 text-[10px] uppercase tracking-widest text-white/40">
                Summary curated by LOUDMOUF™ · original reporting © {article.source}.
              </p>

              <section className="mt-10 border-t border-white/10 pt-8" aria-label="Comments">
                <h3 className="display text-2xl text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-loud-yellow" /> Discussion
                </h3>
                <p className="mt-1 text-sm text-white/55">
                  Join the conversation — keep it constructive. No account required.
                </p>

                <form onSubmit={submitComment} className="mt-5 space-y-3">
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
                    aria-label="Your name"
                  />
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Add to the conversation…"
                    maxLength={1000}
                    rows={3}
                    required
                    className="bg-white/5 border-white/10 text-white"
                    aria-label="Comment body"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                    <div className="flex-1">
                      <label
                        htmlFor="modal-math-captcha"
                        className="text-[11px] uppercase tracking-widest text-white/50"
                      >
                        Spam check · {math.prompt}
                      </label>
                      <Input
                        id="modal-math-captcha"
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
                      disabled={
                        submitting || !name.trim() || !body.trim() || !mathAnswer.trim()
                      }
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

                <ul className="mt-6 space-y-3">
                  {comments.length === 0 ? (
                    <li className="text-sm text-white/50">Be the first to comment.</li>
                  ) : (
                    comments.map((c) => (
                      <li
                        key={c.id}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-sm font-semibold text-white">{c.author_name}</p>
                          <span className="text-[10px] uppercase tracking-widest text-white/40 shrink-0">
                            {new Date(c.created_at).toLocaleString("en-ZA")}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-white/80 whitespace-pre-wrap">{c.body}</p>
                      </li>
                    ))
                  )}
                </ul>
              </section>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
