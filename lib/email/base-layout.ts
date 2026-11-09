import { EmailDynamicData } from './types';

export interface BaseEmailOptions {
  categoryTitle: string; // e.g. "WELCOME", "EXPLORE", "YOUR REWARD"
  subject: string;
  preheader: string;
  heroContent: string;
  bodyContent: string;
  polygonLeftSrc?: string;
  polygonRightSrc?: string;
  data?: EmailDynamicData;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderBaseEmail({
  categoryTitle,
  subject,
  preheader,
  heroContent,
  bodyContent,
  polygonLeftSrc: _polygonLeftSrc,
  polygonRightSrc: _polygonRightSrc,
  data = {},
}: BaseEmailOptions): string {
  const assetBaseUrl = 'https://www.localbuka.com';
  const year = data.year || new Date().getFullYear();
  const appUrl = data.appUrl || 'https://www.localbuka.com';
  const unsubscribeUrl = data.unsubscribeUrl || `${appUrl}/settings/notifications`;
  const preferencesUrl = data.preferencesUrl || `${appUrl}/settings`;

  // Hidden preheader hack with invisible characters to prevent email clients from pulling body text
  const preheaderSpacer = '&zwnj;&nbsp;'.repeat(100);

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>${escapeHtml(subject)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background-color: #EDECE8;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1F2937;
    }
    
    a { color: #FBBE15; text-decoration: none; }
    a:hover { text-decoration: underline; }

    .header-pad { padding: 14px 24px; }
    .header-logo { width: 32px; height: 32px; margin-right: 10px; }
    .header-title { font-size: 24px; line-height: 32px; }
    .header-reward { font-size: 14px; line-height: 20px; }
    .zigzag-col-left { width: 36px !important; min-width: 36px !important; max-width: 36px !important; background-position: left top !important; background-size: 36px 86px !important; }
    .zigzag-col-right { width: 36px !important; min-width: 36px !important; max-width: 36px !important; background-position: right top !important; background-size: 36px 86px !important; }
    .hero-pad { padding: 36px 14px; }
    .hero-food-wrap { width: 124px; height: 124px; border-radius: 62px; }
    .hero-food-img { width: 124px; height: 124px; }
    .hero-circle { width: 124px; height: 124px; border-radius: 62px; }
    .hero-circle-num { font-size: 32px; line-height: 36px; }
    .hero-circle-lbl { font-size: 11px; line-height: 14px; }
    .hero-h1 { font-size: 24px; line-height: 32px; }
    .hero-sub { font-size: 11px; line-height: 15px; }
    
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; min-width: 100% !important; }
      .header-pad { padding: 14px 18px !important; }
      .header-logo { width: 26px !important; height: 26px !important; margin-right: 8px !important; }
      .header-title { font-size: 19px !important; line-height: 24px !important; }
      .header-reward { font-size: 11px !important; line-height: 16px !important; text-align: right !important; white-space: nowrap !important; }
      .zigzag-col-left { width: 36px !important; min-width: 36px !important; max-width: 36px !important; background-position: left top !important; background-size: 36px 86px !important; }
      .zigzag-col-right { width: 36px !important; min-width: 36px !important; max-width: 36px !important; background-position: right top !important; background-size: 36px 86px !important; }
      .hero-pad { padding: 24px 0 24px 10px !important; }
      .hero-sub { font-size: 11px !important; line-height: 15px !important; margin-bottom: 8px !important; }
      .hero-h1 { font-size: 16px !important; line-height: 22px !important; font-weight: 800 !important; }
      .hero-circle-td { width: 106px !important; padding-left: 4px !important; }
      .hero-food-wrap { width: 98px !important; height: 98px !important; border-radius: 49px !important; }
      .hero-food-img { width: 98px !important; height: 98px !important; }
      .hero-circle { width: 98px !important; height: 98px !important; border-radius: 49px !important; }
      .hero-circle-num { font-size: 26px !important; line-height: 28px !important; }
      .hero-circle-lbl { font-size: 10px !important; line-height: 12px !important; }
      .body-pad { padding: 32px 14px 28px 14px !important; }
      .mobile-padding { padding-left: 14px !important; padding-right: 14px !important; }
      .mobile-btn { width: 100% !important; display: block !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #EDECE8;">
  <!-- Hidden Preheader -->
  <div style="display: none; font-size: 1px; color: #EDECE8; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    ${escapeHtml(preheader)}
    ${preheaderSpacer}
  </div>

  <!-- Background Outer Table -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#EDECE8" style="background-color: #EDECE8; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        
        <!-- Main Card Container (Max 600px) -->
        <!--[if (gte mso 9)|(IE)]>
        <table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0">
        <tr>
        <td>
        <![endif]-->
        <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07); border: 1px solid #E5E7EB;">
          
          <!-- ─── TOP BAR ─── -->
          <tr>
            <td bgcolor="#17191C" style="background-color: #17191C; background-image: linear-gradient(#17191C, #17191C); padding: 10px 16px; text-align: center;">
              <span style="font-size: 10.5px; font-weight: 700; letter-spacing: 1.5px; color: #FFFFFF; text-transform: uppercase; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                YOUR FOOD DISCOVERY PLATFORM
              </span>
            </td>
          </tr>

          <!-- ─── BRAND HEADER BAR ─── -->
          <tr>
            <td class="header-pad" bgcolor="#FFFFFF" style="background-color: #FFFFFF; padding: 14px 24px; border-bottom: 1px solid #FBF3DC;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100% !important; min-width: 100% !important;">
                <tr>
                  <td align="left" valign="middle" style="white-space: nowrap; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                    <a href="${appUrl}" target="_blank" style="text-decoration: none; color: inherit;">
                      <img class="header-logo" src="${assetBaseUrl}/images/localbuka-pot-logo.png" alt="LocalBuka" width="32" height="32" style="display: inline-block; vertical-align: middle; margin-right: 10px; width: 32px; height: 32px;" />
                      <span class="header-title" style="font-size: 24px; line-height: 32px; font-weight: 700; color: #111111; vertical-align: middle; letter-spacing: -0.3px;">LocalBuka</span>
                    </a>
                  </td>
                  <td class="header-reward" align="right" valign="middle" style="font-size: 14px; line-height: 20px; font-weight: 700; color: #757575; text-transform: uppercase; text-align: right; white-space: nowrap; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                    ${escapeHtml(categoryTitle)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── HERO SECTION ─── -->
          <tr>
            <td bgcolor="#0A182F" style="background-color: #0A182F; background-image: linear-gradient(#0A182F, #0A182F); padding: 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; width: 100%;">
                <tr>
                  <td class="zigzag-col-left" width="36" background="${assetBaseUrl}/images/email/zigzag-left.png" bgcolor="#0A182F" style="width: 36px; min-width: 36px; max-width: 36px; background-color: #0A182F; background-image: url('${assetBaseUrl}/images/email/zigzag-left.png'); background-repeat: repeat-y; background-position: left top; background-size: 36px 86px; font-size: 1px; line-height: 1px;">&nbsp;</td>
                  <td class="hero-pad" valign="middle" style="padding: 36px 14px;">
                    ${heroContent}
                  </td>
                  <td class="zigzag-col-right" width="36" align="right" background="${assetBaseUrl}/images/email/zigzag-right.png" bgcolor="#0A182F" style="width: 36px; min-width: 36px; max-width: 36px; background-color: #0A182F; background-image: url('${assetBaseUrl}/images/email/zigzag-right.png'); background-repeat: repeat-y; background-position: right top; background-size: 36px 86px; font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── BODY CONTENT SECTION with zigzag edges ─── -->
          <tr>
            <td bgcolor="#FFFFFF" style="background-color: #FFFFFF; padding: 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; width: 100%;">
                <tr>
                  <!-- Left zigzag edge stripe -->
                  <td class="zigzag-col-left" width="36" background="${assetBaseUrl}/images/email/zigzag-left.png" bgcolor="#FFFFFF" style="width: 36px; min-width: 36px; max-width: 36px; background-color: #FFFFFF; background-image: url('${assetBaseUrl}/images/email/zigzag-left.png'); background-repeat: repeat-y; background-position: left top; background-size: 36px 86px; font-size: 1px; line-height: 1px;">&nbsp;</td>
                  <!-- Main body content -->
                  <td class="body-pad" style="padding: 40px 18px; vertical-align: top; background-color: #FFFFFF;">
                    ${bodyContent}
                  </td>
                  <!-- Right zigzag edge stripe -->
                  <td class="zigzag-col-right" width="36" align="right" background="${assetBaseUrl}/images/email/zigzag-right.png" bgcolor="#FFFFFF" style="width: 36px; min-width: 36px; max-width: 36px; background-color: #FFFFFF; background-image: url('${assetBaseUrl}/images/email/zigzag-right.png'); background-repeat: repeat-y; background-position: right top; background-size: 36px 86px; font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── FOOTER SECTION ─── -->
          <tr>
            <td bgcolor="#00071A" style="background-color: #00071A; background-image: linear-gradient(#00071A, #00071A); padding: 36px 28px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                
                <!-- Social Media Icons (36x36 Circles with White PNG Icons) -->
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <!-- Twitter / X -->
                        <td style="padding: 0 7px;">
                          <a href="https://x.com/LocalBuka_app" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="${assetBaseUrl}/images/email/icons/social-twitter.png" alt="Twitter" width="36" height="36" style="display: block; width: 36px; height: 36px; border: 0; border-radius: 50%;" />
                          </a>
                        </td>

                        <!-- Instagram -->
                        <td style="padding: 0 7px;">
                          <a href="https://www.instagram.com/localbuka_app" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="${assetBaseUrl}/images/email/icons/social-instagram.png" alt="Instagram" width="36" height="36" style="display: block; width: 36px; height: 36px; border: 0; border-radius: 50%;" />
                          </a>
                        </td>

                        <!-- YouTube -->
                        <td style="padding: 0 7px;">
                          <a href="https://www.youtube.com/@LocalBuka__App" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="${assetBaseUrl}/images/email/icons/social-youtube.png" alt="YouTube" width="36" height="36" style="display: block; width: 36px; height: 36px; border: 0; border-radius: 50%;" />
                          </a>
                        </td>

                        <!-- Facebook -->
                        <td style="padding: 0 7px;">
                          <a href="https://web.facebook.com/people/Local-Buka/61569877310017/" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="${assetBaseUrl}/images/email/icons/social-facebook.png" alt="Facebook" width="36" height="36" style="display: block; width: 36px; height: 36px; border: 0; border-radius: 50%;" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Notice text -->
                <tr>
                  <td align="center" style="padding-bottom: 14px;">
                    <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9CA3AF; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                      You are receiving this email because you signed up for LocalBuka.
                    </p>
                  </td>
                </tr>

                <!-- Unsubscribe & Preferences -->
                <tr>
                  <td align="center" style="padding-bottom: 18px;">
                    <p style="margin: 0; font-size: 12px; line-height: 18px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                      <a href="${unsubscribeUrl}" target="_blank" style="color: #FBBE15; font-weight: 500; text-decoration: none;">Unsubscribe</a>
                      <span style="color: #4B5563; padding: 0 6px;">·</span>
                      <a href="${preferencesUrl}" target="_blank" style="color: #FBBE15; font-weight: 500; text-decoration: none;">Manage preferences</a>
                    </p>
                  </td>
                </tr>

                <!-- Copyright -->
                <tr>
                  <td align="center">
                    <p style="margin: 0; font-size: 11px; line-height: 16px; color: #6B7280; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                      &copy; ${year} LocalBuka &middot; All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->

      </td>
    </tr>
  </table>
</body>
</html>`;
}
