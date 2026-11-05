export interface EmailDynamicData {
  name?: string;
  pointsEarned?: number;
  currentBalance?: number;
  referralCode?: string;
  friendName?: string;
  exploreUrl?: string;
  rewardsUrl?: string;
  shareReferralUrl?: string;
  unsubscribeUrl?: string;
  preferencesUrl?: string;
  year?: number;
  appUrl?: string;
}

export type ReferralEmailVariant = 'referrer' | 'referee';

export interface EmailRenderResult {
  id: string;
  title: string;
  subject: string;
  preheader: string;
  html: string;
  text: string;
  defaultData: EmailDynamicData;
}
