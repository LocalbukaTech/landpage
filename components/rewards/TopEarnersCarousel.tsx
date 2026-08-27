/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { ChevronRight, Award, Trophy } from 'lucide-react';
import { useRewardsLeaderboard } from '@/lib/api/services/referral.hooks';

export function TopEarnersCarousel() {
  const { data, isLoading } = useRewardsLeaderboard({ period: 'all', pageSize: 6 });

  const rawEarners: any[] = Array.isArray(data)
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

  // Ensure items have 1-based ranks and correct field mappings
  const earners = rawEarners.map((item: any, idx: number) => ({
    userId: item.userId || item.id || `user-${idx}`,
    name: item.fullName || item.name || item.username || 'Anonymous Foodie',
    points: item.points ?? item.lifetimeEarned ?? item.currentPoints ?? 0,
    rank: item.rank || idx + 1,
    avatar: item.avatar || '/images/profile.png',
  }));

  return (
    <div
      className='w-full flex flex-col gap-3.5'
      style={{ fontFamily: 'var(--font-nunito-sans), Nunito Sans, sans-serif' }}>
      {/* Header row */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h4 className='text-[15px] font-bold text-white m-0 flex items-center gap-1.5'>
            <Trophy size={16} className='text-[#FBBE15]' />
            Top Community Earners
          </h4>
          <span className='text-[10px] px-2 py-0.5 rounded-full bg-[#FBBE15]/10 text-[#FBBE15] font-semibold'>
            Leaderboard
          </span>
        </div>
        <Link
          href='/rewards/leaderboard'
          className='hidden md:flex items-center gap-[2px] text-[13px] text-zinc-400 hover:text-[#FBBE15] transition-colors font-medium'>
          See All Rankings
          <ChevronRight size={16} strokeWidth={2} />
        </Link>
        <Link
          href='/rewards/leaderboard'
          className='md:hidden flex items-center gap-[2px] text-[13px] text-zinc-400 hover:text-[#FBBE15] transition-colors font-medium'>
          <ChevronRight size={16} strokeWidth={2} />
        </Link>
      </div>

      {/* Earners image scroll row */}
      {isLoading ? (
        <div
          className='flex overflow-x-auto scrollbar-hide pb-2 pt-6'
          style={{ gap: 20, alignItems: 'flex-start' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='flex flex-col items-center shrink-0 animate-pulse' style={{ width: 74 }}>
              <div style={{ height: 26, marginBottom: 4 }} />
              <div className='w-[74px] h-[74px] rounded-full bg-white/10' />
              <div className='w-14 h-3 bg-white/10 rounded mt-2.5' />
              <div className='w-10 h-2.5 bg-white/10 rounded mt-1' />
            </div>
          ))}
        </div>
      ) : earners.length === 0 ? (
        <div className='py-6 px-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs text-zinc-400'>
          <span>No leaderboard rankings yet. Be the first to invite friends and top the charts!</span>
          <Link href='/rewards/leaderboard' className='text-[#FBBE15] font-bold hover:underline shrink-0'>
            View Board
          </Link>
        </div>
      ) : (
        <div
          className='flex overflow-x-auto scrollbar-hide pb-2 pt-6'
          style={{ gap: 20, alignItems: 'flex-start' }}>
          {earners.map((earner) => (
            <div
              key={earner.userId || earner.rank}
              className='flex flex-col items-center shrink-0 group'
              style={{ gap: 6, width: 74 }}>
              {/* Crown zone: crown only shows for rank 1 */}
              <div style={{ height: 26, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 4 }}>
                {earner.rank === 1 && (
                  <img src='/images/crown.png' alt='crown' width={30} height={22} className='animate-bounce duration-1000' />
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

              {/* Name */}
              <span
                className='text-[11px] font-medium text-zinc-300 text-center truncate w-full capitalize'
                style={{ marginTop: 10 }}
                title={earner.name}>
                {earner.name}
              </span>

              {/* Points */}
              <span className='text-[11px] font-bold text-[#FBBE15]' style={{ marginTop: -2 }}>
                {earner.points.toLocaleString()} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
