'use client';

import {Heart, MessageCircle, Bookmark, Forward, Repeat} from 'lucide-react';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import {cn} from '@/lib/utils';
import {useRequireAuth} from '@/hooks/useRequireAuth';
import {useFollowUser, useUserProfile} from '@/lib/api/services/profile.hooks';
import {useRepostPost, useArchivePost, useUnarchivePost} from '@/lib/api/services/posts.hooks';
import {useAuth} from '@/context/AuthContext';
import {useRouter} from 'next/navigation';
import {useToast} from '@/hooks/use-toast';
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
  const {toast} = useToast();
  const followUserMutation = useFollowUser();
  const repostPostMutation = useRepostPost();
  const archivePostMutation = useArchivePost();
  const unarchivePostMutation = useUnarchivePost();
  const [isShareOpen, setIsShareOpen] = useState(false);

  const _isOwnPost = !!(user?.id && post?.user?.id && post.user.id === user.id);

  // Fetch user profile of post creator to check if already followed
  const {data: profileResponse} = useUserProfile(
    user?.id && post?.user?.id && post?.user?.id !== user?.id ? post.user.id : ''
  );
  const profileData =
    (profileResponse as any)?.data?.data || (profileResponse as any)?.data;
  const isAlreadyFollowed = profileData?.isFollowing ?? false;

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

  const handleAvatarClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!post?.user?.id) return;
    if (user?.id && post.user.id === user.id) {
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

  const _handleArchiveToggle = () => {
    requireAuth(() => {
      if (post.isArchived) {
        unarchivePostMutation.mutate(post.id, {
          onSuccess: () => {
            toast({
              title: 'Restored',
              description: 'Post restored back to profile.',
              variant: 'success',
            });
            router.push('/profile');
          },
          onError: () => {
            toast({
              title: 'Error',
              description: 'Could not restore post.',
              variant: 'destructive',
            });
          },
        });
      } else {
        archivePostMutation.mutate(post.id, {
          onSuccess: () => {
            toast({
              title: 'Archived',
              description: 'Post archived! View it in your profile archive.',
              variant: 'success',
            });
            router.push('/profile?tab=archive');
          },
          onError: () => {
            toast({
              title: 'Error',
              description: 'Could not archive post.',
              variant: 'destructive',
            });
          },
        });
      }
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
      showCount: true,
    },
    {
      id: 'comment',
      icon: MessageCircle,
      count: post?.commentCount ?? post?.commentsCount ?? 0,
      label: 'Comment',
      isActive: (post?.commentCount ?? post?.commentsCount ?? 0) === -1,
      onClick: () => onCommentClick?.(),
      activeClass: 'text-[#fbbe15]',
      showCount: true,
    },
    {
      id: 'save',
      icon: Bookmark,
      count: savesCount || 0,
      label: 'Save',
      isActive: isSaved,
      onClick: handleSave,
      activeClass: 'text-[#fbbe15]',
      showCount: true,
    },
    {
      id: 'share',
      icon: Forward,
      count: sharesCount || 0,
      label: 'Share',
      isActive: (sharesCount || 0) > 0,
      onClick: handleShare,
      activeClass: 'text-[#fbbe15]',
      showCount: true,
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
        {!isFollowing && !hideFollowButton && post?.user?.id !== user?.id && !profileData?.blockStatus?.isBlocked && (
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
          {action.showCount ? (
            <AnimatedCount count={action.count || 0} />
          ) : (
            <span className='text-[10px] font-semibold text-zinc-300'>{action.label}</span>
          )}
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
