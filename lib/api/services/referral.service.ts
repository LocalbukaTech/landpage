import {api} from '../client';
import type {ApiResponse} from '../types';

// ============================================
// Referral Types
// ============================================

export interface ReferralCodeResponse {
  referralCode: string;
  shareLink: string;
}

export interface ReferralItem {
  id: string;
  referrerId: string;
  refereeId: string;
  code: string;
  status: 'PENDING' | 'COMPLETED' | string;
  rewardAmount: number;
  referrerRewardAmount: number;
  refereeRewardAmount: number;
  qualifyingOrderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralDashboard {
  referralCode: string;
  shareLink: string;
  loyaltyPoints: number;
  nairaEquivalent: number;
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  totalEarnedPoints: number;
  totalEarnedNaira: number;
  referrals: ReferralItem[];
}

export interface ApplyReferralPayload {
  referralCode: string;
}

export interface ApplyReferralResponse {
  message: string;
}

export interface RedeemPointsPayload {
  points: number;
}

export interface RedeemPointsResponse {
  pointsRedeemed: number;
  nairaValue: number;
  remainingBalance: number;
}

export interface ValidateReferralPayload {
  referralCode: string;
}

export interface ValidateReferralResponse {
  valid: boolean;
  code?: string;
  referrerName?: string;
  message?: string;
}

// ============================================
// Referral Service
// ============================================

export const referralService = {
  /** GET /referrals/code — Get the current user's referral code & share link */
  getCode: () =>
    api.get<ApiResponse<ReferralCodeResponse>>('/referrals/code'),

  /** GET /referrals/me — Get referral dashboard (points, naira, stats) */
  getDashboard: () =>
    api.get<ApiResponse<ReferralDashboard>>('/referrals/me'),

  /** POST /referrals/apply — Apply a referral code post-signup */
  applyCode: (data: ApplyReferralPayload) =>
    api.post<ApiResponse<ApplyReferralResponse>>('/referrals/apply', data),

  /** POST /referrals/redeem — Redeem loyalty points to Naira */
  redeemPoints: (data: RedeemPointsPayload) =>
    api.post<ApiResponse<RedeemPointsResponse>>('/referrals/redeem', data),

  /** POST /referrals/validate — Public endpoint to validate a referral code */
  validateCode: (data: ValidateReferralPayload) =>
    api.post<ApiResponse<ValidateReferralResponse>>('/referrals/validate', data),
};
