-- Run this SQL in your Supabase project to create minimal tables for Creem billing
-- Safe to run multiple times (uses IF NOT EXISTS)

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  type text,
  data jsonb not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  checkout_id text unique,
  product_id text,
  status text,
  plan text,
  billing text,
  customer_id text,
  customer_email text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS policies (optional, open for anon read, restrict write)
alter table public.billing_events enable row level security;
alter table public.subscriptions enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'subscriptions' and policyname = 'Allow read for anon') then
    create policy "Allow read for anon" on public.subscriptions for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'billing_events' and policyname = 'Allow read for anon') then
    create policy "Allow read for anon" on public.billing_events for select using (true);
  end if;
end $$;