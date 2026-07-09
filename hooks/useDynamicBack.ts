'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Keep track of visited paths in memory during the SPA session.
// Resets on page reload, ensuring we can tell if we entered directly or navigated internally.
const visitedPaths: string[] = [];

export function useDynamicBack() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && !visitedPaths.includes(pathname)) {
      visitedPaths.push(pathname);
    }
  }, [pathname]);

  const goBack = (fallbackRoute = '/feeds') => {
    // If we have visited more than 1 path internally, we can safely go back.
    // Otherwise, we navigate to the fallback (feeds) route.
    if (typeof window !== 'undefined' && visitedPaths.length > 1 && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackRoute);
    }
  };

  return goBack;
}
