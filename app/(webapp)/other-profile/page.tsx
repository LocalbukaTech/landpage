'use client';

import {Suspense, useState, useMemo} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProfileHeader} from '@/components/profile/ProfileHeader';
import {ProfileTabs} from '@/components/profile/ProfileTabs';
import {useUserProfile, useUserPosts} from '@/lib/api/services/profile.hooks';
import {Loader2} from 'lucide-react';

function OtherProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('id');
  const tabParam = searchParams.get('tab') || 'videos';
  const [activeTab, setActiveTab] = useState(tabParam);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (!userId) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.replace(`/other-profile?${params.toString()}`, {scroll: false});
  };

  const {data: profileResponse, isLoading: isLoadingProfile} = useUserProfile(
    userId || '',
  );
  const {data: postsResponse, isLoading: isLoadingPosts} = useUserPosts(
    userId || '',
    {page: 1, pageSize: 50},
  );

  const userData =
    (profileResponse as any)?.data?.data || (profileResponse as any)?.data;
  const posts = ((postsResponse as any)?.data?.data ||
    (postsResponse as any)?.data ||
    []) as any[];

  // Calculate posts count from API response
  const postsCount = useMemo(() => {
    return (
      (postsResponse as any)?.data?.total ?? (postsResponse as any)?.total ?? 0
    );
  }, [postsResponse]);

  if (isLoadingProfile) {
    return (
      <MainLayout>
        <div className='w-full h-[80vh] flex items-center justify-center'>
          <Loader2 className='w-8 h-8 animate-spin text-[#fbbe15]' />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='w-full max-w-4xl mx-auto px-4 py-6 overflow-y-auto h-[calc(100vh-3.5rem)] md:h-auto'>
        <ProfileHeader userData={userData} postsCount={postsCount} />
        <ProfileTabs
          posts={posts}
          initialTab={activeTab}
          onTabChange={handleTabChange}
          isLoading={isLoadingPosts}
        />
      </div>
    </MainLayout>
  );
}

export default function OtherProfilePage() {
  return (
    <Suspense>
      <OtherProfileContent />
    </Suspense>
  );
}
