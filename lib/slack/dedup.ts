/**
 * In-Memory Event Deduplication
 *
 * Prevents duplicate Slack notifications for the same event within a
 * configurable time window. Uses a Map keyed by event fingerprint.
 *
 * TTL defaults:
 *  - signup / post events: 60 seconds
 *  - error events: 5 minutes (300 seconds)
 */

/** Default TTL for user/post events (ms) */
const DEFAULT_TTL_MS = 60 * 1000; // 60 seconds

/** TTL for error events (ms) */
const ERROR_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Cleanup interval (ms) — runs every 2 minutes */
const CLEANUP_INTERVAL_MS = 2 * 60 * 1000;

/** Map of eventKey → expiry timestamp */
const eventCache = new Map<string, number>();

/** Track cleanup interval so we only start it once */
let cleanupStarted = false;

/**
 * Start periodic cleanup of expired entries.
 * Automatically called on first `isDuplicate` check.
 */
function startCleanup(): void {
  if (cleanupStarted) return;
  cleanupStarted = true;

  setInterval(() => {
    const now = Date.now();
    for (const [key, expiresAt] of eventCache) {
      if (now >= expiresAt) {
        eventCache.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS);
}

/**
 * Build a fingerprint key for an event.
 *
 * @param event  - Event type (e.g., 'signup', 'new_post', 'first_post', 'error')
 * @param id     - Unique identifier (userId, postId, error hash, etc.)
 */
export function buildEventKey(event: string, id: string): string {
  return `${event}:${id}`;
}

/**
 * Check if an event is a duplicate (i.e., already sent within the TTL window).
 *
 * If the event is **not** a duplicate, it is recorded and `false` is returned.
 * If the event **is** a duplicate, `true` is returned and no notification should be sent.
 *
 * @param eventKey - The fingerprint key from `buildEventKey`
 * @param ttlMs    - Optional custom TTL in milliseconds
 */
export function isDuplicate(eventKey: string, ttlMs?: number): boolean {
  startCleanup();

  const now = Date.now();
  const expiresAt = eventCache.get(eventKey);

  // Entry exists and hasn't expired
  if (expiresAt !== undefined && now < expiresAt) {
    return true;
  }

  // Determine TTL: use custom, or default based on event type
  const resolvedTtl =
    ttlMs ?? (eventKey.startsWith('error:') ? ERROR_TTL_MS : DEFAULT_TTL_MS);

  // Record the event
  eventCache.set(eventKey, now + resolvedTtl);
  return false;
}

/**
 * Get the current cache size (useful for debugging / tests).
 */
export function getDedupCacheSize(): number {
  return eventCache.size;
}

/**
 * Clear the entire dedup cache (useful for tests).
 */
export function clearDedupCache(): void {
  eventCache.clear();
}
