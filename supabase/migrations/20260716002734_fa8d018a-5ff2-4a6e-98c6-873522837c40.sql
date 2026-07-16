
-- Restrict SECURITY DEFINER trigger functions from being callable via API
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.update_updated_at_column() from anon, authenticated, public;
-- has_role is intentionally callable by authenticated (used in RLS check); keep as-is but revoke from anon
revoke execute on function public.has_role(uuid, app_role) from anon, public;

-- Narrow analytics insert: require event_name non-empty and payload size sane
drop policy if exists "anyone can insert events" on public.analytics_events;
create policy "insert events with valid shape" on public.analytics_events
  for insert to anon, authenticated
  with check (
    char_length(event_name) between 1 and 100
    and (path is null or char_length(path) <= 500)
  );
