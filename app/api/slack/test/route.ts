/**
 * POST /api/slack/test
 *
 * Admin test endpoint to verify the Slack webhook is configured correctly.
 * Sends a test message to the configured Slack channel.
 *
 * Protected by the same SLACK_INTERNAL_SECRET header as the notify endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendSlackNotification } from '@/lib/slack/slack';

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.SLACK_INTERNAL_SECRET;
  if (!secret) return true; // Allow in dev
  const provided = request.headers.get('x-internal-secret');
  return provided === secret;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await sendSlackNotification({
    text: '✅ LocalBuka Slack webhook test — connection successful!',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '✅ Webhook Test Successful',
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'The Slack webhook integration is configured correctly and working.\n\n*Events monitored:*\n• 🎉 New user sign-ups\n• 📸 New posts created\n• 🌟 First post milestones\n• 🚨 Critical system errors',
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Tested at: ${new Date().toISOString()} • LocalBuka Platform`,
          },
        ],
      },
      { type: 'divider' },
    ],
  });

  if (result.success) {
    return NextResponse.json(
      { status: 'ok', message: 'Test notification sent successfully' },
      { status: 200 },
    );
  }

  return NextResponse.json(
    { status: 'failed', error: result.error },
    { status: 500 },
  );
}
