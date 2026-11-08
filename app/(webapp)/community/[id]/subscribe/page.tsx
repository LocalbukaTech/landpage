'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunitySubscribeView } from '@/components/community/CommunitySubscribeView';
import { MobileSubscribeCheckout } from '@/components/community/mobile/MobileSubscribeCheckout';
import { MOCK_COMMUNITIES } from '@/components/community/mobile/mockData';

interface Props {
  params: Promise<{ id: string }>;
}

export default function CommunitySubscribePage({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);

  const mobileCommunity =
    MOCK_COMMUNITIES.find((c) => c.id === id) || MOCK_COMMUNITIES[1];

  return (
    <MainLayout>
      {/* ── Mobile View (< md): Dedicated Mobile Subscribe Flow ── */}
      <div className='block md:hidden min-h-screen bg-[#141414]'>
        <MobileSubscribeCheckout
          community={mobileCommunity}
          onBack={() => router.push(`/community/${id}`)}
          onPaymentSuccess={() => router.push(`/community/${id}/subscribe/success`)}
          onPaymentFailed={() => router.push(`/community/${id}/subscribe/failed`)}
        />
      </div>

      {/* ── Desktop View (≥ md): Exact Existing Desktop Layout (Untouched) ── */}
      <div className='hidden md:block w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4'>
        <CommunitySubscribeView
          communityId={id}
          communityName="Chef Amaka's kitchen"
          communityAvatar='/images/community/chef-amaka-avatar.jpg'
        />
      </div>
    </MainLayout>
  );
}
