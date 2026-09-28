'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CreatorCommunityCarousel } from '@/components/community/CreatorCommunityCarousel';
import { CreatorCommunityForm } from '@/components/community/CreatorCommunityForm';
import { CreatorPaymentPortal } from '@/components/community/CreatorPaymentPortal';
import { CommunityExploreList } from '@/components/community/CommunityExploreList';
import { CreatorManagementDashboard } from '@/components/community/CreatorManagementDashboard';
import { useToast } from '@/hooks/use-toast';

type CommunityTab = 'recommended' | 'trending' | 'free' | 'paid' | 'creator';

export default function CommunityPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CommunityTab>('creator');
  const [creatorStep, setCreatorStep] = useState<'form' | 'payment' | 'created'>('form');
  const [creatorData, setCreatorData] = useState<{
    name: string;
    bio: string;
    avatar: string;
    category: 'free' | 'paid';
  }>({
    name: '',
    bio: '',
    avatar: '/images/community/avatar-1.png',
    category: 'paid',
  });

  const handleSelectPaidPlan = (data: {
    name: string;
    bio: string;
    category: 'free' | 'paid';
    avatar: string;
  }) => {
    setCreatorData(data);
    setCreatorStep('payment');
  };

  const handleSelectFreePlan = (data: {
    name: string;
    bio: string;
    category: 'free' | 'paid';
    avatar: string;
  }) => {
    setCreatorData(data);
    toast({
      title: 'Community Created! 🎉',
      description: 'Your free LocalBuka community has been registered successfully.',
    });
    setCreatorStep('created');
  };

  const handlePaymentSuccess = () => {
    setCreatorStep('created');
  };

  return (
    <MainLayout>
      <div className='w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 space-y-6'>
        {/* Page Header */}
        <div className='pb-4 border-b border-white/10'>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight'>
            Community
          </h1>
        </div>

        {/* Sub-tabs Navigation */}
        <div className='flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none'>
          {[
            { id: 'recommended', label: 'Recommended' },
            { id: 'trending', label: 'Trending' },
            { id: 'free', label: 'Free' },
            { id: 'paid', label: 'Paid' },
            { id: 'creator', label: 'Creator community' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as CommunityTab);
                  if (tab.id === 'creator' && creatorStep === 'created') {
                    setCreatorStep('form');
                  }
                }}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${isActive
                    ? tab.id === 'creator'
                      ? 'bg-[#FFC533] text-black shadow-md'
                      : 'bg-white text-black shadow-md'
                    : 'bg-[#262626] text-gray-300 hover:bg-[#333333] hover:text-white border border-white/5'
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'creator' ? (
          <div className='py-2'>
            {creatorStep === 'form' && (
              <div
                className='flex flex-col lg:flex-row w-full max-w-[970px] lg:h-[1010px] mx-auto bg-[#1a1a1a] rounded-[25px] overflow-hidden shadow-2xl border border-white/5'
              >
                {/* Left Side - Image Carousel — fills full height */}
                <div className='w-full lg:w-[485px] lg:h-full lg:flex-shrink-0 h-[450px]'>
                  <CreatorCommunityCarousel />
                </div>

                {/* Right Side — form */}
                <div className='flex-1 lg:h-full overflow-y-auto'>
                  <CreatorCommunityForm
                    onSelectPaidPlan={handleSelectPaidPlan}
                    onSelectFreePlan={handleSelectFreePlan}
                  />
                </div>
              </div>
            )}

            {creatorStep === 'payment' && (
              <div className='py-4'>
                <CreatorPaymentPortal
                  creatorDetails={creatorData}
                  onBack={() => setCreatorStep('form')}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            )}

            {creatorStep === 'created' && (
              <CreatorManagementDashboard />
            )}
          </div>
        ) : (
          <CommunityExploreList
            filterType={activeTab}
            onOpenCreatorFlow={() => {
              setActiveTab('creator');
              setCreatorStep('form');
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}
