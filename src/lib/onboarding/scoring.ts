import type { OnboardingProfile, OnboardingResults } from "./types";

export function generateOnboardingResults(p: OnboardingProfile): OnboardingResults {
  // Experience
  let experienceLevel: OnboardingResults["experienceLevel"] = "Beginner";
  if (["1-3 years"].includes(p.trainingExperience)) experienceLevel = "Intermediate";
  else if (["3-5 years", "5+ years"].includes(p.trainingExperience)) experienceLevel = "Advanced";

  // Consistency score
  let score = 0;
  switch (p.currentExerciseFrequency) {
    case "5-6x per week":
    case "Daily":
      score += 35; break;
    case "3-4x per week":
      score += 25; break;
    case "1-2x per week":
      score += 15; break;
    default:
      score += 5;
  }
  const days = p.realisticTrainingDays ?? 0;
  if (days >= 3 && days <= 5) score += 35;
  else if (days >= 1 && days <= 2) score += 25;
  else if (days >= 6) score += 20;
  const barriers = p.barriers.length;
  if (barriers <= 1) score += 30;
  else if (barriers <= 3) score += 20;
  else score += 10;
  const consistencyScore = Math.min(100, score);

  // Recommended split
  const goal = p.primaryGoal;
  let recommendedSplit = "Full Body 3x";
  switch (days) {
    case 1: recommendedSplit = "Full Body 1x"; break;
    case 2: recommendedSplit = "Full Body 2x"; break;
    case 3:
      recommendedSplit = goal === "Get Stronger" || goal === "Build Muscle"
        ? "Push / Pull / Legs"
        : "Full Body 3x";
      break;
    case 4: recommendedSplit = "Upper / Lower"; break;
    case 5: recommendedSplit = "Push / Pull / Legs + Upper / Lower"; break;
    case 6: recommendedSplit = "Push / Pull / Legs (2x)"; break;
    case 7: recommendedSplit = "5-6 training days + 1-2 recovery / mobility"; break;
  }

  // Goal forecast
  const realisticGoalForecast = forecastFor(goal);

  // First week target
  let firstWeekTarget = days || 3;
  if (days >= 1 && days <= 2) firstWeekTarget = days;
  else if (days >= 3 && days <= 4) {
    firstWeekTarget = p.currentExerciseFrequency === "I don’t exercise right now" ? days - 1 : days;
  } else if (days >= 5) {
    firstWeekTarget = p.currentExerciseFrequency === "I don’t exercise right now" ? 3 : 4;
  }
  firstWeekTarget = Math.max(1, firstWeekTarget);

  return { experienceLevel, consistencyScore, recommendedSplit, realisticGoalForecast, firstWeekTarget };
}

function forecastFor(goal: string) {
  const map: Record<string, OnboardingResults["realisticGoalForecast"]> = {
    "Build Muscle": {
      thirtyDays: ["Build consistency", "Learn core movements", "Notice early strength improvements"],
      ninetyDays: ["Visible strength increases", "Better muscle shape and training confidence", "Possible lean mass gain depending on nutrition"],
      sixMonths: ["Meaningful physique and strength changes if consistent"],
    },
    "Lose Fat": {
      thirtyDays: ["Build routine and improve energy", "Better control over habits"],
      ninetyDays: ["Noticeable body composition improvements if nutrition supports the goal"],
      sixMonths: ["Sustainable fat loss and better conditioning"],
    },
    "Get Stronger": {
      thirtyDays: ["Learn technique", "Establish baseline lifts"],
      ninetyDays: ["Clear strength progress"],
      sixMonths: ["Major improvements in main movement patterns"],
    },
    "Body Recomposition": {
      thirtyDays: ["Build consistency and improve form"],
      ninetyDays: ["Better muscle definition and strength"],
      sixMonths: ["Noticeable body composition change"],
    },
    "Improve General Health": {
      thirtyDays: ["Better energy and routine"],
      ninetyDays: ["Improved endurance, strength, and confidence"],
      sixMonths: ["Stronger long-term health habits"],
    },
    "Improve Athletic Performance": {
      thirtyDays: ["Sharper movement quality", "Baseline conditioning"],
      ninetyDays: ["Better power output and stamina"],
      sixMonths: ["Measurable athletic gains in your sport"],
    },
  };
  return map[goal] ?? map["Improve General Health"];
}
