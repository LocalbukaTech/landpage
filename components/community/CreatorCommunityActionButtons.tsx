'use client';

import React from 'react';

interface CreatorCommunityActionButtonsProps {
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  primaryDisabled?: boolean;
  secondaryDisabled?: boolean;
  className?: string;
}

export function CreatorCommunityActionButtons({
  primaryLabel = 'Create a new community',
  secondaryLabel = 'Contact Support',
  onPrimaryClick,
  onSecondaryClick,
  primaryDisabled = false,
  secondaryDisabled = false,
  className = '',
}: CreatorCommunityActionButtonsProps) {
  return (
    <div
      className={`w-full flex flex-col sm:flex-row items-center ${className}`}
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
        onClick={onPrimaryClick}
        disabled={primaryDisabled}
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
        <span>{primaryLabel}</span>
      </button>

      {/* Secondary Button */}
      <button
        type="button"
        onClick={onSecondaryClick}
        disabled={secondaryDisabled}
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
        <span>{secondaryLabel}</span>
      </button>
    </div>
  );
}

export default CreatorCommunityActionButtons;
