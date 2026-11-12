'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

const CONSENT_STORAGE_KEY = 'localbuka_cookie_consent_v2';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function updateGoogleConsent(granted: boolean) {
  if (typeof window === 'undefined') return;
  const state = granted ? 'granted' : 'denied';
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
  }
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
      } else {
        updateGoogleConsent(saved === 'accepted');
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleDecision = (accepted: boolean) => {
    setVisible(false);
    updateGoogleConsent(accepted);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(
          CONSENT_STORAGE_KEY,
          accepted ? 'accepted' : 'essential_only'
        );
      } catch {
        // ignore
      }
    }
  };

  return (
    <aside
      id='cookie-consent-banner'
      role='dialog'
      aria-label='Cookie Consent and Privacy Preferences'
      data-cookieconsent='accept'
      className={
        visible
          ? 'cookie-consent cookie-banner gdpr-consent cc-banner fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl bg-[#161618]/95 border border-white/15 p-4 sm:p-5 text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300'
          : 'cookie-consent cookie-banner gdpr-consent cc-banner sr-only'
      }
    >
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex items-start gap-3'>
          <div className='mt-0.5 rounded-xl bg-[#FBBE15]/15 p-2 text-[#FBBE15] shrink-0'>
            <ShieldCheck className='h-5 w-5' />
          </div>
          <div className='space-y-1 text-xs sm:text-sm text-zinc-300 leading-relaxed'>
            <p className='font-bold text-white'>
              Cookie Consent &amp; GDPR Privacy Notice
            </p>
            <p>
              We use cookies (including Google AdSense DART cookies and Google Analytics) to personalize content and ads, provide social features, and analyze our traffic. By clicking &ldquo;Accept All Cookies&rdquo;, you consent to our use of cookies in accordance with our{' '}
              <Link
                href='/privacy#website-app-privacy'
                className='text-[#FBBE15] underline hover:opacity-85'
              >
                Privacy &amp; Cookie Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2.5 self-end sm:self-center shrink-0'>
          <button
            type='button'
            id='cookie-reject-btn'
            onClick={() => handleDecision(false)}
            className='rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer'
          >
            Essential Cookies Only
          </button>
          <button
            type='button'
            id='cookie-accept-btn'
            onClick={() => handleDecision(true)}
            className='rounded-xl bg-[#FBBE15] px-5 py-2 text-xs font-bold text-[#111827] hover:bg-[#e5ac10] transition-colors cursor-pointer shadow-md'
          >
            Accept All Cookies
          </button>
        </div>
      </div>
    </aside>
  );
}
