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
  },

  // Add more entity types as needed
} as const;
