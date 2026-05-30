import { exercises, type Exercise } from "@/data/exercises";
import type { OnboardingProfile, OnboardingResults, PlanExercise, PlanWorkout, Program } from "./types";

const EQUIP_MAP: Record<string, string[]> = {
  "Commercial Gym": ["Barbell", "Dumbbells", "Machine", "Cable Machine", "Bench", "Bodyweight"],
  "Dumbbells": ["Dumbbells", "Bench", "Bodyweight"],
  "Barbell": ["Barbell", "Bench", "Bodyweight"],
  "Machines": ["Machine", "Bodyweight"],
  "Cable Machine": ["Cable Machine", "Bodyweight"],
  "Kettlebells": ["Bodyweight"],
  "Resistance Bands": ["Bodyweight"],
  "Bodyweight Only": ["Bodyweight", "Pull-Up Bar"],
  "Home Gym": ["Dumbbells", "Barbell", "Bench", "Bodyweight", "Pull-Up Bar"],
};

const INJURY_AVOID: Record<string, string[]> = {
  Shoulder: ["shoulders", "chest"],
  Knee: ["quads", "calves"],
  Back: ["lower_back", "hamstrings"],
  Elbow: ["triceps", "biceps"],
  Wrist: ["forearms"],
  Hip: ["glutes", "hamstrings"],
  Ankle: ["calves"],
};

function allowedEquipment(profile: OnboardingProfile): Set<string> {
  const set = new Set<string>(["Bodyweight"]);
  profile.equipment.forEach((e) => EQUIP_MAP[e]?.forEach((x) => set.add(x)));
  if (set.size <= 1 && profile.equipment.length === 0) {
    ["Barbell", "Dumbbells", "Machine", "Cable Machine", "Bench", "Bodyweight"].forEach((x) => set.add(x));
  }
  return set;
}

function injuryAvoidSet(profile: OnboardingProfile): Set<string> {
  const set = new Set<string>();
  profile.injuries.forEach((i) => INJURY_AVOID[i]?.forEach((r) => set.add(r)));
  return set;
}

function pickExercise(
  candidates: Exercise[],
  used: Set<string>,
  beginner: boolean,
): Exercise | null {
  const pool = candidates.filter((e) => !used.has(e.slug));
  if (pool.length === 0) return candidates[0] ?? null;
  if (beginner) {
    const easy = pool.filter((e) => e.difficulty !== "Advanced");
    if (easy.length) return easy[0];
  }
  return pool[0];
}

function setsRepsFor(goal: string, isMain: boolean): { sets: number; reps: string; notes?: string } {
  if (goal === "Get Stronger") {
    return isMain
      ? { sets: 4, reps: "3-6", notes: "Heavy but clean technique." }
      : { sets: 3, reps: "8-12", notes: "Controlled accessory work." };
  }
  if (goal === "Lose Fat") {
    return { sets: 3, reps: "10-15", notes: "Short rest. Keep intensity up." };
  }
  // Build Muscle / Recomp / Health / Athletic / default
  return { sets: 3, reps: "8-12", notes: "Stop 1-2 reps before failure." };
}

interface Block {
  title: string;
  regions: string[]; // exercise bodyMapRegion targets in priority order
  isMain: boolean[];
}

const FULL_BODY_A: Block = {
  title: "Full Body A",
  regions: ["quads", "chest", "upper_back", "hamstrings", "core"],
  isMain: [true, true, true, true, false],
};
const FULL_BODY_B: Block = {
  title: "Full Body B",
  regions: ["quads", "lats", "shoulders", "glutes", "core"],
  isMain: [true, true, true, true, false],
};
const FULL_BODY_C: Block = {
  title: "Full Body C",
  regions: ["quads", "chest", "upper_back", "hamstrings", "core"],
  isMain: [true, true, true, true, false],
};
const PUSH: Block = {
  title: "Push",
  regions: ["chest", "shoulders", "chest", "triceps", "triceps"],
  isMain: [true, true, false, false, false],
};
const PULL: Block = {
  title: "Pull",
  regions: ["lats", "upper_back", "lats", "biceps", "core"],
  isMain: [true, true, false, false, false],
};
const LEGS: Block = {
  title: "Legs",
  regions: ["quads", "hamstrings", "glutes", "calves", "core"],
  isMain: [true, true, true, false, false],
};
const UPPER: Block = {
  title: "Upper",
  regions: ["chest", "lats", "shoulders", "upper_back", "biceps", "triceps"],
  isMain: [true, true, true, false, false, false],
};
const LOWER: Block = {
  title: "Lower",
  regions: ["quads", "hamstrings", "glutes", "calves", "core"],
  isMain: [true, true, true, false, false],
};

function blocksFor(split: string, days: number): Block[] {
  if (split.startsWith("Full Body 1x")) return [FULL_BODY_A];
  if (split.startsWith("Full Body 2x")) return [FULL_BODY_A, FULL_BODY_B];
  if (split.startsWith("Full Body 3x")) return [FULL_BODY_A, FULL_BODY_B, FULL_BODY_C];
  if (split.startsWith("Push / Pull / Legs (2x)")) return [PUSH, PULL, LEGS, PUSH, PULL, LEGS];
  if (split === "Push / Pull / Legs") return [PUSH, PULL, LEGS];
  if (split.startsWith("Push / Pull / Legs + Upper")) return [PUSH, PULL, LEGS, UPPER, LOWER];
  if (split.startsWith("Upper / Lower")) return [UPPER, LOWER, UPPER, LOWER];
  if (split.startsWith("5-6 training")) return [PUSH, PULL, LEGS, UPPER, LOWER];
  const arr = [FULL_BODY_A, FULL_BODY_B, FULL_BODY_C];
  while (arr.length < days) arr.push(FULL_BODY_A);
  return arr.slice(0, days);
}

export function generateWeekOnePlan(profile: OnboardingProfile, results: OnboardingResults): Program {
  const allowed = allowedEquipment(profile);
  const avoid = injuryAvoidSet(profile);
  const beginner = results.experienceLevel === "Beginner";
  const goal = profile.primaryGoal || "Improve General Health";
  const blocks = blocksFor(results.recommendedSplit, profile.realisticTrainingDays || 3);

  const filtered = exercises.filter((e) => e.equipment.every((eq) => allowed.has(eq)));

  const workouts: PlanWorkout[] = blocks.map((block, dayIdx) => {
    const used = new Set<string>();
    const exs: PlanExercise[] = block.regions.map((region, i) => {
      const targetRegion = avoid.has(region) ? fallbackRegion(region) : region;
      let candidates = filtered.filter((e) => e.bodyMapRegion === targetRegion);
      if (candidates.length === 0) candidates = exercises.filter((e) => e.bodyMapRegion === targetRegion);
      const picked = pickExercise(candidates, used, beginner);
      if (picked) used.add(picked.slug);
      const sr = setsRepsFor(goal, block.isMain[i]);
      const notes = avoid.has(region)
        ? `${sr.notes ?? ""} Modify as needed for ${profile.injuries.join(", ").toLowerCase()} sensitivity.`.trim()
        : sr.notes;
      return {
        name: picked?.name ?? "Bodyweight Squat",
        slug: picked?.slug,
        targetMuscle: picked?.primaryMuscle ?? region,
        sets: sr.sets,
        reps: sr.reps,
        notes,
      };
    });
    return {
      day: `Day ${dayIdx + 1}`,
      title: block.title,
      estimatedDuration: profile.preferredWorkoutLength || "45-60 minutes",
      exercises: exs,
    };
  });

  return {
    programName: "Gym Lift Week 1",
    recommendedSplit: results.recommendedSplit,
    daysPerWeek: profile.realisticTrainingDays || workouts.length,
    goal,
    workouts,
    createdAt: Date.now(),
  };
}

function fallbackRegion(r: string): string {
  const map: Record<string, string> = {
    shoulders: "upper_back",
    chest: "upper_back",
    quads: "glutes",
    calves: "core",
    hamstrings: "core",
    lower_back: "core",
    triceps: "shoulders",
    biceps: "lats",
    forearms: "biceps",
  };
  return map[r] ?? "core";
}
