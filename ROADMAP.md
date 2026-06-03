# Trainr — Development Roadmap

Last updated: 2026-06-03

> This document tracks what is built, what is mock, and what needs to be built next.
> Tasks are ordered by dependency and business value.

---

## Current Repo State

### What is functional (reads/writes real Supabase data)
- Supabase Auth — sign up, sign in, sign out, session persistence
- User dashboard (`/dashboard`) — reads workout session stats and saved exercises
- Workout tracker (`/tracker`) — creates workout sessions, logs exercises with sets/reps, saves to DB
- Auth-gated routes — redirect to `/auth` if not signed in

### What is UI-only / mock data
- Homepage (`/`) — landing page, all content is static
- Coach profiles (`/coaches`, `/coaches/:slug`, `/coaches/:slug/programs/:slug`) — 100% hardcoded mock data in `src/lib/coaches/data.ts`
- Creator dashboard (`/creator-dashboard`) — 100% mock data from `src/lib/creator/mock-data.ts`
- Admin dashboard (`/admin`) — 100% mock data from `src/lib/admin/mock-data.ts`
- Exercise library (`/exercises`, `/exercises/:slug`) — reads from static `src/data/exercises.ts`, not DB
- Muscle map (`/muscles`, `/muscles/:slug`) — static UI with 2D/3D visualization
- Onboarding flow (`/onboarding`) — stores results in `localStorage` only
- Pricing page (`/pricing`) — static UI, no Stripe integration
- Become a coach (`/become-a-coach`) — static landing, no form submission
- My Lift (`/my-lift`) — unclear status; needs audit

---

## Task List

---

### 1. Immediate Repo Safety

| # | Task | Why | Files | Difficulty | Status |
|---|---|---|---|---|---|
| S1 | Remove `.env` from git tracking | Prevents credentials from being pushed to GitHub | `.gitignore`, `git rm --cached` | Low | **Done** |
| S2 | Update `.gitignore` for full coverage | Cover mobile build artifacts, Expo, Capacitor, iOS/Android | `.gitignore` | Low | **Done** |
| S3 | Create `.env.example` | Documents required env vars for new devs | `.env.example` | Low | **Done** |
| S4 | Write README | Project entry point for any collaborator or hiring | `README.md` | Low | **Done** |
| S5 | Move admin email list to DB or env var | `ADMIN_EMAILS` hardcoded in source code is fragile | `src/lib/auth-context.tsx` | Low | Next |

---

### 2. MVP Foundation

| # | Task | Why | Files | Difficulty | Order |
|---|---|---|---|---|---|
| F1 | Add `is_creator` + `is_admin` flags to `profiles` table | Auth checks need DB source of truth, not hardcoded emails | `supabase/migrations/`, `src/lib/auth-context.tsx` | Low | 1 |
| F2 | Update `AuthContext` to read flags from `profiles` | Remove hardcoded admin email logic | `src/lib/auth-context.tsx`, `src/integrations/supabase/types.ts` | Low | 2 |
| F3 | Seed exercise library to Supabase | Move `src/data/exercises.ts` static data into the DB | `supabase/migrations/` (seed), `src/routes/exercises.*` | Medium | 3 |
| F4 | Wire exercises routes to Supabase queries | Replace static data with real DB reads | `src/routes/exercises.index.tsx`, `src/routes/exercises.$slug.tsx` | Medium | 4 |
| F5 | Seed muscle data to Supabase | Muscle groups are referenced in DB schema but not populated | `supabase/migrations/` (seed) | Low | 3 |
| F6 | Wire muscles routes to Supabase queries | Replace static data with real DB reads | `src/routes/muscles.index.tsx`, `src/routes/muscles.$slug.tsx` | Low | 5 |

---

### 3. Core Web App Functionality

| # | Task | Why | Files | Difficulty | Dependencies |
|---|---|---|---|---|---|
| W1 | Workout plan builder | Users can create and save named programs | `src/routes/` (new), `supabase/migrations/` | Medium | F3 |
| W2 | Assign plan to a session | Tracker can select from user's plans | `src/routes/tracker.tsx` | Low | W1 |
| W3 | Personal records tracking | Store and display PRs per exercise | `supabase/migrations/`, `src/routes/dashboard.tsx` | Medium | F3 |
| W4 | Workout history calendar view | Visual training history on dashboard | `src/routes/dashboard.tsx` | Medium | — |
| W5 | Exercise search + filter | Filter by muscle, difficulty, equipment | `src/routes/exercises.index.tsx` | Low | F3 |
| W6 | Save/unsave exercises | Already has DB table — just needs UI wiring | `src/routes/exercises.$slug.tsx`, `src/routes/dashboard.tsx` | Low | F3 |
| W7 | Onboarding → real profile save | Currently saves to localStorage only | `src/routes/onboarding.*`, `supabase/migrations/` | Medium | F1 |
| W8 | User profile page | View/edit display name, avatar, stats | New route, `src/integrations/supabase/` | Medium | F1 |

---

### 4. Creator Functionality

| # | Task | Why | Files | Difficulty | Dependencies |
|---|---|---|---|---|---|
| C1 | Creator application flow | Replace static `/become-a-coach` with a real submission form | `src/routes/become-a-coach.tsx`, `supabase/migrations/` | Medium | F1 |
| C2 | Creator profile DB schema | Add `creator_profiles` table (bio, banner, slug, approved) | `supabase/migrations/` | Low | F1 |
| C3 | Wire coach list/profile to DB | Replace all mock data in `src/lib/coaches/data.ts` | `src/routes/coaches.*`, `src/lib/coaches/` | High | C2 |
| C4 | Creator program builder | Full UI for creating a multi-week program with exercises | New route, `supabase/migrations/` | High | C2, W1 |
| C5 | Creator dashboard real data | Replace mock data with Supabase queries | `src/routes/creator-dashboard.tsx`, `src/lib/creator/` | High | C2, C4 |
| C6 | Creator content library | Upload PDFs, images, videos for programs | Supabase Storage integration | High | C2 |
| C7 | Program publish/draft flow | Creators can draft, preview, and publish programs | `src/routes/creator-dashboard.tsx` | Medium | C4 |

---

### 5. Member Functionality

| # | Task | Why | Files | Difficulty | Dependencies |
|---|---|---|---|---|---|
| M1 | Subscribe to a creator | The core fan→member relationship | `supabase/migrations/`, new route | Medium | C2 |
| M2 | Enrolled programs list | Members see their active programs | `src/routes/dashboard.tsx` | Medium | M1 |
| M3 | Follow a program in tracker | Tracker pulls today's session from an enrolled plan | `src/routes/tracker.tsx` | High | M2, W1 |
| M4 | Member profile page | Public facing stats and programs | New route | Medium | W8 |

---

### 6. Gamification

| # | Task | Why | Files | Difficulty | Dependencies |
|---|---|---|---|---|---|
| G1 | XP system — earn on workout completion | Core engagement loop | `supabase/migrations/`, `src/lib/` | Medium | W1 |
| G2 | Streak tracking | Count consecutive training days | `supabase/migrations/`, `src/routes/dashboard.tsx` | Low | G1 |
| G3 | Badge system | Milestone badges (first workout, 30-day streak, etc.) | `supabase/migrations/`, UI | Medium | G1, G2 |
| G4 | Creator challenges | Creators run time-limited challenges with XP prizes | `supabase/migrations/`, new routes | High | C2, G1 |
| G5 | Leaderboards | Per-creator and platform-wide rankings | New route, `supabase/` | Medium | G1 |

---

### 7. Payments & Subscriptions

| # | Task | Why | Files | Difficulty | Dependencies |
|---|---|---|---|---|---|
| P1 | Stripe integration setup | Accept payments for programs and subscriptions | `supabase/`, new server functions | High | C2 |
| P2 | One-time program purchase | Buy a creator program | `src/routes/coaches.$slug.programs.$slug.tsx` | High | P1, C4 |
| P3 | Creator subscription (monthly) | Subscribe to a creator for ongoing content | New routes | High | P1, M1 |
| P4 | Payout to creators | 70/30 split — automated or manual payout logic | Supabase functions + Stripe Connect | High | P1, P2, P3 |
| P5 | Pricing page wired to Stripe | Real checkout from `/pricing` | `src/routes/pricing.tsx` | Medium | P1 |
| P6 | Billing portal | Members manage subscriptions | New route | Medium | P3 |

---

### 8. Community Features

| # | Task | Why | Files | Difficulty | Dependencies |
|---|---|---|---|---|---|
| CM1 | Creator community feed | Post/comment wall per creator community | `supabase/migrations/`, new routes | High | C2, M1 |
| CM2 | Post creation and likes | Members post text/images, react with likes | New routes + Supabase Realtime | High | CM1 |
| CM3 | Comment threads | Nested comment replies | `supabase/migrations/`, UI | High | CM1 |
| CM4 | Community notifications | Alert when someone replies or likes | Supabase Realtime / Push | High | CM1 |
| CM5 | Content moderation tools | Admin can hide/remove flagged content | `src/components/admin/`, `supabase/` | Medium | CM1 |

---

### 9. AI Coach (Later)

| # | Task | Why | Files | Difficulty | Dependencies |
|---|---|---|---|---|---|
| AI1 | AI coach chat UI | Basic Q&A interface per creator | New route | Medium | C2 |
| AI2 | Knowledge base upload | Creators upload docs to train their coach | C6, Supabase Storage | High | C6 |
| AI3 | Claude API integration | Power chat with Anthropic API + creator docs | New server functions | High | AI1, AI2 |
| AI4 | AI coach gating | AI coach only for premium subscribers | P3, AI1 | Medium | AI1, P3 |

---

### 10. Admin & Internal Tools

| # | Task | Why | Files | Difficulty | Dependencies |
|---|---|---|---|---|---|
| A1 | Admin gate via DB flag | Replace hardcoded email with DB `is_admin` flag | `src/lib/auth-context.tsx`, `supabase/` | Low | F1 |
| A2 | Creator application review | Admin approves/rejects creator applications | `src/components/admin/`, Supabase | Medium | C1 |
| A3 | Real platform analytics | Replace mock KPIs with real Supabase aggregations | `src/routes/admin.tsx`, Supabase views | High | Everything |
| A4 | Content moderation queue | Real reports and moderation actions | `src/components/admin/`, Supabase | High | CM1 |
| A5 | Stripe dashboard in admin | Real payment data via Stripe API | `src/routes/admin.tsx` | Medium | P1 |

---

### 11. Mobile App Preparation

| # | Task | Why | Files | Difficulty | Dependencies |
|---|---|---|---|---|---|
| MOB1 | Responsive audit — all routes | Ensure every page works on 375px viewport | All routes | Medium | — |
| MOB2 | PWA manifest + service worker | Installable on mobile as PWA | `public/`, `vite.config.ts` | Low | — |
| MOB3 | Capacitor scaffold (web-wrapper path) | Wrap web app as native app with minimal effort | New `capacitor.config.ts`, `android/`, `ios/` | Medium | MOB1 |
| MOB4 | Expo scaffold (native path) | New dedicated React Native app sharing Supabase + business logic | New `apps/mobile/` in monorepo | High | — |
| MOB5 | Push notifications | Workout reminders, challenge updates | Supabase + FCM/APNs | High | MOB3 or MOB4 |

---

## First 10 Tasks to Build Now

In priority order — these make the app real:

1. **S5** — Move admin email to env var (10 min, pure safety)
2. **F1** — Add `is_creator` + `is_admin` to profiles migration
3. **F2** — Update AuthContext to read flags from DB
4. **F3 + F5** — Seed exercises and muscles to Supabase (run existing static data through a migration)
5. **F4 + F6** — Wire exercise and muscle routes to DB queries
6. **W7** — Save onboarding results to user profile in DB
7. **W8** — User profile page (view + edit)
8. **C1** — Creator application form (real submission)
9. **C2** — `creator_profiles` DB table + schema
10. **W3** — Personal records tracking on dashboard

---

## Risks & Open Questions

- **Coach photos are real public figures' images** (`src/assets/coaches/`) — these are for prototype/demo only. Must be replaced with licensed images or creator-uploaded photos before any public launch.
- **Hardcoded `ADMIN_EMAILS`** in `src/lib/auth-context.tsx` — fragile, must be replaced before any team collaboration.
- **`src/data/exercises.ts`** is a static file, not seeded to DB — exercises routes won't work unless that data is migrated.
- **Onboarding saves to localStorage** — data is lost if user clears storage or switches device.
- **No RLS policies visible** in current migrations — Supabase Row-Level Security should be audited before any creator or payment data goes live.
- **No email transactional setup** — Supabase handles auth emails by default, but custom transactional email (Resend or Postmark) will be needed for notifications.
- **`supabase/config.toml`** contains the project ID — not a secret, but worth being intentional about what gets committed.
- **`@lovable.dev/vite-tanstack-config`** is a Lovable-platform build abstraction — if moving off Lovable, this dependency needs to be unwrapped.
