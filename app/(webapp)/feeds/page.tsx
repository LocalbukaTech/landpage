'use client';

import {Suspense, useState, useMemo, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {useQueryClient} from '@tanstack/react-query';
import {MainLayout} from '@/components/layout/MainLayout';
import {VideoFeed} from '@/components/video/VideoFeed';
import {usePosts, usePersonalisedFeed} from '@/lib/api/services/posts.hooks';
import {Loader2} from 'lucide-react';
import {cn} from '@/lib/utils';
import {queryKeys} from '@/lib/api/types';
import {feedStore, type FeedType} from '@/lib/feed-state';

function HomeContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('video');
  const queryClient = useQueryClient();

  // Consume the reset flag once on mount (useState initialiser runs exactly
  // once even under React StrictMode).  If the user clicked Home explicitly
  // the flag is true → start fresh from the top.
  const [wasReset] = useState(() => feedStore.consumeReset());

  // Restore the last active feed tab unless we're resetting.
  const [feedType, setFeedType] = useState<FeedType>(
    wasReset ? 'foryou' : feedStore.getFeedType(),
  );

  // The post ID to restore to (null if first visit or reset).
  const savedPostId = wasReset ? null : feedStore.getPostId();

  // Force refetch when user switches back to the app (tab focus)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User switched back to this tab, invalidate and refetch all post data
        queryClient.invalidateQueries({queryKey: queryKeys.posts.all});
      }
    };

    const handleFocus = () => {
      // User switched back to window
      queryClient.invalidateQueries({queryKey: queryKeys.posts.all});
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [queryClient]);

  // Fetch both feeds (React Query will cache them and we can disable one if needed, but for now we'll just fetch based on enabled state or let them fetch concurrently)
  // To avoid unnecessary requests, we only fetch the active feed
  const {
    data: personalisedData,
    isLoading: isLoadingPersonalised,
    isError: isErrorPersonalised,
  } = usePersonalisedFeed({page: 1, pageSize: 20});

  const {
    data: chronologicalData,
    isLoading: isLoadingChronological,
    isError: isErrorChronological,
  } = usePosts({page: 1, pageSize: 20});

  // Mapping: Following -> personalisedFeed (/posts/feed), For You -> posts (/posts)
  const activeData =
    feedType === 'following' ? personalisedData : chronologicalData;
  const isLoading =
    feedType === 'following' ? isLoadingPersonalised : isLoadingChronological;
  const isError =
    feedType === 'following' ? isErrorPersonalised : isErrorChronological;

  const posts = useMemo(() => activeData?.data || [], [activeData]);

  // Find the index to start the feed at.
  // Priority: 1) URL ?video=<id>  2) saved post from store  3) 0
  const initialIndex = useMemo(() => {
    if (videoId && posts.length > 0) {
      const index = posts.findIndex((p) => p.id === videoId);
      if (index >= 0) return index;
    }
    if (savedPostId && posts.length > 0) {
      const index = posts.findIndex((p) => p.id === savedPostId);
      if (index >= 0) return index;
    }
    return 0;
  }, [videoId, savedPostId, posts]);

  return (
    <MainLayout>
      <div className='relative w-full h-full'>
        {/* Following | For You Toggle Overlay */}
        <div className='absolute top-6 left-0 right-0 z-50 flex justify-center items-center gap-4 pointer-events-none'>
          <button
            onClick={() => setFeedType('following')}
            className={cn(
              'text-lg font-bold transition-all hover:scale-105 pointer-events-auto cursor-pointer bg-transparent border-none drop-shadow-md',
              feedType === 'following'
                ? 'text-white scale-110'
                : 'text-white/60',
            )}>
            Following
          </button>
          <div className='w-px h-4 bg-white/30' />
          <button
            onClick={() => setFeedType('foryou')}
            className={cn(
              'text-lg font-bold transition-all hover:scale-105 pointer-events-auto cursor-pointer bg-transparent border-none drop-shadow-md',
              feedType === 'foryou' ? 'text-white scale-110' : 'text-white/60',
            )}>
            For You
          </button>
        </div>

        {/* State rendering */}
        {isLoading ? (
          <div className='flex flex-col items-center justify-center h-full w-full text-white/70 space-y-4'>
            <Loader2 className='w-8 h-8 animate-spin text-[#FFC727]' />
            <p className='font-medium text-sm drop-shadow-md'>
              Loading feed...
            </p>
          </div>
        ) : isError ? (
          <div className='flex flex-col items-center justify-center h-full w-full text-white/70 space-y-4'>
            <p className='font-medium text-sm drop-shadow-md'>
              Failed to load feed. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-[#FFC727] text-black font-semibold rounded-full hover:bg-yellow-500 transition-colors pointer-events-auto'>
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full w-full text-white/70'>
            <p className='font-medium text-sm drop-shadow-md'>No posts yet.</p>
          </div>
        ) : (
          <VideoFeed
            posts={posts}
            initialIndex={initialIndex}
            initialMuted={!videoId && !savedPostId}
            feedType={feedType}
            hideFollowButton={feedType === 'following'}
            showTimestamp={feedType === 'following'}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <div className='flex flex-col items-center justify-center h-full w-full text-white/70'>
            <Loader2 className='w-8 h-8 animate-spin text-[#FFC727]' />
          </div>
        </MainLayout>
      }>
      <HomeContent />
    </Suspense>
  );
}
