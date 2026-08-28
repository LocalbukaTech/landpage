'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useRewardsLeaderboard } from '@/lib/api/services/referral.hooks';
import {
  LeaderboardHeader,
  LeaderboardTopPodium,
  LeaderboardTable,
  LeaderboardActionCards,
  LeaderboardSkeleton,
  type LeaderboardPeriod,
  type LeaderboardMember,
} from '@/components/rewards/leaderboard';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<LeaderboardPeriod>('all');

  const { data, isLoading } = useRewardsLeaderboard({ period, page: 1, pageSize: 50 });

  const rawList: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray((data as any)?.data?.data)
    ? (data as any).data.data
    : Array.isArray(data?.leaderboard)
    ? data.leaderboard
    : Array.isArray((data as any)?.leaderboard?.data)
    ? (data as any).leaderboard.data
    : [];

  const currentUserId = user?.id;

  const members: LeaderboardMember[] = rawList.map((item: any, idx: number) => {
    const name = item.fullName || item.name || item.username || 'Anonymous Foodie';
    const username = item.username ? (item.username.startsWith('@') ? item.username.slice(1) : item.username) : '';
    const points = item.points ?? item.lifetimeEarned ?? item.currentPoints ?? 0;
    const nairaEquivalent = item.nairaEquivalent ?? Math.floor(points / 2);
    const referralCount = item.referralCount ?? item.totalReferrals ?? item.completedReferrals ?? 0;
    const avatar = item.avatar || '/images/profile.png';

    return {
      userId: item.userId || item.id || `user-${idx}`,
      name,
      username,
      points,
      nairaEquivalent,
      referralCount,
      rank: item.rank || idx + 1,
      avatar,
      isYou: currentUserId ? (item.userId === currentUserId || item.id === currentUserId) : false,
    };
  });

  const topSix = members.slice(0, 6);

  return (
    <MainLayout>
      <div
        className='w-full max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-28 md:pb-12'
        style={{ fontFamily: 'var(--font-nunito-sans), Nunito Sans, sans-serif' }}>
        
        {/* Modular Header */}
        <LeaderboardHeader period={period} onPeriodChange={setPeriod} />

        {/* Content Body: Skeletons or Podium + Table */}
        {isLoading ? (
          <LeaderboardSkeleton />
        ) : (
          <>
            <LeaderboardTopPodium topEarners={topSix} period={period} />
            <LeaderboardTable members={members} />
          </>
        )}

        {/* Modular Bottom Action Cards */}
        <LeaderboardActionCards />
      </div>
    </MainLayout>
  );
}
