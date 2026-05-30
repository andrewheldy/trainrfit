import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useProfile, useProgram, useProgress } from "@/lib/onboarding/storage";
import { generateOnboardingResults } from "@/lib/onboarding/scoring";
import { Sparkles, Dumbbell, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Lift — Dashboard" },
      { name: "description", content: "Recent workouts, personal records, weekly activity, and saved exercises." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<{ sessions: number; saved: number; thisWeek: number }>({ sessions: 0, saved: 0, thisWeek: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const [sessions, savedRes, weekRes] = await Promise.all([
        supabase.from("workout_sessions").select("id, name, session_date", { count: "exact" }).eq("user_id", user.id).order("session_date", { ascending: false }).limit(5),
        supabase.from("saved_exercises").select("exercise_id, exercises(name, slug, image_url)").eq("user_id", user.id),
        supabase.from("workout_sessions").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("session_date", weekAgo.toISOString().slice(0, 10)),
      ]);
      setStats({
        sessions: sessions.count ?? 0,
        saved: savedRes.data?.length ?? 0,
        thisWeek: weekRes.count ?? 0,
      });
      setRecent(sessions.data ?? []);
      setSaved(savedRes.data ?? []);
    })();
  }, [user]);

  if (loading) return <Shell><p className="text-muted-foreground">Loading…</p></Shell>;
  if (!user) return (
    <Shell>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">My Lift</h1>
      <p className="mt-3 text-muted-foreground">Sign in to see your dashboard.</p>
      <Link to="/auth" className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Sign in</Link>
    </Shell>
  );

  return (
    <Shell>
      <div className="label-eyebrow">My Lift</div>
      <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Dashboard</h1>

      <OnboardingWidget />

      <div className="mt-8 grid grid-cols-3 gap-3">
        <StatBlock label="Sessions" value={stats.sessions} />
        <StatBlock label="This week" value={stats.thisWeek} accent />
        <StatBlock label="Saved" value={stats.saved} />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold">Recent Workouts</h2>
        {recent.length === 0 ? (
          <p className="mt-3 rounded-md border border-border bg-surface p-6 text-sm text-muted-foreground">
            No workouts yet. <Link to="/tracker" className="text-lime hover:underline">Start your first lift</Link>.
          </p>
        ) : (
          <div className="mt-3 divide-y divide-border rounded-md border border-border bg-surface">
            {recent.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-display text-base font-semibold">{s.name ?? "Session"}</div>
                  <div className="text-xs text-muted-foreground">{new Date(s.session_date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</div>
                </div>
                <Link to="/tracker" className="text-xs font-semibold text-lime hover:underline">Open →</Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold">Saved Exercises</h2>
        {saved.length === 0 ? (
          <p className="mt-3 rounded-md border border-border bg-surface p-6 text-sm text-muted-foreground">
            No saved exercises yet. Explore the library and add movements to My Lift.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {saved.map((s) => (
              <Link key={s.exercise_id} to="/exercises/$slug" params={{ slug: s.exercises.slug }} className="group overflow-hidden rounded-md border border-border bg-surface">
                <div className="aspect-square overflow-hidden bg-elevated">
                  {s.exercises.image_url ? <img src={s.exercises.image_url} alt={s.exercises.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" /> : null}
                </div>
                <div className="p-3 text-sm font-semibold">{s.exercises.name}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">{children}</div>;
}

function OnboardingWidget() {
  const profile = useProfile();
  const program = useProgram();
  const progress = useProgress();

  if (!profile.onboardingComplete && !program) {
    return (
      <div className="mt-6 rounded-2xl border border-lime/30 bg-gradient-to-br from-lime/10 to-transparent p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-lime" />
          <div className="flex-1">
            <div className="font-display text-lg font-bold">Build your starting plan</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Answer a few quick questions and get a personalized Week 1 plan.
            </p>
            <Link
              to="/onboarding"
              className="mt-3 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Start Assessment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!program) return null;
  const results = generateOnboardingResults(profile);
  const total = program.workouts.reduce((s, w) => s + w.exercises.length, 0);
  const done = Object.values(progress).filter(Boolean).length;

  return (
    <div className="mt-6 rounded-2xl border border-border bg-gradient-to-br from-surface to-elevated p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-lime/40 bg-lime/10 px-2.5 py-1 text-xs text-lime">
          {profile.primaryGoal || "Your Goal"}
        </span>
        <span className="rounded-full border border-border bg-background/40 px-2.5 py-1 text-xs text-muted-foreground">
          {program.recommendedSplit}
        </span>
      </div>
      <div className="mt-3 font-display text-lg font-bold">
        Your first target: complete {results.firstWeekTarget} workouts this week.
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Week 1 progress</span>
          <span className="font-mono font-bold text-lime">{done}/{total}</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
          <div className="h-full bg-gradient-to-r from-lime to-primary" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to="/my-lift"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Dumbbell className="h-3.5 w-3.5" /> Open My Lift
        </Link>
        <Link
          to="/coach"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold hover:bg-elevated"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Ask AI Coach
        </Link>
      </div>
    </div>
  );
}


function StatBlock({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-surface p-5">
      <div className={`font-mono text-3xl font-bold ${accent ? "text-lime" : ""}`}>{value}</div>
      <div className="mt-1 label-eyebrow">{label}</div>
    </div>
  );
}
