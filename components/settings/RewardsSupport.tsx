'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Share2, ChevronRight } from 'lucide-react';

interface RewardsSupportProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
  mode?: 'refer' | 'support' | 'all';
}

const topEarners = [
  { rank: 2, name: 'Meghan Jes...', pts: 40, avatar: '/images/avatar-meghan.png' },
  { rank: 1, name: 'Bryan Wolf', pts: 43, avatar: '/images/avatar-bryan.jpg' },
  { rank: 3, name: 'Alex Turner', pts: 38, avatar: '/images/avatar-marcus.png' },
  { rank: 4, name: 'Eleanor Pena', pts: 38, avatar: '/images/avatar-eleanor.png' },
  { rank: 5, name: 'Jane Cooper', pts: 38, avatar: '/images/avatar-jane.jpg' },
  { rank: 6, name: 'Albert Flores', pts: 38, avatar: '/images/avatar-johnbull.jpg' },
];

export function RewardsSupport({
  activeSubTab,
  onSubTabChange,
  mode = 'all',
}: RewardsSupportProps) {
  const initialTab = activeSubTab || (mode === 'support' ? 'help' : 'refer');
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [copied, setCopied] = useState(false);

  const allSubTabs = [
    { id: 'refer', label: 'Refer & Earn' },
    { id: 'help', label: 'Help & Support / Contact Us' },
    { id: 'terms', label: 'Terms & Policies' },
  ];

  const subTabs =
    mode === 'support' ? allSubTabs.filter(t => t.id !== 'refer')
      : mode === 'refer' ? allSubTabs.filter(t => t.id === 'refer')
        : allSubTabs;

  const handleTabChange = (id: string) => {
    setCurrentTab(id);
    onSubTabChange?.(id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('localbuka/adejames.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Join LocalBuka', text: 'Join via my referral link!', url: 'https://localbuka.com' });
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className='flex flex-col'
      style={{ fontFamily: 'var(--font-nunito-sans), Nunito Sans, sans-serif' }}>

      {/* ── Sub-tab strip (hidden when mode="refer") ── */}
      {mode !== 'refer' && (
        <div className='flex gap-6 border-b border-white/10 overflow-x-auto scrollbar-hide mb-8'>
          {subTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className='cursor-pointer bg-transparent border-none whitespace-nowrap shrink-0 pb-3 text-[14px] transition-colors'
              style={{
                fontWeight: currentTab === tab.id ? 600 : 400,
                color: currentTab === tab.id ? '#ffffff' : '#71717a',
                borderBottom: currentTab === tab.id ? '2px solid #FBBE15' : '2px solid transparent',
                fontFamily: 'inherit',
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════════════
          REFER & EARN TAB
          Overall refer section: gap-5 (20px) between
          the 564-wide description area and the 821-wide
          top-earners area.
          ════════════════════════════════════════════════ */}
      {currentTab === 'refer' && (
        <div className='flex flex-col gap-5'>

          {/*
            Description + referral link + points card
            Spec: w:564, h:252, gap:25
          */}
          <div className='w-[564px] max-w-full flex flex-col gap-[25px]'>

            {/* Description — 13px Nunito Sans, zinc-400 */}
            <p className='text-[13px] text-zinc-400 leading-5 m-0'>
              Encourage your friends to download the app with your unique link and earn points.
              Easily convert your points to airtime or data!
            </p>

            {/* ── Referral link row ── */}
            <div className='flex items-center gap-2'>
              {/* URL pill */}
              <div className='w-[358px] shrink-0 text-[13px] text-zinc-300 border border-white/[0.18] rounded-[10px] px-[14px] py-[10px] bg-transparent overflow-hidden text-ellipsis whitespace-nowrap'>
                localbuka/adejames.com
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className='flex items-center gap-[5px] text-[13px] font-semibold border border-white/[0.18] rounded-[10px] px-[14px] py-[10px] bg-transparent cursor-pointer whitespace-nowrap transition-colors hover:text-white hover:border-white/40'
                style={{
                  color: copied ? '#86efac' : '#d4d4d8',
                  fontFamily: 'inherit',
                }}>
                <Copy size={14} strokeWidth={2} />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className='flex items-center gap-[5px] text-[13px] font-bold rounded-[10px] px-[14px] py-[10px] border-none cursor-pointer whitespace-nowrap bg-[#FBBE15] text-[#1a1a1a] hover:bg-[#e5ab13] transition-colors'
                style={{ fontFamily: 'inherit' }}>
                <Share2 size={14} strokeWidth={2.5} />
                <span>Share</span>
              </button>
            </div>

            {/*
              Points card
              Spec: w:358, h:118, p:12 (p-3), rounded-lg, justify-between
            */}
            <div className='w-[358px] h-[118px] p-3 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] flex flex-col justify-between'>
              <p className='text-[10px] text-zinc-500 m-0 font-normal'>Your total points</p>
              <div className='flex items-center justify-between'>
                <div className='flex items-baseline gap-[3px]'>
                  <span className='text-[40px] font-extrabold text-[#1a1a1a] leading-none'>
                    0
                  </span>
                  <span className='text-[12px] text-zinc-500 font-normal'>pts</span>
                </div>
                <button
                  className='text-[12px] font-bold text-white bg-[#166534] rounded-lg px-[14px] py-[6px] border-none cursor-pointer hover:bg-[#14532d] transition-colors'
                  style={{ fontFamily: 'inherit' }}>
                  Convert
                </button>
              </div>
            </div>
          </div>

          {/*
            Top Earners section
            Spec: w:821, h:185, gap:14
            gap:14 is between the header row ("Top Earners" / "See All")
            and the avatars scroll row
          */}
          <div className='w-full h-[185px] flex flex-col gap-[14px]'>

            {/* Header row */}
            <div className='flex items-center justify-between'>
              <h4 className='text-[15px] font-semibold text-white m-0'>
                Top Earners
              </h4>
              <Link
                href='/rewards/leaderboard'
                className='flex items-center gap-[2px] text-[13px] text-zinc-400 hover:text-white transition-colors'
                style={{ fontFamily: 'inherit' }}>
                See All
                <ChevronRight size={16} strokeWidth={2} />
              </Link>
            </div>

            {/*
              Earners image row
              Avatars: 74×74px (confirmed from design spec)
              Yellow border 2px, rank badge 20px circle
              Crown 22px above rank-1
              Name: 11px zinc-300 truncated
              pts: 11px zinc-500
              Gap between avatar columns: 20px
            */}
            <div
              className='flex overflow-x-auto scrollbar-hide pb-2 pt-8'
              style={{ gap: 20, alignItems: 'flex-start' }}>

              {topEarners.map(earner => (
                <div
                  key={earner.rank}
                  className='flex flex-col items-center shrink-0'
                  style={{ gap: 6, width: 74 }}>

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
                      style={{ bottom: -8, boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                      <span className='text-[10px] font-extrabold text-[#1a1a1a] leading-none'>
                        {earner.rank}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <span
                    className='text-[11px] text-zinc-300 text-center truncate'
                    style={{ maxWidth: 72, marginTop: 10 }}>
                    {earner.name}
                  </span>

                  {/* Points */}
                  <span className='text-[11px] text-zinc-500' style={{ marginTop: -2 }}>
                    {earner.pts} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── Help & Support ── */}
      {currentTab === 'help' && (
        <div className='flex flex-col gap-6'>
          {[
            { title: 'Contact Support', desc: 'Chat our support team for help.', btn: 'Chat with Support' },
            { title: 'Email Support', desc: 'Email our support team for help.', btn: 'Send Email' },
          ].map(item => (
            <div key={item.btn} className='flex items-center justify-between'>
              <div>
                <h4 className='text-[14px] font-semibold text-white m-0'>{item.title}</h4>
                <p className='text-[12px] text-zinc-400 mt-0.5 mb-0'>{item.desc}</p>
              </div>
              <button
                className='px-4 py-2 bg-[#FBBE15] text-[#1a1a1a] text-[12px] font-bold rounded-lg border-none cursor-pointer hover:bg-[#e5ab13] transition-colors whitespace-nowrap'
                style={{ fontFamily: 'inherit' }}>
                {item.btn}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Terms ── */}
      {currentTab === 'terms' && (
        <div className='flex items-center justify-center py-20'>
          <div className='text-center'>
            <p className='text-[24px] font-bold text-white mb-2'>Coming Soon</p>
            <p className='text-[13px] text-zinc-400'>
              Terms &amp; Policies will be available in a future update.
            </p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {copied && (
        <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-2.5 bg-[#48bb78] text-white rounded-full shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4'>
          <span className='text-xs font-semibold tracking-wide'>Link copied to clipboard!</span>
          <div className='w-4.5 h-4.5 rounded-full border-1.5 border-white flex items-center justify-center shrink-0'>
            <svg
              className='w-2.5 h-2.5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              strokeWidth={3.5}
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
            </svg>
          </div>
        </div>
      )}

    </div>
  );
}
