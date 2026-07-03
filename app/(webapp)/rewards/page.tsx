'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { RewardsSupport } from '@/components/settings/RewardsSupport';

export default function RewardsPage() {
  return (
    <MainLayout>
      {/*
        Overall box: w:821, h:656, top:83, left:337, gap:64
        The top/left offset comes from MainLayout's sidebar (337px) and top bar (83px).
        We use w-[821px] and flex-col gap-16 (64px) here.
      */}
      <div
        className='w-[821px] max-w-full flex flex-col gap-16'
        style={{ fontFamily: 'var(--font-nunito-sans), Nunito Sans, sans-serif' }}
        id='rewards-page-root'>

        {/*
          Header: w:821, h:92, pt:20, pb:20, gap:51 (between title and any right element),
          border-bottom-width:1px
        */}
        <div className='w-full h-[92px] flex items-center gap-[51px] py-5 border-b border-white/10'>
          <h1
            id='rewards-page-title'
            className='text-[22px] font-bold text-white tracking-tight leading-none m-0'>
            Refer &amp; Earn
          </h1>
        </div>

        {/* Body — RewardsSupport fills in the structured sections */}
        <div className='pb-20' id='rewards-content-container'>
          <RewardsSupport mode='refer' />
        </div>
      </div>
    </MainLayout>
  );
}
