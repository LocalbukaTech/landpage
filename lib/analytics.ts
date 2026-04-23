import {sendGAEvent} from '@next/third-parties/google';

/**
 * Track a GA4 event.
 * Usage: trackEvent('sign_up', { method: 'email' })
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>,
) {
  sendGAEvent('event', eventName, params ?? {});
}

/**
 * Set the GA4 user ID for cross-session/cross-device identity.
 * Pass null to clear on logout.
 */
export function setAnalyticsUser(userId: string | null) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('set', {user_id: userId});
  }
}
