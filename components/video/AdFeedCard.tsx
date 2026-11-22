'use client';

import {useRef} from 'react';
import {InFeedAd} from '@/components/ads/InFeedAd';

interface AdFeedCardProps {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  slot?: string;
  layoutKey?: string;
}

export function AdFeedCard({
  onSwipeUp,
  onSwipeDown,
  slot = '6202753675',
  layoutKey = '-6t+ed+2i-1n-4w',
}: AdFeedCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null || touchEndY.current === null) {
      touchStartY.current = null;
      touchEndY.current = null;
      return;
    }

    const diffY = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 50;

    if (Math.abs(diffY) > minSwipeDistance) {
      if (diffY > 0 && onSwipeUp) {
        onSwipeUp();
      } else if (diffY < 0 && onSwipeDown) {
        onSwipeDown();
      }
    }

    touchStartY.current = null;
    touchEndY.current = null;
  };

  return (
    <div
      ref={containerRef}
      className='relative w-full max-w-[420px] h-full bg-black md:rounded-2xl overflow-hidden flex flex-col justify-between select-none shadow-2xl'
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      
      {/* Full-bleed Ad Container (fills the entire card like a native post) */}
      <div className='absolute inset-0 w-full h-full flex flex-col'>
        <InFeedAd slot={slot} layoutKey={layoutKey} />
      </div>
    </div>
  );
}

export default AdFeedCard;
