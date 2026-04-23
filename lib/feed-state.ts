/**
 * Module-level feed state store.
 *
 * Because Next.js App Router keeps client-side JS modules alive across soft
 * (client) navigations, this singleton persists when the user navigates away
 * from the feed and returns — without requiring any external state library.
 *
 * Reset conditions (matching TikTok behaviour):
 *   1. Manual page refresh         → module is re-initialised naturally.
 *   2. Explicit Home tab click      → call feedStore.reset() before navigating.
 *   3. First time entering the feed → no saved state (postId is null).
 */

export type FeedType = 'foryou' | 'following';

interface State {
  currentPostId: string | null;
  feedType: FeedType;
  pendingReset: boolean;
}

const state: State = {
  currentPostId: null,
  feedType: 'foryou',
  pendingReset: false,
};

export const feedStore = {
  /** Called by VideoFeed on every index change to keep the store up to date. */
  save(postId: string, feedType: FeedType) {
    state.currentPostId = postId;
    state.feedType = feedType;
  },

  getPostId(): string | null {
    return state.currentPostId;
  },

  getFeedType(): FeedType {
    return state.feedType;
  },

  /**
   * Mark the feed to restart from the top on next mount.
   * Call this when the user explicitly taps/clicks the Home nav item.
   */
  reset() {
    state.pendingReset = true;
    state.currentPostId = null;
    state.feedType = 'foryou';
  },

  /**
   * Read-and-clear the pending reset flag.
   * Call exactly once inside a `useState` initialiser on the feeds page so it
   * runs only on mount, even under React StrictMode.
   */
  consumeReset(): boolean {
    const was = state.pendingReset;
    state.pendingReset = false;
    return was;
  },
};
