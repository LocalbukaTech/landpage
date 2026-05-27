'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {ArrowLeft, Search} from 'lucide-react';
import {SettingsSidebar} from '@/components/settings/SettingsSidebar';
import {AccountInformation} from '@/components/settings/AccountInformation';
import {NotificationsPrivacy} from '@/components/settings/NotificationsPrivacy';
import {RewardsSupport} from '@/components/settings/RewardsSupport';

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('account');
  const [activeSubTab, setActiveSubTab] = useState('account');

  return (
    <div className='min-h-dvh bg-[#1a1a1a] text-white'>
      {/* Top Bar */}
      <div className='flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 border-b border-white/5'>
        <button
          onClick={() => router.push('/profile')}
          className='w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer bg-transparent shrink-0'>
          <ArrowLeft size={20} className='text-white' />
        </button>
        {/* Mobile: title; Desktop: search bar */}
        <span className='md:hidden text-white font-semibold text-base'>
          Settings
        </span>
        <div className='relative hidden md:block md:w-64'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500'
            size={16}
          />
          <input
            type='text'
            placeholder='Search'
            className='w-full py-2.5 pl-10 pr-4 bg-[#2a2a2a] border-0 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all'
          />
        </div>
      </div>

      {/* Mobile: horizontal section nav */}
      <div className='md:hidden flex gap-1 overflow-x-auto px-4 py-2.5 scrollbar-hide border-b border-white/10'>
        {[
          {id: 'account', label: 'Account'},
          {id: 'notifications', label: 'Notifications'},
          {id: 'support', label: 'Help & Support'},
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              if (item.id === 'account') setActiveSubTab('account');
            }}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer border-none whitespace-nowrap ${
              activeSection === item.id
                ? 'bg-[#fbbe15]/15 text-[#FBBE15]'
                : 'bg-transparent text-zinc-400 hover:text-white'
            }`}>
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className='flex px-4 md:px-6 gap-8 pb-10'>
        {/* Left Sidebar — desktop only */}
        <div className='hidden md:block w-56 shrink-0 py-4'>
          <SettingsSidebar
            activeSection={activeSection}
            onSectionChange={(section) => {
              setActiveSection(section);
              if (section === 'account') {
                setActiveSubTab('account');
              }
            }}
          />
        </div>

        {/* Right Content */}
        <div className='flex-1 py-4 max-w-3xl min-w-0'>
          {activeSection === 'account' && (
            <AccountInformation
              activeSubTab={activeSubTab}
              onSubTabChange={setActiveSubTab}
            />
          )}
          {activeSection === 'notifications' && <NotificationsPrivacy />}
          {activeSection === 'support' && <RewardsSupport mode='support' />}
        </div>
      </div>
    </div>
  );
}
