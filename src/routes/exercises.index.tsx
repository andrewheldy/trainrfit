import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseCard, type ExerciseCardData } from "@/components/exercise-card";
import { cn } from "@/lib/utils";

const libraryQuery = queryOptions({
  queryKey: ["exercise-library"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("exercises")
      .select("slug, name, image_url, difficulty, equipment, exercise_type, exercise_muscles(role, muscles(slug, name))")
      .order("name");
    if (error) throw error;
    return (data ?? []).map((e: any) => ({
      slug: e.slug,
      name: e.name,
      image_url: e.image_url,
      difficulty: e.difficulty as ExerciseCardData["difficulty"],
      equipment: e.equipment,
      exercise_type: e.exercise_type,
      muscles: (e.exercise_muscles ?? []).map((m: any) => ({ slug: m.muscles.slug, name: m.muscles.name, role: m.role })),
      primary_muscle:
        e.exercise_muscles?.find((m: any) => m.role === "primary")?.muscles?.name ?? null,
    }));
  },
});

const difficulties = ["beginner", "intermediate", "advanced"] as const;

export const Route = createFileRoute("/exercises/")({
  head: () => ({
    meta: [
      { title: "Exercise Library — Gym Lift" },
      { name: "description", content: "Browse exercises by muscle, equipment, difficulty, and training goal." },
      { property: "og:title", content: "Exercise Library — Gym Lift" },
      { property: "og:description", content: "Browse exercises by muscle, equipment, difficulty, and training goal." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(libraryQuery),
  component: LibraryPage,
  errorComponent: ({ error }) => <div className="p-8 text-center" role="alert">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">Not found.</div>,
});

function LibraryPage() {
  const { data: all } = useSuspenseQuery(libraryQuery);
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState<string | null>(null);
  const [muscle, setMuscle] = useState<string | null>(null);

  const muscles: [string, string][] = Array.from(
    new Map<string, string>(
      all.flatMap((e) => e.muscles.map((m: any) => [m.slug as string, m.name as string]))
    ).entries()
  ).sort((a, b) => a[1].localeCompare(b[1]));

  const filtered = all.filter((e) => {
    if (q && !e.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (diff && e.difficulty !== diff) return false;
    if (muscle && !e.muscles.some((m: any) => m.slug === muscle)) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="label-eyebrow">Exercise Library</div>
      <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Find the Right Movement</h1>

      <div className="mt-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search exercises…"
            className="w-full rounded-md border border-border bg-surface py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-lime/50"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip label="All levels" active={!diff} onClick={() => setDiff(null)} />
          {difficulties.map((d) => (
            <Chip key={d} label={d} active={diff === d} onClick={() => setDiff(d)} />
          ))}
        </div>

        <div className="-mx-4 overflow-x-auto px-4">
          <div className="flex gap-2">
            <Chip label="All muscles" active={!muscle} onClick={() => setMuscle(null)} />
            {muscles.map(([slug, name]) => (
              <Chip key={slug} label={name} active={muscle === slug} onClick={() => setMuscle(slug)} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm text-muted-foreground">{filtered.length} exercises</div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((ex) => (
          <ExerciseCard key={ex.slug} exercise={ex} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="mt-12 rounded-md border border-border bg-surface p-8 text-center text-sm text-muted-foreground">
          No exercises match your filters yet. Try clearing one.
        </div>
      ) : null}
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
        active
          ? "border-lime bg-lime text-primary-foreground"
          : "border-border bg-surface text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
