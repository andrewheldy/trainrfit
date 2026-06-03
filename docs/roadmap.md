# Trainr — Product Roadmap

> Organised by build phase. Each phase unlocks the next.
> Tasks marked **[DB]** require a Supabase migration. Tasks marked **[UI]** are frontend-only.
> Current date: 2026-06-03

---

## Phase 1 — Foundation

*Goal: replace all hardcoded auth logic and config with a real DB source of truth. Nothing else is safe to build on top of until this is done.*

| ID | Task | Difficulty | Status |
|---|---|---|---|
| trainrfit-001 | Add `is_creator` + `is_admin` flags to `profiles` table **[DB]** | Low | Todo |

**What this unlocks:** Every role-gated route, the creator application flow, and the admin dashboard approval queue all depend on this.

**Why it can't wait:** The current codebase has an admin email hardcoded in source via an env var fallback. Adding a new admin or creator currently requires a code change and redeploy.

---

## Phase 2 — Workout Database

*Goal: get real data into the exercise and muscle tables so the workout tracker and exercise library read from Supabase, not static TypeScript files.*

| ID | Task | Difficulty | Status | Depends On |
|---|---|---|---|---|
| trainrfit-002 | Seed exercise library to Supabase **[DB]** | Medium | Todo | — |
| trainrfit-003 | Seed muscle groups to Supabase **[DB]** | Low | Todo | — |
| trainrfit-004 | Wire exercise and muscle routes to Supabase queries **[UI]** | Medium | Todo | 002, 003 |

**What this unlocks:** Filterable exercise library, muscle-group linking in the tracker, personal records tracking, and eventually AI training recommendations.

**Key detail:** `src/data/exercises.ts` is the source to migrate from. The DB table schema already matches the data shape — this is primarily a seed migration and a route refactor.

---

## Phase 3 — Member Features

*Goal: make the app genuinely useful for a logged-in user — their data persists, their profile exists, and their progress is visible.*

| ID | Task | Difficulty | Status | Depends On |
|---|---|---|---|---|
| trainrfit-005 | Save onboarding results to user profile in Supabase **[DB + UI]** | Medium | Todo | 001 |
| trainrfit-006 | User profile page — view and edit **[UI]** | Medium | Todo | 001 |
| trainrfit-010 | Personal records tracking on dashboard **[DB + UI]** | Medium | Todo | 002, 004 |

**What this unlocks:** Personalised dashboard, onboarding-informed workout suggestions, and the foundation for gamification (PRs trigger XP and badges).

**Key detail:** Onboarding currently writes to `localStorage` only. A user who logs in from a new device has no goal preferences saved anywhere.

---

## Phase 4 — Creator Features

*Goal: give real creators a presence on the platform — apply, get approved, have a real profile, and publish real programs.*

| ID | Task | Difficulty | Status | Depends On |
|---|---|---|---|---|
| trainrfit-007 | Creator application form with real DB submission **[DB + UI]** | Medium | Todo | 001 |
| trainrfit-008 | `creator_profiles` DB table and schema **[DB]** | Low | Todo | 001 |
| trainrfit-009 | Wire coach listing and profiles to Supabase **[UI]** | High | Todo | 008 |

**What this unlocks:** The entire coach/creator section of the app becomes real. Mock data is retired. The creator dashboard, program builder, and community features all depend on `creator_profiles`.

**Key detail:** `src/lib/coaches/data.ts` contains 437 lines of hardcoded data using real fitness influencer personas (Jeff Nippard, Chris Bumstead, etc.) as placeholders. This must be replaced before any public launch.

---

## Phase 5 — Community Features

*These tasks are not yet in the first-10 sprint but are the next logical layer after creators exist.*

- Community feed per creator (posts, likes, comments)
- Member subscription to a creator
- Challenge creation and participation
- Supabase Realtime for live notifications

**Prerequisite:** `creator_profiles` table (trainrfit-008) must exist.

---

## Phase 6 — Payments

*No payment tasks are in the first sprint — they require creators and programs to exist first.*

- Stripe + Stripe Connect integration
- One-time program purchase
- Monthly creator subscription
- Creator payout automation (70/30 split)
- Billing portal for members

**Prerequisite:** `creator_profiles` and creator programs must exist. Stripe Connect requires creator identity verification.

---

## Phase 7 — Mobile Preparation

*These are parallel-track tasks that can start any time but are not blocking.*

- Responsive audit across all 25 routes (target: 375px minimum)
- PWA manifest + service worker (installable as home screen app)
- Capacitor scaffold for native iOS/Android wrapper
- Push notification integration (workout reminders, challenge updates)

**Note:** The `.gitignore` already covers Expo, Capacitor, iOS, and Android build artifacts.

---

## Phase 8 — AI Coach

*Longest lead time — depends on creators having knowledge bases and the chat infrastructure being in place.*

- AI coach chat UI per creator
- Creator knowledge base upload (PDFs, docs, voice samples)
- Claude API integration with per-creator system prompts
- AI coach gating (premium subscribers only)
- Response moderation and flagging

**Prerequisite:** Creator profiles, Supabase Storage for knowledge docs, and Stripe for premium gating.

---

## Schema Additions Required (in order)

```
Phase 1:  profiles          — add is_admin, is_creator columns
Phase 2:  exercises         — seed data migration
          muscles           — seed data migration
          exercise_muscles  — seed join table rows
Phase 3:  profiles          — add onboarding columns (fitness_goal, experience_level, days_per_week)
          personal_records  — new table
Phase 4:  creator_applications — new table
          creator_profiles     — new table
Phase 5:  subscriptions        — new table
          community_posts      — new table
          community_comments   — new table
Phase 6:  stripe_customers     — new table
          creator_programs     — new table (or extend workout_plans)
          purchases            — new table
Phase 8:  ai_coach_profiles    — new table
          knowledge_documents  — new table
```

---

## Current Status Summary

| Phase | Status |
|---|---|
| Auth (Supabase) | Done ✓ |
| Workout tracker (write to DB) | Done ✓ |
| User dashboard (read from DB) | Done ✓ |
| Foundation (DB role flags) | **Not started** |
| Workout database (seed + wire) | **Not started** |
| Member features | **Not started** |
| Creator features | **Not started** |
| Community | **Not started** |
| Payments | **Not started** |
| Mobile | **Not started** |
| AI Coach | **Not started** |
