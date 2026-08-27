import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  adminRewardsService,
  type AdminRewardsOverviewResponse,
  type AdminReferralsListResponse,
  type AdminReferralItem,
  type AdminReferralsFilterParams,
  type AdminTransactionsListResponse,
  type AdminTransactionsFilterParams,
  type TopReferrerItem,
  type AdminAdjustPointsPayload,
  type AdminApproveVanityPayload,
} from './admin-rewards.service';
import {queryKeys} from '../types';

// Helper to safely unwrap response payload
function unwrapData<T>(response: any): T {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data;
  }
  return response as T;
}

// ============================================
// Admin Rewards Query Hooks
// ============================================

/** Admin System Overview Metrics */
export const useAdminRewardsOverview = () => {
  return useQuery({
    queryKey: queryKeys.adminRewards.overview(),
    queryFn: async () => {
      const response = await adminRewardsService.getOverview();
      return unwrapData<AdminRewardsOverviewResponse>(response);
    },
    staleTime: 1000 * 30, // 30s
  });
};

/** Filterable & Paginated Referrals List */
export const useAdminReferrals = (params?: AdminReferralsFilterParams) => {
  return useQuery({
    queryKey: queryKeys.adminRewards.referrals(params),
    queryFn: async () => {
      const response = await adminRewardsService.getReferrals(params);
      return unwrapData<AdminReferralsListResponse>(response);
    },
  });
};

/** Detailed Record for a Single Referral */
export const useAdminReferralDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.adminRewards.referralDetail(id),
    queryFn: async () => {
      const response = await adminRewardsService.getReferralDetail(id);
      return unwrapData<AdminReferralItem>(response);
    },
    enabled: !!id,
  });
};

/** Platform-wide Immutable Point Ledger */
export const useAdminTransactions = (params?: AdminTransactionsFilterParams) => {
  return useQuery({
    queryKey: queryKeys.adminRewards.transactions(params),
    queryFn: async () => {
      const response = await adminRewardsService.getTransactions(params);
      return unwrapData<AdminTransactionsListResponse>(response);
    },
  });
};

/** List of Rejected / Abuse-Flagged Referrals */
export const useAdminFlagged = (params?: {page?: number; pageSize?: number}) => {
  return useQuery({
    queryKey: queryKeys.adminRewards.flagged(params),
    queryFn: async () => {
      const response = await adminRewardsService.getFlagged(params);
      return unwrapData<AdminReferralsListResponse>(response);
    },
  });
};

/** Top Referrers Report */
export const useAdminTopReferrers = (limit: number = 20) => {
  return useQuery({
    queryKey: queryKeys.adminRewards.topReferrers(limit),
    queryFn: async () => {
      const response = await adminRewardsService.getTopReferrers(limit);
      return unwrapData<TopReferrerItem[]>(response);
    },
    staleTime: 1000 * 60, // 1 min
  });
};

// ============================================
// Admin Rewards Mutation Hooks
// ============================================

/** Adjust points manually (Bonus or Penalty) with audit reason */
export const useAdminAdjustPoints = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminAdjustPointsPayload) =>
      adminRewardsService.adjustPoints(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.adminRewards.all});
      queryClient.invalidateQueries({queryKey: queryKeys.rewards.all});
      queryClient.invalidateQueries({queryKey: queryKeys.referrals.all});
    },
  });
};

/** Grant custom influencer vanity code directly */
export const useAdminApproveVanityCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminApproveVanityPayload) =>
      adminRewardsService.approveVanityCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.adminRewards.all});
      queryClient.invalidateQueries({queryKey: queryKeys.rewards.all});
      queryClient.invalidateQueries({queryKey: queryKeys.referrals.all});
    },
  });
};
