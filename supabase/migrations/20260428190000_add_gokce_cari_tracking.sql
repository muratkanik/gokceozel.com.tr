create extension if not exists pgcrypto;

create table if not exists public.cari_users (
  id uuid primary key default gen_random_uuid(),
  username varchar(80) unique not null,
  name varchar(160) not null,
  role varchar(20) not null check (role in ('secretary', 'doctor')),
  password_hash text,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.cari_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null,
  patient_name text not null,
  phone varchar(80),
  service_type varchar(80) not null,
  procedure_name text not null,
  diagnosis text,
  package_name text,
  hospital text,
  has_insurance boolean not null default false,
  insurance_providers text[] not null default '{}',
  insurance_amount numeric(12, 2) not null default 0,
  cash_amount numeric(12, 2) not null default 0,
  card_amount numeric(12, 2) not null default 0,
  iban_amount numeric(12, 2) not null default 0,
  expense_amount numeric(12, 2) not null default 0,
  payment_breakdown jsonb not null default '{}'::jsonb,
  note text,
  created_by uuid references public.cari_users(id) on delete set null,
  created_by_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.cari_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.cari_users(id) on delete set null,
  user_name text not null,
  user_role varchar(20),
  action text not null,
  detail text,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

create table if not exists public.cari_service_types (
  id uuid primary key default gen_random_uuid(),
  name varchar(80) unique not null,
  created_by uuid references public.cari_users(id) on delete set null,
  created_by_name text,
  created_at timestamptz default now()
);

create table if not exists public.cari_payment_types (
  id uuid primary key default gen_random_uuid(),
  name varchar(80) unique not null,
  color varchar(20) not null default '#0f172a',
  sort_order integer not null default 100,
  created_by uuid references public.cari_users(id) on delete set null,
  created_by_name text,
  created_at timestamptz default now()
);

create index if not exists idx_cari_entries_entry_date on public.cari_entries(entry_date desc);
create index if not exists idx_cari_entries_service_type on public.cari_entries(service_type);
create index if not exists idx_cari_logs_created_at on public.cari_logs(created_at desc);

insert into public.cari_service_types (name, created_by_name)
values
  ('Muayenehane', 'Sistem'),
  ('Ameliyat', 'Sistem'),
  ('Ozon', 'Sistem'),
  ('Botox/Dolgu', 'Sistem')
on conflict (name) do nothing;

insert into public.cari_payment_types (name, color, sort_order, created_by_name)
values
  ('Sigortadan ödenen', '#059669', 10, 'Sistem'),
  ('Nakit', '#0f172a', 20, 'Sistem'),
  ('Kart', '#2563eb', 30, 'Sistem'),
  ('IBAN / havale', '#7c3aed', 40, 'Sistem')
on conflict (name) do nothing;
