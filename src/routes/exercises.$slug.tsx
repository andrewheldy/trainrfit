import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Play } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

const exerciseQuery = (slug: string) =>
  queryOptions({
    queryKey: ["exercise", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercises")
        .select("*, exercise_muscles(role, muscles(slug, name))")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

export const Route = createFileRoute("/exercises/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Gym Lift` },
      { name: "description", content: `Form guide, common mistakes, and tips for ${params.slug}.` },
    ],
  }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(exerciseQuery(params.slug)),
  component: ExerciseDetail,
  errorComponent: ({ error }) => <div className="p-8 text-center" role="alert">{error.message}</div>,
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <h1 className="font-display text-3xl">Exercise not found</h1>
      <Link to="/exercises" className="mt-4 inline-block text-lime hover:underline">Back to library</Link>
    </div>
  ),
});

function ExerciseDetail() {
  const ex = useSuspenseQuery(exerciseQuery(Route.useParams().slug)).data;
  const { user } = useAuth();

  const primary = (ex.exercise_muscles ?? []).filter((m: any) => m.role === "primary");
  const secondary = (ex.exercise_muscles ?? []).filter((m: any) => m.role === "secondary");
  const steps = (ex.instructions ?? []) as string[];
  const mistakes = (ex.common_mistakes ?? []) as string[];
  const tips = (ex.form_tips ?? []) as string[];

  async function addToMyLift() {
    if (!user) {
      toast.error("Sign in to add this to your lift.");
      return;
    }
    const { error } = await supabase
      .from("saved_exercises")
      .insert({ user_id: user.id, exercise_id: ex.id });
    if (error && !error.message.includes("duplicate")) {
      toast.error(error.message);
    } else {
      toast.success(`Added ${ex.name} to your saved lifts.`);
    }
  }

  return (
    <article>
      <section className="relative border-b border-border">
        {ex.image_url ? (
          <img src={ex.image_url} alt={ex.name} className="absolute inset-0 h-full w-full object-cover opacity-25" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="label-eyebrow capitalize">{ex.difficulty} · {ex.equipment}</div>
          <h1 className="mt-2 font-display text-5xl font-bold sm:text-7xl">{ex.name}</h1>
          {ex.description ? <p className="mt-4 max-w-2xl text-muted-foreground sm:text-lg">{ex.description}</p> : null}

          <div className="mt-6 flex flex-wrap gap-2">
            {primary.map((m: any) => (
              <span key={m.muscles.slug} className="rounded-full bg-lime px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                {m.muscles.name}
              </span>
            ))}
            {secondary.map((m: any) => (
              <span key={m.muscles.slug} className="rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {m.muscles.name}
              </span>
            ))}
          </div>

          <button
            onClick={addToMyLift}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add To My Lift
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* Form video */}
        {(() => {
          const id = getYouTubeId(ex.video_url);
          if (id) {
            return (
              <div className="overflow-hidden rounded-lg border border-border bg-black">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
                    title={`${ex.name} form video`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
                {ex.video_url ? (
                  <a
                    href={ex.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border-t border-border bg-surface px-4 py-2 text-xs text-muted-foreground hover:text-lime"
                  >
                    <span>Watch on YouTube</span>
                    <Play className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            );
          }
          return (
            <div className="flex aspect-video items-center justify-center rounded-lg border border-border bg-surface">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-elevated">
                  <Play className="h-5 w-5 fill-foreground text-foreground" />
                </div>
                <span className="text-sm">Form video coming soon</span>
              </div>
            </div>
          );
        })()}

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <Section title="Step-by-Step">
            <ol className="space-y-3">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground/90">
                  <span className="font-mono text-lime">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </Section>

          <div className="space-y-10">
            <Section title="Common Mistakes">
              <ul className="space-y-2">
                {mistakes.map((m, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground"><span className="text-destructive">✕</span>{m}</li>
                ))}
              </ul>
            </Section>
            <Section title="Form Tips">
              <ul className="space-y-2">
                {tips.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground"><span className="text-lime">✓</span>{t}</li>
                ))}
              </ul>
            </Section>
          </div>
        </div>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="label-eyebrow">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
