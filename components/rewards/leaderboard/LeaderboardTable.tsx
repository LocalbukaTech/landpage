/* eslint-disable @next/next/no-img-element */
'use client';

import { Trophy } from 'lucide-react';
import type { LeaderboardMember } from './leaderboard.types';

interface LeaderboardTableProps {
  members: LeaderboardMember[];
}

export function LeaderboardTable({ members }: LeaderboardTableProps) {
  if (!members.length) {
    return (
      <div className='w-full py-16 flex flex-col items-center justify-center text-center p-6 bg-[#161616] border border-white/10 rounded-2xl mb-8'>
        <div className='w-12 h-12 rounded-xl bg-[#FBBE15]/10 text-[#FBBE15] flex items-center justify-center mb-3'>
          <Trophy size={24} />
        </div>
        <h4 className='text-base font-bold text-white mb-1'>No Rankings for this Period Yet</h4>
        <p className='text-xs text-zinc-400 max-w-sm m-0 leading-relaxed'>
          Invite friends and share buka reviews to claim the top spot on the leaderboard!
        </p>
      </div>
    );
  }

  return (
    <div className='w-full bg-[#161616] border border-white/10 rounded-2xl overflow-hidden shadow-lg mb-8'>
      <div className='w-full overflow-x-auto scrollbar-thin'>
        <div className='min-w-[520px]'>
          {/* Table Header */}
          <div className='grid grid-cols-[1fr_130px_150px] items-center px-5 py-3.5 border-b border-white/10 bg-white/[0.02] text-[11px] font-bold text-zinc-400 uppercase tracking-wider'>
            <span>Rank &amp; Member</span>
            <span className='text-right pr-4'>Referrals</span>
            <span className='text-right'>Total Points</span>
          </div>

          {/* Table Rows */}
          <div className='divide-y divide-white/5'>
            {members.map((row) => (
              <div
                key={row.userId || row.rank}
                className={`grid grid-cols-[1fr_130px_150px] items-center px-5 py-3.5 transition-colors ${
                  row.isYou ? 'bg-[#FBBE15]/10 border-l-4 border-[#FBBE15]' : 'hover:bg-white/[0.02]'
                }`}>
                {/* Left Column: rank + avatar + name */}
                <div className='flex items-center gap-3.5 min-w-0 pr-2'>
                  <span className='w-6 text-center font-mono font-bold text-sm text-zinc-400 shrink-0'>
                    #{row.rank}
                  </span>

                  <div className='relative shrink-0'>
                    <div className='w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-zinc-800'>
                      <img
                        src={row.avatar}
                        alt={row.name}
                        width={40}
                        height={40}
                        className='w-full h-full object-cover block'
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/profile.png';
                        }}
                      />
                    </div>
                  </div>

                  <div className='flex flex-col min-w-0'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-bold text-white truncate max-w-[160px] sm:max-w-[220px] capitalize'>
                        {row.name}
                      </span>
                      {row.isYou && (
                        <span className='text-[10px] font-extrabold text-[#1a1a1a] bg-[#FBBE15] px-1.5 py-0.5 rounded shrink-0'>
                          YOU
                        </span>
                      )}
                    </div>
                    <span className='text-xs text-zinc-500 truncate'>
                      @{row.username || 'foodie'}
                    </span>
                  </div>
                </div>

                {/* Middle Column: Referrals Count */}
                <div className='text-right pr-4 text-xs text-zinc-400 font-mono'>
                  {row.referralCount || 0} referrals
                </div>

                {/* Right Column: Total Points & Naira Equivalent */}
                <div className='flex flex-col items-end text-right'>
                  <span className='text-sm font-extrabold text-white'>
                    {row.points.toLocaleString()} <span className='text-xs font-normal text-zinc-400'>pts</span>
                  </span>
                  <span className='text-[11px] text-[#FBBE15] font-semibold'>
                    ≈ ₦{(row.nairaEquivalent || Math.floor(row.points / 2)).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
