import { useMemo } from "react";
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
  const {
    enabled = true,
    targetVideoId = null,
    resetKey = null,
    cooldownHours = 24,
    // include any other FeedShuffleOptions fields you pass
    ...shuffleOptions
  } = options;

  // Serialize non-primitive options so useMemo deps are stable
  const optionsKey = JSON.stringify(shuffleOptions);

  const shuffled = useMemo(() => {
    if (!enabled) {
      return targetVideoId ? applyTargetPin(rawPosts, targetVideoId) : rawPosts;
    }

    if (rawPosts.length === 0) {
      return applyTargetPin([], targetVideoId);
    }

    const seenIds = getSeenPostIds(cooldownHours);
    const result = shuffleFeed(rawPosts, seenIds, {
      cooldownHours,
      ...shuffleOptions,
    });

    return applyTargetPin(result, targetVideoId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawPosts, enabled, targetVideoId, resetKey, cooldownHours, optionsKey]);

  return shuffled;
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
