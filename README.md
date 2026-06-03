# Trainr

**Fitness creator platform** — build communities, sell programs, and keep members accountable through gamified workout tracking.

---

## What is Trainr?

Trainr connects fitness creators with their communities. Creators publish structured workout programs, members track every session, and a gamified accountability layer keeps everyone consistent.

**Core features (planned):**
- Workout tracker — log sets, reps, and weight with full session history
- Workout plan builder — creators design multi-week programs
- Creator profiles & storefronts — sell programs directly to subscribers
- Member communities — per-creator community feeds and challenges
- Gamified accountability — XP, streaks, badges, leaderboards
- AI training recommendations — coach chatbot powered by creator knowledge
- Admin dashboard — platform-level moderation, analytics, and payouts

**Platform targets:**
- Web app (current)
- Android & iOS (future — likely Expo React Native or Capacitor wrapper)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (SSR React on Vite) |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database & Auth | Supabase (PostgreSQL + Supabase Auth) |
| Server Runtime | Nitro (Cloudflare target) |
| Package Manager | Bun |
| Data Fetching | TanStack Query |
| Animations | Framer Motion |
| 3D / Interactive | Three.js + Spline |
| Forms | React Hook Form + Zod |
| Charts | Recharts |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.0
- A [Supabase](https://supabase.com) project (free tier works)

### Install

```bash
bun install
```

### Environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Open `.env` and set:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
VITE_SUPABASE_PROJECT_ID=your-project-ref
```

> **Never commit `.env`** — it is in `.gitignore`. Use `.env.example` for sharing variable names with the team.

### Run locally

```bash
bun run dev
```

### Build

```bash
bun run build
```

### Lint

```bash
bun run lint
```

### Format

```bash
bun run format
```

---

## Database

Trainr uses Supabase (PostgreSQL). Migrations live in `supabase/migrations/`.

Current schema includes:
- `profiles` — user profiles (auto-created on signup)
- `exercises` — exercise library with slugs, difficulty, muscle targets
- `muscles` — muscle group reference data
- `exercise_muscles` — many-to-many join with primary/secondary role
- `workout_sessions` — individual workout sessions per user
- `workout_exercises` — exercises logged within a session (with sets/reps JSON)
- `workout_plans` — named workout plans created by users/creators
- `saved_exercises` — user's bookmarked exercises
- `ai_questions` — Q&A with the AI coach

To apply migrations to your local Supabase instance:

```bash
supabase db push
```

---

## Project Structure

```
src/
├── assets/          # Static images (coaches, muscle maps, logo)
├── components/
│   ├── admin/       # Admin dashboard sections
│   ├── coaches/     # Coach cards and program cards
│   ├── creator/     # Creator dashboard sections
│   ├── gym/         # Interactive muscle map (2D + 3D)
│   └── ui/          # shadcn/ui primitive components
├── data/            # Static exercise seed data
├── hooks/           # Shared React hooks
├── integrations/
│   └── supabase/    # Supabase client, auth middleware, generated types
├── lib/
│   ├── admin/       # Admin mock data (to be replaced with real queries)
│   ├── coaches/     # Coach mock data (to be replaced with DB)
│   ├── creator/     # Creator mock data (to be replaced with DB)
│   └── onboarding/  # Onboarding flow state & scoring
└── routes/          # TanStack Router file-based pages (25 routes)
```

---

## Current Status

| Feature | Status |
|---|---|
| Homepage / landing | Done (UI) |
| Auth (Supabase) | Functional |
| User dashboard | Functional (reads from DB) |
| Workout tracker | Functional (reads/writes DB) |
| Exercise library | UI with static data |
| Muscle map (2D + 3D) | UI only |
| Coach profiles | UI only (mock data) |
| Creator dashboard | UI only (mock data) |
| Admin dashboard | UI only (mock data) |
| Payments | Not started |
| Gamification | Not started |
| Community feeds | Not started |
| AI coach | Not started |
| Mobile app | Not started |

---

## Development Roadmap

See `ROADMAP.md` for the full prioritized task list.

**Next milestones:**
1. Replace hardcoded admin email with a DB-backed `is_admin` flag on profiles
2. Wire coach profiles to real Supabase rows (migrate mock data → DB)
3. Workout plan builder — create, edit, and assign plans to members
4. Creator onboarding flow — apply to become a creator, basic profile
5. Payments integration (Stripe) — creator subscriptions and one-time program purchases
6. Gamification foundation — XP, streaks, and basic badges

---

## Mobile App Strategy

Trainr is built as a web app first. When ready for mobile:

- **Option A (recommended short-term):** Capacitor — wraps the existing web app as a native shell. Low effort, shares all existing code.
- **Option B (recommended long-term):** Expo React Native — a dedicated mobile app sharing business logic with the web app via a monorepo.

The current repo is structured to support either path.

---

## Environment & Deployment

Trainr uses **Nitro** as the server runtime, targeting **Cloudflare Workers** by default (configured in `vite.config.ts` via `@lovable.dev/vite-tanstack-config`).

The project was originally scaffolded with [Lovable](https://lovable.dev).

---

## Contributing

1. Branch from `main`
2. Follow the existing file structure and naming conventions
3. Run `bun run lint` and `bun run build` before pushing
4. Never commit `.env` or any file containing real credentials
