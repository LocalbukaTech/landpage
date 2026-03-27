import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from './profile.service';
import type { PostsQueryParams } from '@/types/post';
import { queryKeys } from '../types';

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
      // Invalidate relevant queries like profile stats, feed, etc.
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => profileService.unfollowUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
};

export const useUsers = (params?: { search?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['users', 'list', params],
    queryFn: () => profileService.getUsers(params),
  });
};

export const useFollowing = (id: string, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['users', id, 'following', params],
    queryFn: () => profileService.getFollowing(id, params),
    enabled: !!id,
  });
};
