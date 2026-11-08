'use client';

import { use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityPostFeed } from '@/components/community/CommunityPostFeed';
import { MobileCommunityFeed } from '@/components/community/mobile/MobileCommunityFeed';
import { MOCK_COMMUNITIES } from '@/components/community/mobile/mockData';

interface Props {
  params: Promise<{ id: string }>;
}

function FeedContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stateParam = searchParams.get('state');

  const isAmaka = id === '2' || id === 'chef-amaka' || id === 'expired' || stateParam === 'expired';
  
  let viewState: 'feed' | 'empty' | 'expired' = 'feed';
  if (stateParam === 'empty' || id === 'empty') {
    viewState = 'empty';
  } else if (stateParam === 'expired' || id === 'expired' || id === 'chef-amaka') {
    viewState = 'expired';
  }

  const mobileCommunity =
    MOCK_COMMUNITIES.find((c) => c.id === id) ||
    (isAmaka ? MOCK_COMMUNITIES[1] : MOCK_COMMUNITIES[0]);

  return (
    <>
      {/* ── Mobile View (< md): Native Mobile Community Feed ── */}
      <div className='block md:hidden min-h-screen bg-[#141414]'>
        <MobileCommunityFeed
          community={mobileCommunity}
          onBack={() => router.push(`/community/${id}`)}
        />
      </div>

      {/* ── Desktop View (≥ md): Exact Existing Desktop Layout (Untouched) ── */}
      <div className='hidden md:block w-full max-w-[1117px] mx-auto px-2 sm:px-4 py-6'>
        <CommunityPostFeed
          communityId={id}
          communityName={isAmaka ? "Chef Amaka's kitchen" : 'Nigeria food and culture'}
          communityLogo='/images/community/community-logo.svg'
          communityAvatar={isAmaka ? '/images/community/chef-amaka-avatar.jpg' : '/images/community/avatar-1.png'}
          viewState={viewState}
        />
      </div>
    </>
  );
}

export default function CommunityFeedPage({ params }: Props) {
  const { id } = use(params);

  return (
    <MainLayout>
      <Suspense fallback={<div className='p-8 text-white'>Loading...</div>}>
        <FeedContent id={id} />
      </Suspense>
    </MainLayout>
  );
}
