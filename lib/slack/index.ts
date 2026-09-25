/**
 * Slack Webhook Integration
 *
 * @module lib/slack
 *
 * Public API:
 * - sendSlackNotification  — Core webhook sender (server-side)
 * - Event builders          — Block Kit message factories
 * - isDuplicate             — Dedup check
 * - reportCriticalError     — Error reporter (server-side)
 * - notifySlack             — Client-side fire-and-forget helper
 */

// Core client
export { sendSlackNotification } from './slack';
export type { SlackPayload, SlackResult, SlackBlock } from './slack';

// Event message builders
export {
  buildSignupNotification,
  buildNewPostNotification,
  buildFirstPostNotification,
  buildErrorNotification,
} from './events';
export type {
  SignupEventData,
  PostEventData,
  ErrorEventData,
} from './events';

// Deduplication
export { isDuplicate, buildEventKey, clearDedupCache, getDedupCacheSize } from './dedup';

// Error reporter
export { reportCriticalError } from './error-reporter';
export type { CriticalErrorReport } from './error-reporter';

// Client-side helper
export { notifySlack } from './slack-notify';
export type { SlackEvent } from './slack-notify';
