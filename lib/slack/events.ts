/**
 * Slack Block Kit Message Builders
 *
 * Each function produces a rich Slack message payload for a specific event type.
 * Uses Slack Block Kit for structured, visually appealing notifications.
 */

import type { SlackPayload } from './slack';

/* ─── Type Definitions ──────────────────────────────────────── */

export interface SignupEventData {
  id: string;
  fullName: string;
  email: string;
  username?: string;
  referralCode?: string;
}

export interface PostEventData {
  id: string;
  caption?: string;
  mediaType?: 'image' | 'video';
  tags?: string[];
  user: {
    id: string;
    fullName?: string;
    username?: string;
    email?: string;
  };
}

export interface ErrorEventData {
  code: string;
  message: string;
  stack?: string;
  severity: 'critical' | 'fatal';
  context?: string;
  timestamp?: string;
}

/* ─── Helpers ───────────────────────────────────────────────── */

function formatTimestamp(date?: string | Date): string {
  const d = date ? new Date(date) : new Date();
  return d.toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Lagos', // WAT — adjust as needed
  });
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + '…';
}

/* ─── Message Builders ──────────────────────────────────────── */

/**
 * 🎉 New User Sign-Up
 */
export function buildSignupNotification(user: SignupEventData): SlackPayload {
  const fields = [
    { type: 'mrkdwn' as const, text: `*Name:*\n${user.fullName}` },
    { type: 'mrkdwn' as const, text: `*Email:*\n${user.email}` },
  ];

  if (user.username) {
    fields.push({ type: 'mrkdwn' as const, text: `*Username:*\n@${user.username}` });
  }

  if (user.referralCode) {
    fields.push({ type: 'mrkdwn' as const, text: `*Referral Code:*\n${user.referralCode}` });
  }

  fields.push({
    type: 'mrkdwn' as const,
    text: `*Signed Up:*\n${formatTimestamp()}`,
  });

  return {
    text: `🎉 New User Sign-Up: ${user.fullName} (${user.email})`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎉 New User Sign-Up',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields,
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `User ID: \`${user.id}\``,
          },
        ],
      },
      { type: 'divider' },
    ],
  };
}

/**
 * 📸 New Post Created
 */
export function buildNewPostNotification(post: PostEventData): SlackPayload {
  const user = post.user;
  const displayName = user.fullName || user.username || 'Unknown User';
  const captionPreview = post.caption
    ? truncate(post.caption, 200)
    : '_No caption_';
  const mediaEmoji = post.mediaType === 'video' ? '🎬' : '📸';

  const fields = [
    { type: 'mrkdwn' as const, text: `*Author:*\n${displayName}` },
    { type: 'mrkdwn' as const, text: `*Media Type:*\n${mediaEmoji} ${post.mediaType || 'image'}` },
  ];

  if (post.tags && post.tags.length > 0) {
    fields.push({
      type: 'mrkdwn' as const,
      text: `*Tags:*\n${post.tags.map((t) => `\`${t}\``).join(' ')}`,
    });
  }

  fields.push({
    type: 'mrkdwn' as const,
    text: `*Posted:*\n${formatTimestamp()}`,
  });

  return {
    text: `📸 New Post by ${displayName}: ${captionPreview}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${mediaEmoji} New Post Created`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Caption:*\n${captionPreview}`,
        },
      },
      {
        type: 'section',
        fields,
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Post ID: \`${post.id}\` • User ID: \`${user.id}\``,
          },
        ],
      },
      { type: 'divider' },
    ],
  };
}

/**
 * 🌟 User's First Post (Milestone)
 */
export function buildFirstPostNotification(post: PostEventData): SlackPayload {
  const user = post.user;
  const displayName = user.fullName || user.username || 'Unknown User';
  const captionPreview = post.caption
    ? truncate(post.caption, 150)
    : '_No caption_';

  return {
    text: `🌟 Milestone: ${displayName} just published their FIRST post!`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🌟 First Post Milestone!',
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${displayName}* just published their very first post! 🥳\n\n> ${captionPreview}`,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn' as const, text: `*Author:*\n${displayName}` },
          {
            type: 'mrkdwn' as const,
            text: `*Media:*\n${post.mediaType === 'video' ? '🎬 Video' : '📸 Image'}`,
          },
          { type: 'mrkdwn' as const, text: `*Time:*\n${formatTimestamp()}` },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Post ID: \`${post.id}\` • User ID: \`${user.id}\``,
          },
        ],
      },
      { type: 'divider' },
    ],
  };
}

/**
 * 🚨 Critical System Error
 */
export function buildErrorNotification(error: ErrorEventData): SlackPayload {
  const severityEmoji = error.severity === 'fatal' ? '💀' : '🚨';
  const timestamp = formatTimestamp(error.timestamp);

  // Truncate stack trace for Slack readability
  const stackSnippet = error.stack
    ? truncate(error.stack, 500)
    : '_No stack trace available_';

  const fields = [
    { type: 'mrkdwn' as const, text: `*Error Code:*\n\`${error.code}\`` },
    { type: 'mrkdwn' as const, text: `*Severity:*\n${severityEmoji} ${error.severity.toUpperCase()}` },
    { type: 'mrkdwn' as const, text: `*Timestamp:*\n${timestamp}` },
  ];

  if (error.context) {
    fields.push({
      type: 'mrkdwn' as const,
      text: `*Context:*\n${truncate(error.context, 200)}`,
    });
  }

  return {
    text: `${severityEmoji} Critical Error: [${error.code}] ${error.message}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${severityEmoji} Critical System Error`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Message:*\n${truncate(error.message, 300)}`,
        },
      },
      {
        type: 'section',
        fields,
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Stack Trace:*\n\`\`\`${stackSnippet}\`\`\``,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'LocalBuka Platform • Error Monitoring',
          },
        ],
      },
      { type: 'divider' },
    ],
  };
}
