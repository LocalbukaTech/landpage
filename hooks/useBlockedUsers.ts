'use client';

import { useMemo, useCallback } from 'react';
import {
  useBlockedUsersList,
  useBlockUser,
  useUnblockUser,
} from '@/lib/api/services/profile.hooks';
import type { BlockedUser } from '@/types/user';

export type { BlockedUser };

export function useBlockedUsers(params?: { page?: number; pageSize?: number }) {
  const {
    data: blockedResponse,
    isLoading,
    isError,
    refetch,
  } = useBlockedUsersList(params);

  const blockUserMutation = useBlockUser();
  const unblockUserMutation = useUnblockUser();

  // Extract blocked users array from API response (supports { data: [...] } or direct array)
  const blockedUsers: BlockedUser[] = useMemo(() => {
    const rawData = (blockedResponse as any)?.data?.data || (blockedResponse as any)?.data;
    if (Array.isArray(rawData)) {
      return rawData;
    }
    return [];
  }, [blockedResponse]);

  const total = (blockedResponse as any)?.data?.total ?? blockedUsers.length;
  const totalPages = (blockedResponse as any)?.data?.totalPages ?? 1;

  const isUserBlocked = useCallback(
    (userId?: string | null) => {
      if (!userId) return false;
      return blockedUsers.some((u) => u.id === userId);
    },
    [blockedUsers]
  );

  const blockUser = useCallback(
    async (userOrId: string | { id: string; fullName?: string; username?: string; avatar?: string }) => {
      const id = typeof userOrId === 'string' ? userOrId : userOrId.id;
      if (!id) return;
      return blockUserMutation.mutateAsync(id);
    },
    [blockUserMutation]
  );

  const unblockUser = useCallback(
    async (userId: string) => {
      if (!userId) return;
      return unblockUserMutation.mutateAsync(userId);
    },
    [unblockUserMutation]
  );

  return {
    blockedUsers,
    total,
    totalPages,
    isUserBlocked,
    blockUser,
    unblockUser,
    isBlocking: blockUserMutation.isPending,
    isUnblocking: unblockUserMutation.isPending,
    isLoading,
    isLoaded: !isLoading,
    isError,
    refetch,
  };
}
