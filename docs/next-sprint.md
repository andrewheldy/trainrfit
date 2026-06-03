# Trainr — Next Sprint

> **Directive:** Ship no new UI until the data layer underneath existing UI is real.
> The app already has 25 routes and 60+ components. The problem is not a lack of UI.
> The problem is that most of it reads from hardcoded TypeScript files or localStorage.
>
> This sprint focuses exclusively on replacing fake data with real data.

---

## Sprint Goal

By the end of this sprint:
- Auth role checks read from the database
- The exercise library reads from Supabase
- The muscle groups read from Supabase
- Onboarding results persist to a user's profile
- A user can view and edit their profile

These five changes make the core user loop — sign up → onboard → browse exercises → log a workout → see your dashboard — fully real and persistent.

---

## Sprint Tasks (in build order)

---

### Task 1 — `trainrfit-001`
**Add `is_creator` and `is_admin` flags to `profiles` table**

**Why first:** Every other task touches auth or protected routes. Do this before anything else.

**What to build:**
```sql
-- Migration
ALTER TABLE public.profiles
  ADD COLUMN is_admin  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN is_creator BOOLEAN NOT NULL DEFAULT false;
```

Update `src/lib/auth-context.tsx`:
- Replace the `VITE_ADMIN_EMAILS` env var check
- After `supabase.auth.getSession()`, fetch the user's profile row
- Set `isAdmin` and `isCreator` from the DB row

Update `src/integrations/supabase/types.ts` to reflect new columns.

**Done when:** `useAuth()` returns `isAdmin: true` for the designated admin user based on a DB flag, not an env var.

---

### Task 2 — `trainrfit-002`
**Seed exercise library to Supabase**

**Why second:** The exercises table is empty. The workout tracker already lets users log exercises by selecting from this table — but the table has no rows, so the picker is empty.

**What to build:**
- Write a new migration file that inserts all exercises from `src/data/exercises.ts`
- Include at minimum: `name`, `slug`, `difficulty`, `equipment`, `description`
- Insert corresponding `exercise_muscles` rows for each exercise

**Done when:** `SELECT count(*) FROM exercises` returns > 0 in Supabase.

---

### Task 3 — `trainrfit-003`
**Seed muscle groups to Supabase**

**Why third:** Muscles are a dependency of exercise-to-muscle linking. Seed this alongside or immediately after exercises.

**What to build:**
- Write a migration that inserts the 12 major muscle groups
- Include `name`, `slug`, `region`, `weekly_sets_min`, `weekly_sets_max`
- Regions: Upper Body, Lower Body, Core

**Done when:** `SELECT count(*) FROM muscles` returns 12+ rows.

---

### Task 4 — `trainrfit-004`
**Wire exercise and muscle routes to Supabase queries**

**Why fourth:** Once the seed data is in the DB, the four static route files need to be updated. This is the only task in the sprint that touches multiple UI files.

**What to build:**
- `exercises.index.tsx` — replace static import with `supabase.from("exercises").select()`
- `exercises.$slug.tsx` — query by slug, include joined muscle data
- `muscles.index.tsx` — query all muscles ordered by `display_order`
- `muscles.$slug.tsx` — query by slug, include exercises that target this muscle

**Done when:** All four routes render real data with the static imports removed.

---

### Task 5 — `trainrfit-005`
**Save onboarding results to user profile in Supabase**

**Why fifth:** Onboarding currently uses `localStorage`. This is the last piece of core user data that is ephemeral. Fix it while the schema is fresh.

**What to build:**
- Migration: add `fitness_goal`, `experience_level`, `days_per_week` to `profiles`
- `src/lib/onboarding/storage.ts` — add a `syncToSupabase()` function that upserts these fields
- Call `syncToSupabase()` at the end of the onboarding flow (on the results page)
- On dashboard load, check if profile fields are populated; skip onboarding if so

**Done when:** Completing onboarding, clearing localStorage, and logging in from a fresh browser still shows the user's correct onboarding state.

---

## What This Sprint Does NOT Include

The following are explicitly out of scope for this sprint:

| Excluded | Reason |
|---|---|
| User profile page (`trainrfit-006`) | Valuable but not blocking — deprioritised in favour of data foundation |
| Creator application form (`trainrfit-007`) | Depends on creator_profiles schema not yet built |
| `creator_profiles` table (`trainrfit-008`) | Correct order is: foundation → member → creator |
| Coach listing wiring (`trainrfit-009`) | High effort; blocked on creator_profiles |
| Personal records (`trainrfit-010`) | Blocked on exercise seed data being in place first |
| Any new UI components | The goal this sprint is data, not new screens |
| Payments | No prerequisite infrastructure exists yet |
| Gamification | No prerequisite infrastructure exists yet |

---

## Definition of Done for This Sprint

- [ ] `profiles` table has `is_admin` and `is_creator` columns
- [ ] `useAuth()` reads role flags from DB, not env vars
- [ ] `exercises` table has > 0 rows seeded
- [ ] `muscles` table has 12+ rows seeded
- [ ] `exercise_muscles` join table has rows with primary/secondary roles
- [ ] All four exercise/muscle routes query Supabase, not static files
- [ ] Static file imports removed from exercise and muscle route files
- [ ] Onboarding completion writes to `profiles` table
- [ ] Onboarding state persists across browser clears and device switches
- [ ] `bun run build` passes with no new errors
- [ ] No new UI routes added during this sprint

---

## Metrics to Check After Sprint

After completing these tasks, verify:

1. Open `/exercises` — does it load exercises from the DB?
2. Open `/exercises/bench-press` (or any slug) — does it load from the DB?
3. Open `/muscles` — does it render real muscle groups?
4. Open `/tracker` — does the exercise picker show real exercises from the DB?
5. Complete onboarding, clear localStorage, reload — is your goal still shown on the dashboard?
6. Log in with the admin email — does the admin dashboard load?

All six should pass before moving to the next sprint.

---

## Next Sprint Preview (after this one)

Once the data foundation is solid, the next sprint focuses on making the app feel complete for a real user:

1. `trainrfit-006` — User profile page
2. `trainrfit-010` — Personal records on dashboard
3. `trainrfit-008` — `creator_profiles` DB table (enables the entire creator layer)
