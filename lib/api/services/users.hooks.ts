import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from './users.service';
import { queryKeys } from '../types';
import type { UserFiltersState } from '@/types/admin';

// ============================================
// Users Query Hooks
// ============================================

export const useUsers = (
    params?: Partial<UserFiltersState> & { page?: number; pageSize?: number }
) => {
    return useQuery({
        queryKey: queryKeys.users.list(params),
        queryFn: () => usersService.getUsers(params),
    });
};

export const useUser = (id: string) => {
    return useQuery({
        queryKey: queryKeys.users.detail(id),
        queryFn: () => usersService.getUserById(id),
        enabled: !!id,
    });
};

// ============================================
// Users Mutation Hooks
// ============================================

export const useFlagUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason, status }: { id: string; reason: string; status: string }) =>
            usersService.flagUser(id, { reason, status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => usersService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        },
    });
};
