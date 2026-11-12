'use client';

import { use } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunitySubscribeView } from '@/components/community/CommunitySubscribeView';
import { useCommunity } from '@/lib/api/services/community.hooks';

interface CommunitySubscribePageProps {
  params: Promise<{ id: string }>;
}

const CREATOR_COMMUNITY_STORAGE_KEY = 'localbuka_creator_community_v1';

export default function CommunitySubscribePage({ params }: CommunitySubscribePageProps) {
  const { id } = use(params);
  const { data: community } = useCommunity(id);

  let localCreatorFallback: {
    name?: string;
    avatar?: string;
    coverImage?: string;
    pricePerMonth?: number;
    yearlyPrice?: number;
    payoutAccount?: { bankName?: string; accountNumber?: string };
  } | null = null;

  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(CREATOR_COMMUNITY_STORAGE_KEY);
      if (saved) {
        localCreatorFallback = JSON.parse(saved);
      }
    } catch {
      // ignore storage errors
    }
  }

  const rawPrice =
    community?.priceAmount ??
    localCreatorFallback?.pricePerMonth ??
    2000;
  const monthlyPrice = Math.max(2000, Number(rawPrice) || 2000);
  const yearlyPrice =
    community?.yearlyPriceAmount ??
    localCreatorFallback?.yearlyPrice ??
    monthlyPrice * 10;

  const communityName =
    community?.name ||
    localCreatorFallback?.name ||
    id
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const communityImage =
    community?.coverImage ||
    community?.avatar ||
    localCreatorFallback?.coverImage ||
    localCreatorFallback?.avatar ||
    '/images/community/cover-1.jpg';

  return (
    <MainLayout>
      <div className='w-full max-w-[1160px] mx-auto px-4 sm:px-6 md:px-10 py-6 text-white'>
        <CommunitySubscribeView
          communityId={id}
          communityName={communityName}
          communityImage={communityImage}
          monthlyPrice={`₦${monthlyPrice.toLocaleString('en-NG')}`}
          yearlyPrice={`₦${yearlyPrice.toLocaleString('en-NG')}`}
          monthlyAmount={monthlyPrice}
          yearlyAmount={yearlyPrice}
        />
      </div>
    </MainLayout>
  );
}
