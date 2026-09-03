'use client';

import {useState, useEffect} from 'react';
import {
  Video as VideoIcon,
  Repeat2,
  Bookmark,
  Tag,
  Archive,
  Pencil,
  X,
} from 'lucide-react';
import type {Post} from '@/types/post';
import {ProfileVideoGrid} from './ProfileVideoGrid';
import {useTranslation} from '@/context/LanguageContext';

const myProfileTabs = [
  {id: 'videos', labelKey: 'nav.videos', defaultLabel: 'Videos', icon: VideoIcon},
  {id: 'repost', labelKey: 'nav.repost', defaultLabel: 'Repost', icon: Repeat2},
  {id: 'saved', labelKey: 'nav.saved', defaultLabel: 'Saved', icon: Bookmark},
  {id: 'tagged', labelKey: 'nav.tagged', defaultLabel: 'Tagged', icon: Tag},
  {id: 'archive', labelKey: 'nav.archive', defaultLabel: 'Archive', icon: Archive},
];

const otherProfileTabs = [
  {id: 'videos', labelKey: 'nav.videos', defaultLabel: 'Videos', icon: VideoIcon},
  {id: 'repost', labelKey: 'nav.repost', defaultLabel: 'Repost', icon: Repeat2},
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
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditing, setIsEditing] = useState(false);

  const tabs = isOtherProfile ? otherProfileTabs : myProfileTabs;

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const canEdit = !!isEditable && !isOtherProfile;

  return (
    <div className='w-full mt-6'>
      {/* Tab Headers */}
      <div className='flex items-center justify-between border-b border-white/10'>
        <div className='flex overflow-x-auto scrollbar-hide'>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  onTabChange?.(tab.id);
                }}
                className={`flex items-center gap-2 px-3 md:px-6 py-3 text-sm font-medium transition-all border-b-2 cursor-pointer bg-transparent whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-[#FBBE15] text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}>
                <tab.icon size={16} />
                <span>{t(tab.labelKey, tab.defaultLabel)}</span>
              </button>
            );
          })}
        </div>

        {canEdit && (
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
          isEditing={canEdit && isEditing}
          activeTab={activeTab}
          onToggleEdit={canEdit ? () => setIsEditing((prev) => !prev) : undefined}
          isEditable={canEdit}
          isOtherProfile={isOtherProfile}
        />
      </div>
    </div>
  );
}
