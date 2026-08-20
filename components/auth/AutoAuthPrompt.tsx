'use client';

import {useEffect, useRef} from 'react';
import {usePathname} from 'next/navigation';
import {useAuth} from '@/context/AuthContext';

const AUTO_AUTH_TIMEOUT_MS = 30000; // 30 seconds

// Routes where the auto-login prompt should NOT trigger
const EXCLUDED_PREFIXES = [
  '/company',
  '/about',
  '/blog',
  '/privacy',
  '/faqs',
  '/join-waitlist',
  '/signin',
  '/signup',
  '/secure-admin',
  '/google_success',
];

export function AutoAuthPrompt() {
  const {isAuthenticated, isAuthModalOpen, openAuthModal} = useAuth();
  const pathname = usePathname();
  const hasTriggeredRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // If user is logged in or prompt has already shown, do nothing
    if (isAuthenticated) {
      startTimeRef.current = null;
      return;
    }

    if (hasTriggeredRef.current) return;

    // Check if session storage already recorded a prompt in this session
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('lb_auto_auth_shown') === 'true') {
        hasTriggeredRef.current = true;
        return;
      }
    } catch {
      // Ignore sessionStorage access errors
    }

    // Check if current path is an excluded route (landing/auth/admin pages)
    const isExcluded = EXCLUDED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`),
    );
    if (isExcluded) return;

    // Initialize or continue cumulative time spent on webapp
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const elapsed = Date.now() - startTimeRef.current;
    const remainingTime = Math.max(0, AUTO_AUTH_TIMEOUT_MS - elapsed);

    const timer = setTimeout(() => {
      if (!isAuthenticated && !isAuthModalOpen) {
        hasTriggeredRef.current = true;
        try {
          sessionStorage.setItem('lb_auto_auth_shown', 'true');
        } catch {
          // Ignore
        }
        openAuthModal();
      }
    }, remainingTime);

    return () => {
      clearTimeout(timer);
    };
  }, [isAuthenticated, isAuthModalOpen, pathname, openAuthModal]);

  return null;
}
