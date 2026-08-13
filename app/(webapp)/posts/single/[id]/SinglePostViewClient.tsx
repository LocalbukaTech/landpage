'use client';

import {VideoFeed} from '@/components/video/VideoFeed';
import {usePost} from '@/lib/api/services/posts.hooks';
import {Loader2, ArrowLeft} from 'lucide-react';
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

  return (
    <div className='relative w-full h-full bg-black'>
      {/* Dynamic Back Button */}
      <button
        onClick={() => router.back()}
        className='absolute top-6 left-6 z-50 p-2.5 bg-black/40 hover:bg-black/70 rounded-full text-white transition-all backdrop-blur-md cursor-pointer border border-white/10 shadow-lg'
        title='Go Back'>
        <ArrowLeft size={22} />
      </button>

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
            onClick={() => router.push('/feeds')}
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
