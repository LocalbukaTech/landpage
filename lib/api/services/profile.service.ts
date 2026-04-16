import {api} from '../client';
import type {ApiResponse} from '../types';
import type {PostsQueryParams, PostsResponse} from '@/types/post';

export const profileService = {
  /** GET /users/me/saved-posts — Get own saved/bookmarked posts */
  getSavedPosts: (params?: PostsQueryParams) => {
    return api.get<ApiResponse<PostsResponse>>('/users/me/saved-posts', {
      params,
    });
  },
  /** GET /users/me/reposts — Get own reposted posts */
  getRePosts: (params?: PostsQueryParams) => {
    return api.get<ApiResponse<PostsResponse>>('/users/me/reposts', {params});
  },

  /** GET /users/:id/posts — Get all posts by a user (for profile page) */
  getUserPosts: (id: string, params?: PostsQueryParams) => {
    return api.get<ApiResponse<PostsResponse>>(`/users/${id}/posts`, {params});
  },

  /** GET /users/:id — Get user profile info */
  getUserProfile: (id: string) => {
    return api.get<ApiResponse<any>>(`/users/${id}`);
  },

  /** GET /users/:id/stats — Get user stats */
  getUserStats: (id: string) => {
    return api.get<ApiResponse<any>>(`/users/${id}/stats`);
  },

  /** GET /users/:id/reposts — Get reposts by a specific user */
  getUserReposts: (id: string, params?: PostsQueryParams) => {
    return api.get<ApiResponse<PostsResponse>>(`/users/${id}/reposts`, {
      params,
    });
  },

  /** POST /users/:id/follow — Follow a user */
  followUser: (id: string) => {
    return api.post<ApiResponse<{followed: boolean}>>(`/users/${id}/follow`);
  },

  /** DELETE /users/:id/follow — Unfollow a user */
  unfollowUser: (id: string) => {
    return api.delete<ApiResponse<{unfollowed: boolean}>>(
      `/users/${id}/follow`,
    );
  },

  /** GET /users — Get list of users (searchable) */
  getUsers: (params?: {search?: string; page?: number; limit?: number}) => {
    return api.get<ApiResponse<any>>('/users', {params});
  },

  /** GET /users/:id/following — Get users followed by a user */
  getFollowing: (id: string, params?: {page?: number; limit?: number}) => {
    return api.get<ApiResponse<any>>(`/users/${id}/following`, {params});
  },

  /** GET /users/:id/followers — Get users following a user */
  getFollowers: (id: string, params?: {page?: number; limit?: number}) => {
    return api.get<ApiResponse<any>>(`/users/${id}/followers`, {params});
  },
};
