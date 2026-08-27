export type LeaderboardPeriod = 'all' | 'monthly' | 'weekly';

export interface LeaderboardMember {
  userId: string;
  name: string;
  username: string;
  points: number;
  nairaEquivalent: number;
  referralCount: number;
  rank: number;
  avatar: string;
  isYou: boolean;
}
