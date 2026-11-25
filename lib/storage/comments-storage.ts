// lib/storage/comments-storage.ts
// Centralized persistent storage for community comments across feeds, creator dashboard, and mobile views.

export interface StoredComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
  postId: string;
  postText?: string;
  createdAt: number;
}

export const COMMUNITY_COMMENTS_STORAGE_KEY = 'localbuka_community_comments_v1';
export const COMMUNITY_COMMENT_COUNTS_KEY = 'localbuka_community_comment_counts_v1';

function normalizeText(text?: string): string {
  if (!text) return '';
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getAllStoredComments(): Record<string, StoredComment[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(COMMUNITY_COMMENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getStoredCommentsForPost(postId: string, postText?: string): StoredComment[] {
  if (typeof window === 'undefined' || !postId) return [];
  try {
    const all = getAllStoredComments();
    const direct: StoredComment[] = Array.isArray(all[postId]) ? all[postId] : [];

    if (direct.length > 0) return direct;

    // Cross-match by post text if available (in case post ID changed from local draft/optimistic to server UUID)
    if (postText) {
      const normalizedTarget = normalizeText(postText);
      for (const [key, list] of Object.entries(all)) {
        if (key === postId || !Array.isArray(list)) continue;
        const match = list.find((c) => c.postText && normalizeText(c.postText) === normalizedTarget);
        if (match) {
          // Associate list with current postId so subsequent lookups are fast
          all[postId] = list;
          try {
            window.localStorage.setItem(COMMUNITY_COMMENTS_STORAGE_KEY, JSON.stringify(all));
          } catch {}
          return list;
        }
      }
    }

    return [];
  } catch {
    return [];
  }
}

export function saveCommentForPost(
  postId: string,
  comment: Omit<StoredComment, 'postId' | 'createdAt'> & { postId?: string; createdAt?: number },
  postText?: string
): StoredComment[] {
  if (typeof window === 'undefined' || !postId) return [];
  try {
    const all = getAllStoredComments();
    const existing: StoredComment[] = Array.isArray(all[postId]) ? all[postId] : [];

    const newEntry: StoredComment = {
      id: comment.id || `comment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author: comment.author || 'You',
      avatar: comment.avatar || '/images/community/avatar-1.png',
      text: comment.text,
      timeAgo: comment.timeAgo || 'Just now',
      postId,
      postText: postText || comment.postText || '',
      createdAt: comment.createdAt || Date.now(),
    };

    // Deduplicate by id or identical text
    const filtered = existing.filter(
      (c) => c.id !== newEntry.id && normalizeText(c.text) !== normalizeText(newEntry.text)
    );

    const updated = [newEntry, ...filtered];
    all[postId] = updated;

    window.localStorage.setItem(COMMUNITY_COMMENTS_STORAGE_KEY, JSON.stringify(all));

    // Update persistent comment count
    try {
      const countsRaw = window.localStorage.getItem(COMMUNITY_COMMENT_COUNTS_KEY);
      const counts = countsRaw ? JSON.parse(countsRaw) : {};
      counts[postId] = updated.length;
      window.localStorage.setItem(COMMUNITY_COMMENT_COUNTS_KEY, JSON.stringify(counts));
    } catch {}

    return updated;
  } catch (err) {
    console.warn('Failed to save community comment:', err);
    return [];
  }
}

export function getStoredCommentCount(postId: string, fallbackCount = 0): number {
  if (typeof window === 'undefined' || !postId) return fallbackCount;
  try {
    const countsRaw = window.localStorage.getItem(COMMUNITY_COMMENT_COUNTS_KEY);
    if (countsRaw) {
      const counts = JSON.parse(countsRaw);
      if (typeof counts[postId] === 'number') {
        return Math.max(counts[postId], fallbackCount);
      }
    }
    const comments = getStoredCommentsForPost(postId);
    return Math.max(comments.length, fallbackCount);
  } catch {
    return fallbackCount;
  }
}
