'use client';

import {useState, Suspense} from 'react';
import {ChevronDown} from 'lucide-react';
import {MainLayout} from '@/components/layout/MainLayout';
import {OverviewTab} from '@/components/insights/OverviewTab';
import {ContentTab} from '@/components/insights/ContentTab';
import {AudienceTab} from '@/components/insights/AudienceTab';

type TabId = 'overview' | 'content' | 'audience';
type Period = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days';

const TABS: {id: TabId; label: string}[] = [
  {id: 'overview', label: 'Overview'},
  {id: 'content', label: 'Content'},
  {id: 'audience', label: 'Audience'},
];

const PERIODS: Period[] = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days'];

function InsightsContent() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [period, setPeriod] = useState<Period>('Last 7 Days');
  const [periodOpen, setPeriodOpen] = useState(false);

  return (
    <MainLayout>
      <div className='flex-1 min-w-0 w-full h-full overflow-y-auto'>
        <div className='max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6'>

          {/* Page Header */}
          <div className='space-y-1'>
            <h1 className='text-xl md:text-2xl font-bold text-white tracking-tight'>
              Insights &amp; Analytics
            </h1>
            <div className='w-full h-px bg-white/10 mt-2' />
            <p className='text-sm text-zinc-400 pt-1 leading-relaxed'>
              Track your content performance, discoverability, reach across the world
              <br className='hidden md:inline' /> and community growth.
            </p>
          </div>

          {/* Period picker + Tabs row */}
          <div className='flex items-center justify-between gap-4 flex-wrap'>
            {/* Tabs */}
            <div className='flex items-center gap-0 border-b border-white/10 w-full'>
              <div className='flex items-center gap-0 flex-1'>
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    id={`insights-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none outline-none whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-white'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFC727] rounded-full' />
                    )}
                  </button>
                ))}
              </div>

              {/* Period picker */}
              <div className='relative shrink-0 pb-2'>
                <button
                  id='insights-period-picker'
                  onClick={() => setPeriodOpen((prev) => !prev)}
                  className='flex items-center gap-2 px-3 py-1.5 bg-[#2a2a2a] border border-white/10 rounded-lg text-sm text-white font-medium hover:bg-[#333] transition-colors cursor-pointer outline-none'
                >
                  {period}
                  <ChevronDown
                    size={14}
                    className={`text-zinc-400 transition-transform duration-200 ${periodOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {periodOpen && (
                  <div className='absolute right-0 top-full mt-1 w-36 bg-[#2a2a2a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden'>
                    {PERIODS.map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setPeriod(p);
                          setPeriodOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer bg-transparent border-none outline-none ${
                          period === p
                            ? 'text-[#FFC727] bg-[#FFC727]/10'
                            : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'content' && <ContentTab />}
            {activeTab === 'audience' && <AudienceTab />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function InsightsPage() {
  return (
    <Suspense fallback={<div className='min-h-dvh bg-[#1a1a1a]' />}>
      <InsightsContent />
    </Suspense>
  );
}
