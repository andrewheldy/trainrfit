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

const HOTSPOTS: Hotspot[] = [
  // ===== FRONT (left half) =====
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

  // ===== BACK (right half) =====
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

export function MuscleMapImage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="relative overflow-hidden rounded-xl border border-border bg-black">
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
