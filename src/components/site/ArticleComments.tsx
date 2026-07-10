import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommunityGuidelines } from "./CommunityGuidelines";
import { MessageCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ArticleCommentsProps {
  articleId: string;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  parent_id: string | null;
}

export function ArticleComments({ articleId }: ArticleCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  // Check authentication status
  useState(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  });

  // Fetch comments
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["article-comments", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("article_comments")
        .select("*")
        .eq("article_id", articleId)
        .is("parent_id", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Comment[];
    },
  });

  // Post comment mutation
  const postCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be signed in to comment");
      }

      const { data, error } = await supabase
        .from("article_comments")
        .insert({
          article_id: articleId,
          user_id: session.user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article-comments", articleId] });
      setNewComment("");
      toast.success("Comment posted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("You must be a member to comment");
      return;
    }

    if (newComment.trim().length < 3) {
      toast.error("Comment must be at least 3 characters");
      return;
    }

    postCommentMutation.mutate(newComment);
  };

  return (
    <div className="mt-12 border-t border-white/10 pt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="display text-2xl text-white flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-loud-yellow" />
          Discussion ({comments.length})
        </h3>
        <button
          onClick={() => setShowGuidelines(true)}
          className="text-xs uppercase tracking-widest text-loud-yellow hover:text-loud-yellow/80 transition"
        >
          Community Guidelines
        </button>
      </div>

      {/* Comment Form */}
      {!isAuthenticated ? (
        <div className="glass rounded-2xl p-6 mb-8 text-center">
          <AlertCircle className="h-8 w-8 text-loud-yellow mx-auto mb-3" />
          <p className="text-white/70 mb-4">
            Comments are restricted to authenticated LOUDMOUF™ Private Club members.
          </p>
          <Button className="cta-gradient text-black">
            Sign In to Comment
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts with the collective..."
            className="min-h-[120px] glass border-white/10 text-white placeholder:text-white/40 mb-3"
            disabled={postCommentMutation.isPending}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-white/50">
              Your comment will be moderated before appearing publicly.
            </p>
            <Button
              type="submit"
              disabled={postCommentMutation.isPending || newComment.trim().length < 3}
              className="cta-gradient text-black"
            >
              {postCommentMutation.isPending ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center text-white/50 py-8">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-white/60">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="glass rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-loud-yellow/20 flex items-center justify-center text-loud-yellow font-semibold">
                  M
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-white">Member</span>
                    <span className="text-xs text-white/40">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CommunityGuidelines isOpen={showGuidelines} onClose={() => setShowGuidelines(false)} />
    </div>
  );
}
