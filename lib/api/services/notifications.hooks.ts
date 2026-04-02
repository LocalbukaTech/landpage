import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {notificationsService} from './notifications.service';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (params?: any) => [...notificationKeys.all, 'list', params] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

/** Fetch notifications (paginated) */
export const useNotifications = (params?: {
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationsService.getNotifications(params),
    refetchInterval: 5000, // Poll every 5 seconds for latest notifications
    staleTime: 2000, // Data is considered fresh for 2 seconds
  });
};

/** Fetch unread count */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationsService.getUnreadCount(),
    refetchInterval: 5000, // Refresh unread count every 5 seconds
  });
};

/** Mark all notifications as read */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: notificationKeys.all});
    },
  });
};

/** Mark a single notification as read */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: notificationKeys.all});
    },
  });
};
