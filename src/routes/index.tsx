import { createFileRoute, Link } from "@tanstack/react-router";
import { RotatingWord } from "@/components/rotating-word";
import {
  ArrowRight,
  Activity,
  LayoutGrid,
  Users,
  Trophy,
  Sparkles,
  Briefcase,
  Dumbbell,
  Flame,
  TrendingUp,
  Heart,
  MessageCircle,
  Check,
  Crown,
  Store,
  Package,
  Handshake,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "trainr — Everything You Need To Train Better" },
      {
        name: "description",
        content:
          "Track workouts, build programs, follow coaches, join challenges, and grow with a fitness community that keeps you accountable.",
      },
      { property: "og:title", content: "trainr — Everything You Need To Train Better" },
      {
        property: "og:description",
        content:
          "The operating system for fitness. Strava + Hevy + Discord, built for athletes and creators.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="bg-background">
      <Hero />
      <TrustStrip />
      <CoreFeatures />
      <CommunitySection />
      <ChallengesSection />
      <AICoachSection />
      <CreatorSection />
      <FutureVisionSection />
      <MobileAppSection />
      <FinalCTA />
    </div>
  );
}

/* -------------------- Hero -------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-lime/10 blur-[120px]" />
        <div className="absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-lime/5 blur-[100px]" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-24 lg:pt-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            The operating system for fitness
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Everything You Need
            <br />
            To <span className="text-lime">Train Better.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Track workouts, build programs, follow coaches, join challenges, and grow with a fitness community that keeps you accountable.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-lime px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start Training Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/coaches"
              className="inline-flex items-center justify-center rounded-md border border-border bg-surface/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
            >
              Explore Programs
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-lime" /> Free to start</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-lime" /> No card required</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-lime" /> iOS & web</span>
          </div>
        </div>

        <PhoneShowcase />
      </div>
    </section>
  );
}

/* -------------------- Phone mockups -------------------- */

function PhoneFrame({ children, className = "", tilt = 0 }: { children: React.ReactNode; className?: string; tilt?: number }) {
  return (
    <div
      className={`relative mx-auto h-[520px] w-[260px] rounded-[40px] border border-border bg-elevated p-2 shadow-2xl ${className}`}
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
    >
      <div className="absolute left-1/2 top-2.5 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-background" />
      <div className="h-full w-full overflow-hidden rounded-[32px] bg-background">
        {children}
      </div>
    </div>
  );
}

function PhoneShowcase() {
  return (
    <div className="relative h-[560px]">
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        <PhoneFrame>
          <TrackerScreen />
        </PhoneFrame>
      </div>
      <div className="absolute -right-6 top-20 hidden sm:block">
        <PhoneFrame tilt={6} className="scale-90">
          <FeedScreen />
        </PhoneFrame>
      </div>
      <div className="absolute -left-6 top-20 hidden sm:block">
        <PhoneFrame tilt={-6} className="scale-90">
          <LeaderboardScreen />
        </PhoneFrame>
      </div>
    </div>
  );
}

function TrackerScreen() {
  return (
    <div className="flex h-full flex-col p-4 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Today</div>
          <div className="font-display text-lg font-bold text-foreground">Push Day</div>
        </div>
        <div className="rounded-full bg-lime/15 px-2 py-1 text-[10px] font-semibold text-lime">42 min</div>
      </div>
      <div className="mt-4 space-y-2">
        {[
          { name: "Bench Press", sets: "4 × 8", weight: "185 lb", done: true },
          { name: "Overhead Press", sets: "4 × 6", weight: "115 lb", done: true },
          { name: "Incline DB Press", sets: "3 × 10", weight: "65 lb", done: false },
          { name: "Cable Fly", sets: "3 × 12", weight: "30 lb", done: false },
        ].map((ex) => (
          <div key={ex.name} className="rounded-lg border border-border bg-surface p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-foreground">{ex.name}</div>
              {ex.done && <Check className="h-3 w-3 text-lime" />}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>{ex.sets}</span>
              <span className="font-mono">{ex.weight}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto rounded-lg bg-lime p-3 text-center text-xs font-bold text-primary-foreground">
        Log Set
      </div>
    </div>
  );
}

function FeedScreen() {
  return (
    <div className="flex h-full flex-col p-4 pt-8">
      <div className="font-display text-lg font-bold">Feed</div>
      <div className="mt-3 space-y-3">
        {[
          { who: "Andrew", what: "completed Push Day", icon: Dumbbell },
          { who: "Sarah", what: "hit a new Bench PR", icon: Trophy },
          { who: "Mike", what: "finished Week 6 of Shred", icon: Flame },
        ].map((p) => (
          <div key={p.who} className="rounded-lg border border-border bg-surface p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-lime/15 text-[10px] font-bold text-lime">
                {p.who[0]}
              </div>
              <div className="text-[11px] text-foreground">
                <span className="font-semibold">{p.who}</span>{" "}
                <span className="text-muted-foreground">{p.what}</span>
              </div>
            </div>
            <div className="mt-2 flex gap-3 text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-0.5"><Heart className="h-2.5 w-2.5" /> 12</span>
              <span className="inline-flex items-center gap-0.5"><MessageCircle className="h-2.5 w-2.5" /> 3</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardScreen() {
  return (
    <div className="flex h-full flex-col p-4 pt-8">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Challenge</div>
      <div className="font-display text-base font-bold">30-Day Shred</div>
      <div className="mt-3 space-y-2">
        {[
          { rank: 1, name: "Mike R.", xp: 2840 },
          { rank: 2, name: "Sarah L.", xp: 2710 },
          { rank: 3, name: "You", xp: 2540, you: true },
          { rank: 4, name: "Andrew", xp: 2310 },
          { rank: 5, name: "Jess", xp: 2200 },
        ].map((p) => (
          <div
            key={p.rank}
            className={`flex items-center justify-between rounded-lg border p-2.5 ${p.you ? "border-lime/40 bg-lime/10" : "border-border bg-surface"}`}
          >
            <div className="flex items-center gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${p.rank <= 3 ? "bg-lime/20 text-lime" : "bg-elevated text-muted-foreground"}`}>
                {p.rank}
              </div>
              <span className="text-xs font-semibold text-foreground">{p.name}</span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">{p.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Trust strip -------------------- */

function TrustStrip() {
  const stats = [
    { value: "120K+", label: "Workouts logged" },
    { value: "850+", label: "Programs created" },
    { value: "240+", label: "Coaches onboard" },
    { value: "30+", label: "Active challenges" },
  ];
  return (
    <section className="border-b border-border bg-surface/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-12 sm:px-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="px-2 py-2 text-center md:text-left">
            <div className="font-display text-4xl font-bold text-foreground sm:text-5xl">{s.value}</div>
            <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------- Core features -------------------- */

function CoreFeatures() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeader
          eyebrow="Core"
          title="One app for the whole lift."
          subtitle="Built around the things athletes actually do: log sets, follow a plan, learn the movement, watch the progress."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={Activity}
            eyebrow="Workout Tracking"
            title="Fast logging. Built for the gym floor."
            body="Track sets, reps, weight, PRs, volume, and streaks. Simple enough to replace Hevy — and it lives where the rest of your training does."
            bullets={["1-tap set logging", "Auto PR detection", "Volume + streak tracking"]}
            href="/tracker"
            cta="Open Tracker"
          />
          <FeatureCard
            icon={LayoutGrid}
            eyebrow="Program Builder"
            title="Build any split you can train."
            body="PPL, Upper/Lower, bodybuilding, powerlifting, weight loss, hybrid. Save, share, duplicate, and publish your plans."
            bullets={["Drag-and-drop weeks", "Templates for every goal", "One-click publish"]}
            href="/coaches"
            cta="See Programs"
          />
          <FeatureCard
            icon={Sparkles}
            eyebrow="Exercise Library"
            title="An interactive body map."
            body="Click a muscle to discover exercises, form guides, videos, and programs. Front and back views, fully searchable."
            bullets={["Front + back views", "Form tips per exercise", "Video form references"]}
            href="/muscles"
            cta="Explore Library"
          />
          <FeatureCard
            icon={TrendingUp}
            eyebrow="Progress Tracking"
            title="See the work pay off."
            body="Visualize strength gains, body weight, frequency, and personal records in modern charts and dashboards."
            bullets={["Strength curves", "Weekly volume heatmaps", "PR timeline"]}
            href="/dashboard"
            cta="View Dashboard"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon, eyebrow, title, body, bullets, href, cta,
}: {
  icon: LucideIcon; eyebrow: string; title: string; body: string;
  bullets: string[]; href: string; cta: string;
}) {
  return (
    <Link
      to={href}
      className="group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-lime/40"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime/15 text-lime">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="label-eyebrow">{eyebrow}</div>
        <h3 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">{title}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{body}</p>
      </div>
      <ul className="space-y-1.5">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-2 text-sm text-foreground/90">
            <Check className="h-4 w-4 shrink-0 text-lime" /> {b}
          </li>
        ))}
      </ul>
      <div className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-lime">
        {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

/* -------------------- Community -------------------- */

function CommunitySection() {
  const activity = [
    { who: "Andrew", action: "completed Push Day", time: "2m", icon: Dumbbell },
    { who: "Sarah", action: "hit a new Bench PR — 205 lb", time: "18m", icon: Trophy },
    { who: "Mike", action: "completed Week 6 of Summer Shred", time: "1h", icon: Flame },
    { who: "Jess", action: "joined the 100 Pushups Challenge", time: "3h", icon: Users },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeader
            eyebrow="Community"
            title="Training is better together."
            subtitle="Follow friends, share workouts, drop into communities. Accountability is the cheat code."
            align="left"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/coaches" className="inline-flex items-center gap-1 text-sm font-semibold text-lime hover:underline">
              Find people to train with <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-2">
          <div className="rounded-xl bg-background p-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="font-display text-sm font-semibold">Activity</div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Live</span>
            </div>
            <ul className="mt-3 space-y-3">
              {activity.map((a) => {
                const Icon = a.icon;
                return (
                  <li key={a.who + a.action} className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-surface">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime/15 text-sm font-bold text-lime">
                      {a.who[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-foreground">
                        <span className="font-semibold">{a.who}</span>{" "}
                        <span className="text-muted-foreground">{a.action}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <Icon className="h-3 w-3 text-lime" />
                        <span>{a.time} ago</span>
                        <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> 14</span>
                        <span className="inline-flex items-center gap-1"><MessageCircle className="h-3 w-3" /> 4</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Challenges -------------------- */

function ChallengesSection() {
  const challenges = [
    { title: "30-Day Shred", days: "30 days", people: "8.4k", color: "from-lime/30 to-transparent" },
    { title: "100 Pushups", days: "21 days", people: "12.1k", color: "from-lime/20 to-transparent" },
    { title: "Summer Strength", days: "8 weeks", people: "3.2k", color: "from-lime/25 to-transparent" },
    { title: "Community Sprints", days: "Weekly", people: "Open", color: "from-lime/15 to-transparent" },
  ];
  const earns = ["XP", "Badges", "Streaks", "Rankings"];
  return (
    <section className="border-b border-border bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeader
          eyebrow="Challenges"
          title="Compete. Climb. Earn."
          subtitle="Drop into community challenges and turn your training into a game worth winning."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {challenges.map((c) => (
            <div
              key={c.title}
              className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b ${c.color} p-6`}
            >
              <Trophy className="h-6 w-6 text-lime" />
              <div className="mt-6 font-display text-xl font-bold text-foreground">{c.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{c.days}</div>
              <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-background/60 px-2.5 py-1 text-[11px] font-semibold text-foreground">
                <Users className="h-3 w-3 text-lime" />
                {c.people} training
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="uppercase tracking-widest">Earn</span>
          {earns.map((e) => (
            <span key={e} className="rounded-full border border-border bg-background px-3 py-1 font-semibold text-foreground">
              {e}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- AI Coach -------------------- */

function AICoachSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="order-2 lg:order-1">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-4 w-4 text-lime" /> trainr AI
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-elevated p-3 text-sm">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">You</div>
                <div className="mt-1 text-foreground">My bench is stuck at 185 — what should I change?</div>
              </div>
              <div className="rounded-lg border border-lime/30 bg-lime/5 p-3 text-sm">
                <div className="text-[10px] uppercase tracking-widest text-lime">trainr</div>
                <div className="mt-1 text-foreground">
                  You've benched 185×5 four weeks in a row — classic plateau. Swap to 3×3 @ 190 with 2 back-off sets at 165×8, deload pressing volume next week.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeader
            eyebrow="AI Coach"
            title="Personalized guidance powered by AI."
            subtitle="trainr reads your history, consistency, and recovery to recommend real adjustments — not generic advice."
            align="left"
          />
          <ul className="mt-6 space-y-2 text-sm text-foreground/90">
            {["Workout adjustments based on your data", "Exercise alternatives when you're stuck", "Plateau detection & deload timing", "Recovery checks tied to your training load"].map((b) => (
              <li key={b} className="flex items-center gap-2"><Check className="h-4 w-4 text-lime" /> {b}</li>
            ))}
          </ul>
          <Link
            to="/coach"
            className="mt-8 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground hover:bg-elevated"
          >
            Ask trainr AI <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Creator -------------------- */

function CreatorSection() {
  return (
    <section className="border-b border-border bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeader
          eyebrow="Creators"
          title="Turn fitness into a business."
          subtitle="Publish programs, build communities, sell subscriptions, run challenges — all on one platform."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { icon: LayoutGrid, title: "Publish programs", body: "Drop training plans your audience can follow from day one." },
            { icon: Users, title: "Build a community", body: "Run a member-only space, share progress, host conversations." },
            { icon: Briefcase, title: "Monetize coaching", body: "Subscriptions, premium tiers, 1:1 coaching, challenges." },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="rounded-2xl border border-border bg-background p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/15 text-lime">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-5 font-display text-lg font-bold text-foreground">{c.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/become-a-coach"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-lime px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Become a Creator <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/creator-dashboard"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface"
          >
            Open Creator Studio
          </Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Future vision -------------------- */

function FutureVisionSection() {
  const cards = [
    { icon: Crown, title: "Creator Subscriptions" },
    { icon: Briefcase, title: "Premium Coaching" },
    { icon: Handshake, title: "Brand Partnerships" },
    { icon: Store, title: "Creator Marketplaces" },
    { icon: Package, title: "White-Labeled Supplements" },
    { icon: ShoppingBag, title: "Creator Storefronts" },
    { icon: Sparkles, title: "Merchandise" },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeader
          eyebrow="Roadmap"
          title="Built for the future of fitness."
          subtitle="trainr is becoming the platform layer underneath every modern fitness creator."
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="rounded-xl border border-border bg-surface/60 p-5">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-lime" />
                  <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Soon
                  </span>
                </div>
                <div className="mt-6 font-display text-base font-semibold text-foreground">{c.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Mobile app -------------------- */

function MobileAppSection() {
  const screens = ["Tracker", "Program Builder", "Body Map", "Community Feed", "AI Coach", "Creator Profile", "Leaderboards"];
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-lime/5 blur-[120px]" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeader
          eyebrow="Mobile"
          title="trainr in your pocket."
          subtitle="The whole platform — built for one-handed use between sets."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <PhoneFrame>
            <TrackerScreen />
          </PhoneFrame>
          <PhoneFrame>
            <FeedScreen />
          </PhoneFrame>
          <PhoneFrame>
            <LeaderboardScreen />
          </PhoneFrame>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {screens.map((s) => (
            <span key={s} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Final CTA -------------------- */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/10 blur-[120px]" />
      </div>
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <h2 className="font-display text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
          Track better.<br /><span className="text-lime">Train smarter.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          Everything you need to train, grow, and stay accountable — in one place.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/auth"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-lime px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Start Training Free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/become-a-coach"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface"
          >
            Become a Creator
          </Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Shared -------------------- */

function SectionHeader({
  eyebrow, title, subtitle, align = "center",
}: { eyebrow: string; title: string; subtitle?: string; align?: "center" | "left" }) {
  const a = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${a}`}>
      <div className="label-eyebrow">{eyebrow}</div>
      <h2 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
    </div>
  );
}
