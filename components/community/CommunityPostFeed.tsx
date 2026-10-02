'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { BackCircleButton } from '@/components/ui/BackCircleButton';

/* ─────────────────────── Types ─────────────────────── */
interface CommentItem {
  id: string;
  avatar: string;
  username: string;
  timeAgo: string;
  text: string;
  replies?: CommentItem[];
}

interface CommunityPost {
  id: string;
  username: string;
  avatar: string;
  timeAgo: string;
  text: string;
  image?: string;
  likes: string;
  comments: string;
  saves: string;
  commentList: CommentItem[];
}

/* ─────────────────────── Mock Data ─────────────────────── */
const mockPosts: CommunityPost[] = [
  {
    id: 'post-1',
    username: '@chef_tolu',
    avatar: '/images/community/post-chef.jpg',
    timeAgo: '3h',
    text: 'Tried jollof with smoked paprika this time, unexpectedly good. Anyone else experiment with theirs?',
    image: '/images/community/post-jollof.jpg',
    likes: '24k',
    comments: '4k',
    saves: '4k',
    commentList: [
      {
        id: 'c1',
        avatar: '/images/community/avatar-1.png',
        username: 'Alfredo Saris',
        timeAgo: '1h ago',
        text: 'Loved it! The food was nice.',
        replies: [
          { id: 'c1r1', avatar: '/images/community/avatar-3.png', username: 'chef_tolu', timeAgo: '45m ago', text: 'Thank you so much! 🙏' },
        ],
      },
      {
        id: 'c2',
        avatar: '/images/community/avatar-2.png',
        username: 'Ralph Edwards',
        timeAgo: '3h ago',
        text: 'Amazing. I am coming to your restaurant',
      },
      {
        id: 'c3',
        avatar: '/images/community/avatar-3.png',
        username: 'Marvin McKinney',
        timeAgo: '40s ago',
        text: 'I have eaten there before. They are great',
      },
      {
        id: 'c4',
        avatar: '/images/community/avatar-1.png',
        username: 'Cody Fisher',
        timeAgo: '8m ago',
        text: 'Not that amazing. I prefer Chicken',
      },
      {
        id: 'c5',
        avatar: '/images/community/avatar-2.png',
        username: 'Courtney Henry',
        timeAgo: '4h ago',
        text: 'Where can i get the meal, anyone???',
        replies: [
          { id: 'c5r1', avatar: '/images/community/avatar-3.png', username: 'chef_tolu', timeAgo: '3h ago', text: 'DM me for the address!' },
        ],
      },
    ],
  },
  {
    id: 'post-2',
    username: '@Killz_bites',
    avatar: '/images/community/avatar-2.png',
    timeAgo: '3h',
    text: "Fresh out the kitchen and ready to go! 🍽️ Whether it's lunch, a meeting, or a full-on event, we've got your meals packed and ready. Killz_bites, Surulere",
    image: '/images/community/post-killz-bites.jpg',
    likes: '18k',
    comments: '2k',
    saves: '3k',
    commentList: [
      { id: 'c6', avatar: '/images/community/avatar-1.png', username: 'Ada Eats', timeAgo: '18h ago', text: 'Looks so good! 🔥' },
      { id: 'c7', avatar: '/images/community/avatar-3.png', username: 'Tunde_foodie', timeAgo: '20h ago', text: 'Surulere gang represent 🙌' },
    ],
  },
  {
    id: 'post-3',
    username: '@mama_cooks',
    avatar: '/images/community/avatar-3.png',
    timeAgo: '5h',
    text: 'Sunday egusi soup hitting different today 🫕 Made it with fresh ede and cocoyam. Drop your egusi tips below!',
    image: '/images/community/post-grill.jpg',
    likes: '31k',
    comments: '6k',
    saves: '5k',
    commentList: [
      { id: 'c8', avatar: '/images/community/avatar-1.png', username: 'Nkechi_cooks', timeAgo: '2h ago', text: 'Add crayfish and stockfish for extra depth! 🦐' },
      { id: 'c9', avatar: '/images/community/avatar-2.png', username: 'BigBoyLagos', timeAgo: '3h ago', text: 'Mama cooks never misses. Respect!' },
    ],
  },
];

/* ─────────────────────── Comments Panel ─────────────────────── */
function CommentsPanel({
  post,
  onClose,
}: {
  post: CommunityPost;
  onClose: () => void;
}) {
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [inputValue, setInputValue] = useState('');

  const toggleLike = (id: string) =>
    setLikedComments(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleReplies = (id: string) =>
    setExpandedReplies(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]'
        onClick={onClose}
      />

      {/* Panel */}
      <div className='fixed right-0 top-0 h-full w-[320px] sm:w-[360px] bg-[#1a1a1a] border-l border-white/10 z-50 flex flex-col shadow-2xl animate-slide-in-right'>
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0'>
          <span className='text-white font-semibold text-base'>Comment</span>
          <button
            onClick={onClose}
            className='w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer'
            aria-label='Close comments'
          >
            <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
              <path d='M1 1L13 13M13 1L1 13' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
            </svg>
          </button>
        </div>

        {/* Comment List */}
        <div className='flex-1 overflow-y-auto px-5 py-3 space-y-5'>
          {post.commentList.map(comment => (
            <div key={comment.id}>
              <div className='flex gap-3'>
                <div className='relative w-8 h-8 rounded-full overflow-hidden shrink-0 mt-0.5'>
                  <Image src={comment.avatar} alt={comment.username} fill className='object-cover' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-1.5 flex-wrap'>
                      <span className='text-white text-sm font-semibold'>{comment.username}</span>
                      <span className='text-gray-500 text-xs'>{comment.timeAgo}</span>
                    </div>
                    {/* Heart per comment */}
                    <button
                      onClick={() => toggleLike(comment.id)}
                      className='shrink-0 cursor-pointer'
                      aria-label='Like comment'
                    >
                      <svg
                        width='14'
                        height='13'
                        viewBox='0 0 23 21'
                        fill={likedComments[comment.id] ? '#FFC533' : 'none'}
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M16.6759 0.875C13.1256 0.875 11.3756 4.375 11.3756 4.375C11.3756 4.375 9.62556 0.875 6.07525 0.875C3.18993 0.875 0.90509 3.28891 0.875559 6.1693C0.815403 12.1483 5.61861 16.4002 10.8834 19.9735C11.0285 20.0723 11.2 20.1251 11.3756 20.1251C11.5511 20.1251 11.7226 20.0723 11.8677 19.9735C17.132 16.4002 21.9352 12.1483 21.8756 6.1693C21.846 3.28891 19.5612 0.875 16.6759 0.875Z'
                          stroke={likedComments[comment.id] ? '#FFC533' : '#6b7280'}
                          strokeWidth='1.75'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                  </div>

                  <p className='text-gray-300 text-sm mt-0.5 leading-relaxed'>{comment.text}</p>

                  <div className='flex items-center gap-4 mt-1.5'>
                    {comment.replies && comment.replies.length > 0 && (
                      <button
                        onClick={() => toggleReplies(comment.id)}
                        className='text-gray-400 text-xs flex items-center gap-1 hover:text-white transition-colors cursor-pointer'
                      >
                        <svg width='10' height='10' viewBox='0 0 10 10' fill='none'>
                          <path
                            d={expandedReplies[comment.id] ? 'M2 6L5 3L8 6' : 'M2 4L5 7L8 4'}
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        View {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                      </button>
                    )}
                    <button className='text-gray-500 text-xs hover:text-white transition-colors cursor-pointer'>
                      Reply
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies && expandedReplies[comment.id] && (
                    <div className='mt-3 space-y-3 pl-2 border-l border-white/10'>
                      {comment.replies.map(reply => (
                        <div key={reply.id} className='flex gap-2'>
                          <div className='relative w-6 h-6 rounded-full overflow-hidden shrink-0 mt-0.5'>
                            <Image src={reply.avatar} alt={reply.username} fill className='object-cover' />
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center gap-1.5'>
                              <span className='text-white text-xs font-semibold'>{reply.username}</span>
                              <span className='text-gray-500 text-xs'>{reply.timeAgo}</span>
                            </div>
                            <p className='text-gray-300 text-xs mt-0.5'>{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className='px-4 py-3 border-t border-white/10 shrink-0'>
          <div className='flex items-center gap-2 bg-[#252525] rounded-full px-4 py-2.5 border border-white/10'>
            <input
              type='text'
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && inputValue.trim()) setInputValue('');
              }}
              placeholder='Add a comment…'
              className='flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-500'
            />
            <button
              onClick={() => setInputValue('')}
              disabled={!inputValue.trim()}
              className='w-8 h-8 rounded-full bg-[#FFC533] flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity cursor-pointer'
              aria-label='Send comment'
            >
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
                <path d='M12 19V5M5 12L12 5L19 12' stroke='#111' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  );
}

/* ─────────────────────── Main Feed ─────────────────────── */
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export interface CommunityPostFeedProps {
  communityId?: string;
  communityName?: string;
  communityLogo?: string;
  communityAvatar?: string;
  viewState?: 'feed' | 'empty' | 'expired';
  onBack?: () => void;
}

export function CommunityPostFeed({
  communityId = '1',
  communityName = 'Nigeria food and culture',
  communityLogo = '/images/community/community-logo.svg',
  communityAvatar = '/images/community/avatar-1.png',
  viewState: initialViewState = 'feed',
  onBack,
}: CommunityPostFeedProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [currentViewState, setCurrentViewState] = useState<'feed' | 'empty' | 'expired'>(initialViewState);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openCommentsPost, setOpenCommentsPost] = useState<CommunityPost | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const feedRef = useRef<HTMLDivElement>(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const scrollToPost = (index: number) => {
    const clamped = Math.max(0, Math.min(index, posts.length - 1));
    setCurrentIndex(clamped);
    const postEl = document.getElementById(`community-post-${clamped}`);
    if (postEl) postEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleShare = (post: CommunityPost) => {
    if (navigator.share) {
      navigator.share({ title: post.username, text: post.text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link Copied! 📋', description: 'Post URL copied to your clipboard.' });
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      username: '@food_enthusiast',
      avatar: '/images/community/avatar-1.png',
      timeAgo: 'Just now',
      text: newPostText.trim(),
      likes: '0',
      comments: '0',
      saves: '0',
      commentList: [],
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
    setShowCreateModal(false);
    setCurrentViewState('feed');
    toast({
      title: 'Post Published! 🎉',
      description: 'Your post was shared with the community.',
    });
  };

  return (
    <>
      <div className='w-full max-w-[620px] mx-auto relative flex flex-col min-h-[calc(100vh-140px)]'>
        {/* Community Header with Circular Back Button */}
        <div className='flex items-center gap-4 mb-6 px-1'>
          <BackCircleButton onClick={handleBack} size={26} color='#FFFFFF' className='text-white' />

          <div className='flex items-center gap-3'>
            {currentViewState === 'expired' ? (
              <div className='relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0'>
                <Image src={communityAvatar} alt={communityName} fill className='object-cover' />
              </div>
            ) : (
              <div className='w-9 h-9 rounded-lg bg-[#FFC533] flex items-center justify-center shrink-0 overflow-hidden'>
                <Image src={communityLogo} alt={communityName} width={28} height={28} className='object-contain' />
              </div>
            )}
            <h2 className='text-white font-bold text-lg leading-tight'>{communityName}</h2>
          </div>
        </div>

        {/* EMPTY STATE */}
        {currentViewState === 'empty' && (
          <div className='flex-1 flex flex-col items-center justify-center py-12'>
            <div
              className='flex flex-col items-center justify-center text-center mx-auto'
              style={{
                maxWidth: '430px',
                width: '100%',
                gap: '24px',
              }}
            >
              <div className='flex flex-col items-center gap-2 max-w-[360px]'>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '20px', lineHeight: '140%', color: 'white', margin: 0 }}>
                  Start the conversation
                </h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: '14px', lineHeight: '140%', color: '#9ca3af', margin: 0 }}>
                  No posts in this community yet. Be the first to share something.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: '#FFC533',
                  color: '#111',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  gap: '8px',
                  transition: 'opacity 0.2s',
                }}
                className='hover:opacity-90 active:scale-95'
              >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                  <line x1='12' y1='5' x2='12' y2='19'></line>
                  <line x1='5' y1='12' x2='19' y2='12'></line>
                </svg>
                <span>Create a post</span>
              </button>
            </div>
          </div>
        )}

        {/* EXPIRED MEMBERSHIP STATE */}
        {currentViewState === 'expired' && (
          <div className='flex-1 flex flex-col items-center justify-center py-12'>
            <div
              className='flex flex-col items-center justify-center text-center mx-auto'
              style={{
                maxWidth: '430px',
                width: '100%',
                gap: '24px',
              }}
            >
              <div className='flex flex-col items-center gap-2 max-w-[360px]'>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '20px', lineHeight: '140%', color: 'white', margin: 0 }}>
                  Your membership has expired
                </h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: '14px', lineHeight: '140%', color: '#9ca3af', margin: 0 }}>
                  Renew to keep access to Chef Amaka&apos;s kitchen and its posts.
                </p>
              </div>
              <Link
                href={`/community/${communityId}/subscribe`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  background: '#FFC533',
                  color: '#111',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  gap: '8px',
                  transition: 'opacity 0.2s',
                }}
                className='hover:opacity-90 active:scale-95'
              >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                  <polyline points='23 4 23 10 17 10'></polyline>
                  <polyline points='1 20 1 14 7 14'></polyline>
                  <path d='M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'></path>
                </svg>
                <span>Renew membership</span>
              </Link>
            </div>
          </div>
        )}

        {/* ACTIVE POSTS FEED */}
        {currentViewState === 'feed' && (
          <>
            <div ref={feedRef} className='space-y-6'>
              {posts.map((post, index) => {
                const isLiked = likedPosts[post.id];
                const isSaved = savedPosts[post.id];

                return (
                  <div key={post.id} id={`community-post-${index}`} className='bg-transparent'>
                    {/* Author Row */}
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0'>
                        <Image src={post.avatar} alt={post.username} fill className='object-cover' />
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-white font-semibold text-sm'>{post.username}</span>
                        <span className='text-gray-400 text-sm'>· {post.timeAgo}</span>
                      </div>
                    </div>

                    {/* Post Text */}
                    <p className='text-gray-200 text-sm leading-relaxed mb-3'>{post.text}</p>

                    {/* Post Image */}
                    {post.image && (
                      <div className='relative w-full aspect-[4/3] max-w-[340px] rounded-2xl overflow-hidden mb-4 bg-zinc-800'>
                        <Image src={post.image} alt={`Post by ${post.username}`} fill className='object-cover' />
                      </div>
                    )}

                    {/* Engagement Bar */}
                    <div className='flex items-center gap-5'>
                      {/* Like */}
                      <button
                        onClick={() => setLikedPosts(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className='flex items-center gap-2 group cursor-pointer'
                        aria-label='Like post'
                      >
                        <div className='w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors'>
                          <Image
                            src='/images/community/vector-8.svg'
                            alt='Like'
                            width={16}
                            height={15}
                            className={`transition-all ${isLiked ? 'scale-110' : 'opacity-70'}`}
                          />
                        </div>
                        <span className='text-gray-300 text-sm font-medium'>{post.likes}</span>
                      </button>

                      {/* Comment — opens panel */}
                      <button
                        onClick={() => setOpenCommentsPost(post)}
                        className='flex items-center gap-2 group cursor-pointer'
                        aria-label='Comment'
                      >
                        <div className='w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors'>
                          <Image src='/images/community/vector-9.svg' alt='Comment' width={16} height={14} className='opacity-70' />
                        </div>
                        <span className='text-gray-300 text-sm font-medium'>{post.comments}</span>
                      </button>

                      {/* Save / Bookmark */}
                      <button
                        onClick={() => setSavedPosts(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className='flex items-center gap-2 group cursor-pointer'
                        aria-label='Save post'
                      >
                        <div className='w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors'>
                          <Image
                            src='/images/community/icon-bookmark.png'
                            alt='Save'
                            width={16}
                            height={21}
                            className={`transition-all ${isSaved ? 'opacity-100 scale-110' : 'opacity-70'}`}
                          />
                        </div>
                        <span className='text-gray-300 text-sm font-medium'>{post.saves}</span>
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handleShare(post)}
                        className='flex items-center gap-2 group cursor-pointer'
                        aria-label='Share post'
                      >
                        <div className='w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors'>
                          <Image src='/images/community/icon-share.svg' alt='Share' width={16} height={14} className='opacity-70' />
                        </div>
                        <span className='text-gray-300 text-sm font-medium'>Share</span>
                      </button>
                    </div>

                    {index < posts.length - 1 && <div className='mt-6 border-t border-white/8' />}
                  </div>
                );
              })}
            </div>

            {/* Up / Down Navigation */}
            {posts.length > 1 && (
              <div className='fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40'>
                <button
                  onClick={() => scrollToPost(currentIndex - 1)}
                  disabled={currentIndex === 0}
                  className='w-10 h-10 rounded-full border border-white/40 bg-transparent hover:bg-white/10 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer'
                  aria-label='Previous post'
                >
                  <svg width='20' height='20' viewBox='0 0 44 44' fill='none'>
                    <circle cx='22' cy='22' r='20' stroke='white' strokeWidth='3' />
                    <path d='M30 26L22 18L14 26' stroke='white' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                </button>
                <button
                  onClick={() => scrollToPost(currentIndex + 1)}
                  disabled={currentIndex === posts.length - 1}
                  className='w-10 h-10 rounded-full border border-white/40 bg-transparent hover:bg-white/10 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer'
                  aria-label='Next post'
                >
                  <svg width='20' height='20' viewBox='0 0 44 44' fill='none'>
                    <circle cx='22' cy='22' r='20' stroke='white' strokeWidth='3' />
                    <path d='M14 18L22 26L30 18' stroke='white' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='w-full max-w-md bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4'>
            <div className='flex items-center justify-between border-b border-white/10 pb-3'>
              <h3 className='text-white font-bold text-base'>Create a post</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className='text-gray-400 hover:text-white cursor-pointer'
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePost} className='space-y-4'>
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="What's cooking? Share a recipe, tip, or question…"
                rows={4}
                className='w-full bg-[#282828] border border-white/10 rounded-xl p-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC533]'
                autoFocus
              />
              <div className='flex justify-end gap-3'>
                <button
                  type='button'
                  onClick={() => setShowCreateModal(false)}
                  className='px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/10 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={!newPostText.trim()}
                  className='px-5 py-2 rounded-xl bg-[#FFC533] hover:bg-[#e6b12d] text-gray-950 font-bold text-sm disabled:opacity-40 cursor-pointer shadow-md'
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comments Panel */}
      {openCommentsPost && (
        <CommentsPanel post={openCommentsPost} onClose={() => setOpenCommentsPost(null)} />
      )}
    </>
  );
}

