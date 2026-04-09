'use client';

import {Suspense, useEffect, useMemo, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProfileHeader} from '@/components/profile/ProfileHeader';
import {ProfileTabs} from '@/components/profile/ProfileTabs';
import {useAuth} from '@/context/AuthContext';
import {useMe} from '@/lib/api/services/auth.hooks';
import {useRePosts, useSavedPosts, useUserPosts} from '@/lib/api/services/profile.hooks';
import type {Post} from '@/types/post';
import {Loader2} from 'lucide-react';

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {isAuthenticated, openAuthModal, user: authUser} = useAuth();

  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') || 'videos',
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.replace(`/profile?${params.toString()}`, {scroll: false});
  };

  const {data: meResponse} = useMe();
  const apiUser = ((meResponse as any)?.data?.data ||
    (meResponse as any)?.data ||
    authUser) as any;

  const {data: userPostsResponse, isLoading: isLoadingPosts} = useUserPosts(
    apiUser?.id,
    {page: 1, pageSize: 50},
  );
  const {data: savedPostsResponse, isLoading: isLoadingSaved} = useSavedPosts({
    page: 1,
    pageSize: 50,
  });
  const {data: rePostsResponse, isLoading: isLoadingRepost} = useRePosts({
    page: 1,
    pageSize: 50,
  });

  // Calculate posts count from API response
  const postsCount = useMemo(() => {
    return (
      (userPostsResponse as any)?.data?.total ??
      (userPostsResponse as any)?.total ??
      0
    );
  }, [userPostsResponse]);

  const displayPosts = useMemo(() => {
    if (activeTab === 'tagged') return [];

    if (activeTab === 'repost') {
      return (rePostsResponse?.data?.data || []).map(
          (item: any) => item.post || item,
      );
    }
    if (activeTab === 'saved') {
      return (savedPostsResponse?.data?.data || []).map(
        (item: any) => item.post || item,
      );
    }
    const data = userPostsResponse?.data;
    if (Array.isArray(data)) return data;
    if (data && 'data' in data && Array.isArray(data.data)) return data.data;
    return [];
  }, [activeTab, savedPostsResponse, userPostsResponse, rePostsResponse]) as Post[];

  const isLoadingData = useMemo(() => {
    if (activeTab === 'saved') return isLoadingSaved;
    if (activeTab === 'videos') return isLoadingPosts;
    if (activeTab === 'repost') return isLoadingRepost;
    return false;
  }, [activeTab, isLoadingSaved, isLoadingPosts, isLoadingRepost]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/feeds');
      openAuthModal();
    }
  }, [isAuthenticated, router, openAuthModal]);

  // Don't render content if not authenticated
  if (!isAuthenticated) {
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
        <ProfileHeader userData={apiUser} postsCount={postsCount} />
        <ProfileTabs
          posts={displayPosts}
          initialTab={activeTab}
          onTabChange={handleTabChange}
          isLoading={isLoadingData}
          isEditable={true}
        />
      </div>
    </MainLayout>
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileContent />
    </Suspense>
  );
}
