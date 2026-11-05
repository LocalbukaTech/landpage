'use client';

import {useState} from 'react';
import Image from 'next/image';
import {Heart, MessageCircle, Bookmark, Forward, Repeat} from 'lucide-react';
import {AnimatedCount} from '@/components/video/AnimatedCount';
import {useToast} from '@/hooks/use-toast';
import {cn} from '@/lib/utils';

export function AdActionBar() {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(42);
  const [isSaved, setIsSaved] = useState(false);
  const [savesCount, setSavesCount] = useState(12);
  const [isReposted, setIsReposted] = useState(false);
  const [sharesCount, setSharesCount] = useState(5);
  const {toast} = useToast();

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));
  };

  const handleComment = () => {
    toast({
      description: 'Comments are not enabled for this sponsored post',
    });
  };

  const handleSave = () => {
    setIsSaved((prev) => !prev);
    setSavesCount((prev) => (isSaved ? Math.max(0, prev - 1) : prev + 1));
    toast({
      description: isSaved ? 'Removed from saved' : 'Sponsored post saved',
    });
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://localbuka.com';
    setSharesCount((prev) => prev + 1);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LocalBuka - Discover Authentic Bukas',
          text: 'Check out authentic local restaurants on LocalBuka!',
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        description: 'Link copied to clipboard!',
      });
    }
  };

  const handleRepost = () => {
    setIsReposted((prev) => !prev);
    toast({
      description: isReposted ? 'Repost removed' : 'Post reposted to profile',
    });
  };

  const actions = [
    {
      id: 'like',
      icon: Heart,
      count: likesCount,
      label: 'Like',
      isActive: isLiked,
      onClick: handleLike,
      activeClass: 'text-red-500',
      showCount: true,
    },
    {
      id: 'comment',
      icon: MessageCircle,
      count: 2,
      label: 'Comment',
      isActive: false,
      onClick: handleComment,
      activeClass: 'text-[#fbbe15]',
      showCount: true,
    },
    {
      id: 'save',
      icon: Bookmark,
      count: savesCount,
      label: 'Save',
      isActive: isSaved,
      onClick: handleSave,
      activeClass: 'text-[#fbbe15]',
      showCount: true,
    },
    {
      id: 'share',
      icon: Forward,
      count: sharesCount,
      label: 'Share',
      isActive: false,
      onClick: handleShare,
      activeClass: 'text-[#fbbe15]',
      showCount: true,
    },
    {
      id: 'repost',
      icon: Repeat,
      count: 0,
      label: 'Repost',
      isActive: isReposted,
      onClick: handleRepost,
      activeClass: 'text-green-500',
      showCount: false,
    },
  ];

  return (
    <div className='flex flex-col gap-4 pb-4 items-center select-none'>
      {/* Avatar with follow button - Exact pixel match to ActionBar */}
      <div className='relative mb-2 mt-4 cursor-pointer hover:opacity-90 active:scale-95 transition-all'>
        <div className='w-11 h-11 rounded-full overflow-hidden border-2 border-white/80 bg-zinc-800'>
          <Image
            src='/icons/icon-192.png'
            alt='LocalBuka'
            width={44}
            height={44}
            className='w-full h-full object-cover'
          />
        </div>
        <div className='absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#fbbe15] rounded-full flex items-center justify-center border border-white'>
          <span className='text-white text-base font-bold leading-none mb-0.5'>
            +
          </span>
        </div>
      </div>

      {/* Action buttons (Like, Comment, Save, Share, Repost) - Exact pixel match */}
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
            <span className='text-[10px] font-semibold text-zinc-300'>
              {action.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default AdActionBar;
