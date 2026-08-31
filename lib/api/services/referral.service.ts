import {api} from '../client';
import type {ApiResponse} from '../types';

// ============================================
// Rewards & Referral Types
// ============================================

export interface WalletSummary {
  currentPoints: number;
  nairaEquivalent?: number;
  nairaBalance?: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  lifetimeEarnedNaira?: number;
  lifetimeRedeemedNaira?: number;
  pointsPerNaira?: number;
  pointsToNairaRate?: string;
  minRedeemablePoints: number;
  canRedeem: boolean;
  pointsNeededToRedeem?: number;
}

export interface ReferralStats {
  referralCode: string;
  vanityCode: string | null;
  shareLink: string;
  completedReferrals: number;
  pendingReferrals: number;
  rejectedReferrals: number;
  totalReferrals: number;
  totalReferralEarnings?: number;
  totalReferralEarningsNaira?: number;
  isEligibleForVanityCode?: boolean;
  canRequestVanityCode?: boolean;
  minReferralsForVanity?: number;
  vanityCodeThreshold?: number;
  referrals?: ReferralItem[];
}

export interface ReferralItem {
  id: string;
  referrerId?: string;
  refereeId?: string;
  code: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED' | string;
  referrerRewardPoints?: number;
  refereeRewardPoints?: number;
  refereeSignupIp?: string | null;
  refereeDeviceId?: string | null;
  qualifyingAction?: string | null;
  rejectionReason?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionItem {
  id: string;
  userId?: string;
  amount: number;
  balanceAfter: number;
  type: 'EARNED' | 'REDEEMED' | 'BONUS' | 'PENALTY' | string;
  sourceType: 'REFERRAL_REFERRER' | 'REFERRAL_REFEREE' | 'REDEMPTION' | 'MANUAL_ADMIN' | string;
  sourceId?: string | null;
  idempotencyKey?: string;
  description: string;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface RewardsDashboardResponse {
  wallet: WalletSummary;
  referral: ReferralStats;
  recentTransactions: TransactionItem[];
  referrals?: ReferralItem[];
}

export interface ReferralCodeResponse {
  referralCode: string;
  vanityCode: string | null;
  shareLink: string;
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

export interface RedeemPointsPayload {
  points: number;
}

export interface RedeemPointsResponse {
  message: string;
  pointsRedeemed: number;
  nairaValue: number;
  remainingBalance: number;
}

export interface RequestVanityCodePayload {
  code: string;
}

export interface RequestVanityCodeResponse {
  message: string;
  vanityCode: string;
  shareLink: string;
}

export interface LeaderboardItem {
  rank: number;
  userId: string;
  name?: string;
  fullName?: string;
  username?: string | null;
  avatar?: string | null;
  points?: number;
  lifetimeEarned?: number;
  currentPoints?: number;
  nairaEquivalent?: number;
  referralCount?: number;
}

export interface LeaderboardResponse {
  period?: 'all' | 'monthly' | 'weekly' | string;
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  leaderboard?: LeaderboardItem[];
  data?: LeaderboardItem[];
}

export interface PaginatedTransactionsResponse {
  data: TransactionItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Backward compatibility alias
export type ReferralDashboard = RewardsDashboardResponse;

// ============================================
// Rewards & Referral Service
// ============================================

export const referralService = {
  /**
   * POST /rewards/referral/validate (or GET /rewards/referral/validate/:code)
   * Public endpoint to validate a referral code on signup or landing page.
   */
  validateCode: (data: ValidateReferralPayload) =>
    api.post<ApiResponse<ValidateReferralResponse>>('/rewards/referral/validate', data),

  /**
   * GET /rewards/dashboard
   * Main user dashboard with wallet, referral stats, recent transactions, and referrals.
   */
  getDashboard: () =>
    api.get<ApiResponse<RewardsDashboardResponse>>('/rewards/dashboard'),

  /**
   * GET /rewards/wallet
   * Quick wallet summary for navbar, widgets, or profile header.
   */
  getWallet: () =>
    api.get<ApiResponse<WalletSummary>>('/rewards/wallet'),

  /**
   * GET /rewards/referral/code
   * Get user's referral code, vanity code, and share link.
   */
  getCode: () =>
    api.get<ApiResponse<ReferralCodeResponse>>('/rewards/referral/code'),

  /**
   * POST /rewards/referral/generate
   * Generate or retrieve user's referral code.
   */
  generateCode: (data?: {force?: boolean}) =>
    api.post<ApiResponse<ReferralCodeResponse>>('/rewards/referral/generate', data),

  /**
   * POST /rewards/redeem
   * Convert loyalty points to Naira (Min 1,000 points = ₦500).
   */
  redeemPoints: (data: RedeemPointsPayload) =>
    api.post<ApiResponse<RedeemPointsResponse>>('/rewards/redeem', data),

  /**
   * GET /rewards/transactions
   * Paginated point ledger transaction history.
   */
  getTransactions: (params?: {page?: number; pageSize?: number}) =>
    api.get<ApiResponse<PaginatedTransactionsResponse>>('/rewards/transactions', {params}),

  /**
   * GET /rewards/leaderboard
   * Get community referral rankings filtered by period ('all', 'monthly', 'weekly').
   */
  getLeaderboard: (params?: {
    period?: 'all' | 'monthly' | 'weekly';
    page?: number;
    pageSize?: number;
  }) =>
    api.get<ApiResponse<LeaderboardResponse>>('/rewards/leaderboard', {params}),

  /**
   * POST /rewards/vanity-code
   * Set custom vanity code (requires >= 5 completed referrals).
   */
  requestVanityCode: (data: RequestVanityCodePayload) =>
    api.post<ApiResponse<RequestVanityCodeResponse>>('/rewards/vanity-code', data),
};

export const rewardsService = referralService;
