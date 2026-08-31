'use client';

import { ArrowLeft, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { LeaderboardPeriod } from './leaderboard.types';

interface LeaderboardHeaderProps {
  period: LeaderboardPeriod;
  onPeriodChange: (period: LeaderboardPeriod) => void;
}

const PERIOD_TABS: { id: LeaderboardPeriod; label: string }[] = [
  { id: 'all', label: 'All Time' },
  { id: 'monthly', label: 'This Month' },
  { id: 'weekly', label: 'This Week' },
];

export function LeaderboardHeader({ period, onPeriodChange }: LeaderboardHeaderProps) {
  const router = useRouter();

  return (
    <div className='flex flex-col gap-6 mb-6'>
      {/* Back button */}
      <button
        type='button'
        onClick={() => router.back()}
        className='flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 w-fit'>
        <ArrowLeft size={16} />
        Back to Rewards
      </button>

      {/* Page Heading & Timeframe Controls */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-8 h-8 rounded-xl bg-[#FBBE15]/20 text-[#FBBE15] flex items-center justify-center'>
              <Trophy size={18} />
            </div>
            <h1 className='text-2xl sm:text-3xl font-black text-white m-0'>
              Community Leaderboard
            </h1>
          </div>
          <p className='text-xs sm:text-sm text-zinc-400 max-w-xl m-0 leading-relaxed'>
            Compete with the top food explorers and community advocates. Earn points by inviting friends, posting authentic reviews, and discovering hidden Bukas.
          </p>
        </div>

        {/* Period selector */}
        <div className='flex items-center bg-[#161616] border border-white/10 rounded-xl p-1 shrink-0'>
          {PERIOD_TABS.map((tab) => (
            <button
              key={tab.id}
              type='button'
              onClick={() => onPeriodChange(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border-none ${
                period === tab.id
                  ? 'bg-[#FBBE15] text-[#1a1a1a]'
                  : 'text-zinc-400 hover:text-white bg-transparent'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
