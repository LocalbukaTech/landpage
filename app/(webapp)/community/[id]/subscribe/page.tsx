'use client';

import { use } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunitySubscribeView } from '@/components/community/CommunitySubscribeView';

interface Props {
  params: Promise<{ id: string }>;
}

export default function CommunitySubscribePage({ params }: Props) {
  const { id } = use(params);

  return (
    <MainLayout>
      <div className='w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4'>
        <CommunitySubscribeView
          communityId={id}
          communityName="Chef Amaka's kitchen"
          communityAvatar='/images/community/chef-amaka-avatar.jpg'
        />
      </div>
    </MainLayout>
  );
}
