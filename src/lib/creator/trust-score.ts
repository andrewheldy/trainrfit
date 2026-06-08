export interface TrustScoreInput {
  yearsCoaching?: string;
  clientsCoached?: string;
  certificationsCount: number;
  hasWelcomeVideo: boolean;
  disciplineCount: number;
  isVerified: boolean;
}

const YEARS_COACHING_PTS: Record<string, number> = {
  "Just starting": 0,
  "1-2 years": 8,
  "3-5 years": 16,
  "5-10 years": 24,
  "10-15 years": 30,
  "15+ years": 35,
};

const CLIENTS_PTS: Record<string, number> = {
  "None yet": 0,
  "1-25": 5,
  "25-100": 10,
  "100-500": 14,
  "500-1,000": 18,
  "1,000+": 22,
};

export function calculateTrustScore({
  yearsCoaching,
  clientsCoached,
  certificationsCount,
  hasWelcomeVideo,
  disciplineCount,
  isVerified,
}: TrustScoreInput): number {
  let score = 0;
  score += YEARS_COACHING_PTS[yearsCoaching ?? ""] ?? 0;  // max 35
  score += CLIENTS_PTS[clientsCoached ?? ""] ?? 0;        // max 22
  score += Math.min(certificationsCount * 3, 15);          // max 15
  if (hasWelcomeVideo) score += 10;                        // 10
  score += Math.min(disciplineCount, 5);                   // max 5
  if (isVerified) score += 13;                             // 13
  return Math.min(Math.round(score), 100);
}
