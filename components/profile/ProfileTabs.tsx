'use client';

import {useState, useEffect} from 'react';
import {
  Video as VideoIcon,
  Repeat2,
  Bookmark,
  Tag,
  Pencil,
  X,
} from 'lucide-react';
import type {Post} from '@/types/post';
import {ProfileVideoGrid} from './ProfileVideoGrid';

const myProfileTabs = [
  {id: 'videos', label: 'Videos', icon: VideoIcon},
  {id: 'repost', label: 'Repost', icon: Repeat2},
  {id: 'saved', label: 'Saved', icon: Bookmark},
  {id: 'tagged', label: 'Tagged', icon: Tag},
];

const otherProfileTabs = [
  {id: 'videos', label: 'Videos', icon: VideoIcon},
  {id: 'repost', label: 'Repost', icon: Repeat2},
];

interface ProfileTabsProps {
  posts: Post[];
  initialTab?: string;
  onTabChange?: (tabId: string) => void;
  isLoading?: boolean;
  isEditable?: boolean;
  isOtherProfile?: boolean;
}

export function ProfileTabs({
  posts,
  initialTab = 'videos',
  onTabChange,
  isLoading,
  isEditable,
  isOtherProfile,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditing, setIsEditing] = useState(false);

  const tabs = isOtherProfile ? otherProfileTabs : myProfileTabs;

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className='w-full mt-6'>
      {/* Tab Headers */}
      <div className='flex items-center justify-between border-b border-white/10'>
        <div className='flex'>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  onTabChange?.(tab.id);
                }}
                className={`flex items-center gap-2 px-4 md:px-6 py-3 text-sm font-medium transition-all border-b-2 cursor-pointer bg-transparent ${
                  isActive
                    ? 'border-[#FBBE15] text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}>
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {isEditable && !isOtherProfile && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer mr-2 border-none bg-transparent ${
              isEditing ? 'text-[#FBBE15]' : 'text-zinc-500'
            }`}
            title={isEditing ? 'Cancel editing' : 'Edit posts'}>
            {isEditing ? <X size={20} /> : <Pencil size={18} />}
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className='mt-4'>
        <ProfileVideoGrid
          posts={posts}
          isLoading={isLoading}
          isEditing={isEditing}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
}
