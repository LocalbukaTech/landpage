import { escapeHtml, renderBaseEmail } from '../base-layout';

export type AdminEmailTemplateId =
  | 'support_reply'
  | 'restaurant_onboarding'
  | 'creator_community'
  | 'issue_resolved'
  | 'custom';

export interface AdminEmailTemplatePreset {
  id: AdminEmailTemplateId;
  label: string;
  description: string;
  categoryTitle: string;
  heroEyebrow: string;
  heroHeadline: string;
  defaultSubject: string;
  defaultCtaLabel: string;
  defaultCtaUrl: string;
  defaultSignOff: string;
  defaultMessage: string;
}

export const ADMIN_EMAIL_TEMPLATES: AdminEmailTemplatePreset[] = [
  {
    id: 'support_reply',
    label: 'Support Reply',
    description: 'General response to a customer inquiry or feedback',
    categoryTitle: 'SUPPORT',
    heroEyebrow: 'LOCALBUKA SUPPORT',
    heroHeadline: "WE'VE RESPONDED\nTO YOUR INQUIRY.",
    defaultSubject: 'Re: Your Inquiry - LocalBuka Support',
    defaultCtaLabel: 'EXPLORE LOCALBUKA',
    defaultCtaUrl: 'https://www.localbuka.com/buka',
    defaultSignOff: 'The LocalBuka Support Team',
    defaultMessage:
      'Thank you for reaching out to LocalBuka. We have reviewed your message and wanted to follow up with the details below.',
  },
  {
    id: 'restaurant_onboarding',
    label: 'Restaurant Partnership',
    description: 'Onboarding & partnership follow-up for buka/restaurant owners',
    categoryTitle: 'PARTNERSHIP',
    heroEyebrow: 'RESTAURANT PARTNERSHIPS',
    heroHeadline: "LET'S GET YOUR\nBUKA ON LOCALBUKA.",
    defaultSubject: 'Your Restaurant on LocalBuka - Next Steps',
    defaultCtaLabel: 'LIST YOUR RESTAURANT',
    defaultCtaUrl: 'https://www.localbuka.com/buka/my-restaurant',
    defaultSignOff: 'LocalBuka Partner Success Team',
    defaultMessage:
      'Thank you for your interest in listing your restaurant on LocalBuka! We help authentic food spots reach thousands of hungry food lovers across Africa.',
  },
  {
    id: 'creator_community',
    label: 'Creator & Community',
    description: 'Response for food creators launching or managing communities',
    categoryTitle: 'COMMUNITY',
    heroEyebrow: 'LOCALBUKA CREATORS',
    heroHeadline: 'BUILD YOUR FOOD\nCOMMUNITY WITH US.',
    defaultSubject: 'LocalBuka Creator Community Update',
    defaultCtaLabel: 'EXPLORE COMMUNITIES',
    defaultCtaUrl: 'https://www.localbuka.com/community',
    defaultSignOff: 'LocalBuka Community Team',
    defaultMessage:
      'Thank you for connecting with our Creator Community team! You can launch your food community, share recipes, and invite LocalBuka members directly from your dashboard.',
  },
  {
    id: 'issue_resolved',
    label: 'Issue Resolved',
    description: 'Confirming a customer issue or complaint has been resolved',
    categoryTitle: 'RESOLVED',
    heroEyebrow: 'REQUEST UPDATE',
    heroHeadline: 'YOUR REQUEST\nHAS BEEN RESOLVED.',
    defaultSubject: 'Your LocalBuka Request Has Been Resolved',
    defaultCtaLabel: 'OPEN LOCALBUKA',
    defaultCtaUrl: 'https://www.localbuka.com/feeds',
    defaultSignOff: 'The LocalBuka Support Team',
    defaultMessage:
      'Good news — our team has resolved the issue you reported. Please check on your end and reply anytime if you still need assistance.',
  },
  {
    id: 'custom',
    label: 'Custom Branded',
    description: 'Fully custom message arranged inside the LocalBuka layout',
    categoryTitle: 'LOCALBUKA',
    heroEyebrow: 'LOCALBUKA UPDATE',
    heroHeadline: 'HELLO FROM THE\nLOCALBUKA TEAM.',
    defaultSubject: 'A Message from LocalBuka',
    defaultCtaLabel: 'VISIT LOCALBUKA',
    defaultCtaUrl: 'https://www.localbuka.com',
    defaultSignOff: 'The LocalBuka Team',
    defaultMessage: '',
  },
];

export function getTemplatePreset(
  id: AdminEmailTemplateId
): AdminEmailTemplatePreset {
  return (
    ADMIN_EMAIL_TEMPLATES.find((t) => t.id === id) || ADMIN_EMAIL_TEMPLATES[0]
  );
}

export function getDefaultTemplateForSubject(
  subject?: string
): AdminEmailTemplateId {
  const s = (subject || '').toLowerCase();
  if (s.includes('restaurant') || s.includes('buka') || s.includes('partner')) {
    return 'restaurant_onboarding';
  }
  if (s.includes('creator') || s.includes('community')) {
    return 'creator_community';
  }
  return 'support_reply';
}

export interface AdminBrandedEmailData {
  recipientName: string;
  subject: string;
  categoryTitle: string;
  heroEyebrow: string;
  heroHeadline: string;
  greeting: string;
  replyMessage: string;
  highlightNote?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  signOff: string;
  originalMessage?: string;
  includeOriginalMessage?: boolean;
}

/**
 * Renders the exact LocalBuka customer email template (`renderBaseEmail`)
 * for instant live preview in the Admin Panel — mirrors backend MailService.sendAdminContactReply.
 */
export function renderAdminBrandedEmailHtml(
  data: AdminBrandedEmailData
): string {
  const assetBaseUrl = 'https://www.localbuka.com';
  const foodImgSrc = `${assetBaseUrl}/images/email/welcome-hero-food.png`;

  const heroHeadlineLines = (
    data.heroHeadline || "WE'VE RESPONDED\nTO YOUR INQUIRY."
  )
    .trim()
    .split(/\r?\n/)
    .map((line) => escapeHtml(line.trim()))
    .filter(Boolean)
    .join('<br />');

  const greetingText =
    data.greeting.trim() || `Hi ${data.recipientName.trim() || 'there'},`;
  const messageSource =
    data.replyMessage.trim() ||
    'Write your response in the editor and watch it automatically arrange inside the LocalBuka customer email template.';

  const replyParagraphsHtml = messageSource
    .split(/\n{2,}/)
    .map((para) => {
      const safePara = escapeHtml(para.trim()).replace(/\n/g, '<br />');
      return `<p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 23px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">${safePara}</p>`;
    })
    .join('');

  const highlightHtml = data.highlightNote?.trim()
    ? `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0 24px 0;">
        <tr>
          <td style="background-color: #FFFBEB; border-left: 4px solid #FBBE15; border-radius: 8px; padding: 14px 18px; font-size: 13.5px; line-height: 21px; color: #1F2937; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
            ${escapeHtml(data.highlightNote.trim()).replace(/\n/g, '<br />')}
          </td>
        </tr>
      </table>
    `
    : '';

  const safeCtaUrl =
    data.ctaUrl?.trim() && /^https?:\/\//i.test(data.ctaUrl.trim())
      ? data.ctaUrl.trim()
      : data.ctaUrl?.trim()?.startsWith('/')
        ? `${assetBaseUrl}${data.ctaUrl.trim()}`
        : '';

  const ctaHtml =
    data.ctaLabel?.trim() && safeCtaUrl
      ? `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 8px 0 28px 0;">
          <tr>
            <td>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="mobile-btn">
                <tr>
                  <td align="center" bgcolor="#FBBE15" style="border-radius: 8px; background-color: #FBBE15; background-image: linear-gradient(#FBBE15, #FBBE15);">
                    <a href="${escapeHtml(safeCtaUrl)}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; color: #0A182F; text-transform: uppercase; text-decoration: none; border-radius: 8px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                      ${escapeHtml(data.ctaLabel.trim())}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `
      : '';

  const originalQuoteHtml =
    data.includeOriginalMessage !== false && data.originalMessage?.trim()
      ? `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 12px 0 24px 0;">
          <tr>
            <td style="background-color: #F9FAFB; border-left: 3px solid #D1D5DB; border-radius: 6px; padding: 12px 16px; font-size: 12.5px; line-height: 20px; color: #6B7280; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
              <strong style="color: #374151; display: block; margin-bottom: 4px;">Your original message:</strong>
              <span style="white-space: pre-wrap;">${escapeHtml(data.originalMessage.trim())}</span>
            </td>
          </tr>
        </table>
      `
      : '';

  const heroContent = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td valign="middle" style="font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
          <p class="hero-sub dark-text-yellow" style="margin: 0 0 10px 0; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #FBBE15 !important; -webkit-text-fill-color: #FBBE15 !important; text-transform: uppercase; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
            ${escapeHtml((data.heroEyebrow || 'LOCALBUKA SUPPORT').toUpperCase())}
          </p>
          <h1 class="hero-h1 dark-text-white" style="margin: 0; font-size: 24px; line-height: 32px; font-weight: 800; color: #FFFFFE !important; -webkit-text-fill-color: #FFFFFE !important; text-transform: uppercase; letter-spacing: -0.5px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
            ${heroHeadlineLines}
          </h1>
        </td>
        <td class="hero-circle-td" align="right" valign="middle" width="140" style="width: 140px; padding-left: 8px;">
          <div class="hero-food-wrap" style="width: 124px; height: 124px; border-radius: 62px; overflow: hidden; border: 3px solid rgba(251, 190, 21, 0.4); box-shadow: 0 8px 24px rgba(0,0,0,0.35); background-color: #0F2342; margin-left: auto;">
            <img class="hero-food-img" src="${foodImgSrc}" alt="LocalBuka" width="124" height="124" style="display: block; width: 124px; height: 124px; object-fit: cover; border-radius: 50%;" />
          </div>
        </td>
      </tr>
    </table>
  `;

  const bodyContent = `
    <h2 style="margin: 0 0 14px 0; font-size: 20px; font-weight: 700; color: #0A182F; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      ${escapeHtml(greetingText)}
    </h2>
    ${replyParagraphsHtml}
    ${highlightHtml}
    ${ctaHtml}
    ${originalQuoteHtml}
    <p style="margin: 0 0 6px 0; font-size: 14.5px; line-height: 22px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      Warm regards,
    </p>
    <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0A182F; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      ${escapeHtml(data.signOff.trim() || 'The LocalBuka Team')}
    </p>
  `;

  return renderBaseEmail({
    categoryTitle: (data.categoryTitle || 'SUPPORT').toUpperCase(),
    subject: data.subject || 'LocalBuka Support',
    preheader: messageSource.slice(0, 140),
    heroContent,
    bodyContent,
    data: { appUrl: assetBaseUrl },
  });
}
