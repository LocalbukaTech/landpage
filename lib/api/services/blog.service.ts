import {api} from '../client';
import type {ApiResponse} from '../types';

// ============================================
// Blog Types
// ============================================

export interface Blog {
  id: number;
  title: string;
  content: string;
  category?: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
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
  title: string;
  content: string;
  category: string;
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
   * Update an existing blog post
   * PUT /blogs/{id} (multipart/form-data)
   */
  updateBlog: async (id: string, data: UpdateBlogPayload): Promise<ApiResponse<Blog>> => {
    const formData = new FormData();
    if (data.image) {
      formData.append('image', data.image);
    }
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category);

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
  getBlog: async (id: string): Promise<ApiResponse<Blog>> => {
    return api.get<ApiResponse<Blog>>(`/blogs/${id}`);
  },

  /**
   * Delete a blog by ID
   * DELETE /blogs/{id}
   */
  deleteBlog: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<ApiResponse<void>>(`/blogs/${id}`);
  },
};
