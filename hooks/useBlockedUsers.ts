'use client';

import { useState, useEffect, useCallback, startTransition } from 'react';
import { profileService } from '@/lib/api/services/profile.service';

export interface BlockedUser {
  id: string;
  fullName: string;
  username?: string;
  avatar?: string;
  blockedAt: string;
}

const STORAGE_KEY = 'localbuka_blocked_users';

const DEFAULT_BLOCKED_USERS: BlockedUser[] = [
  {
    id: 'user-wilson-1',
    fullName: 'Wilson Babafemi',
    username: 'wilsonb',
    avatar: '/images/avatar-marcus.png',
    blockedAt: 'Jul 30',
  },
  {
    id: 'user-jubril-2',
    fullName: 'Jubril Babatunde Olanrewaju',
    username: 'jubrilb',
    avatar: '/images/avatar-bryan.jpg',
    blockedAt: 'Aug 14',
  },
];

export function useBlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>(DEFAULT_BLOCKED_USERS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBlockedUsers(JSON.parse(stored));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BLOCKED_USERS));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setBlockedUsers(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveToStorage = (users: BlockedUser[]) => {
    setBlockedUsers(users);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      window.dispatchEvent(new Event('localbuka_blocked_change'));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleLocalChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setBlockedUsers(JSON.parse(stored));
      } catch {
        // ignore
      }
    };
    window.addEventListener('localbuka_blocked_change', handleLocalChange);
    return () => window.removeEventListener('localbuka_blocked_change', handleLocalChange);
  }, []);

  const isUserBlocked = useCallback(
    (userId?: string | null) => {
      if (!userId) return false;
      return blockedUsers.some((u) => u.id === userId);
    },
    [blockedUsers]
  );

  const blockUser = useCallback(
    (user: { id: string; fullName?: string; username?: string; avatar?: string }) => {
      if (!user.id) return;
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const newBlockedUser: BlockedUser = {
        id: user.id,
        fullName: user.fullName || user.username || 'User',
        username: user.username,
        avatar: user.avatar,
        blockedAt: dateStr,
      };

      const updated = [newBlockedUser, ...blockedUsers.filter((u) => u.id !== user.id)];
      saveToStorage(updated);

      try {
        (profileService as any).blockUser?.(user.id);
      } catch {
        // ignore
      }
    },
    [blockedUsers]
  );

  const unblockUser = useCallback(
    (userId: string) => {
      if (!userId) return;
      const updated = blockedUsers.filter((u) => u.id !== userId);
      saveToStorage(updated);

      try {
        (profileService as any).unblockUser?.(userId);
      } catch {
        // ignore
      }
    },
    [blockedUsers]
  );

  return {
    blockedUsers,
    isUserBlocked,
    blockUser,
    unblockUser,
    isLoaded,
  };
}
