import type { Post } from "@/types/post";

const SEEN_POSTS_KEY = "localbuka:seen_posts";

export interface FeedShuffleOptions {
  unseenBonus?: number;
  cooldownHours?: number;
  diversitySpacing?: number;
  maxSeenEntries?: number;
}

function readSeenMap(): Record<string, number> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(SEEN_POSTS_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as Record<string, number>;
    if (!parsed || typeof parsed !== "object") return {};

    return parsed;
  } catch {
    return {};
  }
}

function writeSeenMap(seen: Record<string, number>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SEEN_POSTS_KEY, JSON.stringify(seen));
}

export function getSeenPostIds(cooldownHours = 24): Set<string> {
  const seen = readSeenMap();
  const now = Date.now();
  const ttlMs = cooldownHours * 60 * 60 * 1000;

  const valid = Object.entries(seen).filter(([, timestamp]) => {
    return now - timestamp <= ttlMs;
  });

  const next = Object.fromEntries(valid);
  writeSeenMap(next);

  return new Set(Object.keys(next));
}

export function markPostAsSeen(postId: string, maxSeenEntries = 2000) {
  if (!postId || typeof window === "undefined") return;

  const seen = readSeenMap();
  seen[postId] = Date.now();

  const entries = Object.entries(seen).sort(([, a], [, b]) => a - b);
  if (entries.length > maxSeenEntries) {
    const overflow = entries.slice(0, entries.length - maxSeenEntries);
    overflow.forEach(([id]) => delete seen[id]);
  }

  writeSeenMap(seen);
}

export function clearSeenPosts() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SEEN_POSTS_KEY);
}

function getEntityKey(post: Post, kind: "creator" | "restaurant") {
  if (kind === "creator") {
    return `creator:${post.user?.id ?? post.user?.username ?? "unknown-user"}`;
  }

  return `restaurant:${post.restaurantId ?? post.restaurant?.id ?? post.restaurant?.name ?? "unknown-restaurant"}`;
}

function applyDiversityPass(sortedPosts: Post[], spacing = 3): Post[] {
  if (sortedPosts.length <= 1) return sortedPosts;

  const buckets = new Map<string, Post[]>();

  const upsert = (key: string, post: Post) => {
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.push(post);
      return;
    }
    buckets.set(key, [post]);
  };

  for (const post of sortedPosts) {
    upsert(getEntityKey(post, "creator"), post);
    upsert(getEntityKey(post, "restaurant"), post);
  }

  const recentEntities: string[] = [];
  const output: Post[] = [];

  while (output.length < sortedPosts.length) {
    const eligible = [...buckets.keys()].filter(
      (entityId) =>
        (buckets.get(entityId)?.length ?? 0) > 0 &&
        !recentEntities.includes(entityId),
    );

    const pickFrom =
      eligible.length > 0
        ? eligible
        : [...buckets.keys()].filter(
            (entityId) => (buckets.get(entityId)?.length ?? 0) > 0,
          );

    if (pickFrom.length === 0) break;

    const entityId = pickFrom.sort((a, b) => {
      const aSeen = recentEntities.lastIndexOf(a);
      const bSeen = recentEntities.lastIndexOf(b);
      const aRank = aSeen === -1 ? Number.MAX_SAFE_INTEGER : aSeen;
      const bRank = bSeen === -1 ? Number.MAX_SAFE_INTEGER : bSeen;
      return aRank - bRank;
    })[0];

    const bucket = buckets.get(entityId);
    if (!bucket || bucket.length === 0) break;

    const nextPost = bucket.shift()!;
    output.push(nextPost);

    for (const [otherEntityId, items] of buckets.entries()) {
      if (otherEntityId === entityId) continue;
      const index = items.findIndex((item) => item.id === nextPost.id);
      if (index >= 0) items.splice(index, 1);
    }

    recentEntities.push(entityId);
    if (recentEntities.length > spacing) {
      recentEntities.shift();
    }
  }

  return output;
}

export function shuffleFeed(
  posts: Post[],
  seenIds: Set<string>,
  options: FeedShuffleOptions = {},
): Post[] {
  if (!posts.length) return [];

  const unseenBonus = options.unseenBonus ?? 5.0;
  const diversitySpacing = options.diversitySpacing ?? 3;

  const scored = posts
    .map((post) => {
      const createdAt = new Date(post.createdAt).getTime();
      const hoursSincePosted = Number.isNaN(createdAt)
        ? Number.POSITIVE_INFINITY
        : Math.max(0, (Date.now() - createdAt) / (1000 * 60 * 60));

      const recencyWeight = 1 / (hoursSincePosted + 1);
      const noveltyMultiplier = seenIds.has(post.id) ? 1.0 : unseenBonus;
      const engagementWeight =
        1 + Math.log10((post.likesCount ?? post.likeCount ?? 0) + 1) * 0.1;
      const finalScore = Math.max(
        0.0001,
        recencyWeight * noveltyMultiplier * engagementWeight,
      );

      // NOTE: higher score -> exponent (1/score) shrinks -> R^exponent moves toward 1 -> sorts first (descending).
      const sampleKey = Math.pow(Math.random(), 1 / finalScore);

      return { post, sampleKey };
    })
    .sort((a, b) => b.sampleKey - a.sampleKey);

  return applyDiversityPass(
    scored.map(({ post }) => post),
    diversitySpacing,
  );
}
