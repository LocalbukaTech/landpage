'use client';

import {Play, Heart, MessageCircle, Share2, Eye} from 'lucide-react';

interface ContentPost {
  id: string;
  thumbnail: string; // CSS gradient used as placeholder
  title: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  duration: string;
  postedAt: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

const POSTS: ContentPost[] = [
  {
    id: '1',
    thumbnail: 'linear-gradient(135deg,#92400e,#FFC727)',
    title: 'Best Jollof Rice spots in Lagos 🍚',
    views: '8,421',
    likes: '1,204',
    comments: '312',
    shares: '89',
    duration: '1:24',
    postedAt: '2 Sep',
    trend: 'up',
    trendValue: '+24.3%',
  },
  {
    id: '2',
    thumbnail: 'linear-gradient(135deg,#1e3a5f,#3b82f6)',
    title: 'Suya night market tour 🔥',
    views: '5,870',
    likes: '934',
    comments: '198',
    shares: '67',
    duration: '2:05',
    postedAt: '31 Aug',
    trend: 'up',
    trendValue: '+11.8%',
  },
  {
    id: '3',
    thumbnail: 'linear-gradient(135deg,#3d2c1e,#c2855a)',
    title: 'Hidden buka restaurants in Abuja',
    views: '3,204',
    likes: '620',
    comments: '104',
    shares: '42',
    duration: '0:58',
    postedAt: '30 Aug',
    trend: 'down',
    trendValue: '-5.2%',
  },
  {
    id: '4',
    thumbnail: 'linear-gradient(135deg,#14532d,#4ade80)',
    title: 'Healthy naija breakfast ideas 🥗',
    views: '2,991',
    likes: '541',
    comments: '87',
    shares: '31',
    duration: '1:47',
    postedAt: '29 Aug',
    trend: 'neutral',
    trendValue: '+0.4%',
  },
];

export function ContentTab() {
  return (
    <div className='space-y-4'>
      <p className='text-xs text-zinc-500'>Showing performance for your last 4 posts in this period.</p>

      {/* Desktop Table */}
      <div className='hidden md:block bg-[#242424] rounded-xl border border-white/5 overflow-hidden'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-white/5'>
              <th className='text-left px-5 py-3 text-zinc-400 font-medium text-xs'>Post</th>
              <th className='text-right px-4 py-3 text-zinc-400 font-medium text-xs'>
                <Eye size={12} className='inline mr-1' />Views
              </th>
              <th className='text-right px-4 py-3 text-zinc-400 font-medium text-xs'>
                <Heart size={12} className='inline mr-1' />Likes
              </th>
              <th className='text-right px-4 py-3 text-zinc-400 font-medium text-xs'>
                <MessageCircle size={12} className='inline mr-1' />Comments
              </th>
              <th className='text-right px-4 py-3 text-zinc-400 font-medium text-xs'>
                <Share2 size={12} className='inline mr-1' />Shares
              </th>
              <th className='text-right px-5 py-3 text-zinc-400 font-medium text-xs'>Trend</th>
            </tr>
          </thead>
          <tbody>
            {POSTS.map((post, i) => (
              <tr
                key={post.id}
                className='border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors'
              >
                <td className='px-5 py-3.5'>
                  <div className='flex items-center gap-3'>
                    {/* Thumbnail */}
                    <div
                      className='relative w-14 h-9 rounded-md shrink-0 flex items-center justify-center overflow-hidden'
                      style={{background: post.thumbnail}}
                    >
                      <Play size={12} className='text-white drop-shadow' fill='white' />
                      <span className='absolute bottom-0.5 right-0.5 text-[9px] text-white bg-black/60 px-0.5 rounded'>
                        {post.duration}
                      </span>
                    </div>
                    <div className='min-w-0'>
                      <p className='text-white text-xs font-medium truncate max-w-[200px]'>{post.title}</p>
                      <p className='text-zinc-500 text-[11px] mt-0.5'>{post.postedAt}</p>
                    </div>
                  </div>
                </td>
                <td className='px-4 py-3.5 text-right text-white text-xs font-medium'>{post.views}</td>
                <td className='px-4 py-3.5 text-right text-white text-xs font-medium'>{post.likes}</td>
                <td className='px-4 py-3.5 text-right text-white text-xs font-medium'>{post.comments}</td>
                <td className='px-4 py-3.5 text-right text-white text-xs font-medium'>{post.shares}</td>
                <td className='px-5 py-3.5 text-right'>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      post.trend === 'up'
                        ? 'text-emerald-400 bg-emerald-400/10'
                        : post.trend === 'down'
                        ? 'text-red-400 bg-red-400/10'
                        : 'text-zinc-400 bg-white/5'
                    }`}
                  >
                    {post.trend === 'up' ? '↑' : post.trend === 'down' ? '↓' : '→'} {post.trendValue}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className='md:hidden space-y-3'>
        {POSTS.map((post) => (
          <div key={post.id} className='bg-[#242424] rounded-xl p-4 border border-white/5 space-y-3'>
            <div className='flex items-center gap-3'>
              <div
                className='relative w-16 h-10 rounded-lg shrink-0 flex items-center justify-center overflow-hidden'
                style={{background: post.thumbnail}}
              >
                <Play size={14} fill='white' className='text-white' />
                <span className='absolute bottom-0.5 right-0.5 text-[9px] text-white bg-black/60 px-0.5 rounded'>
                  {post.duration}
                </span>
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-white text-xs font-medium line-clamp-2'>{post.title}</p>
                <div className='flex items-center justify-between mt-1'>
                  <span className='text-zinc-500 text-[11px]'>{post.postedAt}</span>
                  <span
                    className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                      post.trend === 'up'
                        ? 'text-emerald-400 bg-emerald-400/10'
                        : post.trend === 'down'
                        ? 'text-red-400 bg-red-400/10'
                        : 'text-zinc-400 bg-white/5'
                    }`}
                  >
                    {post.trend === 'up' ? '↑' : post.trend === 'down' ? '↓' : '→'} {post.trendValue}
                  </span>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-4 gap-2'>
              {[
                {icon: <Eye size={11} />, label: 'Views', val: post.views},
                {icon: <Heart size={11} />, label: 'Likes', val: post.likes},
                {icon: <MessageCircle size={11} />, label: 'Comments', val: post.comments},
                {icon: <Share2 size={11} />, label: 'Shares', val: post.shares},
              ].map(({icon, label, val}) => (
                <div key={label} className='bg-[#1a1a1a] rounded-lg p-2 text-center'>
                  <div className='flex items-center justify-center text-zinc-500 mb-0.5'>{icon}</div>
                  <p className='text-white text-xs font-semibold'>{val}</p>
                  <p className='text-zinc-600 text-[10px]'>{label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
