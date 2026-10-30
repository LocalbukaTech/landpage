import type { Post } from '@/types/post';

const SEEN_POSTS_STORAGE_KEY = 'localbuka:seen_posts';
const DEFAULT_COOLDOWN_HOURS = 24;
const DEFAULT_UNSEEN_BONUS = 5.0;
const DEFAULT_DIVERSITY_SPACING = 3;
const DEFAULT_MAX_SEEN_ENTRIES = 2000;

interface SeenPostRecord {
  [postId: string]: number; // timestamp in ms when the post was marked seen
}

export interface ShuffleOptions {
  unseenBonus?: number;       // Score multiplier for unseen posts (default: 5.0)
  cooldownHours?: number;     // How long before a post is considered "unseen" again (default: 24)
  diversitySpacing?: number;  // Minimum items between posts from the same restaurant/creator (default: 3)
  maxSeenEntries?: number;    // Hard cap on localStorage seen-post entries to prevent unbounded growth (default: 2000)
}

/**
 * Retrieves the set of currently valid "seen" post IDs from localStorage.
 * Automatically purges expired records older than cooldownHours.
 */
export function getSeenPostIds(cooldownHours: number = DEFAULT_COOLDOWN_HOURS): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const raw = window.localStorage.getItem(SEEN_POSTS_STORAGE_KEY);
    if (!raw) return new Set();

    const records: SeenPostRecord = JSON.parse(raw);
    const now = Date.now();
    const ttlMs = cooldownHours * 60 * 60 * 1000;
    const validIds = new Set<string>();
    const cleanedRecords: SeenPostRecord = {};
    let hasExpired = false;

    for (const [id, seenAt] of Object.entries(records)) {
      if (now - seenAt < ttlMs) {
        validIds.add(id);
        cleanedRecords[id] = seenAt;
      } else {
        hasExpired = true;
      }
    }

    // Save cleaned records if any expired entries were pruned
    if (hasExpired) {
      window.localStorage.setItem(SEEN_POSTS_STORAGE_KEY, JSON.stringify(cleanedRecords));
    }

    return validIds;
  } catch (e) {
    console.warn('[feed-shuffle] Failed to read seen posts from storage:', e);
    return new Set();
  }
}

/**
 * Marks a post as viewed by saving its ID and timestamp to localStorage.
 *
 * Enforces a hard cap (maxSeenEntries) on the number of stored entries to prevent
 * unbounded localStorage growth within a single TTL window. When the cap is exceeded,
 * the oldest entries by timestamp are evicted first (LRU-by-timestamp), regardless
 * of whether their TTL has expired yet.
 */
export function markPostAsSeen(
  postId: string,
  maxSeenEntries: number = DEFAULT_MAX_SEEN_ENTRIES,
): void {
  if (typeof window === 'undefined' || !postId) return;

  try {
    const raw = window.localStorage.getItem(SEEN_POSTS_STORAGE_KEY);
    const records: SeenPostRecord = raw ? JSON.parse(raw) : {};
    records[postId] = Date.now();

    // Evict oldest entries if cap is exceeded
    const entries = Object.entries(records);
    if (entries.length > maxSeenEntries) {
      entries
        .sort((a, b) => a[1] - b[1])                       // oldest first
        .slice(0, entries.length - maxSeenEntries)          // overflow entries
        .forEach(([id]) => delete records[id]);             // evict them
    }

    window.localStorage.setItem(SEEN_POSTS_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn('[feed-shuffle] Failed to mark post as seen:', e);
  }
}

/**
 * Clears all seen post history from localStorage.
 */
export function clearSeenPosts(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(SEEN_POSTS_STORAGE_KEY);
  } catch (e) {
    console.warn('[feed-shuffle] Failed to clear seen posts:', e);
  }
}

/**
 * Weighted Reservoir Shuffle with Recency Decay + Diversity Constraint
 * (Efraimidis–Spirakis Algorithm for weighted random sampling without replacement)
 *
 * Scoring formula per post:
 *   finalScore = recencyWeight × noveltyMultiplier × engagementWeight
 *
 * Sample key (sort key for weighted random order):
 *   key = R ^ (1 / finalScore)   where R ~ Uniform(0, 1)
 *   → Higher scores produce keys closer to 1, so descending sort = weighted-random order.
 *
 * After sorting, a diversity pass (round-robin bucketing) enforces a minimum spacing
 * between consecutive posts from the same creator or restaurant.
 */
export function shuffleFeed<T extends Post>(
  posts: T[],
  seenPostIds: Set<string>,
  options: ShuffleOptions = {}
): T[] {
  if (!posts || posts.length <= 1) return [...(posts || [])];

  const {
    unseenBonus = DEFAULT_UNSEEN_BONUS,
    diversitySpacing = DEFAULT_DIVERSITY_SPACING,
  } = options;

  const now = Date.now();

  // 1. Calculate scores and sample keys for each post
  const scoredItems = posts.map((post) => {
    const createdAtMs = post.createdAt ? new Date(post.createdAt).getTime() : now;
    const hoursSincePosted = Math.max(0, (now - createdAtMs) / (1000 * 60 * 60));

    // Recency decay: 1 / (hours + 1)
    const recencyWeight = 1 / (hoursSincePosted + 1);

    // Unseen bonus
    const isUnseen = !seenPostIds.has(post.id);
    const noveltyMultiplier = isUnseen ? unseenBonus : 1.0;

    // Engagement hint (soft boost for posts with high like counts)
    const likeBoost = Math.log10(Math.max(1, (post.likesCount || post.likeCount || 0) + 1));
    const engagementWeight = 1 + likeBoost * 0.1;

    const finalScore = Math.max(recencyWeight * noveltyMultiplier * engagementWeight, 0.0001);

    // Efraimidis-Spirakis key: key = R^(1 / score), where R ~ Uniform(0, 1)
    // Higher score → key closer to 1 → sorts first in descending order.
    const r = Math.max(Math.random(), 0.00001);
    const sampleKey = Math.pow(r, 1 / finalScore);

    return { post, sampleKey };
  });

  // 2. Sort descending by sampled key (weighted-random order)
  scoredItems.sort((a, b) => b.sampleKey - a.sampleKey);
  const sorted = scoredItems.map((item) => item.post);

  // 3. Diversity pass — round-robin bucketing (O(n), guaranteed termination)
  //
  // Groups posts by entity (restaurantId / restaurant.id / user.id) into buckets,
  // preserving the weighted order within each bucket. Then builds the output by
  // always picking from the entity that wasn't used within the last `diversitySpacing`
  // positions. If all eligible buckets are exhausted, spacing is relaxed to prevent
  // stalling (e.g. a feed of only one creator).
  return applyDiversityPass(sorted, diversitySpacing);
}

/**
 * Round-robin bucketing diversity pass.
 * Builds output forward without revisiting or invalidating already-placed positions.
 */
function applyDiversityPass<T extends Post>(posts: T[], spacing: number): T[] {
  if (posts.length <= 1 || spacing <= 0) return posts;

  // Group by entity, preserving weighted order within each bucket
  const buckets = new Map<string, T[]>();
  const NO_ENTITY = '__no_entity__';

  for (const post of posts) {
    const entityId = post.restaurantId || post.restaurant?.id || post.user?.id || NO_ENTITY;
    if (!buckets.has(entityId)) buckets.set(entityId, []);
    buckets.get(entityId)!.push(post);
  }

  // If all posts belong to one entity, diversity pass is a no-op
  if (buckets.size === 1) return posts;

  const output: T[] = [];
  const recentEntities: string[] = []; // ring buffer of last `spacing` entity IDs placed

  while (output.length < posts.length) {
    // Eligible: buckets that are non-empty AND not in the recent window
    const eligibleIds = [...buckets.keys()].filter(
      (id) => (buckets.get(id)?.length ?? 0) > 0 && !recentEntities.includes(id),
    );

    // If all non-empty buckets are in the recent window, relax spacing to avoid stalling
    const pickFrom =
      eligibleIds.length > 0
        ? eligibleIds
        : [...buckets.keys()].filter((id) => (buckets.get(id)?.length ?? 0) > 0);

    if (pickFrom.length === 0) break; // safety — should never happen

    // Pick the least-recently-used entity from candidates
    const entityId = pickLeastRecentlyUsed(pickFrom, recentEntities);
    const bucket = buckets.get(entityId)!;
    output.push(bucket.shift()!);

    // Update recency window
    recentEntities.push(entityId);
    if (recentEntities.length > spacing) recentEntities.shift();
  }

  return output;
}

/**
 * From a list of candidate entity IDs, returns the one that appeared
 * least recently in the recentEntities window (or the first candidate
 * if none appear in the window at all).
 */
function pickLeastRecentlyUsed(candidates: string[], recentEntities: string[]): string {
  let leastRecent = candidates[0];
  let leastRecentIndex = -1;

  for (const id of candidates) {
    const idx = recentEntities.lastIndexOf(id);
    if (idx < leastRecentIndex || leastRecentIndex === -1) {
      // Not found (-1) is the "oldest" possible — return immediately
      if (idx === -1) return id;
      leastRecent = id;
      leastRecentIndex = idx;
    }
  }

  return leastRecent;
}
