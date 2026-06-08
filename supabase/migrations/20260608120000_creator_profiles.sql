-- Creator profiles table
-- Stores data collected during creator onboarding and displayed on creator profile pages.

create table if not exists public.creator_profiles (
  id                          uuid primary key default gen_random_uuid(),
  user_id                     uuid references auth.users(id) on delete cascade,
  display_name                text,
  headline                    text,
  creator_types               text[],
  disciplines                 text[],
  years_training              text,
  years_coaching              text,
  clients_coached             text,
  certifications              text[],
  bio                         text,
  why_coach                   text,
  philosophy                  text,
  differentiation             text,
  ideal_client                text,
  welcome_video_url           text,
  welcome_video_thumbnail_url text,
  monetization_options        text[],
  is_verified                 boolean not null default false,
  trust_score                 integer not null default 0,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- Enforce one profile per user
create unique index if not exists creator_profiles_user_id_idx
  on public.creator_profiles (user_id);

-- Timestamp auto-update trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists creator_profiles_updated_at on public.creator_profiles;
create trigger creator_profiles_updated_at
  before update on public.creator_profiles
  for each row execute function public.set_updated_at();

-- Row-level security
alter table public.creator_profiles enable row level security;

-- Any authenticated user can read creator profiles (public discovery)
create policy "Authenticated users can read creator profiles"
  on public.creator_profiles
  for select
  to authenticated
  using (true);

-- Users can only insert their own profile
create policy "Users can insert their own creator profile"
  on public.creator_profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can only update their own profile
create policy "Users can update their own creator profile"
  on public.creator_profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
