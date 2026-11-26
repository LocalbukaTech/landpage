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
  visibility?: boolean;
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
  location?: string | null;
  tags?: string[];
  hashtags?: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount?: number;
  savesCount?: number;
  isPinned: boolean;
  isArchived?: boolean;
  hasLiked: boolean;
  hasSaved?: boolean;
  createdAt: string;
}

export interface CommunityAnalyticsResponse {
  communityId: string | null;
  communityName: string;
  activeMembers: number;
  activePaidSubscriptions: number;
  grossRevenue: number;
  postsCount: number;
  recentHashtags: string[];
  growthPoints: Array<{ label: string; posts: number; members: number }>;
}

export interface CommunityTagSuggestionsResponse {
  communities: Array<{
    id: string;
    handle: string;
    label: string;
    subtitle: string;
    category: 'community';
  }>;
  hashtags: string[];
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

export interface CreatorEarningsSummary {
  availableBalance: number;
  grossRevenue: number;
  creatorSharePercent: number;
  platformFeePercent: number;
  platformFee: number;
  paidSubscribersCount: number;
  totalCommunities: number;
  holdingPeriodDays: number;
  currency: string;
  supportedGateways: string[];
}

export interface PaymentInitializeResponse {
  provider: 'paystack' | 'korapay';
  reference: string;
  authorizationUrl: string | null;
  accessCode?: string;
  amount: number;
  currency: string;
  creatorShare: number;
  platformFee: number;
  billingPeriod: 'monthly' | 'yearly';
  communityId?: string;
  communityName?: string;
  mode: 'live' | 'ready';
}

export interface CommunityNotificationItem {
  id: string;
  type: 'comment' | 'post' | 'like' | 'membership';
  title: string;
  time: string;
  avatar: string;
  thumbnail?: string | null;
  communityId?: string;
  postId?: string;
  isNew: boolean;
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

// ─── Legacy Local Community Cache Cleanup ──────────────────────────────────

const LOCAL_COMMUNITIES_KEY = 'localbuka_created_communities_v1';

function clearLegacyLocalCommunities(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(LOCAL_COMMUNITIES_KEY);
  } catch {
    // ignore storage errors
  }
}

export function getLocallyCreatedCommunities(): CommunityItem[] {
  clearLegacyLocalCommunities();
  return [];
}

export function saveLocallyCreatedCommunity(_item: CommunityItem): void {
  clearLegacyLocalCommunities();
}

// ─── Service ───────────────────────────────────────────────────────────────

export const communityService = {
  /** GET /community — Explore/discover communities */
  explore: async (params?: ExploreCommunitiesParams) => {
    clearLegacyLocalCommunities();
    return api.get<ApiResponse<PaginatedCommunitiesResponse>>('/community', {
      params,
    });
  },

  /** GET /community/:idOrSlug — Single community detail */
  getOne: async (idOrSlug: string) => {
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
    data: {
      billingPeriod: 'monthly' | 'yearly';
      provider?: 'paystack' | 'korapay';
      paymentReference?: string;
      callbackUrl?: string;
    },
  ) => {
    return api.post<ApiResponse<{ success: boolean; message: string; membership: any }>>(
      `/community/${idOrSlug}/subscribe`,
      data,
    );
  },

  /** POST /community/:idOrSlug/payment/initialize — Initialize Paystack or Korapay payment */
  initializePayment: (
    idOrSlug: string,
    data: {
      billingPeriod: 'monthly' | 'yearly';
      provider?: 'paystack' | 'korapay';
      paymentReference?: string;
      callbackUrl?: string;
    },
  ) => {
    return api.post<ApiResponse<PaymentInitializeResponse>>(
      `/community/${idOrSlug}/payment/initialize`,
      data,
    );
  },

  /** GET /community/creator/earnings — Creator earnings & revenue share */
  getCreatorEarnings: () => {
    return api.get<ApiResponse<CreatorEarningsSummary>>('/community/creator/earnings');
  },

  /** POST /community/creator/payouts — Request creator payout withdrawal */
  requestCreatorPayout: (data: {
    amount: number;
    bankName: string;
    accountNumber: string;
    accountName?: string;
  }) => {
    return api.post<
      ApiResponse<{
        success: boolean;
        reference: string;
        amount: number;
        bankName: string;
        accountNumber: string;
        status: string;
        message: string;
      }>
    >('/community/creator/payouts', data);
  },

  /** GET /community/notifications/feed — Community notifications */
  getCommunityNotifications: () => {
    return api.get<ApiResponse<{ items: CommunityNotificationItem[]; total: number }>>(
      '/community/notifications/feed',
    );
  },

  /** GET /community/me/memberships — Current user's active memberships */
  getMyMemberships: () => {
    return api.get<ApiResponse<CommunityMembership[]>>('/community/me/memberships');
  },

  /** GET /community/creator/my-communities — Creator's communities */
  getMyCreatedCommunities: async () => {
    clearLegacyLocalCommunities();
    return api.get<ApiResponse<CommunityItem[]>>(
      '/community/creator/my-communities',
    );
  },

  /** POST /community/create — Create new community */
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

    clearLegacyLocalCommunities();
    return api.post<ApiResponse<CommunityItem>>('/community/create', {
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
  },

  /** GET /community/:idOrSlug/feed — Get community feed posts */
  getFeed: (idOrSlug: string, params?: FeedParams) => {
    return api.get<ApiResponse<PaginatedCommunityFeedResponse>>(
      `/community/${idOrSlug}/feed`,
      { params },
    );
  },

  /** POST /community/:idOrSlug/posts — Create post in community (or draft) */
  createPost: (
    idOrSlug: string,
    data: {
      content: string;
      mediaUrls?: string[];
      location?: string;
      tags?: string[];
      hashtags?: string[];
      isDraft?: boolean;
    },
  ) => {
    return api.post<ApiResponse<CommunityPost>>(`/community/${idOrSlug}/posts`, data);
  },

  /** GET /community/:idOrSlug/drafts — Get creator drafts in community */
  getDrafts: (idOrSlug: string) => {
    return api.get<ApiResponse<CommunityPost[]>>(`/community/${idOrSlug}/drafts`);
  },

  /** DELETE /community/posts/:postId — Delete or discard community post or draft */
  deletePost: (postId: string) => {
    return api.delete<ApiResponse<{ success: boolean; message: string }>>(
      `/community/posts/${postId}`,
    );
  },

  /** GET /community/:idOrSlug/analytics — Real performance analytics & 7-day growth chart */
  getAnalytics: (idOrSlug: string) => {
    return api.get<ApiResponse<CommunityAnalyticsResponse>>(
      `/community/${idOrSlug}/analytics`,
    );
  },

  /** GET /community/tags/suggestions — Real taggable fellow communities & used hashtags */
  getTagSuggestions: (q?: string) => {
    return api.get<ApiResponse<CommunityTagSuggestionsResponse>>(
      '/community/tags/suggestions',
      { params: q ? { q } : undefined },
    );
  },

  /** GET /community/:idOrSlug/members — Real members list for a community */
  getCommunityMembers: (idOrSlug: string) => {
    return api.get<
      ApiResponse<
        Array<{
          id: string;
          userId: string;
          name: string;
          username: string;
          avatar: string;
          role: string;
          status: 'Active' | 'Pending Invite' | 'Expiring soon' | 'Cancelled';
          membershipType: string;
          joinedAt: string;
          expiresAt?: string | null;
        }>
      >
    >(`/community/${idOrSlug}/members`);
  },

  /** GET /community/:idOrSlug/suggested-invites — Hourly-rotating real unjoined users */
  getSuggestedInvites: (
    idOrSlug: string,
    params?: { limit?: number; q?: string; seed?: number },
  ) => {
    return api.get<
      ApiResponse<{
        items: Array<{
          id: string;
          name: string;
          username: string;
          avatar: string | null;
        }>;
        totalAvailable: number;
        rotationIntervalMinutes: number;
        nextRefreshAt: string;
      }>
    >(`/community/${idOrSlug}/suggested-invites`, { params });
  },

  /** POST /community/:idOrSlug/invite — Send pending invitation to a real user */
  inviteMember: (idOrSlug: string, userId: string) => {
    return api.post<
      ApiResponse<{ success: boolean; status: string; message: string }>
    >(`/community/${idOrSlug}/invite`, { userId });
  },

  /** POST /community/:idOrSlug/invite/accept — Accept pending invitation */
  acceptInvite: (idOrSlug: string) => {
    return api.post<ApiResponse<{ success: boolean; message: string }>>(
      `/community/${idOrSlug}/invite/accept`,
    );
  },

  /** POST /community/:idOrSlug/invite/decline — Decline or cancel pending invitation */
  declineInvite: (idOrSlug: string, userId?: string) => {
    return api.post<ApiResponse<{ success: boolean; message: string }>>(
      `/community/${idOrSlug}/invite/decline`,
      userId ? { userId } : {},
    );
  },

  /** PATCH /community/:idOrSlug — Update community settings (Creator or Admin) */
  updateCommunity: (
    idOrSlug: string,
    data: {
      name?: string;
      description?: string;
      coverImage?: string;
      avatar?: string;
      benefits?: string[];
      pricePerMonth?: number;
      pricePerYear?: number;
      visibility?: boolean;
    },
  ) => {
    return api.patch<ApiResponse<CommunityItem>>(`/community/${idOrSlug}`, data);
  },

  /** DELETE /community/:idOrSlug — Delete a community (Creator or Admin) */
  deleteCommunity: (idOrSlug: string) => {
    return api.delete<ApiResponse<{ success: boolean; message: string }>>(
      `/community/${idOrSlug}`,
    );
  },

  /** GET /community/admin/all — Admin list of all submitted communities */
  adminListCommunities: (status?: string) => {
    return api.get<
      ApiResponse<
        Array<
          CommunityItem & {
            adminFeedback?: string | null;
            creatorEmail?: string | null;
            createdAt?: string;
          }
        >
      >
    >('/community/admin/all', { params: status ? { status } : undefined });
  },

  /** PATCH /community/admin/:id/review — Admin Approve, Request Changes, or Reject */
  adminReviewCommunity: (
    id: string,
    data: {
      status: 'approved' | 'changes_requested' | 'rejected' | 'pending';
      adminFeedback?: string;
    },
  ) => {
    return api.patch<ApiResponse<{ success: boolean; message: string; data: CommunityItem }>>(
      `/community/admin/${id}/review`,
      data,
    );
  },

  /** POST /community/posts/:postId/like — Toggle like on post */
  togglePostLike: (postId: string) => {
    return api.post<ApiResponse<{ liked: boolean; likesCount: number }>>(
      `/community/posts/${postId}/like`,
    );
  },

  /** POST /community/posts/:postId/share — Record share event on post */
  sharePost: (postId: string, platform?: string) => {
    return api.post<ApiResponse<{ postId: string; sharesCount: number; platform: string }>>(
      `/community/posts/${postId}/share`,
      { platform: platform || 'copy_link' },
    );
  },

  /** POST /community/posts/:postId/save — Toggle bookmark/save on post */
  togglePostSave: (postId: string) => {
    return api.post<ApiResponse<{ saved: boolean; savesCount: number }>>(
      `/community/posts/${postId}/save`,
    );
  },

  /** PATCH /community/posts/:postId — Edit or archive a community post */
  updatePost: (
    postId: string,
    data: {
      content?: string;
      mediaUrls?: string[];
      location?: string | null;
      tags?: string[];
      hashtags?: string[];
      isArchived?: boolean;
      isPinned?: boolean;
    },
  ) => {
    return api.patch<ApiResponse<CommunityPost>>(
      `/community/posts/${postId}`,
      data,
    );
  },

  /** GET /community/me/saved-posts — Saved community posts for current user */
  getMySavedPosts: () => {
    return api.get<
      ApiResponse<
        Array<{
          id: string;
          communityId: string;
          communityName: string;
          caption: string;
          mediaUrl?: string | null;
          authorName: string;
          authorAvatar?: string | null;
          savedAt: string;
        }>
      >
    >('/community/me/saved-posts');
  },

  /** GET /community/posts/:postId/comments — Get comments on post */
  getPostComments: (postId: string, params?: { page?: number; limit?: number }) => {
    const page = params?.page && params.page > 0 ? params.page : 1;
    const limit = params?.limit && params.limit > 0 ? params.limit : 20;
    return api.get<ApiResponse<{ comments: CommunityComment[]; total: number; page: number; limit: number }>>(
      `/community/posts/${postId}/comments`,
      { params: { page, limit } },
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

