import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {profileService} from './profile.service';
import type {PostsQueryParams} from '@/types/post';
import {queryKeys} from '../types';

export const useSavedPosts = (params?: PostsQueryParams) => {
  return useQuery({
    queryKey: queryKeys.users.savedPosts(params),
    queryFn: () => profileService.getSavedPosts(params),
  });
};

export const useUserPosts = (id: string, params?: PostsQueryParams) => {
  return useQuery({
    queryKey: ['users', id, 'posts', params],
    queryFn: () => profileService.getUserPosts(id, params),
    enabled: !!id,
  });
};

export const useUserProfile = (id: string) => {
  return useQuery({
    queryKey: ['users', id, 'profile'],
    queryFn: () => profileService.getUserProfile(id),
    enabled: !!id,
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
