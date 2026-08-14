'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import type {Post} from '@/types/post';
import {Image as ImageIcon, Pencil, Trash2, Eye} from 'lucide-react';
import {ensureHttps} from '@/lib/utils';

interface StudioImagesTabProps {
  imagePosts: Post[];
  onOpenCreate: () => void;
  onEditClick: (postId: string) => void;
  onDeleteClick: (post: Post) => void;
}

export function StudioImagesTab({
  imagePosts,
  onOpenCreate,
  onEditClick,
  onDeleteClick,
}: StudioImagesTabProps) {
  const router = useRouter();

  return (
    <div className='space-y-5 animate-in fade-in duration-200'>
      <div className='flex items-center justify-between pb-3 border-b border-white/10'>
        <div>
          <h2 className='text-lg font-extrabold text-white tracking-tight flex items-center gap-2'>
            <ImageIcon className='text-blue-400' size={18} /> Photo & Carousel Library
          </h2>
          <p className='text-xs text-zinc-400 mt-0.5 font-medium'>
            Photo galleries and carousel posts published to your account.
          </p>
        </div>
        <button
          onClick={onOpenCreate}
          className='py-2 px-4 bg-[#FBBE15] text-black font-bold text-xs rounded-lg hover:bg-amber-400 transition-all cursor-pointer shadow-sm'>
          + Upload Photos
        </button>
      </div>

      {imagePosts.length === 0 ? (
        <div className='bg-[#121217] border border-white/10 rounded-2xl p-12 text-center space-y-2.5'>
          <ImageIcon size={32} className='mx-auto text-zinc-600' />
          <div className='text-white font-bold text-sm'>No photo posts found</div>
          <p className='text-zinc-500 text-xs max-w-xs mx-auto'>
            You haven&apos;t posted any photo carousels yet. Share your dish images and multi-photo posts!
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5'>
          {imagePosts.map((post) => (
            <div
              key={post.id}
              className='bg-[#121217] border border-white/10 rounded-xl overflow-hidden shadow-md flex flex-col group/card hover:border-blue-500/40 transition-all'>
              <div
                onClick={() => router.push(`/posts/single/${post.id}`)}
                className='relative aspect-square bg-black overflow-hidden group/thumb cursor-pointer'
                title='Click to view photo post'>
                <img
                  src={ensureHttps(post.mediaUrl)}
                  alt={post.caption || 'Photo'}
                  className='w-full h-full object-cover'
                />

                {/* Hover Overlay with Eye View Icon */}
                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 z-10 backdrop-blur-xs'>
                  <div className='p-2 rounded-full bg-[#FBBE15] text-black shadow-lg transform group-hover/thumb:scale-110 transition-transform'>
                    <Eye size={16} className='stroke-[2.5]' />
                  </div>
                  <span className='text-[10px] font-bold text-white drop-shadow-xs'>View Photo</span>
                </div>

                {post.imageCaptions && post.imageCaptions.length > 0 && (
                  <div className='absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-bold text-white bg-black/70 backdrop-blur-xs p-1.5 rounded border border-white/10 line-clamp-1 z-20'>
                    💬 {post.imageCaptions[0]}
                  </div>
                )}
              </div>

              <div className='p-2.5 flex-1 flex flex-col justify-between gap-2'>
                <p className='text-[11px] font-medium text-zinc-200 line-clamp-2 leading-tight'>
                  {post.caption || 'No description'}
                </p>

                <div className='flex items-center justify-between pt-2 border-t border-white/10 gap-1'>
                  <button
                    onClick={() => onEditClick(post.id)}
                    className='flex-1 py-1 bg-[#FBBE15] text-black rounded text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-amber-400 transition-colors cursor-pointer shadow-xs'>
                    <Pencil size={11} /> Edit
                  </button>
                  <button
                    onClick={() => onDeleteClick(post)}
                    className='p-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded text-[11px] transition-colors cursor-pointer shrink-0'
                    title='Delete photo post'>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
