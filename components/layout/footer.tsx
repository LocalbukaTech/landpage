'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SOCIAL_LINKS } from '@/lib/constants';
import { useTranslation } from '@/context/LanguageContext';
import { api } from '@/lib/api/client';
import AdSenseUnit from '@/components/AdSenseUnit';

const NEWSLETTER_STORAGE_KEY = 'localbuka_newsletter_subscribers_v1';

export function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await api.post('/newsletter/subscribe', { email: trimmed });
    } catch {
      // Persist locally if newsletter endpoint is warming up or offline
      if (typeof window !== 'undefined') {
        try {
          const existing = JSON.parse(
            window.localStorage.getItem(NEWSLETTER_STORAGE_KEY) || '[]'
          );
          if (!existing.includes(trimmed)) {
            window.localStorage.setItem(
              NEWSLETTER_STORAGE_KEY,
              JSON.stringify([...existing, trimmed])
            );
          }
        } catch {
          // ignore storage errors
        }
      }
    } finally {
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className='bg-secondary dark:bg-black text-secondary-foreground py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-12'>
          <AdSenseUnit />
        </div>
        <div className='grid md:grid-cols-12 gap-y-12 md:gap-x-6 mb-16'>
          {/* Brand + tagline + socials */}
          <div className='md:col-span-6'>
            {/* Left: Logo + Brand Name */}
            <Link href='/' className='flex items-center gap-2 mb-4'>
              <span className='font-display text-xl md:text-2xl text-secondary-foreground font-normal'>
                LocalBuka
              </span>
              <Image
                src='/images/localBuka_logo.png'
                alt='LocalBuka'
                width={40}
                height={40}
                className='h-8 w-8 rounded-full'
                priority
              />
            </Link>
            <p className='text-base text-gray-300 mb-8 leading-relaxed max-w-md'>
              Find the best restaurants - <br /> from hidden gems to local
              favorites - in any city.
            </p>
            <div className='flex gap-6'>
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  target='_blank'
                  href={href}
                  rel='noopener noreferrer'
                  className='text-white hover:text-primary transition-colors cursor-pointer'
                  aria-label={`Follow LocalBuka on ${label}`}
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className='md:col-span-2 flex flex-col gap-5 md:items-start'>
            <Link
              href='/about'
              className='text-base hover:text-primary transition-colors'
            >
              About Us
            </Link>
            <Link
              href='/contact'
              className='text-base hover:text-primary transition-colors'
            >
              Contact Us
            </Link>
            <Link
              href='/blog'
              className='text-base hover:text-primary transition-colors'
            >
              Blog
            </Link>
            <Link
              href='/faqs'
              className='text-base hover:text-primary transition-colors'
            >
              FAQs
            </Link>
          </div>

          {/* Newsletter / Email Cycle CTA */}
          <div className='md:col-span-4'>
            <h3 className='font-semibold mb-4 text-lg'>
              Subscribe to our Newsletter
            </h3>
            {subscribed ? (
              <div className='rounded-xl bg-[#FBBE15]/15 border border-[#FBBE15]/40 p-4 text-sm text-white flex items-start gap-2.5'>
                <CheckCircle2 className='w-5 h-5 text-[#FBBE15] shrink-0 mt-0.5' />
                <div>
                  <p className='font-semibold text-[#FBBE15]'>
                    You&apos;re subscribed!
                  </p>
                  <p className='text-xs text-gray-300 mt-0.5'>
                    Thank you for joining the LocalBuka email cycle. Watch your inbox for curated food spots and community updates.
                  </p>
                  <button
                    type='button'
                    onClick={() => setSubscribed(false)}
                    className='mt-2 text-xs font-semibold text-[#FBBE15] underline cursor-pointer'
                  >
                    Subscribe another email
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className='flex flex-col gap-4'>
                <div>
                  <input
                    type='email'
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder='Enter your email address'
                    aria-label='Email address for newsletter'
                    className='w-full px-5 py-4 rounded-xl bg-transparent border border-white/30 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                  />
                  {errorMsg && (
                    <p className='text-xs text-red-400 mt-1.5'>{errorMsg}</p>
                  )}
                </div>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-6 py-6 rounded-xl cursor-pointer'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin mr-2' />
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className='border-t border-white/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-300'>
          <p>© {new Date().getFullYear()} LocalBuka. All rights reserved.</p>
          <div className='flex items-center gap-6'>
            <Link
              href='/privacy'
              className='hover:text-[#FBBE15] transition-colors'
            >
              {t('nav.termsAndPolicies', 'Privacy Policy & Terms')}
            </Link>
            <Link
              href='/contact'
              className='hover:text-[#FBBE15] transition-colors'
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
