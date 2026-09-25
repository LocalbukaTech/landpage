/**
 * Critical Error Reporter
 *
 * Global utility for reporting critical system errors to Slack.
 * Can be called from API routes, middleware, error boundaries, etc.
 *
 * - Only reports errors classified as 'critical' or 'fatal'.
 * - Fingerprints errors by code + message for dedup.
 * - Runs fire-and-forget (never blocks the caller).
 */

import { sendSlackNotification } from './slack';
import { buildErrorNotification, type ErrorEventData } from './events';
import { buildEventKey, isDuplicate } from './dedup';

/**
 * Create a simple hash of a string for fingerprinting.
 * Uses a fast, non-cryptographic hash suitable for dedup keys.
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

export interface CriticalErrorReport {
  /** Error code or classification (e.g., 'AUTH_FAILURE', 'DB_CONNECTION_LOST') */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Stack trace (optional) */
  stack?: string;
  /** Severity level — only 'critical' and 'fatal' are reported */
  severity: 'critical' | 'fatal';
  /** Additional context (e.g., which endpoint, which user) */
  context?: string;
}

/**
 * Report a critical error to Slack.
 *
 * This function is **fire-and-forget**: it will never throw or block the caller.
 * Duplicate errors (same code + message) within the dedup window are suppressed.
 *
 * @example
 * ```ts
 * reportCriticalError({
 *   code: 'DB_CONNECTION_LOST',
 *   message: 'Failed to connect to primary database',
 *   severity: 'critical',
 *   context: 'POST /api/posts — createPost handler',
 * });
 * ```
 */
export function reportCriticalError(report: CriticalErrorReport): void {
  // Run entirely asynchronously — never block the caller
  (async () => {
    try {
      // Build a fingerprint for dedup
      const fingerprint = simpleHash(`${report.code}:${report.message}`);
      const eventKey = buildEventKey('error', fingerprint);

      if (isDuplicate(eventKey)) {
        console.info(
          `[Slack] Duplicate error suppressed: [${report.code}] ${report.message}`,
        );
        return;
      }

      const errorData: ErrorEventData = {
        code: report.code,
        message: report.message,
        stack: report.stack,
        severity: report.severity,
        context: report.context,
        timestamp: new Date().toISOString(),
      };

      const payload = buildErrorNotification(errorData);
      const result = await sendSlackNotification(payload);

      if (!result.success) {
        console.error('[Slack] Failed to send error notification:', result.error);
      }
    } catch (err) {
      // Absolute last-resort catch — never let the reporter itself crash anything
      console.error('[Slack] Error reporter encountered an unexpected error:', err);
    }
  })();
}
