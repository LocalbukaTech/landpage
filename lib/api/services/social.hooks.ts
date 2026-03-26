import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialService } from './social.service';
import { queryKeys } from '../types';

export const useFollowers = (userId: string, page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: queryKeys.social.followers(userId),
    queryFn: () => socialService.getFollowers(userId, page, pageSize),
    enabled: !!userId,
  });
};

export const useFollowing = (userId: string, page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: queryKeys.social.following(userId),
    queryFn: () => socialService.getFollowing(userId, page, pageSize),
    enabled: !!userId,
  });
};

export const useFollowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => socialService.followUser(userId),
    onSuccess: (_, userId) => {
      // Invalidate both followers and following queries for both users
      queryClient.invalidateQueries({ queryKey: queryKeys.social.all });
    },
  });
};

export const useUnfollowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => socialService.unfollowUser(userId),
    onSuccess: (_, userId) => {
      // Invalidate both followers and following queries for both users
      queryClient.invalidateQueries({ queryKey: queryKeys.social.all });
    },
  });
};
