import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {blogService} from './blog.service';
import type {
  CreateBlogPayload,
  UpdateBlogPayload,
  BlogQueryParams,
  CreateCommentPayload,
  CreateReplyPayload,
} from './blog.service';
import {queryKeys} from '../types';
import {useToast} from '@/hooks/use-toast';

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
export const useBlogQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.blog, id],
    queryFn: () => blogService.getBlog(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Query hook for fetching a single blog by slug
 */
export const useBlogBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: [queryKeys.blog, 'slug', slug],
    queryFn: () => blogService.getBlogBySlug(slug),
    enabled: !!slug,
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

// ============================================
// Comment & Like Hooks
// ============================================

export const useBlogCommentsQuery = (blogId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.blog.comments(blogId),
    queryFn: () => blogService.getComments(blogId),
    enabled: enabled && !!blogId,
  });
};

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({blogId, data}: {blogId: string; data: CreateCommentPayload}) =>
      blogService.createComment(blogId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: queryKeys.blog.comments(variables.blogId)});
      queryClient.invalidateQueries({queryKey: [queryKeys.blog, variables.blogId]}); // Update comment count
    },
  });
};

export const useReplyCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blogId,
      commentId,
      data,
    }: {
      blogId: string;
      commentId: string;
      data: CreateReplyPayload;
    }) => blogService.replyToComment(blogId, commentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: queryKeys.blog.comments(variables.blogId)});
    },
  });
};
export const useReplyCommentTwoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string;
      data: CreateReplyPayload;
    }) => blogService.replyToCommentTwo(commentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: queryKeys.blog.comments(variables.commentId)});
    },
  });
};

export const useLikeBlogMutation = () => {
  const queryClient = useQueryClient();
  const {toast} = useToast();

  return useMutation({
    mutationFn: (blogId: string) => blogService.likeBlog(blogId),
    onSuccess: (response, blogId) => {
      queryClient.invalidateQueries({queryKey: [queryKeys.blog, blogId]});
      queryClient.invalidateQueries({queryKey: [queryKeys.blog, 'slug']}); // Update blog detail by slug
      queryClient.invalidateQueries({queryKey: [queryKeys.blogs]}); // Update list view likes
      toast({
        title: 'Success',
        description: response.data?.message || 'You liked this blog post.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to like blog post.',
        variant: 'destructive',
      });
    },
  });
};

export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient();
  const {toast} = useToast();

  return useMutation({
    mutationFn: ({commentId, blogId}: {commentId: string; blogId: string}) => blogService.likeComment(commentId),
    onSuccess: (response, variables) => {
      // Invalidate comments for the specific blog to refetch updated data
      queryClient.invalidateQueries({queryKey: queryKeys.blog.comments(variables.blogId)});
      // Also invalidate the blog slug query to update like counts
      // queryClient.invalidateQueries({queryKey: [queryKeys.blog, 'slug']});
      toast({
        title: 'Success',
        description: response.data?.message || 'You liked this comment.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to like comment.',
        variant: 'destructive',
      });
    },
  });
};
