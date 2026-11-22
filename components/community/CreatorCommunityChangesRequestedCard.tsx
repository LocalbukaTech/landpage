'use client';

import React from 'react';

interface ChangeItem {
  label: string;
  status: 'pending' | 'updated' | 'none';
}

interface CreatorCommunityChangesRequestedCardProps {
  reviewDate?: string;
  caseId?: string;
  summaryMessage?: string;
  feedbackMessage?: string;
  changeItems?: ChangeItem[];
  onEditAndResubmit?: () => void;
  className?: string;
}

export function CreatorCommunityChangesRequestedCard({
  reviewDate = '1 day ago',
  caseId = 'CR-1041',
  summaryMessage = 'Your community is almost ready. Update the items below and resubmit for another review.',
  feedbackMessage = "Your pricing section doesn't clearly state the billing cadence. Please specify monthly vs. annual before resubmitting.",
  changeItems = [
    { label: 'Pricing and billing cadence', status: 'pending' },
    { label: 'Name, bio and category', status: 'none' },
    { label: 'Member benefits', status: 'none' },
  ],
  onEditAndResubmit,
  className = '',
}: CreatorCommunityChangesRequestedCardProps) {
  return (
    <div
      className={`w-full max-w-[920px] mx-auto flex flex-col gap-4 sm:gap-5 animate-in fade-in duration-300 ${className}`}
    >
      {/* ─── Top "Changes requested" Banner ─── */}
      <div
        className="w-full transition-all duration-200"
        style={{
          background: '#E4AD1333',
          border: '1px solid #E4AD1350',
          borderRadius: '24px',
          paddingTop: '30px',
          paddingBottom: '30px',
          paddingLeft: '40px',
          paddingRight: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          opacity: 1,
        }}
      >
        {/* Header Row: Warning Icon + Title & Review metadata */}
        <div className="flex items-center gap-3.5">
          {/* Amber Circle Exclamation SVG */}
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
                stroke="#FBBE15"
                strokeWidth="3.2"
              />
              <line
                x1="22"
                y1="13"
                x2="22"
                y2="25"
                stroke="#FBBE15"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <circle cx="22" cy="31" r="1.8" fill="#FBBE15" />
            </svg>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
              Changes requested
            </h2>
            <span className="text-xs sm:text-sm text-[#FBBE15] font-medium leading-tight mt-0.5">
              Reviewed {reviewDate} · {caseId}
            </span>
          </div>
        </div>

        {/* Summary text */}
        <p className="text-xs sm:text-sm text-gray-200 font-normal leading-relaxed pt-1">
          {summaryMessage}
        </p>
      </div>

      {/* ─── Feedback from admin ─── */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-white mb-2.5 tracking-tight">
          Feedback from admin
        </h3>
        <div
          className="w-full transition-all duration-200"
          style={{
            background: '#333333',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '22px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            opacity: 1,
          }}
        >
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">
            {feedbackMessage}
          </p>
        </div>
      </div>

      {/* ─── What needs to change ─── */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-white mb-2.5 tracking-tight">
          What needs to change
        </h3>
        <div
          className="w-full overflow-hidden transition-all duration-200"
          style={{
            background: '#1E1E1E',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
          }}
        >
          {changeItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between transition-colors duration-150 hover:bg-white/[0.03]"
              style={{
                paddingTop: '18px',
                paddingBottom: '18px',
                paddingLeft: '28px',
                paddingRight: '28px',
                borderBottom:
                  index < changeItems.length - 1
                    ? '1px solid rgba(255, 255, 255, 0.06)'
                    : 'none',
              }}
            >
              <span className="text-sm text-gray-300 font-normal">
                {item.label}
              </span>

              {item.status === 'pending' && (
                <span
                  className="inline-flex items-center"
                  style={{
                    background: '#8C5B00',
                    color: '#FFD666',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    lineHeight: '1.4',
                    letterSpacing: '0.02em',
                  }}
                >
                  Pending review
                </span>
              )}

              {item.status === 'updated' && (
                <span
                  className="inline-flex items-center gap-1"
                  style={{
                    background: 'rgba(34, 197, 94, 0.15)',
                    color: '#22c55e',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    lineHeight: '1.4',
                    letterSpacing: '0.02em',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="#22c55e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Updated
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Edit and resubmit Button ─── */}
      <div className="w-full flex justify-start" style={{ paddingTop: '24px' }}>
        <button
          type="button"
          onClick={onEditAndResubmit}
          className="transition-all duration-200 active:scale-[0.98] cursor-pointer hover:brightness-110"
          style={{
            width: '300px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '7px',
            background: '#FBBE15',
            color: '#111111',
            fontWeight: 700,
            fontSize: '15px',
            border: 'none',
            letterSpacing: '0.01em',
          }}
        >
          Edit and resubmit
        </button>
      </div>
    </div>
  );
}

export default CreatorCommunityChangesRequestedCard;
