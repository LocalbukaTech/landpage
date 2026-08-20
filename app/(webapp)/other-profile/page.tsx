'use client';

import {Suspense, useState, useMemo, useEffect} from 'react';
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
import {Loader2, Lock} from 'lucide-react';
import type {Post} from '@/types/post';
import {useDynamicBack} from '@/hooks/useDynamicBack';
import {useAuth} from '@/context/AuthContext';
import {useToast} from '@/hooks/use-toast';

function OtherProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('id');
  const goBack = useDynamicBack();
  const tabParam = searchParams.get('tab') || 'videos';
  const normalizedTab = tabParam === 'repost' ? 'repost' : 'videos';
  const [activeTab, setActiveTab] = useState(normalizedTab);

  const {openAuthModal, isAuthenticated} = useAuth();
  const {toast} = useToast();

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (!userId) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.replace(`/other-profile?${params.toString()}`, {scroll: false});
  };

  const {
    data: profileResponse,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useUserProfile(userId || '');
  const {data: statsResponse, error: statsError} = useUserStats(userId || '');
  const {
    data: postsResponse,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useUserPosts(userId || '', {page: 1, pageSize: 50});
  const {
    data: repostsResponse,
    isLoading: isLoadingReposts,
    error: repostsError,
  } = useUserReposts(userId || '', {page: 1, pageSize: 50});

  // Detect 403 / 401 unauthenticated errors on profile or stats endpoints
  const isAuthError = useMemo(() => {
    const errors = [profileError, statsError, postsError, repostsError];
    return errors.some((err: any) => {
      const status = err?.response?.status || err?.status;
      const msg = (err?.response?.data?.message || err?.message || '').toLowerCase();
      return (
        status === 403 ||
        status === 401 ||
        msg.includes('authenticated') ||
        msg.includes('unauthorized') ||
        msg.includes('forbidden')
      );
    });
  }, [profileError, statsError, postsError, repostsError]);

  // Open AuthModal and show toast when a 403 / 401 error occurs for unauthenticated user
  useEffect(() => {
    if (isAuthError && !isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'You need to be authenticated before viewing this profile.',
        variant: 'destructive',
      });
      openAuthModal();
    }
  }, [isAuthError, isAuthenticated, openAuthModal, toast]);

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

  // Fallback UI when 403 / 401 error is received
  if (isAuthError && !isAuthenticated) {
    return (
      <MainLayout>
        <div className='w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center text-center min-h-[60vh]'>
          <div className='w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4 text-[#fbbe15]'>
            <Lock className='w-8 h-8' />
          </div>
          <h2 className='text-xl font-bold text-white mb-2'>
            Authentication Required
          </h2>
          <p className='text-zinc-400 text-sm max-w-md mb-6'>
            You need to be authenticated before viewing this profile. Please sign in or create an account to continue.
          </p>
          <button
            onClick={() => openAuthModal()}
            className='px-6 py-2.5 bg-[#fbbe15] text-black font-semibold rounded-full hover:bg-yellow-400 transition-colors shadow-md'>
            Sign In / Sign Up
          </button>
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
          onClick={() => goBack('/')}
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
