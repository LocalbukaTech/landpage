'use client';

import { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCommunity } from '@/lib/api/services/community.hooks';

interface SubscribeSuccessPageProps {
  params: Promise<{ id: string }>;
}

const CREATOR_COMMUNITY_STORAGE_KEY = 'localbuka_creator_community_v1';

export default function SubscribeSuccessPage({ params }: SubscribeSuccessPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: community } = useCommunity(id);

  let localName: string | undefined;
  let localPrice: number | undefined;
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(CREATOR_COMMUNITY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        localName = parsed?.name;
        localPrice = parsed?.pricePerMonth;
      }
    } catch {
      // ignore
    }
  }

  const communityName =
    community?.name ||
    localName ||
    id
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const amountParam = searchParams.get('amount');
  const paidAmount = amountParam
    ? Number(amountParam)
    : Math.max(2000, Number(community?.priceAmount ?? localPrice ?? 2000));

  return (
    <MainLayout>
      <div className='w-full min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-4 text-center'>
        <div
          className='flex flex-col items-center justify-center'
          style={{
            maxWidth: '420px',
            width: '100%',
            gap: '24px',
          }}
        >
          {/* Green Circle Checkmark */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '9999px',
              border: '3px solid #2E7D32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width='26' height='26' viewBox='0 0 24 24' fill='none'>
              <path
                d='M5 13L9 17L19 7'
                stroke='#2E7D32'
                strokeWidth='3'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>

          {/* Text Block */}
          <div className='space-y-2'>
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '140%',
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              You&apos;re in! Welcome to {communityName}.
            </h1>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '145%',
                color: '#9CA3AF',
                margin: 0,
              }}
            >
              Your Paystack subscription (₦{paidAmount.toLocaleString('en-NG')}) is active. You now have full access to all member posts, recipes, and discussions.
            </p>
          </div>

          {/* Primary Action Button */}
          <button
            type='button'
            onClick={() => router.push(`/community/${id}/feed`)}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '13px 24px',
              borderRadius: '12px',
              background: '#FFC533',
              color: '#111111',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
            }}
            className='hover:opacity-90 active:scale-[0.99] transition-all shadow-md'
          >
            Go to community feed →
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
