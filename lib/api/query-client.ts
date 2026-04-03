import {QueryClient, DefaultOptions} from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    // Default settings for all queries
    retry: 1, // Retry failed requests once
    refetchOnWindowFocus: true, // REFETCH when user switches back to window
    refetchOnReconnect: true, // Refetch when reconnecting
    staleTime: 1000, // Data is fresh for 1 second (aggressive)
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes (formerly cacheTime)
  },
  mutations: {
    // Default settings for all mutations
    retry: 0, // Don't retry mutations
  },
};

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
};

// Create a singleton instance for the client
export const queryClient = createQueryClient();
