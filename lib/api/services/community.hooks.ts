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

export const useMyCreatedCommunities = () => {
  return useQuery({
    queryKey: [...queryKeys.community.myCommunities()],
    queryFn: async () => {
      const response = await communityService.getMyCreatedCommunities();
      return response.data;
    },
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
      data: { billingPeriod: 'monthly' | 'yearly'; paymentReference?: string };
    }) => communityService.subscribe(idOrSlug, data),
    onSuccess: (_, { idOrSlug }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.detail(idOrSlug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.memberships() });
    },
  });
};

export const useCreateCommunityPost = (idOrSlug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; mediaUrls?: string[] }) =>
      communityService.createPost(idOrSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.feed(idOrSlug) });
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

