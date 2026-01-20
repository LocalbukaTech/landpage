import {api} from '../client';
import type {ApiResponse} from '../types';

export interface Waitlist {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: string;
}

export interface WaitlistListData {
  total_docs: number;
  current_page: number;
  total_pages: number;
  page_size: number;
  docs: Waitlist[];
}

export interface CreateWaitlistPayload {
  first_name: string;
  last_name: string;
  phone: string;
  location: string;
}

export const waitlistService = {
  create: (data: CreateWaitlistPayload) =>
    api.post<ApiResponse<Waitlist>>('/waitlist', data),

  list: (params?: {page?: number; size?: number}) =>
    api.get<ApiResponse<WaitlistListData>>('/waitlist', {params}),

  getById: (id: string) => api.get<ApiResponse<Waitlist>>(`/waitlist/${id}`),
};
