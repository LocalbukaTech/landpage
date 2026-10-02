'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { CreatorCommunityCarousel } from '@/components/community/CreatorCommunityCarousel';
import { CreatorCommunityForm } from '@/components/community/CreatorCommunityForm';
import { CreatorPaymentPortal } from '@/components/community/CreatorPaymentPortal';
import { CommunityExploreList } from '@/components/community/CommunityExploreList';
import { CreatorManagementDashboard } from '@/components/community/CreatorManagementDashboard';
import { CommunityMembershipsList } from '@/components/community/CommunityMembershipsList';
import { useToast } from '@/hooks/use-toast';

type CommunityTab = 'recommended' | 'trending' | 'free' | 'paid' | 'creator' | 'memberships';

function CommunityContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const stateParam = searchParams.get('state');
  const emptyParam = searchParams.get('empty');
  const tabParam = searchParams.get('tab') as CommunityTab | null;

  const isForceEmpty = stateParam === 'empty' || emptyParam === 'true';

  const [userTab, setUserTab] = useState<CommunityTab | null>(null);
  const activeTab: CommunityTab = userTab ?? tabParam ?? 'recommended';
  const setActiveTab = (tab: CommunityTab) => setUserTab(tab);

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

  if (isForceEmpty) {
    return (
      <div className='w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 flex flex-col min-h-[calc(100vh-140px)] space-y-6'>
        {/* Page Header */}
        <div className='pb-4 border-b border-white/10'>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight'>
            Community
          </h1>
        </div>

        {/* Exact Centered Empty State matching Figma */}
        <div className='flex-1 flex flex-col items-center justify-center py-12'>
          <div
            className='flex flex-col items-center justify-center text-center mx-auto'
            style={{
              maxWidth: '430px',
              width: '100%',
              gap: '24px',
            }}
          >
            {/* Exact Figma Vector-11 icon (Community silhouettes) */}
            <div className='flex items-center justify-center shrink-0'>
              <svg
                width='70'
                height='45'
                viewBox='0 0 70 45'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                style={{ width: '70px', height: '45px' }}
              >
                <path
                  d='M33.9543 30.8962C36.7025 28.5862 38.6737 25.4869 39.6007 22.0186C40.5277 18.5502 40.3655 14.8807 39.1362 11.5077C37.9069 8.13462 35.6699 5.22127 32.7287 3.16271C29.7874 1.10415 26.2842 0 22.6941 0C19.1041 0 15.6008 1.10415 12.6596 3.16271C9.71834 5.22127 7.48137 8.13462 6.25206 11.5077C5.02275 14.8807 4.86058 18.5502 5.78756 22.0186C6.71453 25.4869 8.68578 28.5862 11.434 30.8962C7.1426 32.8366 3.42367 35.8502 0.635934 39.6462C0.121041 40.3479 -0.0940409 41.2253 0.0380037 42.0855C0.170048 42.9457 0.638403 43.7182 1.34004 44.2331C2.04167 44.748 2.9191 44.9631 3.77932 44.8311C4.63953 44.699 5.41206 44.2307 5.92695 43.529C7.85671 40.8935 10.3806 38.7499 13.2938 37.2723C16.2071 35.7947 19.4276 35.0247 22.6941 35.0247C25.9607 35.0247 29.1812 35.7947 32.0944 37.2723C35.0077 38.7499 37.5316 40.8935 39.4613 43.529C39.9762 44.231 40.7489 44.6997 41.6094 44.832C42.4698 44.9643 43.3476 44.7494 44.0496 44.2345C44.7516 43.7196 45.2203 42.9469 45.3526 42.0865C45.4849 41.226 45.27 40.3482 44.7551 39.6462C41.9657 35.8507 38.246 32.8373 33.9543 30.8962ZM11.7566 17.5142C11.7566 15.351 12.3981 13.2363 13.5999 11.4376C14.8018 9.63898 16.51 8.2371 18.5085 7.40926C20.5071 6.58143 22.7063 6.36483 24.8279 6.78686C26.9496 7.20888 28.8985 8.25058 30.4281 9.78021C31.9578 11.3099 32.9995 13.2587 33.4215 15.3804C33.8435 17.5021 33.6269 19.7012 32.7991 21.6998C31.9712 23.6984 30.5693 25.4066 28.7707 26.6084C26.972 27.8102 24.8574 28.4517 22.6941 28.4517C19.7933 28.4517 17.0113 27.2994 14.9602 25.2482C12.909 23.197 11.7566 20.415 11.7566 17.5142ZM68.1121 44.2208C67.7647 44.4761 67.3705 44.6604 66.9519 44.7632C66.5332 44.8661 66.0985 44.8854 65.6724 44.8201C65.2463 44.7549 64.8372 44.6063 64.4685 44.3829C64.0999 44.1595 63.7789 43.8656 63.5238 43.5181C61.5893 40.8876 59.0644 38.7477 56.1522 37.2708C53.2401 35.0209 46.7566 35.0142C45.8864 35.0142 45.0518 34.6685 44.4364 34.0531C43.8211 33.4378 43.4754 32.6032 43.4754 31.7329C43.4754 30.8627 43.8211 30.0281 44.4364 29.4128C45.0518 28.7974 45.8864 28.4517 46.7566 28.4517C48.3112 28.4489 49.8474 28.1148 51.2627 27.4715C52.6779 26.8283 53.9398 25.8908 54.9642 24.7214C55.9886 23.5521 56.752 22.1778 57.2034 20.6901C57.6548 19.2025 57.7839 17.6358 57.5821 16.0943C57.3803 14.5529 56.8522 13.0722 56.033 11.7509C55.2138 10.4296 54.1224 9.29817 52.8315 8.43195C51.5406 7.56573 50.0799 6.98465 48.5467 6.72744C47.0135 6.47024 45.4431 6.54283 43.9402 6.94037C43.5205 7.06181 43.0807 7.09818 42.6467 7.04735C42.2127 6.99653 41.7932 6.85953 41.4129 6.64439C41.0325 6.42926 40.699 6.14032 40.4318 5.79454C40.1647 5.44875 39.9692 5.05309 39.8571 4.63077C39.7449 4.20844 39.7182 3.76797 39.7785 3.33518C39.8389 2.9024 39.9851 2.48603 40.2085 2.11051C40.432 1.73499 40.7282 1.40788 41.0797 1.14839C41.4313 0.888887 41.8312 0.702224 42.2559 0.599351C46.0989 -0.418931 50.1741 -0.0983023 53.8107 1.50845C57.4472 3.11521 60.4282 5.91231 62.263 9.43928C64.0978 12.9662 64.677 17.0128 63.9052 20.9129C63.1334 24.8129 61.0566 28.3339 58.0168 30.8962C62.3082 32.8366 66.0271 35.8502 68.8148 39.6462C69.326 40.3468 69.5391 41.2213 69.4074 42.0785C69.2757 42.9358 68.81 43.706 68.1121 44.2208Z'
                  fill='#5C5C5C'
                />
              </svg>
            </div>

            {/* Texts container */}
            <div className='flex flex-col items-center gap-2 max-w-[360px]'>
              <h3
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '140%',
                  color: 'white',
                  margin: 0,
                }}
              >
                No communities yet
              </h3>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '140%',
                  color: '#9ca3af',
                  margin: 0,
                }}
              >
                There&apos;s nothing here right now. Check back soon, or start your own community around the food you love.
              </p>
            </div>

            {/* Action button */}
            <button
              onClick={() => {
                setActiveTab('creator');
                setCreatorStep('form');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 32px',
                borderRadius: '12px',
                background: '#FFC533',
                color: '#111',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              className='hover:opacity-90 active:scale-95'
            >
              Create a community
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
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
          { id: 'memberships', label: 'My memberships' },
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
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#FFC533] text-black shadow-md'
                  : 'bg-[#262626] text-gray-300 hover:bg-[#333333] hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'memberships' ? (
        <div className='py-2'>
          <CommunityMembershipsList />
        </div>
      ) : activeTab === 'creator' ? (
        <div className='py-2'>
          {creatorStep === 'form' && (
            <div className='flex flex-col lg:flex-row w-full max-w-[970px] lg:h-[1010px] mx-auto bg-[#1a1a1a] rounded-[25px] overflow-hidden shadow-2xl border border-white/5'>
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

          {creatorStep === 'created' && <CreatorManagementDashboard />}
        </div>
      ) : (
        <CommunityExploreList
          filterType={activeTab}
          forceEmpty={isForceEmpty}
          onOpenCreatorFlow={() => {
            setActiveTab('creator');
            setCreatorStep('form');
          }}
        />
      )}
    </div>
  );
}

export default function CommunityPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className='p-8 text-white'>Loading...</div>}>
        <CommunityContent />
      </Suspense>
    </MainLayout>
  );
}
