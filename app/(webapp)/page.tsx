"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { VideoFeed } from "@/components/video/VideoFeed";
import {
  useInfinitePosts,
  useInfinitePersonalisedFeed,
} from "@/lib/api/services/posts.hooks";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/lib/api/types";
import { feedStore, type FeedType } from "@/lib/feed-state";
import { PasswordPromptModal } from "@/components/modals";
import { useAuth } from "@/context/AuthContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function HomeContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("video");
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useRequireAuth();

  // Disable pull-to-refresh / overscroll bounce on mobile browsers while on the feeds page
  useEffect(() => {
    const originalHtmlOverscroll =
      document.documentElement.style.overscrollBehavior;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;

    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.documentElement.style.overscrollBehavior =
        originalHtmlOverscroll;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
    };
  }, []);

  // Consume the reset flag once on mount (useState initialiser runs exactly
  // once even under React StrictMode).  If the user clicked Home explicitly
  // the flag is true → start fresh from the top.
  const [wasReset] = useState(() => feedStore.consumeReset());

  // Restore the last active feed tab unless we're resetting.
  const [feedType, setFeedType] = useState<FeedType>(
    wasReset ? "foryou" : feedStore.getFeedType(),
  );

  const typeParam = searchParams.get("type");
  useEffect(() => {
    if (typeParam === "following") {
      if (!isAuthenticated) {
        const timer = setTimeout(() => {
          setFeedType("foryou");
          requireAuth(() => {
            setFeedType("following");
          });
        }, 0);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setFeedType("following");
        }, 0);
        return () => clearTimeout(timer);
      }
    } else if (typeParam === "foryou") {
      const timer = setTimeout(() => {
        setFeedType("foryou");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [typeParam, isAuthenticated, requireAuth]);

  // Handle runtime logout/auth change state sync
  useEffect(() => {
    if (feedType === "following" && !isAuthenticated) {
      const timer = setTimeout(() => {
        setFeedType("foryou");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [feedType, isAuthenticated]);

  // The post ID to restore to (null if first visit or reset).
  const savedPostId = wasReset ? null : feedStore.getPostId();

  // Force refetch when user switches back to the app (tab focus)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // User switched back to this tab, invalidate and refetch all post data
        queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      }
    };

    const handleFocus = () => {
      // User switched back to window
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
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
  } = useInfinitePersonalisedFeed(
    { pageSize: 20 },
    { enabled: isAuthenticated },
  );

  const {
    data: chronologicalData,
    isLoading: isLoadingChronological,
    isError: isErrorChronological,
    fetchNextPage: fetchNextChronologicalPage,
    hasNextPage: hasNextChronologicalPage,
    isFetchingNextPage: isFetchingNextChronologicalPage,
  } = useInfinitePosts({ pageSize: 20 });

  // Mapping: Following -> personalisedFeed (/posts/feed), For You -> posts (/posts)
  const activeData =
    feedType === "following" ? personalisedData : chronologicalData;
  const isLoading =
    feedType === "following" ? isLoadingPersonalised : isLoadingChronological;
  const isError =
    feedType === "following" ? isErrorPersonalised : isErrorChronological;

  const fetchNextPage =
    feedType === "following"
      ? fetchNextPersonalisedPage
      : fetchNextChronologicalPage;
  const hasNextPage =
    feedType === "following"
      ? hasNextPersonalisedPage
      : hasNextChronologicalPage;
  const isFetchingNextPage =
    feedType === "following"
      ? isFetchingNextPersonalisedPage
      : isFetchingNextChronologicalPage;

  const posts = useMemo(() => {
    return activeData?.pages.flatMap((page) => page.data) || [];
  }, [activeData]);

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

  const initialPostId = useMemo(() => {
    if (videoId && posts.length > 0) {
      return posts.find((post) => post.id === videoId)?.id ?? null;
    }
    if (savedPostId && posts.length > 0) {
      return posts.find((post) => post.id === savedPostId)?.id ?? null;
    }
    return posts[0]?.id ?? null;
  }, [savedPostId, posts, videoId]);

  return (
    <MainLayout>
      <div className="relative w-full h-full overscroll-none">
        <div className="hidden md:flex absolute top-6 left-0 right-0 z-50 justify-center items-center pointer-events-none">
          <div className="flex items-center gap-4 bg-black/35 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg pointer-events-auto">
            <button
              onClick={() => {
                requireAuth(() => {
                  setFeedType("following");
                });
              }}
              className={cn(
                "text-sm font-bold transition-all hover:scale-105 pointer-events-auto cursor-pointer bg-transparent border-none drop-shadow-xs outline-none",
                feedType === "following"
                  ? "text-white scale-105"
                  : "text-white/60",
              )}
            >
              Following
            </button>
            <div className="w-px h-3.5 bg-white/20" />
            <button
              onClick={() => setFeedType("foryou")}
              className={cn(
                "text-sm font-bold transition-all hover:scale-105 pointer-events-auto cursor-pointer bg-transparent border-none drop-shadow-xs outline-none",
                feedType === "foryou"
                  ? "text-white scale-105"
                  : "text-white/60",
              )}
            >
              For You
            </button>
          </div>
        </div>

        {/* State rendering */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full w-full text-white/70 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFC727]" />
            <p className="font-medium text-sm drop-shadow-md">
              Loading feed...
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-full w-full text-white/70 space-y-4">
            <p className="font-medium text-sm drop-shadow-md">
              Failed to load feed. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#FFC727] text-black font-semibold rounded-full hover:bg-yellow-500 transition-colors pointer-events-auto"
            >
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full w-full text-white/70">
            <p className="font-medium text-sm drop-shadow-md">No posts yet.</p>
          </div>
        ) : (
          <VideoFeed
            key={feedType}
            posts={posts}
            initialIndex={initialIndex}
            initialPostId={initialPostId}
            initialMuted={true}
            feedType={feedType}
            hideFollowButton={feedType === "following"}
            showTimestamp={true}
            onLoadMore={fetchNextPage}
            hasMore={!!hasNextPage}
            isLoadingMore={isFetchingNextPage}
          />
        )}
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
          <div className="flex flex-col items-center justify-center h-full w-full text-white/70">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFC727]" />
          </div>
        </MainLayout>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
