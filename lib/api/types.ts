// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Query keys for React Query
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Waitlist
  waitlist: {
    all: ['waitlist'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.waitlist.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.waitlist.all, 'detail', id] as const,
  },

  // Teams
  teams: {
    all: ['teams'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.teams.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.teams.all, 'detail', id] as const,
  },

  // Blog
  blog: {
    all: ['blog'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.blog.all, 'list', filters] as const,
    detail: (slug: string) => [...queryKeys.blog.all, 'detail', slug] as const,
    comments: (blogId: string) => [...queryKeys.blog.all, 'comments', blogId] as const,
  },

  // Users (Admin)
  users: {
    all: ['users'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.users.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
    savedPosts: (params?: Record<string, any>) => [...queryKeys.users.all, 'me', 'saved-posts', params] as const,
    reposts: (params?: Record<string, any>) => [...queryKeys.users.all, 'me', 'reposts', params] as const,
  },

  // Simple string keys for common queries
  blogs: 'blogs',

  // Restaurants
  restaurants: {
    all: ['restaurants'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.restaurants.all, 'list', filters] as const,
    trending: (filters?: Record<string, unknown>) => [...queryKeys.restaurants.all, 'trending', filters] as const,
    search: (filters?: Record<string, unknown>) =>
      [...queryKeys.restaurants.all, 'search', filters] as const,
    cuisine: (cuisine: string, filters?: Record<string, unknown>) =>
      [...queryKeys.restaurants.all, 'cuisine', cuisine, filters] as const,
    detail: (id: string) => [...queryKeys.restaurants.all, 'detail', id] as const,
    saved: () => [...queryKeys.restaurants.all, 'saved'] as const,
    reviews: (id: string) => [...queryKeys.restaurants.all, 'reviews', id] as const,
    googleReviews: (id: string) => [...queryKeys.restaurants.all, 'google-reviews', id] as const,
  },
  
  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.notifications.all, 'list', filters] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unread-count'] as const,
  },

  // Social
  social: {
    all: ['social'] as const,
    followers: (userId: string) => [...queryKeys.social.all, 'followers', userId] as const,
    following: (userId: string) => [...queryKeys.social.all, 'following', userId] as const,
  },

  // Posts / Feed
  posts: {
    all: ['posts'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.posts.all, 'list', filters] as const,
    feed: (filters?: Record<string, unknown>) =>
      [...queryKeys.posts.all, 'feed', filters] as const,
    detail: (id: string) => [...queryKeys.posts.all, 'detail', id] as const,
    comments: (postId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.posts.all, 'comments', postId, filters] as const,
  },

  // Rewards & Referrals
  referrals: {
    all: ['referrals'] as const,
    code: () => [...queryKeys.referrals.all, 'code'] as const,
    dashboard: () => [...queryKeys.referrals.all, 'dashboard'] as const,
    wallet: () => [...queryKeys.referrals.all, 'wallet'] as const,
    transactions: (params?: Record<string, any>) =>
      [...queryKeys.referrals.all, 'transactions', params] as const,
    leaderboard: (params?: Record<string, any>) =>
      [...queryKeys.referrals.all, 'leaderboard', params] as const,
  },
  rewards: {
    all: ['rewards'] as const,
    dashboard: () => [...queryKeys.rewards.all, 'dashboard'] as const,
    wallet: () => [...queryKeys.rewards.all, 'wallet'] as const,
    code: () => [...queryKeys.rewards.all, 'code'] as const,
    transactions: (params?: Record<string, any>) =>
      [...queryKeys.rewards.all, 'transactions', params] as const,
    leaderboard: (params?: Record<string, any>) =>
      [...queryKeys.rewards.all, 'leaderboard', params] as const,
  },

  // Admin Rewards & Referrals
  adminRewards: {
    all: ['admin-rewards'] as const,
    overview: () => [...queryKeys.adminRewards.all, 'overview'] as const,
    referrals: (params?: Record<string, any>) =>
      [...queryKeys.adminRewards.all, 'referrals', params] as const,
    referralDetail: (id: string) =>
      [...queryKeys.adminRewards.all, 'referrals', id] as const,
    transactions: (params?: Record<string, any>) =>
      [...queryKeys.adminRewards.all, 'transactions', params] as const,
    flagged: (params?: Record<string, any>) =>
      [...queryKeys.adminRewards.all, 'flagged', params] as const,
    topReferrers: (limit?: number) =>
      [...queryKeys.adminRewards.all, 'top-referrers', limit] as const,
    vanityCodes: (params?: Record<string, any>) =>
      [...queryKeys.adminRewards.all, 'vanity-codes', params] as const,
  },

  // Add more entity types as needed
} as const;


