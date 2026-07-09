'use client';

import {Suspense, useState, useMemo} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import {MainLayout} from '@/components/layout/MainLayout';
import {ProfileHeader} from '@/components/profile/ProfileHeader';
import {ProfileTabs} from '@/components/profile/ProfileTabs';
import {
  useUserProfile,
  useUserPosts,
  useUserStats,
  useUserReposts,
} from '@/lib/api/services/profile.hooks';
import {Loader2} from 'lucide-react';
import type {Post} from '@/types/post';
import {useAuth} from '@/context/AuthContext';
import {useDynamicBack} from '@/hooks/useDynamicBack';

function OtherProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('id');
  const {isAuthenticated} = useAuth();
  const goBack = useDynamicBack();
  const tabParam = searchParams.get('tab') || 'videos';
  const normalizedTab = tabParam === 'repost' ? 'repost' : 'videos';
  const [activeTab, setActiveTab] = useState(normalizedTab);

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
  const {data: statsResponse} = useUserStats(userId || '');
  const {data: postsResponse, isLoading: isLoadingPosts} = useUserPosts(
    userId || '',
    {page: 1, pageSize: 50},
  );
  const {data: repostsResponse, isLoading: isLoadingReposts} = useUserReposts(
    userId || '',
    {page: 1, pageSize: 50},
  );

  const profileData =
    (profileResponse as any)?.data?.data || (profileResponse as any)?.data;
  const statsData =
    (statsResponse as any)?.data?.data || (statsResponse as any)?.data;
  const likesGivenCount = statsData?.likesGiven ?? 0;

  // Merge stats into userData for the header to pick up counts
  const userData = useMemo(() => {
    if (!profileData) return profileData;
    return {
      ...profileData,
      followersCount: statsData?.followersCount ?? profileData?.followersCount,
      followingCount: statsData?.followingCount ?? profileData?.followingCount,
    };
  }, [profileData, statsData]);

  const postsCount = useMemo(() => {
    return (
      statsData?.postsCount ??
      (postsResponse as any)?.data?.total ??
      (postsResponse as any)?.total ??
      0
    );
  }, [statsData, postsResponse]);

  const displayPosts = useMemo((): Post[] => {
    if (activeTab === 'repost') {
      return (
        (repostsResponse as any)?.data?.data ||
        (repostsResponse as any)?.data ||
        []
      ).map((item: any) => item.post || item);
    }
    const data = (postsResponse as any)?.data;
    if (Array.isArray(data)) return data;
    if (data && 'data' in data && Array.isArray(data.data)) return data.data;
    return [];
  }, [activeTab, postsResponse, repostsResponse]);

  const isLoadingData = useMemo(() => {
    if (activeTab === 'repost') return isLoadingReposts;
    return isLoadingPosts;
  }, [activeTab, isLoadingPosts, isLoadingReposts]);

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className='flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 text-center'>
          <div className='max-w-md w-full bg-[#1e1e1e] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md'>
            {/* Top decorative glow */}
            <div className='absolute -top-24 -left-24 w-48 h-48 bg-[#fbbe15]/10 rounded-full blur-3xl pointer-events-none' />
            <div className='absolute -bottom-24 -right-24 w-48 h-48 bg-[#fbbe15]/5 rounded-full blur-3xl pointer-events-none' />

            {/* Lock/Shield Icon */}
            <div className='mx-auto w-16 h-16 rounded-full bg-[#fbbe15]/10 flex items-center justify-center mb-6 border border-[#fbbe15]/20 animate-pulse'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='28'
                height='28'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#fbbe15'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
                <path d='M7 11V7a5 5 0 0 1 10 0v4' />
              </svg>
            </div>

            <h2 className='text-white text-xl md:text-2xl font-bold tracking-tight mb-3'>
              Authentication Required
            </h2>
            <p className='text-zinc-400 text-sm md:text-base leading-relaxed mb-8'>
              This page requires Authentication, please login and access it again.
            </p>

            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <button
                onClick={() => router.push('/signin')}
                className='px-6 py-3 bg-[#fbbe15] text-[#1a1a1a] font-bold text-sm rounded-xl hover:bg-[#e5ac10] active:scale-[0.98] transition-all cursor-pointer border-none shadow-md shadow-[#fbbe15]/10'>
                Login Now
              </button>
              <button
                onClick={() => router.push('/feeds')}
                className='px-6 py-3 bg-white/5 text-white border border-white/10 font-medium text-sm rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer'>
                Go to Feeds
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLoadingProfile) {
    return (
      <MainLayout>
        <div className='w-full h-[80vh] flex items-center justify-center'>
          <Loader2 className='w-8 h-8 animate-spin text-[#fbbe15]' />
        </div>
      </MainLayout>
    );
  }

  if (!userId) {
    return (
      <MainLayout>
        <div className='w-full h-[80vh] flex items-center justify-center'>
          <p className='text-zinc-500 text-sm'>No user specified.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='w-full max-w-4xl mx-auto px-4 py-6 overflow-y-auto h-[calc(100vh-3.5rem)] md:h-auto'>
        <button
          onClick={() => goBack('/feeds')}
          className='mb-4 flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors'
          aria-label='Go back'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <path d='M19 12H5' />
            <path d='m12 19-7-7 7-7' />
          </svg>
          Back
        </button>
        <ProfileHeader
          userData={userData}
          postsCount={postsCount}
          likesGivenCount={likesGivenCount}
        />
        <ProfileTabs
          posts={displayPosts}
          initialTab={activeTab}
          onTabChange={handleTabChange}
          isLoading={isLoadingData}
          isOtherProfile
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
