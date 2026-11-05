'use client';

import React from 'react';

interface CreatorCommunityRejectedCardProps {
  reviewDate?: string;
  caseId?: string;
  rejectionReason?: string;
  feedbackMessage?: string;
  actionMessage?: string;
  onCreateNewCommunity?: () => void;
  onContactSupport?: () => void;
  className?: string;
}

export function CreatorCommunityRejectedCard({
  reviewDate = '1 day ago',
  caseId = 'CR-1041',
  rejectionReason = "This community didn't meet our requirements and can't be published.",
  feedbackMessage = "Pricing described does not match LocalBuka's membership guidelines. This community cannot be published.",
  actionMessage = "Pricing described does not match LocalBuka's membership guidelines. This community cannot be published.",
  onCreateNewCommunity,
  onContactSupport,
  className = '',
}: CreatorCommunityRejectedCardProps) {
  return (
    <div
      className={`w-full max-w-[920px] mx-auto flex flex-col gap-4 sm:gap-5 animate-in fade-in duration-300 ${className}`}
    >
      {/* ─── Top "Not approved" Banner ─── */}
      <div
        className="w-full transition-all duration-200"
        style={{
          background: 'rgba(232, 0, 0, 0.1)',
          border: '1px solid #E80000',
          borderRadius: '24px',
          paddingTop: '24px',
          paddingBottom: '24px',
          paddingLeft: '32px',
          paddingRight: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          opacity: 1,
        }}
      >
        {/* Header Row: Red X Icon + Title & Review metadata */}
        <div className="flex items-center gap-3.5">
          {/* Red Circle X SVG */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
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
                stroke="#FF4D4D"
                strokeWidth="3.2"
              />
              <path
                d="M16 16L28 28"
                stroke="#FF4D4D"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M28 16L16 28"
                stroke="#FF4D4D"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
              Not approved
            </h2>
            <span className="text-xs sm:text-sm text-[#FF8A8A] font-medium leading-tight mt-0.5">
              Reviewed {reviewDate} . {caseId}
            </span>
          </div>
        </div>

        {/* Rejection summary text */}
        <p className="text-xs sm:text-sm text-gray-200 font-normal leading-relaxed pt-1">
          {rejectionReason}
        </p>
      </div>

      {/* ─── Box 1: Feedback from admin ─── */}
      <div className="w-full bg-[#242424] border border-white/5 rounded-[18px] p-5 sm:p-6 flex flex-col justify-center transition-all duration-200">
        <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 tracking-tight">
          Feedback from admin
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">
          {feedbackMessage}
        </p>
      </div>

      {/* ─── Box 2: What you can do ─── */}
      <div className="w-full bg-[#242424] border border-white/5 rounded-[18px] p-5 sm:p-6 flex flex-col justify-center transition-all duration-200">
        <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 tracking-tight">
          What you can do
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">
          {actionMessage}
        </p>
      </div>

      {/* ─── Bottom Action Buttons (Exact Calibrated Proportions) ─── */}
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
          onClick={onCreateNewCommunity}
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

        {/* Secondary Button */}
        <button
          type="button"
          onClick={onContactSupport}
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

export default CreatorCommunityRejectedCard;
