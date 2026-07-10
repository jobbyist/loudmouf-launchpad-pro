import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { ArticleComments } from "@/components/site/ArticleComments";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Play, ExternalLink, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { injectArticleSchema, getSchemaMetaTags } from "@/lib/schemaMarkup";
import { getThumbnailPlaceholder } from "@/lib/articleThumbnails";

export const Route = createFileRoute("/newsroom/$articleId")({
  component: ArticlePage,
});

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  source_url: string;
  source_name: string;
  thumbnail_url: string | null;
  reading_time: number;
  published_at: string;
}

function ArticlePage() {
  const { articleId } = Route.useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Check authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
    });
  }, []);

  // Fetch article
  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", articleId)
        .single();

      if (error) throw error;
      return data as Article;
    },
  });

  // Fetch like status
  const { data: isLiked = false } = useQuery({
    queryKey: ["article-like-status", article?.id, userId],
    queryFn: async () => {
      if (!userId || !article) return false;

      const { data, error } = await supabase
        .from("article_likes")
        .select("id")
        .eq("article_id", article.id)
        .eq("user_id", userId)
        .single();

      return !!data;
    },
    enabled: !!userId && !!article,
  });

  // Fetch bookmark status
  const { data: isBookmarked = false } = useQuery({
    queryKey: ["article-bookmark-status", article?.id, userId],
    queryFn: async () => {
      if (!userId || !article) return false;

      const { data } = await supabase
        .from("article_bookmarks")
        .select("id")
        .eq("article_id", article.id)
        .eq("user_id", userId)
        .single();

      return !!data;
    },
    enabled: !!userId && !!article,
  });

  // Fetch like count
  const { data: likeCount = 0 } = useQuery({
    queryKey: ["article-like-count", article?.id],
    queryFn: async () => {
      if (!article) return 0;

      const { count, error } = await supabase
        .from("article_likes")
        .select("*", { count: "exact", head: true })
        .eq("article_id", article.id);

      return count || 0;
    },
    enabled: !!article,
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated || !article) {
        throw new Error("You must be signed in to like articles");
      }

      if (isLiked) {
        await supabase
          .from("article_likes")
          .delete()
          .eq("article_id", article.id)
          .eq("user_id", userId!);
      } else {
        await supabase
          .from("article_likes")
          .insert({ article_id: article.id, user_id: userId! });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article-like-status"] });
      queryClient.invalidateQueries({ queryKey: ["article-like-count"] });
    },
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated || !article) {
        throw new Error("You must be signed in to bookmark articles");
      }

      if (isBookmarked) {
        await supabase
          .from("article_bookmarks")
          .delete()
          .eq("article_id", article.id)
          .eq("user_id", userId!);
      } else {
        await supabase
          .from("article_bookmarks")
          .insert({ article_id: article.id, user_id: userId! });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article-bookmark-status"] });
      toast.success(isBookmarked ? "Bookmark removed" : "Article bookmarked");
    },
  });

  // Inject schema markup
  useEffect(() => {
    if (article) {
      injectArticleSchema({
        title: article.title,
        description: article.summary.substring(0, 160),
        publishedDate: article.published_at,
        imageUrl: article.thumbnail_url || getThumbnailPlaceholder(article.title),
        url: `https://loudmouf.co.za/newsroom/${article.slug}`,
      });
    }
  }, [article]);

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error("Sign in to like articles");
      return;
    }
    likeMutation.mutate();
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.error("Sign in to bookmark articles");
      return;
    }
    bookmarkMutation.mutate();
  };

  const handleListen = () => {
    toast.info("Text-to-speech feature coming soon!");
  };

  if (isLoading) {
    return <SiteShell title="Loading..." kicker="Newsroom"><div className="text-white/60">Loading article...</div></SiteShell>;
  }

  if (!article) {
    return <SiteShell title="Not Found" kicker="Newsroom"><div className="text-white/60">Article not found</div></SiteShell>;
  }

  const thumbnailUrl = article.thumbnail_url || getThumbnailPlaceholder(article.title);

  return (
    <SiteShell title={article.title} kicker="Newsroom">
      {/* Article Header */}
      <div className="mb-8">
        <div className="aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 mb-6">
          <img src={thumbnailUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-widest text-white/50 mb-4">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(article.published_at).toLocaleDateString()}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.reading_time} min read</span>
          <span>·</span>
          <span className="text-loud-yellow">{article.source_name}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleLike} variant="outline" className={`glass border-white/10 ${isLiked ? 'text-loud-pink' : 'text-white'}`}>
            <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-loud-pink' : ''}`} />
            {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          </Button>
          <Button onClick={handleBookmark} variant="outline" className="glass border-white/10 text-white">
            <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-loud-yellow' : ''}`} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
          <Button onClick={handleListen} variant="outline" className="glass border-white/10 text-white">
            <Play className="h-4 w-4 mr-2" />
            Listen to this article
          </Button>
          <Button asChild variant="outline" className="glass border-white/10 text-white">
            <a href={article.source_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Read Original
            </a>
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: article.summary }} />
      </div>

      {/* Comments Section */}
      <ArticleComments articleId={article.id} />
    </SiteShell>
  );
}
