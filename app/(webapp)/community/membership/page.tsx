'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityMembershipsList } from '@/components/community/CommunityMembershipsList';

export default function CommunityMembershipPage() {
  return (
    <MainLayout>
      <div className='w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4'>
        <CommunityMembershipsList />
      </div>
    </MainLayout>
  );
}
