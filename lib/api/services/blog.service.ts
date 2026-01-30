import {api} from '../client';
import type {ApiResponse} from '../types';

// ============================================
// Blog Types
// ============================================

export interface Blog {
  id: string;
  author_id: string;
  slug: string;
  title: string;
  content: string;
  category?: string;
  image_url: string;
  read_time: number;
  created_at: string;
  updated_at: string;
  like_counts: string;  // API returns as string
  comment_counts: string;  // API returns as string
  is_liked?: boolean;  // May not be present in all responses
}

export interface BlogPaginationData {
  total_docs: number;
  current_page: number;
  total_pages: number;
  page_size: number;
  docs: Blog[];
}

export interface BlogListResponse {
  message: string;
  data: {
    message: string;
    data: BlogPaginationData;
  };
}

export interface BlogQueryParams {
  author_id?: string;
  page?: number;
  size?: number;
}

export interface CreateBlogPayload {
  image: File;
  title: string;
  content: string;
  category: string;
}

export interface UpdateBlogPayload {
  image?: File;
  title?: string;
  content?: string;
  category?: string;
}

// ============================================
// Comment & Reply Types
// ============================================

export interface UserShort {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string;
}

export interface Reply {
  id: string;
  comment: string;
  user?: UserShort;
  parent_id: string;
  created_at: string;
  updated_at: string;
  like_counts: string;  // API returns as string
  reply_counts: string;  // API returns as string
  is_liked?: boolean;
  replies?: Reply[];
}

export interface Comment {
  id: string;
  comment: string;
  user?: UserShort;
  parent_id: string | null;
  replies: Reply[];
  created_at: string;
  updated_at: string;
  like_counts: string;  // API returns as string
  reply_counts: string;  // API returns as string
  is_liked?: boolean;
}

export interface CreateCommentPayload {
  comment: string;
}

export interface CreateReplyPayload {
  comment: string;
}

export interface CommentPaginationData {
  total_docs: number;
  current_page: number;
  total_pages: number;
  page_size: number;
  docs: Comment[];
}

export interface CommentsListResponse {
  message: string;
  data: {
    message: string;
    data: CommentPaginationData;
  };
}

// ============================================
// Blog Service
// ============================================

export const blogService = {
  /**
   * Create a new blog post
   * POST /blogs (multipart/form-data)
   */
  createBlog: async (data: CreateBlogPayload): Promise<ApiResponse<Blog>> => {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category);

    return api.post<ApiResponse<Blog>>('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Update an existing blog post (partial update - only send changed fields)
   * PUT /blogs/{id} (multipart/form-data)
   */
  updateBlog: async (id: string, data: UpdateBlogPayload): Promise<ApiResponse<Blog>> => {
    const formData = new FormData();
    
    // Only append fields that are present in the payload
    if (data.image) {
      formData.append('image', data.image);
    }
    if (data.title !== undefined) {
      formData.append('title', data.title);
    }
    if (data.content !== undefined) {
      formData.append('content', data.content);
    }
    if (data.category !== undefined) {
      formData.append('category', data.category);
    }

    return api.put<ApiResponse<Blog>>(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Get paginated list of blogs
   * GET /blogs
   */
  getBlogs: async (params?: BlogQueryParams): Promise<BlogListResponse> => {
    return api.get<BlogListResponse>('/blogs', {
      params: {
        author_id: params?.author_id,
        page: params?.page || 1,
        size: params?.size || 10,
      },
    });
  },

  /**
   * Get a single blog by ID
   * GET /blogs/{id}
   */
  getBlog: async (id: string): Promise<ApiResponse<{message: string; data: Blog}>> => {
    return api.get<ApiResponse<{message: string; data: Blog}>>(`/blogs/${id}`);
  },

  /**
   * Get a single blog by Slug
   * GET /blogs/slug/{slug}
   */
  getBlogBySlug: async (slug: string): Promise<ApiResponse<{message: string; data: Blog}>> => {
    return api.get<ApiResponse<{message: string; data: Blog}>>(`/blogs/slug/${slug}`);
  },

  /**
   * Delete a blog by ID
   * DELETE /blogs/{id}
   */
  deleteBlog: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<ApiResponse<void>>(`/blogs/${id}`);
  },

  // ============================================
  // Comments & Likes Endpoints
  // ============================================

  /**
   * Get comments for a blog post
   * GET /blogs/{id}/comments
   */
  getComments: async (blogId: string): Promise<CommentsListResponse> => {
    return api.get<CommentsListResponse>(`/blogs/${blogId}/comments`);
  },

  /**
   * Post a comment
   * POST /blogs/{id}/comments
   */
  createComment: async (blogId: string, data: CreateCommentPayload): Promise<ApiResponse<Comment>> => {
    // Assuming creation returns just the comment or wrapped comment.
    // Based on list pattern, it MIGHT be wrapped too, but usually create returns item.
    // Keeping ApiResponse<Comment> for now unless I see otherwise.
    return api.post<ApiResponse<Comment>>(`/blogs/${blogId}/comments`, data);
  },

  /**
   * Reply to a comment
   * POST /blogs/{id}/comments/{commentId}/replies
   */
  replyToComment: async (
    blogId: string,
    commentId: string,
    data: CreateReplyPayload
  ): Promise<ApiResponse<Reply>> => {
    return api.post<ApiResponse<Reply>>(`/blogs/${blogId}/comments/${commentId}/replies`, data);
  },
  replyToCommentTwo: async (
    commentId: string,
    data: CreateReplyPayload
  ): Promise<ApiResponse<Reply>> => {
    return api.post<ApiResponse<Reply>>(`/blogs/comments/${commentId}/replies`, data);
  },

  /**
   * Like a blog post
   * POST /blogs/{id}/like
   */
  likeBlog: async (blogId: string): Promise<ApiResponse<{message: string}>> => {
    return api.post<ApiResponse<{message: string}>>(`/blogs/${blogId}/like`);
  },

  /**
   * Like a comment
   * POST /blogs/comments/{id}/like
   */
  likeComment: async (commentId: string): Promise<ApiResponse<{message: string}>> => {
    return api.post<ApiResponse<{message: string}>>(`/blogs/comments/${commentId}/like`);
  },
};
