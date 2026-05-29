import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Plus, Check, ArrowLeft, AlertTriangle, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import {
  exercises,
  getExerciseBySlug,
  getYouTubeId,
  type Exercise,
} from "@/data/exercises";
import { addToTodayLift, useTodayLift } from "@/lib/today-lift";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/exercises/$slug")({
  head: ({ params }) => {
    const ex = getExerciseBySlug(params.slug);
    const title = ex ? `${ex.name} — Form Guide | Gym Lift` : "Exercise — Gym Lift";
    const desc = ex
      ? `How to do ${ex.name}: form video, primary muscle (${ex.primaryMuscle}), equipment, and tips.`
      : "Exercise form guide.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(ex?.thumbnailUrl
          ? [
              { property: "og:image", content: ex.thumbnailUrl },
              { name: "twitter:image", content: ex.thumbnailUrl },
            ]
          : []),
      ],
    };
  },
  loader: ({ params }) => {
    const ex = getExerciseBySlug(params.slug);
    if (!ex) throw notFound();
    return ex;
  },
  component: ExerciseDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl p-12 text-center">
      <h1 className="font-display text-3xl font-bold">Exercise not found</h1>
      <Link to="/exercises" className="mt-4 inline-block text-lime hover:underline">
        Back to library
      </Link>
    </div>
  ),
});

function ExerciseDetail() {
  const ex: Exercise = Route.useLoaderData();
  const lift = useTodayLift();
  const added = lift.items.some((i) => i.slug === ex.slug);
  const videoId = getYouTubeId(ex.youtubeUrl);

  const alternatives: Exercise[] = exercises.filter(
    (e) =>
      e.slug !== ex.slug &&
      (e.primaryMuscle === ex.primaryMuscle || e.bodyMapRegion === ex.bodyMapRegion),
  );

  const onAdd = () => {
    const { added: didAdd } = addToTodayLift(ex.slug);
    if (didAdd) toast.success("Added to Today's Lift", { description: ex.name });
    else toast("Already in Today's Lift", { description: ex.name });
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <Link
        to="/exercises"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All lifts
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-lime px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            {ex.category}
          </span>
          <span className="rounded-md border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {ex.difficulty}
          </span>
          <span className="rounded-md border border-lime/40 bg-lime/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-lime">
            {ex.exerciseType}
          </span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">
          {ex.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="text-foreground">{ex.primaryMuscle}</span>
          {ex.secondaryMuscles.length > 0
            ? ` · ${ex.secondaryMuscles.join(", ")}`
            : null}
        </p>
      </header>

      {/* Video */}
      {videoId ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-black">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={`${ex.name} form video`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      ) : null}

      {/* Sticky-ish CTA */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={onAdd}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-opacity sm:flex-none",
            added
              ? "bg-elevated text-lime"
              : "bg-primary text-primary-foreground hover:opacity-90",
          )}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> In Today's Lift
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add to My Lift
            </>
          )}
        </button>
        <a
          href={ex.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground hover:border-lime/40"
        >
          Open on YouTube
        </a>
      </div>

      {/* Meta */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <Meta label="Primary muscle" value={ex.primaryMuscle} />
        <Meta
          label="Secondary muscles"
          value={ex.secondaryMuscles.length ? ex.secondaryMuscles.join(", ") : "—"}
        />
        <Meta label="Equipment" value={ex.equipment.join(", ")} />
        <Meta label="Type" value={`${ex.exerciseType} · ${ex.difficulty}`} />
      </section>

      {ex.description ? (
        <p className="mt-8 text-sm leading-relaxed text-foreground/90">
          {ex.description}
        </p>
      ) : null}

      {ex.instructions && ex.instructions.length > 0 ? (
        <Section title="How to do it">
          <ol className="space-y-3">
            {ex.instructions.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground/90">
                <span className="font-mono text-lime">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {ex.commonMistakes && ex.commonMistakes.length > 0 ? (
        <Section title="Common mistakes">
          <div className="grid gap-2 sm:grid-cols-2">
            {ex.commonMistakes.map((m, i) => (
              <div
                key={i}
                className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-foreground/90"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span>{m}</span>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {ex.formTips && ex.formTips.length > 0 ? (
        <Section title="Form tips">
          <div className="grid gap-2 sm:grid-cols-2">
            {ex.formTips.map((t, i) => (
              <div
                key={i}
                className="flex gap-2 rounded-lg border border-lime/30 bg-lime/5 p-3 text-sm text-foreground/90"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {alternatives.length > 0 ? (
        <Section title="Try these alternatives">
          <div className="flex flex-wrap gap-2">
            {alternatives.slice(0, 10).map((a) => (
              <Link
                key={a.slug}
                to="/exercises/$slug"
                params={{ slug: a.slug }}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:border-lime/40"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="label-eyebrow">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
