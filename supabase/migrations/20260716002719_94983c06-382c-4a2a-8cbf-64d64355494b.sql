
-- ROLES
create type public.app_role as enum ('admin', 'moderator', 'member');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  phone text,
  tier text check (tier in ('standard','premium')),
  verified_at timestamptz,
  referral_code text unique,
  referred_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "upsert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "update own profile" on public.profiles for update to authenticated using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, first_name, last_name, referral_code)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    upper(substr(md5(new.id::text), 1, 8))
  );
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- SA ID VERIFICATIONS
create table public.said_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  id_number_hash text not null,
  id_number_last4 text not null,
  verified boolean not null default false,
  verifynow_ref text,
  raw_response jsonb,
  created_at timestamptz not null default now()
);
grant select, insert on public.said_verifications to authenticated;
grant all on public.said_verifications to service_role;
alter table public.said_verifications enable row level security;
create policy "read own said" on public.said_verifications for select to authenticated using (auth.uid() = user_id);
create policy "insert own said" on public.said_verifications for insert to authenticated with check (auth.uid() = user_id);

-- update member_signatures to link to auth user
alter table public.member_signatures add column if not exists user_id uuid references auth.users(id) on delete set null;
grant select on public.member_signatures to authenticated;
create policy "read own signatures" on public.member_signatures for select to authenticated using (auth.uid() = user_id);

-- NEWSROOM
create table public.newsroom_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  source text not null,
  source_url text not null,
  cover text,
  excerpt text,
  summary_md text not null,
  word_count int,
  published_at timestamptz not null default now(),
  status text not null default 'published' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now()
);
grant select on public.newsroom_articles to anon, authenticated;
grant all on public.newsroom_articles to service_role;
alter table public.newsroom_articles enable row level security;
create policy "articles are public" on public.newsroom_articles for select to anon, authenticated using (status = 'published');

create table public.article_likes (
  article_id uuid references public.newsroom_articles(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (article_id, user_id)
);
grant select on public.article_likes to anon, authenticated;
grant insert, delete on public.article_likes to authenticated;
grant all on public.article_likes to service_role;
alter table public.article_likes enable row level security;
create policy "likes are public" on public.article_likes for select to anon, authenticated using (true);
create policy "like own" on public.article_likes for insert to authenticated with check (auth.uid() = user_id);
create policy "unlike own" on public.article_likes for delete to authenticated using (auth.uid() = user_id);

create table public.article_comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.newsroom_articles(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  body text not null check (char_length(body) between 1 and 2000),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
grant select on public.article_comments to anon, authenticated;
grant insert on public.article_comments to authenticated;
grant update, delete on public.article_comments to service_role;
grant all on public.article_comments to service_role;
alter table public.article_comments enable row level security;
create policy "approved comments public" on public.article_comments for select to anon, authenticated using (status = 'approved' or auth.uid() = user_id);
create policy "comment as self" on public.article_comments for insert to authenticated with check (auth.uid() = user_id);
create policy "moderators update" on public.article_comments for update to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));
create policy "moderators delete" on public.article_comments for delete to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));

-- ANALYTICS EVENTS
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  path text,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
grant insert on public.analytics_events to anon, authenticated;
grant select on public.analytics_events to service_role;
grant all on public.analytics_events to service_role;
alter table public.analytics_events enable row level security;
create policy "anyone can insert events" on public.analytics_events for insert to anon, authenticated with check (true);
create policy "admins read events" on public.analytics_events for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- REFERRALS
create table public.referral_attributions (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid references auth.users(id) on delete cascade not null,
  referred_user_id uuid references auth.users(id) on delete set null,
  referred_email text,
  source text,
  event_type text not null check (event_type in ('signup','membership','yield_order')),
  commission_cents int not null default 0,
  status text not null default 'pending' check (status in ('pending','approved','paid','void')),
  shopify_order_id text,
  created_at timestamptz not null default now()
);
grant select on public.referral_attributions to authenticated;
grant all on public.referral_attributions to service_role;
alter table public.referral_attributions enable row level security;
create policy "read own referrals" on public.referral_attributions for select to authenticated using (auth.uid() = referrer_user_id);

-- SHOPIFY ORDERS
create table public.shopify_orders (
  id uuid primary key default gen_random_uuid(),
  shopify_order_id text unique not null,
  email text,
  user_id uuid references auth.users(id) on delete set null,
  tier text,
  total_cents int,
  currency text,
  status text,
  financial_status text,
  fulfillment_status text,
  raw jsonb,
  created_at timestamptz not null default now()
);
grant select on public.shopify_orders to authenticated;
grant all on public.shopify_orders to service_role;
alter table public.shopify_orders enable row level security;
create policy "read own orders" on public.shopify_orders for select to authenticated using (auth.uid() = user_id);

-- updated_at trigger for profiles
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();
