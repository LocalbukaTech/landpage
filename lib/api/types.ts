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
  },

  // Simple string keys for common queries
  blogs: 'blogs',

  // Restaurants
  restaurants: {
    all: ['restaurants'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.restaurants.all, 'list', filters] as const,
    trending: () => [...queryKeys.restaurants.all, 'trending'] as const,
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

  // Add more entity types as needed
} as const;


