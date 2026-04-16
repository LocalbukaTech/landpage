'use client';

import {Bell, LogOut, Settings} from 'lucide-react';
import Image from 'next/image';

export function AdminHeader({
  handleLogoutAction,
}: {
  handleLogoutAction: () => void;
}) {
  return (
    <header className='h-20 w-full bg-white dark:bg-gray-900 flex items-center justify-end px-8 border-b border-gray-50 dark:border-gray-800'>
      <div className='flex items-center gap-4'>
        {/* Settings Icon */}
        <button className='w-10 h-10 rounded-full bg-[#FCF7E8] text-[#D39B0A] flex items-center justify-center hover:bg-[#f5ebd0] transition-colors'>
          <Settings size={20} strokeWidth={2} />
        </button>

        {/* Notifications Icon */}
        <button className='relative w-10 h-10 rounded-full bg-[#FCF7E8] text-[#D39B0A] flex items-center justify-center hover:bg-[#f5ebd0] transition-colors'>
          <Bell size={20} strokeWidth={2} />
          {/* Notification Badge */}
          <span className='absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-[#FCF7E8]' />
        </button>

        {/* User Avatar */}
        <div className='w-10 h-10 rounded-full  relative mr-2'>
          {/* Using a placeholder avatar since it's the admin */}
          <Image
            src='/images/localBuka_logo.png'
            alt='Admin Avatar'
            width={40}
            height={40}
            className='rounded-full'
          />
          <span className='absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white z-50 ' />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogoutAction}
          className='ml-2 text-red-500 hover:text-red-600 transition-colors'
          title='Logout'>
          <LogOut size={22} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
