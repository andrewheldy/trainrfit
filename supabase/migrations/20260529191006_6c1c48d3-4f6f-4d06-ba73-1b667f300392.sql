
-- ============= ENUMS =============
create type public.difficulty_level as enum ('beginner','intermediate','advanced');
create type public.muscle_role as enum ('primary','secondary');

-- ============= PROFILES =============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1))
  );
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============= MUSCLES =============
create table public.muscles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  region text not null, -- upper / lower / core
  short_description text,
  overview text,
  weekly_sets_min int,
  weekly_sets_max int,
  image_url text,
  display_order int default 0
);
grant select on public.muscles to anon, authenticated;
grant all on public.muscles to service_role;
alter table public.muscles enable row level security;
create policy "muscles_public_read" on public.muscles for select to anon, authenticated using (true);

-- ============= EXERCISES =============
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  instructions jsonb default '[]'::jsonb,
  common_mistakes jsonb default '[]'::jsonb,
  form_tips jsonb default '[]'::jsonb,
  difficulty public.difficulty_level not null default 'beginner',
  equipment text,
  exercise_type text, -- compound / isolation / cardio / mobility
  image_url text,
  video_url text,
  created_at timestamptz not null default now()
);
create index on public.exercises (difficulty);
grant select on public.exercises to anon, authenticated;
grant all on public.exercises to service_role;
alter table public.exercises enable row level security;
create policy "exercises_public_read" on public.exercises for select to anon, authenticated using (true);

-- ============= EXERCISE_MUSCLES =============
create table public.exercise_muscles (
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  muscle_id uuid not null references public.muscles(id) on delete cascade,
  role public.muscle_role not null default 'primary',
  primary key (exercise_id, muscle_id)
);
grant select on public.exercise_muscles to anon, authenticated;
grant all on public.exercise_muscles to service_role;
alter table public.exercise_muscles enable row level security;
create policy "exercise_muscles_public_read" on public.exercise_muscles for select to anon, authenticated using (true);

-- ============= WORKOUT_PLANS =============
create table public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);
create index on public.workout_plans (user_id);
grant select, insert, update, delete on public.workout_plans to authenticated;
grant all on public.workout_plans to service_role;
alter table public.workout_plans enable row level security;
create policy "plans_own_all" on public.workout_plans for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============= WORKOUT_SESSIONS =============
create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  workout_plan_id uuid references public.workout_plans(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  session_date date not null default current_date,
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.workout_sessions (user_id, session_date desc);
grant select, insert, update, delete on public.workout_sessions to authenticated;
grant all on public.workout_sessions to service_role;
alter table public.workout_sessions enable row level security;
create policy "sessions_own_all" on public.workout_sessions for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============= WORKOUT_EXERCISES =============
create table public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  order_index int not null default 0,
  sets jsonb not null default '[]'::jsonb, -- [{reps, weight, rpe}]
  notes text,
  created_at timestamptz not null default now()
);
create index on public.workout_exercises (session_id);
create index on public.workout_exercises (user_id);
grant select, insert, update, delete on public.workout_exercises to authenticated;
grant all on public.workout_exercises to service_role;
alter table public.workout_exercises enable row level security;
create policy "we_own_all" on public.workout_exercises for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============= SAVED_EXERCISES =============
create table public.saved_exercises (
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);
grant select, insert, update, delete on public.saved_exercises to authenticated;
grant all on public.saved_exercises to service_role;
alter table public.saved_exercises enable row level security;
create policy "saved_own_all" on public.saved_exercises for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============= AI_QUESTIONS =============
create table public.ai_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  answer text,
  created_at timestamptz not null default now()
);
create index on public.ai_questions (user_id, created_at desc);
grant select, insert, update, delete on public.ai_questions to authenticated;
grant all on public.ai_questions to service_role;
alter table public.ai_questions enable row level security;
create policy "ai_own_all" on public.ai_questions for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
