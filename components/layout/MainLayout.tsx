'use client';

import {ReactNode} from 'react';
import {Sidebar} from '@/components/layout/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({children}: MainLayoutProps) {
  return (
    <div className='flex min-h-screen bg-[#1a1a1a] overflow-x-hidden'>
      <Sidebar />
      <main className='flex-1 min-w-0 flex flex-col md:flex-row items-stretch md:items-center justify-start pt-14 pb-16 md:py-6 md:pl-4 md:pr-8 min-h-screen overflow-x-hidden'>
        {children}
      </main>
    </div>
  );
}
