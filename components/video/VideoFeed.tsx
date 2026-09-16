"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { Post } from "@/types/post";
import { feedStore, type FeedType } from "@/lib/feed-state";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { ActionBar } from "@/components/video/ActionBar";
import { VideoNavigation } from "@/components/video/VideoNavigation";
import Comments from "@/components/video/comments";
import { useToggleLike, useToggleSave } from "@/lib/api/services/posts.hooks";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useShuffledFeed } from "@/hooks/useShuffledFeed";
import { markPostAsSeen } from "@/lib/feed-shuffle";

const FEED_MUTED_SESSION_KEY = "localbuka:feed-muted";

interface VideoFeedProps {
  posts: Post[];
  initialIndex?: number;
  initialPostId?: string | null;
  initialMuted?: boolean;
  hideFollowButton?: boolean;
  showTimestamp?: boolean;
  initialCommentsOpen?: boolean;
  feedType?: FeedType;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function VideoFeed({
  posts,
  initialIndex = 0,
  initialPostId = null,
  initialMuted = true,
  hideFollowButton,
  showTimestamp = true,
  initialCommentsOpen = false,
  feedType = "foryou",
  onLoadMore,
  hasMore,
  isLoadingMore,
}: VideoFeedProps) {
  const shuffledPosts = useShuffledFeed(posts, {
    enabled: feedType === "foryou",
    targetVideoId: initialPostId,
    resetKey: feedType,
    unseenBonus: 5.0,
    cooldownHours: 24,
    diversitySpacing: 3,
    maxSeenEntries: 2000,
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const anchorId = initialPostId ?? posts[initialIndex]?.id ?? null;
    if (!anchorId) return 0;

    const anchorIndex = shuffledPosts.findIndex((post) => post.id === anchorId);
    return anchorIndex >= 0 ? anchorIndex : 0;
  });

  const [isGlobalMuted, setIsGlobalMuted] = useState(() => {
    if (typeof window === "undefined") return initialMuted;

    const savedMuted = window.sessionStorage.getItem(FEED_MUTED_SESSION_KEY);
    if (savedMuted === "true") return true;
    if (savedMuted === "false") return false;

    return initialMuted;
  });

  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toggleLikeMutation = useToggleLike();
  const toggleSaveMutation = useToggleSave();
  const [isCommentsOpen, setIsCommentsOpen] = useState(initialCommentsOpen);
  const isTransitioningRef = useRef(false);
  const wheelLockUntilRef = useRef<number>(0);

  const handleMuteChange = useCallback((muted: boolean) => {
    setIsGlobalMuted(muted);
  }, []);

  useEffect(() => {
    const anchorId = initialPostId ?? posts[initialIndex]?.id ?? null;
    if (!anchorId) return;

    const anchorIndex = shuffledPosts.findIndex((post) => post.id === anchorId);
    if (anchorIndex >= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentIndex(anchorIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPostId, initialIndex, posts]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0 && !isTransitioningRef.current) {
      isTransitioningRef.current = true;
      setCurrentIndex((prev) => prev - 1);
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        isTransitioningRef.current = false;
      }, 600);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (
      currentIndex < shuffledPosts.length - 1 &&
      !isTransitioningRef.current
    ) {
      isTransitioningRef.current = true;
      setCurrentIndex((prev) => prev + 1);
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        isTransitioningRef.current = false;
      }, 600);
    }
  }, [currentIndex, shuffledPosts.length]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        FEED_MUTED_SESSION_KEY,
        String(isGlobalMuted),
      );
    }
  }, [isGlobalMuted]);

  useEffect(() => {
    if (
      shuffledPosts.length - currentIndex <= 3 &&
      hasMore &&
      !isLoadingMore &&
      onLoadMore
    ) {
      onLoadMore();
    }
  }, [currentIndex, shuffledPosts.length, hasMore, isLoadingMore, onLoadMore]);

  useEffect(() => {
    const post = shuffledPosts[currentIndex];
    if (post?.id) {
      feedStore.save(post.id, feedType);
    }
  }, [currentIndex, shuffledPosts, feedType]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isCommentsOpen) return;

      const target = e.target as HTMLElement | null;
      if (target?.closest("textarea, input, select, [data-prevent-swipe]"))
        return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 4) return;

      const now = Date.now();
      if (now < wheelLockUntilRef.current || isTransitioningRef.current) {
        wheelLockUntilRef.current = Math.max(
          wheelLockUntilRef.current,
          now + 350,
        );
        return;
      }

      wheelLockUntilRef.current = now + 800;

      if (delta > 0) {
        handleNext();
      } else if (delta < 0) {
        handlePrevious();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleNext, handlePrevious, isCommentsOpen]);

  const { requireAuth } = useRequireAuth();
  const currentPost =
    shuffledPosts.length > 0
      ? shuffledPosts[Math.min(currentIndex, shuffledPosts.length - 1)]
      : null;

  useEffect(() => {
    if (currentPost?.id) {
      markPostAsSeen(currentPost.id, 2000);
    }
  }, [currentPost?.id]);

  const handleLikeToggle = useCallback(() => {
    requireAuth(() => {
      if (currentPost?.id) {
        toggleLikeMutation.mutate(currentPost.id);
      }
    });
  }, [requireAuth, currentPost, toggleLikeMutation]);

  if (!shuffledPosts || shuffledPosts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full text-zinc-500 text-base">
        <p>No posts available</p>
      </div>
    );
  }

  const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="fixed top-14 bottom-16 left-0 right-0 flex items-center justify-center md:static md:top-auto md:bottom-auto md:left-auto md:right-auto md:w-full md:h-[calc(100vh-3rem)] md:gap-4 md:max-h-[850px] overscroll-none">
      <div className="flex gap-3 items-end h-full w-full md:w-auto relative">
        <AnimatePresence mode="wait">
          {currentPost && (
            <motion.div
              key={currentPost.id}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full w-full flex items-center justify-center md:rounded-2xl overflow-hidden bg-black"
            >
              <VideoPlayer
                post={currentPost}
                isActive={true}
                onSwipeUp={handleNext}
                onSwipeDown={handlePrevious}
                isMuted={isGlobalMuted}
                onMuteChange={handleMuteChange}
                showTimestamp={showTimestamp}
                onLikeToggle={handleLikeToggle}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {currentPost && (
          <div className="absolute right-2 bottom-20 md:static md:right-auto md:bottom-auto z-10">
            <ActionBar
              post={currentPost}
              onCommentClick={() => setIsCommentsOpen(true)}
              onLikeToggle={() => toggleLikeMutation.mutate(currentPost.id)}
              onSaveToggle={() => toggleSaveMutation.mutate(currentPost.id)}
              hideFollowButton={hideFollowButton}
            />
          </div>
        )}

        <Comments
          postId={currentPost?.id || null}
          open={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
        />

        {isLoadingMore && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
            <Loader2 className="w-4 h-4 animate-spin text-[#fbbe15]" />
            <span className="text-xs text-white/80 font-medium">
              Loading more...
            </span>
          </div>
        )}
      </div>

      <div className="hidden md:block">
        <VideoNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentIndex > 0}
          canGoNext={currentIndex < shuffledPosts.length - 1}
        />
      </div>
    </div>
  );
}
