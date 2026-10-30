'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  InsightsHeader,
  type TimeRange,
} from '@/components/insights/InsightsHeader';
import {
  InsightsTabs,
  type InsightsTab,
} from '@/components/insights/InsightsTabs';
import { OverviewTab } from '@/components/insights/OverviewTab';
import { ContentTab } from '@/components/insights/ContentTab';
import { AudienceTab } from '@/components/insights/AudienceTab';
import { useInsightsDashboard } from '@/lib/api/services/insights.hooks';
import type { InsightsPeriod } from '@/lib/api/services/insights.service';

// Map UI TimeRange → API period param
const periodMap: Record<TimeRange, InsightsPeriod> = {
  '7d': '7d',
  '30d': '30d',
  '90d': '90d',
  all: 'all',
};

function InsightsContent() {
  const searchParams = useSearchParams();
  const isDemoFromQuery = searchParams.get('demo') === 'true';

  const [activeTab, setActiveTab] = useState<InsightsTab>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const isDemo = isDemoFromQuery;

  const { data, isLoading, isError } = useInsightsDashboard(
    periodMap[timeRange],
    isDemo
  );

  return (
    <MainLayout>
      <div
        className='w-full max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-28 md:pb-12 flex flex-col gap-6'
        style={{ fontFamily: 'var(--font-nunito-sans), Nunito Sans, sans-serif' }}
        id='insights-page-root'
      >
        {/* Header + Time Filter */}
        <InsightsHeader
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />

        {/* Tab Switcher */}
        <InsightsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <OverviewTab
            isLoading={isLoading}
            isError={isError}
            data={data?.overview ?? null}
          />
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <ContentTab
            isLoading={isLoading}
            isError={isError}
            data={data?.content ?? null}
          />
        )}

        {/* Audience Tab */}
        {activeTab === 'audience' && (
          <AudienceTab
            isLoading={isLoading}
            isError={isError}
            data={data?.audience ?? null}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default function InsightsPage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-[#141416]' />}>
      <InsightsContent />
    </Suspense>
  );
}
