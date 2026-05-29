// Source-of-truth exercise library. Append to `exercises` to expand.

export type ExerciseCategory = "Push" | "Pull" | "Legs" | "Arms" | "Core";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type ExerciseType = "Compound" | "Isolation";

// Maps to the interactive body map regions
export type BodyMapRegion =
  | "chest"
  | "shoulders"
  | "triceps"
  | "biceps"
  | "forearms"
  | "upper_back"
  | "lats"
  | "traps"
  | "lower_back"
  | "core"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "calves";

export interface Exercise {
  slug: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscle: string;
  secondaryMuscles: string[];
  bodyMapRegion: BodyMapRegion;
  equipment: string[];
  difficulty: Difficulty;
  exerciseType: ExerciseType;
  youtubeUrl: string;
  thumbnailUrl: string;
  description?: string;
  instructions?: string[];
  commonMistakes?: string[];
  formTips?: string[];
  alternatives?: string[]; // slugs
}

export const CATEGORIES: ExerciseCategory[] = [
  "Push",
  "Pull",
  "Legs",
  "Arms",
  "Core",
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}

function ytThumb(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

type RawExercise = Omit<Exercise, "slug" | "thumbnailUrl">;

const RAW: RawExercise[] = [
  // ---------------- PUSH ----------------
  {
    name: "Barbell Bench Press",
    category: "Push",
    primaryMuscle: "Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    bodyMapRegion: "chest",
    equipment: ["Barbell", "Bench"],
    difficulty: "Beginner",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
  },
  {
    name: "Dumbbell Bench Press",
    category: "Push",
    primaryMuscle: "Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    bodyMapRegion: "chest",
    equipment: ["Dumbbells", "Bench"],
    difficulty: "Beginner",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=VmB1G1K7v94",
  },
  {
    name: "Incline Dumbbell Press",
    category: "Push",
    primaryMuscle: "Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    bodyMapRegion: "chest",
    equipment: ["Dumbbells", "Bench"],
    difficulty: "Intermediate",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
  },
  {
    name: "Incline Barbell Bench Press",
    category: "Push",
    primaryMuscle: "Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    bodyMapRegion: "chest",
    equipment: ["Barbell", "Bench"],
    difficulty: "Intermediate",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=SrqOu55lrYU",
  },
  {
    name: "Machine Chest Press",
    category: "Push",
    primaryMuscle: "Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    bodyMapRegion: "chest",
    equipment: ["Machine"],
    difficulty: "Beginner",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=xUm0BiZCWlQ",
  },
  {
    name: "Push-Up",
    category: "Push",
    primaryMuscle: "Chest",
    secondaryMuscles: ["Front Delts", "Triceps"],
    bodyMapRegion: "chest",
    equipment: ["Bodyweight"],
    difficulty: "Beginner",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
  },
  {
    name: "Dips (Chest Focus)",
    category: "Push",
    primaryMuscle: "Chest",
    secondaryMuscles: ["Triceps", "Front Delts"],
    bodyMapRegion: "chest",
    equipment: ["Bodyweight"],
    difficulty: "Advanced",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=sM6XUdt1rm4",
  },
  {
    name: "Standing Overhead Press",
    category: "Push",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["Triceps", "Upper Back"],
    bodyMapRegion: "shoulders",
    equipment: ["Barbell"],
    difficulty: "Intermediate",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=_RlRDWO2jfg",
  },
  {
    name: "Seated Dumbbell Shoulder Press",
    category: "Push",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["Triceps"],
    bodyMapRegion: "shoulders",
    equipment: ["Dumbbells", "Bench"],
    difficulty: "Beginner",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=qEwKCR5JCog",
  },
  {
    name: "Dumbbell Lateral Raise",
    category: "Push",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    bodyMapRegion: "shoulders",
    equipment: ["Dumbbells"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo",
  },
  {
    name: "Cable Lateral Raise",
    category: "Push",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    bodyMapRegion: "shoulders",
    equipment: ["Cable Machine"],
    difficulty: "Intermediate",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=Z5FA9aq3L6A",
  },
  {
    name: "Cable Crossover",
    category: "Push",
    primaryMuscle: "Chest",
    secondaryMuscles: ["Front Delts"],
    bodyMapRegion: "chest",
    equipment: ["Cable Machine"],
    difficulty: "Intermediate",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=JUDTGZh4rhg",
  },
  {
    name: "Pec Deck Machine Flye",
    category: "Push",
    primaryMuscle: "Chest",
    secondaryMuscles: [],
    bodyMapRegion: "chest",
    equipment: ["Machine"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=H4mVGHaK2f4",
  },
  {
    name: "Triceps Rope Pushdown",
    category: "Push",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    bodyMapRegion: "triceps",
    equipment: ["Cable Machine"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=2-LAMcpzODU",
  },
  {
    name: "Close-Grip Barbell Bench Press",
    category: "Push",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["Chest", "Front Delts"],
    bodyMapRegion: "triceps",
    equipment: ["Barbell", "Bench"],
    difficulty: "Intermediate",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=nEF0bv2FW94",
  },

  // ---------------- PULL ----------------
  {
    name: "Conventional Barbell Deadlift",
    category: "Pull",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["Glutes", "Upper Back", "Traps"],
    bodyMapRegion: "hamstrings",
    equipment: ["Barbell"],
    difficulty: "Advanced",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=hCDzSR6bW10",
  },
  {
    name: "Pull-Up",
    category: "Pull",
    primaryMuscle: "Lats",
    secondaryMuscles: ["Upper Back", "Biceps"],
    bodyMapRegion: "lats",
    equipment: ["Bodyweight"],
    difficulty: "Advanced",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
  },
  {
    name: "Lat Pulldown",
    category: "Pull",
    primaryMuscle: "Lats",
    secondaryMuscles: ["Upper Back", "Biceps"],
    bodyMapRegion: "lats",
    equipment: ["Cable Machine"],
    difficulty: "Beginner",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
  },
  {
    name: "Barbell Bent-Over Row",
    category: "Pull",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["Lats", "Rear Delts", "Biceps"],
    bodyMapRegion: "upper_back",
    equipment: ["Barbell"],
    difficulty: "Intermediate",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=9efgcAjQe7E",
  },
  {
    name: "Single-Arm Dumbbell Row",
    category: "Pull",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["Lats", "Biceps"],
    bodyMapRegion: "upper_back",
    equipment: ["Dumbbells", "Bench"],
    difficulty: "Beginner",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=pYcpY20QaE8",
  },
  {
    name: "Seated Cable Row",
    category: "Pull",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["Lats", "Biceps"],
    bodyMapRegion: "upper_back",
    equipment: ["Cable Machine"],
    difficulty: "Beginner",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=GZbfZ033f74",
  },
  {
    name: "Chest-Supported T-Bar Row",
    category: "Pull",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["Lats", "Rear Delts", "Biceps"],
    bodyMapRegion: "upper_back",
    equipment: ["Machine"],
    difficulty: "Beginner",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=usyYceih-sI",
  },
  {
    name: "Face Pull",
    category: "Pull",
    primaryMuscle: "Rear Delts",
    secondaryMuscles: ["Upper Back", "Traps"],
    bodyMapRegion: "shoulders",
    equipment: ["Cable Machine"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=eIq5CB9JfKE",
  },
  {
    name: "Dumbbell Rear Delt Flye",
    category: "Pull",
    primaryMuscle: "Rear Delts",
    secondaryMuscles: ["Upper Back"],
    bodyMapRegion: "shoulders",
    equipment: ["Dumbbells"],
    difficulty: "Intermediate",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=ttvfGg9d76c",
  },
  {
    name: "Barbell Shrug",
    category: "Pull",
    primaryMuscle: "Traps",
    secondaryMuscles: ["Upper Back"],
    bodyMapRegion: "traps",
    equipment: ["Barbell"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=jTVbilkxSAk",
  },
  {
    name: "Straight-Arm Cable Pulldown",
    category: "Pull",
    primaryMuscle: "Lats",
    secondaryMuscles: ["Rear Delts", "Core"],
    bodyMapRegion: "lats",
    equipment: ["Cable Machine"],
    difficulty: "Intermediate",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=AjCCGN2tU3Q",
  },
  {
    name: "Reverse Pec Deck Flye",
    category: "Pull",
    primaryMuscle: "Rear Delts",
    secondaryMuscles: ["Upper Back"],
    bodyMapRegion: "shoulders",
    equipment: ["Machine"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=MOBQn99Z1T4",
  },

  // ---------------- ARMS ----------------
  {
    name: "Inverted Bodyweight Bicep Curl",
    category: "Arms",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["Forearms", "Upper Back"],
    bodyMapRegion: "biceps",
    equipment: ["Bodyweight", "Pull-Up Bar"],
    difficulty: "Intermediate",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=yMRJ_ARQLPM",
  },
  {
    name: "Bodyweight Tricep Skull Crusher",
    category: "Arms",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["Chest", "Shoulders"],
    bodyMapRegion: "triceps",
    equipment: ["Bodyweight", "Pull-Up Bar"],
    difficulty: "Intermediate",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=6SS6K3lAiYY",
  },
  {
    name: "Hammer Grip Pull-Up",
    category: "Arms",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["Forearms", "Lats"],
    bodyMapRegion: "biceps",
    equipment: ["Bodyweight", "Pull-Up Bar"],
    difficulty: "Intermediate",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=AS1FUwbMSdQ",
  },
  {
    name: "Active Towel Dead Hang",
    category: "Arms",
    primaryMuscle: "Forearms",
    secondaryMuscles: ["Lats", "Core"],
    bodyMapRegion: "forearms",
    equipment: ["Bodyweight", "Pull-Up Bar", "Towel"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=5R54QoUJaIY",
  },
  {
    name: "Dumbbell Bicep Curl",
    category: "Arms",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["Forearms"],
    bodyMapRegion: "biceps",
    equipment: ["Dumbbells"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
  },
  {
    name: "Dumbbell Hammer Curl",
    category: "Arms",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["Forearms"],
    bodyMapRegion: "biceps",
    equipment: ["Dumbbells"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4",
  },
  {
    name: "Overhead Dumbbell Tricep Extension",
    category: "Arms",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    bodyMapRegion: "triceps",
    equipment: ["Dumbbells"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=YbX7Wd8jQ-Q",
  },

  // ---------------- LEGS ----------------
  {
    name: "Barbell Back Squat",
    category: "Legs",
    primaryMuscle: "Quads",
    secondaryMuscles: ["Glutes", "Hamstrings", "Core"],
    bodyMapRegion: "quads",
    equipment: ["Barbell"],
    difficulty: "Intermediate",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8",
  },
  {
    name: "Bulgarian Split Squat",
    category: "Legs",
    primaryMuscle: "Quads",
    secondaryMuscles: ["Glutes", "Hamstrings"],
    bodyMapRegion: "quads",
    equipment: ["Bodyweight", "Bench"],
    difficulty: "Intermediate",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE",
  },
  {
    name: "Explosive Bodyweight Jump Squat",
    category: "Legs",
    primaryMuscle: "Quads",
    secondaryMuscles: ["Glutes", "Calves"],
    bodyMapRegion: "quads",
    equipment: ["Bodyweight"],
    difficulty: "Intermediate",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=A-cFYWvaHr0",
  },
  {
    name: "Romanian Deadlift",
    category: "Legs",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["Glutes", "Lower Back"],
    bodyMapRegion: "hamstrings",
    equipment: ["Barbell"],
    difficulty: "Intermediate",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=jEy_czb3RKA",
  },
  {
    name: "Walking Dumbbell Lunge",
    category: "Legs",
    primaryMuscle: "Quads",
    secondaryMuscles: ["Glutes", "Hamstrings"],
    bodyMapRegion: "quads",
    equipment: ["Dumbbells"],
    difficulty: "Beginner",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=L8fvypPrzzs",
  },
  {
    name: "Leg Press",
    category: "Legs",
    primaryMuscle: "Quads",
    secondaryMuscles: ["Glutes", "Hamstrings"],
    bodyMapRegion: "quads",
    equipment: ["Machine"],
    difficulty: "Beginner",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
  },
  {
    name: "Lying Leg Curl",
    category: "Legs",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: [],
    bodyMapRegion: "hamstrings",
    equipment: ["Machine"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
  },
  {
    name: "Standing Calf Raise",
    category: "Legs",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    bodyMapRegion: "calves",
    equipment: ["Machine"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=-M4-G8p8fmc",
  },
  {
    name: "Hip Thrust",
    category: "Legs",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["Hamstrings"],
    bodyMapRegion: "glutes",
    equipment: ["Barbell", "Bench"],
    difficulty: "Intermediate",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=xDmFkJxPzeM",
  },

  // ---------------- CORE ----------------
  {
    name: "Hanging Knee Raise",
    category: "Core",
    primaryMuscle: "Core",
    secondaryMuscles: ["Hip Flexors", "Forearms"],
    bodyMapRegion: "core",
    equipment: ["Bodyweight", "Pull-Up Bar"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=Pr1ieGZ5atk",
  },
  {
    name: "Toes-to-Bar",
    category: "Core",
    primaryMuscle: "Core",
    secondaryMuscles: ["Hip Flexors", "Lats"],
    bodyMapRegion: "core",
    equipment: ["Bodyweight", "Pull-Up Bar"],
    difficulty: "Advanced",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=_03pCKOv4l4",
  },
  {
    name: "Hollow Body Rock",
    category: "Core",
    primaryMuscle: "Core",
    secondaryMuscles: ["Hip Flexors"],
    bodyMapRegion: "core",
    equipment: ["Bodyweight"],
    difficulty: "Intermediate",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=LlDNef_Ztsc",
  },
  {
    name: "Plank",
    category: "Core",
    primaryMuscle: "Core",
    secondaryMuscles: ["Shoulders", "Glutes"],
    bodyMapRegion: "core",
    equipment: ["Bodyweight"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=ASdvN_XEl_c",
  },
  {
    name: "Cable Crunch",
    category: "Core",
    primaryMuscle: "Core",
    secondaryMuscles: [],
    bodyMapRegion: "core",
    equipment: ["Cable Machine"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=6GMKPQVERzw",
  },
  {
    name: "Russian Twist",
    category: "Core",
    primaryMuscle: "Core",
    secondaryMuscles: ["Obliques"],
    bodyMapRegion: "core",
    equipment: ["Bodyweight"],
    difficulty: "Beginner",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=wkD8rjkodUI",
  },
  {
    name: "Ab Wheel Rollout",
    category: "Core",
    primaryMuscle: "Core",
    secondaryMuscles: ["Lats", "Shoulders"],
    bodyMapRegion: "core",
    equipment: ["Ab Wheel"],
    difficulty: "Advanced",
    exerciseType: "Isolation",
    youtubeUrl: "https://www.youtube.com/watch?v=rqiTPdK1c_I",
  },

  // ---------------- PULL (Advanced bodyweight) ----------------
  {
    name: "Muscle-Up",
    category: "Pull",
    primaryMuscle: "Lats",
    secondaryMuscles: ["Chest", "Triceps", "Biceps"],
    bodyMapRegion: "lats",
    equipment: ["Bodyweight", "Pull-Up Bar"],
    difficulty: "Advanced",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=rRoFKdRvOOE",
  },
  {
    name: "Wide-Grip Pull-Up",
    category: "Pull",
    primaryMuscle: "Lats",
    secondaryMuscles: ["Upper Back", "Biceps"],
    bodyMapRegion: "lats",
    equipment: ["Bodyweight", "Pull-Up Bar"],
    difficulty: "Advanced",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=HRV5YKKaeVw",
  },
  {
    name: "Chin-Up",
    category: "Pull",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["Lats", "Upper Back"],
    bodyMapRegion: "biceps",
    equipment: ["Bodyweight", "Pull-Up Bar"],
    difficulty: "Intermediate",
    exerciseType: "Compound",
    youtubeUrl: "https://www.youtube.com/watch?v=brhRXlOhsAM",
  },
];

export const exercises: Exercise[] = RAW.map((e) => ({
  ...e,
  slug: slugify(e.name),
  thumbnailUrl: ytThumb(e.youtubeUrl),
}));

export function getExerciseBySlug(slug: string): Exercise | undefined {
  return exercises.find((e) => e.slug === slug);
}

export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return exercises.filter((e) => e.category === category);
}

export function getExercisesByRegion(region: BodyMapRegion): Exercise[] {
  return exercises.filter((e) => e.bodyMapRegion === region);
}

export const ALL_EQUIPMENT: string[] = Array.from(
  new Set(exercises.flatMap((e) => e.equipment)),
).sort();

export const ALL_MUSCLES: string[] = Array.from(
  new Set(exercises.map((e) => e.primaryMuscle)),
).sort();
