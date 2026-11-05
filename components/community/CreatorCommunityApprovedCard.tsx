'use client';

import React from 'react';

interface CreatorCommunityApprovedCardProps {
  communityName?: string;
  liveSince?: string;
  price?: string;
  onGoToCommunity?: () => void;
  className?: string;
}

export function CreatorCommunityApprovedCard({
  communityName = 'Smoothie Lab Lagos',
  liveSince = 'Sept 24',
  price = '₦1,800/mo',
  onGoToCommunity,
  className = '',
}: CreatorCommunityApprovedCardProps) {
  return (
    <div
      className={`w-full max-w-[920px] mx-auto flex flex-col gap-4 sm:gap-5 animate-in fade-in duration-300 ${className}`}
    >
      {/* ─── Top Green Approval Banner ─── */}
      <div
        className="w-full border border-[#367C39] text-center flex flex-col items-center justify-center transition-all shadow-sm"
        style={{
          width: '100%',
          height: '243px',
          boxSizing: 'border-box',
          padding: '30px',
          borderRadius: '30px',
          gap: '10px',
          opacity: 1,
          background: '#367C3933',
        }}
      >
        <div className="flex flex-col items-center justify-center max-w-xl mx-auto" style={{ gap: '10px' }}>
          {/* Green Checkmark Circle SVG */}
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="22"
                cy="22"
                r="19"
                stroke="#367C39"
                strokeWidth="3.2"
              />
              <path
                d="M13.5 22.5L19.5 28.5L30.5 16.5"
                stroke="#367C39"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-bold text-[#48A74C] tracking-tight">
            Approved and live
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#6BB86F] font-normal leading-relaxed">
            {communityName} passed review and is now open to new members.
          </p>
        </div>
      </div>

      {/* ─── Middle Metrics Row (Live since & Price) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
        {/* Live since card */}
        <div className="w-full bg-[#242424] border border-white/5 rounded-[18px] p-5 sm:p-6 flex flex-col justify-center">
          <span className="text-xs sm:text-sm text-gray-400 font-normal mb-1">
            Live since
          </span>
          <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {liveSince}
          </span>
        </div>

        {/* Price card */}
        <div className="w-full bg-[#242424] border border-white/5 rounded-[18px] p-5 sm:p-6 flex flex-col justify-center">
          <span className="text-xs sm:text-sm text-gray-400 font-normal mb-1">
            Price
          </span>
          <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {price}
          </span>
        </div>
      </div>

      {/* ─── Bottom Next Steps Card ─── */}
      <div
        className="w-full bg-[#242424] flex flex-col justify-center transition-all duration-200"
        style={{
          width: '100%',
          height: '278px',
          boxSizing: 'border-box',
          paddingTop: '10px',
          paddingRight: '30px',
          paddingBottom: '10px',
          paddingLeft: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '30px',
          gap: '10px',
          opacity: 1,
        }}
      >
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Next steps
        </h3>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-3xl">
          Post your first piece of content and share your community link so people can find you.
        </p>
      </div>

      {/* ─── Action Buttons ─── */}
      <div
        className="w-full flex flex-col sm:flex-row items-center pt-2"
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          gap: '24px',
        }}
      >
        {/* Primary Button */}
        <button
          type="button"
          onClick={onGoToCommunity}
          className="transition-all duration-200 active:scale-[0.99] cursor-pointer hover:brightness-105"
          style={{
            flex: 1,
            height: '72px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '0px',
            paddingBottom: '0px',
            background: '#FBBE15',
            color: '#111111',
            fontWeight: 600,
            fontSize: '16px',
            textAlign: 'center',
            border: 'none',
          }}
        >
          <span>Create a new community</span>
        </button>

        {/* Contact Support Button */}
        <button
          type="button"
          className="transition-all duration-200 active:scale-[0.99] cursor-pointer hover:brightness-110"
          style={{
            flex: 1,
            height: '72px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '0px',
            paddingBottom: '0px',
            background: '#333333',
            color: '#FFFFFF',
            fontWeight: 500,
            fontSize: '16px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <span>Contact Support</span>
        </button>
      </div>
    </div>
  );
}

export default CreatorCommunityApprovedCard;
