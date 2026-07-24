'use client';

import {BadgeCheck, Store, ChevronRight} from 'lucide-react';
import {useState} from 'react';
import type {Post} from '@/types/post';
import {cn, formatRelativeShort} from '@/lib/utils';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/context/AuthContext';
import {useRequireAuth} from '@/hooks/useRequireAuth';
import Link from 'next/link';

interface VideoOverlayProps {
  post: Post;
  showTimestamp?: boolean;
  activeCaptionOverride?: string;
  activeImageIndex?: number;
  setActiveImageIndex?: (idx: number) => void;
}

export function VideoOverlay({
  post,
  showTimestamp = true,
  activeCaptionOverride,
  activeImageIndex,
  setActiveImageIndex,
}: VideoOverlayProps) {
  const router = useRouter();
  const {user} = useAuth();
  const {requireAuth} = useRequireAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  if (!post) return null;

  const handleAvatarClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!post?.user?.id) return;
    if (user?.id && post.user.id === user.id) {
      router.push('/profile');
    } else {
      router.push(`/other-profile?id=${post.user.id}`);
    }
  };

  const rawCaption = activeCaptionOverride !== undefined ? activeCaptionOverride : post.caption;
  const displayedCaption = rawCaption?.replace(/#\w+/g, '').trim();
  const isLongCaption =
    displayedCaption?.length > 100 || displayedCaption?.split('\n').length > 2;

  return (
    <div className='absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black via-black/85 to-transparent z-5 pointer-events-none flex flex-col gap-2.5 justify-end'>
      {/* Mobile Dot Indicators */}
      {post.mediaUrls && post.mediaUrls.length > 1 && activeImageIndex !== undefined && setActiveImageIndex && (
        <div className='flex gap-1.5 justify-center w-full md:hidden select-none pointer-events-auto mb-1.5'>
          {post.mediaUrls.map((_: string, idx: number) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex(idx);
              }}
              className={cn(
                'w-1.5 h-1.5 rounded-full border-none p-0 cursor-pointer transition-all',
                idx === activeImageIndex ? 'bg-[#FFC727] scale-110' : 'bg-white/40 hover:bg-white/70'
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      <div className='flex flex-col gap-2.5 max-w-[85%] pointer-events-auto'>
        {/* Restaurant Link pill */}
        {post.restaurantId && (
          <Link
            href={`/buka/restaurant/${post.restaurantId}`}
            className='inline-flex items-center gap-1.5 bg-black/45 hover:bg-black/60 backdrop-blur-xs text-[#FFC727] text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/10 shadow-xs mb-1 transition-all hover:scale-102 w-fit pointer-events-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <Store size={12} className='text-[#FFC727]' />
            <span>{post.restaurant?.name || 'Visit Restaurant'}</span>
            <ChevronRight size={10} className='opacity-70 text-[#FFC727]' />
          </Link>
        )}

        <div className='flex items-center gap-1.5 text-white font-semibold text-[15px]'>
          <span onClick={handleAvatarClick} className='cursor-pointer'>
            @{post.user?.username || post.user?.firstName || 'user'}
          </span>
          {showTimestamp && post.createdAt && (
            <>
              <span className='text-white/40 font-normal'>·</span>
              <span className='text-white/60 font-medium text-sm'>
                {formatRelativeShort(post.createdAt)}
              </span>
            </>
          )}
          {post.user?.isVerified && (
            <BadgeCheck className='text-sky-400 fill-sky-400' size={16} />
          )}
          {post.mediaType === 'image' && (
            <span className='inline-flex items-center gap-1 bg-white/15 text-white/95 text-[10px] font-bold px-1.5 py-0.5 rounded-sm select-none ml-1.5 shadow-sm'>
              <span className='text-[11px]'>📷</span> Photo
            </span>
          )}
        </div>

        <div className='relative'>
          <p
            className={cn(
              'text-white text-sm transition-all duration-300',
              !isExpanded && 'line-clamp-2',
            )}>
            {displayedCaption}
          </p>

          {isLongCaption && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-white/60 text-xs font-bold mt-1 hover:text-white transition-colors cursor-pointer'>
              {isExpanded ? 'see less' : 'see more'}
            </button>
          )}
        </div>

        <div className='flex flex-wrap gap-1 mt-1'>
          {post.tags?.map((tag) => (
            <span key={tag} className='text-[#FFC727] font-medium text-[13px]'>
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
