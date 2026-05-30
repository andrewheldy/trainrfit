import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, Users, Star, Layers, Instagram, Youtube, Twitter, ArrowLeft } from "lucide-react";
import { getCoach, formatFollowers, COACHES, type Coach } from "@/lib/coaches/data";
import { useFollowedCoaches } from "@/lib/coaches/storage";
import { ProgramCard } from "@/components/coaches/program-card";

export const Route = createFileRoute("/coaches/$slug")({
  head: ({ params }) => {
    const coach = getCoach(params.slug);
    const title = coach ? `${coach.name} — ${coach.specialty} | Gym Lift` : "Coach — Gym Lift";
    const description = coach?.bio ?? "Discover expert coaches on Gym Lift.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(coach ? [{ property: "og:image", content: coach.banner }] : []),
      ],
    };
  },
  loader: ({ params }): Coach => {
    const coach = getCoach(params.slug);
    if (!coach) throw notFound();
    return coach;
  },
  component: CoachProfile,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-sm text-muted-foreground" role="alert">
      Couldn't load coach: {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md p-10 text-center">
      <h2 className="font-display text-2xl font-semibold">Coach not found</h2>
      <Link to="/coaches" className="mt-4 inline-block text-sm font-semibold text-lime">
        ← Back to coaches
      </Link>
    </div>
  ),
});

function CoachProfile() {
  const coach = Route.useLoaderData() as Coach;
  const { has, toggle } = useFollowedCoaches();
  const followed = has(coach.slug);

  return (
    <div>
      {/* Banner */}
      <section className="relative h-56 overflow-hidden border-b border-border bg-elevated sm:h-72">
        <img src={coach.banner} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-4 sm:px-6">
          <Link
            to="/coaches"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All Coaches
          </Link>
        </div>
      </section>

      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto -mt-16 max-w-7xl px-4 pb-10 sm:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <img
              src={coach.photo}
              alt={coach.name}
              className="h-28 w-28 flex-shrink-0 rounded-lg border-4 border-background object-cover shadow-lg sm:h-36 sm:w-36"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-bold sm:text-4xl">{coach.name}</h1>
                {coach.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-lime/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-lime">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">
                {coach.specialty}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> {formatFollowers(coach.followers)} followers
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="h-4 w-4" /> {coach.programs.length} programs
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-lime text-lime" /> {coach.ratings.score} ({coach.ratings.count})
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggle(coach.slug)}
                className={
                  followed
                    ? "rounded-md border border-lime/40 bg-lime/10 px-5 py-2.5 text-sm font-semibold text-lime"
                    : "rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                }
              >
                {followed ? "Following" : "Follow Coach"}
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="label-eyebrow">About</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {coach.bio}
              </p>
            </div>
            <div>
              <h2 className="label-eyebrow">Connect</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {coach.social.instagram && (
                  <SocialChip icon={<Instagram className="h-3.5 w-3.5" />} label={coach.social.instagram} />
                )}
                {coach.social.youtube && (
                  <SocialChip icon={<Youtube className="h-3.5 w-3.5" />} label={coach.social.youtube} />
                )}
                {coach.social.twitter && (
                  <SocialChip icon={<Twitter className="h-3.5 w-3.5" />} label={coach.social.twitter} />
                )}
              </div>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {coach.categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Programs</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Follow a structured plan from {coach.name}.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coach.programs.map((p) => (
              <ProgramCard key={p.slug} program={p} coach={coach} showCoach={false} />
            ))}
          </div>
        </div>
      </section>

      {/* Other coaches */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-xl font-bold sm:text-2xl">More Coaches</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {COACHES.filter((c) => c.slug !== coach.slug).slice(0, 5).map((c) => (
              <Link
                key={c.slug}
                to="/coaches/$slug"
                params={{ slug: c.slug }}
                className="group block overflow-hidden rounded-lg border border-border bg-background"
              >
                <div className="aspect-square overflow-hidden bg-elevated">
                  <img
                    src={c.photo}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <div className="font-display text-sm font-semibold">{c.name}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground line-clamp-1">
                    {c.specialty}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SocialChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
      {icon} {label}
    </span>
  );
}
