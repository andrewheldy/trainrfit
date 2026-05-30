import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, Calendar, Target, Dumbbell, BadgeCheck, ChevronDown, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { getCoach, type Coach, type Program } from "@/lib/coaches/data";
import { getProgram, getProgramWorkouts, type Workout } from "@/lib/coaches/workouts";
import { useSavedPrograms, useStartedPrograms } from "@/lib/coaches/storage";

type LoaderData = { coach: Coach; program: Program; workouts: Workout[] };

export const Route = createFileRoute("/coaches/$slug/programs/$programSlug")({
  head: ({ params }) => {
    const coach = getCoach(params.slug);
    const program = coach ? getProgram(coach, params.programSlug) : undefined;
    const title = program && coach
      ? `${program.name} — ${coach.name} | Gym Lift`
      : "Program — Gym Lift";
    const description = program?.summary ?? "Full workout plan from a Gym Lift coach.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(program ? [{ property: "og:image", content: program.cover }] : []),
      ],
    };
  },
  loader: ({ params }): LoaderData => {
    const coach = getCoach(params.slug);
    if (!coach) throw notFound();
    const program = getProgram(coach, params.programSlug);
    if (!program) throw notFound();
    return { coach, program, workouts: getProgramWorkouts(coach, program) };
  },
  component: ProgramPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-sm text-muted-foreground" role="alert">
      Couldn't load program: {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md p-10 text-center">
      <h2 className="font-display text-2xl font-semibold">Program not found</h2>
      <Link to="/coaches" className="mt-4 inline-block text-sm font-semibold text-lime">
        ← Back to coaches
      </Link>
    </div>
  ),
});

function ProgramPage() {
  const { coach, program, workouts } = Route.useLoaderData();
  const saved = useSavedPrograms();
  const started = useStartedPrograms();
  const id = `${coach.slug}/${program.slug}`;
  const isSaved = saved.has(id);
  const isStarted = started.has(id);

  const handleStart = () => {
    started.add(id);
    toast.success(`${program.name} added to My Lift`, {
      description: `Coach ${coach.name} • Week 1 starts now`,
    });
  };

  const weeks: Record<number, Workout[]> = {};
  for (const w of workouts) {
    (weeks[w.week] ||= []).push(w);
  }
  const weekNumbers = Object.keys(weeks).map(Number).sort((a, b) => a - b);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-elevated">
        <img src={program.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            to="/coaches/$slug"
            params={{ slug: coach.slug }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to {coach.name}
          </Link>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="inline-block rounded-sm bg-lime px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                {program.difficulty}
              </span>
              <h1 className="mt-3 font-display text-3xl font-bold sm:text-5xl">{program.name}</h1>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">{program.summary}</p>

              <Link
                to="/coaches/$slug"
                params={{ slug: coach.slug }}
                className="mt-5 inline-flex items-center gap-3 rounded-md border border-border bg-background/60 px-3 py-2 backdrop-blur hover:border-lime/40"
              >
                <img
                  src={coach.photo}
                  alt={coach.name}
                  style={coach.photoPosition ? { objectPosition: coach.photoPosition } : undefined}
                  className="h-9 w-9 rounded-md object-cover object-top"
                />
                <div className="text-left">
                  <div className="inline-flex items-center gap-1 text-sm font-semibold">
                    {coach.name}
                    {coach.verified && <BadgeCheck className="h-3.5 w-3.5 text-lime" />}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {coach.specialty}
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={handleStart}
                className={
                  isStarted
                    ? "rounded-md border border-lime/40 bg-lime/10 px-5 py-2.5 text-sm font-semibold text-lime"
                    : "rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                }
              >
                {isStarted ? "In My Lift" : "Start Program"}
              </button>
              <button
                onClick={() => saved.toggle(id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm font-semibold hover:bg-elevated"
              >
                <Bookmark className={"h-4 w-4 " + (isSaved ? "fill-current text-lime" : "")} />
                {isSaved ? "Saved" : "Save"}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={<Target className="h-4 w-4" />} label="Goal" value={program.goal} />
            <Stat icon={<Clock className="h-4 w-4" />} label="Duration" value={program.duration} />
            <Stat icon={<Calendar className="h-4 w-4" />} label="Frequency" value={`${program.daysPerWeek}x / week`} />
            <Stat icon={<Dumbbell className="h-4 w-4" />} label="Workouts" value={String(workouts.length)} />
          </div>
        </div>
      </section>

      {/* Workouts */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">The Plan</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {workouts.length} workouts across {weekNumbers.length} weeks. Tap any session to view exercises.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            {weekNumbers.map((week) => (
              <WeekBlock key={week} week={week} workouts={weeks[week]} defaultOpen={week === 1} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/60 p-3 backdrop-blur">
      <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-display text-base font-semibold sm:text-lg">{value}</div>
    </div>
  );
}

function WeekBlock({
  week,
  workouts,
  defaultOpen,
}: {
  week: number;
  workouts: Workout[];
  defaultOpen?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
        <div className="inline-flex items-center gap-3">
          <span className="font-display text-lg font-bold sm:text-xl">Week {week}</span>
          <span className="rounded-full bg-elevated px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {workouts.length} workouts
          </span>
        </div>
      </div>
      <ul className="divide-y divide-border">
        {workouts.map((w) => (
          <WorkoutRow key={w.id} workout={w} defaultOpen={defaultOpen && w.day === 1} />
        ))}
      </ul>
    </div>
  );
}

function WorkoutRow({ workout, defaultOpen }: { workout: Workout; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <li>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-elevated/50 sm:px-5"
        aria-expanded={open}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-elevated font-display text-xs font-bold text-lime">
            D{workout.day}
          </span>
          <div className="min-w-0">
            <div className="truncate font-semibold">{workout.title}</div>
            <div className="truncate text-xs text-muted-foreground">{workout.focus}</div>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3 text-xs text-muted-foreground">
          <span className="hidden sm:inline-flex items-center gap-1">
            <Dumbbell className="h-3.5 w-3.5" /> {workout.exercises.length}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {workout.duration}
          </span>
          <ChevronDown
            className={"h-4 w-4 transition-transform " + (open ? "rotate-180" : "")}
          />
        </div>
      </button>
      {open && (
        <div className="border-t border-border bg-background/40 px-4 py-4 sm:px-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2 pr-3">Exercise</th>
                  <th className="pb-2 pr-3">Sets</th>
                  <th className="pb-2 pr-3">Reps</th>
                  <th className="pb-2 pr-3">Rest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {workout.exercises.map((ex, i) => (
                  <tr key={i}>
                    <td className="py-2 pr-3">
                      <div className="font-medium">{ex.name}</div>
                      {ex.notes && (
                        <div className="text-xs text-muted-foreground">{ex.notes}</div>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">{ex.sets}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{ex.reps}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{ex.rest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </li>
  );
}
