'use client';

import {useMemo, useState} from 'react';
import {Loader2, X} from 'lucide-react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {cn} from '@/lib/utils';
import {
  useNotifications,
  useMarkAllAsRead,
  useMarkAsRead,
} from '@/lib/api/services/notifications.hooks';
import {useFollowUser, useUserProfile} from '@/lib/api/services/profile.hooks';
import {useAuth} from '@/context/AuthContext';
import {formatDistanceToNow} from 'date-fns';
import {MainLayout} from '@/components/layout/MainLayout';
import type {Notification} from '@/types/notification';
import {formatDistanceToNow as fmt} from 'date-fns';

// ─── Restaurant Detail Bottom Sheet ────────────────────────────────────────────
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
            />
          </div>
          <div>
            <p className='text-white font-bold text-sm'>LocalBuka</p>
            <p className='text-zinc-500 text-xs'>
              {fmt(new Date(notification.createdAt), {addSuffix: true})
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

// ─── Single Notification Row ────────────────────────────────────────────────────
function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  const markAsRead = useMarkAsRead();
  const followUserMutation = useFollowUser();
  const router = useRouter();
  const [isFollowingBack, setIsFollowingBack] = useState(false);
  const [showRestaurantDrawer, setShowRestaurantDrawer] = useState(false);

  const {data: actorProfile} = useUserProfile(
    notification.type === 'follow' ? notification.actorId : '',
  );
  const actorProfileData = (actorProfile as any)?.data?.data || (actorProfile as any)?.data;
  const alreadyFollowing = actorProfileData?.isFollowing ?? false;

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
      router.push(`/posts/${notification.entityId}?openComments=true`);
      return;
    }
    if (notification.type === 'follow' || notification.type === 'unfollow') {
      router.push(`/other-profile?id=${notification.actorId}`);
      return;
    }
    if (notification.entityType === 'post') {
      router.push(`/posts/${notification.entityId}`);
      return;
    }
    if (notification.entityType === 'user') {
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
          'flex items-center justify-between gap-3 p-3 rounded-xl transition-all active:bg-white/8 cursor-pointer relative',
          !notification.isRead && 'bg-[#fbbe15]/5',
        )}>
        {!notification.isRead && (
          <div className='absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#fbbe15] rounded-full' />
        )}

        <div className='flex gap-3 items-center flex-1 ml-2'>
          <div
            className={cn(
              'w-11 h-11 rounded-full overflow-hidden bg-zinc-700 shrink-0 relative border border-white/10',
              !isRestaurant && 'cursor-pointer',
            )}
            onClick={isRestaurant ? undefined : handleActorClick}>
            {isRestaurant ? (
              <Image
                src='/images/localBuka_logo.png'
                alt='LocalBuka'
                fill
                className='object-contain p-1.5 rounded-full'
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

          <div className='flex flex-col flex-1 min-w-0'>
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
            className='bg-[#fbbe15] text-[#1a1a1a] text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#e5ac10] transition-colors shrink-0 tracking-tighter disabled:opacity-50 border-none cursor-pointer flex items-center gap-1'>
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

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const {user} = useAuth();

  const {data: notificationsEntry, isLoading} = useNotifications({
    page: 1,
    pageSize: 50,
  });
  const markAllAsRead = useMarkAllAsRead();



  const notifications: Notification[] =
    (notificationsEntry as any)?.data?.data || [];

  return (
    <MainLayout>
      <div className='w-full max-w-2xl mx-auto flex flex-col min-h-dvh md:min-h-0'>
        {/* Header */}
        <button
          onClick={() => markAllAsRead.mutate()}
          disabled={markAllAsRead.isPending || notifications.length === 0}
          className='text-xs font-semibold text-[#fbbe15] hover:text-[#e5ac10] transition-colors disabled:text-zinc-600 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer flex m-4 justify-end'>
          Mark all read
        </button>

        {/* List */}
        <div className='flex flex-col px-2 py-2'>
          {isLoading ? (
            <div className='flex items-center justify-center py-20'>
              <Loader2 className='w-6 h-6 animate-spin text-[#fbbe15]' />
            </div>
          ) : notifications.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-24 text-center gap-3'>
              <div className='w-14 h-14 rounded-full bg-[#2a2a2a] flex items-center justify-center'>
                <span className='text-2xl'>🔔</span>
              </div>
              <p className='text-white font-semibold text-sm'>
                You&apos;re all caught up!
              </p>
              <p className='text-zinc-500 text-xs'>
                No new notifications right now.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
              />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
