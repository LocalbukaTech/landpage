import { api } from '../client';
import { ApiResponse } from '../types';
import type { MobileCommunityItem } from '@/components/community/mobile/types';

// ─── API Response Types ────────────────────────────────────────────────────

export interface CommunityItem {
  id: string;
  name: string;
  slug: string;
  creator: string;
  ownerLine: string;
  members: string;
  posts: string;
  price: string;
  priceBadge: string;
  priceAmount: number;
  yearlyPriceAmount: number;
  isFree: boolean;
  image: string;
  coverImage?: string;
  avatar?: string;
  accent: 'yellow' | 'green' | 'blue' | 'rose';
  description: string;
  benefits?: string[];
  shares?: { id: string; icon: 'recipe' | 'chat' | 'media'; title: string }[];
  status: string;
  isRecommended: boolean;
  isTrending: boolean;
  isMember: boolean;
  memberRole: string | null;
}

export interface PaginatedCommunitiesResponse {
  items: CommunityItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  author: { id: string; fullName: string; avatar?: string | null };
  content: string;
  mediaUrls: string[];
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  hasLiked: boolean;
  createdAt: string;
}

export interface PaginatedCommunityFeedResponse {
  items: CommunityPost[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CommunityComment {
  id: string;
  postId: string;
  content: string;
  author: { id: string; fullName: string; avatar?: string | null };
  createdAt: string;
}

export interface CommunityMembership {
  id: string;
  communityId: string;
  community: CommunityItem;
  role: string;
  status: string;
  membershipType: string;
  joinedAt: string;
}

// ─── Query Params ──────────────────────────────────────────────────────────

export interface ExploreCommunitiesParams {
  tab?: 'Recommended' | 'Trending' | 'Free' | 'Paid' | 'All';
  search?: string;
  page?: number;
  limit?: number;
}

export interface FeedParams {
  page?: number;
  limit?: number;
}

// ─── Service ───────────────────────────────────────────────────────────────

export const communityService = {
  /** GET /community — Explore/discover communities */
  explore: (params?: ExploreCommunitiesParams) => {
    return api.get<ApiResponse<PaginatedCommunitiesResponse>>('/community', { params });
  },

  /** GET /community/:idOrSlug — Single community detail */
  getOne: (idOrSlug: string) => {
    return api.get<ApiResponse<CommunityItem>>(`/community/${idOrSlug}`);
  },

  /** POST /community/:idOrSlug/join — Join a free community */
  join: (idOrSlug: string) => {
    return api.post<ApiResponse<{ success: boolean; message: string; membership: any }>>(
      `/community/${idOrSlug}/join`,
    );
  },

  /** POST /community/:idOrSlug/leave — Leave a community */
  leave: (idOrSlug: string) => {
    return api.post<ApiResponse<{ success: boolean; message: string }>>(
      `/community/${idOrSlug}/leave`,
    );
  },

  /** POST /community/:idOrSlug/subscribe — Subscribe to paid community */
  subscribe: (
    idOrSlug: string,
    data: { billingPeriod: 'monthly' | 'yearly'; paymentReference?: string },
  ) => {
    return api.post<ApiResponse<{ success: boolean; message: string; membership: any }>>(
      `/community/${idOrSlug}/subscribe`,
      data,
    );
  },

  /** GET /community/me/memberships — Current user's active memberships */
  getMyMemberships: () => {
    return api.get<ApiResponse<CommunityMembership[]>>('/community/me/memberships');
  },

  /** GET /community/creator/my-communities — Creator's communities */
  getMyCreatedCommunities: () => {
    return api.get<ApiResponse<CommunityItem[]>>('/community/creator/my-communities');
  },

  /** POST /community/create — Create new community */
  create: (data: {
    name: string;
    description: string;
    category: 'free' | 'paid';
    slug?: string;
    pricePerMonth?: number;
    pricePerYear?: number;
    coverImage?: string;
    avatar?: string;
    accent?: 'yellow' | 'green' | 'blue' | 'rose';
    benefits?: string[];
  }) => {
    return api.post<ApiResponse<CommunityItem>>('/community/create', data);
  },

  /** GET /community/:idOrSlug/feed — Get community feed posts */
  getFeed: (idOrSlug: string, params?: FeedParams) => {
    return api.get<ApiResponse<PaginatedCommunityFeedResponse>>(
      `/community/${idOrSlug}/feed`,
      { params },
    );
  },

  /** POST /community/:idOrSlug/posts — Create post in community */
  createPost: (idOrSlug: string, data: { content: string; mediaUrls?: string[] }) => {
    return api.post<ApiResponse<CommunityPost>>(`/community/${idOrSlug}/posts`, data);
  },

  /** POST /community/posts/:postId/like — Toggle like on post */
  togglePostLike: (postId: string) => {
    return api.post<ApiResponse<{ liked: boolean; likesCount: number }>>(
      `/community/posts/${postId}/like`,
    );
  },

  /** GET /community/posts/:postId/comments — Get comments on post */
  getPostComments: (postId: string, params?: { page?: number; limit?: number }) => {
    return api.get<ApiResponse<{ comments: CommunityComment[]; total: number; page: number; limit: number }>>(
      `/community/posts/${postId}/comments`,
      { params },
    );
  },

  /** POST /community/posts/:postId/comments — Add comment to post */
  createPostComment: (postId: string, data: { content: string }) => {
    return api.post<ApiResponse<CommunityComment>>(
      `/community/posts/${postId}/comments`,
      data,
    );
  },
};

// ─── Adapter: Convert API response to MobileCommunityItem shape ────────────

export function toMobileCommunityItem(item: CommunityItem): MobileCommunityItem {
  return {
    id: item.slug || item.id,
    name: item.name,
    creator: item.creator,
    ownerLine: item.ownerLine,
    members: item.members,
    posts: item.posts,
    priceBadge: item.priceBadge,
    priceAmount: item.priceAmount,
    yearlyPriceAmount: item.yearlyPriceAmount,
    isFree: item.isFree,
    image: item.image,
    coverImage: item.coverImage,
    avatar: item.avatar,
    accent: item.accent,
    description: item.description,
    benefits: item.benefits,
    shares: item.shares,
  };
}

