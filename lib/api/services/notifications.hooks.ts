import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userNotificationsService } from './notifications.service';

export const useNotifications = (page: number = 1, pageSize: number = 20) => {
    return useQuery({
        queryKey: ['notifications', 'list', { page, pageSize }],
        queryFn: () => userNotificationsService.getAll(page, pageSize),
    });
};

export const useUnreadCount = () => {
    return useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: () => userNotificationsService.getUnreadCount(),
        refetchInterval: 60000, // Check every 1 minute
    });
};

export const useMarkAllReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => userNotificationsService.readAll(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useMarkReadMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => userNotificationsService.readOne(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};
