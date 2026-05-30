import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, RotateCcw, Eye, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadProfile, loadProgram, saveProfile, saveProgram } from "@/lib/onboarding/storage";
import { generateOnboardingResults } from "@/lib/onboarding/scoring";
import { generateWeekOnePlan } from "@/lib/onboarding/program";
import type { OnboardingProfile, OnboardingResults, PlanExercise, Program } from "@/lib/onboarding/types";
import { DEFAULT_PROFILE } from "@/lib/onboarding/types";
import { exercises } from "@/data/exercises";

export const Route = createFileRoute("/onboarding/results")({
  head: () => ({
    meta: [
      { title: "Your Starting Plan — Gym Lift" },
      { name: "description", content: "Your personalized Week 1 Gym Lift plan." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<OnboardingProfile>(DEFAULT_PROFILE);
  const [results, setResults] = useState<OnboardingResults | null>(null);
  const [program, setProgram] = useState<Program | null>(null);

  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    const r = generateOnboardingResults(p);
    setResults(r);
    const existing = loadProgram();
    const plan = existing && existing.createdAt > Date.now() - 1000 * 60 * 5 ? existing : generateWeekOnePlan(p, r);
    setProgram(plan);
  }, []);

  const swapExercise = (dayIdx: number, exIdx: number) => {
    if (!program) return;
    const current = program.workouts[dayIdx].exercises[exIdx];
    const pool = exercises.filter(
      (e) => e.primaryMuscle === current.targetMuscle && e.slug !== current.slug,
    );
    if (pool.length === 0) {
      toast("No alternative found");
      return;
    }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const next: Program = JSON.parse(JSON.stringify(program));
    next.workouts[dayIdx].exercises[exIdx] = {
      ...current,
      name: pick.name,
      slug: pick.slug,
      targetMuscle: pick.primaryMuscle,
    };
    setProgram(next);
    toast.success(`Swapped to ${pick.name}`);
  };

  const addEntireProgram = () => {
    if (!program) return;
    saveProgram(program);
    saveProfile({ ...profile, onboardingComplete: true });
    toast.success("Your Week 1 plan has been added to My Lift.");
    navigate({ to: "/my-lift" });
  };

  if (!results || !program) return <div className="px-4 py-16 text-center text-muted-foreground">Loading your plan…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="label-eyebrow">Start Realistic.</div>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Your Gym Lift Starting Plan</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Based on your answers, here’s a realistic starting point. Build consistency first, the rest follows.
      </p>

      <SummaryCard profile={profile} results={results} />

      <Section title="Realistic Goal Forecast" eyebrow="Estimated, based on your answers">
        <ForecastCards results={results} />
      </Section>

      <Section title={`Your first target: complete ${results.firstWeekTarget} workouts this week.`} eyebrow="Week 1 Mission">
        <p className="text-sm text-muted-foreground">
          We chose a number you can actually hit. Hit it once, then we’ll progress from there.
        </p>
      </Section>

      <Section title="Your Week 1 Plan" eyebrow={program.recommendedSplit}>
        <div className="space-y-4">
          {program.workouts.map((w, dayIdx) => (
            <div key={dayIdx} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-lg font-bold">{w.day}: {w.title}</div>
                  <div className="text-xs text-muted-foreground">{w.estimatedDuration}</div>
                </div>
              </div>
              <div className="mt-3 divide-y divide-border">
                {w.exercises.map((ex, i) => (
                  <ExerciseRow key={i} ex={ex} onSwap={() => swapExercise(dayIdx, i)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-8 space-y-3">
        <button
          onClick={addEntireProgram}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-lime to-primary px-6 py-4 font-display text-base font-bold text-primary-foreground shadow-xl shadow-primary/30"
        >
          Add Entire Program To My Lift
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => navigate({ to: "/onboarding" })}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          Adjust My Answers
        </button>
      </div>

      <p className="mt-10 rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
        This plan is a general fitness recommendation based on your answers. It is not medical advice. If you have injuries, medical conditions, or concerns, consult a qualified professional before starting.
      </p>
    </div>
  );
}

function SummaryCard({ profile, results }: { profile: OnboardingProfile; results: OnboardingResults }) {
  const rows = useMemo(
    () => [
      { label: "Primary goal", value: profile.primaryGoal || "—" },
      { label: "Experience", value: results.experienceLevel },
      { label: "Split", value: results.recommendedSplit },
      { label: "Days / week", value: String(profile.realisticTrainingDays ?? "—") },
      { label: "Workout length", value: profile.preferredWorkoutLength || "—" },
    ],
    [profile, results],
  );
  return (
    <div className="mt-6 rounded-2xl border border-border bg-gradient-to-br from-surface to-elevated p-5">
      <div className="label-eyebrow">Your Starting Profile</div>
      <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between rounded-lg bg-background/40 px-3 py-2">
            <dt className="text-xs text-muted-foreground">{r.label}</dt>
            <dd className="font-display text-sm font-semibold">{r.value}</dd>
          </div>
        ))}
      </dl>
      {profile.equipment.length > 0 ? (
        <Chips label="Equipment" items={profile.equipment} />
      ) : null}
      {profile.focusMuscles.length > 0 ? (
        <Chips label="Focus" items={profile.focusMuscles} accent />
      ) : null}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Consistency score</span>
          <span className="font-mono font-bold text-lime">{results.consistencyScore}/100</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
          <div className="h-full bg-gradient-to-r from-lime to-primary" style={{ width: `${results.consistencyScore}%` }} />
        </div>
      </div>
    </div>
  );
}

function Chips({ label, items, accent }: { label: string; items: string[]; accent?: boolean }) {
  return (
    <div className="mt-4">
      <div className="label-eyebrow">{label}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span
            key={i}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs",
              accent ? "border-lime/40 bg-lime/10 text-lime" : "border-border bg-background/40 text-muted-foreground",
            )}
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

function Section({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      {eyebrow ? <div className="label-eyebrow">{eyebrow}</div> : null}
      <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ForecastCards({ results }: { results: OnboardingResults }) {
  const f = results.realisticGoalForecast;
  const cards = [
    { title: "30 Days", items: f.thirtyDays },
    { title: "90 Days", items: f.ninetyDays },
    { title: "6 Months", items: f.sixMonths },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((c) => (
        <div key={c.title} className="rounded-2xl border border-border bg-surface p-4">
          <div className="font-display text-lg font-bold text-lime">{c.title}</div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {c.items.map((it) => (
              <li key={it}>• {it}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ExerciseRow({ ex, onSwap }: { ex: PlanExercise; onSwap: () => void }) {
  return (
    <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="font-display text-sm font-semibold">{ex.name}</div>
          <span className="rounded-full bg-background/40 px-2 py-0.5 text-[10px] text-muted-foreground">{ex.targetMuscle}</span>
        </div>
        <div className="mt-0.5 font-mono text-xs text-muted-foreground">
          {ex.sets} × {ex.reps}{ex.notes ? ` · ${ex.notes}` : ""}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {ex.slug ? (
          <Link
            to="/exercises/$slug"
            params={{ slug: ex.slug }}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-elevated"
          >
            <Eye className="h-3 w-3" /> View Form
          </Link>
        ) : null}
        <button
          onClick={onSwap}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-elevated"
        >
          <RotateCcw className="h-3 w-3" /> Swap
        </button>
        <button
          onClick={() => {
            if (!ex.slug) return;
            import("@/lib/today-lift").then(({ addToTodayLift }) => {
              const r = addToTodayLift(ex.slug!);
              toast(r.added ? `Added ${ex.name} to today's lift` : "Already in today's lift");
            });
          }}
          className="inline-flex items-center gap-1 rounded-md bg-lime/10 px-2.5 py-1.5 text-xs text-lime hover:bg-lime/20"
        >
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
    </div>
  );
}
