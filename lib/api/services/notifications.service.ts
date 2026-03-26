import { api } from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

export interface Notification {
  id: string;
  recipientId: string;
  actorId: string;
  type: string;
  entityId: string;
  entityType: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actor: {
    id: string;
    fullName: string;
    username: string;
    avatar: string | null;
  };
}


export interface UnreadCountResponse {
  unreadCount: number;
}


export const userNotificationsService = {
  // GET /notifications
  getAll: (page: number = 1, pageSize: number = 20) =>
    api.get<ApiResponse<PaginatedResponse<Notification>>>(
      `/notifications?page=${page}&pageSize=${pageSize}`
    ).then(res => res.data),

    //GET / notifications/unread-count
    getUnreadCount: () => 
        api.get<ApiResponse<UnreadCountResponse>>(
          `/notifications/unread-count`
        ).then(res => res.data),
    

    //PATCH / notifications/ read-all
    readAll: () =>
        api.patch<ApiResponse<{message : string}>>(
          `/notifications/read-all`
        ).then(res => res.data),
      
    //PATCH / notifications/:id/read
    readOne: (id: string) =>
        api.patch<ApiResponse<{message : string}>>(
          `/notifications/${id}/read`
        ).then(res => res.data),
};