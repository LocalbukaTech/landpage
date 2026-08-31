'use client';

import {useEffect, Suspense} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {MainLayout} from '@/components/layout/MainLayout';
import {Loader2} from 'lucide-react';

function UploadRedirector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const edit = searchParams.get('edit');
    const queryString = edit ? `?edit=${encodeURIComponent(edit)}` : '';
    router.replace(`/studio${queryString}`);
  }, [router, searchParams]);

  return (
    <MainLayout>
      <div className='w-full max-w-5xl flex flex-col items-center justify-center h-[50vh] gap-3'>
        <Loader2 className='w-8 h-8 animate-spin text-[#FFC727]' />
        <p className='text-zinc-400 text-sm font-medium'>Opening Localbuka Studio...</p>
      </div>
    </MainLayout>
  );
}

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <div className='w-full max-w-5xl flex items-center justify-center h-[50vh]'>
            <Loader2 className='w-8 h-8 animate-spin text-[#FFC727]' />
          </div>
        </MainLayout>
      }>
      <UploadRedirector />
    </Suspense>
  );
}
