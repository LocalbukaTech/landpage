import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
  useQueryClient,
} from '@tanstack/react-query';
import {api} from './client';
import {ApiError} from './types';
import {AxiosError} from 'axios';

/**
 * Custom hook for GET requests
 * @param queryKey - Unique key for the query
 * @param url - API endpoint URL
 * @param options - Additional React Query options
 */
export function useApiQuery<TData = any, TError = AxiosError<ApiError>>(
  queryKey: QueryKey,
  url: string,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: () => api.get<TData>(url),
    ...options,
  });
}

/**
 * Custom hook for POST requests (mutations)
 * @param url - API endpoint URL
 * @param options - Additional React Query mutation options
 */
export function useApiPost<
  TData = any,
  TVariables = any,
  TError = AxiosError<ApiError>
>(url: string, options?: UseMutationOptions<TData, TError, TVariables>) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: (data: TVariables) => api.post<TData>(url, data),
    ...options,
  });
}

/**
 * Custom hook for PUT requests (mutations)
 * @param url - API endpoint URL or function that returns URL based on variables
 * @param options - Additional React Query mutation options
 */
export function useApiPut<
  TData = any,
  TVariables = any,
  TError = AxiosError<ApiError>
>(
  url: string | ((variables: TVariables) => string),
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: (data: TVariables) => {
      const endpoint = typeof url === 'function' ? url(data) : url;
      return api.put<TData>(endpoint, data);
    },
    ...options,
  });
}

/**
 * Custom hook for PATCH requests (mutations)
 * @param url - API endpoint URL or function that returns URL based on variables
 * @param options - Additional React Query mutation options
 */
export function useApiPatch<
  TData = any,
  TVariables = any,
  TError = AxiosError<ApiError>
>(
  url: string | ((variables: TVariables) => string),
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: (data: TVariables) => {
      const endpoint = typeof url === 'function' ? url(data) : url;
      return api.patch<TData>(endpoint, data);
    },
    ...options,
  });
}

/**
 * Custom hook for DELETE requests (mutations)
 * @param url - API endpoint URL or function that returns URL based on variables
 * @param options - Additional React Query mutation options
 */
export function useApiDelete<
  TData = any,
  TVariables = any,
  TError = AxiosError<ApiError>
>(
  url: string | ((variables: TVariables) => string),
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: (variables: TVariables) => {
      const endpoint = typeof url === 'function' ? url(variables) : url;
      return api.delete<TData>(endpoint);
    },
    ...options,
  });
}

/**
 * Hook to manually invalidate queries
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return {
    invalidate: (queryKey: QueryKey) => {
      queryClient.invalidateQueries({queryKey});
    },
    invalidateAll: () => {
      queryClient.invalidateQueries();
    },
  };
}

/**
 * Hook to manually refetch queries
 */
export function useRefetchQueries() {
  const queryClient = useQueryClient();

  return {
    refetch: (queryKey: QueryKey) => {
      queryClient.refetchQueries({queryKey});
    },
    refetchAll: () => {
      queryClient.refetchQueries();
    },
  };
}
