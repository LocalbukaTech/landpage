'use client';

import {useState} from 'react';
import BaseModal from './BaseModal';
import UserRow from './UserRow';
import {
  useFollowers,
  useFollowing,
  useUsers,
} from '@/lib/api/services/profile.hooks';
import {Loader2} from 'lucide-react';
import {useAuth} from '@/context/AuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName?: string;
  initialTab?: TabType;
}

type TabType = 'following' | 'followers' | 'suggested';

export default function SocialModal({
  open,
  onClose,
  userId,
  userName,
  initialTab = 'following',
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const {user: authUser} = useAuth();
  const isMe = authUser?.id === userId;

  // Requests
  const {data: followingResp, isLoading: isLoadingFollowing} = useFollowing(
    userId,
    {page: 1, limit: 50},
  );
  const {data: followersResp, isLoading: isLoadingFollowers} = useFollowers(
    userId,
    {page: 1, limit: 50},
  );
  const {data: suggestedResp, isLoading: isLoadingSuggested} = useUsers({
    limit: 20,
  });

  const following =
    (followingResp as any)?.data?.data || (followingResp as any)?.data || [];
  const followers =
    (followersResp as any)?.data?.data || (followersResp as any)?.data || [];
  const suggested =
    (suggestedResp as any)?.data?.data || (suggestedResp as any)?.data || [];

  const followingCount =
    (followingResp as any)?.data?.total || following.length || 0;
  const followersCount =
    (followersResp as any)?.data?.total || followers.length || 0;

  const isLoading =
    (activeTab === 'following' && isLoadingFollowing) ||
    (activeTab === 'followers' && isLoadingFollowers) ||
    (activeTab === 'suggested' && isLoadingSuggested);

  const displayData =
    activeTab === 'following'
      ? following
      : activeTab === 'followers'
        ? followers
        : suggested;

  const tabStyle = (tab: TabType) =>
    `flex-1 text-center pb-3 text-[12px] font-bold cursor-pointer transition-all border-b-2
    ${activeTab === tab ? 'text-white border-[#FFC107]' : 'text-[#71717A] border-transparent'}`;

  return (
    <BaseModal open={open} onClose={onClose} title={userName || 'User'}>
      <div className='flex flex-col -mx-5'>
        {/* Top Section - Tabs */}
        <div className=' bg-[#121212] px-4 pt-2'>
          <div className='flex border-b border-[#333333]'>
            <div
              className={tabStyle('following')}
              onClick={() => setActiveTab('following')}>
              Following ({followingCount})
            </div>
            <div
              className={tabStyle('followers')}
              onClick={() => setActiveTab('followers')}>
              Followers ({followersCount})
            </div>
            {isMe && (
              <div
                className={tabStyle('suggested')}
                onClick={() => setActiveTab('suggested')}>
                Suggested
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - List */}
        <div className='bg-[#1F1F1F] overflow-y-auto h-[480px] px-4 py-3 custom-scrollbar rounded-b-2xl'>
          {isLoading ? (
            <div className='flex items-center justify-center h-full'>
              <Loader2 className='w-8 h-8 animate-spin text-[#fbbe15]' />
            </div>
          ) : displayData.length === 0 ? (
            <div className='flex items-center justify-center h-full text-zinc-500 text-sm'>
              No users found.
            </div>
          ) : (
            <div className='flex flex-col gap-2'>
              {displayData.map((user: any) => {
                // Ensure we handle different API response structures
                const userData = user.following || user.follower || user;
                return (
                  <UserRow
                    key={`${activeTab}-${userData.id}`}
                    user={userData}
                    isFollowingInitial={
                      activeTab === 'following' || userData.isFollowing
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
