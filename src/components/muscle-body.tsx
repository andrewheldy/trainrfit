import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type MuscleKey =
  | "chest" | "shoulders" | "biceps" | "forearms" | "abs"
  | "quads" | "calves" | "back" | "triceps" | "glutes" | "hamstrings";

export interface MuscleSlug { slug: MuscleKey; name: string }

interface Props {
  view: "front" | "back";
  onHover?: (slug: MuscleKey | null) => void;
  active?: MuscleKey | null;
}

/**
 * Hand-built anatomical SVG muscle map. Each <path> targets a muscle group;
 * clicking it routes to /muscles/[slug]. Theme-aware via currentColor + lime.
 */
export function MuscleBody({ view, onHover, active }: Props) {
  const baseFill = "var(--elevated)";
  const stroke = "var(--border)";
  const accent = "var(--lime)";

  const pathStyle = (k: MuscleKey): CSSProperties => ({
    fill: active === k ? accent : baseFill,
    stroke,
    strokeWidth: 1,
    cursor: "pointer",
    transition: "fill 120ms ease",
  });

  const handlers = (k: MuscleKey) => ({
    onMouseEnter: () => onHover?.(k),
    onMouseLeave: () => onHover?.(null),
    style: pathStyle(k),
  });

  return (
    <svg
      viewBox="0 0 240 480"
      className="h-full w-full"
      role="img"
      aria-label={`${view} body muscle map`}
    >
      {/* Body silhouette outline */}
      <defs>
        <linearGradient id="silhouetteGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--surface)" />
          <stop offset="100%" stopColor="var(--background)" />
        </linearGradient>
      </defs>

      {/* Outer body shape (decorative) */}
      <path
        d="M120 12 c-14 0 -24 10 -24 24 c0 8 4 16 10 20 l-2 14 c-22 6 -38 18 -42 36 l-6 50 c-2 16 -2 30 2 44 l8 30 l-6 60 c-2 14 0 26 4 38 l8 50 c2 12 0 22 -4 32 l-4 26 c0 4 4 8 8 8 h12 c4 0 8 -4 8 -8 l4 -40 l6 -50 l4 -30 l6 30 l4 50 l4 40 c0 4 4 8 8 8 h12 c4 0 8 -4 8 -8 l-4 -26 c-4 -10 -6 -20 -4 -32 l8 -50 c4 -12 6 -24 4 -38 l-6 -60 l8 -30 c4 -14 4 -28 2 -44 l-6 -50 c-4 -18 -20 -30 -42 -36 l-2 -14 c6 -4 10 -12 10 -20 c0 -14 -10 -24 -24 -24 z"
        fill="url(#silhouetteGrad)"
        stroke={stroke}
        strokeWidth={1}
      />

      {view === "front" ? (
        <g>
          {/* Chest */}
          <Link to="/muscles/$slug" params={{ slug: "chest" }}>
            <path d="M88 90 q32 -10 64 0 l-2 28 q-30 -8 -60 0 z" {...handlers("chest")} />
          </Link>
          {/* Shoulders L */}
          <Link to="/muscles/$slug" params={{ slug: "shoulders" }}>
            <path d="M76 80 q-12 4 -16 22 l16 8 l8 -18 z" {...handlers("shoulders")} />
          </Link>
          {/* Shoulders R */}
          <Link to="/muscles/$slug" params={{ slug: "shoulders" }}>
            <path d="M164 80 q12 4 16 22 l-16 8 l-8 -18 z" {...handlers("shoulders")} />
          </Link>
          {/* Biceps L */}
          <Link to="/muscles/$slug" params={{ slug: "biceps" }}>
            <path d="M62 112 q-6 16 -4 36 l16 -4 l4 -34 z" {...handlers("biceps")} />
          </Link>
          {/* Biceps R */}
          <Link to="/muscles/$slug" params={{ slug: "biceps" }}>
            <path d="M178 112 q6 16 4 36 l-16 -4 l-4 -34 z" {...handlers("biceps")} />
          </Link>
          {/* Forearms L */}
          <Link to="/muscles/$slug" params={{ slug: "forearms" }}>
            <path d="M56 152 l4 36 l16 -2 l-4 -38 z" {...handlers("forearms")} />
          </Link>
          {/* Forearms R */}
          <Link to="/muscles/$slug" params={{ slug: "forearms" }}>
            <path d="M184 152 l-4 36 l-16 -2 l4 -38 z" {...handlers("forearms")} />
          </Link>
          {/* Abs */}
          <Link to="/muscles/$slug" params={{ slug: "abs" }}>
            <path d="M100 124 q20 -4 40 0 l-2 60 q-18 4 -36 0 z" {...handlers("abs")} />
          </Link>
          {/* Quads L */}
          <Link to="/muscles/$slug" params={{ slug: "quads" }}>
            <path d="M96 220 q12 -4 22 0 l-4 90 l-22 -4 z" {...handlers("quads")} />
          </Link>
          {/* Quads R */}
          <Link to="/muscles/$slug" params={{ slug: "quads" }}>
            <path d="M144 220 q-12 -4 -22 0 l4 90 l22 -4 z" {...handlers("quads")} />
          </Link>
          {/* Calves L */}
          <Link to="/muscles/$slug" params={{ slug: "calves" }}>
            <path d="M96 340 l16 -2 l-2 56 l-18 -4 z" {...handlers("calves")} />
          </Link>
          {/* Calves R */}
          <Link to="/muscles/$slug" params={{ slug: "calves" }}>
            <path d="M144 340 l-16 -2 l2 56 l18 -4 z" {...handlers("calves")} />
          </Link>
        </g>
      ) : (
        <g>
          {/* Back (lats + upper) */}
          <Link to="/muscles/$slug" params={{ slug: "back" }}>
            <path d="M86 86 q34 -10 68 0 l-4 90 q-30 8 -60 0 z" {...handlers("back")} />
          </Link>
          {/* Shoulders L (rear) */}
          <Link to="/muscles/$slug" params={{ slug: "shoulders" }}>
            <path d="M76 80 q-12 4 -16 22 l16 8 l8 -18 z" {...handlers("shoulders")} />
          </Link>
          <Link to="/muscles/$slug" params={{ slug: "shoulders" }}>
            <path d="M164 80 q12 4 16 22 l-16 8 l-8 -18 z" {...handlers("shoulders")} />
          </Link>
          {/* Triceps L */}
          <Link to="/muscles/$slug" params={{ slug: "triceps" }}>
            <path d="M62 112 q-6 16 -4 36 l16 -4 l4 -34 z" {...handlers("triceps")} />
          </Link>
          <Link to="/muscles/$slug" params={{ slug: "triceps" }}>
            <path d="M178 112 q6 16 4 36 l-16 -4 l-4 -34 z" {...handlers("triceps")} />
          </Link>
          {/* Forearms */}
          <Link to="/muscles/$slug" params={{ slug: "forearms" }}>
            <path d="M56 152 l4 36 l16 -2 l-4 -38 z" {...handlers("forearms")} />
          </Link>
          <Link to="/muscles/$slug" params={{ slug: "forearms" }}>
            <path d="M184 152 l-4 36 l-16 -2 l4 -38 z" {...handlers("forearms")} />
          </Link>
          {/* Glutes */}
          <Link to="/muscles/$slug" params={{ slug: "glutes" }}>
            <path d="M94 196 q26 -8 52 0 l-4 32 q-22 6 -44 0 z" {...handlers("glutes")} />
          </Link>
          {/* Hamstrings L */}
          <Link to="/muscles/$slug" params={{ slug: "hamstrings" }}>
            <path d="M96 232 q12 -4 22 0 l-4 80 l-22 -4 z" {...handlers("hamstrings")} />
          </Link>
          {/* Hamstrings R */}
          <Link to="/muscles/$slug" params={{ slug: "hamstrings" }}>
            <path d="M144 232 q-12 -4 -22 0 l4 80 l22 -4 z" {...handlers("hamstrings")} />
          </Link>
          {/* Calves L */}
          <Link to="/muscles/$slug" params={{ slug: "calves" }}>
            <path d="M96 340 l16 -2 l-2 56 l-18 -4 z" {...handlers("calves")} />
          </Link>
          <Link to="/muscles/$slug" params={{ slug: "calves" }}>
            <path d="M144 340 l-16 -2 l2 56 l18 -4 z" {...handlers("calves")} />
          </Link>
        </g>
      )}
    </svg>
  );
}

export function MuscleBodyExplorer({ view, setView, hover, setHover }: {
  view: "front" | "back";
  setView: (v: "front" | "back") => void;
  hover: MuscleKey | null;
  setHover: (k: MuscleKey | null) => void;
}) {
  return (
    <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
      <div className="flex justify-end">
        <div className="hidden sm:block">
          <div className="label-eyebrow">Hover a muscle</div>
          <div className="mt-2 font-display text-2xl">
            {hover ? hover.charAt(0).toUpperCase() + hover.slice(1) : "Pick a target"}
          </div>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Tap any muscle to see featured exercises, weekly volume, and form tips.
          </p>
        </div>
      </div>

      <div className="relative mx-auto h-[460px] w-[230px]">
        <MuscleBody view={view} onHover={setHover} active={hover} />
      </div>

      <div className="flex sm:justify-start">
        <div
          className={cn(
            "inline-flex overflow-hidden rounded-md border border-border bg-surface text-xs font-medium"
          )}
        >
          <button
            onClick={() => setView("front")}
            className={cn(
              "px-4 py-2 transition-colors",
              view === "front" ? "bg-elevated text-foreground" : "text-muted-foreground"
            )}
          >
            Front
          </button>
          <button
            onClick={() => setView("back")}
            className={cn(
              "px-4 py-2 transition-colors",
              view === "back" ? "bg-elevated text-foreground" : "text-muted-foreground"
            )}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
