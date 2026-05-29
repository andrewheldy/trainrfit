import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseCard, type ExerciseCardData } from "@/components/exercise-card";

const muscleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["muscle", slug],
    queryFn: async () => {
      const { data: muscle, error } = await supabase
        .from("muscles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!muscle) throw notFound();

      const { data: links } = await supabase
        .from("exercise_muscles")
        .select("role, exercises(slug, name, image_url, difficulty, equipment)")
        .eq("muscle_id", muscle.id);

      const exercises: (ExerciseCardData & { role: string })[] = (links ?? [])
        .map((l: any) => ({
          slug: l.exercises.slug,
          name: l.exercises.name,
          image_url: l.exercises.image_url,
          difficulty: l.exercises.difficulty,
          equipment: l.exercises.equipment,
          primary_muscle: muscle.name,
          role: l.role,
        }));

      return { muscle, exercises };
    },
  });

export const Route = createFileRoute("/muscles/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.charAt(0).toUpperCase() + params.slug.slice(1)} — Gym Lift` },
      { name: "description", content: `Best exercises and training guidance for ${params.slug}.` },
    ],
  }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(muscleQuery(params.slug)),
  component: MusclePage,
  errorComponent: ({ error }) => <div className="p-8 text-center" role="alert">{error.message}</div>,
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <h1 className="font-display text-3xl">Muscle not found</h1>
      <Link to="/muscles" className="mt-4 inline-block text-lime hover:underline">Back to muscles</Link>
    </div>
  ),
});

function MusclePage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(muscleQuery(slug));
  const { muscle, exercises } = data;

  const beginner = exercises.filter((e) => e.difficulty === "beginner");
  const intermediate = exercises.filter((e) => e.difficulty === "intermediate");
  const advanced = exercises.filter((e) => e.difficulty === "advanced");

  return (
    <div>
      <section className="relative border-b border-border">
        {muscle.image_url ? (
          <img
            src={muscle.image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="label-eyebrow">{muscle.region}</div>
          <h1 className="mt-2 font-display text-5xl font-bold sm:text-7xl">{muscle.name}</h1>
          {muscle.overview ? (
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">{muscle.overview}</p>
          ) : null}

          {muscle.weekly_sets_min ? (
            <div className="mt-8 inline-flex items-baseline gap-3 rounded-md border border-border bg-surface px-5 py-3">
              <span className="label-eyebrow">Weekly Volume</span>
              <span className="font-mono text-lg font-semibold text-lime">
                {muscle.weekly_sets_min}–{muscle.weekly_sets_max} sets
              </span>
            </div>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6 sm:py-16">
        <ExerciseRail title="Beginner" exercises={beginner} />
        <ExerciseRail title="Intermediate" exercises={intermediate} />
        <ExerciseRail title="Advanced" exercises={advanced} />
      </div>
    </div>
  );
}

function ExerciseRail({ title, exercises }: { title: string; exercises: ExerciseCardData[] }) {
  if (!exercises.length) return null;
  return (
    <section>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {exercises.map((ex) => <ExerciseCard key={ex.slug} exercise={ex} />)}
      </div>
    </section>
  );
}
