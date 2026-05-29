import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Dumbbell, Target, LineChart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MuscleBodyExplorer } from "@/components/muscle-body";
import { BodyMuscleMap } from "@/components/gym/body-muscle-map";
import { ExerciseCard, type ExerciseCardData } from "@/components/exercise-card";

const homeQuery = queryOptions({
  queryKey: ["home-data"],
  queryFn: async () => {
    const [muscles, exercises] = await Promise.all([
      supabase.from("muscles").select("slug, name").order("display_order"),
      supabase
        .from("exercises")
        .select("slug, name, image_url, difficulty, equipment, exercise_muscles!inner(role, muscles(name))")
        .limit(8),
    ]);
    const featured: ExerciseCardData[] = (exercises.data ?? []).map((e: any) => ({
      slug: e.slug,
      name: e.name,
      image_url: e.image_url,
      difficulty: e.difficulty,
      equipment: e.equipment,
      primary_muscle:
        e.exercise_muscles?.find((m: any) => m.role === "primary")?.muscles?.name ?? null,
    }));
    return { muscleCount: muscles.data?.length ?? 0, featured };
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gym Lift — Train With Purpose" },
      {
        name: "description",
        content:
          "Discover exercises, master proper form, build workouts, and track every lift.",
      },
      { property: "og:title", content: "Gym Lift — Train With Purpose" },
      {
        property: "og:description",
        content:
          "Discover exercises, master proper form, build workouts, and track every lift.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  component: HomePage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-sm text-muted-foreground" role="alert">
      Couldn't load Gym Lift: {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-8 text-center">Not found.</div>,
});

function HomePage() {
  const { data } = useSuspenseQuery(homeQuery);
  const [view, setView] = useState<"front" | "back">("front");
  const [hover, setHover] = useState<any>(null);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:pt-28">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <div className="label-eyebrow">The operating system for better lifting</div>
              <h1 className="mt-4 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl lg:text-[5.5rem]">
                Train With<br />
                <span className="text-lime">Purpose.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
                Discover exercises, master proper form, build workouts, and track every lift.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/tracker"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Start My Lift <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/exercises"
                  className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
                >
                  Explore Exercises
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
                <Stat label="Muscle groups" value={String(data.muscleCount)} />
                <Stat label="Exercises" value="24+" />
                <Stat label="Programs" value="Build your own" small />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface p-6">
              <div className="label-eyebrow">Muscle Explorer</div>
              <h2 className="mt-2 font-display text-2xl font-semibold">Know What You're Training</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tap a muscle to dive in.</p>
              <div className="mt-6">
                <MuscleBodyExplorer view={view} setView={setView} hover={hover} setHover={setHover} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Body Muscle Map */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <BodyMuscleMap />
        </div>
      </section>

      {/* Featured Exercises */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="label-eyebrow">Exercise Library</div>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Find the Right Movement</h2>
            </div>
            <Link to="/exercises" className="hidden text-sm font-semibold text-lime hover:underline sm:inline-flex">
              View library →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.featured.map((ex) => (
              <ExerciseCard key={ex.slug} exercise={ex} />
            ))}
          </div>
        </div>
      </section>

      {/* Tracker + Coach previews */}
      <section>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3">
          <FeaturePreview
            icon={<Dumbbell className="h-5 w-5" />}
            eyebrow="Workout Tracker"
            title="Track Every Set"
            body="Build workouts, log reps, record weight, and see your progress over time."
            href="/tracker"
            cta="Open Tracker"
          />
          <FeaturePreview
            icon={<LineChart className="h-5 w-5" />}
            eyebrow="My Lift"
            title="See Your Progress"
            body="Personal records, recent sessions, weekly activity—all in one dashboard."
            href="/dashboard"
            cta="View Dashboard"
          />
          <FeaturePreview
            icon={<Sparkles className="h-5 w-5" />}
            eyebrow="AI Coach"
            title="Ask Smarter Questions"
            body="Guidance on exercise selection, training splits, and recovery."
            href="/coach"
            cta="Ask Coach"
            subdued
          />
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <div className={small ? "font-display text-base font-semibold" : "font-display text-3xl font-bold"}>
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function FeaturePreview({
  icon, eyebrow, title, body, href, cta, subdued,
}: {
  icon: React.ReactNode; eyebrow: string; title: string; body: string;
  href: string; cta: string; subdued?: boolean;
}) {
  return (
    <Link
      to={href}
      className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-6 transition-colors hover:border-lime/40"
    >
      <div>
        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${subdued ? "bg-elevated text-muted-foreground" : "bg-lime text-primary-foreground"}`}>
          {icon}
        </div>
        <div className="mt-6 label-eyebrow">{eyebrow}</div>
        <h3 className="mt-2 font-display text-2xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      </div>
      <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-foreground">
        {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
