'use client';

import { use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityPostFeed } from '@/components/community/CommunityPostFeed';

interface Props {
  params: Promise<{ id: string }>;
}

function FeedContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const stateParam = searchParams.get('state');

  const isAmaka = id === '2' || id === 'chef-amaka' || id === 'expired' || stateParam === 'expired';
  
  let viewState: 'feed' | 'empty' | 'expired' = 'feed';
  if (stateParam === 'empty' || id === 'empty') {
    viewState = 'empty';
  } else if (stateParam === 'expired' || id === 'expired' || id === 'chef-amaka') {
    viewState = 'expired';
  }

  return (
    <div className='w-full max-w-[1117px] mx-auto px-2 sm:px-4 py-6'>
      <CommunityPostFeed
        communityId={id}
        communityName={isAmaka ? "Chef Amaka's kitchen" : 'Nigeria food and culture'}
        communityLogo='/images/community/community-logo.svg'
        communityAvatar={isAmaka ? '/images/community/chef-amaka-avatar.jpg' : '/images/community/avatar-1.png'}
        viewState={viewState}
      />
    </div>
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
