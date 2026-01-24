import {api} from '../client';
import type {ApiResponse} from '../types';

export interface Team {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  image_url: string;
  linkedin_url: string;
  department: string;
  position: string;
  description: string;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamsListData {
  total_docs: number;
  current_page: number;
  total_pages: number;
  page_size: number;
  docs: Team[];
}

export interface TeamsQueryParams {
  page?: number;
  size?: number;
  approved?: boolean;
  all?: boolean;
}

// We accept FormData so the caller can send files (image)
export const teamsService = {
  create: (data: FormData) =>
    api.post<ApiResponse<Team>>('/teams', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  list: (params?: TeamsQueryParams) =>
    api.get<ApiResponse<TeamsListData>>('/teams?all=false&approved=true', {params}),

  getById: (id: string) => api.get<ApiResponse<Team>>(`/teams/${id}`),

  update: (id: string, data: FormData) =>
    api.put<ApiResponse<Team>>(`/teams/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  updateStatus: (id: string, approved: boolean) =>
    api.patch<ApiResponse<Team>>(
      `/teams/${id}`,
      {},
      {
        params: {approved},
      }
    ),

  delete: (id: string) => api.delete<{message: string}>(`/teams/${id}`),
};
