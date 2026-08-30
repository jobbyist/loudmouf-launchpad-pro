-- Premium Herbal Tinctures (/herbal-tinctures): reservation + Paystack payment tracking.
-- Written and read only by the service-role client from the Paystack server routes — no public policies.
create table public.tincture_reservations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  product_id text not null,
  product_name text not null,
  tier text not null,
  email text not null,
  quantity integer not null default 1,
  unit_amount_cents integer not null,
  amount_cents integer not null,
  currency text not null default 'ZAR',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  paystack_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tincture_reservations_email_idx on public.tincture_reservations (email);
create index tincture_reservations_status_idx on public.tincture_reservations (status);

grant all on public.tincture_reservations to service_role;
alter table public.tincture_reservations enable row level security;
