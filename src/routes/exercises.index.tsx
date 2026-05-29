import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus, Check, Play, X } from "lucide-react";
import { toast } from "sonner";
import {
  exercises,
  CATEGORIES,
  ALL_EQUIPMENT,
  ALL_MUSCLES,
  type Exercise,
  type ExerciseCategory,
  type Difficulty,
  type ExerciseType,
} from "@/data/exercises";
import { addToTodayLift, useTodayLift } from "@/lib/today-lift";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/exercises/")({
  head: () => ({
    meta: [
      { title: "Exercise Library — Gym Lift" },
      {
        name: "description",
        content:
          "Push, Pull, Legs, Arms, Core. Search every lift by muscle, equipment, and difficulty with form videos.",
      },
      { property: "og:title", content: "Exercise Library — Gym Lift" },
      {
        property: "og:description",
        content: "Form videos and lift-by-lift breakdowns for every muscle group.",
      },
    ],
  }),
  component: LibraryPage,
});

const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
const TYPES: ExerciseType[] = ["Compound", "Isolation"];

type CategoryTab = ExerciseCategory | "All";
const TABS: CategoryTab[] = ["All", ...CATEGORIES];

function LibraryPage() {
  const [tab, setTab] = useState<CategoryTab>("All");
  const [q, setQ] = useState("");
  const [muscle, setMuscle] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [type, setType] = useState<ExerciseType | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return exercises.filter((e) => {
      if (tab !== "All" && e.category !== tab) return false;
      if (muscle && e.primaryMuscle !== muscle) return false;
      if (equipment && !e.equipment.includes(equipment)) return false;
      if (difficulty && e.difficulty !== difficulty) return false;
      if (type && e.exerciseType !== type) return false;
      if (term) {
        const hay = [
          e.name,
          e.primaryMuscle,
          e.category,
          ...e.equipment,
          ...e.secondaryMuscles,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [tab, q, muscle, equipment, difficulty, type]);

  const grouped = useMemo(() => {
    if (tab !== "All") return null;
    const map = new Map<ExerciseCategory, Exercise[]>();
    for (const e of filtered) {
      const arr = map.get(e.category) ?? [];
      arr.push(e);
      map.set(e.category, arr);
    }
    return CATEGORIES.map((c) => [c, map.get(c) ?? []] as const).filter(
      ([, list]) => list.length > 0,
    );
  }, [tab, filtered]);

  const activeFilters = [muscle, equipment, difficulty, type].filter(Boolean).length;
  const clearAll = () => {
    setMuscle(null);
    setEquipment(null);
    setDifficulty(null);
    setType(null);
    setQ("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="label-eyebrow">Exercise Library</div>
      <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
        Pick Your Lift
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Push, Pull, Legs, Arms, Core — every movement comes with a form video and a
        one-tap "Add to My Lift."
      </p>

      {/* Category tabs */}
      <div className="mt-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                tab === t
                  ? "border-lime bg-lime text-primary-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, muscle, or equipment…"
          className="w-full rounded-md border border-border bg-surface py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-lime/50"
        />
      </div>

      {/* Filters */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Muscle"
          value={muscle}
          options={ALL_MUSCLES}
          onChange={setMuscle}
        />
        <Select
          label="Equipment"
          value={equipment}
          options={ALL_EQUIPMENT}
          onChange={setEquipment}
        />
        <Select
          label="Difficulty"
          value={difficulty}
          options={DIFFICULTIES}
          onChange={(v) => setDifficulty(v as Difficulty | null)}
        />
        <Select
          label="Type"
          value={type}
          options={TYPES}
          onChange={(v) => setType(v as ExerciseType | null)}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{filtered.length} lifts</span>
        {activeFilters > 0 || q ? (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs font-medium text-lime hover:underline"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        ) : null}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : grouped ? (
        <div className="mt-6 space-y-10">
          {grouped.map(([cat, list]) => (
            <section key={cat}>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="font-display text-2xl font-bold">{cat}</h2>
                <span className="text-xs text-muted-foreground">{list.length}</span>
              </div>
              <Grid items={list} />
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <Grid items={filtered} />
        </div>
      )}
    </div>
  );
}

function Grid({ items }: { items: Exercise[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((e) => (
        <ExerciseCard key={e.slug} exercise={e} />
      ))}
    </div>
  );
}

function ExerciseCard({ exercise: e }: { exercise: Exercise }) {
  const lift = useTodayLift();
  const added = lift.items.some((i) => i.slug === e.slug);

  const onAdd = (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    const { added: didAdd } = addToTodayLift(e.slug);
    if (didAdd) toast.success("Added to Today's Lift", { description: e.name });
    else toast("Already in Today's Lift", { description: e.name });
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-lime/40">
      <Link
        to="/exercises/$slug"
        params={{ slug: e.slug }}
        className="relative block aspect-video overflow-hidden bg-elevated"
      >
        {e.thumbnailUrl ? (
          <img
            src={e.thumbnailUrl}
            alt={e.name}
            loading="lazy"
            width={480}
            height={270}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute left-2 top-2 inline-flex items-center rounded-md bg-lime px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
          {e.category}
        </div>
        <div className="absolute right-2 top-2 inline-flex items-center rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-foreground backdrop-blur">
          {e.difficulty}
        </div>
        <div className="absolute bottom-2 right-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur">
          <Play className="h-4 w-4 fill-current" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-base font-bold leading-tight">{e.name}</h3>
          <div className="mt-1 text-xs text-muted-foreground">
            <span className="text-foreground/80">{e.primaryMuscle}</span>
            {e.secondaryMuscles.length > 0 ? (
              <span> · {e.secondaryMuscles.join(", ")}</span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Tag>{e.exerciseType}</Tag>
          {e.equipment.map((eq) => (
            <Tag key={eq} muted>
              {eq}
            </Tag>
          ))}
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          <Link
            to="/exercises/$slug"
            params={{ slug: e.slug }}
            className="flex-1 rounded-md border border-border bg-elevated px-3 py-2 text-center text-xs font-semibold text-foreground transition-colors hover:border-lime/40"
          >
            View Form
          </Link>
          <button
            onClick={onAdd}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-opacity",
              added
                ? "bg-elevated text-lime"
                : "bg-primary text-primary-foreground hover:opacity-90",
            )}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" /> Added
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" /> Add to My Lift
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Tag({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        muted
          ? "border-border text-muted-foreground"
          : "border-lime/40 bg-lime/10 text-lime",
      )}
    >
      {children}
    </span>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: string[];
  onChange: (v: string | null) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-lime/50"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-xl border border-dashed border-border bg-surface p-10 text-center">
      <div className="font-display text-xl font-bold">No lifts found</div>
      <p className="mt-2 text-sm text-muted-foreground">
        Try another muscle, category, or piece of equipment.
      </p>
    </div>
  );
}
