# trainr Rebuild V2 — Plan

Transforming the existing Gym Lift app into **trainr** — a dark, modern, technology-first fitness OS. The existing routes (exercises, muscles, tracker, coaches, dashboard, AI coach, onboarding, admin, creator dashboard) stay functional; we re-skin and re-message them under the new brand, and rebuild the home page from scratch around the new narrative.

## 1. Brand & design tokens (`src/styles.css`, nav, footer, meta)
- Rename product to **trainr** (all lowercase) across nav, footer, page titles, og tags, theme-provider storage key.
- New color system, dark-mode first:
  - Background: deep navy `#0B1220` (oklch equivalent), surface `#111A2C`, elevated `#172238`.
  - Foreground: white `#FFFFFF`, muted `#8A95A8`.
  - Primary / accent: neon green `#B6FF3C` (keep `--lime` token name internally so existing components keep working; just retune the value to neon green on navy).
  - Border: subtle white at 6%.
- Logo lockup component: `trainr` wordmark, white letters with the final `r` in neon green, used in `SiteNav` and `SiteFooter`. Pure SVG/text — no dumbbell/flame iconography.
- Light theme stays available but is de-emphasized (defaults to dark).

## 2. New home page (`src/routes/index.tsx`)
Rebuilt section-by-section around the brief:
1. **Hero** — "Everything You Need To Train Better." + subhead, CTAs `Start Training Free` → `/auth`, `Explore Programs` → `/coaches`. Visual: stylized iPhone mockup composed in CSS/SVG showing tracker / program / feed / leaderboard tiles (no third-party image — keeps it on-brand and fast).
2. **Trust strip** — stat cards: workouts logged, programs created, coaches, active challenges.
3. **Core features grid** — Workout Tracking, Program Builder, Exercise Library (links to existing muscle map / exercises), Progress Tracking. Each is a large card with eyebrow + headline + bullet list + link into the existing route.
4. **Community** — "Training Is Better Together." with sample activity-feed cards (Andrew / Sarah / Mike examples from the brief).
5. **Challenges** — horizontal cards: 30-Day Shred, 100 Pushups, Summer Strength, Community Challenges, with XP / Badges / Streaks / Rankings chips.
6. **AI Coach** — "Personalized Guidance Powered By AI", links to `/coach`.
7. **Creator platform** — "Turn Fitness Into A Business", links to `/become-a-coach` and `/creator-dashboard`.
8. **Future vision** — roadmap cards (Creator Subscriptions, Premium Coaching, Brand Partnerships, Creator Marketplaces, White-Labeled Supplements, Creator Storefronts, Merchandise) marked as "Coming".
9. **Mobile app** — multi-screen phone mockups (Tracker, Program Builder, Body Map, Community Feed, AI Coach, Creator Profile, Leaderboards), CSS-composed.
10. **Final CTA** — "Track Better. Train Smarter." with `Start Training Free` and `Become A Creator`.

The featured exercises grid + muscle map stay reachable via the Exercise Library card and the existing `/exercises` and `/muscles` routes, so we don't lose the existing DB-backed content — we just stop dumping it on the landing page.

## 3. Light touch-ups on supporting pages
- `SiteNav` and `SiteFooter`: new wordmark, updated link labels (`Programs`, `Library`, `Community`, `Coach`, `Creators`, `Pricing`).
- `__root.tsx` head: default title/description/og to trainr.
- `pricing.tsx` and `onboarding.premium.tsx`: copy swap to "trainr Pro".
- `coach.tsx` (AI coach page): headline swap to match "Personalized Guidance Powered By AI" — content/logic untouched.
- Other routes (exercises, muscles, tracker, dashboard, coaches, admin, creator-dashboard): no structural change — they pick up the new tokens automatically.

## 4. Out of scope (call out)
- No database changes.
- No new features — community feed, challenges, AI coach upgrades are presented as marketing on the home page; they link into existing routes or to `/coaches` as the nearest live surface.
- No real iPhone photos — phone mockups are CSS/SVG compositions so they stay crisp, fast, and on-brand.
- Logo: brief says "use the supplied trainr logo" but no asset was attached. I'll ship a clean CSS wordmark now; drop a PNG/SVG later and I'll swap it in.

## Technical notes
- Tokens live in `src/styles.css` under `:root` / `.dark` — retuning `--background`, `--foreground`, `--surface`, `--elevated`, `--lime`, `--primary`, `--border`, `--ring`. Light theme gets matching values.
- Home page is built with semantic tokens only (`bg-background`, `text-foreground`, `bg-surface`, `text-lime`) — no raw hex in components, per design-system rules.
- All section anchors are real, top-level pieces of the home route (no separate routes added — these are marketing sections, not standalone pages).
- SEO: home `<title>` becomes "trainr — Everything You Need To Train Better", meta description updated, og tags refreshed.
