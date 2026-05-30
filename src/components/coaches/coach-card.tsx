import { Link } from "@tanstack/react-router";
import { BadgeCheck, Users, Layers } from "lucide-react";
import { type Coach, formatFollowers } from "@/lib/coaches/data";
import { useFollowedCoaches } from "@/lib/coaches/storage";

export function CoachCard({ coach, compact = false }: { coach: Coach; compact?: boolean }) {
  const { has, toggle } = useFollowedCoaches();
  const followed = has(coach.slug);

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-lime/40">
      <Link
        to="/coaches/$slug"
        params={{ slug: coach.slug }}
        className="relative block aspect-[4/3] overflow-hidden bg-elevated"
      >
        <img
          src={coach.photo}
          alt={coach.name}
          loading="lazy"
          style={coach.photoPosition ? { objectPosition: coach.photoPosition } : undefined}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        {coach.verified && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-lime backdrop-blur">
            <BadgeCheck className="h-3 w-3" /> Verified
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to="/coaches/$slug" params={{ slug: coach.slug }}>
          <h3 className="font-display text-lg font-semibold leading-tight">{coach.name}</h3>
        </Link>
        <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
          {coach.specialty}
        </p>

        {!compact && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{coach.bio}</p>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {formatFollowers(coach.followers)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" /> {coach.programs.length} Programs
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => toggle(coach.slug)}
            className={
              followed
                ? "flex-1 rounded-md border border-lime/40 bg-lime/10 px-3 py-2 text-xs font-semibold text-lime"
                : "flex-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
            }
          >
            {followed ? "Following" : "Follow"}
          </button>
          <Link
            to="/coaches/$slug"
            params={{ slug: coach.slug }}
            className="flex-1 rounded-md border border-border px-3 py-2 text-center text-xs font-semibold hover:bg-elevated"
          >
            View Programs
          </Link>
        </div>
      </div>
    </div>
  );
}
