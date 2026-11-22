import { EmailDynamicData, EmailRenderResult } from '../types';
import { escapeHtml } from '../base-layout';

export function renderWelcomeVisualEmail(data: EmailDynamicData = {}): EmailRenderResult {
  const name = data.name ? escapeHtml(data.name.trim()) : 'Bolaji';
  const appUrl = data.appUrl || 'https://localbuka.com';
  const exploreUrl = data.exploreUrl || `${appUrl}/buka`;

  const subject = `Welcome to LocalBuka, ${name}! Good food starts here`;
  const preheader = 'Find places to eat, share your meals, and see what other food lovers are eating.';

  const preheaderSpacer = '&zwnj;&nbsp;'.repeat(100);

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(subject)}</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #EDECE8;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #EDECE8;">
  <div style="display: none; font-size: 1px; color: #EDECE8; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    ${escapeHtml(preheader)}
    ${preheaderSpacer}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#EDECE8" style="background-color: #EDECE8; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        
        <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
          
          <!-- TOP HERO FOOD BANNER -->
          <tr>
            <td style="padding: 16px 16px 0 16px; background-color: #FFFFFF;">
              <div style="position: relative; border-radius: 16px; overflow: hidden; max-height: 280px; background-color: #1A1A1A;">
                <img src="${appUrl}/images/email/template07-top-food.png" alt="Delicious Local Food" width="548" style="display: block; width: 100%; height: auto; border-radius: 14px;" />
              </div>
            </td>
          </tr>

          <!-- HEADER / WELCOME HEADLINE -->
          <tr>
            <td align="center" style="padding: 24px 24px 16px 24px; text-align: center;">
              <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.3px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                Welcome to LocalBuka, ${name}!
              </h1>
              <p style="margin: 0 0 18px 0; font-size: 13.5px; line-height: 20px; color: #4B5563; max-width: 420px; margin-left: auto; margin-right: auto; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                Find places to eat, share your meals and see what others are eating.
              </p>

              <!-- Pill Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td align="center" bgcolor="#FBBE15" style="border-radius: 20px; background-color: #FBBE15; padding: 7px 18px;">
                    <span style="font-size: 11.5px; font-weight: 800; color: #32140E; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                      Good food starts here!
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- COMMUNITY DINING PHOTO (THE COUPLE WITH DISHES) -->
          <tr>
            <td style="padding: 12px 16px; background-color: #FFFFFF;">
              <div style="border-radius: 16px; overflow: hidden; background-color: #1A1A1A;">
                <img src="${appUrl}/images/email/template07-mid-food.jpg" alt="Diners enjoying food with LocalBuka" width="548" style="display: block; width: 100%; height: auto; border-radius: 14px;" />
              </div>
            </td>
          </tr>

          <!-- NARRATIVE BODY COPY -->
          <tr>
            <td align="center" style="padding: 24px 32px 16px 32px; text-align: center;" class="mobile-padding">
              <h2 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #111827; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                Hi ${name},
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 13.5px; line-height: 22px; color: #4B5563; max-width: 480px; margin-left: auto; margin-right: auto; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                Welcome to LocalBuka! Where you find great places to eat, share where you&rsquo;ve been and see what other food lovers are talking about. Start exploring restaurants/bukas near you or share a recent meal and help someone find their next spot.
              </p>

              <p style="margin: 0 0 14px 0; font-size: 14px; font-weight: 700; color: #111827; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                Ready to find your next food spot?
              </p>

              <!-- Pill CTA Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 24px;">
                <tr>
                  <td align="center" bgcolor="#FBBE15" style="border-radius: 24px; background-color: #FBBE15;">
                    <a href="${exploreUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 13px; font-weight: 800; color: #32140E; text-decoration: none; border-radius: 24px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                      Explore LocalBuka!
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <p style="margin: 0 0 4px 0; font-size: 13.5px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                Happy discovering!
              </p>
              <p style="margin: 0; font-size: 14px; font-weight: 700; color: #111827; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                The LocalBuka Team
              </p>
            </td>
          </tr>

          <!-- VECTOR FOOTER (FROM Frame 1321315604.svg) -->
          <tr>
            <td style="padding: 0; line-height: 0; background-color: #151515;">
              <img src="${appUrl}/images/email/welcome-frame.svg" alt="LocalBuka" width="580" style="display: block; width: 100%; height: auto;" />
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `
Welcome to LocalBuka, ${name}!
Find places to eat, share your meals and see what others are eating.

Good food starts here!

Hi ${name},
Welcome to LocalBuka! Where you find great places to eat, share where you've been and see what other food lovers are talking about. Start exploring restaurants/bukas near you or share a recent meal and help someone find their next spot.

Ready to find your next food spot?
Explore LocalBuka: ${exploreUrl}

Happy discovering!
The LocalBuka Team
  `.trim();

  return {
    id: 'welcome-visual',
    title: 'Welcome Email (Visual Template 07)',
    subject,
    preheader,
    html,
    text,
    defaultData: {
      name: 'Bolaji',
      exploreUrl: 'https://localbuka.com/buka',
    },
  };
}
