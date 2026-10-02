'use client';

import {useRef, useEffect} from 'react';
import {VideoFeed} from '@/components/video/VideoFeed';
import {usePost} from '@/lib/api/services/posts.hooks';
import {useBatchReportViews} from '@/lib/api/services/insights.hooks';
import {Loader2} from 'lucide-react';
import {BackCircleButton} from '@/components/ui/BackCircleButton';
import {useRouter, useSearchParams} from 'next/navigation';
import type {Post} from '@/types/post';

interface SinglePostViewClientProps {
  id: string;
  initialPost?: Post;
}

export function SinglePostViewClient({id, initialPost}: SinglePostViewClientProps) {
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

  const post = (response as any)?.data?.data || (response as any)?.data || response;
  const router = useRouter();

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
      {/* Dynamic Back Button */}
      <div className='absolute top-6 left-6 z-50'>
        <BackCircleButton onClick={() => router.back()} size={32} />
      </div>

      {isLoading && !post ? (
        <div className='flex flex-col items-center justify-center h-full w-full text-white/70 space-y-4 min-h-[60vh]'>
          <Loader2 className='w-8 h-8 animate-spin text-[#FFC727]' />
          <p className='font-medium text-sm text-zinc-400'>Loading post...</p>
        </div>
      ) : isError && !post ? (
        <div className='flex flex-col items-center justify-center h-full w-full text-white/70 space-y-4 min-h-[60vh]'>
          <p className='font-medium text-sm text-zinc-300'>
            Post not found or failed to load.
          </p>
          <button
            onClick={() => router.push('/')}
            className='px-6 py-2.5 bg-[#FFC727] text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors shadow-md cursor-pointer'>
            Go Back
          </button>
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
