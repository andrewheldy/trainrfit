import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { COACHES, COACH_CATEGORIES, type CoachCategory } from "@/lib/coaches/data";
import { CoachCard } from "@/components/coaches/coach-card";

export const Route = createFileRoute("/coaches/")({
  head: () => ({
    meta: [
      { title: "Discover Elite Coaches — Gym Lift" },
      {
        name: "description",
        content:
          "Find training styles that match your goals and follow structured programs created by trusted fitness experts.",
      },
      { property: "og:title", content: "Discover Elite Coaches — Gym Lift" },
      {
        property: "og:description",
        content:
          "Find training styles that match your goals and follow structured programs created by trusted fitness experts.",
      },
    ],
  }),
  component: CoachesIndex,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-sm text-muted-foreground" role="alert">
      Couldn't load coaches: {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-8 text-center">Not found.</div>,
});

function CoachesIndex() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Set<CoachCategory>>(new Set());

  const filtered = useMemo(() => {
    return COACHES.filter((c) => {
      const matchesQ =
        !q ||
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.specialty.toLowerCase().includes(q.toLowerCase());
      const matchesFilter =
        filters.size === 0 || c.categories.some((cat) => filters.has(cat));
      return matchesQ && matchesFilter;
    });
  }, [q, filters]);

  const toggleFilter = (cat: CoachCategory) => {
    const next = new Set(filters);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setFilters(next);
  };

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="max-w-3xl">
            <div className="label-eyebrow">Coaches</div>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Discover Elite <span className="text-lime">Coaches</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Find training styles that match your goals and follow structured programs created by
              trusted fitness experts.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <div className="relative max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search coaches by name or specialty"
                className="w-full rounded-md border border-border bg-background py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-lime focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {COACH_CATEGORIES.map((cat) => {
                const active = filters.has(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleFilter(cat)}
                    className={
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors " +
                      (active
                        ? "bg-lime text-primary-foreground"
                        : "border border-border bg-background text-muted-foreground hover:text-foreground")
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filtered.length} coach{filtered.length === 1 ? "" : "es"}
            </span>
            <Link to="/become-a-coach" className="font-semibold text-lime hover:underline">
              Become a coach →
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-border bg-surface p-10 text-center text-sm text-muted-foreground">
              No coaches match your filters yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <CoachCard key={c.slug} coach={c} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
