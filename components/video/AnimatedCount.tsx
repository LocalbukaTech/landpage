'use client';

import {useEffect, useRef} from 'react';
import {formatCount} from '@/constants/mockVideos';
import {cn} from '@/lib/utils';

interface AnimatedCountProps {
  count: number;
}

export function AnimatedCount({count}: AnimatedCountProps) {
  const prevCountRef = useRef(count);
  const elementRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (count !== prevCountRef.current) {
      // Count changed, trigger animation
      if (elementRef.current) {
        elementRef.current.classList.add('animate-count-pop');

        const timer = setTimeout(() => {
          elementRef.current?.classList.remove('animate-count-pop');
        }, 300);

        return () => clearTimeout(timer);
      }

      prevCountRef.current = count;
    }
  }, [count]);

  return (
    <h6
      ref={elementRef}
      className={cn(
        'text-xs font-medium text-white transition-all duration-300',
      )}>
      {formatCount(count || 0)}
    </h6>
  );
}
