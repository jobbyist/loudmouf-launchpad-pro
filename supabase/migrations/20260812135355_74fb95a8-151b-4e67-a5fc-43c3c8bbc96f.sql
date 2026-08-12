-- 1. article_likes: stop exposing user_id -> article_id mappings publicly
DROP POLICY IF EXISTS "likes are public" ON public.article_likes;
CREATE POLICY "read own likes" ON public.article_likes
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Aggregate-only public counts (no user identities)
CREATE OR REPLACE VIEW public.article_like_counts AS
  SELECT article_id, count(*)::bigint AS like_count
  FROM public.article_likes
  GROUP BY article_id;
GRANT SELECT ON public.article_like_counts TO anon, authenticated;
REVOKE SELECT ON public.article_likes FROM anon;

-- 2. Storage: enforce access control on the private bucket
CREATE POLICY "admins read loudmouf assets" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'loudmouf-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins upload loudmouf assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'loudmouf-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update loudmouf assets" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'loudmouf-assets' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'loudmouf-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete loudmouf assets" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'loudmouf-assets' AND public.has_role(auth.uid(), 'admin'));

-- 3. Internal SECURITY DEFINER trigger functions must not be callable via the API
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;