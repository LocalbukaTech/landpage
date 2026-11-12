'use client';

import {Suspense, useState, useMemo, useEffect} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useQueryClient} from '@tanstack/react-query';
import {MainLayout} from '@/components/layout/MainLayout';
import {VideoFeed} from '@/components/video/VideoFeed';
import {
  useInfinitePosts,
  useInfinitePersonalisedFeed,
} from '@/lib/api/services/posts.hooks';
import {Loader2} from 'lucide-react';
import {cn} from '@/lib/utils';
import {queryKeys} from '@/lib/api/types';
import {feedStore, type FeedType} from '@/lib/feed-state';
import {PasswordPromptModal} from '@/components/modals';
import {useAuth} from '@/context/AuthContext';
import {useRequireAuth} from '@/hooks/useRequireAuth';
import {useShuffledFeed} from '@/hooks/useShuffledFeed';
import {trackEvent} from '@/lib/analytics';

function HomeContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('video');
  const queryClient = useQueryClient();
  const {isAuthenticated} = useAuth();
  const {requireAuth} = useRequireAuth();

  // Disable pull-to-refresh / overscroll bounce on mobile browsers while on the feeds page
  useEffect(() => {
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;

    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
    };
  }, []);

  // Consume the reset flag once on mount (useState initialiser runs exactly
  // once even under React StrictMode).  If the user clicked Home explicitly
  // the flag is true → start fresh from the top.
  const [wasReset] = useState(() => feedStore.consumeReset());

  // Restore the last active feed tab unless we're resetting.
  const [feedType, setFeedType] = useState<FeedType>(
    wasReset ? 'foryou' : feedStore.getFeedType(),
  );

  const typeParam = searchParams.get('type');
  useEffect(() => {
    if (typeParam === 'following') {
      if (!isAuthenticated) {
        const timer = setTimeout(() => {
          setFeedType('foryou');
          requireAuth(() => {
            setFeedType('following');
          });
        }, 0);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setFeedType('following');
        }, 0);
        return () => clearTimeout(timer);
      }
    } else if (typeParam === 'foryou') {
      const timer = setTimeout(() => {
        setFeedType('foryou');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [typeParam, isAuthenticated, requireAuth]);

  // Handle runtime logout/auth change state sync
  useEffect(() => {
    if (feedType === 'following' && !isAuthenticated) {
      const timer = setTimeout(() => {
        setFeedType('foryou');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [feedType, isAuthenticated]);

  // Track home view in GA4 on load and when tab changes
  useEffect(() => {
    trackEvent('home_view', {
      feed_type: feedType,
      page_name: 'home',
    });
  }, [feedType]);

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

  // Fetch both feeds using infinite query
  const {
    data: personalisedData,
    isLoading: isLoadingPersonalised,
    isError: isErrorPersonalised,
    fetchNextPage: fetchNextPersonalisedPage,
    hasNextPage: hasNextPersonalisedPage,
    isFetchingNextPage: isFetchingNextPersonalisedPage,
  } = useInfinitePersonalisedFeed({pageSize: 20}, {enabled: isAuthenticated});

  const {
    data: chronologicalData,
    isLoading: isLoadingChronological,
    isError: isErrorChronological,
    fetchNextPage: fetchNextChronologicalPage,
    hasNextPage: hasNextChronologicalPage,
    isFetchingNextPage: isFetchingNextChronologicalPage,
  } = useInfinitePosts({pageSize: 20});

  // Mapping: Following -> personalisedFeed (/posts/feed), For You -> posts (/posts)
  const activeData =
    feedType === 'following' ? personalisedData : chronologicalData;
  const isLoading =
    feedType === 'following' ? isLoadingPersonalised : isLoadingChronological;
  const isError =
    feedType === 'following' ? isErrorPersonalised : isErrorChronological;

  const fetchNextPage =
    feedType === 'following' ? fetchNextPersonalisedPage : fetchNextChronologicalPage;
  const hasNextPage =
    feedType === 'following' ? hasNextPersonalisedPage : hasNextChronologicalPage;
  const isFetchingNextPage =
    feedType === 'following' ? isFetchingNextPersonalisedPage : isFetchingNextChronologicalPage;

  const rawPosts = useMemo(() => {
    return activeData?.pages.flatMap((page) => page.data) || [];
  }, [activeData]);

  // Apply Weighted Reservoir Shuffle on 'foryou' feed while keeping 'following' chronological
  const posts = useShuffledFeed(rawPosts, {
    enabled: feedType === 'foryou',
    targetVideoId: videoId,
    resetKey: `${feedType}-${wasReset}`,
  });

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
      <div className='relative w-full h-full overscroll-none'>
        <div className='hidden md:flex absolute top-6 left-0 right-0 z-50 justify-center items-center pointer-events-none'>
          <div className='flex items-center gap-4 bg-black/35 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg pointer-events-auto'>
            <button
              onClick={() => {
                requireAuth(() => {
                  setFeedType('following');
                });
              }}
              className={cn(
                'text-sm font-bold transition-all hover:scale-105 pointer-events-auto cursor-pointer bg-transparent border-none drop-shadow-xs outline-none',
                feedType === 'following'
                  ? 'text-white scale-105'
                  : 'text-white/60',
              )}>
              Following
            </button>
            <div className='w-px h-3.5 bg-white/20' />
            <button
              onClick={() => setFeedType('foryou')}
              className={cn(
                'text-sm font-bold transition-all hover:scale-105 pointer-events-auto cursor-pointer bg-transparent border-none drop-shadow-xs outline-none',
                feedType === 'foryou' ? 'text-white scale-105' : 'text-white/60',
              )}>
              For You
            </button>
          </div>
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
            key={feedType}
            posts={posts}
            initialIndex={initialIndex}
            initialMuted={true}
            feedType={feedType}
            hideFollowButton={feedType === 'following'}
            showTimestamp={true}
            onLoadMore={fetchNextPage}
            hasMore={!!hasNextPage}
            isLoadingMore={isFetchingNextPage}
          />
        )}
        {/* Crawlable Editorial & Culinary Guide Section for Search Engines & AdSense Crawlers */}
        <section
          aria-label='LocalBuka Culinary Discovery & Restaurant Guide'
          className='sr-only'
        >
          <h1>LocalBuka — Discover the Best Restaurants, Authentic Nigerian Cuisine, and Food Communities</h1>
          <p>
            Welcome to LocalBuka, the premier restaurant discovery and culinary community platform across Nigeria and Africa. Whether you are searching for authentic local bukas in Lagos, fine dining restaurants in Abuja, street food gems in Port Harcourt, or vibrant chef-led cooking communities, LocalBuka connects food lovers with verified dining experiences, honest customer reviews, and interactive culinary video feeds.
          </p>
          <h2>How LocalBuka Helps You Find Trusted Restaurants Near You</h2>
          <p>
            Finding a reliable place to eat in a busy city should be effortless and transparent. LocalBuka curates thousands of verified restaurants, neighborhood bukas, bakeries, and contemporary kitchens with real-time menus, hygiene ratings, price brackets, and video reviews recorded by real diners. Use our interactive Buka Explorer to filter restaurants by city, neighborhood, cuisine type, dietary preference, and customer rating.
          </p>
          <h2>Explore Culinary Articles, Recipes &amp; Dining Guides</h2>
          <article>
            <h3>The Ultimate Guide to Authentic Nigerian Jollof Rice &amp; Local Bukas in Lagos</h3>
            <p>
              Smoky party Jollof rice, slow-cookedayamase (designer stew), amala with ewedu and gbegiri, and freshly grilled suya remain the cornerstone of West African culinary heritage. On LocalBuka, top chefs and neighborhood bukas share traditional preparation techniques, spice blends, and verified locations where diners can enjoy freshly prepared meals every day.
            </p>
          </article>
          <article>
            <h3>How Food Creators &amp; Chefs Build Thriving Culinary Communities</h3>
            <p>
              Through LocalBuka Communities, professional chefs, nutritionists, and culinary creators host dedicated spaces for recipe sharing, live cook-along sessions, restaurant tasting tours, and regional food culture discussions. Members can join free public food communities or subscribe to specialized creator kitchens for exclusive culinary masterclasses.
            </p>
          </article>
          <article>
            <h3>Verified Restaurant Reviews, Food Safety &amp; Honest Dining Ratings</h3>
            <p>
              Every restaurant review on LocalBuka is backed by community moderation and authentic diner feedback. Diners evaluate taste, portion value, service speed, ambiance, and cleanliness so families, travelers, and everyday food enthusiasts can make informed dining decisions.
            </p>
          </article>
          <nav aria-label='Essential Platform Links'>
            <Link href='/about'>About LocalBuka</Link>
            <Link href='/contact'>Contact Us &amp; Support</Link>
            <Link href='/blog'>Culinary Blog &amp; Articles</Link>
            <Link href='/buka'>Explore Restaurants &amp; Bukas</Link>
            <Link href='/community'>Food Communities</Link>
            <Link href='/faqs'>Frequently Asked Questions</Link>
            <Link href='/privacy'>Privacy Policy &amp; Terms of Service</Link>
          </nav>
        </section>
        <PasswordPromptModal />
      </div>
    </MainLayout>
  );
}

export default function HomePage() {
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
