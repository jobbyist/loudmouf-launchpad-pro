-- Guest likes + open comments (no moderation) for Newsroom

-- 1) article_likes: support authenticated users OR anonymous guests
ALTER TABLE public.article_likes DROP CONSTRAINT IF EXISTS article_likes_pkey;
ALTER TABLE public.article_likes ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.article_likes ADD COLUMN IF NOT EXISTS guest_id text;
ALTER TABLE public.article_likes ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();

-- Backfill ids for existing rows
UPDATE public.article_likes SET id = gen_random_uuid() WHERE id IS NULL;
ALTER TABLE public.article_likes ALTER COLUMN id SET NOT NULL;
ALTER TABLE public.article_likes ADD PRIMARY KEY (id);

-- Exactly one of user_id / guest_id
ALTER TABLE public.article_likes DROP CONSTRAINT IF EXISTS article_likes_actor_check;
ALTER TABLE public.article_likes
  ADD CONSTRAINT article_likes_actor_check
  CHECK (
    (user_id IS NOT NULL AND guest_id IS NULL)
    OR (user_id IS NULL AND guest_id IS NOT NULL)
  );

-- Unique likes per actor
CREATE UNIQUE INDEX IF NOT EXISTS article_likes_user_unique
  ON public.article_likes (article_id, user_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS article_likes_guest_unique
  ON public.article_likes (article_id, guest_id)
  WHERE guest_id IS NOT NULL;

-- RLS: allow anon insert/delete by guest_id
DROP POLICY IF EXISTS "like own" ON public.article_likes;
DROP POLICY IF EXISTS "unlike own" ON public.article_likes;
DROP POLICY IF EXISTS "like as auth or guest" ON public.article_likes;
DROP POLICY IF EXISTS "unlike as auth or guest" ON public.article_likes;

GRANT INSERT, DELETE ON public.article_likes TO anon, authenticated;

CREATE POLICY "like as auth or guest" ON public.article_likes
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid() AND guest_id IS NULL)
    OR (auth.uid() IS NULL AND user_id IS NULL AND guest_id IS NOT NULL AND char_length(guest_id) BETWEEN 8 AND 80)
  );

CREATE POLICY "unlike as auth or guest" ON public.article_likes
  FOR DELETE TO anon, authenticated
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND guest_id IS NOT NULL)
  );

-- 2) article_comments: no moderation; guests can comment
ALTER TABLE public.article_comments ALTER COLUMN status SET DEFAULT 'approved';
UPDATE public.article_comments SET status = 'approved' WHERE status = 'pending';

DROP POLICY IF EXISTS "approved comments public" ON public.article_comments;
DROP POLICY IF EXISTS "comment as self" ON public.article_comments;
DROP POLICY IF EXISTS "comments public read" ON public.article_comments;
DROP POLICY IF EXISTS "comment as auth or guest" ON public.article_comments;

GRANT INSERT ON public.article_comments TO anon, authenticated;

CREATE POLICY "comments public read" ON public.article_comments
  FOR SELECT TO anon, authenticated
  USING (status = 'approved' OR (auth.uid() IS NOT NULL AND auth.uid() = user_id));

CREATE POLICY "comment as auth or guest" ON public.article_comments
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(author_name) BETWEEN 1 AND 60
    AND char_length(body) BETWEEN 1 AND 2000
    AND status = 'approved'
    AND (
      (auth.uid() IS NOT NULL AND user_id = auth.uid())
      OR (user_id IS NULL)
    )
  );
