alter table if exists public.cari_users
  add column if not exists email varchar(190) unique,
  add column if not exists reset_token_hash text,
  add column if not exists reset_token_expires_at timestamptz;

create unique index if not exists cari_users_email_unique
  on public.cari_users (email)
  where email is not null;
