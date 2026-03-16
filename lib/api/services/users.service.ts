import { api } from '../client';
import type { ApiResponse, PaginatedResponse } from '../types';
import type { AdminUser, UserFiltersState } from '@/types/admin';

// ============================================
// Users Service
// ============================================

export const usersService = {
    getUsers: (params?: Partial<UserFiltersState> & { page?: number; pageSize?: number }) =>
        api.get<ApiResponse<PaginatedResponse<AdminUser>>>('/admin/users', { params }),

    getUserById: (id: string) =>
        api.get<ApiResponse<AdminUser>>(`/admin/users/${id}`),

    flagUser: (id: string, payload: { reason: string; status: string }) =>
        api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/flag`, payload),

    deleteUser: (id: string) =>
        api.delete<ApiResponse<void>>(`/admin/users/${id}`),

    exportUsers: (params?: Partial<UserFiltersState>) =>
        api.get<Blob>('/admin/users/export', {
            params,
            responseType: 'blob',
        }),
};
