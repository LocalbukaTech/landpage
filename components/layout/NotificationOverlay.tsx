'use client';

import {useEffect, useState} from 'react';
import {X, UtensilsCrossed, Loader2} from 'lucide-react';
import Image from 'next/image';
import {cn} from '@/lib/utils';
import {
  useNotifications,
  useMarkAllAsRead,
  useMarkAsRead,
} from '@/lib/api/services/notifications.hooks';
import {useFollowUser} from '@/lib/api/services/profile.hooks';
import {formatDistanceToNow} from 'date-fns';
import type {Notification} from '@/types/notification';

interface NotificationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
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

  const notifications = (notificationsEntry as any)?.data?.data || [];

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleMarkAllRead = () => {
    markAllAsRead.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed top-0 left-20 w-[350px] bottom-0 bg-[#1a1a1a] z-100 p-6 flex flex-col border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.4)] animate-[slideInDrawer_0.3s_ease-out]'>
      <div className='w-full'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-white text-lg font-medium'>Notifications</h2>
          <div className='flex items-center gap-3'>
            <button
              onClick={handleMarkAllRead}
              disabled={markAllAsRead.isPending || notifications.length === 0}
              className='text-xs font-semibold text-[#fbbe15] hover:text-[#e5ac10] transition-colors disabled:text-zinc-600 disabled:cursor-not-allowed'
              aria-label='Mark all notifications as read'>
              Read all
            </button>
            <button
              className='flex items-center justify-center w-8 h-8 bg-[#3a3a3a] rounded-md text-[#a0a0a0] transition-all duration-200 hover:bg-[#4a4a4a] hover:text-white border-none cursor-pointer'
              onClick={onClose}
              aria-label='Close notifications'>
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
                <NotificationItem key={notif.id} notification={notif} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationItem({notification}: {notification: Notification}) {
  const markAsRead = useMarkAsRead();
  const followUserMutation = useFollowUser();
  const [isFollowingBack, setIsFollowingBack] = useState(false);

  const handleItemClick = () => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
  };

  const handleFollowBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowingBack(true);
    followUserMutation.mutate(notification.actorId, {
      onError: () => setIsFollowingBack(false),
    });
  };

  const time = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  })
    .replace('about ', '')
    .replace('less than a minute ago', 'just now');

  return (
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
        <div className='w-10 h-10 rounded-full overflow-hidden bg-zinc-700 shrink-0 relative border border-white/10'>
          <Image
            src={notification.actor?.avatar || '/images/profile.png'}
            alt={notification.actor?.fullName || 'User'}
            fill
            className='object-cover'
          />
        </div>
        <div className='flex flex-col'>
          <p className='text-white text-sm leading-tight'>
            <span className='font-bold'>{notification.actor?.fullName}</span>{' '}
            <span className='text-zinc-300 font-normal'>
              {notification.message}
            </span>
          </p>
          <span className='text-zinc-500 text-xs mt-0.5'>{time}</span>
        </div>
      </div>

      {(notification.type === 'like_post' ||
        notification.type === 'repost' ||
        notification.type === 'comment') && (
        <div className='w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-white/10 relative'>
          <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
            {/* If we had the entity image, we'd show it here. For now default food icon if post */}
            <UtensilsCrossed size={14} className='text-zinc-500' />
          </div>
        </div>
      )}

      {notification.type === 'follow' && (
        <button
          onClick={handleFollowBack}
          disabled={isFollowingBack}
          className='bg-[#fbbe15] text-[#1a1a1a] text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#e5ac10] transition-colors shrink-0  tracking-tighter disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1'>
          {isFollowingBack ? (
            <Loader2 size={10} className='animate-spin' />
          ) : (
            'Follow back'
          )}
        </button>
      )}

      {notification.type === 'unfollow' && (
        <div className='text-zinc-500 text-[10px] font-bold tracking-tighter shrink-0'>
          Unfollowed
        </div>
      )}
    </div>
  );
}
