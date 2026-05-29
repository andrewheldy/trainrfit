import { Link } from "@tanstack/react-router";
import muscleMap from "@/assets/muscle-map.png";

/**
 * Hotspot coords are percentages of the full source image (front + back side-by-side).
 * Each hotspot routes to the corresponding /muscles/$slug page.
 */
type Hotspot = {
  slug: string;
  label: string;
  // top/left/width/height as % of image
  top: number;
  left: number;
  width: number;
  height: number;
};

const FRONT_HOTSPOTS: Hotspot[] = [
  { slug: "shoulders", label: "Shoulders", top: 19, left: 23.5, width: 4.5, height: 6 },
  { slug: "shoulders", label: "Shoulders", top: 19, left: 32.5, width: 4.5, height: 6 },
  { slug: "chest", label: "Chest", top: 21, left: 26.5, width: 8, height: 9 },
  { slug: "biceps", label: "Biceps", top: 27, left: 22, width: 3, height: 9 },
  { slug: "biceps", label: "Biceps", top: 27, left: 35.5, width: 3, height: 9 },
  { slug: "forearms", label: "Forearms", top: 37, left: 20.5, width: 3.5, height: 10 },
  { slug: "forearms", label: "Forearms", top: 37, left: 36.5, width: 3.5, height: 10 },
  { slug: "abs", label: "Abs", top: 30, left: 28, width: 5, height: 15 },
  { slug: "obliques", label: "Obliques", top: 32, left: 26, width: 2, height: 10 },
  { slug: "obliques", label: "Obliques", top: 32, left: 33, width: 2, height: 10 },
  { slug: "quads", label: "Quads", top: 49, left: 25, width: 4.5, height: 18 },
  { slug: "quads", label: "Quads", top: 49, left: 31, width: 4.5, height: 18 },
  { slug: "calves", label: "Calves", top: 67, left: 25.5, width: 4, height: 10 },
  { slug: "calves", label: "Calves", top: 67, left: 31, width: 4, height: 10 },
];

const BACK_HOTSPOTS: Hotspot[] = [
  { slug: "back", label: "Upper Back", top: 22, left: 65, width: 8, height: 8 },
  { slug: "back", label: "Lats", top: 28, left: 62, width: 14, height: 10 },
  { slug: "triceps", label: "Triceps", top: 27, left: 58, width: 3.5, height: 10 },
  { slug: "triceps", label: "Triceps", top: 27, left: 76, width: 3.5, height: 10 },
  { slug: "forearms", label: "Forearms", top: 38, left: 56, width: 3.5, height: 10 },
  { slug: "forearms", label: "Forearms", top: 38, left: 79, width: 3.5, height: 10 },
  { slug: "back", label: "Lower Back", top: 39, left: 65, width: 8, height: 6 },
  { slug: "glutes", label: "Glutes", top: 45, left: 63, width: 12, height: 10 },
  { slug: "hamstrings", label: "Hamstrings", top: 55, left: 63, width: 4.5, height: 14 },
  { slug: "hamstrings", label: "Hamstrings", top: 55, left: 71, width: 4.5, height: 14 },
  { slug: "calves", label: "Calves", top: 67, left: 63.5, width: 4, height: 10 },
  { slug: "calves", label: "Calves", top: 67, left: 71, width: 4, height: 10 },
];

const HOTSPOTS: Hotspot[] = [...FRONT_HOTSPOTS, ...BACK_HOTSPOTS];

/**
 * Renders the full side-by-side source image cropped to one half.
 * `side` controls whether the front (left 50%) or back (right 50%) is shown.
 * Hotspots are remapped from full-image coordinates to half-image coordinates.
 */
function HalfMap({ side, hotspots }: { side: "front" | "back"; hotspots: Hotspot[] }) {
  const offsetLeft = side === "front" ? 0 : 50; // % of full image to subtract
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-black">
      {/* Image is rendered at 200% width and shifted so the desired half fills the box */}
      <div className="relative w-full" style={{ aspectRatio: "1 / 2" }}>
        <img
          src={muscleMap}
          alt={
            side === "front"
              ? "Front muscle map — tap any muscle group to see exercises"
              : "Back muscle map — tap any muscle group to see exercises"
          }
          className="absolute top-0 h-full max-w-none select-none"
          style={{
            width: "200%",
            left: side === "front" ? "0%" : "-100%",
          }}
          draggable={false}
        />
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
              left: `${(h.left - offsetLeft) * 2}%`,
              width: `${h.width * 2}%`,
              height: `${h.height}%`,
            }}
          >
            <span className="sr-only">{h.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MuscleMapImage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Mobile: stacked front + back halves */}
      <div className="flex flex-col gap-4 sm:hidden">
        <HalfMap side="front" hotspots={FRONT_HOTSPOTS} />
        <HalfMap side="back" hotspots={BACK_HOTSPOTS} />
      </div>

      {/* Tablet+ : original side-by-side image with all hotspots */}
      <div className="relative hidden overflow-hidden rounded-xl border border-border bg-black sm:block">
        <img
          src={muscleMap}
          alt="Interactive muscle map — tap any muscle group to see exercises"
          className="block h-auto w-full select-none"
          draggable={false}
        />

        {HOTSPOTS.map((h, i) => (
          <Link
            key={`${h.slug}-${i}`}
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
    </div>
  );
}
