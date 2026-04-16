'use client';

import {useState} from 'react';
import Image from 'next/image';
import {Copy, ChevronRight, Crown} from 'lucide-react';

interface RewardsSupportProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

const topEarners = [
  {name: 'Meghan Jes...', pts: 40, rank: 2, avatar: '/images/soup.png'},
  {name: 'Bryan Wolf', pts: 43, rank: 1, avatar: '/images/soup.png'},
  {name: 'Alex Turner', pts: 38, rank: 3, avatar: '/images/soup.png'},
  {name: 'Eleanor Pena', pts: 38, rank: 4, avatar: '/images/soup.png'},
  {name: 'Jane Cooper', pts: 38, rank: 5, avatar: '/images/soup.png'},
  {name: 'Albert Flores', pts: 38, rank: 6, avatar: '/images/soup.png'},
];

export function RewardsSupport({
  activeSubTab = 'refer',
  onSubTabChange,
}: RewardsSupportProps) {
  const [currentTab, setCurrentTab] = useState(activeSubTab);
  const [copied, setCopied] = useState(false);

  const subTabs = [
    {id: 'refer', label: 'Refer & Earn'},
    {id: 'help', label: 'Help & Support / Contact Us'},
    {id: 'terms', label: 'Terms & Policies'},
  ];

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    onSubTabChange?.(tabId);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('localbuka/adejames.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='flex flex-col gap-0'>
      {/* Sub-tabs */}
      <div className='flex gap-6 border-b border-white/10'>
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors cursor-pointer bg-transparent border-none ${
              currentTab === tab.id
                ? 'text-white border-b-2 border-[#FBBE15]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            style={
              currentTab === tab.id ? {borderBottom: '2px solid #FBBE15'} : {}
            }>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className='mt-8'>
        {currentTab === 'refer' && (
          <div className='flex flex-col gap-6'>
            {/* Description */}
            <p className='text-sm text-zinc-400 leading-relaxed max-w-lg'>
              Encourage your friends to download the app with your unique link
              and earn points. Easily convert your points to airtime or data!
            </p>

            {/* Referral Link */}
            <div className='flex items-center gap-3 max-w-md'>
              <div className='flex-1 px-4 py-3 border border-white/20 rounded-lg text-sm text-zinc-300 bg-transparent'>
                localbuka/adejames.com
              </div>
              <button
                onClick={handleCopy}
                className='p-3 text-zinc-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none'
                title={copied ? 'Copied!' : 'Copy link'}>
                <Copy size={18} />
              </button>
            </div>

            {/* Points Card */}
            <div className='max-w-md p-4 rounded-xl bg-[#f0fdf0] border border-green-200'>
              <p className='text-xs text-zinc-600 mb-1'>Your total points</p>
              <div className='flex items-center justify-between'>
                <div className='flex items-baseline gap-1'>
                  <span className='text-4xl font-bold text-[#1a1a1a]'>56</span>
                  <span className='text-sm text-zinc-500'>pts</span>
                </div>
                <button className='px-4 py-1.5 bg-[#166534] text-white text-xs font-semibold rounded-md hover:bg-[#15532d] transition-colors cursor-pointer border-none'>
                  Convert
                </button>
              </div>
            </div>

            {/* Top Earners */}
            <div className='mt-4'>
              <div className='flex items-center justify-between mb-4'>
                <h4 className='text-base font-semibold text-white'>
                  Top Earners
                </h4>
                <button className='flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none'>
                  See All <ChevronRight size={16} />
                </button>
              </div>

              <div className='flex gap-5 overflow-x-auto pb-2'>
                {topEarners.map((earner) => (
                  <div
                    key={earner.rank}
                    className='flex flex-col items-center gap-1 shrink-0'>
                    <div className='relative'>
                      {/* Crown for rank 1 */}
                      {earner.rank === 1 && (
                        <div className='absolute -top-4 left-1/2 -translate-x-1/2 z-10'>
                          <Crown
                            size={18}
                            className='text-[#FBBE15]'
                            fill='#FBBE15'
                          />
                        </div>
                      )}
                      <div className='w-16 h-16 rounded-full border-2 border-[#FBBE15] overflow-hidden'>
                        <Image
                          src={earner.avatar}
                          alt={earner.name}
                          width={64}
                          height={64}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      {/* Rank badge */}
                      <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FBBE15] flex items-center justify-center'>
                        <span className='text-[10px] font-bold text-[#1a1a1a]'>
                          {earner.rank}
                        </span>
                      </div>
                    </div>
                    <span className='text-xs text-zinc-300 mt-1 text-center max-w-[72px] truncate'>
                      {earner.name}
                    </span>
                    <span className='text-[10px] text-zinc-500'>
                      {earner.pts} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'help' && (
          <div className='flex flex-col gap-6'>
            {/* Contact Support */}
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-sm font-semibold text-white'>
                  Contact Support
                </h4>
                <p className='text-xs text-zinc-400 mt-0.5'>
                  Chat our support team for help.
                </p>
              </div>
              <button className='px-4 py-2 bg-[#FBBE15] text-[#1a1a1a] text-xs font-bold rounded-md hover:bg-[#e5ab13] transition-colors cursor-pointer border-none'>
                Chat with Support
              </button>
            </div>

            {/* Email Support */}
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-sm font-semibold text-white'>
                  Email Support
                </h4>
                <p className='text-xs text-zinc-400 mt-0.5'>
                  Email our support team for help.
                </p>
              </div>
              <button className='px-4 py-2 bg-[#FBBE15] text-[#1a1a1a] text-xs font-bold rounded-md hover:bg-[#e5ab13] transition-colors cursor-pointer border-none'>
                Send Email
              </button>
            </div>
          </div>
        )}

        {currentTab === 'terms' && (
          <div className='flex items-center justify-center py-20'>
            <div className='text-center'>
              <p className='text-2xl font-bold text-white mb-2'>Coming Soon</p>
              <p className='text-sm text-zinc-400'>
                Terms & Policies will be available in a future update.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
