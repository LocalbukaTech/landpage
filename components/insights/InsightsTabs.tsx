'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type InsightsTab = 'overview' | 'content' | 'audience';

interface InsightsTabsProps {
  activeTab: InsightsTab;
  onTabChange: (tab: InsightsTab) => void;
}

const TABS: { id: InsightsTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'content', label: 'Content' },
  { id: 'audience', label: 'Audience' },
];

export function InsightsTabs({ activeTab, onTabChange }: InsightsTabsProps) {
  return (
    <div className='flex items-center gap-8 border-b border-white/10'>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type='button'
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'pb-3.5 text-sm sm:text-base font-bold transition-all duration-200 relative cursor-pointer bg-transparent border-none outline-none',
              isActive
                ? 'text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            <span>{tab.label}</span>
            {isActive && (
              <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-[#FBBE15] rounded-full shadow-[0_0_8px_rgba(251,190,21,0.5)]' />
            )}
          </button>
        );
      })}
    </div>
  );
}
