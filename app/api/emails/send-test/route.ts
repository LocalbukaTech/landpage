import { NextRequest, NextResponse } from 'next/server';

const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'LocalBuka <noreply@localbuka.com>';
const RAILWAY_API = process.env.NEXT_PUBLIC_API_URL || 'https://servernew-production.up.railway.app';
const CRON_SECRET = process.env.CRON_SECRET || 'localbuka_cron_secret_2026';

function buildReferee25PointsHtml(recipientName = 'Wilson', referrerName = 'Tunde Bakare', pointsEarned = 25, currentBalance = 25): string {
  const assetBaseUrl = 'https://www.localbuka.com';
  const appUrl = 'https://www.localbuka.com';
  const exploreUrl = `${appUrl}/buka`;
  const unsubscribeUrl = `${appUrl}/settings/notifications`;
  const preferencesUrl = `${appUrl}/settings`;
  const year = new Date().getFullYear();
  const subject = `A little reward for joining us: +${pointsEarned} points inside!`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>${subject}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #B0BAC3; font-family: 'Plus Jakarta Sans', Arial, sans-serif; }
    .email-container { width: 100% !important; max-width: 600px !important; }
    .zigzag-col-left { width: 36px !important; min-width: 36px !important; max-width: 36px !important; background-position: left top !important; background-size: 36px 86px !important; }
    .zigzag-col-right { width: 36px !important; min-width: 36px !important; max-width: 36px !important; background-position: right top !important; background-size: 36px 86px !important; }
    @media only screen and (max-width: 600px) {
      .outer-pad { padding: 20px 14px !important; }
      .email-container { width: 100% !important; max-width: 100% !important; min-width: 100% !important; }
      .hide-mobile { display: none !important; max-height: 0 !important; overflow: hidden !important; mso-hide: all !important; font-size: 0 !important; line-height: 0 !important; }
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
      .hero-circle { width: 98px !important; height: 98px !important; border-radius: 49px !important; }
      .hero-circle-num { font-size: 27px !important; line-height: 30px !important; }
      .hero-circle-lbl { font-size: 10px !important; line-height: 12px !important; }
      .body-pad { padding: 32px 14px 28px 14px !important; }
      .body-h2 { font-size: 20px !important; line-height: 26px !important; margin-bottom: 14px !important; }
      .body-lead { font-size: 15px !important; line-height: 21px !important; margin-bottom: 14px !important; }
      .body-p { font-size: 13px !important; line-height: 19px !important; margin-bottom: 16px !important; }
      .points-box-pad { padding: 16px 14px !important; }
      .points-lbl { font-size: 13px !important; line-height: 18px !important; padding-top: 12px !important; padding-bottom: 12px !important; }
      .points-val { font-size: 13px !important; line-height: 18px !important; padding-top: 12px !important; padding-bottom: 12px !important; white-space: nowrap !important; }
      .btn-wrap { margin-bottom: 26px !important; }
      .btn-link { padding: 16px 14px !important; font-size: 13px !important; line-height: 16px !important; }
      .body-close { font-size: 13px !important; line-height: 19px !important; margin-bottom: 4px !important; }
      .body-team { font-size: 13px !important; line-height: 19px !important; }
      .footer-pad { padding: 28px 16px 24px 16px !important; }
    }
  </style>
</head>
<body id="body" style="margin: 0; padding: 0; background-color: #B0BAC3; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#B0BAC3" style="background-color: #B0BAC3;">
    <tr>
      <td class="outer-pad" align="center" style="padding: 24px 12px;">
        <!--[if (gte mso 9)|(IE)]>
        <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr><td>
        <![endif]-->
        <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 0; overflow: hidden;">

          <!-- Top bar (desktop only) -->
          <tr class="hide-mobile">
            <td align="center" bgcolor="#222222" style="background-color: #222222; padding: 18px 16px; font-size: 12px; line-height: 16px; font-weight: 600; color: #FFFFFF; text-transform: uppercase; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
              Your food discovery platform
            </td>
          </tr>

          <!-- Brand header -->
          <tr>
            <td class="header-pad" bgcolor="#FFFFFF" style="background-color: #FFFFFF; padding: 14px 24px; border-bottom: 1px solid #FBF3DC;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100% !important; min-width: 100% !important;">
                <tr>
                  <td align="left" valign="middle" style="white-space: nowrap; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                    <img class="header-logo" src="${assetBaseUrl}/images/localbuka-pot-logo.png" alt="" width="32" height="32" style="display: inline-block; vertical-align: middle; margin-right: 10px; width: 32px; height: 32px;" />
                    <span class="header-title" style="font-size: 24px; line-height: 32px; font-weight: 700; color: #111111; vertical-align: middle; letter-spacing: -0.3px;">LocalBuka</span>
                  </td>
                  <td class="header-reward" align="right" valign="middle" style="font-size: 14px; line-height: 20px; font-weight: 700; color: #757575; text-transform: uppercase; text-align: right; white-space: nowrap; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                    Your reward
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero: solid navy with zigzag chevrons down both edges -->
          <tr>
            <td bgcolor="#0A243F" style="background-color: #0A243F;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; width: 100%;">
                <tr>
                  <td class="zigzag-col-left" width="36" background="${assetBaseUrl}/images/email/zigzag-left.png" bgcolor="#0A243F" style="width: 36px; min-width: 36px; max-width: 36px; background-color: #0A243F; background-image: url('${assetBaseUrl}/images/email/zigzag-left.png'); background-repeat: repeat-y; background-position: left top; background-size: 36px 86px; font-size: 1px; line-height: 1px;">&nbsp;</td>
                  <td class="hero-pad" valign="middle" style="padding: 40px 0 40px 17px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td valign="middle" style="font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                          <div class="hero-sub" style="font-size: 14px; line-height: 20px; font-weight: 600; color: #F1BE47; text-transform: uppercase; margin-bottom: 14px;">Referral reward</div>
                          <h1 class="hero-h1" style="margin: 0; font-size: 24px; line-height: 35px; font-weight: 700; color: #FFFFFF; text-transform: uppercase;">A little<br />reward for<br />joining us.</h1>
                        </td>
                        <td class="hero-circle-td" align="right" valign="middle" width="152" style="width: 152px; padding-left: 8px;">
                          <table role="presentation" class="hero-circle" border="0" cellpadding="0" cellspacing="0" width="144" height="144" bgcolor="#F1BE47" style="width: 144px; height: 144px; background-color: #F1BE47; border-radius: 72px;">
                            <tr>
                              <td align="center" valign="middle" style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #041727;">
                                <div class="hero-circle-num" style="font-size: 40px; line-height: 44px; font-weight: 800;">+${pointsEarned}</div>
                                <div class="hero-circle-lbl" style="font-size: 12px; line-height: 16px; font-weight: 700; text-transform: uppercase;">Points</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td class="zigzag-col-right" width="36" align="right" background="${assetBaseUrl}/images/email/zigzag-right.png" bgcolor="#0A243F" style="width: 36px; min-width: 36px; max-width: 36px; background-color: #0A243F; background-image: url('${assetBaseUrl}/images/email/zigzag-right.png'); background-repeat: repeat-y; background-position: right top; background-size: 36px 86px; font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body: white with pale-yellow zigzag edges -->
          <tr>
            <td bgcolor="#FFFFFF" style="background-color: #FFFFFF;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; width: 100%;">
                <tr>
                  <td class="zigzag-col-left" width="36" background="${assetBaseUrl}/images/email/zigzag-left.png" bgcolor="#FFFFFF" style="width: 36px; min-width: 36px; max-width: 36px; background-color: #FFFFFF; background-image: url('${assetBaseUrl}/images/email/zigzag-left.png'); background-repeat: repeat-y; background-position: left top; background-size: 36px 86px; font-size: 1px; line-height: 1px;">&nbsp;</td>
                  <td class="body-pad" valign="top" style="padding: 70px 17px 46px 17px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">

                    <h2 class="body-h2" style="margin: 0 0 22px 0; font-size: 25px; line-height: 30px; font-weight: 700; color: #041727;">Hi ${recipientName},</h2>

                    <p class="body-lead" style="margin: 0 0 22px 0; font-size: 17px; line-height: 24px; font-weight: 700; color: #222222;">We&rsquo;re glad you&rsquo;re here!</p>

                    <p class="body-p" style="margin: 0 0 24px 0; font-size: 17px; line-height: 24px; font-weight: 400; color: #5C5C5C;">
                      You joined LocalBuka using <strong>${referrerName}</strong>&rsquo;s referral code, and your ${pointsEarned} referral points have been credited to your account.
                    </p>

                    <!-- Points box -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FEF9E9" style="background-color: #FEF9E9; border: 1px solid #FBE9B8; border-radius: 12px;">
                      <tr>
                        <td class="points-box-pad" style="padding: 24px 24px;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td class="points-lbl" align="left" style="padding-bottom: 17px; font-size: 17px; line-height: 23px; color: #5C5C5C; border-bottom: 1px solid #FBE9B8;">Points earned</td>
                              <td class="points-val" align="right" style="padding-bottom: 17px; font-size: 17px; line-height: 23px; font-weight: 700; color: #222222; border-bottom: 1px solid #FBE9B8; white-space: nowrap;">+${pointsEarned} points</td>
                            </tr>
                            <tr>
                              <td class="points-lbl" align="left" style="padding-top: 17px; font-size: 17px; line-height: 23px; color: #5C5C5C;">Your current balance</td>
                              <td class="points-val" align="right" style="padding-top: 17px; font-size: 17px; line-height: 23px; font-weight: 700; color: #222222; white-space: nowrap;">${currentBalance} points</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <p class="body-p" style="margin: 28px 0 24px 0; font-size: 17px; line-height: 24px; color: #5C5C5C;">Now it&rsquo;s time to discover what awaits you.</p>

                    <p class="body-p" style="margin: 0 0 24px 0; font-size: 17px; line-height: 24px; color: #5C5C5C;">
                      Looking for a restaurant to try? Need inspiration for your next outing? Explore food spots on LocalBuka and find somewhere that catches your interest.
                    </p>

                    <p class="body-p" style="margin: 0 0 32px 0; font-size: 17px; line-height: 24px; color: #5C5C5C;">Your next great food discovery could be closer than you think.</p>

                    <!-- Button -->
                    <table role="presentation" class="btn-wrap" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 36px;">
                      <tr>
                        <td align="center" bgcolor="#F1BE47" style="background-color: #F1BE47; border-radius: 10px;">
                          <a class="btn-link" href="${exploreUrl}" target="_blank" style="display: block; padding: 23px 20px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 14px; line-height: 16px; font-weight: 700; color: #222222; text-transform: uppercase; text-decoration: none; text-align: center;">Start exploring</a>
                        </td>
                      </tr>
                    </table>

                    <p class="body-close" style="margin: 0 0 8px 0; font-size: 17px; line-height: 24px; font-weight: 600; color: #5C5C5C;">Welcome to the community!</p>
                    <p class="body-team" style="margin: 0; font-size: 17px; line-height: 24px; font-weight: 600; color: #041727;">The LocalBuka Team</p>

                  </td>
                  <td class="zigzag-col-right" width="36" align="right" background="${assetBaseUrl}/images/email/zigzag-right.png" bgcolor="#FFFFFF" style="width: 36px; min-width: 36px; max-width: 36px; background-color: #FFFFFF; background-image: url('${assetBaseUrl}/images/email/zigzag-right.png'); background-repeat: repeat-y; background-position: right top; background-size: 36px 86px; font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-pad" align="center" bgcolor="#03101F" style="background-color: #03101F; padding: 36px 24px 32px 24px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td style="padding: 0 11px;"><a href="https://x.com/LocalBuka_app" target="_blank"><img src="${assetBaseUrl}/images/email/icons/social-twitter.png" alt="Twitter" width="36" height="36" style="display: block; width: 36px; height: 36px;" /></a></td>
                  <td style="padding: 0 11px;"><a href="https://www.instagram.com/localbuka_app" target="_blank"><img src="${assetBaseUrl}/images/email/icons/social-instagram.png" alt="Instagram" width="36" height="36" style="display: block; width: 36px; height: 36px;" /></a></td>
                  <td style="padding: 0 11px;"><a href="https://www.youtube.com/@LocalBuka__App" target="_blank"><img src="${assetBaseUrl}/images/email/icons/social-youtube.png" alt="YouTube" width="36" height="36" style="display: block; width: 36px; height: 36px;" /></a></td>
                  <td style="padding: 0 11px;"><a href="https://web.facebook.com/people/Local-Buka/61569877310017/" target="_blank"><img src="${assetBaseUrl}/images/email/icons/social-facebook.png" alt="Facebook" width="36" height="36" style="display: block; width: 36px; height: 36px;" /></a></td>
                </tr>
              </table>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" width="290" style="width: 290px; max-width: 100%;">
                <tr>
                  <td align="center" style="padding-top: 22px; font-size: 14px; line-height: 19px; color: #FFFFFF;">You are receiving this email because you signed up for LocalBuka.</td>
                </tr>
              </table>
              <p style="margin: 26px 0 0 0; font-size: 14px; line-height: 20px; text-align: center;">
                <a href="${unsubscribeUrl}" target="_blank" style="color: #F1BE47; text-decoration: none;">Unsubscribe</a>
                <span style="color: #9A9A9A;">&nbsp;&middot;&nbsp;</span>
                <a href="${preferencesUrl}" target="_blank" style="color: #F1BE47; text-decoration: none;">Manage preferences</a>
              </p>
              <p style="margin: 26px 0 0 0; font-size: 14px; line-height: 20px; color: #A8A8A8; text-align: center;">&copy; ${year} LocalBuka &middot; All rights reserved.</p>
            </td>
          </tr>

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td></tr></table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function handleSend(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let targetEmail = searchParams.get('email') || 'akinkuotutobi6@gmail.com';
  let recipientName = searchParams.get('name') || 'Wilson';
  let referrerName = searchParams.get('referrer') || 'Tunde Bakare';
  const apiKey = searchParams.get('key') || req.headers.get('x-resend-key') || process.env.RESEND_API_KEY || '';

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      if (body?.email) targetEmail = body.email;
      if (body?.name || body?.fullName) recipientName = body.name || body.fullName;
      if (body?.referrerName) referrerName = body.referrerName;
    } catch {
      // ignore body parse error
    }
  }

  targetEmail = targetEmail.trim().toLowerCase().replace('gmai;.com', 'gmail.com');

  const subject = 'A little reward for joining us: +25 points inside!';
  const html = buildReferee25PointsHtml(recipientName, referrerName, 25, 25);

  try {
    // 1. Send direct 25-point Referee Lifecycle Email via Resend
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [targetEmail],
        subject,
        html,
      }),
    });

    const resendData = await resendRes.json();

    // 2. Also purge test user on Railway so fresh signup with referral code triggers cleanly
    let purgeResult: unknown = null;
    try {
      const purgeRes = await fetch(
        `${RAILWAY_API}/lifecycle-emails/purge-test-user?email=${encodeURIComponent(targetEmail)}`,
        {
          method: 'DELETE',
          headers: {
            'x-cron-key': CRON_SECRET,
          },
        }
      );
      purgeResult = await purgeRes.json();
    } catch {
      // ignore purge error
    }

    return NextResponse.json({
      success: resendRes.ok,
      email: targetEmail,
      subject,
      pointsEarned: 25,
      resend: resendData,
      purgeResult,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send email';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleSend(req);
}

export async function POST(req: NextRequest) {
  return handleSend(req);
}
