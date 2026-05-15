import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {formatDistanceToNow} from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Capitalize first letter of each word in a string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(str: string): string {
  if (!str) return 'post';
  const slug = str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'post';
}

/**
 * Format a date string to a short relative time (e.g. 1d, 2h, 5m)
 */
export function formatRelativeShort(dateString: string): string {
  // ...existing implementation...
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    const distance = formatDistanceToNow(date, {addSuffix: false});

    return distance
      .replace('about ', '')
      .replace('less than a ', '1')
      .replace(' minute', 'm')
      .replace(' minutes', 'm')
      .replace(' hour', 'hr')
      .replace(' hours', 'hr')
      .replace(' day', 'd')
      .replace(' days', 'd')
      .replace(' month', 'mo')
      .replace(' months', 'mo')
      .replace(' year', 'y')
      .replace(' years', 'y')
      .replace(/\s/g, '');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return '';
  }
}

/**
 * Returns a usable thumbnail image URL for a video post.
 *
 * Priority:
 *   1. Server-generated thumbnailUrl (already an image)
 *   2. Cloudinary on-the-fly thumbnail derived from the video URL
 *      (works on all devices — no browser preload required)
 *   3. undefined — caller must show a placeholder
 */
export function getVideoThumbnailUrl(post: {
  thumbnailUrl: string | null;
  mediaUrl: string;
  mediaType: string;
}): string | undefined {
  if (post.thumbnailUrl) return post.thumbnailUrl;
  if (post.mediaType !== 'video') return undefined;

  // Cloudinary video URLs can be transformed into a static thumbnail image
  // by injecting transformation parameters and swapping the extension.
  // e.g. …/video/upload/v1/my-clip.mp4
  //   → …/video/upload/so_1,w_400,c_fill/v1/my-clip.jpg
  if (post.mediaUrl?.includes('res.cloudinary.com')) {
    return post.mediaUrl
      .replace('/video/upload/', '/video/upload/so_1,w_400,c_fill/')
      .replace(/\.(mp4|mov|webm|avi|mkv)(\?.*)?$/i, '.jpg');
  }

  return undefined;
}

/**
 * Sort items by a date field in descending order (latest first).
 * Items without the date field are pushed to the end.
 */
export function sortByLatest<T>(items: T[], dateKey: keyof T): T[] {
  return [...items].sort((a, b) => {
    const dateA = a[dateKey] as unknown as string | undefined;
    const dateB = b[dateKey] as unknown as string | undefined;
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}
