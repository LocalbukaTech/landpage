'use client';

import {MainLayout} from '@/components/layout/MainLayout';
import {Gift, ChevronRight, ArrowLeft} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

const topSix = [
  {rank: 2, name: 'Meghan Jes...', pts: 140, avatar: '/images/avatar-meghan.png'},
  {rank: 1, name: 'Bryan Wolf',    pts: 143, avatar: '/images/avatar-bryan.jpg'},
  {rank: 3, name: 'Alex Turner',   pts: 138, avatar: '/images/avatar-marcus.png'},
  {rank: 4, name: 'Eleanor Pena',  pts: 138, avatar: '/images/avatar-eleanor.png'},
  {rank: 5, name: 'Jane Cooper',   pts: 138, avatar: '/images/avatar-jane.jpg'},
  {rank: 6, name: 'Albert Flores', pts: 138, avatar: '/images/avatar-johnbull.jpg'},
];

const leaderboardRows = [
  {rank: 7,  name: 'Philomina Joseph',   pts: 133, isYou: false, avatar: '/images/avatar-philomina.jpg'},
  {rank: 8,  name: 'Wilson Babafemi',    pts: 116, isYou: true,  avatar: '/images/avatar-marcus.png'},
  {rank: 9,  name: 'Marcus John',        pts: 93,  isYou: false, avatar: '/images/avatar-bryan.jpg'},
  {rank: 10, name: 'Johnbull Micheal',   pts: 83,  isYou: false, avatar: '/images/avatar-johnbull.jpg'},
  {rank: 11, name: 'Mitchell James',     pts: 80,  isYou: false, avatar: '/images/avatar-meghan.png'},
  {rank: 12, name: 'Christiana Wilson',  pts: 78,  isYou: false, avatar: '/images/avatar-christiana.png'},
];

const actionCards = [
  {
    title: 'View Referral Earning',
    desc: 'See how many points you have earned from referrals',
    href: '/rewards',
    color: '#FBBE15',
  },
  {
    title: 'How to earn points?',
    desc: 'Discover new local bukas, post high-quality photos, and your reviews to climb the ranks.',
    href: '/rewards',
    color: '#48bb78',
  },
];

export default function LeaderboardPage() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className='w-full max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-10'>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6 cursor-pointer bg-transparent border-none'>
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Page heading */}
        <div className='mb-1'>
          <h1 className='text-xl md:text-2xl font-bold text-white'>Top Earners</h1>
        </div>
        <p className='text-sm text-zinc-400 leading-relaxed mb-8 max-w-xl'>
          Compete with the most prestigious food explorers in Lagos. Earn points by discovering
          hidden Bukas, referring friends and sharing authentic experiences.
        </p>

        <div className='flex gap-5 overflow-x-auto scrollbar-hide pb-2 pt-8 mb-10'>
          {topSix.map(earner => (
            <div
              key={earner.rank}
              className='flex flex-col items-center shrink-0'
              style={{gap: 6, width: 74}}>

              {/* Crown zone: always 26px tall; crown only shows for rank 1 */}
              <div style={{ height: 26, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 4 }}>
                {earner.rank === 1 && (
                  <img src='/images/crown.png' alt='crown' width={30} height={22} />
                )}
              </div>

              {/* Photo circle + rank badge */}
              <div className='relative' style={{ width: 74, height: 74 }}>
                <div className='absolute inset-0 rounded-full overflow-hidden border-2 border-[#FBBE15] bg-zinc-700'>
                  <img
                    src={earner.avatar}
                    alt={earner.name}
                    width={74}
                    height={74}
                    className='w-full h-full object-cover block'
                  />
                </div>
                <div
                  className='absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FBBE15] flex items-center justify-center'
                  style={{bottom: -8, boxShadow: '0 1px 3px rgba(0,0,0,0.4)'}}>
                  <span className='text-[10px] font-extrabold text-[#1a1a1a] leading-none'>
                    {earner.rank}
                  </span>
                </div>
              </div>

              <span className='text-[11px] text-zinc-300 text-center truncate' style={{maxWidth: 72, marginTop: 10}}>
                {earner.name}
              </span>
              <span className='text-[11px] text-zinc-500' style={{marginTop: -2}}>
                {earner.pts} pts
              </span>
            </div>
          ))}
        </div>

        {/* ── Leaderboard table ── */}
        <div className='w-full'>
          {/* Table header */}
          <div className='flex items-center justify-between px-4 py-2 mb-1'>
            <span className='text-[11px] font-semibold text-zinc-500 uppercase tracking-wider'>
              Rank &amp; Name
            </span>
            <span className='text-[11px] font-semibold text-zinc-500 uppercase tracking-wider'>
              Points
            </span>
          </div>

          {/* Rows */}
          <div className='flex flex-col'>
            {leaderboardRows.map((row, i) => (
              <div
                key={row.rank}
                className='flex items-center justify-between px-4 py-3 rounded-xl transition-colors'
                style={{
                  backgroundColor: row.isYou ? 'rgba(100, 90, 30, 0.35)' : 'transparent',
                  borderBottom: i < leaderboardRows.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>

                {/* Left: rank badge + avatar + name + YOU */}
                <div className='flex items-center gap-3'>
                  {/* Avatar with rank badge */}
                  <div className='relative shrink-0'>
                    <div className='w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-zinc-700'>
                      <img
                        src={row.avatar}
                        alt={row.name}
                        width={40}
                        height={40}
                        className='w-full h-full object-cover block'
                      />
                    </div>
                    <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FBBE15] flex items-center justify-center'>
                      <span className='text-[8px] font-extrabold text-[#1a1a1a] leading-none'>
                        {row.rank}
                      </span>
                    </div>
                  </div>

                  {/* Name + YOU badge */}
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium text-white'>{row.name}</span>
                    {row.isYou && (
                      <span className='text-[10px] font-bold text-[#1a1a1a] bg-[#FBBE15] px-2 py-0.5 rounded-sm'>
                        YOU
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: pts */}
                <span className='text-sm text-zinc-300 font-medium'>{row.pts} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom action cards ── */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10'>
          {actionCards.map(card => (
            <Link
              key={card.title}
              href={card.href}
              className='flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors group'>
              <div className='shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center'>
                <Gift size={20} style={{ color: card.color }} />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold leading-snug' style={{ color: card.color }}>{card.title}</p>
                <p className='text-xs text-zinc-400 mt-0.5 leading-relaxed'>{card.desc}</p>
              </div>
              <ChevronRight size={18} className='text-zinc-500 group-hover:text-white transition-colors shrink-0' />
            </Link>
          ))}
        </div>

      </div>
    </MainLayout>
  );
}
