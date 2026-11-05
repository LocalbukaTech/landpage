import { EmailDynamicData, EmailRenderResult } from './types';
import { renderWelcomeEmail } from './templates/welcome';
import { renderReengagementEmail } from './templates/reengagement';
import { renderReferralRewardsEmail } from './templates/referral-reward';
import { renderWelcomeVisualEmail } from './templates/welcome-visual';

export * from './types';
export * from './base-layout';
export { renderWelcomeEmail } from './templates/welcome';
export { renderReengagementEmail } from './templates/reengagement';
export { renderReferralRewardsEmail } from './templates/referral-reward';
export { renderWelcomeVisualEmail } from './templates/welcome-visual';

export function getAllEmailTemplates(customData: EmailDynamicData = {}): EmailRenderResult[] {
  return [
    renderWelcomeEmail(customData),
    renderReengagementEmail(customData),
    renderReferralRewardsEmail({ ...customData, variant: 'referrer' }),
    renderReferralRewardsEmail({ ...customData, variant: 'referee' }),
    renderWelcomeVisualEmail(customData),
  ];
}
