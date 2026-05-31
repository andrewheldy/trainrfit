import {
  Dumbbell,
  Flame,
  Zap,
  Heart,
  Trophy,
  Wind,
  PersonStanding,
  Anchor,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import type { CoachCategory } from "@/lib/coaches/data";

export const CATEGORY_ICON: Record<CoachCategory, LucideIcon> = {
  "Muscle Building": Dumbbell,
  Strength: Anchor,
  "Fat Loss": Flame,
  "Women's Fitness": Heart,
  "Athletic Performance": Trophy,
  Mobility: Wind,
  Bodyweight: PersonStanding,
  Powerlifting: Zap,
  "Beginner Friendly": Sprout,
};
