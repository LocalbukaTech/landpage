/* eslint-disable @next/next/no-img-element */
'use client';

import { Trophy } from 'lucide-react';
import type { LeaderboardMember, LeaderboardPeriod } from './leaderboard.types';

interface LeaderboardTopPodiumProps {
  topEarners: LeaderboardMember[];
  period: LeaderboardPeriod;
}

export function LeaderboardTopPodium({ topEarners, period }: LeaderboardTopPodiumProps) {
  if (!topEarners.length) return null;

  const periodLabel =
    period === 'all'
      ? 'All-Time'
      : period === 'monthly'
      ? 'Monthly'
      : 'Weekly';

  return (
    <div className='bg-[#161616] border border-white/10 rounded-2xl p-6 mb-8 shadow-lg'>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5'>
          <Trophy size={14} className='text-[#FBBE15]' />
          Top {topEarners.length} Leaders ({periodLabel})
        </span>
      </div>

      <div className='flex gap-5 overflow-x-auto scrollbar-hide pb-2 pt-6 items-start'>
        {topEarners.map((earner) => (
          <div
            key={earner.userId || earner.rank}
            className='flex flex-col items-center shrink-0 group'
            style={{ gap: 6, width: 74 }}>
            {/* Crown zone: rank 1 */}
            <div style={{ height: 26, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 4 }}>
              {earner.rank === 1 && (
                <img
                  src='/images/crown.png'
                  alt='crown'
                  width={30}
                  height={22}
                  className='animate-bounce duration-1000'
                />
              )}
            </div>

            {/* Photo circle + rank badge */}
            <div className='relative' style={{ width: 74, height: 74 }}>
              <div className='absolute inset-0 rounded-full overflow-hidden border-2 border-[#FBBE15] bg-zinc-800 transition-transform group-hover:scale-105'>
                <img
                  src={earner.avatar}
                  alt={earner.name}
                  width={74}
                  height={74}
                  className='w-full h-full object-cover block'
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/avatar-bryan.jpg';
                  }}
                />
              </div>
              <div
                className='absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FBBE15] flex items-center justify-center'
                style={{ bottom: -8, boxShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                <span className='text-[10px] font-extrabold text-[#1a1a1a] leading-none'>
                  {earner.rank}
                </span>
              </div>
            </div>

            <span
              className='text-[11px] font-medium text-zinc-300 text-center truncate w-full mt-2.5 capitalize'
              title={earner.name}>
              {earner.name}
            </span>
            <span className='text-[11px] font-bold text-[#FBBE15] -mt-0.5'>
              {earner.points.toLocaleString()} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
