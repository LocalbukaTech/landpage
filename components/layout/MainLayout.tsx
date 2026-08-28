'use client';

import {ReactNode} from 'react';
import {Sidebar} from '@/components/layout/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({children}: MainLayoutProps) {
  return (
    <div className='flex h-screen w-full bg-[#1a1a1a] overflow-hidden'>
      <Sidebar />
      <main className='flex-1 min-w-0 h-screen overflow-y-auto overflow-x-hidden flex flex-col md:flex-row items-stretch justify-start pt-14 pb-16 md:py-6 md:pl-4 md:pr-8'>
        {children}
      </main>
    </div>
  );
}
