'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityMembershipsList } from '@/components/community/CommunityMembershipsList';
import { MobileMembershipList } from '@/components/community/mobile/MobileMembershipList';

export default function CommunityMembershipPage() {
  return (
    <MainLayout>
      {/* ── MOBILE VIEW (< md) ── */}
      <div className='block md:hidden'>
        <MobileMembershipList />
      </div>

      {/* ── DESKTOP VIEW (≥ md): Original desktop layout ── */}
      <div className='hidden md:block w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4'>
        <CommunityMembershipsList />
      </div>
    </MainLayout>
  );
}
