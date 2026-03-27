import { api } from '../client';
import type { ApiResponse } from '../types';
import type { PostsResponse, PostsQueryParams } from '@/types/post';

export const profileService = {
  /** GET /users/me/saved-posts — Get own saved/bookmarked posts */
  getSavedPosts: (params?: PostsQueryParams) => {
    return api.get<ApiResponse<PostsResponse>>('/users/me/saved-posts', { params });
  },

  /** GET /users/:id/posts — Get all posts by a user (for profile page) */
  getUserPosts: (id: string, params?: PostsQueryParams) => {
    return api.get<ApiResponse<PostsResponse>>(`/users/${id}/posts`, { params });
  },

  /** GET /users/:id — Get user profile info */
  getUserProfile: (id: string) => {
    return api.get<ApiResponse<any>>(`/users/${id}`);
  },

  /** POST /users/:id/follow — Follow a user */
  followUser: (id: string) => {
    return api.post<ApiResponse<{ followed: boolean }>>(`/users/${id}/follow`);
  },

  /** DELETE /users/:id/follow — Unfollow a user */
  unfollowUser: (id: string) => {
    return api.delete<ApiResponse<{ unfollowed: boolean }>>(`/users/${id}/follow`);
  },

  /** GET /users — Get list of users (searchable) */
  getUsers: (params?: { search?: string; page?: number; limit?: number }) => {
    return api.get<ApiResponse<any>>("/users", { params });
  },

  /** GET /users/:id/following — Get users followed by a user */
  getFollowing: (id: string, params?: { page?: number; limit?: number }) => {
    return api.get<ApiResponse<any>>(`/users/${id}/following`, { params });
  },
};
