'use client';

import React from 'react';
import Image from 'next/image';
import { Eye, Megaphone, Heart, AlertCircle } from 'lucide-react';
import type { InsightsContentData, InsightsContentPost } from '@/lib/api/services/insights.service';

interface ContentTabProps {
  isLoading?: boolean;
  isError?: boolean;
  data: InsightsContentData | null;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ContentSkeleton() {
  return (
    <div className='flex flex-col gap-4 animate-pulse'>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className='bg-[#141416] border border-white/8 rounded-2xl sm:rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px]'
        >
          <div className='w-12 h-12 bg-white/5 rounded-full mb-3' />
          <div className='w-44 h-4 bg-white/10 rounded mb-2' />
          <div className='w-64 h-3 bg-white/5 rounded' />
        </div>
      ))}
    </div>
  );
}

// ── Single ranked post row ────────────────────────────────────────────────────
function PostRow({ post, rankColor }: { post: InsightsContentPost; rankColor: string }) {
  return (
    <div className='flex items-center gap-3 py-2.5 border-b border-white/5 last:border-none'>
      {/* Rank badge */}
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${rankColor}`}
      >
        {post.rank}
      </span>

      {/* Thumbnail */}
      <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-black shrink-0 relative border border-white/10'>
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          className='object-cover'
          unoptimized
        />
      </div>

      {/* Title + date */}
      <div className='flex-1 min-w-0'>
        <p className='text-xs sm:text-sm font-semibold text-white line-clamp-1 m-0'>
          {post.title}
        </p>
        <span className='text-[10px] text-zinc-500'>{post.date}</span>
      </div>

      {/* Metric */}
      <span className='text-xs font-bold text-[#FBBE15] shrink-0'>{post.formatted}</span>
    </div>
  );
}

// ── A ranked section card ─────────────────────────────────────────────────────
function RankedCard({
  icon,
  title,
  emptyTitle,
  emptyDesc,
  posts,
}: {
  icon: React.ReactNode;
  title: string;
  emptyTitle: string;
  emptyDesc: string;
  posts: InsightsContentPost[];
}) {
  return (
    <div className='bg-[#141416] border border-white/8 rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col gap-3 shadow-lg transition-colors hover:border-white/15'>
      {/* Card header */}
      <div className='flex items-center gap-2.5 mb-1'>
        <div className='w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0'>
          {icon}
        </div>
        <h4 className='text-sm font-bold text-white m-0'>{title}</h4>
      </div>

      {posts.length === 0 ? (
        <div className='flex flex-col items-center justify-center text-center py-6'>
          <p className='text-sm font-bold text-zinc-300 mb-1'>{emptyTitle}</p>
          <p className='text-xs text-zinc-500 max-w-xs leading-relaxed'>{emptyDesc}</p>
        </div>
      ) : (
        <div>
          {/* Column headers */}
          <div className='flex items-center gap-3 pb-2 border-b border-white/5 mb-1'>
            <span className='w-5 shrink-0' />
            <span className='w-10 sm:w-12 shrink-0' />
            <span className='flex-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider'>Post</span>
            <span className='text-[10px] font-bold text-zinc-500 uppercase tracking-wider shrink-0'>Count</span>
          </div>
          {posts.map((p) => (
            <PostRow
              key={p.id + p.rank}
              post={p}
              rankColor={
                p.rank === 1
                  ? 'bg-[#FBBE15] text-[#141414]'
                  : p.rank === 2
                  ? 'bg-zinc-300 text-zinc-900'
                  : 'bg-zinc-700 text-white'
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ContentTab({
  isLoading = false,
  isError = false,
  data,
}: ContentTabProps) {
  if (isLoading) return <ContentSkeleton />;

  if (isError) {
    return (
      <div className='bg-[#141416] border border-white/8 rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[260px] gap-3'>
        <AlertCircle size={28} className='text-zinc-500' />
        <p className='text-sm text-zinc-400'>Could not load content data. Try again later.</p>
      </div>
    );
  }

  const sections = [
    {
      icon: <Eye size={18} strokeWidth={1.75} className='text-zinc-400' />,
      title: 'Highest Views',
      emptyTitle: 'Not enough views yet',
      emptyDesc: 'Post food related content to see your top viewed posts here',
      posts: data?.highestViews ?? [],
    },
    {
      icon: <Megaphone size={18} strokeWidth={1.75} className='text-zinc-400' />,
      title: 'Highest Reach',
      emptyTitle: 'Not enough reach data yet',
      emptyDesc: 'Reach metrics will appear once your content is discovered.',
      posts: data?.highestReach ?? [],
    },
    {
      icon: <Heart size={18} strokeWidth={1.75} className='text-zinc-400' />,
      title: 'Highest Likes',
      emptyTitle: 'Not enough likes yet',
      emptyDesc: 'Community reactions will show up as foodies engage',
      posts: data?.highestLikes ?? [],
    },
  ];

  return (
    <div className='flex flex-col gap-5 animate-in fade-in duration-200'>
      {sections.map((s) => (
        <RankedCard key={s.title} {...s} />
      ))}
    </div>
  );
}
