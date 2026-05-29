import { Link } from "@tanstack/react-router";
import muscleMapFront from "@/assets/muscle-map-front.png";
import muscleMapBack from "@/assets/muscle-map-back.png";

type Hotspot = {
  slug: string;
  label: string;
  top: number;
  left: number;
  width: number;
  height: number;
};

// Coords are % of the respective image (front or back).
const FRONT_HOTSPOTS: Hotspot[] = [
  { slug: "shoulders", label: "Shoulders", top: 17, left: 47, width: 5, height: 6 },
  { slug: "shoulders", label: "Shoulders", top: 17, left: 57, width: 5, height: 6 },
  { slug: "chest", label: "Chest", top: 20, left: 50, width: 9, height: 9 },
  { slug: "biceps", label: "Biceps", top: 25, left: 45, width: 4, height: 9 },
  { slug: "biceps", label: "Biceps", top: 25, left: 60, width: 4, height: 9 },
  { slug: "forearms", label: "Forearms", top: 34, left: 43, width: 4, height: 11 },
  { slug: "forearms", label: "Forearms", top: 34, left: 62, width: 4, height: 11 },
  { slug: "abs", label: "Abs", top: 28, left: 51, width: 6, height: 17 },
  { slug: "quads", label: "Quads", top: 50, left: 48, width: 5, height: 18 },
  { slug: "quads", label: "Quads", top: 50, left: 55, width: 5, height: 18 },
  { slug: "calves", label: "Calves", top: 70, left: 48, width: 4.5, height: 10 },
  { slug: "calves", label: "Calves", top: 70, left: 55, width: 4.5, height: 10 },
];

const BACK_HOTSPOTS: Hotspot[] = [
  { slug: "back", label: "Upper Back", top: 19, left: 50, width: 9, height: 8 },
  { slug: "back", label: "Lats", top: 26, left: 47, width: 14, height: 11 },
  { slug: "triceps", label: "Triceps", top: 23, left: 43, width: 4, height: 11 },
  { slug: "triceps", label: "Triceps", top: 23, left: 62, width: 4, height: 11 },
  { slug: "forearms", label: "Forearms", top: 34, left: 41, width: 4, height: 11 },
  { slug: "forearms", label: "Forearms", top: 34, left: 64, width: 4, height: 11 },
  { slug: "back", label: "Lower Back", top: 37, left: 50, width: 9, height: 6 },
  { slug: "glutes", label: "Glutes", top: 44, left: 48, width: 11, height: 11 },
  { slug: "hamstrings", label: "Hamstrings", top: 55, left: 48, width: 5, height: 14 },
  { slug: "hamstrings", label: "Hamstrings", top: 55, left: 55, width: 5, height: 14 },
  { slug: "calves", label: "Calves", top: 70, left: 48, width: 4.5, height: 10 },
  { slug: "calves", label: "Calves", top: 70, left: 55, width: 4.5, height: 10 },
];

function MapPanel({
  src,
  alt,
  hotspots,
  side,
}: {
  src: string;
  alt: string;
  hotspots: Hotspot[];
  side: "front" | "back";
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-black">
      <img src={src} alt={alt} className="block h-auto w-full select-none" draggable={false} />
      {hotspots.map((h, i) => (
        <Link
          key={`${side}-${h.slug}-${i}`}
          to="/muscles/$slug"
          params={{ slug: h.slug }}
          aria-label={`${h.label} exercises`}
          title={h.label}
          className="group absolute rounded-md outline-none ring-0 transition-all duration-200 hover:bg-lime/25 hover:ring-2 hover:ring-lime focus-visible:bg-lime/25 focus-visible:ring-2 focus-visible:ring-lime"
          style={{
            top: `${h.top}%`,
            left: `${h.left}%`,
            width: `${h.width}%`,
            height: `${h.height}%`,
          }}
        >
          <span className="sr-only">{h.label}</span>
        </Link>
      ))}
    </div>
  );
}

function MuscleLabels({ hotspots }: { hotspots: Hotspot[] }) {
  const unique = Array.from(
    new Map(
      hotspots.map((h) => [h.slug, h.label.replace(/^(Upper |Lower )/, "")]),
    ).entries(),
  );
  return (
    <div className="mt-3 flex flex-wrap justify-center gap-2">
      {unique.map(([slug, label]) => (
        <Link
          key={slug}
          to="/muscles/$slug"
          params={{ slug }}
          className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-lime hover:bg-lime/10 hover:text-lime"
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

export function MuscleMapImage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Mobile: stacked. Tablet+: side-by-side */}
      <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 sm:gap-8">
        <div>
          <MapPanel
            src={muscleMapFront}
            alt="Front muscle map — tap any muscle group to see exercises"
            hotspots={FRONT_HOTSPOTS}
            side="front"
          />
          <MuscleLabels hotspots={FRONT_HOTSPOTS} />
        </div>
        <div>
          <MapPanel
            src={muscleMapBack}
            alt="Back muscle map — tap any muscle group to see exercises"
            hotspots={BACK_HOTSPOTS}
            side="back"
          />
          <MuscleLabels hotspots={BACK_HOTSPOTS} />
        </div>
      </div>
    </div>
  );
}
