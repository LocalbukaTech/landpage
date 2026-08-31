import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  referralService,
  type RedeemPointsPayload,
  type RequestVanityCodePayload,
  type RewardsDashboardResponse,
  type WalletSummary,
  type ReferralCodeResponse,
  type LeaderboardResponse,
  type PaginatedTransactionsResponse,
} from './referral.service';
import {queryKeys} from '../types';
import {getUserAuthToken} from '@/lib/auth';

// Helper to safely extract response payload
function unwrapData<T>(response: any): T {
  let res = response;
  // Unwrap Axios response level
  if (res && typeof res === 'object' && 'data' in res && res.data !== undefined) {
    res = res.data;
  }
  // Unwrap backend API envelope level (e.g. { success: true, message: "...", data: ... })
  if (res && typeof res === 'object' && 'data' in res && res.data !== undefined && !Array.isArray(res)) {
    // If res.data is an array or object containing our actual payload
    if (res.data !== null && typeof res.data === 'object') {
      res = res.data;
    }
  }
  return res as T;
}

// ============================================
// Rewards Query Hooks
// ============================================

/** Fetch the full rewards dashboard: wallet, referral stats, recent transactions, referrals */
export const useReferralDashboard = () => {
  const token = getUserAuthToken();
  return useQuery({
    queryKey: queryKeys.referrals.dashboard(),
    queryFn: async () => {
      const response = await referralService.getDashboard();
      return unwrapData<RewardsDashboardResponse>(response);
    },
    enabled: !!token,
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useRewardsDashboard = useReferralDashboard;

/** Fetch quick wallet summary (currentPoints, nairaEquivalent, canRedeem, etc.) */
export const useRewardsWallet = () => {
  const token = getUserAuthToken();
  return useQuery({
    queryKey: queryKeys.referrals.wallet(),
    queryFn: async () => {
      const response = await referralService.getWallet();
      return unwrapData<WalletSummary>(response);
    },
    enabled: !!token,
    staleTime: 1000 * 30,
  });
};

/** Fetch the current user's referral code & share link */
export const useReferralCode = () => {
  const token = getUserAuthToken();
  return useQuery({
    queryKey: queryKeys.referrals.code(),
    queryFn: async () => {
      const response = await referralService.getCode();
      return unwrapData<ReferralCodeResponse>(response);
    },
    enabled: !!token,
  });
};

/** Fetch paginated transaction history ledger */
export const useRewardsTransactions = (params?: {page?: number; pageSize?: number}) => {
  const token = getUserAuthToken();
  return useQuery({
    queryKey: queryKeys.referrals.transactions(params),
    queryFn: async () => {
      const response = await referralService.getTransactions(params);
      return unwrapData<PaginatedTransactionsResponse>(response);
    },
    enabled: !!token,
  });
};

/** Fetch leaderboard community rankings */
export const useRewardsLeaderboard = (params?: {
  period?: 'all' | 'monthly' | 'weekly';
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: queryKeys.referrals.leaderboard(params),
    queryFn: async () => {
      const response = await referralService.getLeaderboard(params);
      return unwrapData<LeaderboardResponse>(response);
    },
    staleTime: 1000 * 30,
  });
};

// ============================================
// Rewards Mutation Hooks
// ============================================

/** Validate a referral code (public endpoint) */
export const useValidateReferralCode = () => {
  return useMutation({
    mutationFn: (data: {referralCode: string}) =>
      referralService.validateCode(data),
  });
};

/** Generate / retrieve referral code */
export const useGenerateReferralCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data?: {force?: boolean}) =>
      referralService.generateCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.referrals.all});
      queryClient.invalidateQueries({queryKey: queryKeys.rewards.all});
    },
  });
};

/** Redeem loyalty points to Naira wallet balance */
export const useRedeemPoints = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RedeemPointsPayload) =>
      referralService.redeemPoints(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.referrals.all});
      queryClient.invalidateQueries({queryKey: queryKeys.rewards.all});
    },
  });
};

/** Request custom vanity code (requires >= 5 completed referrals) */
export const useRequestVanityCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RequestVanityCodePayload) =>
      referralService.requestVanityCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.referrals.all});
      queryClient.invalidateQueries({queryKey: queryKeys.rewards.all});
    },
  });
};
