// Realistic mock data for the Gym Lift Admin Dashboard.
import { COACHES } from "@/lib/coaches/data";

export const PLATFORM_KPIS = {
  mrr: 482_350,
  mrrGrowthPct: 12.4,
  arr: 5_788_200,
  arrGrowthPct: 38.1,
  churnPct: 3.2,
  churnDeltaPct: -0.4,
  ltv: 412,
  cac: 38,
  ltvCacRatio: 10.8,
  activeUsers: 184_320,
  activeUsersGrowthPct: 8.7,
  premiumUsers: 42_180,
  premiumGrowthPct: 14.2,
  creatorRevenue: 1_842_900, // YTD paid to creators
  creatorPayoutPending: 184_290,
  grossMargin: 78.4,
};

export const REVENUE_TREND = [
  { month: "Jan", mrr: 312_000, creatorPayout: 188_000 },
  { month: "Feb", mrr: 334_500, creatorPayout: 201_000 },
  { month: "Mar", mrr: 358_200, creatorPayout: 214_900 },
  { month: "Apr", mrr: 379_800, creatorPayout: 227_880 },
  { month: "May", mrr: 402_400, creatorPayout: 241_440 },
  { month: "Jun", mrr: 418_900, creatorPayout: 251_340 },
  { month: "Jul", mrr: 432_100, creatorPayout: 259_260 },
  { month: "Aug", mrr: 448_300, creatorPayout: 268_980 },
  { month: "Sep", mrr: 461_700, creatorPayout: 277_020 },
  { month: "Oct", mrr: 472_500, creatorPayout: 283_500 },
  { month: "Nov", mrr: 478_900, creatorPayout: 287_340 },
  { month: "Dec", mrr: 482_350, creatorPayout: 289_410 },
];

export const USER_GROWTH = [
  { month: "Jan", free: 92_400, premium: 21_800 },
  { month: "Feb", free: 102_100, premium: 24_200 },
  { month: "Mar", free: 114_800, premium: 27_400 },
  { month: "Apr", free: 124_600, premium: 30_100 },
  { month: "May", free: 134_200, premium: 32_800 },
  { month: "Jun", free: 143_900, premium: 35_400 },
  { month: "Jul", free: 152_700, premium: 37_500 },
  { month: "Aug", free: 161_400, premium: 39_100 },
  { month: "Sep", free: 168_900, premium: 40_300 },
  { month: "Oct", free: 174_800, premium: 41_200 },
  { month: "Nov", free: 180_100, premium: 41_800 },
  { month: "Dec", free: 184_320, premium: 42_180 },
];

export const COHORT_RETENTION = [
  { cohort: "Jul", d30: 78, d60: 64, d90: 55 },
  { cohort: "Aug", d30: 81, d60: 68, d90: 59 },
  { cohort: "Sep", d30: 84, d60: 71, d90: 62 },
  { cohort: "Oct", d30: 86, d60: 73, d90: 64 },
  { cohort: "Nov", d30: 88, d60: 75, d90: 66 },
];

// Creator approvals queue
export type CreatorApplication = {
  id: string;
  name: string;
  handle: string;
  photo: string;
  followers: number;
  specialty: string;
  submittedAt: string;
  status: "pending" | "in_review" | "needs_info";
  socialVerified: boolean;
  idVerified: boolean;
};

export const CREATOR_APPLICATIONS: CreatorApplication[] = [
  {
    id: "app_001",
    name: "Brooke Wells",
    handle: "@brookewells",
    photo: "https://i.pravatar.cc/120?img=47",
    followers: 1_240_000,
    specialty: "CrossFit / Olympic Lifting",
    submittedAt: "2026-05-28",
    status: "pending",
    socialVerified: true,
    idVerified: true,
  },
  {
    id: "app_002",
    name: "Marcus Filly",
    handle: "@marcusfilly",
    photo: "https://i.pravatar.cc/120?img=12",
    followers: 892_000,
    specialty: "Functional Bodybuilding",
    submittedAt: "2026-05-27",
    status: "in_review",
    socialVerified: true,
    idVerified: false,
  },
  {
    id: "app_003",
    name: "Stephanie Buttermore",
    handle: "@stephanie_buttermore",
    photo: "https://i.pravatar.cc/120?img=44",
    followers: 1_580_000,
    specialty: "Nutrition & Hypertrophy",
    submittedAt: "2026-05-26",
    status: "pending",
    socialVerified: true,
    idVerified: true,
  },
  {
    id: "app_004",
    name: "Andrew Huberman",
    handle: "@hubermanlab",
    photo: "https://i.pravatar.cc/120?img=33",
    followers: 6_200_000,
    specialty: "Sleep, Recovery, Neuroscience",
    submittedAt: "2026-05-25",
    status: "needs_info",
    socialVerified: false,
    idVerified: false,
  },
  {
    id: "app_005",
    name: "Natacha Océane",
    handle: "@natacha.oceane",
    photo: "https://i.pravatar.cc/120?img=48",
    followers: 1_120_000,
    specialty: "Athletic Conditioning",
    submittedAt: "2026-05-24",
    status: "pending",
    socialVerified: true,
    idVerified: true,
  },
];

// Top creators ranking
export const TOP_CREATORS = COACHES.slice(0, 10).map((c, i) => ({
  rank: i + 1,
  slug: c.slug,
  name: c.name,
  photo: c.photo,
  photoPosition: c.photoPosition,
  subscribers: 18_420 - i * 1_240 + (i % 3) * 800,
  mrr: 92_840 - i * 6_200 + (i % 2) * 3_400,
  programs: c.programs.length,
  rating: c.ratings.score,
  growthPct: [12.4, 9.8, 7.2, 14.1, 6.5, 5.9, 11.2, 4.3, 8.7, 3.1][i],
  revenueShare: 70,
}));

export const REVENUE_SPLITS = [
  { tier: "Standard", platformPct: 30, creatorPct: 70, creators: 142 },
  { tier: "Verified", platformPct: 25, creatorPct: 75, creators: 38 },
  { tier: "Elite", platformPct: 20, creatorPct: 80, creators: 12 },
  { tier: "Founding", platformPct: 15, creatorPct: 85, creators: 6 },
];

// AI Coaches review queue
export type AICoachReview = {
  id: string;
  creator: string;
  photo: string;
  name: string;
  status: "pending" | "approved" | "flagged";
  trainingDocs: number;
  conversations: number;
  satisfactionPct: number;
  flaggedResponses: number;
  submittedAt: string;
};

export const AI_COACHES_REVIEW: AICoachReview[] = [
  { id: "ai_001", creator: "Jeff Nippard", photo: COACHES[0].photo, name: "Hypertrophy GPT", status: "approved", trainingDocs: 142, conversations: 28_490, satisfactionPct: 94, flaggedResponses: 3, submittedAt: "2026-04-12" },
  { id: "ai_002", creator: "Mike Israetel", photo: COACHES[2]?.photo ?? COACHES[0].photo, name: "RP Volume Coach", status: "approved", trainingDocs: 218, conversations: 41_200, satisfactionPct: 96, flaggedResponses: 1, submittedAt: "2026-03-22" },
  { id: "ai_003", creator: "Krissy Cela", photo: COACHES[3]?.photo ?? COACHES[0].photo, name: "Tone Up Coach", status: "pending", trainingDocs: 88, conversations: 0, satisfactionPct: 0, flaggedResponses: 0, submittedAt: "2026-05-28" },
  { id: "ai_004", creator: "Sam Sulek", photo: COACHES[4]?.photo ?? COACHES[0].photo, name: "Bro Split Pro", status: "flagged", trainingDocs: 34, conversations: 12_840, satisfactionPct: 71, flaggedResponses: 28, submittedAt: "2026-05-01" },
  { id: "ai_005", creator: "Jeremy Ethier", photo: COACHES[1]?.photo ?? COACHES[0].photo, name: "Built With Science", status: "approved", trainingDocs: 176, conversations: 22_140, satisfactionPct: 93, flaggedResponses: 5, submittedAt: "2026-04-30" },
];

// Community moderation
export type ModerationItem = {
  id: string;
  type: "post" | "comment" | "dm";
  community: string;
  reportedUser: string;
  reason: string;
  excerpt: string;
  reports: number;
  reportedAt: string;
  severity: "low" | "med" | "high";
};

export const MODERATION_QUEUE: ModerationItem[] = [
  { id: "mod_001", type: "post", community: "Hypertrophy Lab", reportedUser: "@plate_smasher_92", reason: "PED promotion", excerpt: "DM me for a 12-week tren cycle for shred season…", reports: 14, reportedAt: "12m ago", severity: "high" },
  { id: "mod_002", type: "comment", community: "Tone Up Club", reportedUser: "@gymbro_99", reason: "Harassment", excerpt: "You'd look better if you actually trained legs once…", reports: 8, reportedAt: "34m ago", severity: "med" },
  { id: "mod_003", type: "post", community: "Built With Science", reportedUser: "@supp_seller", reason: "Spam", excerpt: "USE CODE GAINZ FOR 50% OFF MY AFFILIATE LINK…", reports: 22, reportedAt: "1h ago", severity: "med" },
  { id: "mod_004", type: "dm", community: "Bro Split Pro", reportedUser: "@anonymouslifter", reason: "Threats", excerpt: "If I see you at the gym again…", reports: 3, reportedAt: "2h ago", severity: "high" },
  { id: "mod_005", type: "comment", community: "RP Volume Coach", reportedUser: "@formchecker", reason: "Misinformation", excerpt: "Squats below parallel destroy your knees, fact…", reports: 6, reportedAt: "3h ago", severity: "low" },
];

// Challenges
export type Challenge = {
  id: string;
  name: string;
  creator: string;
  participants: number;
  completionPct: number;
  prizePool: number;
  status: "live" | "upcoming" | "ended";
  endsIn: string;
};

export const CHALLENGES: Challenge[] = [
  { id: "ch_001", name: "30-Day Push Pull Legs", creator: "Jeff Nippard", participants: 8_420, completionPct: 64, prizePool: 25_000, status: "live", endsIn: "12 days" },
  { id: "ch_002", name: "Summer Shred 2026", creator: "Krissy Cela", participants: 14_280, completionPct: 41, prizePool: 50_000, status: "live", endsIn: "28 days" },
  { id: "ch_003", name: "1000lb Club", creator: "Mike Israetel", participants: 3_120, completionPct: 22, prizePool: 15_000, status: "live", endsIn: "62 days" },
  { id: "ch_004", name: "Built With Science Bulk", creator: "Jeremy Ethier", participants: 6_840, completionPct: 78, prizePool: 20_000, status: "ended", endsIn: "—" },
  { id: "ch_005", name: "Athlean Six-Pack", creator: "Jeff Cavaliere", participants: 0, completionPct: 0, prizePool: 30_000, status: "upcoming", endsIn: "starts in 6d" },
];

// Popular programs / coaches / communities
export const TOP_PROGRAMS = [
  { name: "Push Pull Legs 2.0", creator: "Jeff Nippard", purchases: 18_420, revenue: 920_000, rating: 4.9 },
  { name: "Full Body Hypertrophy", creator: "Jeremy Ethier", purchases: 14_120, revenue: 706_000, rating: 4.8 },
  { name: "RP Volume Landmarks", creator: "Mike Israetel", purchases: 12_840, revenue: 642_000, rating: 4.9 },
  { name: "Tone & Sculpt", creator: "Krissy Cela", purchases: 11_900, revenue: 595_000, rating: 4.7 },
  { name: "Athlean X0 Total Body", creator: "Jeff Cavaliere", purchases: 9_240, revenue: 462_000, rating: 4.8 },
];

export const TOP_COMMUNITIES = [
  { name: "Hypertrophy Lab", creator: "Jeff Nippard", members: 84_200, dau: 18_900, posts7d: 4_120 },
  { name: "RP Volume Coach", creator: "Mike Israetel", members: 62_400, dau: 14_200, posts7d: 3_280 },
  { name: "Built With Science", creator: "Jeremy Ethier", members: 58_900, dau: 12_800, posts7d: 2_940 },
  { name: "Tone Up Club", creator: "Krissy Cela", members: 51_200, dau: 11_400, posts7d: 2_710 },
  { name: "Bro Split Pro", creator: "Sam Sulek", members: 38_400, dau: 9_200, posts7d: 1_980 },
];

// System health
export const SYSTEM_HEALTH = {
  uptime: 99.982,
  apiP95Ms: 142,
  apiP99Ms: 318,
  errorRatePct: 0.04,
  dbCpuPct: 38,
  cdnHitPct: 94.2,
  activeIncidents: 0,
  services: [
    { name: "API Gateway", status: "operational", latencyMs: 84 },
    { name: "Auth Service", status: "operational", latencyMs: 62 },
    { name: "Payments (Stripe)", status: "operational", latencyMs: 218 },
    { name: "AI Coach Inference", status: "degraded", latencyMs: 1_840 },
    { name: "Video CDN", status: "operational", latencyMs: 38 },
    { name: "Postgres Primary", status: "operational", latencyMs: 12 },
    { name: "Realtime / Sockets", status: "operational", latencyMs: 28 },
  ],
};

// Stripe overview
export const STRIPE_SNAPSHOT = {
  todayVolume: 28_420,
  todayTransactions: 1_842,
  succeededPct: 97.8,
  refunds7d: 4_280,
  disputes30d: 12,
  payoutNext: 184_290,
  payoutDate: "2026-06-02",
  feesMTD: 14_280,
  recentCharges: [
    { id: "ch_3PA9k2", customer: "alex.morgan@…", amount: 19.99, status: "succeeded", time: "2m ago" },
    { id: "ch_3PA9j8", customer: "sara.lee@…", amount: 49.00, status: "succeeded", time: "3m ago" },
    { id: "ch_3PA9j1", customer: "kevin.t@…", amount: 19.99, status: "failed", time: "5m ago" },
    { id: "ch_3PA9he", customer: "rita.k@…", amount: 99.00, status: "succeeded", time: "6m ago" },
    { id: "ch_3PA9hb", customer: "dan.o@…", amount: 19.99, status: "refunded", time: "8m ago" },
  ],
};

// Support tickets
export type Ticket = {
  id: string;
  subject: string;
  user: string;
  priority: "low" | "med" | "high" | "urgent";
  status: "open" | "pending" | "resolved";
  category: "Billing" | "Bug" | "Creator" | "Account" | "AI Coach";
  agedHours: number;
};

export const TICKETS: Ticket[] = [
  { id: "TKT-4821", subject: "Charged twice for premium", user: "alex.morgan@…", priority: "urgent", status: "open", category: "Billing", agedHours: 2 },
  { id: "TKT-4820", subject: "Can't upload program video", user: "@krissy_cela", priority: "high", status: "open", category: "Creator", agedHours: 4 },
  { id: "TKT-4819", subject: "AI Coach gave dangerous advice", user: "ben.t@…", priority: "urgent", status: "pending", category: "AI Coach", agedHours: 6 },
  { id: "TKT-4818", subject: "Password reset not arriving", user: "maria.s@…", priority: "med", status: "open", category: "Account", agedHours: 12 },
  { id: "TKT-4817", subject: "App crashes on iOS 18", user: "tony.r@…", priority: "high", status: "pending", category: "Bug", agedHours: 18 },
  { id: "TKT-4816", subject: "Refund request", user: "lara.k@…", priority: "low", status: "resolved", category: "Billing", agedHours: 26 },
];

// Fraud
export type FraudAlert = {
  id: string;
  type: "Chargeback" | "Account Takeover" | "Bot Signup" | "Stolen Card" | "Refund Abuse";
  user: string;
  amount?: number;
  risk: number; // 0-100
  detectedAt: string;
  status: "new" | "investigating" | "blocked" | "cleared";
};

export const FRAUD_ALERTS: FraudAlert[] = [
  { id: "fr_001", type: "Stolen Card", user: "u_8a2c…", amount: 199.00, risk: 92, detectedAt: "4m ago", status: "new" },
  { id: "fr_002", type: "Bot Signup", user: "batch (142 accts)", risk: 88, detectedAt: "22m ago", status: "investigating" },
  { id: "fr_003", type: "Chargeback", user: "kevin.t@…", amount: 49.00, risk: 74, detectedAt: "1h ago", status: "new" },
  { id: "fr_004", type: "Account Takeover", user: "@formchecker", risk: 81, detectedAt: "2h ago", status: "investigating" },
  { id: "fr_005", type: "Refund Abuse", user: "lara.k@…", amount: 19.99, risk: 58, detectedAt: "5h ago", status: "cleared" },
];

// Verification queue
export type VerificationRequest = {
  id: string;
  name: string;
  handle: string;
  photo: string;
  followers: number;
  documents: number;
  submittedAt: string;
};

export const VERIFICATION_QUEUE: VerificationRequest[] = [
  { id: "vr_001", name: "Whitney Simmons", handle: "@whitneyysimmons", photo: COACHES[9]?.photo ?? COACHES[0].photo, followers: 3_200_000, documents: 4, submittedAt: "2026-05-29" },
  { id: "vr_002", name: "David Laid", handle: "@davidlaid", photo: COACHES[5]?.photo ?? COACHES[0].photo, followers: 1_840_000, documents: 3, submittedAt: "2026-05-28" },
  { id: "vr_003", name: "Nick Bare", handle: "@nickbarefitness", photo: COACHES[6]?.photo ?? COACHES[0].photo, followers: 1_120_000, documents: 5, submittedAt: "2026-05-27" },
];
