/**
 * API Module Index
 *
 * Central export point for all API-related functionality
 */

// Core API client
export {default as apiClient, api, API_BASE_URL} from './client';

// React Query configuration
export {queryClient, createQueryClient} from './query-client';

// Types
export * from './types';

// Custom hooks
export * from './hooks';

// Auth domain
export * from './services/auth.service';
export * from './services/auth.hooks';

// Teams domain
export * from './services/teams.service';
export * from './services/teams.hooks';

// Blog domain
export * from './services/blog.service';
export * from './services/blog.hooks';
