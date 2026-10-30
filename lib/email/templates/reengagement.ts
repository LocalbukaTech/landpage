import { EmailDynamicData, EmailRenderResult } from '../types';
import { escapeHtml, renderBaseEmail } from '../base-layout';

export function renderReengagementEmail(data: EmailDynamicData = {}): EmailRenderResult {
  const name = data.name ? escapeHtml(data.name.trim()) : 'Food Lover';
  const appUrl = data.appUrl || 'https://localbuka.com';
  const exploreUrl = data.exploreUrl || `${appUrl}/buka`;

  const subject = 'Your next favourite spot could still be out there';
  const preheader = 'Ready to explore again? Find inspiration for your next meal on LocalBuka.';

  const heroContent = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <!-- Left Hero Copy -->
        <td valign="middle" class="mobile-stack" style="padding-right: 16px;">
          <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #FBBE15; text-transform: uppercase; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
            WELCOME TO LOCALBUKA
          </p>
          <h1 style="margin: 0; font-size: 26px; line-height: 32px; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: -0.5px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
            YOUR NEXT<br />
            FAVOURITE<br />
            SPOT COULD<br />
            STILL BE OUT<br />
            THERE.
          </h1>
        </td>
        <!-- Right Hero Food Circle -->
        <td align="right" valign="middle" class="mobile-stack" style="width: 140px;">
          <div class="hero-image-wrap" style="width: 130px; height: 130px; border-radius: 50%; overflow: hidden; border: 3px solid rgba(251, 190, 21, 0.4); box-shadow: 0 8px 24px rgba(0,0,0,0.35); background-color: #0F2342; margin-left: auto;">
            <img src="${appUrl}/images/email/reengage-hero-food.png" alt="Discover Top Restaurants" width="130" height="130" style="display: block; width: 130px; height: 130px; object-fit: cover; border-radius: 50%;" />
          </div>
        </td>
      </tr>
    </table>
  `;

  const bodyContent = `
    <!-- Greeting -->
    <h2 style="margin: 0 0 18px 0; font-size: 20px; font-weight: 700; color: #0A182F; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      Hi ${name},
    </h2>

    <!-- Paragraphs -->
    <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 23px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      It&rsquo;s easy to stick to the restaurants you already know. But sometimes, the best food experiences begin when you try somewhere different.
    </p>

    <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 23px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      Whether you&rsquo;re planning lunch, meeting friends, or simply craving something new, LocalBuka can help you explore your options.
    </p>

    <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 23px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      Take a moment to browse food spots, discover restaurants, and find inspiration for wherever your appetite takes you next.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 14.5px; line-height: 23px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      You never know. Your next favourite place to eat could be one discovery away.
    </p>

    <!-- CTA Section -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
      <tr>
        <td>
          <p style="margin: 0 0 14px 0; font-size: 15px; font-weight: 700; color: #111827; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
            Ready to explore again?
          </p>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="mobile-btn">
            <tr>
              <td align="center" bgcolor="#FBBE15" style="border-radius: 8px; background-color: #FBBE15;">
                <a href="${exploreUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; color: #0A182F; text-transform: uppercase; text-decoration: none; border-radius: 8px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  DISCOVER YOUR NEXT SPOT
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Sign-off -->
    <p style="margin: 0 0 6px 0; font-size: 14.5px; line-height: 22px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      Let&rsquo;s get you back to discovering great food!
    </p>
    <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0A182F; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      The LocalBuka Team
    </p>
  `;

  const html = renderBaseEmail({
    categoryTitle: 'EXPLORE',
    subject,
    preheader,
    heroContent,
    bodyContent,
    data,
  });

  const text = `
YOUR FOOD DISCOVERY PLATFORM
LocalBuka - EXPLORE

WELCOME TO LOCALBUKA
YOUR NEXT FAVOURITE SPOT COULD STILL BE OUT THERE.

Hi ${name},

It's easy to stick to the restaurants you already know. But sometimes, the best food experiences begin when you try somewhere different.

Whether you're planning lunch, meeting friends, or simply craving something new, LocalBuka can help you explore your options.

Take a moment to browse food spots, discover restaurants, and find inspiration for wherever your appetite takes you next.

You never know. Your next favourite place to eat could be one discovery away.

Ready to explore again?
Discover Your Next Spot: ${exploreUrl}

Let's get you back to discovering great food!
The LocalBuka Team

---
You are receiving this email because you signed up for LocalBuka.
Unsubscribe: ${data.unsubscribeUrl || `${appUrl}/settings/notifications`}
Manage preferences: ${data.preferencesUrl || `${appUrl}/settings`}
© ${data.year || new Date().getFullYear()} LocalBuka. All rights reserved.
  `.trim();

  return {
    id: 'reengagement',
    title: 'Re-engagement Email (Template 02)',
    subject,
    preheader,
    html,
    text,
    defaultData: {
      name: 'Wilson',
      exploreUrl: 'https://localbuka.com/buka',
    },
  };
}
