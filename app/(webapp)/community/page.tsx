'use client';

import { useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { CreatorCommunityCarousel } from '@/components/community/CreatorCommunityCarousel';
import { CreatorCommunityForm } from '@/components/community/CreatorCommunityForm';
import { CreatorPaymentPortal } from '@/components/community/CreatorPaymentPortal';
import { CommunityExploreList } from '@/components/community/CommunityExploreList';
import { CommunityMembershipsList } from '@/components/community/CommunityMembershipsList';
import { CreatorDashboard } from '@/components/community/CreatorDashboard';
import { CreatorCommunityApprovedCard } from '@/components/community/CreatorCommunityApprovedCard';
import { CreatorCommunityRejectedCard } from '@/components/community/CreatorCommunityRejectedCard';
import { CreatorCommunityChangesRequestedCard } from '@/components/community/CreatorCommunityChangesRequestedCard';
import { CommunityMobileShowcase } from '@/components/community/mobile/CommunityMobileShowcase';
import { DashboardTab } from '@/components/community/types';
import { useToast } from '@/hooks/use-toast';

type CommunityTab = 'recommended' | 'trending' | 'free' | 'paid' | 'creator' | 'memberships' | 'mobile';

function CommunityContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const stateParam = searchParams.get('state');
  const emptyParam = searchParams.get('empty');
  const tabParam = searchParams.get('tab')?.toLowerCase();
  const viewParam = searchParams.get('view')?.toLowerCase();
  const stepParam = searchParams.get('step')?.toLowerCase();
  const statusParam = searchParams.get('status')?.toLowerCase();

  const isForceEmpty = stateParam === 'empty' || emptyParam === 'true';

  // Map subtab query param to CreatorDashboard tab
  const initialDashboardTab = useMemo<DashboardTab>(() => {
    if (tabParam === 'content' || tabParam === 'content and feed management') return 'Content and feed management';
    if (tabParam === 'members') return 'Members';
    if (tabParam === 'monetization') return 'Monetization';
    if (tabParam === 'overview') return 'Overview';
    if (tabParam === 'settings') return 'Settings';
    return 'Members';
  }, [tabParam]);
  );
}

export default function CommunityPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className='p-8 text-white'>Loading Community...</div>}>
        <CommunityContent />
      </Suspense>
    </MainLayout>
  );
}
