"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
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

const FEED_MUTED_SESSION_KEY = "localbuka:feed-muted";
const FEED_SEEN_POSTS_KEY = "localbuka:seen-feed-posts";

function loadSeenPostIds(): Set<string> {
  if (typeof window === "undefined") return new Set();

  try {
    const value = window.sessionStorage.getItem(FEED_SEEN_POSTS_KEY);
    if (!value) return new Set();

    const parsed = JSON.parse(value);
    return new Set(Array.isArray(parsed) ? parsed.filter(Boolean) : []);
  } catch {
    return new Set();
  }
}

function persistSeenPostIds(ids: Set<string>) {
  if (typeof window === "undefined") return;

  const next = Array.from(ids).slice(-500);
  window.sessionStorage.setItem(FEED_SEEN_POSTS_KEY, JSON.stringify(next));
}

function getPostAgeBoost(post: Post, now = Date.now()) {
  const createdAt = new Date(post.createdAt).getTime();

  if (Number.isNaN(createdAt)) return 0;

  const ageHours = Math.max(0, (now - createdAt) / (1000 * 60 * 60));
  const freshnessWindowHours = 72;

  return Math.max(0, 1 - ageHours / freshnessWindowHours);
}

function rankForYouFeed(posts: Post[], seenIds: Set<string>) {
  if (posts.length === 0) return posts;

  const now = Date.now();

  const scored = posts
    .map((post, originalIndex) => {
      const creatorId = post.user?.id ?? post.user?.username ?? "unknown-user";
      const restaurantKey =
        post.restaurantId ??
        post.restaurant?.id ??
        post.restaurant?.name ??
        "unknown-restaurant";
      const unseenBoost = seenIds.has(post.id) ? 0 : 1200;
      const freshnessBoost = getPostAgeBoost(post, now) * 900;
      const engagementBoost =
        (post.likesCount ?? post.likeCount ?? 0) * 0.8 +
        (post.commentsCount ?? post.commentCount ?? 0) * 1.3 +
        (post.sharesCount ?? post.shareCount ?? 0) * 2.5;

      return {
        post,
        creatorId,
        restaurantKey,
        baseScore: unseenBoost + freshnessBoost + engagementBoost,
        originalIndex,
      };
    })
    .sort(
      (a, b) => b.baseScore - a.baseScore || a.originalIndex - b.originalIndex,
    );

  const result: Array<{ post: Post; score: number; originalIndex: number }> =
    [];
  let previousCreator: string | null = null;
  let previousRestaurant: string | null = null;

  for (const item of scored) {
    let diversityPenalty = 0;

    if (previousCreator && item.creatorId === previousCreator) {
      diversityPenalty += 180;
    }

    if (previousRestaurant && item.restaurantKey === previousRestaurant) {
      diversityPenalty += 220;
    }

    result.push({
      post: item.post,
      score: item.baseScore - diversityPenalty,
      originalIndex: item.originalIndex,
    });

    previousCreator = item.creatorId;
    previousRestaurant = item.restaurantKey;
  }

  return result
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex)
    .map(({ post }) => post);
}

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
  const orderedPostsRef = useRef<Post[]>([]);

  const orderedPosts = useMemo(() => {
    if (feedType !== "foryou") {
      orderedPostsRef.current = posts;
      return posts;
    }

    const seenIds = loadSeenPostIds();
    const previous = orderedPostsRef.current;

    if (previous.length === 0) {
      const next = rankForYouFeed(posts, seenIds);
      orderedPostsRef.current = next;
      return next;
    }

    const existingIds = new Set(previous.map((post) => post.id));
    const freshItems = posts.filter((post) => !existingIds.has(post.id));

    if (freshItems.length === 0) {
      return previous;
    }

    const next = [...previous, ...rankForYouFeed(freshItems, seenIds)];
    orderedPostsRef.current = next;
    return next;
  }, [feedType, posts]);

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (feedType === "foryou" && posts.length > 0) {
      const defaultId = initialPostId ?? posts[initialIndex]?.id ?? null;
      if (defaultId) {
        const initialPosition = orderedPosts.findIndex(
          (post) => post.id === defaultId,
        );
        return initialPosition >= 0 ? initialPosition : 0;
      }
    }

    return initialIndex;
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

  // --- COMMENTS DRAWER STATE ---
  const [isCommentsOpen, setIsCommentsOpen] = useState(initialCommentsOpen);

  const handleMuteChange = useCallback((muted: boolean) => {
    setIsGlobalMuted(muted);
  }, []);

  const isTransitioningRef = useRef(false);

  useEffect(() => {
    if (feedType !== "foryou") return;

    const seenIds = loadSeenPostIds();
    const currentPost = orderedPosts[currentIndex];

    if (!currentPost?.id) return;

    seenIds.add(currentPost.id);
    persistSeenPostIds(seenIds);
  }, [currentIndex, feedType, orderedPosts]);

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
    if (currentIndex < orderedPosts.length - 1 && !isTransitioningRef.current) {
      isTransitioningRef.current = true;
      setCurrentIndex((prev) => prev + 1);
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        isTransitioningRef.current = false;
      }, 600);
    }
  }, [currentIndex, orderedPosts.length]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(
      FEED_MUTED_SESSION_KEY,
      String(isGlobalMuted),
    );
  }, [isGlobalMuted]);

  // Load more posts when approaching the end of the current list (e.g. 3 posts left)
  useEffect(() => {
    if (
      orderedPosts.length - currentIndex <= 3 &&
      hasMore &&
      !isLoadingMore &&
      onLoadMore
    ) {
      onLoadMore();
    }
  }, [currentIndex, orderedPosts.length, hasMore, isLoadingMore, onLoadMore]);

  // Persist the current video position so the feed can be restored after
  // navigating away (to profile, other-profile, etc.) and coming back.
  useEffect(() => {
    const post = orderedPosts[currentIndex];
    if (post?.id) {
      feedStore.save(post.id, feedType);
    }
  }, [currentIndex, orderedPosts, feedType]);

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

  // External mouse wheel & trackpad scrolling listener across the feeds page
  const wheelLockUntilRef = useRef<number>(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't intercept wheel if comments drawer is open
      if (isCommentsOpen) return;

      // Don't intercept if user is inside form inputs, textareas or interactive elements
      const target = e.target as HTMLElement | null;
      if (target?.closest("textarea, input, select, [data-prevent-swipe]"))
        return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 4) return;

      const now = Date.now();

      // If within active scroll momentum lock window, absorb event & extend lock to swallow trailing inertia
      if (now < wheelLockUntilRef.current || isTransitioningRef.current) {
        wheelLockUntilRef.current = Math.max(
          wheelLockUntilRef.current,
          now + 350,
        );
        return;
      }

      // Lock out any new scroll triggers for 800ms
      wheelLockUntilRef.current = now + 800;

      if (delta > 0) {
        handleNext();
      } else if (delta < 0) {
        handlePrevious();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleNext, handlePrevious, isCommentsOpen]);

  const { requireAuth } = useRequireAuth();

  const currentPost =
    orderedPosts && orderedPosts.length > 0
      ? orderedPosts[Math.min(currentIndex, orderedPosts.length - 1)]
      : null;

  const handleLikeToggle = useCallback(() => {
    requireAuth(() => {
      if (currentPost?.id) {
        toggleLikeMutation.mutate(currentPost.id);
      }
    });
  }, [requireAuth, currentPost, toggleLikeMutation]);

  if (!orderedPosts || orderedPosts.length === 0) {
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

        {/* --- COMMENTS DRAWER --- */}
        <Comments
          postId={currentPost?.id || null}
          open={isCommentsOpen} // controlled by ActionBar button
          onClose={() => setIsCommentsOpen(false)} // closes drawer
        />

        {/* --- LOADING MORE SPINNER --- */}
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
          canGoNext={currentIndex < orderedPosts.length - 1}
        />
      </div>
    </div>
  );
}
