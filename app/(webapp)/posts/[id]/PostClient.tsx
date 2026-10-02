'use client';

import {useRef, useEffect} from 'react';
import {VideoFeed} from '@/components/video/VideoFeed';
import {usePost} from '@/lib/api/services/posts.hooks';
import {useBatchReportViews} from '@/lib/api/services/insights.hooks';
import {Loader2} from 'lucide-react';
import {BackCircleButton} from '@/components/ui/BackCircleButton';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import type {Post} from '@/types/post';
import {useDynamicBack} from '@/hooks/useDynamicBack';

interface PostClientProps {
  id: string;
  initialPost?: Post;
}

export function PostClient({id, initialPost}: PostClientProps) {
  const searchParams = useSearchParams();
  const openComments = searchParams.get('openComments') === 'true';

  const {
    data: response,
    isLoading,
    isError,
  } = usePost(id, {
    initialData: initialPost ? {data: {data: initialPost}} : undefined,
    enabled: !!id,
  });

  const post =
    (response as any)?.data?.data || (response as any)?.data || response;
  const goBack = useDynamicBack();

  // Report the single-post view after 2 seconds on screen
  const batchReportViews = useBatchReportViews();
  const batchMutateRef = useRef(batchReportViews.mutate);
  batchMutateRef.current = batchReportViews.mutate;
  useEffect(() => {
    if (!id) return;
    const timer = setTimeout(() => batchMutateRef.current([id]), 2000);
    return () => clearTimeout(timer);
  }, [id]);
  return (
    <div className='relative w-full h-full bg-black'>
      <div className='absolute top-6 left-6 z-50'>
        <BackCircleButton onClick={() => goBack('/')} size={32} />
      </div>

      {isLoading && !post ? (
        <div className='flex flex-col items-center justify-center h-full w-full text-white/70 space-y-4'>
          <Loader2 className='w-8 h-8 animate-spin text-[#FFC727]' />
          <p className='font-medium text-sm'>Loading post...</p>
        </div>
      ) : isError && !post ? (
        <div className='flex flex-col items-center justify-center h-full w-full text-white/70 space-y-4'>
          <p className='font-medium text-sm'>
            Post not found or failed to load.
          </p>
          <Link
            href='/'
            className='px-6 py-2 bg-[#FFC727] text-black font-bold rounded-full hover:bg-yellow-500 transition-colors'>
            Back to Feed
          </Link>
        </div>
      ) : post ? (
        <VideoFeed
          posts={[post]}
          initialIndex={0}
          initialMuted={false}
          initialCommentsOpen={openComments}
        />
      ) : null}
    </div>
  );
}
