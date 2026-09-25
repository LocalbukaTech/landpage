/**
 * Client-Side Slack Notification Helper
 *
 * Thin wrapper that sends events to our internal `/api/slack/notify` API route.
 * All calls are fire-and-forget: errors are caught silently so user actions
 * are never blocked by notification failures.
 */

export type SlackEvent = 'signup' | 'new_post' | 'first_post' | 'error';

/**
 * Send a notification event to the Slack webhook via our internal API.
 *
 * This is designed to be called from React hooks' `onSuccess` callbacks.
 * It runs entirely in the background and never throws.
 *
 * @param event - The event type to notify about
 * @param data  - Event-specific data payload
 *
 * @example
 * ```ts
 * // In a mutation's onSuccess:
 * notifySlack('signup', { id: user.id, fullName: user.fullName, email: user.email });
 * ```
 */
export function notifySlack(event: SlackEvent, data: Record<string, unknown>): void {
  // Fire-and-forget — wrapped in an IIFE to avoid unhandled promise warnings
  (async () => {
    try {
      await fetch('/api/slack/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event, data }),
      });
      // We intentionally don't check the response —
      // the server handles logging and retries.
    } catch {
      // Silently swallow all errors.
      // Notification failures must NEVER affect the user experience.
    }
  })();
}
