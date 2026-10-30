'use client';

import { use } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityDetailView } from '@/components/community/CommunityDetailView';

interface CommunityDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { id } = use(params);

  const isChefAmaka = id === 'chef-amaka' || id === '2';
  const isNigeriaCulture = !id || id === 'nigeria-food-and-culture' || id === '1';

  if (isChefAmaka) {
    return (
      <MainLayout>
        <div className='w-full max-w-[1117px] mx-auto px-2 sm:px-4 py-4'>
          <CommunityDetailView
            id='chef-amaka'
            name="Chef Amaka's kitchen"
            description='Weekly private recipes, live cook-alongs, and direct feedback from Chef Amaka for members serious about leveling up their cooking.'
            coverImage='/images/community/chef-amaka-hero.jpg'
            avatarImage='/images/community/amaka-avatar.jpg'
            isFree={false}
            price='₦2,500'
            yearlyPrice='or ₦25,000 billed yearly'
            owner='Amaka Obi'
            membersCount='2.1k members . 58 posts'
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
      <div className='w-full max-w-[1117px] mx-auto px-2 sm:px-4 py-4'>
        <CommunityDetailView
          id={id}
          name={isNigeriaCulture ? 'Nigeria food and culture' : 'Lagos Street Food Explorers'}
          description={
            isNigeriaCulture
              ? 'A space to explore Nigerian dishes, cooking traditions, and the stories behind the food. Share recipes, ask questions, and connect with fellow food lovers across the country.'
              : 'Discover the hidden buka gems, late-night spots, and authentic street flavors across Lagos.'
          }
          coverImage='/images/community/rec-nigeria-food.jpg'
          avatarImage='/images/community/community-logo.svg'
          isFree={true}
          owner='Localbuka'
          membersCount='12.4k members . 340 posts'
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
