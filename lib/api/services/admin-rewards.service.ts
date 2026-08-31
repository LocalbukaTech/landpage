import {api, API_BASE_URL} from '../client';
import type {ApiResponse} from '../types';
import Cookies from 'js-cookie';

// ============================================
// Admin Rewards & Referral Types
// ============================================

export interface TopReferrerItem {
  userId: string;
  fullName: string;
  email: string;
  referralCode?: string;
  vanityCode?: string | null;
  totalReferrals?: number;
  completedReferrals: number;
  pendingReferrals?: number;
  rejectedReferrals?: number;
  lifetimeEarned?: number;
  currentPoints?: number;
}

export interface DailyReferralTrendItem {
  date: string;
  count: number;
}

export interface AdminRewardsOverviewResponse {
  totalRegisteredUsers: number;
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  rejectedReferrals: number;
  totalPointsInCirculation: number;
  totalPointsEverEarned: number;
  totalPointsRedeemed: number;
  totalNairaEquivalentRedeemed: number;
  averageReferralsPerUser: number;
  conversionRate: string;
  fraudFlaggedCount: number;
  topReferrers: TopReferrerItem[];
  dailyReferralTrend: DailyReferralTrendItem[];
}

export interface AdminReferralUserSummary {
  id: string;
  fullName: string;
  email: string;
  referralCode?: string;
  vanityCode?: string | null;
  status?: string;
  isEmailVerified?: boolean;
}

export interface AdminReferralItem {
  id: string;
  code: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED' | string;
  referrerRewardPoints: number;
  refereeRewardPoints: number;
  qualifyingAction?: string | null;
  rejectionReason?: string | null;
  refereeSignupIp?: string | null;
  refereeDeviceId?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  referrerId?: string;
  refereeId?: string;
  referrer?: AdminReferralUserSummary | null;
  referee?: AdminReferralUserSummary | null;
}

export interface AdminReferralsListResponse {
  data: AdminReferralItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminReferralsFilterParams {
  page?: number;
  pageSize?: number;
  status?: 'PENDING' | 'COMPLETED' | 'REJECTED' | 'ALL' | string;
  search?: string;
  referrerId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AdminTransactionItem {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  amount: number;
  balanceAfter: number;
  type: 'EARNED' | 'REDEEMED' | 'BONUS' | 'PENALTY' | 'EXPIRED' | 'ADJUSTMENT' | string;
  sourceType: 'REFERRAL_REFERRER' | 'REFERRAL_REFEREE' | 'REDEMPTION' | 'MANUAL_ADMIN' | string;
  sourceId?: string | null;
  description: string;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface AdminTransactionsListResponse {
  data: AdminTransactionItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminTransactionsFilterParams {
  page?: number;
  pageSize?: number;
  type?: 'EARNED' | 'REDEEMED' | 'BONUS' | 'PENALTY' | 'ALL' | string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AdminAdjustPointsPayload {
  userId: string;
  points: number;
  type: 'BONUS' | 'PENALTY';
  reason: string;
}

export interface AdminAdjustPointsResponse {
  message: string;
  newBalance: number;
  transaction: AdminTransactionItem;
}

export interface AdminApproveVanityPayload {
  userId: string;
  code: string;
}

export interface AdminApproveVanityResponse {
  message: string;
  vanityCode: string;
  shareLink: string;
}

// ============================================
// Admin Rewards Service
// ============================================

export const adminRewardsService = {
  /** GET /rewards/admin/overview — High-level system metrics & circulation */
  getOverview: () =>
    api.get<ApiResponse<AdminRewardsOverviewResponse>>('/rewards/admin/overview'),

  /** GET /rewards/admin/referrals — Filterable, paginated referral records */
  getReferrals: (params?: AdminReferralsFilterParams) => {
    const cleanParams: Record<string, any> = {};
    if (params) {
      if (params.page) cleanParams.page = params.page;
      if (params.pageSize) cleanParams.pageSize = params.pageSize;
      if (params.status && params.status !== 'ALL') cleanParams.status = params.status;
      if (params.search?.trim()) cleanParams.search = params.search.trim();
      if (params.referrerId) cleanParams.referrerId = params.referrerId;
      if (params.dateFrom) cleanParams.dateFrom = params.dateFrom;
      if (params.dateTo) cleanParams.dateTo = params.dateTo;
    }
    return api.get<ApiResponse<AdminReferralsListResponse>>('/rewards/admin/referrals', {
      params: cleanParams,
    });
  },

  /** GET /rewards/admin/referrals/:id — Detailed record for a single referral */
  getReferralDetail: (id: string) =>
    api.get<ApiResponse<AdminReferralItem>>(`/rewards/admin/referrals/${id}`),

  /** GET /rewards/admin/transactions — Platform-wide immutable point ledger */
  getTransactions: (params?: AdminTransactionsFilterParams) => {
    const cleanParams: Record<string, any> = {};
    if (params) {
      if (params.page) cleanParams.page = params.page;
      if (params.pageSize) cleanParams.pageSize = params.pageSize;
      if (params.type && params.type !== 'ALL') cleanParams.type = params.type;
      if (params.search?.trim()) cleanParams.search = params.search.trim();
      if (params.dateFrom) cleanParams.dateFrom = params.dateFrom;
      if (params.dateTo) cleanParams.dateTo = params.dateTo;
    }
    return api.get<ApiResponse<AdminTransactionsListResponse>>('/rewards/admin/transactions', {
      params: cleanParams,
    });
  },

  /** GET /rewards/admin/flagged — List of rejected / abuse-flagged referrals */
  getFlagged: (params?: {page?: number; pageSize?: number}) =>
    api.get<ApiResponse<AdminReferralsListResponse>>('/rewards/admin/flagged', {
      params,
    }),

  /** POST /rewards/admin/adjust — Manual point adjustment with audit reason */
  adjustPoints: (data: AdminAdjustPointsPayload) =>
    api.post<ApiResponse<AdminAdjustPointsResponse>>('/rewards/admin/adjust', data),

  /** POST /rewards/admin/vanity-code/approve — Grant influencer vanity code */
  approveVanityCode: (data: AdminApproveVanityPayload) =>
    api.post<ApiResponse<AdminApproveVanityResponse>>('/rewards/admin/vanity-code/approve', data),

  /** GET /rewards/admin/top-referrers — Performance rankings report */
  getTopReferrers: (limit: number = 20) =>
    api.get<ApiResponse<TopReferrerItem[]>>('/rewards/admin/top-referrers', {
      params: {limit},
    }),

  /** Download / Stream Referrals CSV */
  downloadReferralsCsv: async () => {
    const token = Cookies.get('localbuka_admin_token');
    const response = await fetch(`${API_BASE_URL}/rewards/admin/referrals/export`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Failed to export referrals CSV');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referrals_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  /** Download / Stream Transactions CSV */
  downloadTransactionsCsv: async () => {
    const token = Cookies.get('localbuka_admin_token');
    const response = await fetch(`${API_BASE_URL}/rewards/admin/transactions/export`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Failed to export transactions CSV');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
};
