alter table if exists public.appointments
  add column if not exists scheduled_date date,
  add column if not exists start_time varchar(5),
  add column if not exists end_time varchar(5),
  add column if not exists duration_minutes integer default 30,
  add column if not exists source varchar(40) default 'web',
  add column if not exists locale varchar(10),
  add column if not exists patient_note text,
  add column if not exists internal_note text,
  add column if not exists cari_entry_id uuid,
  add column if not exists updated_at timestamptz default now();

create index if not exists idx_appointments_scheduled_date on public.appointments(scheduled_date);
create index if not exists idx_appointments_status on public.appointments(status);

create table if not exists public.reservation_settings (
  id text primary key default 'default',
  is_enabled boolean not null default true,
  working_days integer[] not null default '{1,2,3,4,5,6}',
  day_start varchar(5) not null default '10:00',
  day_end varchar(5) not null default '18:00',
  slot_minutes integer not null default 30,
  buffer_minutes integer not null default 0,
  max_per_slot integer not null default 1,
  min_notice_hours integer not null default 2,
  booking_horizon_days integer not null default 60,
  updated_at timestamptz default now()
);

create table if not exists public.reservation_blackouts (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  reason text,
  is_full_day boolean not null default true,
  start_time varchar(5),
  end_time varchar(5),
  created_at timestamptz default now()
);

create index if not exists idx_reservation_blackouts_date on public.reservation_blackouts(date);

insert into public.reservation_settings (id)
values ('default')
on conflict (id) do nothing;
