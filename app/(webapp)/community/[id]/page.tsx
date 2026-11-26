'use client';

import { use, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityDetailView } from '@/components/community/CommunityDetailView';
import { MobilePaidCommunityDetails } from '@/components/community/mobile/MobilePaidCommunityDetails';
import { MobileFreeCommunityDetails } from '@/components/community/mobile/MobileFreeCommunityDetails';
import { MOCK_COMMUNITIES } from '@/components/community/mobile/mockData';
import { useCommunity, useCommunityFeed } from '@/lib/api/services/community.hooks';
import { toMobileCommunityItem } from '@/lib/api/services/community.service';

interface CommunityDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface StoredCreatorPost {
  id: string;
  communityName?: string;
  communitySlug?: string;
  caption?: string;
  mediaUrl?: string;
}

interface StoredCreatorCommunity {
  name?: string;
  bio?: string;
  category?: 'free' | 'paid';
  pricePerMonth?: number;
  yearlyPrice?: number;
  coverImage?: string;
  avatar?: string;
  payoutAccount?: { accountName?: string };
}

const CREATOR_POSTS_STORAGE_KEY = 'localbuka_creator_posts_v1';
const CREATOR_COMMUNITY_STORAGE_KEY = 'localbuka_creator_community_v1';

const toSlug = (val: string) =>
  val
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: liveCommunity } = useCommunity(id);
  const { data: liveFeed } = useCommunityFeed(id);

  const [localPosts, setLocalPosts] = useState<StoredCreatorPost[]>([]);
  const [localCommunity, setLocalCommunity] = useState<StoredCreatorCommunity | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedPosts = window.localStorage.getItem(CREATOR_POSTS_STORAGE_KEY);
      if (savedPosts) {
        const parsed = JSON.parse(savedPosts);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLocalPosts(parsed);
        }
      }
      const savedComm = window.localStorage.getItem(CREATOR_COMMUNITY_STORAGE_KEY);
      if (savedComm) {
        const parsed = JSON.parse(savedComm);
        if (parsed?.name === "Nigma's Kitche") {
          parsed.name = "Nigma's Kitchen";
          try {
            window.localStorage.setItem(CREATOR_COMMUNITY_STORAGE_KEY, JSON.stringify(parsed));
          } catch {}
        }
        setLocalCommunity(parsed);
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const isLocalCreatorMatch =
    !liveCommunity &&
    Boolean(localCommunity?.name) &&
    (toSlug(localCommunity!.name!) === id || id === 'chef-amaka' || id === 'my-community');

  const effectiveCommunity = liveCommunity
    ? liveCommunity
    : isLocalCreatorMatch && localCommunity
    ? {
        id,
        slug: toSlug(localCommunity.name || id),
        name: localCommunity.name || "Chef Tolu's VIP Kitchen",
        description: localCommunity.bio || '',
        coverImage: localCommunity.coverImage || localCommunity.avatar,
        avatar: localCommunity.avatar || localCommunity.coverImage,
        isFree: localCommunity.category === 'free',
        priceAmount: localCommunity.pricePerMonth || 2000,
        yearlyPriceAmount:
          localCommunity.yearlyPrice || (localCommunity.pricePerMonth || 2000) * 10,
        creator: localCommunity.payoutAccount?.accountName || 'Creator',
        members: '1 member',
        posts: `${localPosts.length} posts`,
      }
    : null;

  const isChefAmaka = id === 'chef-amaka' || id === '2';
  const isPaidCommunity = effectiveCommunity ? !effectiveCommunity.isFree : isChefAmaka;
  const isNigeriaCulture = !id || id === 'nigeria-food-and-culture' || id === 'nigeria-food' || id === '1';

  const resolvedRecentPosts = useMemo(() => {
    const apiPosts = (liveFeed?.items || []).map((p) => ({
      id: p.id,
      image: p.mediaUrls && p.mediaUrls.length > 0 ? p.mediaUrls[0] : undefined,
      title: p.content || 'Community post',
    }));

    // Include newly posted creator posts from localStorage for this community (excluding old seed post-1 / post-2)
    const matchingLocalPosts = localPosts
      .filter((p) => {
        if (p.id === 'post-1' || p.id === 'post-2') return false;
        if (p.communitySlug && p.communitySlug === id) return true;
        if (p.communityName && effectiveCommunity?.name) {
          return toSlug(p.communityName) === toSlug(effectiveCommunity.name);
        }
        return isLocalCreatorMatch;
      })
      .map((p) => ({
        id: p.id,
        image: p.mediaUrl || undefined,
        title: p.caption || 'Recent post',
      }));

    const combined: Array<{ id: string; image?: string; title: string }> = [];
    const seen = new Set<string>();
    for (const item of [...apiPosts, ...matchingLocalPosts]) {
      const dedupeKey = item.id || item.image || item.title;
      if (!seen.has(dedupeKey)) {
        seen.add(dedupeKey);
        combined.push(item);
      }
    }

    if (combined.length > 0) {
      return combined.slice(0, 6);
    }

    return [];
  }, [liveFeed, localPosts, id, effectiveCommunity, isLocalCreatorMatch]);

  const openFeedAtPost = (postId?: string) => {
    const query = postId ? `?post=${encodeURIComponent(postId)}` : '';
    router.push(`/community/${effectiveCommunity?.slug || id}/feed${query}`);
  };

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
            recentPosts={resolvedRecentPosts}
            isMember={Boolean((effectiveCommunity as any)?.isMember)}
            onBack={() => router.push('/community')}
            onSubscribe={() => router.push(`/community/${id}/subscribe`)}
            onSelectPost={openFeedAtPost}
          />
        </div>

        {/* ── Desktop View (≥ md): Exact Existing Desktop Layout ── */}
        <div className='hidden md:block w-full max-w-[1117px] mx-auto px-2 sm:px-4 py-4'>
          <CommunityDetailView
            id={effectiveCommunity?.slug || id}
            name={effectiveCommunity?.name || "Chef Amaka's kitchen"}
            description={
              effectiveCommunity?.description ||
              'Weekly private recipes, live cook-alongs, and direct feedback from Chef Amaka for members serious about leveling up their cooking.'
            }
            coverImage={effectiveCommunity?.coverImage || '/images/community/chef-amaka-hero.jpg'}
            avatarImage={effectiveCommunity?.avatar || '/images/community/amaka-avatar.jpg'}
            isFree={false}
            isMember={Boolean((effectiveCommunity as any)?.isMember)}
            benefits={(effectiveCommunity as any)?.benefits}
            price={
              effectiveCommunity?.priceAmount
                ? `₦${effectiveCommunity.priceAmount.toLocaleString('en-NG')}`
                : '₦2,500'
            }
            yearlyPrice={
              effectiveCommunity?.yearlyPriceAmount
                ? `or ₦${effectiveCommunity.yearlyPriceAmount.toLocaleString('en-NG')} billed yearly`
                : 'or ₦25,000 billed yearly'
            }
            owner={effectiveCommunity?.creator?.replace(/^By\s+/i, '') || 'Amaka Obi'}
            membersCount={
              effectiveCommunity
                ? `${effectiveCommunity.members} . ${effectiveCommunity.posts}`
                : '2.1k members . 58 posts'
            }
            recentPosts={resolvedRecentPosts}
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
          recentPosts={resolvedRecentPosts}
          onBack={() => router.push('/community')}
          onJoin={() => openFeedAtPost()}
          onSelectPost={openFeedAtPost}
        />
      </div>

      {/* ── Desktop View (≥ md): Exact Existing Desktop Layout ── */}
      <div className='hidden md:block w-full max-w-[1117px] mx-auto px-2 sm:px-4 py-4'>
        <CommunityDetailView
          id={effectiveCommunity?.slug || id}
          name={
            effectiveCommunity?.name ||
            (isNigeriaCulture ? 'Nigeria food and culture' : 'Lagos Street Food Explorers')
          }
          description={
            effectiveCommunity?.description ||
            (isNigeriaCulture
              ? 'A space to explore Nigerian dishes, cooking traditions, and the stories behind the food. Share recipes, ask questions, and connect with fellow food lovers across the country.'
              : 'Discover the hidden buka gems, late-night spots, and authentic street flavors across Lagos.')
          }
          coverImage={effectiveCommunity?.coverImage || '/images/community/rec-nigeria-food.jpg'}
          avatarImage={effectiveCommunity?.avatar || '/images/community/community-logo.svg'}
          isFree={true}
          isMember={Boolean((effectiveCommunity as any)?.isMember)}
          owner={
            effectiveCommunity?.creator &&
            effectiveCommunity.creator !== 'Creator'
              ? effectiveCommunity.creator.replace(/\s+owned$/i, '')
              : localCommunity?.payoutAccount?.accountName || 'LocalBuka Creator'
          }
          membersCount={
            effectiveCommunity
              ? `${effectiveCommunity.members} . ${
                  resolvedRecentPosts.length > 0
                    ? `${resolvedRecentPosts.length} ${
                        resolvedRecentPosts.length === 1 ? 'post' : 'posts'
                      }`
                    : effectiveCommunity.posts
                }`
              : '1 member . 0 posts'
          }
          recentPosts={resolvedRecentPosts}
        />
      </div>
    </MainLayout>
  );
}
