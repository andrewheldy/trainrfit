import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, RotateCcw, Eye, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgram, useProgress, saveProgress, clearProgram, saveProgram } from "@/lib/onboarding/storage";
import { exercises } from "@/data/exercises";
import type { Program } from "@/lib/onboarding/types";

export const Route = createFileRoute("/my-lift")({
  head: () => ({
    meta: [
      { title: "My Lift — Gym Lift" },
      { name: "description", content: "Your saved Week 1 program organized by day." },
    ],
  }),
  component: MyLiftPage,
});

function MyLiftPage() {
  const program = useProgram();
  const progress = useProgress();
  const [activeDay, setActiveDay] = useState(0);

  if (!program) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="label-eyebrow">My Lift</div>
        <h1 className="mt-2 font-display text-3xl font-bold">No program yet.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Take the quick assessment and get a personalized Week 1 plan.
        </p>
        <Link
          to="/onboarding"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Start Onboarding
        </Link>
      </div>
    );
  }

  const toggle = (dayIdx: number, exIdx: number) => {
    const k = `${dayIdx}:${exIdx}`;
    saveProgress({ ...progress, [k]: !progress[k] });
  };

  const swap = (dayIdx: number, exIdx: number) => {
    const current = program.workouts[dayIdx].exercises[exIdx];
    const pool = exercises.filter((e) => e.primaryMuscle === current.targetMuscle && e.slug !== current.slug);
    if (pool.length === 0) return toast("No alternative");
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const next: Program = JSON.parse(JSON.stringify(program));
    next.workouts[dayIdx].exercises[exIdx] = {
      ...current, name: pick.name, slug: pick.slug, targetMuscle: pick.primaryMuscle,
    };
    saveProgram(next);
    toast.success(`Swapped to ${pick.name}`);
  };

  const editSetsReps = (dayIdx: number, exIdx: number, sets: number, reps: string) => {
    const next: Program = JSON.parse(JSON.stringify(program));
    next.workouts[dayIdx].exercises[exIdx].sets = sets;
    next.workouts[dayIdx].exercises[exIdx].reps = reps;
    saveProgram(next);
  };

  const totalEx = program.workouts.reduce((s, w) => s + w.exercises.length, 0);
  const doneCount = Object.values(progress).filter(Boolean).length;
  const day = program.workouts[activeDay];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="label-eyebrow">{program.recommendedSplit}</div>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{program.programName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Goal: <span className="text-foreground">{program.goal}</span> · {program.daysPerWeek} days/week
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("Clear your current program?")) {
              clearProgram();
              toast("Program cleared");
            }
          }}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" /> Clear
        </button>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Week 1 progress</span>
          <span className="font-mono font-bold text-lime">{doneCount}/{totalEx}</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
          <div className="h-full bg-gradient-to-r from-lime to-primary" style={{ width: `${(doneCount / totalEx) * 100}%` }} />
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {program.workouts.map((w, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={cn(
              "shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition",
              activeDay === i
                ? "border-lime bg-lime/10 text-lime"
                : "border-border bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {w.day} · {w.title}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-lg font-bold">{day.day}: {day.title}</div>
            <div className="text-xs text-muted-foreground">{day.estimatedDuration}</div>
          </div>
          <Link
            to="/tracker"
            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            Start Workout
          </Link>
        </div>
        <div className="mt-4 divide-y divide-border">
          {day.exercises.map((ex, i) => {
            const done = !!progress[`${activeDay}:${i}`];
            return (
              <div key={i} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggle(activeDay, i)}
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition",
                      done ? "border-lime bg-lime text-primary-foreground" : "border-border hover:border-lime",
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : null}
                  </button>
                  <div className="min-w-0">
                    <div className={cn("font-display text-sm font-semibold", done && "line-through opacity-60")}>{ex.name}</div>
                    <div className="text-xs text-muted-foreground">{ex.targetMuscle}</div>
                    <div className="mt-1 flex items-center gap-2 font-mono text-xs">
                      <input
                        type="number"
                        value={ex.sets}
                        min={1}
                        onChange={(e) => editSetsReps(activeDay, i, Number(e.target.value), ex.reps)}
                        className="w-12 rounded border border-border bg-background px-1.5 py-0.5"
                      />
                      <span className="text-muted-foreground">×</span>
                      <input
                        value={ex.reps}
                        onChange={(e) => editSetsReps(activeDay, i, ex.sets, e.target.value)}
                        className="w-16 rounded border border-border bg-background px-1.5 py-0.5"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {ex.slug ? (
                    <Link
                      to="/exercises/$slug"
                      params={{ slug: ex.slug }}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-elevated"
                    >
                      <Eye className="h-3 w-3" /> Form
                    </Link>
                  ) : null}
                  <button
                    onClick={() => swap(activeDay, i)}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-elevated"
                  >
                    <RotateCcw className="h-3 w-3" /> Swap
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
