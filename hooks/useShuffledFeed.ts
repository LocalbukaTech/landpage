import { useMemo, useRef } from "react";
import type { Post } from "@/types/post";
import {
  getSeenPostIds,
  markPostAsSeen,
  shuffleFeed,
  type FeedShuffleOptions,
} from "@/lib/feed-shuffle";

interface UseShuffledFeedOptions extends FeedShuffleOptions {
  enabled?: boolean;
  targetVideoId?: string | null;
  resetKey?: string | number | null;
}

export function useShuffledFeed(
  rawPosts: Post[],
  options: UseShuffledFeedOptions = {},
) {
  const shuffledRef = useRef<Post[]>([]);
  const seenRawCountRef = useRef(0);
  const prevResetKeyRef = useRef(options.resetKey);
  const prevEnabledRef = useRef(options.enabled ?? true);
  const prevTargetVideoIdRef = useRef(options.targetVideoId ?? null);

  return useMemo(() => {
    const enabled = options.enabled ?? true;
    const targetVideoId = options.targetVideoId ?? null;
    const resetKey = options.resetKey ?? null;
    const forceFullReshuffle =
      resetKey !== prevResetKeyRef.current ||
      enabled !== prevEnabledRef.current ||
      targetVideoId !== prevTargetVideoIdRef.current;

    prevResetKeyRef.current = resetKey;
    prevEnabledRef.current = enabled;
    prevTargetVideoIdRef.current = targetVideoId;

    if (!enabled) {
      shuffledRef.current = rawPosts;
      seenRawCountRef.current = rawPosts.length;
      return targetVideoId ? applyTargetPin(rawPosts, targetVideoId) : rawPosts;
    }

    if (forceFullReshuffle || rawPosts.length === 0) {
      const seenIds = getSeenPostIds(options.cooldownHours ?? 24);
      shuffledRef.current = shuffleFeed(rawPosts, seenIds, options);
      seenRawCountRef.current = rawPosts.length;
      return applyTargetPin(shuffledRef.current, targetVideoId);
    }

    if (rawPosts.length > seenRawCountRef.current) {
      const newSlice = rawPosts.slice(seenRawCountRef.current);
      const seenIds = getSeenPostIds(options.cooldownHours ?? 24);
      const shuffledSlice = shuffleFeed(newSlice, seenIds, options);
      shuffledRef.current = [...shuffledRef.current, ...shuffledSlice];
      seenRawCountRef.current = rawPosts.length;
    }

    return applyTargetPin(shuffledRef.current, targetVideoId);
  }, [rawPosts, options]);
}

function applyTargetPin(posts: Post[], targetVideoId: string | null) {
  if (!targetVideoId || !posts.length) return posts;

  const index = posts.findIndex((post) => post.id === targetVideoId);
  if (index <= 0) return posts;

  const next = [...posts];
  const [target] = next.splice(index, 1);
  next.unshift(target);
  return next;
}

export function markSeenPost(postId: string, maxSeenEntries = 2000) {
  markPostAsSeen(postId, maxSeenEntries);
}
