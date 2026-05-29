import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MuscleMapImage } from "@/components/gym/muscle-map-image";


const musclesQuery = queryOptions({
  queryKey: ["muscles-index"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("muscles")
      .select("slug, name, region, short_description, image_url")
      .order("display_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const Route = createFileRoute("/muscles/")({
  head: () => ({
    meta: [
      { title: "Muscle Explorer — Gym Lift" },
      { name: "description", content: "Browse every muscle group: featured exercises, weekly volume, and form guidance." },
      { property: "og:title", content: "Muscle Explorer — Gym Lift" },
      { property: "og:description", content: "Browse every muscle group with featured exercises and form guidance." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(musclesQuery),
  component: MusclesIndex,
  errorComponent: ({ error }) => <div className="p-8 text-center" role="alert">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">Not found.</div>,
});

function MusclesIndex() {
  const { data: muscles } = useSuspenseQuery(musclesQuery);

  return (
    <>
      <section className="bg-black">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <MuscleMapImage />
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="label-eyebrow">Muscle Explorer</div>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Know What You're Training</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Eleven muscle groups. Pick one to see featured exercises, recommended weekly volume, and form tips.
        </p>


      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {muscles.map((m) => (
          <Link
            key={m.slug}
            to="/muscles/$slug"
            params={{ slug: m.slug }}
            className="group relative overflow-hidden rounded-lg border border-border bg-surface aspect-[4/5] transition-colors hover:border-lime/40"
          >
            {m.image_url ? (
              <img src={m.image_url} alt={m.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-80" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-4">
              <span className="label-eyebrow">{m.region}</span>
              <h2 className="mt-1 font-display text-2xl font-bold">{m.name}</h2>
              {m.short_description ? (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.short_description}</p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
