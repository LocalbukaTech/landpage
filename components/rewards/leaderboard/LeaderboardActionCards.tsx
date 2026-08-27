'use client';

import Link from 'next/link';
import { Gift, ChevronRight, Coins } from 'lucide-react';

export function LeaderboardActionCards() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <Link
        href='/rewards'
        className='flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-[#161616] hover:bg-white/[0.04] transition-all group shadow-sm'>
        <div className='shrink-0 w-11 h-11 rounded-xl bg-[#FBBE15]/15 flex items-center justify-center text-[#FBBE15]'>
          <Gift size={22} />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-bold text-white group-hover:text-[#FBBE15] transition-colors m-0'>
            View Your Referral Earnings
          </p>
          <p className='text-xs text-zinc-400 mt-0.5 m-0 leading-relaxed'>
            See how many points you have earned, get your share link, and redeem cash.
          </p>
        </div>
        <ChevronRight size={18} className='text-zinc-500 group-hover:text-white transition-colors shrink-0' />
      </Link>

      <div className='flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-[#161616] shadow-sm'>
        <div className='shrink-0 w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400'>
          <Coins size={22} />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-bold text-white m-0'>
            How to Climb the Ranks?
          </p>
          <p className='text-xs text-zinc-400 mt-0.5 m-0 leading-relaxed'>
            Earn 50 pts per referral, post honest reviews, and upload photo/video buka reviews.
          </p>
        </div>
      </div>
    </div>
  );
}
