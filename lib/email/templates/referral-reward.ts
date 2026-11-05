import { EmailDynamicData, EmailRenderResult, ReferralEmailVariant } from '../types';
import { escapeHtml, renderBaseEmail } from '../base-layout';

export interface ReferralEmailOptions extends EmailDynamicData {
  variant?: ReferralEmailVariant;
}

export function renderReferralRewardsEmail(options: ReferralEmailOptions = {}): EmailRenderResult {
  const variant: ReferralEmailVariant = options.variant || 'referrer';
  const isReferrer = variant === 'referrer';

  const name = options.name ? escapeHtml(options.name.trim()) : 'Food Lover';
  const appUrl = options.appUrl || 'https://localbuka.com';
  const pointsEarned = options.pointsEarned ?? (isReferrer ? 50 : 25);
  const currentBalance = options.currentBalance ?? (isReferrer ? 100 : 25);
  const referralCode = options.referralCode || 'BUKA-EXPLORE';
  const rewardsUrl = options.rewardsUrl || `${appUrl}/rewards`;
  const exploreUrl = options.exploreUrl || `${appUrl}/buka`;
  const shareReferralUrl = options.shareReferralUrl || `${appUrl}/rewards?code=${encodeURIComponent(referralCode)}`;

  const subject = isReferrer
    ? `Sharing LocalBuka just paid off! You earned +${pointsEarned} points`
    : `A little reward for joining us: +${pointsEarned} points inside!`;

  const preheader = isReferrer
    ? `Your friend joined with your referral code. +${pointsEarned} points credited to your account!`
    : `Welcome to LocalBuka! Your ${pointsEarned} referral points have been credited to your account.`;

  const heroHeading = isReferrer
    ? `SHARING<br />LOCALBUKA<br />JUST PAID<br />OFF!`
    : `A LITTLE<br />REWARD FOR<br />JOINING US.`;

  // Hero with circular Points Badge
  const heroContent = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <!-- Left Hero Copy -->
        <td valign="middle" class="mobile-stack" style="padding-right: 16px;">
          <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #FBBE15; text-transform: uppercase; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
            REFERRAL REWARD
          </p>
          <h1 style="margin: 0; font-size: 26px; line-height: 32px; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: -0.5px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
            ${heroHeading}
          </h1>
        </td>
        <!-- Right Hero Points Badge -->
        <td align="right" valign="middle" class="mobile-stack" style="width: 140px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="124" height="124" bgcolor="#FBBE15" class="hero-image-wrap" style="background-color: #FBBE15; border-radius: 50%; text-align: center; margin-left: auto; box-shadow: 0 8px 24px rgba(251, 190, 21, 0.35);">
            <tr>
              <td align="center" valign="middle" style="padding: 12px 6px;">
                <div style="font-size: 32px; font-weight: 800; line-height: 1; color: #0A182F; font-family: 'Plus Jakarta Sans', Arial, sans-serif; letter-spacing: -0.5px;">
                  +${pointsEarned}
                </div>
                <div style="font-size: 11px; font-weight: 800; line-height: 14px; color: #0A182F; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  POINTS
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  // Body content conditionally adapts based on referrer vs referee
  const bodyContent = isReferrer
    ? `
      <!-- Greeting -->
      <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0A182F; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        Hi ${name},
      </h2>

      <p style="margin: 0 0 20px 0; font-size: 14.5px; line-height: 23px; color: #374151; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        Your friend has successfully signed up using your referral code, and <strong>${pointsEarned} points</strong> have been credited to your account!
      </p>

      <!-- Points Summary Card -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FFFDF5" style="background-color: #FFFDF5; border: 1px solid #FDE68A; border-radius: 12px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 16px 20px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left" style="font-size: 14px; color: #6B7280; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  Points earned
                </td>
                <td align="right" style="font-size: 15px; font-weight: 700; color: #111827; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  +${pointsEarned} points
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px 0;">
                  <div style="border-top: 1px solid #FEF3C7; height: 1px; line-height: 1px;"></div>
                </td>
              </tr>
              <tr>
                <td align="left" style="font-size: 14px; color: #6B7280; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  Your current balance
                </td>
                <td align="right" style="font-size: 15px; font-weight: 700; color: #111827; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  ${currentBalance} points
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin: 0 0 14px 0; font-size: 14.5px; line-height: 23px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        Know someone who loves discovering great places to eat? Now there&rsquo;s another reason to share LocalBuka with them.
      </p>

      <p style="margin: 0 0 16px 0; font-size: 14.5px; font-weight: 700; color: #111827; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        Here&rsquo;s how you can earn referral rewards:
      </p>

      <!-- Numbered Steps Card -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FFFDF5" style="background-color: #FFFDF5; border: 1px solid #FDE68A; border-radius: 12px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 18px 20px;">
            <!-- Step 1 -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;">
              <tr>
                <td valign="top" style="width: 28px;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #FBBE15; color: #0A182F; font-size: 12px; font-weight: 800; line-height: 24px; text-align: center; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                    1
                  </div>
                </td>
                <td valign="top" style="padding-left: 10px; font-size: 13.5px; line-height: 20px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  Share your unique LocalBuka referral code with friends.
                </td>
              </tr>
            </table>

            <!-- Step 2 -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;">
              <tr>
                <td valign="top" style="width: 28px;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #FBBE15; color: #0A182F; font-size: 12px; font-weight: 800; line-height: 24px; text-align: center; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                    2
                  </div>
                </td>
                <td valign="top" style="padding-left: 10px; font-size: 13.5px; line-height: 20px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  When a friend successfully signs up using your code and meets the programme&rsquo;s eligibility requirements, your referral qualifies.
                </td>
              </tr>
            </table>

            <!-- Step 3 -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td valign="top" style="width: 28px;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #FBBE15; color: #0A182F; font-size: 12px; font-weight: 800; line-height: 24px; text-align: center; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                    3
                  </div>
                </td>
                <td valign="top" style="padding-left: 10px; font-size: 13.5px; line-height: 20px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  Once the reward is credited, you&rsquo;ll receive 50 points.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin: 0 0 14px 0; font-size: 14px; line-height: 22px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        And you&rsquo;re just getting started. Share your referral code with more friends who would enjoy discovering food spots on LocalBuka.
      </p>

      <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 20px; color: #6B7280; font-style: italic; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        Every successful referral is another opportunity to earn rewards, subject to the programme&rsquo;s eligibility rules.
      </p>

      <!-- CTAs (Primary + Secondary) -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
        <tr>
          <td>
            <!-- Primary Button -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 12px;">
              <tr>
                <td align="center" bgcolor="#FBBE15" style="border-radius: 8px; background-color: #FBBE15;">
                  <a href="${rewardsUrl}" target="_blank" style="display: block; width: 100%; padding: 14px 20px; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; color: #0A182F; text-transform: uppercase; text-decoration: none; border-radius: 8px; box-sizing: border-box; text-align: center; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                    VIEW MY REWARDS
                  </a>
                </td>
              </tr>
            </table>

            <!-- Secondary Button -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" bgcolor="#FFFFFF" style="border-radius: 8px; background-color: #FFFFFF; border: 1.5px solid #0A182F;">
                  <a href="${shareReferralUrl}" target="_blank" style="display: block; width: 100%; padding: 13px 20px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; color: #0A182F; text-transform: uppercase; text-decoration: none; border-radius: 8px; box-sizing: border-box; text-align: center; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                    SHARE REFERRAL CODE
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Sign-off -->
      <p style="margin: 0 0 6px 0; font-size: 14.5px; line-height: 22px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        Thanks for spreading the word!
      </p>
      <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0A182F; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        The LocalBuka Team
      </p>
    `
    : `
      <!-- Referee Version -->
      <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #0A182F; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        Hi ${name},
      </h2>

      <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #111827; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        We&rsquo;re glad you&rsquo;re here!
      </p>

      <p style="margin: 0 0 20px 0; font-size: 14.5px; line-height: 23px; color: #374151; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        You joined LocalBuka using a friend&rsquo;s referral code, and your <strong>${pointsEarned} referral points</strong> have been credited to your account.
      </p>

      <!-- Points Summary Card -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FFFDF5" style="background-color: #FFFDF5; border: 1px solid #FDE68A; border-radius: 12px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 16px 20px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left" style="font-size: 14px; color: #6B7280; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  Points earned
                </td>
                <td align="right" style="font-size: 15px; font-weight: 700; color: #111827; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  +${pointsEarned} points
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px 0;">
                  <div style="border-top: 1px solid #FEF3C7; height: 1px; line-height: 1px;"></div>
                </td>
              </tr>
              <tr>
                <td align="left" style="font-size: 14px; color: #6B7280; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  Your current balance
                </td>
                <td align="right" style="font-size: 15px; font-weight: 700; color: #111827; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  ${currentBalance} points
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 23px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        Now it&rsquo;s time to discover what awaits you.
      </p>

      <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 23px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        Looking for a restaurant to try? Need inspiration for your next outing? Explore food spots on LocalBuka and find somewhere that catches your interest.
      </p>

      <p style="margin: 0 0 24px 0; font-size: 14.5px; line-height: 23px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        Your next great food discovery could be closer than you think.
      </p>

      <!-- CTA Section -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
        <tr>
          <td>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" bgcolor="#FBBE15" style="border-radius: 8px; background-color: #FBBE15;">
                  <a href="${exploreUrl}" target="_blank" style="display: block; width: 100%; padding: 14px 20px; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; color: #0A182F; text-transform: uppercase; text-decoration: none; border-radius: 8px; box-sizing: border-box; text-align: center; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                    START EXPLORING
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Sign-off -->
      <p style="margin: 0 0 6px 0; font-size: 14.5px; line-height: 22px; color: #4B5563; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        Welcome to the community!
      </p>
      <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0A182F; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        The LocalBuka Team
      </p>
    `;

  const html = renderBaseEmail({
    categoryTitle: 'YOUR REWARD',
    subject,
    preheader,
    heroContent,
    bodyContent,
    data: options,
  });

  const text = isReferrer
    ? `
YOUR FOOD DISCOVERY PLATFORM
LocalBuka - YOUR REWARD

REFERRAL REWARD
SHARING LOCALBUKA JUST PAID OFF! (+${pointsEarned} POINTS)

Hi ${name},

Your friend has successfully signed up using your referral code, and ${pointsEarned} points have been credited to your account!

Points earned: +${pointsEarned} points
Your current balance: ${currentBalance} points

Know someone who loves discovering great places to eat? Now there's another reason to share LocalBuka with them.

Here's how you can earn referral rewards:
1. Share your unique LocalBuka referral code with friends.
2. When a friend successfully signs up using your code and meets eligibility, your referral qualifies.
3. Once the reward is credited, you'll receive 50 points.

View My Rewards: ${rewardsUrl}
Share Referral Code: ${shareReferralUrl}

Thanks for spreading the word!
The LocalBuka Team
    `.trim()
    : `
YOUR FOOD DISCOVERY PLATFORM
LocalBuka - YOUR REWARD

REFERRAL REWARD
A LITTLE REWARD FOR JOINING US. (+${pointsEarned} POINTS)

Hi ${name},

We're glad you're here!
You joined LocalBuka using a friend's referral code, and your ${pointsEarned} referral points have been credited to your account.

Points earned: +${pointsEarned} points
Your current balance: ${currentBalance} points

Now it's time to discover what awaits you.
Looking for a restaurant to try? Need inspiration for your next outing? Explore food spots on LocalBuka and find somewhere that catches your interest.

Start Exploring: ${exploreUrl}

Welcome to the community!
The LocalBuka Team
    `.trim();

  return {
    id: isReferrer ? 'referral-referrer' : 'referral-referee',
    title: isReferrer
      ? 'Points & Referral Rewards - Referrer (+50 pts)'
      : 'Points & Referral Rewards - Referee (+25 pts)',
    subject,
    preheader,
    html,
    text,
    defaultData: {
      name: 'Wilson',
      pointsEarned,
      currentBalance,
      referralCode: 'BUKA-EXPLORE',
      rewardsUrl: 'https://localbuka.com/rewards',
      exploreUrl: 'https://localbuka.com/buka',
    },
  };
}
