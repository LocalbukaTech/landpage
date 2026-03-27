import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import { formatDistanceToNow } from 'date-fns';

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
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    let distance = formatDistanceToNow(date, { addSuffix: false });
    
    // Convert date-fns output to short format
    // "about 1 hour" -> "1h"
    // "2 days" -> "2d"
    // "less than a minute" -> "1m"
    
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
  } catch (e) {
    return '';
  }
}
