'use client';

import { useState } from 'react';
import type { Post } from '@/types/post';
import { getSeenPostIds, shuffleFeed, type ShuffleOptions } from '@/lib/feed-shuffle';

interface UseShuffledFeedOptions extends ShuffleOptions {
  enabled?: boolean;
  targetVideoId?: string | null;
  resetKey?: string | number | boolean;
}

interface FeedState {
  rawPosts: Post[];
  enabled: boolean;
  targetVideoId?: string | null;
  resetKey?: string | number | boolean;
  shuffled: Post[];
}

function computeShuffled(
  rawPosts: Post[],
  options: UseShuffledFeedOptions,
  prevShuffled: Post[] = [],
  prevRawLength: number = 0
): Post[] {
  const {
    enabled = true,
    targetVideoId,
    unseenBonus,
    cooldownHours,
    diversitySpacing,
    maxSeenEntries,
  } = options;

  if (!enabled || !rawPosts || rawPosts.length === 0) {
    return rawPosts || [];
  }

  const shuffleOptions = { unseenBonus, cooldownHours, diversitySpacing, maxSeenEntries };
  const seenPostIds = typeof window !== 'undefined' ? getSeenPostIds(cooldownHours) : new Set<string>();

  let result: Post[];
  if (prevRawLength > 0 && rawPosts.length > prevRawLength) {
    const newSlice = rawPosts.slice(prevRawLength);
    const shuffledSlice = shuffleFeed(newSlice, seenPostIds, shuffleOptions);
    result = [...prevShuffled, ...shuffledSlice];
  } else {
    result = shuffleFeed(rawPosts, seenPostIds, shuffleOptions);
  }

  if (targetVideoId) {
    const pinned = [...result];
    const targetIdx = pinned.findIndex((p) => p.id === targetVideoId);
    if (targetIdx > 0) {
      const [targetPost] = pinned.splice(targetIdx, 1);
      pinned.unshift(targetPost);
      return pinned;
    }
  }

  return result;
}

/**
 * Hook to shuffle posts client-side using Weighted Reservoir Shuffle (Efraimidis-Spirakis).
 *
 * Features:
 * - Shuffles For-You feed posts based on recency decay, unseen bonus, and creator diversity.
 * - Pins target video to top if accessed via direct link (?video=id).
 * - Full reshuffle when `resetKey`, `enabled`, or `targetVideoId` changes (e.g. tab switch).
 * - Incremental shuffle-and-append on pagination: only the newly added slice of rawPosts is
 *   reshuffled and appended to the already-rendered output, preventing already-viewed posts
 *   from jumping position during infinite-scroll page loads.
 */
export function useShuffledFeed(
  rawPosts: Post[],
  options: UseShuffledFeedOptions = {}
): Post[] {
  const {
    enabled = true,
    targetVideoId,
    resetKey,
  } = options;

  const [state, setState] = useState<FeedState>(() => ({
    rawPosts,
    enabled,
    targetVideoId,
    resetKey,
    shuffled: computeShuffled(rawPosts, options),
  }));

  const hasPropsChanged =
    rawPosts !== state.rawPosts ||
    enabled !== state.enabled ||
    targetVideoId !== state.targetVideoId ||
    resetKey !== state.resetKey;

  if (hasPropsChanged) {
    const isTabOrConfigChange =
      enabled !== state.enabled ||
      targetVideoId !== state.targetVideoId ||
      resetKey !== state.resetKey ||
      state.rawPosts.length === 0;

    let newShuffled: Post[];

    if (isTabOrConfigChange) {
      // Full fresh shuffle when tab, filter, or target video resets
      newShuffled = computeShuffled(rawPosts, options);
    } else if (rawPosts.length > state.rawPosts.length) {
      // Incremental shuffle for newly appended pagination pages
      const postMap = new Map((rawPosts || []).map((p) => [p.id, p]));
      const existingShuffledUpdated = state.shuffled.map((p) => postMap.get(p.id) || p);
      const existingIds = new Set(state.shuffled.map((p) => p.id));
      const newlyAddedPosts = rawPosts.filter((p) => !existingIds.has(p.id));

      if (newlyAddedPosts.length > 0) {
        const shuffleOptions = { unseenBonus: options.unseenBonus, cooldownHours: options.cooldownHours, diversitySpacing: options.diversitySpacing, maxSeenEntries: options.maxSeenEntries };
        const seenPostIds = typeof window !== 'undefined' ? getSeenPostIds(options.cooldownHours) : new Set<string>();
        const shuffledSlice = shuffleFeed(newlyAddedPosts, seenPostIds, shuffleOptions);
        newShuffled = [...existingShuffledUpdated, ...shuffledSlice];
      } else {
        newShuffled = existingShuffledUpdated;
      }
    } else {
      // Data refetch / like / save / comment update: PRESERVE EXACT ORDER and update post objects in place
      const postMap = new Map((rawPosts || []).map((p) => [p.id, p]));
      newShuffled = state.shuffled
        .filter((p) => postMap.has(p.id)) // Remove deleted posts if any
        .map((p) => postMap.get(p.id) || p);
    }

    setState({
      rawPosts,
      enabled,
      targetVideoId,
      resetKey,
      shuffled: newShuffled,
    });

    return enabled ? newShuffled : (rawPosts || []);
  }

  return enabled ? state.shuffled : (rawPosts || []);
}


