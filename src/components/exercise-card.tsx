import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExerciseCardData {
  slug: string;
  name: string;
  image_url: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  primary_muscle?: string | null;
  equipment?: string | null;
}

const difficultyLabel: Record<ExerciseCardData["difficulty"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function ExerciseCard({
  exercise,
  className,
}: {
  exercise: ExerciseCardData;
  className?: string;
}) {
  return (
    <Link
      to="/exercises/$slug"
      params={{ slug: exercise.slug }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-lime/40",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-elevated">
        {exercise.image_url ? (
          <img
            src={exercise.image_url}
            alt={exercise.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/95 to-transparent" />
        <div className="absolute left-3 top-3 inline-flex items-center rounded-sm bg-background/80 px-2 py-1 text-[10px] uppercase tracking-widest text-foreground backdrop-blur">
          {difficultyLabel[exercise.difficulty]}
        </div>
        <ArrowUpRight className="absolute right-3 top-3 h-5 w-5 text-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-base font-semibold leading-tight">{exercise.name}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {exercise.primary_muscle ? <span className="capitalize">{exercise.primary_muscle}</span> : null}
          {exercise.primary_muscle && exercise.equipment ? <span>·</span> : null}
          {exercise.equipment ? <span>{exercise.equipment}</span> : null}
        </div>
      </div>
    </Link>
  );
}
