'use client';

import {useEffect, useMemo, useState} from 'react';
import {X, Loader2} from 'lucide-react';
import Image from 'next/image';
import {cn} from '@/lib/utils';
import {
  useNotifications,
  useMarkAllAsRead,
  useMarkAsRead,
} from '@/lib/api/services/notifications.hooks';
import {useFollowUser, useFollowing} from '@/lib/api/services/profile.hooks';
import {useAuth} from '@/context/AuthContext';
import {useRouter} from 'next/navigation';
import {formatDistanceToNow} from 'date-fns';
import type {Notification} from '@/types/notification';

interface NotificationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function RestaurantNotificationDrawer({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  return (
    <div className='fixed inset-0 z-200 flex items-end justify-center'>
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative w-full max-w-lg bg-[#1e1e1e] border border-white/10 rounded-t-3xl p-6 pb-8 animate-[slideUp_0.3s_ease-out]'>
        <div className='w-12 h-1 bg-white/20 rounded-full mx-auto mb-5' />
        <div className='flex items-center gap-4 mb-4'>
          <div className='w-12 h-12 rounded-full overflow-hidden bg-[#fbbe15]/10 flex items-center justify-center shrink-0 border border-[#fbbe15]/30'>
            <Image
              src='/images/localBuka_logo.png'
              alt='LocalBuka'
              width={32}
              height={32}
              className='object-contain rounded-full'
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.onerror = null;
                t.src = '/images/profile.png';
              }}
            />
          </div>
          <div>
            <p className='text-white font-bold text-sm'>LocalBuka</p>
            <p className='text-zinc-500 text-xs'>
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })
                .replace('about ', '')
                .replace('less than a minute ago', 'just now')}
            </p>
          </div>
          <button
            onClick={onClose}
            className='ml-auto w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border-none cursor-pointer'>
            <X size={16} className='text-zinc-400' />
          </button>
        </div>
        <p className='text-white text-sm leading-relaxed'>
          {notification.message}
        </p>
      </div>
    </div>
  );
}

export function NotificationOverlay({
  isOpen,
  onClose,
}: NotificationOverlayProps) {
  const {data: notificationsEntry, isLoading} = useNotifications({
    page: 1,
    pageSize: 50,
  });
  const markAllAsRead = useMarkAllAsRead();
  const {user} = useAuth();

  const {data: followingResp} = useFollowing(user?.id || '', {
    page: 1,
    limit: 200,
  });

  const followingIds = useMemo(() => {
    const list =
      (followingResp as any)?.data?.data || (followingResp as any)?.data || [];
    const ids = new Set<string>();
    list.forEach((entry: any) => {
      const u = entry.following || entry;
      if (u?.id) ids.add(u.id);
    });
    return ids;
  }, [followingResp]);

  const notifications = (notificationsEntry as any)?.data?.data || [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed top-0 left-20 w-[350px] bottom-0 bg-[#1a1a1a] z-100 p-6 flex flex-col border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.4)] animate-[slideInDrawer_0.3s_ease-out]'>
      <div className='w-full'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-white text-lg font-medium'>Notifications</h2>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending || notifications.length === 0}
              className='text-xs font-semibold text-[#fbbe15] hover:text-[#e5ac10] transition-colors disabled:text-zinc-600 disabled:cursor-not-allowed'>
              Read all
            </button>
            <button
              className='flex items-center justify-center w-8 h-8 bg-[#3a3a3a] rounded-md text-[#a0a0a0] transition-all duration-200 hover:bg-[#4a4a4a] hover:text-white border-none cursor-pointer'
              onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-8 overflow-y-auto h-[calc(100vh-100px)] scrollbar-hide'>
          {isLoading ? (
            <div className='flex items-center justify-center py-10'>
              <Loader2 className='w-6 h-6 animate-spin text-[#fbbe15]' />
            </div>
          ) : notifications.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 text-center'>
              <p className='text-zinc-500 text-sm'>No notifications yet.</p>
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              {notifications.map((notif: Notification) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  alreadyFollowing={followingIds.has(notif.actorId)}
                  onClose={onClose}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  alreadyFollowing,
  onClose,
}: {
  notification: Notification;
  alreadyFollowing: boolean;
  onClose: () => void;
}) {
  const markAsRead = useMarkAsRead();
  const followUserMutation = useFollowUser();
  const router = useRouter();
  const [isFollowingBack, setIsFollowingBack] = useState(false);
  const [showRestaurantDrawer, setShowRestaurantDrawer] = useState(false);

  const isRestaurant = notification.entityType === 'restaurant';

  const handleItemClick = () => {
    if (!notification.isRead) markAsRead.mutate(notification.id);

    if (isRestaurant) {
      setShowRestaurantDrawer(true);
      return;
    }

    if (
      notification.type === 'comment' ||
      notification.entityType === 'comment'
    ) {
      onClose();
      router.push(`/posts/${notification.entityId}?openComments=true`);
      return;
    }

    if (notification.type === 'follow' || notification.type === 'unfollow') {
      onClose();
      router.push(`/other-profile?id=${notification.actorId}`);
      return;
    }

    if (notification.entityType === 'post') {
      onClose();
      router.push(`/posts/${notification.entityId}`);
      return;
    }

    if (notification.entityType === 'user') {
      onClose();
      router.push(`/other-profile?id=${notification.entityId}`);
    }
  };

  const handleFollowBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowingBack(true);
    followUserMutation.mutate(notification.actorId, {
      onError: () => setIsFollowingBack(false),
    });
  };

  const handleActorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) markAsRead.mutate(notification.id);
    onClose();
    router.push(`/other-profile?id=${notification.actorId}`);
  };

  const time = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  })
    .replace('about ', '')
    .replace('less than a minute ago', 'just now');

  const showFollowBack =
    notification.type === 'follow' && !alreadyFollowing && !isFollowingBack;
  const showFollowedState =
    notification.type === 'follow' && (alreadyFollowing || isFollowingBack);
  const showThumbnail =
    !isRestaurant &&
    (notification.type === 'like_post' ||
      notification.type === 'repost' ||
      notification.type === 'comment');

  return (
    <>
      <div
        onClick={handleItemClick}
        className={cn(
          'flex items-center justify-between gap-3 p-2 rounded-xl transition-all hover:bg-white/5 cursor-pointer relative',
          !notification.isRead && 'bg-[#fbbe15]/5',
        )}>
        {!notification.isRead && (
          <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#fbbe15] rounded-full' />
        )}

        <div className='flex gap-3 items-center flex-1 ml-2'>
          <div
            className={cn(
              'w-10 h-10 rounded-full overflow-hidden bg-zinc-700 shrink-0 relative border border-white/10',
              !isRestaurant && 'cursor-pointer',
            )}
            onClick={isRestaurant ? undefined : handleActorClick}>
            {isRestaurant ? (
              <Image
                src='/images/localBuka_logo.png'
                alt='LocalBuka'
                fill
                className='object-contain p-1.5 rounded-full'
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.onerror = null;
                  t.src = '/images/profile.png';
                }}
              />
            ) : (
              <Image
                src={notification.actor?.avatar || '/images/profile.png'}
                alt={notification.actor?.fullName || 'User'}
                fill
                className='object-cover'
              />
            )}
          </div>

          <div className='flex flex-col'>
            <p className='text-white text-sm leading-tight'>
              {!isRestaurant ? (
                <span
                  className='font-bold cursor-pointer hover:underline'
                  onClick={handleActorClick}>
                  {notification.actor?.fullName}
                </span>
              ) : (
                <span className='font-bold'>LocalBuka</span>
              )}{' '}
              <span className='text-zinc-300 font-normal'>
                {notification.message}
              </span>
            </p>
            <span className='text-zinc-500 text-xs mt-0.5'>{time}</span>
          </div>
        </div>

        {showThumbnail && (
          <div className='w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-white/10 relative'>
            <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
              <span className='text-zinc-500 text-xs'>▶</span>
            </div>
          </div>
        )}

        {showFollowBack && (
          <button
            onClick={handleFollowBack}
            disabled={followUserMutation.isPending}
            className='bg-[#fbbe15] text-[#1a1a1a] text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#e5ac10] transition-colors shrink-0 tracking-tighter disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1'>
            {followUserMutation.isPending ? (
              <Loader2 size={10} className='animate-spin' />
            ) : (
              'Follow back'
            )}
          </button>
        )}

        {showFollowedState && (
          <div className='text-zinc-400 text-[10px] font-bold tracking-tighter shrink-0'>
            Following
          </div>
        )}

        {notification.type === 'unfollow' && (
          <div className='text-zinc-500 text-[10px] font-bold tracking-tighter shrink-0'>
            Unfollowed
          </div>
        )}
      </div>

      {showRestaurantDrawer && (
        <RestaurantNotificationDrawer
          notification={notification}
          onClose={() => setShowRestaurantDrawer(false)}
        />
      )}
    </>
  );
}
