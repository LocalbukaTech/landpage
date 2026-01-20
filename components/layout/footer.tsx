'use client';

import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Button} from '@/components/ui/button';
import {SOCIAL_LINKS} from '@/lib/constants';
import {WaitlistModal} from '@/components/modals/waitlist-modal';

export function Footer() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  return (
    <footer className='bg-secondary dark:bg-black text-secondary-foreground py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
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
              {SOCIAL_LINKS.map(({label, href, Icon}) => (
                <Link
                  key={label}
                  target='_blank'
                  href={href}
                  className='text-white hover:text-primary transition-colors'
                  aria-label={label}>
                  <Icon size={24} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className='md:col-span-2 flex flex-col gap-6 md:items-start'>
            <Link
              href='/blog'
              className='text-lg hover:text-primary transition-colors'>
              Blog
            </Link>
            <Link
              href='/faqs'
              className='text-lg hover:text-primary transition-colors'>
              FAQs
            </Link>
            <button
              onClick={() => setIsWaitlistOpen(true)}
              className='text-lg hover:text-primary transition-colors text-left'>
              Get the App
            </button>
          </div>

          {/* Newsletter */}
          <div className='md:col-span-4'>
            <h3 className='font-semibold mb-4 text-lg'>
              Subscribe to our Newsletter
            </h3>
            <div className='flex flex-col gap-4'>
              <input
                type='email'
                placeholder='Enter'
                className='w-full px-5 py-4 rounded-xl bg-transparent border border-white/30 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
              />
              <Button className='bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-6 py-6 rounded-xl'>
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className='border-t border-white/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-300'>
          <p>© 2025 LocalBuka. All rights reserved.</p>
          <Link
            href='/privacy'
            className='hover:text-[#FBBE15] transition-colors'>
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen} />
    </footer>
  );
}
