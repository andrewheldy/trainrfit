import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Users, Layers } from "lucide-react";
import { COACHES, formatFollowers, getAllPrograms } from "@/lib/coaches/data";

export function FeaturedCoachesSection() {
  const featured = COACHES.slice(0, 10);
  const programs = getAllPrograms().slice(0, 6);

  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="label-eyebrow">Train With Coaches</div>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Train With The Coaches You Follow
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Follow expert-created workout programs, stay accountable, and train using the exact
              systems used by top fitness creators.
            </p>
          </div>
          <Link
            to="/coaches"
            className="hidden text-sm font-semibold text-lime hover:underline sm:inline-flex"
          >
            Browse all coaches →
          </Link>
        </div>

        {/* Coach grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {featured.map((coach) => (
            <Link
              key={coach.slug}
              to="/coaches/$slug"
              params={{ slug: coach.slug }}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-colors hover:border-lime/40"
            >
              <div className="relative aspect-square overflow-hidden bg-elevated">
                <img
                  src={coach.photo}
                  alt={coach.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                {coach.verified && (
                  <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-background/85 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-lime backdrop-blur">
                    <BadgeCheck className="h-2.5 w-2.5" />
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <h3 className="font-display text-sm font-semibold leading-tight">{coach.name}</h3>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground line-clamp-2">
                  {coach.specialty}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2 text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" /> {formatFollowers(coach.followers)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Layers className="h-3 w-3" /> {coach.programs.length}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured programs */}
        <div className="mt-14">
          <h3 className="font-display text-xl font-semibold sm:text-2xl">Featured Programs</h3>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {programs.map((p) => (
              <Link
                key={`${p.coach.slug}/${p.slug}`}
                to="/coaches/$slug"
                params={{ slug: p.coach.slug }}
                className="group block overflow-hidden rounded-lg border border-border bg-background transition-colors hover:border-lime/40"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-elevated">
                  <img
                    src={p.cover}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3">
                    <div className="text-[10px] uppercase tracking-wider text-lime">
                      {p.difficulty}
                    </div>
                    <div className="font-display text-sm font-semibold text-white">{p.name}</div>
                    <div className="text-[10px] text-white/70">
                      {p.duration} • {p.goal}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-lg border border-border bg-background p-6 sm:p-10">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr,auto]">
            <div className="max-w-2xl">
              <h3 className="font-display text-2xl font-bold sm:text-3xl">
                Train Smarter With Expert Programming
              </h3>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Whether you want to build muscle, lose fat, get stronger, or improve athletic
                performance, follow proven training systems from coaches who specialize in your
                goals.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/coaches"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Browse Coaches <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/become-a-coach"
                className="inline-flex items-center rounded-md border border-border px-5 py-3 text-sm font-semibold hover:bg-elevated"
              >
                Become A Coach
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
