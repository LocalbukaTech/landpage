'use client';

import {Suspense, useEffect} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import {trackPageView} from '@/lib/analytics';

function AnalyticsPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams?.toString();
    const url = pathname + (search ? `?${search}` : '');
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsPageView() {
  return (
    <Suspense fallback={null}>
      <AnalyticsPageViewTracker />
    </Suspense>
  );
}
