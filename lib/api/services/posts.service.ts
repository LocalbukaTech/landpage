import { api } from '../client';
import { ApiResponse } from '../types';
import type {
  Post,
  PostsResponse,
  PostComment,
  CommentsResponse,
  PostsQueryParams,
  FeedQueryParams,
  CommentsQueryParams,
} from '@/types/post';

export const postsService = {
  /** GET /posts — chronological paginated feed */
  getPosts: (params?: PostsQueryParams) => {
    return api.get<ApiResponse<PostsResponse>>('/posts', { params });
  },

  /** GET /posts/feed — personalised feed (users you follow) */
  getPersonalisedFeed: (params?: FeedQueryParams) => {
    return api.get<ApiResponse<PostsResponse>>('/posts/feed', { params });
  },

  /** GET /posts/:id — single post */
  getPost: (id: string) => {
    return api.get<ApiResponse<Post>>(`/posts/${id}`);
  },

  /** POST /posts — create a post (multipart/form-data) */
  createPost: (formData: FormData) => {
    return api.post<ApiResponse<Post>>('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /** DELETE /posts/:id — delete own post */
  deletePost: (id: string) => {
    return api.delete<void>(`/posts/${id}`);
  },

  /** POST /posts/:id/like — toggle like */
  toggleLike: (id: string) => {
    return api.post<ApiResponse<{ liked: boolean }>>(`/posts/${id}/like`);
  },

  /** POST /posts/:id/save — toggle save */
  toggleSave: (id: string) => {
    return api.post<ApiResponse<{ saved: boolean }>>(`/posts/${id}/save`);
  },
  
  /** POST /posts/:id/share — increment share count */
  sharePost: (id: string) => {
    return api.post<ApiResponse<{ shareCount: number }>>(`/posts/${id}/share`);
  },

  /** POST /posts/:id/repost — toggle repost */
  repostPost: (id: string) => {
    return api.post<ApiResponse<{ reposted: boolean, repostCount: number }>>(`/posts/${id}/repost`);
  },

  /** GET /posts/:id/reposts — Get list of users who reposted a post */
  getPostReposts: (id: string, params?: { page?: number; pageSize?: number }) => {
    return api.get<ApiResponse<any>>(`/posts/${id}/reposts`, { params });
  },

  /** GET /posts/:id/comments — top-level comments (replies nested) */
  getComments: (id: string, params?: CommentsQueryParams) => {
    return api.get<ApiResponse<CommentsResponse>>(`/posts/${id}/comments`, { params });
  },

  /** POST /posts/:id/comments — add a comment */
  addComment: (id: string, comment: string) => {
    return api.post<ApiResponse<PostComment>>(`/posts/${id}/comments`, { comment });
  },

  /** POST /posts/:id/comments/:commentId/replies — reply to a comment */
  replyToComment: (postId: string, commentId: string, comment: string) => {
    return api.post<ApiResponse<PostComment>>(
      `/posts/${postId}/comments/${commentId}/replies`,
      { comment }
    );
  },

  /** DELETE /posts/:id/comments/:commentId — delete a comment */
  deleteComment: (postId: string, commentId: string) => {
    return api.delete<void>(`/posts/${postId}/comments/${commentId}`);
  },
};
