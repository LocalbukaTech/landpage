import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {blogService} from './blog.service';
import type {CreateBlogPayload, UpdateBlogPayload, BlogQueryParams} from './blog.service';
import {queryKeys} from '../types';

/**
 * Mutation hook for creating a blog post
 */
export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlogPayload) => blogService.createBlog(data),
    onSuccess: () => {
      // Invalidate blogs list to refetch
      queryClient.invalidateQueries({queryKey: [queryKeys.blogs]});
    },
  });
};

/**
 * Mutation hook for updating a blog post
 */
export const useUpdateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: UpdateBlogPayload}) =>
      blogService.updateBlog(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific blog and blogs list
      queryClient.invalidateQueries({queryKey: [queryKeys.blogs]});
      queryClient.invalidateQueries({queryKey: [queryKeys.blog, variables.id]});
    },
  });
};

/**
 * Query hook for fetching paginated blogs
 */
export const useBlogsQuery = (params?: BlogQueryParams) => {
  return useQuery({
    queryKey: [queryKeys.blogs, params],
    queryFn: () => blogService.getBlogs(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Query hook for fetching a single blog
 */
export const useBlogQuery = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [queryKeys.blog, id],
    queryFn: () => blogService.getBlog(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Mutation hook for deleting a blog post
 */
export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onSuccess: () => {
      // Invalidate blogs list to refetch
      queryClient.invalidateQueries({queryKey: [queryKeys.blogs]});
    },
  });
};
