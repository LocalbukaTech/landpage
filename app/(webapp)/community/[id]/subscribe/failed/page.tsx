'use client';

import { use } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';

interface Props {
  params: Promise<{ id: string }>;
}

export default function SubscriptionFailedPage({ params }: Props) {
  const { id } = use(params);

  return (
    <MainLayout>
      <div className='w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 flex flex-col min-h-[calc(100vh-140px)]'>
        {/* Header */}
        <div className='pb-4 border-b border-white/10'>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight'>
            Community
          </h1>
        </div>

        {/* Failed Content */}
        <div className='flex-1 flex flex-col items-center justify-center py-12'>
          <div
            className='flex flex-col items-center justify-center text-center mx-auto'
            style={{
              maxWidth: '430px',
              width: '100%',
              gap: '24px',
            }}
          >
          {/* Exact Figma Red Failed Circle SVG */}
          <div className='flex items-center justify-center shrink-0'>
            <svg
              width='68'
              height='68'
              viewBox='0 0 68 68'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              style={{ width: '68px', height: '68px' }}
            >
              <path
                d='M46.4031 26.4031L39.0625 33.75L46.4125 41.0969C47.117 41.8014 47.5128 42.7568 47.5128 43.7531C47.5128 44.7494 47.117 45.7049 46.4125 46.4094C45.708 47.1139 44.7526 47.5096 43.7563 47.5096C42.76 47.5096 41.8045 47.1139 41.1 46.4094L33.75 39.0625L26.4031 46.4125C25.6987 47.117 24.7432 47.5128 23.7469 47.5128C22.7506 47.5128 21.7951 47.117 21.0906 46.4125C20.3862 45.708 19.9904 44.7525 19.9904 43.7563C19.9904 42.76 20.3862 41.8045 21.0906 41.1L28.4375 33.75L21.0969 26.4031C20.7481 26.0543 20.4714 25.6402 20.2826 25.1844C20.0938 24.7287 19.9966 24.2402 19.9966 23.7469C19.9966 22.7506 20.3924 21.7951 21.0969 21.0906C21.8014 20.3861 22.7569 19.9904 23.7531 19.9904C24.7494 19.9904 25.7049 20.3861 26.4094 21.0906L33.75 28.4375L41.0969 21.0875C41.8014 20.383 42.7569 19.9872 43.7531 19.9872C44.7494 19.9872 45.7049 20.383 46.4094 21.0875C47.1139 21.792 47.5096 22.7475 47.5096 23.7438C47.5096 24.74 47.1139 25.6955 46.4094 26.4L46.4031 26.4031ZM67.5 33.75C67.5 40.4251 65.5206 46.9503 61.8121 52.5005C58.1036 58.0507 52.8326 62.3765 46.6656 64.9309C40.4986 67.4854 33.7126 68.1538 27.1657 66.8515C20.6189 65.5492 14.6052 62.3349 9.88516 57.6149C5.16514 52.8948 1.95076 46.8812 0.648512 40.3343C-0.653739 33.7874 0.0146234 27.0014 2.56908 20.8344C5.12354 14.6674 9.44936 9.3964 14.9995 5.6879C20.5497 1.9794 27.0749 0 33.75 0C42.698 0.0099257 51.2767 3.56891 57.6039 9.89611C63.9311 16.2233 67.4901 24.802 67.5 33.75ZM60 33.75C60 28.5582 58.4605 23.4831 55.5761 19.1663C52.6917 14.8495 48.592 11.485 43.7955 9.49816C38.9989 7.51136 33.7209 6.99152 28.6289 8.00439C23.5369 9.01725 18.8596 11.5173 15.1885 15.1884C11.5173 18.8596 9.01726 23.5369 8.0044 28.6289C6.99154 33.7209 7.51138 38.9989 9.49818 43.7954C11.485 48.592 14.8495 52.6917 19.1663 55.5761C23.4831 58.4605 28.5583 60 33.75 60C40.7097 59.9926 47.3821 57.2245 52.3033 52.3033C57.2246 47.3821 59.9926 40.7096 60 33.75Z'
                fill='#E80000'
              />
            </svg>
          </div>

          {/* Texts container */}
          <div className='flex flex-col items-center gap-2 max-w-[360px]'>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '140%',
                color: 'white',
                margin: 0,
              }}
            >
              Payment failed
            </h2>

            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '140%',
                color: '#9ca3af',
                margin: 0,
              }}
            >
              We couldn&apos;t charge your Visa ending in 4417. Check your card details or try a different method.
            </p>
          </div>

          {/* Action button */}
          <Link
            href={`/community/${id}/subscribe`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 32px',
              borderRadius: '12px',
              background: '#FFC533',
              color: '#111',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              textAlign: 'center',
              transition: 'opacity 0.2s',
            }}
            className='hover:opacity-90 active:scale-95'
          >
            Try again
          </Link>
        </div>
      </div>
    </div>
  </MainLayout>
);
}
