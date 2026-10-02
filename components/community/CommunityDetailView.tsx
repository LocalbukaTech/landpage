'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Check, Share2, Utensils, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BackCircleButton } from '@/components/ui/BackCircleButton';
import { MembersOnlyModal } from '@/components/community/MembersOnlyModal';

export interface CommunityDetailProps {
  id?: string;
  name?: string;
  description?: string;
  coverImage?: string;
  avatarImage?: string;
  isFree?: boolean;
  price?: string;
  yearlyPrice?: string;
  owner?: string;
  membersCount?: string;
  recentPosts?: Array<{
    id: string;
    image: string;
    title: string;
  }>;
  onBack?: () => void;
}

export function CommunityDetailView({
  id = 'chef-amaka',
  name = "Chef Amaka's kitchen",
  description = 'Weekly private recipes, live cook-alongs, and direct feedback from Chef Amaka for members serious about leveling up their cooking.',
  coverImage = '/images/community/chef-amaka-hero.jpg',
  avatarImage = '/images/community/amaka-avatar.jpg',
  isFree = false,
  price = '₦2,500',
  yearlyPrice = 'or ₦25,000 billed yearly',
  owner = 'Amaka Obi',
  membersCount = '2.1k members . 58 posts',
  recentPosts = [
    {
      id: 'post-1',
      image: '/images/community/recent-post-burger.jpg',
      title: 'Loaded Burgers & Fries Spread',
    },
    {
      id: 'post-2',
      image: '/images/community/recent-post-bbq.jpg',
      title: 'Outdoor BBQ & Suya Grill',
    },
    {
      id: 'post-3',
      image: '/images/community/recent-post-feast.jpg',
      title: 'Grand Banquet Table Feast',
    },
  ],
  onBack,
}: CommunityDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isJoined, setIsJoined] = useState(false);
  const [selectedPostImage, setSelectedPostImage] = useState<string | null>(null);

  const shouldOpenInitially = searchParams ? (searchParams.get('modal') === 'members-only' || searchParams.get('locked') === 'true') : false;
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(shouldOpenInitially);

  const handlePostClick = (image: string) => {
    if (!isFree) {
      setIsMembersModalOpen(true);
    } else {
      setSelectedPostImage(image);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleToggleJoin = () => {
    setIsJoined(!isJoined);
    toast({
      title: isJoined ? 'Left community' : 'Joined community!',
      description: isJoined ? 'You have left this community.' : 'Welcome! You now have access to all posts.',
    });
  };

  return (
    <div className='w-full max-w-[1117px] mx-auto text-white space-y-6 pb-12'>
      {/* ── 1. Hero Cover Image Container ── */}
      <div className='relative w-full max-w-[1117px] h-[480px] overflow-hidden bg-zinc-900 border-b-[3px] border-white/10 shadow-2xl'>
        <Image
          src={coverImage}
          alt={name}
          fill
          priority
          unoptimized
          className='object-cover'
        />

        {/* Top Floating Controls */}
        <div className='absolute top-5 left-5 z-10'>
          <BackCircleButton onClick={handleBack} size={32} color='#FFFFFF' />
        </div>
      </div>

      {/* ── 2. Overlapping Circular Profile Avatar ── */}
      <div className='relative -mt-16 sm:-mt-20 ml-6 sm:ml-8 z-20 mb-2 inline-block'>
        <div className='relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#1a1a1a] shadow-2xl bg-zinc-800'>
          <Image
            src={avatarImage}
            alt={name}
            fill
            unoptimized
            className='object-cover'
          />
        </div>
      </div>

      {/* ── 3. Main Community Info & Subscription Card Grid ── */}
      <div className='px-2 sm:px-4'>
        <div className='flex flex-col lg:flex-row justify-between items-start w-full gap-8'>
          {/* Left Column - Details: Figma specs 489×214, gap 10px */}
          <div
            style={{
              width: '489px',
              height: '214px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              justifyContent: 'center',
            }}
            className='shrink-0'
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: '40px',
                  letterSpacing: '-0.5px',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {name}
              </h1>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: '15px',
                  lineHeight: '23px',
                  letterSpacing: '0%',
                  width: '489px',
                  color: '#a1a1aa',
                  margin: 0,
                }}
              >
                {description}
              </p>
            </div>

            {/* Category Pill Badge */}
            <div>
              {isFree ? (
                <img
                  src='/svgs/free-pill.svg'
                  alt='Free'
                  style={{ width: '48px', height: '28px', display: 'block' }}
                />
              ) : (
                <img
                  src='/svgs/paid-pill.svg'
                  alt='Paid community'
                  style={{ width: '134px', height: '28px', display: 'block' }}
                />
              )}
            </div>

            {/* Meta statistics (Figma: 489px x 27px) */}
            <p
              style={{
                width: '489px',
                height: '27px',
                lineHeight: '27px',
                fontSize: '14px',
                color: '#a1a1aa',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Owned by <span style={{ color: '#ffffff', fontWeight: 500 }}>{owner}</span> . {membersCount}
            </p>
          </div>

          {/* Right Column - Subscription Card (Exact Figma Card) */}
          <div className='flex justify-end shrink-0'>
            {isFree ? (
              <div
                style={{
                  width: '292px',
                  borderRadius: '12.87px',
                  border: '2px solid rgba(255,255,255,0.12)',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  background: '#242424',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                }}
              >
                {/* Header */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: '24px',
                }}>What members share</h3>

                {/* Feature Items with Icons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src='/images/community/vector-5.svg' alt='' style={{ width: '15px', height: '17px' }} />
                    <span style={{ fontSize: '14px', lineHeight: '22px', color: '#d4d4d8' }}>Recipes and cooking tips</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src='/images/community/vector-6-new.svg' alt='' style={{ width: '17px', height: '17px' }} />
                    <span style={{ fontSize: '14px', lineHeight: '22px', color: '#d4d4d8' }}>Food discussions</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src='/images/community/vector-15.svg' alt='' style={{ width: '17px', height: '15px' }} />
                    <span style={{ fontSize: '14px', lineHeight: '22px', color: '#d4d4d8' }}>Photos and short videos</span>
                  </div>
                </div>

                {/* Join Button */}
                <button
                  onClick={handleToggleJoin}
                  style={{ borderRadius: '8px' }}
                  className='w-full py-2.5 bg-[#FFC533] hover:bg-[#e6b12d] text-black font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer'
                >
                  {isJoined ? 'Joined ✓' : '+ Join Community'}
                </button>
              </div>
            ) : (
              <div
                style={{
                  width: '292px',
                  height: '277px',
                  borderRadius: '12.87px',
                  border: '2px solid rgba(255,255,255,0.12)',
                  padding: '12.87px 24.12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#242424',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                }}
              >
                {/* Price heading */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3.22px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                    <span style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>{price}</span>
                    <span style={{ fontSize: '18px', fontWeight: 600, color: '#9ca3af' }}>/month</span>
                  </div>
                  <p style={{ height: '21px', lineHeight: '21px', fontSize: '13px', color: '#9ca3af', margin: 0, fontWeight: 500 }}>{yearlyPrice}</p>
                </div>

                {/* Feature Checklist — flex-1 so it fills the remaining height */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    flex: 1,
                    paddingTop: '4px',
                    paddingBottom: '4px',
                  }}
                  className='text-xs text-zinc-300'
                >
                  <div style={{ width: '209px', height: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check className='w-3.5 h-3.5 text-[#22C55E] shrink-0' />
                    <span style={{ fontSize: '13px', lineHeight: '22px', color: '#d4d4d8' }}>Exclusive weekly recipes</span>
                  </div>
                  <div style={{ width: '209px', height: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check className='w-3.5 h-3.5 text-[#22C55E] shrink-0' />
                    <span style={{ fontSize: '13px', lineHeight: '22px', color: '#d4d4d8' }}>Monthly live cook-alongs</span>
                  </div>
                  <div style={{ width: '209px', height: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check className='w-3.5 h-3.5 text-[#22C55E] shrink-0' />
                    <span style={{ fontSize: '13px', lineHeight: '22px', color: '#d4d4d8' }}>Direct Q&amp;A with Chef Amaka</span>
                  </div>
                </div>

                {/* Subscribe Button — pinned at bottom */}
                <button
                  onClick={() => router.push(`/community/${id || 'chef-amaka'}/subscribe`)}
                  style={{ borderRadius: '8px' }}
                  className='w-full py-2.5 bg-[#FFC533] hover:bg-[#e6b12d] text-black font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer'
                >
                  Subscribe to unlock
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. Recent Posts Section ── */}
      <div className='px-2 sm:px-4 pt-6 space-y-4'>
        <h2 className='text-xl font-bold text-white tracking-wide'>
          Recent posts
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4.5 max-w-[800px]'>
          {recentPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post.image)}
              className='group relative h-[160px] rounded-2xl overflow-hidden bg-zinc-800 border border-white/10 cursor-pointer shadow-md'
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                unoptimized
                className='object-cover group-hover:scale-105 transition-transform duration-500'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Members-only Content Paywall Modal */}
      <MembersOnlyModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        communityId={id}
        communityName={name}
        communityAvatar={avatarImage}
        ownerName={owner}
        price={price ? `${price}/mo` : '₦2,500/mo'}
      />

      {/* Lightbox / Fullscreen Image Preview modal for free community posts */}
      {selectedPostImage && (
        <div
          className='fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4'
          onClick={() => setSelectedPostImage(null)}
        >
          <div className='relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center'>
            <Image
              src={selectedPostImage}
              alt='Enlarged post'
              fill
              unoptimized
              className='object-contain rounded-2xl'
            />
          </div>
        </div>
      )}
    </div>
  );
}
