import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck, Play, Lightbulb, Dumbbell } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Difficulty = "beginner" | "intermediate" | "advanced";

interface ExerciseRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  difficulty: Difficulty;
  equipment: string | null;
  form_tips: string[];
  primary_muscles: string[];
  secondary_muscles: string[];
}

const muscleQuery = (slug: string, userId: string | null) =>
  queryOptions({
    queryKey: ["muscle", slug, userId],
    queryFn: async () => {
      const { data: muscle, error } = await supabase
        .from("muscles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!muscle) throw notFound();

      // Get exercises that target this muscle (primary or secondary)
      const { data: links } = await supabase
        .from("exercise_muscles")
        .select("exercise_id")
        .eq("muscle_id", muscle.id);

      const exerciseIds = (links ?? []).map((l) => l.exercise_id);

      let exercises: ExerciseRow[] = [];
      if (exerciseIds.length) {
        const { data: rows } = await supabase
          .from("exercises")
          .select(
            "id, slug, name, description, image_url, difficulty, equipment, form_tips, exercise_muscles(role, muscles(name))",
          )
          .in("id", exerciseIds);

        exercises = (rows ?? []).map((r: any) => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          description: r.description,
          image_url: r.image_url,
          difficulty: r.difficulty,
          equipment: r.equipment,
          form_tips: Array.isArray(r.form_tips) ? r.form_tips : [],
          primary_muscles: (r.exercise_muscles ?? [])
            .filter((m: any) => m.role === "primary")
            .map((m: any) => m.muscles?.name)
            .filter(Boolean),
          secondary_muscles: (r.exercise_muscles ?? [])
            .filter((m: any) => m.role === "secondary")
            .map((m: any) => m.muscles?.name)
            .filter(Boolean),
        }));
      }

      // Saved status for current user
      let savedIds = new Set<string>();
      if (userId && exerciseIds.length) {
        const { data: saved } = await supabase
          .from("saved_exercises")
          .select("exercise_id")
          .eq("user_id", userId)
          .in("exercise_id", exerciseIds);
        savedIds = new Set((saved ?? []).map((s) => s.exercise_id));
      }

      // Other muscles in same region for "Related" strip
      const { data: related } = await supabase
        .from("muscles")
        .select("slug, name")
        .eq("region", muscle.region)
        .neq("slug", muscle.slug)
        .order("display_order");

      return { muscle, exercises, savedIds, related: related ?? [] };
    },
  });

export const Route = createFileRoute("/muscles/$slug")({
  head: ({ params }) => {
    const name = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${name} Workouts & Exercises — Gym Lift` },
        { name: "description", content: `Best exercises, form tips, and progressive training for ${name.toLowerCase()}.` },
        { property: "og:title", content: `${name} — Gym Lift` },
        { property: "og:description", content: `Beginner to advanced ${name.toLowerCase()} exercises with form guidance.` },
      ],
    };
  },
  loader: ({ context, params }) => context.queryClient.ensureQueryData(muscleQuery(params.slug, null)),
  component: MusclePage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center" role="alert">
      {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <h1 className="font-display text-3xl">Muscle not found</h1>
      <Link to="/muscles" className="mt-4 inline-block text-lime hover:underline">
        Back to muscles
      </Link>
    </div>
  ),
});

function MusclePage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const { data } = useSuspenseQuery(muscleQuery(slug, user?.id ?? null));
  const { muscle, exercises, savedIds, related } = data;

  const grouped: Record<Difficulty, ExerciseRow[]> = {
    beginner: exercises.filter((e) => e.difficulty === "beginner"),
    intermediate: exercises.filter((e) => e.difficulty === "intermediate"),
    advanced: exercises.filter((e) => e.difficulty === "advanced"),
  };

  const total = exercises.length;
  const [tab, setTab] = useState<Difficulty>(
    grouped.beginner.length ? "beginner" : grouped.intermediate.length ? "intermediate" : "advanced",
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        {muscle.image_url ? (
          <img
            src={muscle.image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <Link
            to="/muscles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All muscles
          </Link>
          <div className="mt-6 label-eyebrow">{muscle.region} body</div>
          <h1 className="mt-2 font-display text-5xl font-bold tracking-tight sm:text-7xl">
            {muscle.name}
          </h1>
          {muscle.overview ? (
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {muscle.overview}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Stat label="Exercises" value={String(total)} />
            {muscle.weekly_sets_min ? (
              <Stat
                label="Weekly Volume"
                value={`${muscle.weekly_sets_min}–${muscle.weekly_sets_max} sets`}
                accent
              />
            ) : null}
            <Stat label="Region" value={String(muscle.region).toUpperCase()} />
          </div>
        </div>
      </section>

      {/* Exercises with difficulty tabs */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="label-eyebrow">Train it</div>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Exercises by Level</h2>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as Difficulty)} className="mt-6">
          <TabsList className="bg-elevated">
            <TabsTrigger value="beginner" className="data-[state=active]:bg-lime data-[state=active]:text-primary-foreground">
              Beginner <span className="ml-2 font-mono text-xs opacity-70">{grouped.beginner.length}</span>
            </TabsTrigger>
            <TabsTrigger value="intermediate" className="data-[state=active]:bg-lime data-[state=active]:text-primary-foreground">
              Intermediate <span className="ml-2 font-mono text-xs opacity-70">{grouped.intermediate.length}</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-lime data-[state=active]:text-primary-foreground">
              Advanced <span className="ml-2 font-mono text-xs opacity-70">{grouped.advanced.length}</span>
            </TabsTrigger>
          </TabsList>

          {(["beginner", "intermediate", "advanced"] as const).map((level) => (
            <TabsContent key={level} value={level} className="mt-6">
              {grouped[level].length ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[level].map((ex) => (
                    <MuscleExerciseCard
                      key={ex.id}
                      exercise={ex}
                      saved={savedIds.has(ex.id)}
                      muscleSlug={slug}
                    />
                  ))}
                </div>
              ) : (
                <EmptyLevel level={level} muscle={muscle.name} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Related muscles */}
      {related.length ? (
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="label-eyebrow">Train the rest</div>
            <h3 className="mt-2 font-display text-2xl font-bold">More {muscle.region} muscles</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/muscles/$slug"
                  params={{ slug: r.slug }}
                  className="inline-flex items-center rounded-md border border-border bg-elevated px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-lime/40 hover:text-lime"
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

/* ---------------- Subcomponents ---------------- */

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="inline-flex items-baseline gap-3 rounded-md border border-border bg-surface px-5 py-3">
      <span className="label-eyebrow">{label}</span>
      <span className={cn("font-mono text-lg font-semibold", accent ? "text-lime" : "text-foreground")}>
        {value}
      </span>
    </div>
  );
}

function MuscleExerciseCard({
  exercise,
  saved,
  muscleSlug,
}: {
  exercise: ExerciseRow;
  saved: boolean;
  muscleSlug: string;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [pending, setPending] = useState(false);
  const [optimisticSaved, setOptimisticSaved] = useState(saved);

  const toggleSave = async () => {
    if (!user) {
      toast("Sign in to save lifts", { description: "Create a free account to build your library." });
      navigate({ to: "/auth" });
      return;
    }
    setPending(true);
    try {
      if (optimisticSaved) {
        await supabase.from("saved_exercises").delete().eq("user_id", user.id).eq("exercise_id", exercise.id);
        setOptimisticSaved(false);
        toast(`Removed ${exercise.name} from My Lift`);
      } else {
        await supabase.from("saved_exercises").insert({ user_id: user.id, exercise_id: exercise.id });
        setOptimisticSaved(true);
        toast(`Added ${exercise.name} to My Lift`);
      }
      qc.invalidateQueries({ queryKey: ["muscle", muscleSlug] });
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't update My Lift");
    } finally {
      setPending(false);
    }
  };

  const tip = exercise.form_tips?.[0];

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-lime/30">
      <Link
        to="/exercises/$slug"
        params={{ slug: exercise.slug }}
        className="relative block aspect-[16/10] overflow-hidden bg-elevated"
      >
        {exercise.image_url ? (
          <img
            src={exercise.image_url}
            alt={exercise.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/95 to-transparent" />
        <div className="absolute left-3 top-3 inline-flex items-center rounded-sm bg-background/85 px-2 py-1 text-[10px] uppercase tracking-widest text-foreground backdrop-blur">
          {exercise.difficulty}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight">{exercise.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            {exercise.equipment ? (
              <span className="inline-flex items-center gap-1">
                <Dumbbell className="h-3 w-3" /> {exercise.equipment}
              </span>
            ) : null}
            {exercise.primary_muscles[0] ? (
              <>
                <span>·</span>
                <span>Primary: {exercise.primary_muscles[0]}</span>
              </>
            ) : null}
          </div>
          {exercise.secondary_muscles.length ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {exercise.secondary_muscles.slice(0, 3).map((m) => (
                <span
                  key={m}
                  className="rounded-sm border border-border bg-elevated px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  {m}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {tip ? (
          <div className="flex items-start gap-2 rounded-md border border-border/50 bg-elevated/60 p-3">
            <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-lime" />
            <p className="text-xs leading-relaxed text-muted-foreground">{tip}</p>
          </div>
        ) : null}

        <div className="mt-auto flex gap-2 pt-1">
          <button
            onClick={toggleSave}
            disabled={pending}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors",
              optimisticSaved
                ? "bg-lime text-primary-foreground hover:opacity-90"
                : "border border-border bg-elevated text-foreground hover:border-lime/40 hover:text-lime",
              pending && "opacity-60",
            )}
          >
            {optimisticSaved ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5" /> In My Lift
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" /> Add to My Lift
              </>
            )}
          </button>
          <Link
            to="/exercises/$slug"
            params={{ slug: exercise.slug }}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-elevated px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-lime/40 hover:text-lime"
          >
            <Play className="h-3.5 w-3.5" /> Watch Form
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyLevel({ level, muscle }: { level: Difficulty; muscle: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-surface p-10 text-center">
      <div className="label-eyebrow">No {level} exercises yet</div>
      <p className="mt-2 text-sm text-muted-foreground">
        We're adding more {level} {muscle.toLowerCase()} work. Check back soon.
      </p>
      <Link
        to="/exercises"
        className="mt-4 inline-flex text-sm font-semibold text-lime hover:underline"
      >
        Browse full library →
      </Link>
    </div>
  );
}
