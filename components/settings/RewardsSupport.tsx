/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

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
  const { user } = useAuth();
  const router = useRouter();
  const initialTab = activeSubTab || (mode === 'support' ? 'help' : 'refer');
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [copied, setCopied] = useState(false);

  const referralLink = user?.referralCode 
    ? `localbuka/${user.referralCode}`
    : user?.username 
      ? `localbuka/${user.username}.com`
      : 'localbuka/adejames.com';

  const userPoints = user?.loyaltyPoints ?? 56;

  const allSubTabs = [
    { id: 'refer', label: 'Refer & Earn' },
    { id: 'help', label: 'Help & Support / Contact Us' },
    { id: 'terms', label: 'Terms & Policies' },
  ];

  const subTabs =
    mode === 'support'
      ? allSubTabs.filter((t) => t.id !== 'refer')
      : mode === 'refer'
        ? allSubTabs.filter((t) => t.id === 'refer')
        : allSubTabs;

  const handleTabChange = (id: string) => {
    setCurrentTab(id);
    onSubTabChange?.(id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${referralLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChatSupport = () => {
    window.open('mailto:support@localbuka.com?subject=Support%20Chat%20Inquiry', '_blank');
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:support@localbuka.com?subject=Support%20Inquiry';
  };

  return (
    <div className='flex flex-col text-white'>
      {/* ── Sub-tab strip ── */}
      {mode !== 'refer' && (
        <div className='flex items-center gap-8 mb-8 overflow-x-auto scrollbar-hide'>
          {subTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`cursor-pointer bg-transparent border-none whitespace-nowrap text-[15px] font-semibold transition-colors pb-1 text-left ${
                  isActive ? 'text-white' : 'text-zinc-300 hover:text-white'
                }`}>
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════════════════
          REFER & EARN TAB
          ════════════════════════════════════════════════ */}
      {currentTab === 'refer' && (
        <div className='flex flex-col gap-6 max-w-[620px]'>
          {/* Description */}
          <p className='text-[13px] text-zinc-300 leading-relaxed m-0 font-normal'>
            Encourage your friends to download the app with your unique link and earn points.
            Easily convert your points to airtime or data!
          </p>

          {/* Referral link pill container */}
          <div
            onClick={handleCopy}
            className='flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-white/20 bg-zinc-900/60 hover:border-white/40 cursor-pointer transition-all w-[320px] max-w-full'>
            <span className='text-[13px] text-zinc-300 font-mono tracking-tight truncate'>
              {referralLink}
            </span>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className='bg-transparent border-none text-zinc-400 hover:text-white cursor-pointer p-0 ml-2 flex items-center shrink-0'
              aria-label='Copy link'>
              {copied ? (
                <Check size={16} className='text-emerald-400' />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          {/* Points card */}
          <div className='w-[320px] max-w-full p-4 rounded-xl bg-[#eaf7ed] text-[#1a1a1a] flex flex-col justify-between h-[116px] shadow-sm'>
            <span className='text-[11px] font-semibold text-zinc-600 tracking-tight'>
              Your total points
            </span>
            <div className='flex items-baseline justify-between'>
              <div className='flex items-baseline gap-1'>
                <span className='text-[42px] font-bold text-[#14532d] leading-none tracking-tight'>
                  {userPoints}
                </span>
                <span className='text-[12px] font-semibold text-zinc-600'>pts</span>
              </div>
              <button
                onClick={() => router.push('/rewards')}
                className='text-[12px] font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-md px-3.5 py-1.5 border-none cursor-pointer transition-colors'>
                Convert
              </button>
            </div>
          </div>

          {/* Top Earners section */}
          <div className='flex flex-col gap-3 mt-4 w-full'>
            {/* Header row */}
            <div className='flex items-center justify-between w-full'>
              <h4 className='text-[15px] font-semibold text-white m-0'>Top Earners</h4>
              <Link
                href='/rewards/leaderboard'
                className='flex items-center gap-0.5 text-[13px] text-zinc-400 hover:text-white transition-colors no-underline'>
                <span>See All</span>
                <ChevronRight size={15} />
              </Link>
            </div>

            {/* Earners row */}
            <div className='flex items-end gap-3.5 overflow-x-auto scrollbar-hide pt-6 pb-2'>
              {topEarners.map((earner) => (
                <div
                  key={earner.rank}
                  className='flex flex-col items-center shrink-0 w-[68px]'>
                  {/* Crown for rank 1 */}
                  <div className='h-5 flex items-center justify-center mb-1'>
                    {earner.rank === 1 && (
                      <span className='text-[20px] leading-none select-none drop-shadow-sm'>
                        👑
                      </span>
                    )}
                  </div>

                  {/* Avatar + Rank Badge */}
                  <div className='relative w-[58px] h-[58px]'>
                    <div className='w-full h-full rounded-full overflow-hidden border-2 border-[#FBBE15] bg-zinc-800'>
                      <img
                        src={earner.avatar}
                        alt={earner.name}
                        className='w-full h-full object-cover block'
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/profile.png';
                        }}
                      />
                    </div>
                    {/* Rank Circle */}
                    <div className='absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-[#FBBE15] text-[#1a1a1a] flex items-center justify-center font-black text-[10px] shadow-sm'>
                      {earner.rank}
                    </div>
                  </div>

                  {/* Name & Points */}
                  <span className='text-[11px] font-medium text-zinc-300 truncate max-w-full mt-2.5 text-center'>
                    {earner.name}
                  </span>
                  <span className='text-[10px] text-zinc-400 -mt-0.5'>
                    {earner.pts} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          HELP & SUPPORT / CONTACT US TAB
          ════════════════════════════════════════════════ */}
      {currentTab === 'help' && (
        <div className='flex flex-col gap-8 max-w-[540px] pt-2'>
          {/* Contact Support */}
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h4 className='text-[16px] font-semibold text-white m-0'>
                Contact Support
              </h4>
              <p className='text-[13px] text-zinc-400 mt-1 mb-0'>
                Chat our support team for help.
              </p>
            </div>
            <button
              onClick={handleChatSupport}
              className='px-5 py-2 bg-[#FBBE15] text-[#1a1a1a] text-[12px] font-bold rounded-full border-none cursor-pointer hover:bg-[#e5ab13] transition-colors whitespace-nowrap shadow-sm'>
              Chat with Support
            </button>
          </div>

          {/* Email Support */}
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h4 className='text-[16px] font-semibold text-white m-0'>
                Email Support
              </h4>
              <p className='text-[13px] text-zinc-400 mt-1 mb-0'>
                Email our support team for help.
              </p>
            </div>
            <button
              onClick={handleEmailSupport}
              className='px-6 py-2 bg-[#FBBE15] text-[#1a1a1a] text-[12px] font-bold rounded-full border-none cursor-pointer hover:bg-[#e5ab13] transition-colors whitespace-nowrap shadow-sm'>
              Send Email
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          TERMS & POLICIES TAB
          ════════════════════════════════════════════════ */}
      {currentTab === 'terms' && (
        <div className='flex flex-col gap-6 max-w-[540px] pt-2'>
          <div>
            <h4 className='text-[16px] font-semibold text-white m-0'>
              Terms &amp; Policies
            </h4>
            <p className='text-[13px] text-zinc-400 mt-1 mb-4'>
              Review our community guidelines, terms of service, and privacy standards.
            </p>
          </div>

          <div className='flex flex-col gap-3'>
            <Link
              href='/privacy'
              className='flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-white/25 transition-all text-white no-underline'>
              <span className='text-sm font-medium'>Privacy Policy</span>
              <ChevronRight size={16} className='text-zinc-400' />
            </Link>

            <Link
              href='/privacy#terms'
              className='flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-white/25 transition-all text-white no-underline'>
              <span className='text-sm font-medium'>Terms of Service</span>
              <ChevronRight size={16} className='text-zinc-400' />
            </Link>

            <Link
              href='/privacy#community'
              className='flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-white/25 transition-all text-white no-underline'>
              <span className='text-sm font-medium'>Community &amp; Content Guidelines</span>
              <ChevronRight size={16} className='text-zinc-400' />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
