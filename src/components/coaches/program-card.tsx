import { Link } from "@tanstack/react-router";
import { Bookmark, Clock, Target, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { Coach, Program } from "@/lib/coaches/data";
import { useSavedPrograms, useStartedPrograms } from "@/lib/coaches/storage";


export function ProgramCard({
  program,
  coach,
  showCoach = true,
}: {
  program: Program;
  coach: Coach;
  showCoach?: boolean;
}) {
  const saved = useSavedPrograms();
  const started = useStartedPrograms();
  const id = `${coach.slug}/${program.slug}`;
  const isSaved = saved.has(id);
  const isStarted = started.has(id);

  const handleStart = () => {
    started.add(id);
    toast.success(`${program.name} added to My Lift`, {
      description: `Coach ${coach.name} • Week 1 starts now`,
    });
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-lime/40">
      <div className="relative aspect-[16/10] overflow-hidden bg-elevated">
        <img
          src={program.cover}
          alt={program.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="inline-block rounded-sm bg-lime px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            {program.difficulty}
          </span>
        </div>
        <button
          onClick={() => saved.toggle(id)}
          aria-label={isSaved ? "Unsave program" : "Save program"}
          className={
            "absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur " +
            (isSaved
              ? "border-lime/40 bg-lime/20 text-lime"
              : "border-border/60 bg-background/70 text-foreground hover:text-lime")
          }
        >
          <Bookmark className={"h-4 w-4 " + (isSaved ? "fill-current" : "")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold leading-tight">{program.name}</h3>
        {showCoach && (
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
            Coach {coach.name}
          </p>
        )}
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{program.summary}</p>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <Meta icon={<Target className="h-3.5 w-3.5" />} label={program.goal} />
          <Meta icon={<Clock className="h-3.5 w-3.5" />} label={program.duration} />
          <Meta icon={<Calendar className="h-3.5 w-3.5" />} label={`${program.daysPerWeek}x / week`} />
          <Meta icon={<Clock className="h-3.5 w-3.5" />} label={program.sessionLength} />
        </dl>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleStart}
            className={
              isStarted
                ? "flex-1 rounded-md border border-lime/40 bg-lime/10 px-3 py-2 text-xs font-semibold text-lime"
                : "flex-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
            }
          >
            {isStarted ? "In My Lift" : "Start Program"}
          </button>
          <button
            onClick={() => saved.toggle(id)}
            className="rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-elevated"
          >
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-muted-foreground">
      {icon}
      <span className="truncate">{label}</span>
    </div>
  );
}
