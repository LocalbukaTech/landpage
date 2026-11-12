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

// ─── Local Mock-Backed Store for Created Communities ───────────────────────

const LOCAL_COMMUNITIES_KEY = 'localbuka_created_communities_v1';

export function getLocallyCreatedCommunities(): CommunityItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_COMMUNITIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocallyCreatedCommunity(item: CommunityItem): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocallyCreatedCommunities().filter(
      (c) => c.slug !== item.slug && c.id !== item.id,
    );
    window.localStorage.setItem(
      LOCAL_COMMUNITIES_KEY,
      JSON.stringify([item, ...existing]),
    );
  } catch {
    // ignore storage quota errors
  }
}

// ─── Service ───────────────────────────────────────────────────────────────

export const communityService = {
  /** GET /community — Explore/discover communities */
  explore: async (params?: ExploreCommunitiesParams) => {
    const res = await api.get<ApiResponse<PaginatedCommunitiesResponse>>('/community', {
      params,
    });
    const localItems = getLocallyCreatedCommunities().filter((c) => {
      if (params?.tab === 'Free') return c.isFree;
      if (params?.tab === 'Paid') return !c.isFree;
      return true;
    });
    if (localItems.length > 0 && res?.data?.items) {
      const remoteSlugs = new Set(res.data.items.map((i) => i.slug));
      const uniqueLocal = localItems.filter((l) => !remoteSlugs.has(l.slug));
      res.data.items = [...uniqueLocal, ...res.data.items];
      res.data.total = (res.data.total || 0) + uniqueLocal.length;
    }
    return res;
  },

  /** GET /community/:idOrSlug — Single community detail */
  getOne: async (idOrSlug: string) => {
    const localMatch = getLocallyCreatedCommunities().find(
      (c) => c.slug === idOrSlug || c.id === idOrSlug,
    );
    try {
      return await api.get<ApiResponse<CommunityItem>>(`/community/${idOrSlug}`);
    } catch (err) {
      if (localMatch) {
        return {
          success: true,
          message: 'Loaded from creator store',
          data: localMatch,
        } as ApiResponse<CommunityItem>;
      }
      throw err;
    }
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
  getMyCreatedCommunities: async () => {
    const local = getLocallyCreatedCommunities();
    try {
      const res = await api.get<ApiResponse<CommunityItem[]>>(
        '/community/creator/my-communities',
      );
      if (local.length > 0 && Array.isArray(res?.data)) {
        const remoteSlugs = new Set(res.data.map((i) => i.slug));
        res.data = [...local.filter((l) => !remoteSlugs.has(l.slug)), ...res.data];
      }
      return res;
    } catch {
      return {
        success: true,
        message: 'Loaded local creator communities',
        data: local,
      } as ApiResponse<CommunityItem[]>;
    }
  },

  /** POST /community/create — Create new community (with mock-backed fallback) */
  create: async (data: {
    name: string;
    description: string;
    category: 'free' | 'paid';
    slug?: string;
    costBracket?: string;
    pricePerMonth?: number;
    pricePerYear?: number;
    billingSchedule?: 'monthly' | 'quarterly' | 'yearly';
    payoutSchedule?: string;
    primaryPaymentMethod?: string;
    paymentPlatforms?: string[];
    payoutAccount?: {
      bankCode: string;
      bankName: string;
      accountNumber: string;
      accountName: string;
    };
    paymentLinks?: Record<string, string>;
    coverImage?: string;
    avatar?: string;
    accent?: 'yellow' | 'green' | 'blue' | 'rose';
    benefits?: string[];
  }) => {
    const isFree = data.category === 'free';
    const effectivePrice = isFree ? 0 : Math.max(2000, data.pricePerMonth || 2000);
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      `community-${Date.now()}`;

    const mockCreatedItem: CommunityItem = {
      id: `local-${Date.now()}`,
      name: data.name,
      slug,
      creator: data.payoutAccount?.accountName
        ? `By ${data.payoutAccount.accountName}`
        : 'By Creator',
      ownerLine: data.payoutAccount?.accountName
        ? `Created by ${data.payoutAccount.accountName}`
        : 'Created by You',
      members: '1 member',
      posts: '0 posts',
      price: isFree ? 'Free' : `Paid · ₦${effectivePrice.toLocaleString('en-NG')}/mo`,
      priceBadge: isFree ? 'Free' : `₦${effectivePrice.toLocaleString('en-NG')}/mo`,
      priceAmount: effectivePrice,
      yearlyPriceAmount: isFree ? 0 : data.pricePerYear || effectivePrice * 10,
      isFree,
      image: data.coverImage || data.avatar || '/images/community/cover-1.jpg',
      coverImage: data.coverImage || data.avatar || '/images/community/cover-1.jpg',
      avatar: data.avatar || '/images/community/cover-1.jpg',
      accent: data.accent || (isFree ? 'green' : 'yellow'),
      description: data.description,
      benefits: data.benefits || [],
      shares: [
        { id: '1', icon: 'recipe', title: 'Recipes and cooking tips' },
        { id: '2', icon: 'chat', title: 'Food discussions' },
        { id: '3', icon: 'media', title: 'Videos and photos' },
      ],
      status: 'approved',
      isRecommended: true,
      isTrending: true,
      isMember: true,
      memberRole: 'creator',
    };

    try {
      const response = await api.post<ApiResponse<CommunityItem>>('/community/create', {
        name: data.name,
        slug,
        description: data.description,
        category: data.category,
        pricePerMonth: effectivePrice,
        pricePerYear: isFree ? 0 : data.pricePerYear || effectivePrice * 10,
        coverImage: data.coverImage || data.avatar,
        avatar: data.avatar,
        accent: data.accent || (isFree ? 'green' : 'yellow'),
        benefits: data.benefits || [],
      });
      if (response?.data) {
        saveLocallyCreatedCommunity(response.data);
      }
      return response;
    } catch {
      saveLocallyCreatedCommunity(mockCreatedItem);
      return {
        success: true,
        message: 'Community created successfully',
        data: mockCreatedItem,
      } as ApiResponse<CommunityItem>;
    }
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
    image: item.coverImage || item.image,
    coverImage: item.coverImage || item.image,
    avatar: item.avatar || item.image,
    accent: item.accent,
    description: item.description,
    benefits: item.benefits,
    shares: item.shares,
  };
}

