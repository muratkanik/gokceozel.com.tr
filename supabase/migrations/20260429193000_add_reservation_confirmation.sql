alter table if exists public.appointments
  add column if not exists confirmation_token_hash varchar(128),
  add column if not exists confirmation_expires_at timestamptz,
  add column if not exists confirmed_at timestamptz;

create index if not exists idx_appointments_confirmation_token_hash
  on public.appointments(confirmation_token_hash)
  where confirmation_token_hash is not null;
