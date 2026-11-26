import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { communityService, ExploreCommunitiesParams, FeedParams } from './community.service';
import { queryKeys } from '../types';

export const useExploreCommunities = (params?: ExploreCommunitiesParams) => {
  return useQuery({
    queryKey: [...queryKeys.community.list(params as Record<string, unknown>)],
    queryFn: async () => {
      const response = await communityService.explore(params);
      return response.data;
    },
  });
};

export const useCommunity = (idOrSlug: string) => {
  return useQuery({
    queryKey: [...queryKeys.community.detail(idOrSlug)],
    queryFn: async () => {
      const response = await communityService.getOne(idOrSlug);
      return response.data;
    },
    enabled: !!idOrSlug,
  });
};

export const useCommunityFeed = (idOrSlug: string, params?: FeedParams) => {
  return useQuery({
    queryKey: [...queryKeys.community.feed(idOrSlug, params as Record<string, unknown>)],
    queryFn: async () => {
      const response = await communityService.getFeed(idOrSlug, params);
      return response.data;
    },
    enabled: !!idOrSlug,
  });
};

export const useMyMemberships = () => {
  return useQuery({
    queryKey: [...queryKeys.community.memberships()],
    queryFn: async () => {
      const response = await communityService.getMyMemberships();
      return response.data;
    },
  });
};

export const useMyCreatedCommunities = (enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.community.myCommunities()],
    queryFn: async () => {
      const response = await communityService.getMyCreatedCommunities();
      return response.data;
    },
    enabled,
  });
};

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Parameters<typeof communityService.create>[0],
    ) => communityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.myCommunities() });
    },
  });
};

export const useJoinCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idOrSlug: string) => communityService.join(idOrSlug),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.detail(variables) });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.memberships() });
    },
  });
};

export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idOrSlug: string) => communityService.leave(idOrSlug),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.detail(variables) });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.memberships() });
    },
  });
};

export const useSubscribeCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      idOrSlug,
      data,
    }: {
      idOrSlug: string;
      data: {
        billingPeriod: 'monthly' | 'yearly';
        provider?: 'paystack' | 'korapay';
        paymentReference?: string;
        callbackUrl?: string;
      };
    }) => communityService.subscribe(idOrSlug, data),
    onSuccess: (_, { idOrSlug }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.detail(idOrSlug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.memberships() });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.earnings() });
    },
  });
};

export const useInitializeCommunityPayment = () => {
  return useMutation({
    mutationFn: ({
      idOrSlug,
      data,
    }: {
      idOrSlug: string;
      data: {
        billingPeriod: 'monthly' | 'yearly';
        provider?: 'paystack' | 'korapay';
        paymentReference?: string;
        callbackUrl?: string;
      };
    }) => communityService.initializePayment(idOrSlug, data),
  });
};

export const useCreatorEarnings = () => {
  return useQuery({
    queryKey: [...queryKeys.community.earnings()],
    queryFn: async () => {
      const response = await communityService.getCreatorEarnings();
      return response.data;
    },
  });
};

export const useRequestCreatorPayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      amount: number;
      bankName: string;
      accountNumber: string;
      accountName?: string;
    }) => communityService.requestCreatorPayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.earnings() });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.payouts() });
    },
  });
};

export const useCommunityNotifications = () => {
  return useQuery({
    queryKey: [...queryKeys.community.notifications()],
    queryFn: async () => {
      const response = await communityService.getCommunityNotifications();
      return response.data;
    },
  });
};

export const useCreateCommunityPost = (idOrSlug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      content: string;
      mediaUrls?: string[];
      location?: string;
      tags?: string[];
      hashtags?: string[];
    }) => communityService.createPost(idOrSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.community.all, 'feed', idOrSlug],
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.detail(idOrSlug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.all });
    },
  });
};

export const useCommunityAnalytics = (idOrSlug: string) => {
  return useQuery({
    queryKey: [...queryKeys.community.detail(idOrSlug), 'analytics'],
    queryFn: async () => {
      const response = await communityService.getAnalytics(idOrSlug);
      return response.data;
    },
    enabled: !!idOrSlug,
  });
};

export const useCommunityTagSuggestions = (q?: string) => {
  return useQuery({
    queryKey: [...queryKeys.community.all, 'tag-suggestions', q || ''],
    queryFn: async () => {
      const response = await communityService.getTagSuggestions(q);
      return response.data;
    },
  });
};

export const useCommunityMembers = (idOrSlug: string) => {
  return useQuery({
    queryKey: [...queryKeys.community.detail(idOrSlug), 'members'],
    queryFn: async () => {
      const response = await communityService.getCommunityMembers(idOrSlug);
      return response.data;
    },
    enabled: !!idOrSlug,
  });
};

export const useSuggestedInvites = (
  idOrSlug: string,
  params?: { limit?: number; q?: string; seed?: number },
) => {
  return useQuery({
    queryKey: [
      ...queryKeys.community.detail(idOrSlug),
      'suggested-invites',
      params?.q || '',
      params?.seed ?? 0,
      params?.limit ?? 6,
    ],
    queryFn: async () => {
      const response = await communityService.getSuggestedInvites(idOrSlug, params);
      return response.data;
    },
    enabled: !!idOrSlug,
    refetchInterval: 60 * 60 * 1000, // Auto-refetch every 1 hour
  });
};

export const useInviteCommunityMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ idOrSlug, userId }: { idOrSlug: string; userId: string }) =>
      communityService.inviteMember(idOrSlug, userId),
    onSuccess: (_, { idOrSlug }) => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.community.detail(idOrSlug), 'members'],
      });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.community.detail(idOrSlug), 'suggested-invites'],
      });
    },
  });
};

export const useAcceptCommunityInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idOrSlug: string) => communityService.acceptInvite(idOrSlug),
    onSuccess: (_, idOrSlug) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.detail(idOrSlug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.memberships() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};

export const useDeclineCommunityInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ idOrSlug, userId }: { idOrSlug: string; userId?: string }) =>
      communityService.declineInvite(idOrSlug, userId),
    onSuccess: (_, { idOrSlug }) => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.community.detail(idOrSlug), 'members'],
      });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.community.detail(idOrSlug), 'suggested-invites'],
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};

export const useUpdateCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      idOrSlug,
      data,
    }: {
      idOrSlug: string;
      data: Parameters<typeof communityService.updateCommunity>[1];
    }) => communityService.updateCommunity(idOrSlug, data),
    onSuccess: (_, { idOrSlug }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.detail(idOrSlug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.myCommunities() });
    },
  });
};

export const useDeleteCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idOrSlug: string) => communityService.deleteCommunity(idOrSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.all });
    },
  });
};

export const useAdminCommunities = (status?: string) => {
  return useQuery({
    queryKey: [...queryKeys.community.all, 'admin', status || 'all'],
    queryFn: async () => {
      const response = await communityService.adminListCommunities(status);
      return response.data;
    },
  });
};

export const useAdminReviewCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        status: 'approved' | 'changes_requested' | 'rejected' | 'pending';
        adminFeedback?: string;
      };
    }) => communityService.adminReviewCommunity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.all });
    },
  });
};

export const useTogglePostLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => communityService.togglePostLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.all });
    },
  });
};

export const useSharePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, platform }: { postId: string; platform?: string }) =>
      communityService.sharePost(postId, platform),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.all });
    },
  });
};

export const useTogglePostSave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => communityService.togglePostSave(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.all });
    },
  });
};

export const useUpdateCommunityPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: string;
      data: Parameters<typeof communityService.updatePost>[1];
    }) => communityService.updatePost(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.all });
    },
  });
};

export const useMySavedCommunityPosts = () => {
  return useQuery({
    queryKey: [...queryKeys.community.all, 'my-saved-posts'],
    queryFn: async () => {
      const response = await communityService.getMySavedPosts();
      return response.data;
    },
  });
};

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: [...queryKeys.community.comments(postId)],
    queryFn: async () => {
      const response = await communityService.getPostComments(postId);
      return response.data;
    },
    enabled: !!postId,
  });
};

export const useCreatePostComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string }) =>
      communityService.createPostComment(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.comments(postId) });
    },
  });
};

