'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import type {Post} from '@/types/post';
import type {StudioMetrics, StudioTab} from './types';
import {
  PlusCircle,
  Layers,
  Video,
  Image as ImageIcon,
  Heart,
  Film,
  Pencil,
  Trash2,
  Loader2,
  Eye,
} from 'lucide-react';

interface StudioOverviewTabProps {
  metrics: StudioMetrics;
  postsList: Post[];
  isLoadingPosts: boolean;
  onOpenCreate: () => void;
  onTabChange: (tab: StudioTab) => void;
  onEditClick: (postId: string) => void;
  onDeleteClick: (post: Post) => void;
}

export function StudioOverviewTab({
  metrics,
  postsList,
  isLoadingPosts,
  onOpenCreate,
  onTabChange,
  onEditClick,
  onDeleteClick,
}: StudioOverviewTabProps) {
  const router = useRouter();

  return (
    <div className='space-y-6 animate-in fade-in duration-200'>
      {/* Welcome Banner */}
      <div className='rounded-2xl bg-[#141419] border border-white/10 p-5 md:p-6 shadow-xl'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <div className='space-y-1.5 max-w-xl'>
            <h1 className='text-xl md:text-2xl font-extrabold text-white tracking-tight'>
              Welcome to Localbuka Studio
            </h1>
            <p className='text-zinc-400 text-xs leading-relaxed font-medium'>
              Manage your culinary videos and photos, track community engagements, and upload new content seamlessly.
            </p>
          </div>

          <button
            onClick={onOpenCreate}
            className='py-2.5 px-5 bg-[#FBBE15] text-black font-bold rounded-xl hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-2 text-xs shadow-md cursor-pointer shrink-0 border-none'>
            <PlusCircle size={16} className='stroke-[2.5]' />
            <span>Upload New Post</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4'>
        <div className='bg-[#121217] border border-white/10 rounded-xl p-4 shadow-md'>
          <div className='flex items-center justify-between'>
            <span className='text-[11px] font-bold text-zinc-400 uppercase tracking-wider'>
              Total Posts
            </span>
            <div className='p-1.5 bg-white/5 rounded-lg text-[#FBBE15]'>
              <Layers size={16} />
            </div>
          </div>
          <div className='text-2xl font-extrabold text-white mt-2'>
            {metrics.totalPosts}
          </div>
          <div className='text-[10px] text-zinc-500 mt-0.5 font-medium'>
            Published content
          </div>
        </div>

        <div className='bg-[#121217] border border-white/10 rounded-xl p-4 shadow-md'>
          <div className='flex items-center justify-between'>
            <span className='text-[11px] font-bold text-zinc-400 uppercase tracking-wider'>
              Video Posts
            </span>
            <div className='p-1.5 bg-purple-500/10 rounded-lg text-purple-400'>
              <Video size={16} />
            </div>
          </div>
          <div className='text-2xl font-extrabold text-white mt-2'>
            {metrics.videoPostsCount}
          </div>
          <div className='text-[10px] text-zinc-500 mt-0.5 font-medium'>
            Shorts & videos
          </div>
        </div>

        <div className='bg-[#121217] border border-white/10 rounded-xl p-4 shadow-md'>
          <div className='flex items-center justify-between'>
            <span className='text-[11px] font-bold text-zinc-400 uppercase tracking-wider'>
              Photo Carousels
            </span>
            <div className='p-1.5 bg-blue-500/10 rounded-lg text-blue-400'>
              <ImageIcon size={16} />
            </div>
          </div>
          <div className='text-2xl font-extrabold text-white mt-2'>
            {metrics.imagePostsCount}
          </div>
          <div className='text-[10px] text-zinc-500 mt-0.5 font-medium'>
            Image galleries
          </div>
        </div>

        <div className='bg-[#121217] border border-white/10 rounded-xl p-4 shadow-md'>
          <div className='flex items-center justify-between'>
            <span className='text-[11px] font-bold text-zinc-400 uppercase tracking-wider'>
              Total Likes
            </span>
            <div className='p-1.5 bg-rose-500/10 rounded-lg text-rose-400'>
              <Heart size={16} />
            </div>
          </div>
          <div className='text-2xl font-extrabold text-white mt-2'>
            {metrics.totalLikes}
          </div>
          <div className='text-[10px] text-zinc-500 mt-0.5 font-medium'>
            Community appreciation
          </div>
        </div>
      </div>

      {/* Recent Posts Manager (Compact Cards with Hover View Action) */}
      <div className='bg-[#121217] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4'>
        <div className='flex items-center justify-between pb-3 border-b border-white/10'>
          <div>
            <h3 className='text-base font-extrabold text-white tracking-tight'>
              Recent Content & Posts
            </h3>
            <p className='text-xs text-zinc-400 mt-0.5 font-medium'>
              Manage, edit, or remove your published content.
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => onTabChange('videos')}
              className='text-xs font-bold text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 transition-colors cursor-pointer'>
              Videos ({metrics.videoPostsCount})
            </button>
            <button
              onClick={() => onTabChange('images')}
              className='text-xs font-bold text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 transition-colors cursor-pointer'>
              Photos ({metrics.imagePostsCount})
            </button>
          </div>
        </div>

        {isLoadingPosts ? (
          <div className='flex items-center justify-center py-12 gap-3'>
            <Loader2 className='w-5 h-5 animate-spin text-[#FBBE15]' />
            <span className='text-zinc-400 text-xs font-semibold'>
              Loading your posts...
            </span>
          </div>
        ) : postsList.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center space-y-2.5'>
            <div className='w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 border border-white/10'>
              <Film size={20} />
            </div>
            <div className='text-zinc-300 font-bold text-sm'>
              No posts published yet
            </div>
            <p className='text-zinc-500 text-xs max-w-xs'>
              Share your food discoveries, restaurant moments, and culinary videos!
            </p>
            <button
              onClick={onOpenCreate}
              className='py-2 px-5 bg-[#FBBE15] text-black font-bold text-xs rounded-lg hover:bg-amber-400 transition-all cursor-pointer shadow-sm'>
              Upload First Post
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
            {postsList.slice(0, 10).map((post) => {
              const isVideo =
                post.mediaType === 'video' ||
                post.mediaUrl?.match(/\.(mp4|mov|webm)$/i);

              return (
                <div
                  key={post.id}
                  className='bg-[#181820] border border-white/10 rounded-xl overflow-hidden shadow-md flex flex-col group/card hover:border-[#FBBE15]/40 transition-all'>
                  <div
                    onClick={() => router.push(`/posts/single/${post.id}`)}
                    className='relative aspect-square bg-black overflow-hidden group/thumb cursor-pointer'
                    title='Click to view post'>
                    {isVideo ? (
                      <video
                        src={post.mediaUrl}
                        className='w-full h-full object-cover'
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={post.mediaUrl}
                        alt={post.caption || 'Thumbnail'}
                        className='w-full h-full object-cover'
                      />
                    )}

                    {/* Hover Overlay with Eye View Icon */}
                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 z-10 backdrop-blur-xs'>
                      <div className='p-2 rounded-full bg-[#FBBE15] text-black shadow-lg transform group-hover/thumb:scale-110 transition-transform'>
                        <Eye size={16} className='stroke-[2.5]' />
                      </div>
                      <span className='text-[10px] font-bold text-white drop-shadow-xs'>View Post</span>
                    </div>

                    <div className='absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white flex items-center gap-1 backdrop-blur-xs z-20'>
                      {isVideo ? <Video size={9} /> : <ImageIcon size={9} />}
                      {isVideo ? 'Video' : 'Photo'}
                    </div>

                    <div className='absolute bottom-1.5 left-1.5 text-[10px] font-bold text-rose-400 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs z-20'>
                      <Heart size={10} fill='currentColor' />
                      {post.likeCount || post.likesCount || 0}
                    </div>
                  </div>

                  <div className='p-2.5 flex-1 flex flex-col justify-between gap-2'>
                    <p className='text-[11px] font-medium text-zinc-200 line-clamp-2 leading-tight'>
                      {post.caption || 'No description'}
                    </p>

                    <div className='flex items-center justify-between pt-2 border-t border-white/5 gap-1'>
                      <button
                        onClick={() => onEditClick(post.id)}
                        className='flex-1 py-1 bg-[#FBBE15]/15 text-[#FBBE15] hover:bg-[#FBBE15]/25 border border-[#FBBE15]/30 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer'>
                        <Pencil size={11} />
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteClick(post)}
                        className='p-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded text-[11px] transition-all cursor-pointer shrink-0'
                        title='Delete post'>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
