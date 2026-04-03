import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {useEffect} from 'react';
import {postsService} from './posts.service';
import {queryKeys} from '../types';
import type {
  Post,
  PostsQueryParams,
  FeedQueryParams,
  CommentsQueryParams,
} from '@/types/post';

/* ─── Queries ─────────────────────────────────────────────── */

/** Fetch chronological posts feed (paginated) */
export const usePosts = (params?: PostsQueryParams) => {
  return useQuery({
    queryKey: [...queryKeys.posts.list(params as Record<string, unknown>)],
    queryFn: async () => {
      const response = await postsService.getPosts(params);
      return response.data;
    },
    refetchInterval: 2000, // Refresh every 2 seconds for real-time cross-browser updates
    staleTime: 1000,
  });
};

/** Fetch personalised feed (paginated) */
export const usePersonalisedFeed = (params?: FeedQueryParams) => {
  return useQuery({
    queryKey: [...queryKeys.posts.feed(params as Record<string, unknown>)],
    queryFn: async () => {
      const response = await postsService.getPersonalisedFeed(params);
      return response.data;
    },
    refetchInterval: 2000, // Refresh every 2 seconds for real-time cross-browser updates
    staleTime: 1000,
  });
};

/** Fetch a single post */
export const usePost = (id: string, options?: any) => {
  const queryClient = useQueryClient();

  // Refetch when user returns to the window (browser tab focus)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && id) {
        // User came back to this tab, refetch immediately to show updated counts
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.posts.detail(id)],
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [id, queryClient]);

  return useQuery({
    queryKey: [...queryKeys.posts.detail(id)],
    queryFn: async () => {
      const response = await postsService.getPost(id);
      return response.data;
    },
    enabled: !!id,
    refetchInterval: 2000, // Refresh every 2 seconds for cross-browser real-time feel
    staleTime: 1000,
    ...options,
  });
};

/** Fetch comments for a post */
export const useComments = (postId: string, params?: CommentsQueryParams) => {
  return useQuery({
    queryKey: [
      ...queryKeys.posts.comments(postId, params as Record<string, unknown>),
    ],
    queryFn: async () => {
      const response = await postsService.getComments(postId, params);
      return response.data;
    },
    enabled: !!postId,
    refetchInterval: 5000, // Refresh comments every 5 seconds (less critical than likes)
    staleTime: 1000,
  });
};

/* ─── Mutations ───────────────────────────────────────────── */

/** Create a new post */
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => postsService.createPost(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.posts.all});
      queryClient.invalidateQueries({queryKey: queryKeys.users.all});
    },
  });
};

/** Delete a post */
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => postsService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.posts.all});
      queryClient.invalidateQueries({queryKey: queryKeys.users.all});
    },
  });
};

/** Toggle like on a post (optimistic) */
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsService.toggleLike(postId),
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({queryKey: queryKeys.posts.all});

      // We don't do full optimistic cache update on list queries for simplicity;
      // The UI component will track local state.
    },
    onSettled: (_, __, postId) => {
      queryClient.invalidateQueries({queryKey: queryKeys.posts.detail(postId)});
      queryClient.invalidateQueries({queryKey: queryKeys.posts.all});
      queryClient.invalidateQueries({queryKey: queryKeys.users.all});
    },
  });
};

/** Toggle save on a post (optimistic) */
export const useToggleSave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsService.toggleSave(postId),
    onSettled: (_, __, postId) => {
      queryClient.invalidateQueries({queryKey: queryKeys.posts.detail(postId)});
      queryClient.invalidateQueries({queryKey: queryKeys.posts.all});
      queryClient.invalidateQueries({queryKey: queryKeys.users.all});
    },
  });
};

/** Add a comment to a post */
export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({postId, comment}: {postId: string; comment: string}) =>
      postsService.addComment(postId, comment),
    onSuccess: (_, {postId}) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.comments(postId),
      });
      queryClient.invalidateQueries({queryKey: queryKeys.posts.detail(postId)});
      queryClient.invalidateQueries({queryKey: queryKeys.posts.all});
    },
  });
};

/** Reply to a comment */
export const useReplyToComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      commentId,
      comment,
    }: {
      postId: string;
      commentId: string;
      comment: string;
    }) => postsService.replyToComment(postId, commentId, comment),
    onSuccess: (_, {postId}) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.comments(postId),
      });
    },
  });
};

/** Delete a comment */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({postId, commentId}: {postId: string; commentId: string}) =>
      postsService.deleteComment(postId, commentId),
    onSuccess: (_, {postId}) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.comments(postId),
      });
      queryClient.invalidateQueries({queryKey: queryKeys.posts.all});
    },
  });
};

/** Share a post */
export const useSharePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsService.sharePost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({queryKey: queryKeys.posts.detail(postId)});
      queryClient.invalidateQueries({queryKey: queryKeys.posts.all});
    },
  });
};

/** Repost a post */
export const useRepostPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsService.repostPost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({queryKey: queryKeys.posts.detail(postId)});
      queryClient.invalidateQueries({queryKey: queryKeys.posts.all});
    },
  });
};

/** Fetch users who reposted a post (paginated) */
export const usePostReposts = (
  postId: string,
  params?: {page?: number; pageSize?: number},
) => {
  return useQuery({
    queryKey: [
      ...queryKeys.posts.reposts(postId, params as Record<string, unknown>),
    ],
    queryFn: async () => {
      const response = await postsService.getPostReposts(postId, params);
      return response.data;
    },
    enabled: !!postId,
  });
};
