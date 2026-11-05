import { EmailDynamicData, EmailRenderResult } from '../types';
import { escapeHtml, renderBaseEmail } from '../base-layout';

export function renderWelcomeEmail(data: EmailDynamicData = {}): EmailRenderResult {
  const name = data.name ? escapeHtml(data.name.trim()) : 'Food Lover';
  const appUrl = data.appUrl || 'https://localbuka.com';
  const exploreUrl = data.exploreUrl || `${appUrl}/buka`;

  const subject = "Welcome to LocalBuka! There's more to food than your usual spot";
  const preheader = 'Ever found yourself wondering where to eat, what to try, or which restaurant is worth visiting?';

  const heroContent = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <!-- Left Hero Copy -->
        <td valign="middle" class="mobile-stack" style="padding-right: 16px;">
          <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #FBBE15; text-transform: uppercase; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
            WELCOME TO LOCALBUKA
          </p>
          <h1 style="margin: 0; font-size: 26px; line-height: 32px; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: -0.5px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
            THERE&rsquo;S MORE<br />
            TO FOOD THAN<br />
            YOUR USUAL<br />
            SPOT.
          </h1>
        </td>
        <!-- Right Hero Food Circle -->
        <td align="right" valign="middle" class="mobile-stack" style="width: 140px;">
          <div class="hero-image-wrap" style="width: 130px; height: 130px; border-radius: 50%; overflow: hidden; border: 3px solid rgba(251, 190, 21, 0.4); box-shadow: 0 8px 24px rgba(0,0,0,0.35); background-color: #0F2342; margin-left: auto;">
            <img src="${appUrl}/images/email/welcome-hero-food.png" alt="Delicious Food Platter" width="130" height="130" style="display: block; width: 130px; height: 130px; object-fit: cover; border-radius: 50%;" />
          </div>
        </td>
      </tr>
    </table>
  `;

  const bodyContent = `
    <!-- Greeting -->
    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #0A182F; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      Hi ${name},
    </h2>

    <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #111827; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      Welcome to LocalBuka!
    </p>

    <!-- Paragraphs -->
    <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 23px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      Ever found yourself wondering where to eat, what to try, or which restaurant is worth visiting? We&rsquo;ve all been there.
    </p>

    <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 23px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      That&rsquo;s where LocalBuka comes in.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 14.5px; line-height: 23px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      Explore restaurants and food spots, discover places other people are talking about, and find inspiration for your next meal. And when you find a place you love, share your experience. Your recommendation could help someone else discover their next favourite spot.
    </p>

    <!-- CTA Section -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
      <tr>
        <td>
          <p style="margin: 0 0 14px 0; font-size: 15px; font-weight: 700; color: #111827; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
            Ready to find somewhere worth trying?
          </p>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="mobile-btn">
            <tr>
              <td align="center" bgcolor="#FBBE15" style="border-radius: 8px; background-color: #FBBE15;">
                <a href="${exploreUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; color: #0A182F; text-transform: uppercase; text-decoration: none; border-radius: 8px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  EXPLORE FOOD SPOTS
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Sign-off -->
    <p style="margin: 0 0 6px 0; font-size: 14.5px; line-height: 22px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      Here&rsquo;s to good food and great discoveries!
    </p>
    <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0A182F; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      The LocalBuka Team
    </p>
  `;

  const html = renderBaseEmail({
    categoryTitle: 'WELCOME',
    subject,
    preheader,
    heroContent,
    bodyContent,
    data,
  });

  const text = `
YOUR FOOD DISCOVERY PLATFORM
LocalBuka - WELCOME

WELCOME TO LOCALBUKA
THERE'S MORE TO FOOD THAN YOUR USUAL SPOT.

Hi ${name},

Welcome to LocalBuka!

Ever found yourself wondering where to eat, what to try, or which restaurant is worth visiting? We've all been there.

That's where LocalBuka comes in.

Explore restaurants and food spots, discover places other people are talking about, and find inspiration for your next meal. And when you find a place you love, share your experience. Your recommendation could help someone else discover their next favourite spot.

Ready to find somewhere worth trying?
Explore Food Spots: ${exploreUrl}

Here's to good food and great discoveries!
The LocalBuka Team

---
You are receiving this email because you signed up for LocalBuka.
Unsubscribe: ${data.unsubscribeUrl || `${appUrl}/settings/notifications`}
Manage preferences: ${data.preferencesUrl || `${appUrl}/settings`}
© ${data.year || new Date().getFullYear()} LocalBuka. All rights reserved.
  `.trim();

  return {
    id: 'welcome',
    title: 'Welcome Email (Template 01)',
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
