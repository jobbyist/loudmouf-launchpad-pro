import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Heart, MessageCircle, Calendar, Share2 } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { getArticleBySlug } from "@/lib/news";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { toast } from "sonner";

interface Article {
  id: string;
  slug: string;
  title: string;
  source: string;
  sourceUrl: string;
  cover: string;
  excerpt: string;
  summary: string;
  publishedAt?: string;
}

interface CommentRow {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
}

export function ArticleModal() {
  const { articleModalOpen, currentArticleSlug, closeArticleModal, openArticleModal } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [article, setArticle] = useState<Article | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // URL Sync: Open modal if /newsroom/$slug visited
  useEffect(() => {
    const match = location.pathname.match(/^\/newsroom\/(.+)$/);
    if (match && match[1]) {
      const slug = match[1];
      openArticleModal(slug);
    }
  }, [location.pathname, openArticleModal]);

  // Sync URL when modal opens/closes
  useEffect(() => {
    if (currentArticleSlug && articleModalOpen) {
      navigate({ to: `/newsroom/${currentArticleSlug}` });
    } else if (!articleModalOpen && location.pathname.startsWith('/newsroom/') && !location.pathname.endsWith('/newsroom')) {
      navigate({ to: '/newsroom' });
    }
  }, [articleModalOpen, currentArticleSlug, navigate, location.pathname]);

  useEffect(() => {
    if (!currentArticleSlug || !articleModalOpen) {
      setArticle(null);
      return;
    }

    const loadArticle = async () => {
      try {
        const { getArticle } = await import("@/lib/news.functions");
        const dbArticle = await getArticle({ data: { slug: currentArticleSlug } });
        if (dbArticle) {
          setArticle({
            id: dbArticle.id,
            slug: dbArticle.slug,
            title: dbArticle.title,
            source: dbArticle.source,
            sourceUrl: dbArticle.source_url,
            cover: dbArticle.cover ?? "",
            excerpt: dbArticle.excerpt ?? "",
            summary: dbArticle.summary_md,
            publishedAt: dbArticle.published_at,
          });
          return;
        }
      } catch (e) {
        console.error("DB article load failed", e);
      }

      const seed = getArticleBySlug(currentArticleSlug);
      if (seed) {
        setArticle({ id: seed.slug, ...seed });
      }
    };

    loadArticle();
  }, [currentArticleSlug, articleModalOpen]);

  // ... (rest of interactions same as before)
  useEffect(() => {
    if (!article || !articleModalOpen) return;

    const loadInteractions = async () => {
      const articleId = article.id;
      const { data: userRes } = await supabase.auth.getUser();
      setUserId(userRes.user?.id ?? null);

      const [likesRes, commentsRes, myLikeRes] = await Promise.all([
        supabase.from("article_likes").select("*", { count: "exact", head: true }).eq("article_id", articleId),
        supabase.from("article_comments").select("id, author_name, body, created_at").eq("article_id", articleId).eq("status", "approved").order("created_at", { ascending: false }).limit(20),
        userRes.user ? supabase.from("article_likes").select("article_id").eq("article_id", articleId).eq("user_id", userRes.user.id).maybeSingle() : Promise.resolve({ data: null }),
      ]);

      setLikeCount(likesRes.count ?? 0);
      setComments((commentsRes.data ?? []) as CommentRow[]);
      setLiked(!!myLikeRes.data);
    };

    loadInteractions();
  }, [article, articleModalOpen]);

  const toggleLike = async () => {
    if (!userId || !article) {
      toast.error("Sign in to like articles");
      return;
    }
    const articleId = article.id;
    if (liked) {
    const { error: deleteError } = await supabase.from("article_likes").delete().eq("article_id", articleId).eq("user_id", userId);
    if (deleteError) {
      toast.error("Failed to unlike article");
      return;
    }
    setLiked(false);
    setLikeCount((c) => Math.max(0, c - 1));
  } else {
    const { error: insertError } = await supabase.from("article_likes").insert({ article_id: articleId, user_id: userId });
    if (insertError) {
      toast.error("Failed to like article");
      return;
    }
    setLiked(true);
    setLikeCount((c) => c + 1);
  }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !article || !name.trim() || !body.trim()) return;

    const { error } = await supabase.from("article_comments").insert({
      article_id: article.id,
      user_id: userId,
      author_name: name.trim().slice(0, 60),
      body: body.trim().slice(0, 1000),
      status: "pending",
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Comment submitted for moderation");
      setBody("");
    }
  };

  const handleShare = async () => {
    if (!article) return;
    const url = `${window.location.origin}/newsroom/${article.slug}`;
    try {
      await navigator.share({ title: article.title, text: article.excerpt, url });
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  if (!article) return null;

  const paragraphs = article.summary.split(/\n+/).filter(Boolean);
  const publishDate = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  return (
    <Dialog open={articleModalOpen} onOpenChange={(open) => !open && closeArticleModal()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-loud-ink border-white/10 p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <button
              onClick={closeArticleModal}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 hover:text-loud-yellow"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Newsroom
            </button>
            <Button variant="ghost" size="sm" onClick={handleShare} className="text-white/70 hover:text-white">
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>

          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-loud-yellow">
            {article.source} {publishDate && `· ${publishDate}`}
          </div>

          <DialogTitle className="display mt-3 text-4xl sm:text-5xl text-white leading-tight">
            {article.title}
          </DialogTitle>

          <p className="mt-4 text-lg text-white/70">{article.excerpt}</p>

          <div className="mt-6 flex gap-3 flex-wrap">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-white/80 hover:border-loud-yellow/40 hover:text-loud-yellow"
            >
              <ExternalLink className="h-3 w-3" /> Original Source
            </a>
            <button
              onClick={toggleLike}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-widest ${liked ? 'border-loud-pink/60 bg-loud-pink/15 text-loud-pink' : 'border-white/15 bg-white/5 text-white/80 hover:border-loud-pink/40'}`}
            >
              <Heart className={`h-3 w-3 ${liked ? 'fill-current' : ''}`} /> {likeCount}
            </button>
          </div>

          {article.cover && (
            <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-white/10">
              <img src={article.cover} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-invert prose-lg mt-10 max-w-none text-white/80">
            {paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed">{p}</p>
            ))}
          </div>

          <p className="mt-10 text-xs uppercase tracking-widest text-white/40">
            Summary curated by LOUDMOUF™ · original reporting © {article.source}.
          </p>

          <section className="mt-16 border-t border-white/10 pt-10">
            <h2 className="text-3xl text-white flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-loud-yellow" /> Discussion
            </h2>
            <form onSubmit={submitComment} className="mt-6 space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/10 p-3 text-white rounded-xl"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 p-3 text-white rounded-xl resize-y"
              />
              <Button type="submit" className="cta-gradient">Post Comment</Button>
            </form>
            {comments.length > 0 && (
              <div className="mt-8 space-y-4">
                {comments.map(c => (
                  <div key={c.id} className="p-4 bg-white/[0.03] rounded-2xl border border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{c.author_name}</span>
                      <span className="text-white/50 text-xs">{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-white/80">{c.body}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
