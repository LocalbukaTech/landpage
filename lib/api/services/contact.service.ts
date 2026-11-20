import { api } from '../client';
import type { ApiResponse } from '../types';

export type ContactStatus = 'pending' | 'in_progress' | 'resolved' | 'archived';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
  is_read: boolean;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactListData {
  total_docs: number;
  current_page: number;
  total_pages: number;
  page_size: number;
  docs: ContactInquiry[];
}

export interface CreateContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface UpdateContactPayload {
  status?: ContactStatus;
  is_read?: boolean;
  admin_notes?: string;
}

export const contactService = {
  create: (data: CreateContactPayload) =>
    api.post<ApiResponse<ContactInquiry>>('/contact', data),

  list: (params?: { page?: number; size?: number; status?: ContactStatus }) =>
    api.get<ApiResponse<ContactListData>>('/contact', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<ContactInquiry>>(`/contact/${id}`),

  update: (id: string, data: UpdateContactPayload) =>
    api.patch<ApiResponse<ContactInquiry>>(`/contact/${id}`, data),

  reply: (id: string, data: { subject?: string; replyMessage: string }) =>
    api.post<
      ApiResponse<{
        success: boolean;
        emailDelivered: boolean;
        message: string;
        data: ContactInquiry;
      }>
    >(`/contact/${id}/reply`, data),

  ingestInboundEmail: (data: {
    name?: string;
    from: string;
    subject: string;
    message: string;
    phone?: string;
  }) => api.post<ApiResponse<ContactInquiry>>('/contact/inbound-webhook', data),

  remove: (id: string) =>
    api.delete<ApiResponse<{ success: boolean; message: string }>>(`/contact/${id}`),
};
