import api from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface SocialUser {
  id: string;
  fullName: string;
  username: string;
  avatar: string | null;
  bio?: string | null;
}

export const socialService = {
  /**
   * Get followers of a user
   */
  getFollowers: async (userId: string, page = 1, pageSize = 20) => {
    const response = await api.get<ApiResponse<PaginatedResponse<SocialUser>>>(
      `/users/${userId}/followers`,
      { params: { page, pageSize } }
    );
    return response.data;
  },

  /**
   * Get users a user is following
   */
  getFollowing: async (userId: string, page = 1, pageSize = 20) => {
    const response = await api.get<ApiResponse<PaginatedResponse<SocialUser>>>(
      `/users/${userId}/following`,
      { params: { page, pageSize } }
    );
    return response.data;
  },

  /**
   * Follow a user
   */
  followUser: async (userId: string) => {
    const response = await api.post<ApiResponse<any>>(`/users/${userId}/follow`);
    return response.data;
  },

  /**
   * Unfollow a user
   */
  unfollowUser: async (userId: string) => {
    const response = await api.delete<ApiResponse<any>>(`/users/${userId}/follow`);
    return response.data;
  },
};
