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
    slug: "jeff-nippard",
    name: "Jeff Nippard",
    specialty: "Science-Based Muscle Building",
    bio: "Natural pro bodybuilder and biochemistry graduate. Jeff distills the latest exercise science into practical, evidence-based training programs that deliver measurable results for beginners to advanced lifters.",
    photo: u("photo-1581009146145-b5ef050c2e1e"),
    banner: u("photo-1583500178690-f7fd39c44c3d"),
    followers: 2450000,
    verified: true,
    categories: ["Muscle Building", "Strength", "Beginner Friendly"],
    social: { instagram: "@jeffnippard", youtube: "@JeffNippard" },
    ratings: { score: 4.9, count: 18200 },
    programs: [
      {
        slug: "science-based-muscle",
        name: "Science-Based Muscle Building",
        cover: u("photo-1581009146145-b5ef050c2e1e"),
        goal: "Muscle Growth",
        duration: "12 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 5,
        sessionLength: "60 min",
        summary: "Evidence-based hypertrophy program using the latest research on volume, intensity, and frequency for optimal muscle gain.",
      },
      {
        slug: "fundamental-strength",
        name: "Fundamental Strength",
        cover: u("photo-1583454110551-21f2fa2afe61"),
        goal: "Strength",
        duration: "8 Weeks",
        difficulty: "Beginner",
        daysPerWeek: 3,
        sessionLength: "50 min",
        summary: "Master the big lifts with form-focused coaching and progressive overload built for first-time strength trainees.",
      },
    ],
  },
  {
    slug: "chris-bumstead",
    name: "Chris Bumstead",
    specialty: "Classic Physique Blueprint",
    bio: "5x Mr. Olympia Classic Physique champion. CBum brings his championship-level training philosophy to structured programs focused on symmetry, proportion, and stage-ready conditioning.",
    photo: u("photo-1517836357463-d25dfeac3438"),
    banner: u("photo-1605296867304-46d5465a13f1"),
    followers: 3200000,
    verified: true,
    categories: ["Muscle Building", "Strength"],
    social: { instagram: "@cbum", youtube: "@ChrisBumstead" },
    ratings: { score: 4.8, count: 26400 },
    programs: [
      {
        slug: "classic-physique",
        name: "Classic Physique Blueprint",
        cover: u("photo-1583454122760-d7fc14e57c84"),
        goal: "Classic Physique",
        duration: "16 Weeks",
        difficulty: "Advanced",
        daysPerWeek: 6,
        sessionLength: "90 min",
        summary: "The exact training split and principles that built a 5x Olympia champion. High-volume, intensity-technique focused.",
      },
      {
        slug: "off-season-mass",
        name: "Off-Season Mass Builder",
        cover: u("photo-1571902943202-507ec2618e8f"),
        goal: "Muscle Growth",
        duration: "12 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 5,
        sessionLength: "75 min",
        summary: "Structured hypertrophy block designed to add quality mass while maintaining conditioning and symmetry.",
      },
    ],
  },
  {
    slug: "nick-bare",
    name: "Nick Bare",
    specialty: "Hybrid Athlete Training",
    bio: "Former Army Infantry Officer turned hybrid athlete. Nick proves you can be strong and run far — integrating heavy lifting with endurance training for complete physical capability.",
    photo: u("photo-1517649763962-0c623066013b"),
    banner: u("photo-1571019614242-c5c5dee9f50b"),
    followers: 980000,
    verified: true,
    categories: ["Athletic Performance", "Strength", "Beginner Friendly"],
    social: { instagram: "@nickbarefitness", youtube: "@NickBare" },
    ratings: { score: 4.9, count: 9400 },
    programs: [
      {
        slug: "hybrid-athlete",
        name: "Hybrid Athlete Training",
        cover: u("photo-1574680096145-d05b474e2155"),
        goal: "Hybrid Performance",
        duration: "12 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 5,
        sessionLength: "70 min",
        summary: "Simultaneously build strength and running capacity with periodized lifting and cardio integration.",
      },
      {
        slug: "run-and-lift",
        name: "Run & Lift Foundation",
        cover: u("photo-1599058917212-d750089bc07e"),
        goal: "Endurance + Strength",
        duration: "8 Weeks",
        difficulty: "Beginner",
        daysPerWeek: 4,
        sessionLength: "55 min",
        summary: "The perfect entry point for lifters who want to add running or runners who want to get stronger.",
      },
    ],
  },
  {
    slug: "krissy-cela",
    name: "Krissy Cela",
    specialty: "Strength & Sculpt",
    bio: "Co-founder of EvolveYou and one of the most influential voices in women's strength training. Krissy makes lifting accessible, empowering, and results-driven for women at every level.",
    photo: u("photo-1571019614242-c5c5dee9f50b"),
    banner: u("photo-1594381898411-846e7d193883"),
    followers: 2100000,
    verified: true,
    categories: ["Women's Fitness", "Muscle Building", "Strength", "Beginner Friendly"],
    social: { instagram: "@krissycela", youtube: "@KrissyCela" },
    ratings: { score: 4.9, count: 12100 },
    programs: [
      {
        slug: "strength-and-sculpt",
        name: "Strength & Sculpt",
        cover: u("photo-1609899537878-88d5ba429bdf"),
        goal: "Tone & Strength",
        duration: "10 Weeks",
        difficulty: "Beginner",
        daysPerWeek: 4,
        sessionLength: "45 min",
        summary: "A progressive program that builds confidence in the weight room while sculpting lean, strong muscle.",
      },
      {
        slug: "glute-gains",
        name: "Glute Gains",
        cover: u("photo-1518611012118-696072aa579a"),
        goal: "Glute Development",
        duration: "8 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 4,
        sessionLength: "50 min",
        summary: "Targeted posterior chain work with progressive overload to build strong, shapely glutes.",
      },
    ],
  },
  {
    slug: "sam-sulek",
    name: "Sam Sulek",
    specialty: "Mass Building",
    bio: "One of the fastest-rising voices in fitness. Sam's raw, no-nonsense approach to training has connected with millions of Gen Z lifters who want honest advice on packing on size.",
    photo: u("photo-1605296867304-46d5465a13f1"),
    banner: u("photo-1534438327276-14e5300c3a48"),
    followers: 3100000,
    verified: true,
    categories: ["Muscle Building", "Strength"],
    social: { instagram: "@sam_sulek", youtube: "@SamSulek" },
    ratings: { score: 4.7, count: 15800 },
    programs: [
      {
        slug: "raw-mass",
        name: "Raw Mass Building",
        cover: u("photo-1581009146145-b5ef050c2e1e"),
        goal: "Mass Gain",
        duration: "12 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 5,
        sessionLength: "70 min",
        summary: "High-volume push/pull/legs split focused on progressive overload and eating to grow. No fluff, just work.",
      },
      {
        slug: "bulk-basics",
        name: "Bulk Basics",
        cover: u("photo-1583454110551-21f2fa2afe61"),
        goal: "Muscle Growth",
        duration: "8 Weeks",
        difficulty: "Beginner",
        daysPerWeek: 4,
        sessionLength: "60 min",
        summary: "A beginner-friendly mass-building program with straightforward exercises and clear progression.",
      },
    ],
  },
  {
    slug: "jeremy-ethier",
    name: "Jeremy Ethier",
    specialty: "Beginner Transformation",
    bio: "Kinesiologist and founder of Built With Science. Jeremy transforms beginners into knowledgeable lifters through research-backed programs with clear video instruction and tracking.",
    photo: u("photo-1581009146145-b5ef050c2e1e"),
    banner: u("photo-1583454110551-21f2fa2afe61"),
    followers: 1850000,
    verified: true,
    categories: ["Beginner Friendly", "Muscle Building", "Fat Loss"],
    social: { instagram: "@jeremyethier", youtube: "@JeremyEthier" },
    ratings: { score: 4.9, count: 22400 },
    programs: [
      {
        slug: "beginner-transformation",
        name: "Beginner Transformation",
        cover: u("photo-1605296867304-46d5465a13f1"),
        goal: "Build Muscle & Lose Fat",
        duration: "12 Weeks",
        difficulty: "Beginner",
        daysPerWeek: 3,
        sessionLength: "45 min",
        summary: "The definitive starting point for new lifters. Full-body routines, form tutorials, and nutrition guidance included.",
      },
      {
        slug: "science-shred",
        name: "Science-Based Shred",
        cover: u("photo-1546483875-ad9014c88eba"),
        goal: "Fat Loss",
        duration: "8 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 4,
        sessionLength: "50 min",
        summary: "Preserve muscle while cutting body fat with strategic training volume and calorie deficit optimization.",
      },
    ],
  },
  {
    slug: "mike-israetel",
    name: "Dr. Mike Israetel",
    specialty: "Advanced Hypertrophy",
    bio: "PhD in Sport Physiology and co-founder of Renaissance Periodization. Mike is the leading expert on training volume, recovery, and periodization for drug-free bodybuilders and strength athletes.",
    photo: u("photo-1583454110551-21f2fa2afe61"),
    banner: u("photo-1517836357463-d25dfeac3438"),
    followers: 890000,
    verified: true,
    categories: ["Muscle Building", "Strength"],
    social: { instagram: "@rpdrmike", youtube: "@RenaissancePeriodization" },
    ratings: { score: 4.9, count: 8200 },
    programs: [
      {
        slug: "advanced-hypertrophy",
        name: "Advanced Hypertrophy",
        cover: u("photo-1583454122760-d7fc14e57c84"),
        goal: "Maximum Muscle Growth",
        duration: "16 Weeks",
        difficulty: "Advanced",
        daysPerWeek: 5,
        sessionLength: "80 min",
        summary: "Volume-landmark-based periodization with fatigue management, deload protocols, and MEV/MRV optimization.",
      },
      {
        slug: "volume-specialist",
        name: "Volume Specialist",
        cover: u("photo-1571902943202-507ec2618e8f"),
        goal: "Muscle Growth",
        duration: "12 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 4,
        sessionLength: "65 min",
        summary: "Learn to autoregulate your training volume with Mike's systematic approach to productive stimulus.",
      },
    ],
  },
  {
    slug: "david-laid",
    name: "David Laid",
    specialty: "Aesthetic Physique",
    bio: "Natural bodybuilder and aesthetic-focused trainer. David's transformation journey and dedication to proportion, symmetry, and leanness has inspired a generation of lifters.",
    photo: u("photo-1574680096145-d05b474e2155"),
    banner: u("photo-1571902943202-507ec2618e8f"),
    followers: 2600000,
    verified: true,
    categories: ["Muscle Building", "Strength", "Beginner Friendly"],
    social: { instagram: "@davidlaid", youtube: "@DavidLaid" },
    ratings: { score: 4.8, count: 13200 },
    programs: [
      {
        slug: "aesthetic-physique",
        name: "Aesthetic Physique",
        cover: u("photo-1599058917212-d750089bc07e"),
        goal: "Aesthetic Proportions",
        duration: "12 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 5,
        sessionLength: "70 min",
        summary: "Develop the V-taper, arms, and conditioning that define the modern aesthetic physique.",
      },
      {
        slug: "lean-bulk",
        name: "Lean Bulk System",
        cover: u("photo-1518310383802-640c2de311b2"),
        goal: "Muscle Growth",
        duration: "10 Weeks",
        difficulty: "Beginner",
        daysPerWeek: 4,
        sessionLength: "60 min",
        summary: "Add quality size while staying lean with this controlled-gain program and nutrition framework.",
      },
    ],
  },
  {
    slug: "athlean-x",
    name: "Athlean-X",
    specialty: "Injury-Free Training",
    bio: "Jeff Cavaliere's Athlean-X is the gold standard for biomechanically sound training. Former head physical therapist for the New York Mets, Jeff teaches you to train hard while protecting your joints and longevity.",
    photo: u("photo-1599058917212-d750089bc07e"),
    banner: u("photo-1518310383802-640c2de311b2"),
    followers: 3400000,
    verified: true,
    categories: ["Strength", "Mobility", "Beginner Friendly", "Athletic Performance"],
    social: { instagram: "@athleanx", youtube: "@ATHLEANX" },
    ratings: { score: 4.9, count: 28600 },
    programs: [
      {
        slug: "injury-free-training",
        name: "Injury-Free Training",
        cover: u("photo-1599058917212-d750089bc07e"),
        goal: "Strength & Longevity",
        duration: "12 Weeks",
        difficulty: "Beginner",
        daysPerWeek: 5,
        sessionLength: "50 min",
        summary: "Train every muscle group with biomechanically correct form cues designed to eliminate pain and prevent injury.",
      },
      {
        slug: "total-beast",
        name: "Total Beast",
        cover: u("photo-1571019614242-c5c5dee9f50b"),
        goal: "Strength & Athleticism",
        duration: "12 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 5,
        sessionLength: "60 min",
        summary: "Explosive athletic training with correct biomechanics — look like an athlete and move like one too.",
      },
    ],
  },
  {
    slug: "whitney-simmons",
    name: "Whitney Simmons",
    specialty: "Women's Strength",
    bio: "One of the most recognizable names in female fitness. Whitney brings energy, positivity, and serious programming to women who want to get strong, confident, and consistent in the gym.",
    photo: u("photo-1544005313-94ddf0286df2"),
    banner: u("photo-1609899537878-88d5ba429bdf"),
    followers: 1700000,
    verified: true,
    categories: ["Women's Fitness", "Muscle Building", "Strength", "Beginner Friendly"],
    social: { instagram: "@whitneyysimmons", youtube: "@WhitneySimmons" },
    ratings: { score: 4.9, count: 9800 },
    programs: [
      {
        slug: "womens-strength",
        name: "Women's Strength Program",
        cover: u("photo-1594381898411-846e7d193883"),
        goal: "Strength & Confidence",
        duration: "10 Weeks",
        difficulty: "Beginner",
        daysPerWeek: 4,
        sessionLength: "50 min",
        summary: "A feel-good strength program designed to build lifting confidence and foundational muscle for women.",
      },
      {
        slug: "itss-upper-lower",
        name: "It's a Beautiful Day to Be Alive",
        cover: u("photo-1518611012118-696072aa579a"),
        goal: "Full-Body Strength",
        duration: "8 Weeks",
        difficulty: "Intermediate",
        daysPerWeek: 4,
        sessionLength: "55 min",
        summary: "Whitney's signature upper/lower split with progressive overload and accessory work for balanced development.",
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
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return String(n);
}
