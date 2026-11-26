'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityPostFeed } from '@/components/community/CommunityPostFeed';
import { useCommunity } from '@/lib/api/services/community.hooks';

interface CommunityFeedPageProps {
  params: Promise<{ id: string }>;
}

const CREATOR_COMMUNITY_STORAGE_KEY = 'localbuka_creator_community_v1';

const toSlug = (val: string) =>
  val
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function CommunityFeedPage({ params }: CommunityFeedPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const { data: community } = useCommunity(id);

  const [localMeta, setLocalMeta] = useState<{ name?: string; avatar?: string }>({});

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CREATOR_COMMUNITY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name === "Nigma's Kitche") {
          parsed.name = "Nigma's Kitchen";
          try {
            window.localStorage.setItem(CREATOR_COMMUNITY_STORAGE_KEY, JSON.stringify(parsed));
          } catch {}
        }
        const savedSlug = parsed?.name ? toSlug(parsed.name) : '';
        if (!savedSlug || savedSlug === id || id.startsWith(savedSlug.slice(0, 6))) {
          queueMicrotask(() => {
            setLocalMeta({
              name: parsed?.name,
              avatar: parsed?.avatar || parsed?.coverImage,
            });
          });
        }
      }
    } catch {
      // ignore
    }
  }, [id]);

  const stateParam = searchParams.get('state');
  const viewState: 'feed' | 'empty' | 'expired' =
    stateParam === 'empty'
      ? 'empty'
      : stateParam === 'expired'
      ? 'expired'
      : 'feed';

  const communityName =
    community?.name ||
    localMeta.name ||
    id
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const communityAvatar =
    community?.avatar ||
    community?.coverImage ||
    community?.image ||
    localMeta.avatar ||
    '';

  return (
    <MainLayout>
      <div className='w-full max-w-[1160px] mx-auto px-4 sm:px-6 md:px-10 py-6 text-white'>
        <CommunityPostFeed
          communityId={id}
          communityName={communityName}
          communityLogo='/images/community/community-logo.svg'
          communityAvatar={communityAvatar || undefined}
          viewState={viewState}
        />
      </div>
    </MainLayout>
  );
}
