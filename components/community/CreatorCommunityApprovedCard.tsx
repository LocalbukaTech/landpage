'use client';

import React, { useState } from 'react';
import { Copy, Check, Link2, Building2 } from 'lucide-react';

interface CreatorCommunityApprovedCardProps {
  communityName?: string;
  liveSince?: string;
  price?: string;
  payoutAccountSummary?: string;
  paymentLink?: string;
  onGoToCommunity?: () => void;
  onCreateNew?: () => void;
  className?: string;
}

export function CreatorCommunityApprovedCard({
  communityName = 'Smoothie Lab Lagos',
  liveSince = 'Sept 24',
  price = '₦2,000/mo',
  payoutAccountSummary,
  paymentLink,
  onGoToCommunity,
  onCreateNew,
  className = '',
}: CreatorCommunityApprovedCardProps) {
  const [copied, setCopied] = useState(false);

  const slug =
    communityName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'chef-tolu-s-vip-kitchen';

  const originUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000';

  const defaultCheckoutUrl =
    price === 'Free'
      ? `${originUrl}/community/${slug}`
      : `${originUrl}/community/${slug}/subscribe`;

  const shareUrl =
    paymentLink && paymentLink !== 'https://paystack.com/pay/localbuka-creator'
      ? paymentLink
      : defaultCheckoutUrl;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`w-full max-w-[920px] mx-auto flex flex-col gap-4 sm:gap-5 animate-in fade-in duration-300 ${className}`}
    >
      {/* ─── Top Green Approval Banner ─── */}
      <div
        className="w-full border border-[#367C39] text-center flex flex-col items-center justify-center transition-all shadow-sm"
        style={{
          width: '100%',
          minHeight: '220px',
          boxSizing: 'border-box',
          padding: '30px',
          borderRadius: '30px',
          gap: '10px',
          opacity: 1,
          background: '#367C3933',
        }}
      >
        <div
          className="flex flex-col items-center justify-center max-w-xl mx-auto"
          style={{ gap: '10px' }}
        >
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

      {/* ─── Middle Metrics Row (Live since, Price & Payout Account) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full">
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
            Price &amp; Bracket
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#FFC533] tracking-tight">
            {price}
          </span>
        </div>

        {/* Payout Account card */}
        <div className="w-full bg-[#242424] border border-white/5 rounded-[18px] p-5 sm:p-6 flex flex-col justify-center">
          <span className="text-xs sm:text-sm text-gray-400 font-normal mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#4ade80]" />
            <span>Settlement Account</span>
          </span>
          <span className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            {payoutAccountSummary || 'Zenith Bank · 2083948192'}
          </span>
        </div>
      </div>

      {/* ─── Bottom Next Steps & Shareable Link Card ─── */}
      <div
        className="w-full bg-[#242424] flex flex-col justify-center transition-all duration-200"
        style={{
          width: '100%',
          minHeight: '210px',
          boxSizing: 'border-box',
          padding: '28px 30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '30px',
          gap: '14px',
          opacity: 1,
        }}
      >
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-1.5">
            Next steps
          </h3>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-3xl">
            Post your first piece of content and share your community payment &amp; invite link so people can find and subscribe to your community.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#1a1a1a] border border-white/8 px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link2 className="w-4 h-4 text-[#FFC533] shrink-0" />
            <span className="text-xs sm:text-sm font-mono text-white/90 truncate">
              {shareUrl}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FFC533] px-4 py-2 text-xs font-bold text-black hover:bg-[#e6b12d] transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied Link!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Community Link</span>
                </>
              )}
            </button>
            <span className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs font-semibold text-gray-400 cursor-not-allowed">
              <span>Paystack Closed Until Deploy</span>
            </span>
          </div>
        </div>
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
        {/* Primary Button: Go to Creator Dashboard */}
        <button
          type="button"
          onClick={onGoToCommunity}
          className="transition-all duration-200 active:scale-[0.99] cursor-pointer hover:brightness-105"
          style={{
            flex: 1,
            height: '64px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            paddingLeft: '16px',
            paddingRight: '16px',
            background: '#FBBE15',
            color: '#111111',
            fontWeight: 700,
            fontSize: '16px',
            textAlign: 'center',
            border: 'none',
          }}
        >
          <span>Manage in Creator Dashboard →</span>
        </button>

        {/* Secondary Button: Create Another Community */}
        <button
          type="button"
          onClick={onCreateNew || onGoToCommunity}
          className="transition-all duration-200 active:scale-[0.99] cursor-pointer hover:brightness-110"
          style={{
            flex: 1,
            height: '64px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            paddingLeft: '16px',
            paddingRight: '16px',
            background: '#333333',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '16px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <span>Create a new community</span>
        </button>
      </div>
    </div>
  );
}

export default CreatorCommunityApprovedCard;
