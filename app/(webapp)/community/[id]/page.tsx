'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityDetailView } from '@/components/community/CommunityDetailView';
import { MobilePaidCommunityDetails } from '@/components/community/mobile/MobilePaidCommunityDetails';
import { MobileFreeCommunityDetails } from '@/components/community/mobile/MobileFreeCommunityDetails';
import { MOCK_COMMUNITIES } from '@/components/community/mobile/mockData';
import { useCommunity } from '@/lib/api/services/community.hooks';
import { toMobileCommunityItem } from '@/lib/api/services/community.service';

interface CommunityDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: liveCommunity } = useCommunity(id);

  const isChefAmaka = id === 'chef-amaka' || id === '2';
  const isPaidCommunity = liveCommunity ? !liveCommunity.isFree : isChefAmaka;
  const isNigeriaCulture = !id || id === 'nigeria-food-and-culture' || id === 'nigeria-food' || id === '1';

  const mobileCommunity = liveCommunity
    ? toMobileCommunityItem(liveCommunity)
    : MOCK_COMMUNITIES.find((c) => c.id === id) ||
      (isChefAmaka ? MOCK_COMMUNITIES[1] : MOCK_COMMUNITIES[0]);

  if (isPaidCommunity) {
    return (
      <MainLayout>
        {/* ── Mobile View (< md): Native Mobile Paid Community Detail ── */}
        <div className='block md:hidden min-h-screen bg-[#141414]'>
          <MobilePaidCommunityDetails
            community={mobileCommunity}
            onBack={() => router.push('/community')}
            onSubscribe={() => router.push(`/community/${id}/subscribe`)}
          />
        </div>

        {/* ── Desktop View (≥ md): Exact Existing Desktop Layout ── */}
        <div className='hidden md:block w-full max-w-[1117px] mx-auto px-2 sm:px-4 py-4'>
          <CommunityDetailView
            id={liveCommunity?.slug || id}
            name={liveCommunity?.name || "Chef Amaka's kitchen"}
            description={
              liveCommunity?.description ||
              'Weekly private recipes, live cook-alongs, and direct feedback from Chef Amaka for members serious about leveling up their cooking.'
            }
            coverImage={liveCommunity?.coverImage || '/images/community/chef-amaka-hero.jpg'}
            avatarImage={liveCommunity?.avatar || '/images/community/amaka-avatar.jpg'}
            isFree={false}
            price={
              liveCommunity?.priceAmount
                ? `₦${liveCommunity.priceAmount.toLocaleString('en-NG')}`
                : '₦2,500'
            }
            yearlyPrice={
              liveCommunity?.yearlyPriceAmount
                ? `or ₦${liveCommunity.yearlyPriceAmount.toLocaleString('en-NG')} billed yearly`
                : 'or ₦25,000 billed yearly'
            }
            owner={liveCommunity?.creator?.replace(/^By\s+/i, '') || 'Amaka Obi'}
            membersCount={
              liveCommunity
                ? `${liveCommunity.members} . ${liveCommunity.posts}`
                : '2.1k members . 58 posts'
            }
            recentPosts={[
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
            ]}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* ── Mobile View (< md): Native Mobile Free Community Detail ── */}
      <div className='block md:hidden min-h-screen bg-[#141414]'>
        <MobileFreeCommunityDetails
          community={mobileCommunity}
          onBack={() => router.push('/community')}
          onJoin={() => router.push(`/community/${id}/feed`)}
          onSelectPost={() => router.push(`/community/${id}/feed`)}
        />
      </div>

      {/* ── Desktop View (≥ md): Exact Existing Desktop Layout ── */}
      <div className='hidden md:block w-full max-w-[1117px] mx-auto px-2 sm:px-4 py-4'>
        <CommunityDetailView
          id={liveCommunity?.slug || id}
          name={
            liveCommunity?.name ||
            (isNigeriaCulture ? 'Nigeria food and culture' : 'Lagos Street Food Explorers')
          }
          description={
            liveCommunity?.description ||
            (isNigeriaCulture
              ? 'A space to explore Nigerian dishes, cooking traditions, and the stories behind the food. Share recipes, ask questions, and connect with fellow food lovers across the country.'
              : 'Discover the hidden buka gems, late-night spots, and authentic street flavors across Lagos.')
          }
          coverImage={liveCommunity?.coverImage || '/images/community/rec-nigeria-food.jpg'}
          avatarImage={liveCommunity?.avatar || '/images/community/community-logo.svg'}
          isFree={true}
          owner={liveCommunity?.creator?.replace(/\s+owned$/i, '') || 'Localbuka'}
          membersCount={
            liveCommunity
              ? `${liveCommunity.members} . ${liveCommunity.posts}`
              : '12.4k members . 340 posts'
          }
          recentPosts={[
            {
              id: 'post-1',
              image: '/images/community/free-recent-post-1.jpg',
              title: 'Nigerian Food Platter',
            },
            {
              id: 'post-2',
              image: '/images/community/free-recent-post-2.jpg',
              title: 'Jollof Rice & Grilled Chicken',
            },
            {
              id: 'post-3',
              image: '/images/community/free-recent-post-3.jpg',
              title: 'Grand Banquet Table Feast',
            },
          ]}
        />
      </div>
    </MainLayout>
  );
}
