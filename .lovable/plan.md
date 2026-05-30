## Gym Lift Onboarding Funnel — Build Plan

A mobile-first, 20-step onboarding flow that captures profile + training context and generates a personalized Week 1 program the user can push into "My Lift".

### Routes
- `/onboarding` — step-based funnel (single route, internal `step` state, URL search param `?step=N` for back/refresh)
- `/onboarding/results` — results + Week 1 plan + "Add Entire Program To My Lift" CTA
- `/my-lift` — new page showing saved program by day
- `/dashboard` — extend existing route with onboarding-aware widgets

### Redirect logic
- After auth (in `auth-context` post-login + after sign-up), check `localStorage.onboardingProfile.onboardingComplete`. If false/missing → `/onboarding`, else → `/dashboard`.
- `/onboarding` index redirects to `/dashboard` if already complete (skipped if `?force=1`).

### State & persistence
- Single React context `OnboardingProvider` (in `/onboarding` layout) holding `profile`, `setField`, `step`, `next`, `back`.
- Persist to `localStorage` key `gym-lift-onboarding-profile` on every change.
- Generated program saved to `localStorage` key `gym-lift-program`.
- Structured so a future Supabase `profiles` + `programs` table can drop in.

### File structure
```
src/routes/
  onboarding.tsx              # layout: header, progress bar, back button, <Outlet/> not needed — internal step switcher
  onboarding.results.tsx      # results page
  my-lift.tsx                 # saved program
src/lib/onboarding/
  types.ts                    # OnboardingProfile, Program, Workout, Exercise types
  context.tsx                 # OnboardingProvider + useOnboarding hook
  storage.ts                  # load/save profile + program (localStorage)
  scoring.ts                  # generateOnboardingResults(profile)
  program.ts                  # generateWeekOnePlan(profile, results)
  steps.ts                    # ordered step config (id, title, component)
src/components/onboarding/
  OnboardingLayout.tsx
  ProgressBar.tsx
  QuestionScreen.tsx          # title + helper + children + Continue/Back
  OptionCard.tsx              # single-select card button
  MultiSelectCardGroup.tsx    # with optional max
  HeightInput.tsx
  WeightInput.tsx
  LocationInput.tsx
  LoadingPlan.tsx             # animated checklist (step 20)
  steps/
    StepWelcome.tsx
    StepAge.tsx
    StepSexAtBirth.tsx
    StepGender.tsx
    StepHeight.tsx
    StepWeight.tsx
    StepLocation.tsx
    StepPrimaryGoal.tsx
    StepExperience.tsx
    StepCurrentFrequency.tsx
    StepRealisticDays.tsx
    StepWorkoutLength.tsx
    StepEquipment.tsx
    StepFocusMuscles.tsx
    StepInjuries.tsx
    StepFitnessLevel.tsx
    StepBarriers.tsx
    StepMotivation.tsx
    StepWorkoutStyle.tsx
    StepGenerating.tsx
src/components/results/
  ResultsSummaryCard.tsx
  GoalForecastCards.tsx
  WeekOnePlanCard.tsx
  ExercisePlanRow.tsx         # name, muscle, sets/reps, View Form, Swap, Add to My Lift
  AddEntireProgramButton.tsx
```

### Scoring & program generation (deterministic now, AI-ready later)
- `generateOnboardingResults(profile)` → `{ experienceLevel, consistencyScore, recommendedSplit, realisticGoalForecast: { thirtyDays, ninetyDays, sixMonths }, firstWeekTarget }` using rules from the spec.
- `generateWeekOnePlan(profile, results)` → `Program` object matching the spec schema. Splits handled: Full Body 1x/2x/3x, PPL, Upper/Lower, PPL+UL. Exercise pool chosen from existing `src/data/exercises.ts` filtered by equipment + injury flags. Sets/reps tuned by goal (muscle 3-4×8-12, strength 3-5×3-6 main + accessory, fat loss 2-4×10-15). Beginner bias toward Bodyweight/Dumbbells/Machines.
- Each exercise row links to `/exercises/$slug` for "View Form" and supports in-place "Swap" (picks next exercise from the same muscle/equipment pool) and "Add to My Lift" (uses existing `today-lift` helper).

### Results page
1. Header + subtext
2. Starting Profile card (goal, experience, split, days/wk, length, equipment chips, focus muscle chips)
3. 3 Goal Forecast cards (30 / 90 / 6mo) — copy per primary goal
4. "Your first target: complete X workouts this week"
5. Week 1 Plan — collapsible day cards with `ExercisePlanRow`s
6. Big CTA `Add Entire Program To My Lift` → saves program, sets `onboardingComplete=true`, toasts, routes to `/my-lift`
7. Secondary `Adjust My Answers` → back to `/onboarding?step=1`
8. Small medical disclaimer

### My Lift page
- Reads `gym-lift-program` from localStorage.
- Renders day-tabbed view: Start Workout, Mark Complete (per exercise, persisted), Swap, View Form, Edit sets/reps inline.
- Empty state with "Start Onboarding" link if no program.

### Dashboard tweaks
- New top section with: current goal pill, this week's target (X workouts), Week 1 progress bar (completed/total), buttons "Open My Lift" → `/my-lift`, "Ask AI Coach" → existing `/coach`.

### Visual design
- Reuse existing tokens in `src/styles.css` (dark default, lime accent). Rounded cards (`rounded-2xl`), strong contrast, subtle gradient on the progress bar fill and on the big CTA. One-question-per-screen layout centered, max-w-md on mobile, max-w-lg on desktop.
- Tasteful emojis only on Welcome and goal cards.
- Brand microcopy strings ("Train smarter.", "Start realistic.", etc.) used as section eyebrows.

### Safety
- Disclaimer block at bottom of results.
- Language: "estimated", "recommended starting point", "based on your answers".

### Out of scope (deferred)
- Supabase persistence (structure ready; current persistence is localStorage). I'll note where to swap in a `createServerFn` save call.
- Real AI generation (logic is deterministic, labelled "personalized plan").

Ready to build — shall I proceed?
