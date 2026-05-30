export type HeightUnit = "imperial" | "metric";
export type WeightUnit = "lbs" | "kg";

export interface OnboardingProfile {
  age: number | null;
  sexAtBirth: "" | "Male" | "Female" | "Prefer not to say";
  gender: "" | "Male" | "Female" | "Non-binary" | "Prefer not to say" | "Self-describe";
  genderSelfDescribe?: string;
  height: {
    unit: HeightUnit;
    feet: number | null;
    inches: number | null;
    centimeters: number | null;
  };
  weight: { unit: WeightUnit; value: number | null };
  location: { country: "USA" | "Other" | ""; state: string; city: string; otherLocation: string };
  primaryGoal: string;
  trainingExperience: string;
  currentExerciseFrequency: string;
  realisticTrainingDays: number | null;
  preferredWorkoutLength: string;
  equipment: string[];
  focusMuscles: string[];
  injuries: string[];
  injuryDetails: string;
  fitnessLevelSelfAssessment: string;
  barriers: string[];
  motivation: string;
  preferredWorkoutStyle: string;
  onboardingComplete: boolean;
}

export const DEFAULT_PROFILE: OnboardingProfile = {
  age: null,
  sexAtBirth: "",
  gender: "",
  genderSelfDescribe: "",
  height: { unit: "imperial", feet: null, inches: null, centimeters: null },
  weight: { unit: "lbs", value: null },
  location: { country: "USA", state: "", city: "", otherLocation: "" },
  primaryGoal: "",
  trainingExperience: "",
  currentExerciseFrequency: "",
  realisticTrainingDays: null,
  preferredWorkoutLength: "",
  equipment: [],
  focusMuscles: [],
  injuries: [],
  injuryDetails: "",
  fitnessLevelSelfAssessment: "",
  barriers: [],
  motivation: "",
  preferredWorkoutStyle: "",
  onboardingComplete: false,
};

export interface OnboardingResults {
  experienceLevel: "Beginner" | "Intermediate" | "Advanced";
  consistencyScore: number;
  recommendedSplit: string;
  realisticGoalForecast: {
    thirtyDays: string[];
    ninetyDays: string[];
    sixMonths: string[];
  };
  firstWeekTarget: number;
}

export interface PlanExercise {
  name: string;
  slug?: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  notes?: string;
}

export interface PlanWorkout {
  day: string;
  title: string;
  estimatedDuration: string;
  exercises: PlanExercise[];
}

export interface Program {
  programName: string;
  recommendedSplit: string;
  daysPerWeek: number;
  goal: string;
  workouts: PlanWorkout[];
  createdAt: number;
}
