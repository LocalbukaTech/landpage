'use client';

import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityPostFeed } from '@/components/community/CommunityPostFeed';
import { useCommunity } from '@/lib/api/services/community.hooks';

interface CommunityFeedPageProps {
  params: Promise<{ id: string }>;
}

const CREATOR_COMMUNITY_STORAGE_KEY = 'localbuka_creator_community_v1';

export default function CommunityFeedPage({ params }: CommunityFeedPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const { data: community } = useCommunity(id);

  let localName: string | undefined;
  let localAvatar: string | undefined;
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(CREATOR_COMMUNITY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        localName = parsed?.name;
        localAvatar = parsed?.avatar;
      }
    } catch {
      // ignore
    }
  }

  const stateParam = searchParams.get('state');
  const viewState: 'feed' | 'empty' | 'expired' =
    stateParam === 'empty'
      ? 'empty'
      : stateParam === 'expired'
      ? 'expired'
      : 'feed';

  const communityName =
    community?.name ||
    localName ||
    id
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const communityAvatar =
    community?.avatar ||
    community?.coverImage ||
    localAvatar ||
    '/images/community/avatar-1.png';

  return (
    <MainLayout>
      <div className='w-full max-w-[1160px] mx-auto px-4 sm:px-6 md:px-10 py-6 text-white'>
        <CommunityPostFeed
          communityId={id}
          communityName={communityName}
          communityLogo='/images/community/community-logo.svg'
          communityAvatar={communityAvatar}
          viewState={viewState}
        />
      </div>
    </MainLayout>
  );
}
