'use client';

import {useState, useEffect} from 'react';
import {
  Video as VideoIcon,
  Repeat2,
  Bookmark,
  Tag,
  Archive,
  Plus,
  Pencil,
  X,
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import type {Post} from '@/types/post';
import {ProfileVideoGrid} from './ProfileVideoGrid';
import {useTranslation} from '@/context/LanguageContext';

const myProfileTabs = [
  {id: 'videos', labelKey: 'nav.videos', defaultLabel: 'Videos', icon: VideoIcon},
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
  const router = useRouter();
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditing, setIsEditing] = useState(false);

  const tabs = isOtherProfile ? otherProfileTabs : myProfileTabs;

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const canEdit = !!isEditable && !isOtherProfile;

  return (
    <div className='w-full mt-4 sm:mt-6'>
      {/* Tab Headers */}
      <div className='flex items-center justify-between border-b border-white/10 pb-0'>
        <div className='flex items-center w-full justify-between sm:justify-start gap-2 sm:gap-6 overflow-x-auto scrollbar-hide'>
          {/* Plus / Upload button for own profile */}
          {!isOtherProfile && (
            <button
              onClick={() => router.push('/studio')}
              title='Create / Upload Post'
              className='p-1.5 sm:p-2 hover:text-[#FBBE15] text-zinc-400 hover:bg-white/5 rounded-full transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center shrink-0'>
              <Plus className='w-4 h-4 sm:w-[18px] sm:h-[18px]' />
            </button>
          )}

          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  onTabChange?.(tab.id);
                }}
                className={`flex items-center justify-center gap-1.5 px-1.5 sm:px-4 md:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all border-b-2 cursor-pointer bg-transparent whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-[#FBBE15] text-white font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}>
                <tab.icon className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                <span className='whitespace-nowrap'>{t(tab.labelKey, tab.defaultLabel)}</span>
              </button>
            );
          })}
        </div>

        {canEdit && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`hidden sm:flex p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer ml-1 border-none bg-transparent shrink-0 ${
              isEditing ? 'text-[#FBBE15]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title={isEditing ? 'Cancel editing' : 'Edit posts'}>
            {isEditing ? <X className='w-4 h-4 sm:w-[18px] sm:h-[18px]' /> : <Pencil className='w-3.5 h-3.5 sm:w-4 sm:h-4' />}
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
