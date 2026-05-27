'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { RewardsSupport } from '@/components/settings/RewardsSupport';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RewardsPage() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className='w-full max-w-4xl mx-auto flex flex-col min-h-dvh md:min-h-0 px-4 md:px-0'>
        {/* Header */}
        <div className='flex items-center gap-4 py-4 md:py-6 border-b border-white/5 mb-6'>
          <h1 className='text-xl md:text-2xl font-bold text-white' id='rewards-page-title'>
            Refer & Earn
          </h1>
        </div>

        {/* Content */}
        <div className='flex-1 pb-10' id='rewards-content-container'>
          <RewardsSupport mode='refer' />
        </div>
      </div>
    </MainLayout>
  );
}
