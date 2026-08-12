DROP VIEW IF EXISTS public.article_like_counts;

ALTER TABLE public.newsroom_articles
  ADD COLUMN IF NOT EXISTS like_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.sync_article_like_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.newsroom_articles SET like_count = like_count + 1 WHERE id = NEW.article_id;
    RETURN NEW;
  ELSE
    UPDATE public.newsroom_articles SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.article_id;
    RETURN OLD;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_article_like_count() FROM anon, authenticated, public;

DROP TRIGGER IF EXISTS article_likes_count_ins ON public.article_likes;
CREATE TRIGGER article_likes_count_ins AFTER INSERT ON public.article_likes
  FOR EACH ROW EXECUTE FUNCTION public.sync_article_like_count();
DROP TRIGGER IF EXISTS article_likes_count_del ON public.article_likes;
CREATE TRIGGER article_likes_count_del AFTER DELETE ON public.article_likes
  FOR EACH ROW EXECUTE FUNCTION public.sync_article_like_count();

UPDATE public.newsroom_articles a
SET like_count = COALESCE((SELECT count(*) FROM public.article_likes l WHERE l.article_id = a.id), 0);