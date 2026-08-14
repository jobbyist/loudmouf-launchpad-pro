-- LOUD AI: per-member message log used to enforce a 3-messages/24h rate limit.
-- Written and read only by the service-role client from /api/chat — no public policies.
create table public.loud_ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz not null default now()
);

create index loud_ai_messages_user_id_created_at_idx
  on public.loud_ai_messages (user_id, created_at desc);

grant all on public.loud_ai_messages to service_role;
alter table public.loud_ai_messages enable row level security;
