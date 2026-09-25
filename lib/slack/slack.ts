/**
 * Core Slack Webhook Client
 *
 * Sends messages to a Slack Incoming Webhook URL with retry logic.
 * Designed to be fire-and-forget: never throws, always returns a result object.
 */

export interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  fields?: Array<{
    type: string;
    text: string;
  }>;
  elements?: Array<{
    type: string;
    text?: string;
    emoji?: boolean;
  }>;
  accessory?: Record<string, unknown>;
}

export interface SlackPayload {
  text: string; // Fallback plain-text (shown in notifications / search)
  blocks?: SlackBlock[];
  unfurl_links?: boolean;
  unfurl_media?: boolean;
}

export interface SlackResult {
  success: boolean;
  error?: string;
  attempts?: number;
}

/** Maximum number of retry attempts */
const MAX_RETRIES = 3;

/** Base delay (ms) for exponential backoff */
const BASE_DELAY_MS = 2000;

/**
 * Sleep for a given number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send a notification payload to the configured Slack webhook.
 *
 * - Retries up to 3 times with exponential backoff (0s, 2s, 4s).
 * - Logs errors to console but **never throws**.
 * - Returns a result object indicating success or failure.
 */
export async function sendSlackNotification(
  payload: SlackPayload
): Promise<SlackResult> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('[Slack] SLACK_WEBHOOK_URL is not configured — skipping notification.');
    return { success: false, error: 'SLACK_WEBHOOK_URL not configured' };
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return { success: true, attempts: attempt };
      }

      // Slack returns plain text responses (e.g., "ok", "invalid_payload")
      const body = await response.text();

      // Non-retryable client errors (4xx except 429)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        console.error(
          `[Slack] Non-retryable error (${response.status}): ${body}`,
        );
        return {
          success: false,
          error: `HTTP ${response.status}: ${body}`,
          attempts: attempt,
        };
      }

      // Retryable: 429 (rate-limited) or 5xx
      console.warn(
        `[Slack] Attempt ${attempt}/${MAX_RETRIES} failed (${response.status}): ${body}`,
      );
    } catch (err) {
      // Network-level errors are retryable
      console.warn(
        `[Slack] Attempt ${attempt}/${MAX_RETRIES} network error:`,
        err instanceof Error ? err.message : err,
      );
    }

    // Exponential backoff before next attempt (skip delay after final attempt)
    if (attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * (attempt - 1) || 0; // 0ms, 2000ms, 4000ms
      if (delay > 0) {
        await sleep(delay);
      }
    }
  }

  console.error(`[Slack] All ${MAX_RETRIES} attempts failed.`);
  return {
    success: false,
    error: `Failed after ${MAX_RETRIES} attempts`,
    attempts: MAX_RETRIES,
  };
}
