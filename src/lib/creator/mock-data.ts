// Realistic mock data for the Creator Dashboard.
// Defaults to Jeff Nippard as the logged-in creator persona.

import { COACHES, type Coach } from "@/lib/coaches/data";

export const CURRENT_CREATOR: Coach =
  COACHES.find((c) => c.slug === "jeff-nippard") ?? COACHES[0];

export const OVERVIEW_STATS = {
  subscribers: {
    total: 18420,
    newThisMonth: 1284,
    growthPct: 7.5,
  },
  revenue: {
    gross: 92840,
    platformShare: 27852, // 30%
    creatorShare: 64988, // 70%
    estimatedPayout: 64988,
    currency: "USD",
  },
  programs: {
    purchases: 3120,
    revenue: 187200,
  },
  aiCoach: {
    subscribers: 4280,
    revenue: 42800,
  },
  community: {
    members: 12640,
    activeWeekly: 6210,
  },
  retention: {
    d30: 86,
    d90: 71,
  },
};

export const SUBSCRIBER_GROWTH = [
  { month: "Jan", subs: 11200 },
  { month: "Feb", subs: 12010 },
  { month: "Mar", subs: 12880 },
  { month: "Apr", subs: 13750 },
  { month: "May", subs: 14820 },
  { month: "Jun", subs: 15640 },
  { month: "Jul", subs: 16380 },
  { month: "Aug", subs: 17040 },
  { month: "Sep", subs: 17710 },
  { month: "Oct", subs: 18120 },
  { month: "Nov", subs: 18420 },
];

export const REVENUE_GROWTH = [
  { month: "Jan", gross: 54000, creator: 37800 },
  { month: "Feb", gross: 58200, creator: 40740 },
  { month: "Mar", gross: 62400, creator: 43680 },
  { month: "Apr", gross: 67100, creator: 46970 },
  { month: "May", gross: 71800, creator: 50260 },
  { month: "Jun", gross: 75200, creator: 52640 },
  { month: "Jul", gross: 78600, creator: 55020 },
  { month: "Aug", gross: 81900, creator: 57330 },
  { month: "Sep", gross: 85400, creator: 59780 },
  { month: "Oct", gross: 89100, creator: 62370 },
  { month: "Nov", gross: 92840, creator: 64988 },
];

export const TOP_PROGRAMS = [
  { name: "Science-Based Muscle Building", sales: 1280, revenue: 89600 },
  { name: "Fundamental Strength", sales: 940, revenue: 56400 },
  { name: "Powerbuilding Split", sales: 612, revenue: 36720 },
  { name: "Push Pull Legs 2.0", sales: 288, revenue: 14400 },
];

export const POPULAR_MUSCLE_GROUPS = [
  { group: "Chest", sessions: 4820 },
  { group: "Back", sessions: 4510 },
  { group: "Legs", sessions: 3940 },
  { group: "Shoulders", sessions: 3120 },
  { group: "Arms", sessions: 2870 },
  { group: "Core", sessions: 2240 },
];

export const COMPLETION_RATE = [
  { week: "W1", pct: 92 },
  { week: "W2", pct: 88 },
  { week: "W3", pct: 84 },
  { week: "W4", pct: 81 },
  { week: "W5", pct: 79 },
  { week: "W6", pct: 76 },
  { week: "W7", pct: 74 },
  { week: "W8", pct: 71 },
];

export const ACTIVITY_HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const ACTIVITY_HEATMAP_HOURS = ["5a", "8a", "11a", "2p", "5p", "8p", "11p"];
// 7 days × 7 hour buckets, 0–100 intensity
export const ACTIVITY_HEATMAP: number[][] = [
  [12, 28, 22, 18, 64, 88, 40],
  [14, 30, 24, 20, 70, 92, 44],
  [10, 26, 20, 18, 60, 80, 38],
  [16, 34, 28, 22, 72, 94, 46],
  [18, 36, 30, 24, 74, 96, 48],
  [40, 60, 70, 64, 80, 70, 32],
  [42, 55, 62, 58, 66, 60, 28],
];

export type CreatorProgram = {
  id: string;
  name: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  goal: string;
  price: number;
  type: "Subscription" | "One-time";
  status: "Published" | "Draft" | "Archived";
  enrolled: number;
  rating: number;
  thumbnail: string;
};

export const CREATOR_PROGRAMS: CreatorProgram[] = [
  {
    id: "p1",
    name: "Science-Based Muscle Building",
    difficulty: "Intermediate",
    duration: "12 Weeks",
    goal: "Muscle Gain",
    price: 79,
    type: "One-time",
    status: "Published",
    enrolled: 1280,
    rating: 4.9,
    thumbnail:
      "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=600&q=80",
  },
  {
    id: "p2",
    name: "Fundamental Strength",
    difficulty: "Beginner",
    duration: "8 Weeks",
    goal: "Strength",
    price: 59,
    type: "One-time",
    status: "Published",
    enrolled: 940,
    rating: 4.8,
    thumbnail:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80",
  },
  {
    id: "p3",
    name: "Powerbuilding Split",
    difficulty: "Advanced",
    duration: "12 Weeks",
    goal: "Strength",
    price: 89,
    type: "One-time",
    status: "Published",
    enrolled: 612,
    rating: 4.9,
    thumbnail:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80",
  },
  {
    id: "p4",
    name: "Push Pull Legs 2.0",
    difficulty: "Intermediate",
    duration: "Custom",
    goal: "Muscle Gain",
    price: 19,
    type: "Subscription",
    status: "Draft",
    enrolled: 0,
    rating: 0,
    thumbnail:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&q=80",
  },
];

export type ContentItem = {
  id: string;
  title: string;
  type: "Video" | "PDF" | "Image" | "Guide";
  category: "Tutorial" | "Program" | "Premium" | "Community" | "Free";
  size: string;
  updated: string;
};

export const CONTENT_LIBRARY: ContentItem[] = [
  { id: "c1", title: "Bench Press Form Breakdown", type: "Video", category: "Tutorial", size: "184 MB", updated: "2d ago" },
  { id: "c2", title: "12-Week Hypertrophy PDF", type: "PDF", category: "Program", size: "8.2 MB", updated: "1w ago" },
  { id: "c3", title: "Cutting Nutrition Guide", type: "PDF", category: "Premium", size: "4.1 MB", updated: "3w ago" },
  { id: "c4", title: "RPE Cheat Sheet", type: "Image", category: "Free", size: "612 KB", updated: "1mo ago" },
  { id: "c5", title: "Recovery Protocols", type: "Guide", category: "Premium", size: "2.4 MB", updated: "2mo ago" },
  { id: "c6", title: "Welcome Community Post", type: "Video", category: "Community", size: "62 MB", updated: "5d ago" },
];

export const AI_COACH_KNOWLEDGE = [
  { name: "Hypertrophy Research Notes.pdf", size: "3.4 MB" },
  { name: "Form Cue Library.pdf", size: "1.8 MB" },
  { name: "FAQ - Programming.docx", size: "640 KB" },
  { name: "Voice Sample - Intro.mp3", size: "2.1 MB" },
];

export const COMMUNITY_POSTS = [
  {
    id: "post1",
    author: "Jeff Nippard",
    pinned: true,
    title: "📌 Welcome to the community — read this first",
    likes: 1248,
    comments: 184,
    time: "2w ago",
  },
  {
    id: "post2",
    author: "Jeff Nippard",
    pinned: false,
    title: "New study: training to failure on the last set",
    likes: 642,
    comments: 96,
    time: "4d ago",
  },
  {
    id: "post3",
    author: "Jeff Nippard",
    pinned: false,
    title: "Q&A — drop your hypertrophy questions",
    likes: 318,
    comments: 212,
    time: "1d ago",
  },
];

export const CHALLENGES = [
  { id: "ch1", name: "30-Day Push-Up", participants: 4820, status: "Active", reward: "Iron Badge + 500 XP" },
  { id: "ch2", name: "12-Week Transformation", participants: 1240, status: "Active", reward: "Gold Badge + 2000 XP" },
  { id: "ch3", name: "10K Daily Steps", participants: 2960, status: "Active", reward: "Endurance Badge" },
  { id: "ch4", name: "Bench 1.5x Bodyweight", participants: 642, status: "Upcoming", reward: "Strength Badge" },
];

export const PAYOUTS = [
  { id: "py1", date: "Nov 1, 2026", amount: 62370, status: "Completed" },
  { id: "py2", date: "Oct 1, 2026", amount: 59780, status: "Completed" },
  { id: "py3", date: "Sep 1, 2026", amount: 57330, status: "Completed" },
  { id: "py4", date: "Dec 1, 2026", amount: 64988, status: "Pending" },
];

export const REVENUE_BREAKDOWN = [
  { source: "Programs", amount: 38400 },
  { source: "Subscriptions", amount: 14200 },
  { source: "AI Coach", amount: 8400 },
  { source: "Challenges", amount: 2480 },
  { source: "Affiliate", amount: 1508 },
];

export const PARTNERSHIPS = [
  { id: "sp1", brand: "Bare Performance Nutrition", type: "Sponsorship", status: "Active", value: "$8,400 / quarter" },
  { id: "sp2", brand: "Gymshark", type: "Affiliate", status: "Active", value: "12% commission" },
  { id: "sp3", brand: "MyProtein", type: "Discount Code", status: "Active", value: "JEFF20 — 20% off" },
  { id: "sp4", brand: "Whoop", type: "Campaign Invite", status: "Pending", value: "—" },
];
