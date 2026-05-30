import type { Coach, Program } from "./data";

export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
};

export type Workout = {
  id: string;
  week: number;
  day: number;
  title: string;
  focus: string;
  duration: string;
  exercises: Exercise[];
};

type Template = { title: string; focus: string; exercises: Exercise[] };

const PUSH: Template = {
  title: "Push Day",
  focus: "Chest, Shoulders, Triceps",
  exercises: [
    { name: "Barbell Bench Press", sets: 4, reps: "6-8", rest: "2-3 min", notes: "Compound — leave 1-2 RIR" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", rest: "90 sec" },
    { name: "Seated Shoulder Press", sets: 3, reps: "8-10", rest: "90 sec" },
    { name: "Cable Lateral Raise", sets: 4, reps: "12-15", rest: "60 sec" },
    { name: "Triceps Rope Pushdown", sets: 3, reps: "10-12", rest: "60 sec" },
    { name: "Overhead Cable Extension", sets: 3, reps: "12-15", rest: "60 sec" },
  ],
};

const PULL: Template = {
  title: "Pull Day",
  focus: "Back, Biceps, Rear Delts",
  exercises: [
    { name: "Weighted Pull-Up", sets: 4, reps: "6-8", rest: "2-3 min" },
    { name: "Barbell Row", sets: 3, reps: "8-10", rest: "90 sec" },
    { name: "Chest-Supported Row", sets: 3, reps: "10-12", rest: "90 sec" },
    { name: "Face Pull", sets: 3, reps: "15-20", rest: "60 sec" },
    { name: "Incline Dumbbell Curl", sets: 3, reps: "10-12", rest: "60 sec" },
    { name: "Hammer Curl", sets: 3, reps: "10-12", rest: "60 sec" },
  ],
};

const LEGS: Template = {
  title: "Leg Day",
  focus: "Quads, Hamstrings, Glutes, Calves",
  exercises: [
    { name: "Back Squat", sets: 4, reps: "5-8", rest: "3 min", notes: "Heaviest compound — focus on depth" },
    { name: "Romanian Deadlift", sets: 3, reps: "8-10", rest: "2 min" },
    { name: "Bulgarian Split Squat", sets: 3, reps: "10-12 / leg", rest: "90 sec" },
    { name: "Leg Curl", sets: 3, reps: "10-12", rest: "60 sec" },
    { name: "Leg Extension", sets: 3, reps: "12-15", rest: "60 sec" },
    { name: "Standing Calf Raise", sets: 4, reps: "10-15", rest: "60 sec" },
  ],
};

const UPPER: Template = {
  title: "Upper Body",
  focus: "Chest, Back, Shoulders, Arms",
  exercises: [
    { name: "Bench Press", sets: 4, reps: "6-8", rest: "2-3 min" },
    { name: "Pull-Up", sets: 4, reps: "6-10", rest: "2 min" },
    { name: "Seated DB Shoulder Press", sets: 3, reps: "8-10", rest: "90 sec" },
    { name: "Cable Row", sets: 3, reps: "10-12", rest: "90 sec" },
    { name: "Lateral Raise", sets: 3, reps: "12-15", rest: "60 sec" },
    { name: "EZ-Bar Curl", sets: 3, reps: "10-12", rest: "60 sec" },
    { name: "Triceps Pushdown", sets: 3, reps: "10-12", rest: "60 sec" },
  ],
};

const LOWER: Template = {
  title: "Lower Body",
  focus: "Quads, Hamstrings, Glutes",
  exercises: [
    { name: "Back Squat", sets: 4, reps: "5-8", rest: "3 min" },
    { name: "Hip Thrust", sets: 3, reps: "8-10", rest: "2 min" },
    { name: "Walking Lunge", sets: 3, reps: "10 / leg", rest: "90 sec" },
    { name: "Leg Press", sets: 3, reps: "10-12", rest: "90 sec" },
    { name: "Seated Leg Curl", sets: 3, reps: "10-12", rest: "60 sec" },
    { name: "Standing Calf Raise", sets: 4, reps: "10-15", rest: "60 sec" },
  ],
};

const FULL_A: Template = {
  title: "Full Body A",
  focus: "Squat-Focused Full Body",
  exercises: [
    { name: "Back Squat", sets: 3, reps: "5-8", rest: "3 min" },
    { name: "Bench Press", sets: 3, reps: "6-8", rest: "2 min" },
    { name: "Barbell Row", sets: 3, reps: "8-10", rest: "90 sec" },
    { name: "Overhead Press", sets: 3, reps: "8-10", rest: "90 sec" },
    { name: "Plank", sets: 3, reps: "45 sec", rest: "45 sec" },
  ],
};

const FULL_B: Template = {
  title: "Full Body B",
  focus: "Deadlift-Focused Full Body",
  exercises: [
    { name: "Deadlift", sets: 3, reps: "3-5", rest: "3 min" },
    { name: "Incline DB Press", sets: 3, reps: "8-10", rest: "90 sec" },
    { name: "Pull-Up", sets: 3, reps: "6-10", rest: "90 sec" },
    { name: "Walking Lunge", sets: 3, reps: "10 / leg", rest: "90 sec" },
    { name: "Hanging Leg Raise", sets: 3, reps: "10-12", rest: "60 sec" },
  ],
};

const FULL_C: Template = {
  title: "Full Body C",
  focus: "Volume Accessory Full Body",
  exercises: [
    { name: "Front Squat", sets: 3, reps: "6-8", rest: "2 min" },
    { name: "DB Bench Press", sets: 3, reps: "10-12", rest: "90 sec" },
    { name: "Cable Row", sets: 3, reps: "10-12", rest: "90 sec" },
    { name: "Lateral Raise", sets: 3, reps: "12-15", rest: "60 sec" },
    { name: "Cable Curl", sets: 3, reps: "12-15", rest: "60 sec" },
    { name: "Triceps Pushdown", sets: 3, reps: "12-15", rest: "60 sec" },
  ],
};

const CONDITIONING: Template = {
  title: "Conditioning",
  focus: "Aerobic + Zone 2",
  exercises: [
    { name: "Easy Run", sets: 1, reps: "30-45 min", rest: "—", notes: "Zone 2, conversational pace" },
    { name: "Mobility Flow", sets: 1, reps: "10 min", rest: "—" },
  ],
};

function getSplit(daysPerWeek: number): Template[] {
  if (daysPerWeek <= 3) return [FULL_A, FULL_B, FULL_C];
  if (daysPerWeek === 4) return [UPPER, LOWER, { ...UPPER, title: "Upper Body B" }, { ...LOWER, title: "Lower Body B" }];
  if (daysPerWeek === 5) return [PUSH, PULL, LEGS, UPPER, LOWER];
  return [PUSH, PULL, LEGS, { ...PUSH, title: "Push Day B" }, { ...PULL, title: "Pull Day B" }, { ...LEGS, title: "Leg Day B" }];
}

function parseWeeks(duration: string): number {
  const m = duration.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 8;
}

export function getProgramWorkouts(coach: Coach, program: Program): Workout[] {
  const weeks = parseWeeks(program.duration);
  let split = getSplit(program.daysPerWeek);

  // Coach-specific tweaks
  if (coach.slug === "nick-bare") {
    split = split.map((t, i) => (i === split.length - 1 ? CONDITIONING : t));
  }

  const workouts: Workout[] = [];
  for (let w = 1; w <= weeks; w++) {
    for (let d = 0; d < program.daysPerWeek; d++) {
      const tpl = split[d % split.length];
      workouts.push({
        id: `w${w}-d${d + 1}`,
        week: w,
        day: d + 1,
        title: tpl.title,
        focus: tpl.focus,
        duration: program.sessionLength,
        exercises: tpl.exercises,
      });
    }
  }
  return workouts;
}

export function getProgram(coach: Coach, programSlug: string): Program | undefined {
  return coach.programs.find((p) => p.slug === programSlug);
}
