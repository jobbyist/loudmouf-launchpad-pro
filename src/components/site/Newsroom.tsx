import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { getThumbnailPlaceholder } from "@/lib/articleThumbnails";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail_url: string | null;
  reading_time: number;
  published_at: string;
  source_name: string;
}

export function Newsroom() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch articles
  const { data: articles = [] } = useQuery({
    queryKey: ["newsroom-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Article[];
    },
  });

  // Fetch like counts for each article
  const { data: likeCounts = {} } = useQuery({
    queryKey: ["article-likes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("article_likes")
        .select("article_id");

      if (error) throw error;

      const counts: Record<string, number> = {};
      data.forEach((like: any) => {
        counts[like.article_id] = (counts[like.article_id] || 0) + 1;
      });
      return counts;
    },
  });

  // Fetch comment counts for each article
  const { data: commentCounts = {} } = useQuery({
    queryKey: ["article-comments-count"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("article_comments")
        .select("article_id");

      if (error) throw error;

      const counts: Record<string, number> = {};
      data.forEach((comment: any) => {
        counts[comment.article_id] = (counts[comment.article_id] || 0) + 1;
      });
      return counts;
    },
  });

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isPaused || articles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, articles.length]);

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  };

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <div className="mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-loud-yellow">Newsroom</p>
        <h2 className="display mt-3 text-5xl sm:text-6xl text-white">
          Culture & Lifestyle.<br />
          <span className="text-gradient-loud">Fresh Daily.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-white/60">
          Curated cannabis culture, music, and lifestyle content from around the world and across South Africa.
        </p>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slider Container */}
        <div className="relative overflow-hidden rounded-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {articles[currentSlide] && (
                <ArticleCard
                  article={articles[currentSlide]}
                  likeCount={likeCounts[articles[currentSlide].id] || 0}
                  commentCount={commentCounts[articles[currentSlide].id] || 0}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {articles.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 glass rounded-full p-3 text-white hover:bg-white/10 transition"
              aria-label="Previous article"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 glass rounded-full p-3 text-white hover:bg-white/10 transition"
              aria-label="Next article"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-loud-yellow" : "w-2 bg-white/20"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article, likeCount, commentCount }: { article: Article; likeCount: number; commentCount: number }) {
  const thumbnailUrl = article.thumbnail_url || getThumbnailPlaceholder(article.title);

  return (
    <Link to={`/newsroom/${article.slug}`} className="block group">
      <div className="glass rounded-3xl overflow-hidden border border-white/10 hover:border-loud-yellow/40 transition">
        <div className="aspect-[16/9] overflow-hidden">
          <img src={thumbnailUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-loud-yellow mb-3">
            <span>{article.source_name}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.reading_time} min read</span>
          </div>
          <h3 className="text-2xl font-display text-white mb-3 group-hover:text-loud-yellow transition">{article.title}</h3>
          <p className="text-white/60 text-sm line-clamp-2 mb-4">{article.excerpt}</p>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {likeCount}</span>
            <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {commentCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
