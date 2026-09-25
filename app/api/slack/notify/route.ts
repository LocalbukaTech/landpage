/**
 * POST /api/slack/notify
 *
 * Internal API route that receives notification events from the frontend
 * and dispatches them to the configured Slack webhook.
 *
 * Security:
 * - Validates an internal secret header to prevent external abuse.
 *   In development, the secret check is skipped if SLACK_INTERNAL_SECRET is not set.
 *
 * Events:
 * - 'signup'     → New user sign-up notification
 * - 'new_post'   → New post created notification
 * - 'first_post' → User's first post milestone
 * - 'error'      → Critical system error
 *
 * Dedup:
 * - Returns 429 if the event is a duplicate within the TTL window.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendSlackNotification } from '@/lib/slack/slack';
import {
  buildSignupNotification,
  buildNewPostNotification,
  buildFirstPostNotification,
  buildErrorNotification,
} from '@/lib/slack/events';
import { buildEventKey, isDuplicate } from '@/lib/slack/dedup';

type SlackEventType = 'signup' | 'new_post' | 'first_post' | 'error';

const VALID_EVENTS: SlackEventType[] = ['signup', 'new_post', 'first_post', 'error'];

/**
 * Validate the internal secret header.
 * In development, if SLACK_INTERNAL_SECRET is not set, allow all requests.
 */
function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.SLACK_INTERNAL_SECRET;
  if (!secret) {
    // No secret configured — allow in development
    return true;
  }
  const provided = request.headers.get('x-internal-secret');
  return provided === secret;
}

export async function POST(request: NextRequest) {
  // Auth check
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  // Parse body
  let body: { event?: string; data?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const { event, data } = body;

  // Validate event type
  if (!event || !VALID_EVENTS.includes(event as SlackEventType)) {
    return NextResponse.json(
      { error: `Invalid event type. Expected one of: ${VALID_EVENTS.join(', ')}` },
      { status: 400 },
    );
  }

  if (!data || typeof data !== 'object') {
    return NextResponse.json(
      { error: 'Missing or invalid "data" field' },
      { status: 400 },
    );
  }

  // Build dedup key
  let dedupId: string;
  switch (event as SlackEventType) {
    case 'signup':
      dedupId = (data.id as string) || (data.email as string) || 'unknown';
      break;
    case 'new_post':
    case 'first_post':
      dedupId = (data.id as string) || 'unknown';
      break;
    case 'error':
      dedupId = `${data.code || 'UNKNOWN'}:${data.message || ''}`;
      break;
    default:
      dedupId = 'unknown';
  }

  const eventKey = buildEventKey(event, dedupId);

  // Check for duplicate
  if (isDuplicate(eventKey)) {
    return NextResponse.json(
      { status: 'duplicate', message: 'Event already processed within dedup window' },
      { status: 429 },
    );
  }

  // Build message payload
  let payload;
  try {
    switch (event as SlackEventType) {
      case 'signup':
        payload = buildSignupNotification({
          id: (data.id as string) || '',
          fullName: (data.fullName as string) || '',
          email: (data.email as string) || '',
          username: data.username as string | undefined,
          referralCode: data.referralCode as string | undefined,
        });
        break;

      case 'new_post':
        payload = buildNewPostNotification({
          id: (data.id as string) || '',
          caption: data.caption as string | undefined,
          mediaType: data.mediaType as 'image' | 'video' | undefined,
          tags: data.tags as string[] | undefined,
          user: {
            id: ((data.user as Record<string, unknown>)?.id as string) || '',
            fullName: (data.user as Record<string, unknown>)?.fullName as string | undefined,
            username: (data.user as Record<string, unknown>)?.username as string | undefined,
            email: (data.user as Record<string, unknown>)?.email as string | undefined,
          },
        });
        break;

      case 'first_post':
        payload = buildFirstPostNotification({
          id: (data.id as string) || '',
          caption: data.caption as string | undefined,
          mediaType: data.mediaType as 'image' | 'video' | undefined,
          tags: data.tags as string[] | undefined,
          user: {
            id: ((data.user as Record<string, unknown>)?.id as string) || '',
            fullName: (data.user as Record<string, unknown>)?.fullName as string | undefined,
            username: (data.user as Record<string, unknown>)?.username as string | undefined,
            email: (data.user as Record<string, unknown>)?.email as string | undefined,
          },
        });
        break;

      case 'error':
        payload = buildErrorNotification({
          code: (data.code as string) || 'UNKNOWN',
          message: (data.message as string) || 'Unknown error',
          stack: data.stack as string | undefined,
          severity: (data.severity as 'critical' | 'fatal') || 'critical',
          context: data.context as string | undefined,
          timestamp: data.timestamp as string | undefined,
        });
        break;
    }
  } catch (err) {
    console.error('[Slack API] Failed to build message payload:', err);
    return NextResponse.json(
      { error: 'Failed to build notification payload' },
      { status: 500 },
    );
  }

  // Send to Slack
  if (!payload) {
    return NextResponse.json(
      { error: 'No payload generated' },
      { status: 500 },
    );
  }

  const result = await sendSlackNotification(payload);

  if (result.success) {
    return NextResponse.json(
      { status: 'sent', attempts: result.attempts },
      { status: 200 },
    );
  }

  return NextResponse.json(
    { status: 'failed', error: result.error, attempts: result.attempts },
    { status: 500 },
  );
}
