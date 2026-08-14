import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  referralService,
  type ApplyReferralPayload,
  type RedeemPointsPayload,
} from './referral.service';
import {queryKeys} from '../types';
import {getUserAuthToken} from '@/lib/auth';

// ============================================
// Referral Query Hooks
// ============================================

/** Fetch the current user's referral code & share link */
export const useReferralCode = () => {
  const token = getUserAuthToken();
  return useQuery({
    queryKey: queryKeys.referrals.code(),
    queryFn: async () => {
      const response = await referralService.getCode();
      return response.data;
    },
    enabled: !!token,
  });
};

/** Fetch the referral dashboard: points, naira equivalent, completed referrals */
export const useReferralDashboard = () => {
  const token = getUserAuthToken();
  return useQuery({
    queryKey: queryKeys.referrals.dashboard(),
    queryFn: async () => {
      const response = await referralService.getDashboard();
      return response.data;
    },
    enabled: !!token,
  });
};

// ============================================
// Referral Mutation Hooks
// ============================================

/** Apply a referral code after signup */
export const useApplyReferralCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ApplyReferralPayload) =>
      referralService.applyCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.referrals.all});
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
    },
  });
};

/** Validate a referral code (public endpoint) */
export const useValidateReferralCode = () => {
  return useMutation({
    mutationFn: (data: {referralCode: string}) =>
      referralService.validateCode(data),
  });
};
