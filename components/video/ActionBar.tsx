'use client';

import {Heart, MessageCircle, Bookmark, Forward, Repeat} from 'lucide-react';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import {cn} from '@/lib/utils';
import {useRequireAuth} from '@/hooks/useRequireAuth';
import {useFollowUser, useFollowing} from '@/lib/api/services/profile.hooks';
import {useRepostPost} from '@/lib/api/services/posts.hooks';
import {useAuth} from '@/context/AuthContext';
import {useRouter} from 'next/navigation';
import {ShareDrawer} from './ShareDrawer';
import {AnimatedCount} from './AnimatedCount';
import type {Post} from '@/types/post';

interface ActionBarProps {
  post: Post;
  onCommentClick?: () => void;
  onLikeToggle?: () => void;
  onSaveToggle?: () => void;
  hideFollowButton?: boolean;
}

export function ActionBar({
  post,
  onCommentClick,
  onLikeToggle,
  onSaveToggle,
  hideFollowButton,
}: ActionBarProps) {
  const {requireAuth} = useRequireAuth();
  const {user} = useAuth();
  const router = useRouter();
  const followUserMutation = useFollowUser();
  const repostPostMutation = useRepostPost();
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Fetch following list to check if already followed
  const {data: followingResponse} = useFollowing(user?.id as string);
  const followingList = (followingResponse as any)?.data?.data || [];
  const isAlreadyFollowed = followingList.some(
    (u: any) => u.id === post?.user?.id,
  );

  const [isFollowing, setIsFollowing] = useState(isAlreadyFollowed);

  // Local state for optimistic UI updates - must be before conditional return
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [likesCount, setLikesCount] = useState(
    post?.likeCount ?? post?.likesCount ?? 0,
  );

  const [isSaved, setIsSaved] = useState(post?.isSaved || false);
  const [savesCount, setSavesCount] = useState(
    post?.saveCount ?? post?.savesCount ?? 0,
  );

  const [isReposted, setIsReposted] = useState(post?.isReposted || false);
  const [repostsCount, setRepostsCount] = useState(
    post?.repostCount ?? post?.repostsCount ?? 0,
  );
  const [sharesCount, setSharesCount] = useState(
    post?.shareCount ?? post?.sharesCount ?? 0,
  );

  // Sync following state when list changes
  useEffect(() => {
    setIsFollowing(isAlreadyFollowed);
  }, [isAlreadyFollowed]);

  // Sync to prop changes (e.g. infinite scroll loading new pages or refetches)
  useEffect(() => {
    setIsLiked(post?.isLiked || false);
    setLikesCount(post?.likeCount ?? post?.likesCount ?? 0);
    setIsSaved(post?.isSaved || false);
    setSavesCount(post?.saveCount ?? post?.savesCount ?? 0);
    setIsReposted(post?.isReposted || false);
    setRepostsCount(post?.repostCount ?? post?.repostsCount ?? 0);
    setSharesCount(post?.shareCount ?? post?.sharesCount ?? 0);
  }, [
    post?.id,
    post?.isLiked,
    post?.likeCount,
    post?.likesCount,
    post?.isSaved,
    post?.saveCount,
    post?.savesCount,
    post?.isReposted,
    post?.repostCount,
    post?.repostsCount,
    post?.shareCount,
    post?.sharesCount,
  ]);

  if (!post) {
    return null;
  }
  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post?.user?.id) return;

    requireAuth(() => {
      setIsFollowing(true);
      followUserMutation.mutate(post.user.id, {
        onError: () => {
          setIsFollowing(false);
        },
      });
    });
  };

  const handleAvatarClick = () => {
    if (!post?.user?.id) return;
    if (post.user.id === user?.id) {
      router.push('/profile');
    } else {
      router.push(`/other-profile?id=${post.user.id}`);
    }
  };

  const handleLike = () => {
    requireAuth(() => {
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));
      onLikeToggle?.();
    });
  };

  const handleSave = () => {
    requireAuth(() => {
      setIsSaved(!isSaved);
      setSavesCount((prev) => (isSaved ? Math.max(0, prev - 1) : prev + 1));
      onSaveToggle?.();
    });
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const handleRepost = () => {
    requireAuth(() => {
      setIsReposted(!isReposted);
      setRepostsCount((prev) =>
        isReposted ? Math.max(0, prev - 1) : prev + 1,
      );
      repostPostMutation.mutate(post.id);
    });
  };

  const actions = [
    {
      id: 'like',
      icon: Heart,
      count: likesCount || 0,
      label: 'Like',
      isActive: isLiked,
      onClick: handleLike,
      activeClass: 'text-red-500',
    },
    {
      id: 'comment',
      icon: MessageCircle,
      count: post?.commentCount ?? post?.commentsCount ?? 0,
      label: 'Comment',
      isActive: (post?.commentCount ?? post?.commentsCount ?? 0) === -1,
      onClick: () => onCommentClick?.(),
      activeClass: 'text-[#fbbe15]',
    },
    {
      id: 'save',
      icon: Bookmark,
      count: savesCount || 0,
      label: 'Save',
      isActive: isSaved,
      onClick: handleSave,
      activeClass: 'text-[#fbbe15]',
    },
    {
      id: 'share',
      icon: Forward,
      count: sharesCount || 0,
      label: 'Share',
      isActive: (sharesCount || 0) > 0,
      onClick: handleShare,
      activeClass: 'text-[#fbbe15]',
    },
    {
      id: 'repost',
      icon: Repeat,
      count: repostsCount || 0,
      label: 'Repost',
      isActive: isReposted,
      onClick: handleRepost,
      activeClass: 'text-green-500',
    },
  ];

  return (
    <div className='flex flex-col gap-4 pb-4 items-center'>
      {/* Avatar with follow button */}
      <div
        onClick={handleAvatarClick}
        className='relative mb-2 mt-4 cursor-pointer hover:opacity-90 active:scale-95 transition-all'>
        <div className='w-11 h-11 rounded-full overflow-hidden border-2 border-white/80 bg-zinc-800'>
          <Image
            src={
              post?.user?.avatar ||
              post?.user?.profilePicture ||
              '/images/profile.png'
            }
            alt={post?.user?.username || 'User'}
            width={44}
            height={44}
            className='w-full h-full object-cover'
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/profile.png';
            }}
          />
        </div>
        {!isFollowing && !hideFollowButton && post?.user?.id !== user?.id && (
          <div
            onClick={handleFollow}
            className='absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#fbbe15] rounded-full flex items-center justify-center border border-white'>
            <span className='text-white text-base font-bold leading-none mb-0.5'>
              +
            </span>
          </div>
        )}
      </div>

      {actions.map((action) => (
        <button
          key={action.id}
          className={cn(
            'flex flex-col items-center gap-1.5 bg-transparent border-none text-white cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95',
            action.isActive ? action.activeClass : '',
          )}
          onClick={action.onClick}
          aria-label={action.label}>
          <div className='flex items-center justify-center w-9 h-9'>
            <action.icon
              size={24}
              fill={action.isActive ? 'currentColor' : 'none'}
            />
          </div>
          <AnimatedCount count={action.count || 0} />
        </button>
      ))}

      <ShareDrawer
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        postId={post.id}
      />
    </div>
  );
}
