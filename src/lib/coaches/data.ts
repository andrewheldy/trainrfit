export type CoachCategory =
  | "Muscle Building"
  | "Strength"
  | "Fat Loss"
  | "Women's Fitness"
  | "Athletic Performance"
  | "Mobility"
  | "Bodyweight"
  | "Powerlifting"
  | "Beginner Friendly";

export const COACH_CATEGORIES: CoachCategory[] = [
  "Muscle Building",
  "Strength",
  "Fat Loss",
  "Women's Fitness",
  "Athletic Performance",
  "Mobility",
  "Bodyweight",
  "Powerlifting",
  "Beginner Friendly",
];

export type Program = {
  slug: string;
  name: string;
  cover: string;
  goal: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  daysPerWeek: number;
  sessionLength: string;
  summary: string;
};

export type Coach = {
  slug: string;
  name: string;
  specialty: string;
  bio: string;
  photo: string;
  banner: string;
  followers: number;
  verified: boolean;
  categories: CoachCategory[];
  social: { twitter?: string; instagram?: string; youtube?: string };
  ratings: { score: number; count: number };
  programs: Program[];
};

const u = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=80`;

export const COACHES: Coach[] = [
  {
    slug: "sarah-vale",
    name: "Sarah Vale",
    specialty: "Women's Strength & Glute Development",
    bio: "Former collegiate sprinter turned strength coach. Sarah specializes in posterior chain development and progressive overload for women who want real strength, not gimmicks.",
    photo: u("photo-1594381898411-846e7d193883"),
    banner: u("photo-1574680096145-d05b474e2155"),
    followers: 24500,
    verified: true,
    categories: ["Women's Fitness", "Muscle Building", "Strength"],
    social: { instagram: "@sarahvale", youtube: "@sarahvale" },
    ratings: { score: 4.9, count: 1820 },
    programs: [
      {
        slug: "glute-blueprint",
        name: "Glute Blueprint",
        cover: u("photo-1518611012118-696072aa579a"),
        goal: "Glute Hypertrophy",
        duration: "12 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 4,
        sessionLength: "55 min",
        summary: "Hip-thrust centric progression with accessory work to build round, strong glutes.",
      },
      {
        slug: "summer-shred",
        name: "Summer Shred",
        cover: u("photo-1546483875-ad9014c88eba"),
        goal: "Fat Loss",
        duration: "12 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 5,
        sessionLength: "45 min",
        summary: "Strength + conditioning split designed to preserve muscle while dropping body fat.",
      },
    ],
  },
  {
    slug: "marcus-cole",
    name: "Marcus Cole",
    specialty: "Powerlifting & Raw Strength",
    bio: "Elite-level raw powerlifter (2,000+ total). Marcus coaches lifters from first competition through national level using conjugate-influenced programming.",
    photo: u("photo-1567013127542-490d757e51fc"),
    banner: u("photo-1517836357463-d25dfeac3438"),
    followers: 41200,
    verified: true,
    categories: ["Powerlifting", "Strength"],
    social: { instagram: "@marcuscole", youtube: "@coachcole" },
    ratings: { score: 4.8, count: 2640 },
    programs: [
      {
        slug: "power-builder",
        name: "Power Builder",
        cover: u("photo-1534438327276-14e5300c3a48"),
        goal: "Strength + Muscle",
        duration: "16 Weeks",
        difficulty: "Advanced",
        daysPerWeek: 4,
        sessionLength: "75 min",
        summary: "Heavy compound work paired with hypertrophy blocks. Build a bigger total and a bigger frame.",
      },
      {
        slug: "first-meet-prep",
        name: "First Meet Prep",
        cover: u("photo-1583454110551-21f2fa2afe61"),
        goal: "Powerlifting Peak",
        duration: "10 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 4,
        sessionLength: "90 min",
        summary: "Squat, bench, and deadlift peaking block for your first sanctioned meet.",
      },
    ],
  },
  {
    slug: "kai-okafor",
    name: "Kai Okafor",
    specialty: "Athletic Performance",
    bio: "Strength & conditioning coach for D1 athletes. Kai blends explosive power, sprint mechanics, and resilience training for athletes in any sport.",
    photo: u("photo-1583500178690-f7fd39f6e6ba"),
    banner: u("photo-1571902943202-507ec2618e8f"),
    followers: 18300,
    verified: true,
    categories: ["Athletic Performance", "Strength"],
    social: { instagram: "@kaiokafor" },
    ratings: { score: 4.9, count: 940 },
    programs: [
      {
        slug: "explosive-athlete",
        name: "Explosive Athlete",
        cover: u("photo-1517649763962-0c623066013b"),
        goal: "Power & Speed",
        duration: "10 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 4,
        sessionLength: "60 min",
        summary: "Olympic lifts, plyometrics, and sprint work to develop game-changing explosiveness.",
      },
    ],
  },
  {
    slug: "elena-rivas",
    name: "Elena Rivas",
    specialty: "Mobility & Movement",
    bio: "Physical therapist and movement specialist. Elena helps lifters rebuild range of motion and bulletproof joints so they can train hard for decades.",
    photo: u("photo-1544005313-94ddf0286df2"),
    banner: u("photo-1518310383802-640c2de311b2"),
    followers: 12800,
    verified: true,
    categories: ["Mobility", "Beginner Friendly"],
    social: { instagram: "@elenarivasdpt" },
    ratings: { score: 5.0, count: 612 },
    programs: [
      {
        slug: "lifter-mobility",
        name: "Lifter's Mobility Reset",
        cover: u("photo-1599058917212-d750089bc07e"),
        goal: "Mobility",
        duration: "6 Weeks",
        difficulty: "Beginner",
        daysPerWeek: 4,
        sessionLength: "25 min",
        summary: "Daily mobility flows that fix the most common lifter restrictions in hips, shoulders, and ankles.",
      },
    ],
  },
  {
    slug: "diego-marin",
    name: "Diego Marin",
    specialty: "Muscle Building & Hypertrophy",
    bio: "Natural pro bodybuilder. Diego teaches evidence-based hypertrophy — high-effort sets, smart volume, and recovery you can sustain.",
    photo: u("photo-1571019614242-c5c5dee9f50b"),
    banner: u("photo-1605296867304-46d5465a13f1"),
    followers: 56700,
    verified: true,
    categories: ["Muscle Building", "Strength"],
    social: { instagram: "@diegomarin", youtube: "@diegomarinifbb" },
    ratings: { score: 4.8, count: 3210 },
    programs: [
      {
        slug: "beginner-muscle-blueprint",
        name: "Beginner Muscle Blueprint",
        cover: u("photo-1581009146145-b5ef050c2e1e"),
        goal: "Build Muscle",
        duration: "8 Weeks",
        difficulty: "Beginner",
        daysPerWeek: 3,
        sessionLength: "50 min",
        summary: "A full-body foundation program. Master the basics and add real muscle in your first 8 weeks.",
      },
      {
        slug: "upper-lower-hypertrophy",
        name: "Upper / Lower Hypertrophy",
        cover: u("photo-1583454122760-d7fc14e57c84"),
        goal: "Muscle Growth",
        duration: "12 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 4,
        sessionLength: "65 min",
        summary: "Classic 4-day upper/lower with progressive overload tracking for steady gains.",
      },
    ],
  },
  {
    slug: "jamie-park",
    name: "Jamie Park",
    specialty: "Bodyweight & Calisthenics",
    bio: "Calisthenics athlete and gymnast. Jamie teaches strength without a gym — progressions toward muscle-ups, handstands, and the front lever.",
    photo: u("photo-1609899537878-88d5ba429bdf"),
    banner: u("photo-1517438476312-10d79c077509"),
    followers: 31900,
    verified: true,
    categories: ["Bodyweight", "Beginner Friendly", "Athletic Performance"],
    social: { instagram: "@jamiepark", youtube: "@jamieparkcalisthenics" },
    ratings: { score: 4.9, count: 1450 },
    programs: [
      {
        slug: "calisthenics-foundations",
        name: "Calisthenics Foundations",
        cover: u("photo-1571019614242-c5c5dee9f50b"),
        goal: "Bodyweight Strength",
        duration: "12 Weeks",
        difficulty: "Beginner",
        daysPerWeek: 4,
        sessionLength: "40 min",
        summary: "Progressions to your first pull-up, dip, and pistol squat — no gym required.",
      },
    ],
  },
];

export function getCoach(slug: string): Coach | undefined {
  return COACHES.find((c) => c.slug === slug);
}

export function getAllPrograms() {
  return COACHES.flatMap((c) => c.programs.map((p) => ({ ...p, coach: c })));
}

export function formatFollowers(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return String(n);
}
