
# Gym Lift — Foundation Plan

A premium, dark-themed strength training platform. This first build establishes the brand, navigation, content surfaces, and a seeded database so future features layer in without restructuring.

## Design system

- **Theme**: dark by default (no theme toggle yet).
- **Palette**: deep charcoal background (`#0B0B0C`), elevated surface (`#141416`), border (`#1F1F22`), foreground near-white, muted gray for secondary text. Single accent: **Gym Lift lime** sampled from logo (`#B6F23D`). No gradients, no neon glow, no glassmorphism.
- **Typography**: condensed athletic display for headlines (Bebas Neue or Archivo Black) + clean sans body (Inter). Tight tracking on display, generous tracking on small caps labels.
- **Components**: flat cards with subtle 1px borders, sharp 4–8px radii, large editorial imagery, monospace numerals for stats/sets/reps.
- **Logo**: place uploaded logo in `src/assets/` and use in nav + hero.
- All tokens defined in `src/styles.css` (oklch). No raw color classes in components.

## Backend (Lovable Cloud)

Enable Cloud and create tables matching the brief:

- `muscles` — id, slug, name, region (upper/lower/core), short_description, image_url
- `exercises` — id, slug, name, description, instructions (jsonb steps), common_mistakes (jsonb), form_tips (jsonb), difficulty (beginner/intermediate/advanced), equipment, exercise_type, image_url, video_url
- `exercise_muscles` — exercise_id, muscle_id, role (primary/secondary)
- `workout_plans` — id, user_id, name, created_at
- `workout_sessions` — id, workout_plan_id, user_id, date, notes
- `workout_exercises` — id, session_id, exercise_id, order, sets (jsonb: [{reps, weight, rpe}]), notes
- `saved_exercises` — user_id, exercise_id (favorites)
- `ai_questions` — id, user_id, question, answer, created_at

RLS: public read on `muscles`, `exercises`, `exercise_muscles`; user-owned read/write on the rest. Profiles table + trigger on `auth.users` for username. Seed ~20 exercises across the 11 muscle groups so the library feels real, not empty.

## Routes (TanStack Start, file-based)

```text
src/routes/
  __root.tsx              top nav + footer shell
  index.tsx               Home
  muscles.index.tsx       Muscle grid
  muscles.$slug.tsx       Muscle detail
  exercises.index.tsx     Library with filters + search
  exercises.$slug.tsx     Exercise detail
  tracker.tsx             Workout tracker
  dashboard.tsx           My Lift dashboard
  coach.tsx               AI Coach (placeholder)
  auth.tsx                Sign in / sign up
```

Each route gets its own `head()` metadata. Nav links: Home, Muscles, Exercises, Tracker, Coach, Dashboard.

## Page-by-page

**Home** — full-bleed hero with logo + "Train With Purpose" display headline, sub, two CTAs (Explore Exercises / Start My Lift). Sections below: interactive muscle explorer (SVG body, click a region → muscle page), featured exercise cards (large image, name, target), tracker preview (mock session log styled like the real tracker), AI coach teaser card (small, supporting). No marquees, no trust-logo strips.

**Muscles index** — grid of 11 muscle cards (image + name + exercise count).

**Muscle detail** — header with muscle name and short overview, "Recommended weekly volume" stat block, then exercise rails grouped by Featured / Beginner / Intermediate / Advanced.

**Exercise library** — search input + filter chips (muscle, equipment, difficulty, type). Card grid only (no table view). Loader-driven, filters reflected in URL search params.

**Exercise detail** — large hero image, muscles worked chips (primary/secondary), step-by-step list, common mistakes, form tips, video placeholder block, related exercises rail. Sticky "Add to My Lift" CTA.

**Tracker** — create/select a workout plan, add a session for today, add exercises (search modal pulling from library), log sets/reps/weight/notes. Inline editing, autosave.

**Dashboard** — current programs, recent workouts (last 5), personal records (best weight per exercise), weekly activity (7-day bar), favorite + saved exercises.

**AI Coach** — chat-style page with canned/placeholder responses (no LLM wired yet); inputs persist to `ai_questions`.

**Auth** — email/password sign in + sign up; username on signup. Gate Tracker, Dashboard, AI Coach, and "Add to My Lift" behind auth (redirect to /auth).

## Build order

1. Design tokens + nav shell + logo + auth
2. Cloud enable + schema + seed
3. Home (hero, muscle explorer, library/tracker/coach previews)
4. Muscles index + detail
5. Exercise library + detail
6. Add to My Lift flow
7. Tracker
8. Dashboard
9. AI Coach placeholder

## Technical notes

- TanStack Start + TanStack Query; loaders use `ensureQueryData` + `useSuspenseQuery`.
- Muscle explorer is a hand-built inline SVG (no third-party body-map lib) so it inherits theme tokens.
- Images: use Unsplash-style training photography URLs in seed data for now; swap to owned assets later.
- No payments, social, challenges, wearables in this pass.

## Open questions before I build

1. **Auth gating** — require sign-in to use Tracker/Dashboard/Add-to-Lift, or allow a local guest tracker that syncs after signup? I'm assuming required sign-in.
2. **Muscle explorer style** — front-only anatomical body silhouette, or front + back toggle? I'm assuming front + back toggle.
3. **Seed content** — OK to seed ~20 real exercises with stock training imagery so the app feels populated, or leave empty and add via admin later?

If you're happy with the assumptions, say "go" and I'll build straight through. Otherwise tell me which to change.
