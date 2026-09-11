import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {profileService} from './profile.service';
import type {PostsQueryParams} from '@/types/post';
import {queryKeys} from '../types';

export const useSavedPosts = (params?: PostsQueryParams) => {
  return useQuery({
    queryKey: queryKeys.users.savedPosts(params),
    queryFn: () => profileService.getSavedPosts(params),
  });
};
export const useRePosts = (params?: PostsQueryParams) => {
  return useQuery({
    queryKey: queryKeys.users.reposts(params),
    queryFn: () => profileService.getRePosts(params),
  });
};

export const useUserPosts = (id: string, params?: PostsQueryParams) => {
  return useQuery({
    queryKey: ['users', id, 'posts', params],
    queryFn: () => profileService.getUserPosts(id, params),
    enabled: !!id,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status || error?.status;
      if (status === 403 || status === 401) return false;
      return failureCount < 2;
    },
  });
};

export const useUserProfile = (id: string) => {
  return useQuery({
    queryKey: ['users', id, 'profile'],
    queryFn: () => profileService.getUserProfile(id),
    enabled: !!id,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status || error?.status;
      if (status === 403 || status === 401) return false;
      return failureCount < 2;
    },
  });
};

export const useUserStats = (id: string) => {
  return useQuery({
    queryKey: ['users', id, 'stats'],
    queryFn: () => profileService.getUserStats(id),
    enabled: !!id,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status || error?.status;
      if (status === 403 || status === 401) return false;
      return failureCount < 2;
    },
  });
};

export const useUserReposts = (id: string, params?: PostsQueryParams) => {
  return useQuery({
    queryKey: ['users', id, 'reposts', params],
    queryFn: () => profileService.getUserReposts(id, params),
    enabled: !!id,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status || error?.status;
      if (status === 403 || status === 401) return false;
      return failureCount < 2;
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => profileService.followUser(id),
    onSuccess: (_, id) => {
      // Invalidate all related queries for comprehensive updates
      queryClient.invalidateQueries({queryKey: ['users', id]});
      queryClient.invalidateQueries({queryKey: ['users', {following: true}]});
      queryClient.invalidateQueries({queryKey: ['users', 'list']}); // Suggested list
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => profileService.unfollowUser(id),
    onSuccess: (_, id) => {
      // Invalidate all related queries for comprehensive updates
      queryClient.invalidateQueries({queryKey: ['users', id]});
      queryClient.invalidateQueries({queryKey: ['users', {following: true}]});
      queryClient.invalidateQueries({queryKey: ['users', 'list']}); // Suggested list
    },
  });
};

export const useUsers = (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['users', 'list', params],
    queryFn: () => profileService.getUsers(params),
  });
};

export const useFollowing = (
  id: string,
  params?: {page?: number; limit?: number},
) => {
  return useQuery({
    queryKey: ['users', id, 'following', params],
    queryFn: () => profileService.getFollowing(id, params),
    enabled: !!id,
    refetchInterval: 5000, // Refetch following list every 5 seconds for near real-time updates
  });
};

export const useFollowers = (
  id: string,
  params?: {page?: number; limit?: number},
) => {
  return useQuery({
    queryKey: ['users', id, 'followers', params],
    queryFn: () => profileService.getFollowers(id, params),
    enabled: !!id,
    refetchInterval: 5000, // Refetch followers list every 5 seconds for near real-time updates
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => profileService.blockUser(id),
    onSuccess: (_, id) => {
      // Invalidate target user profile, stats, posts, and block status
      queryClient.invalidateQueries({ queryKey: ['users', id] });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.blocked() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.blockStatus(id) });
      // Invalidate feed and follow relations (mutual unfollow takes effect)
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['users', { following: true }] });
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => profileService.unblockUser(id),
    onSuccess: (_, id) => {
      // Invalidate target user profile and block status
      queryClient.invalidateQueries({ queryKey: ['users', id] });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.blocked() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.blockStatus(id) });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useBlockedUsersList = (params?: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: queryKeys.users.blocked(params),
    queryFn: () => profileService.getBlockedUsers(params),
  });
};

export const useBlockStatus = (id: string) => {
  return useQuery({
    queryKey: queryKeys.users.blockStatus(id),
    queryFn: () => profileService.getBlockStatus(id),
    enabled: !!id,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status || error?.status;
      if (status === 403 || status === 401) return false;
      return failureCount < 2;
    },
  });
};
