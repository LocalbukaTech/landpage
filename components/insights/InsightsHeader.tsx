'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TimeRange = '7d' | '30d' | '90d' | 'all';

interface TimeRangeOption {
  value: TimeRange;
  label: string;
}

const TIME_OPTIONS: TimeRangeOption[] = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'all', label: 'All Time' },
];

interface InsightsHeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (val: TimeRange) => void;
}

export function InsightsHeader({
  timeRange,
  onTimeRangeChange,
}: InsightsHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    TIME_OPTIONS.find((opt) => opt.value === timeRange) || TIME_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='flex flex-col gap-4 pb-4 border-b border-white/10'>
      <div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
        <div className='flex flex-col gap-1.5'>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight m-0'>
            Insights &amp; Analytics
          </h1>
          <p className='text-xs sm:text-sm text-zinc-400 max-w-2xl m-0 leading-relaxed'>
            Track your content performance, discoverability, reach across the world and community growth.
          </p>
        </div>

        {/* Time Filter Dropdown */}
        <div className='relative shrink-0' ref={dropdownRef}>
          <button
            type='button'
            onClick={() => setIsOpen(!isOpen)}
            className='flex items-center justify-between gap-2.5 px-4 py-2 rounded-xl bg-[#222226] hover:bg-[#2c2c32] border border-white/10 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm min-w-[130px]'
          >
            <span>{selectedOption.label}</span>
            <ChevronDown
              size={15}
              className={cn(
                'text-zinc-400 transition-transform duration-200',
                isOpen ? 'rotate-180 text-[#FBBE15]' : ''
              )}
            />
          </button>

          {isOpen && (
            <div className='absolute right-0 top-full mt-1.5 w-44 bg-[#1e1e24] border border-white/10 rounded-xl py-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150'>
              {TIME_OPTIONS.map((opt) => {
                const isSelected = opt.value === timeRange;
                return (
                  <button
                    key={opt.value}
                    type='button'
                    onClick={() => {
                      onTimeRangeChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors cursor-pointer',
                      isSelected
                        ? 'text-[#FBBE15] bg-[#FBBE15]/10 font-bold'
                        : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} className='text-[#FBBE15]' />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
