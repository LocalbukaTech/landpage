import { api } from '../client';
import type { ApiResponse } from '../types';
import type { NotificationsResponse, UnreadCountResponse } from '@/types/notification';

export const notificationsService = {
  /** GET /notifications — Get own notifications (paginated) */
  getNotifications: (params?: { page?: number; pageSize?: number }) => {
    return api.get<ApiResponse<NotificationsResponse>>('/notifications', { params });
  },

  /** GET /notifications/unread-count — Get unread count */
  getUnreadCount: () => {
    return api.get<ApiResponse<UnreadCountResponse>>('/notifications/unread-count');
  },

  /** PATCH /notifications/read-all — Mark all as read */
  markAllAsRead: () => {
    return api.patch<ApiResponse<void>>('/notifications/read-all');
  },

  /** PATCH /notifications/:id/read — Mark a single as read */
  markAsRead: (id: string) => {
    return api.patch<ApiResponse<void>>(`/notifications/${id}/read`);
  },
};
