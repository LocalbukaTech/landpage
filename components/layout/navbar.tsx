'use client';

import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Button} from '@/components/ui/button';
import {NAV_LINKS} from '@/lib/constants';
import {WaitlistModal} from '@/components/modals/waitlist-modal';
import {useRouter} from 'next/navigation';

export function Navbar() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string
  ) => {
    // Open modal for "Get the App" link
    if (label === 'Get the App') {
      e.preventDefault();
      setIsWaitlistOpen(true);
      return;
    }

    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  };
  const router = useRouter();

  return (
    <>
      <div className='sticky top-0 z-50 flex justify-center pt-4 px-4 bg-transparent pointer-events-none'>
        <nav className='bg-white dark:bg-black shadow-md rounded-xl px-6 lg:px-8 max-w-6xl w-full pointer-events-auto'>
          <div className='flex items-center justify-between h-16 md:h-18'>
            {/* Left: Logo + Brand Name */}
            <Link href='/' className='flex items-center gap-2'>
              <span className='font-display text-xl md:text-2xl text-gray-900 dark:text-secondary-foreground font-normal'>
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

            {/* Right: Nav Links + Buttons */}
            <div className='flex items-center gap-4 md:gap-6 lg:gap-8'>
              {/* Nav Links */}
              <div className='hidden md:flex items-center gap-6 lg:gap-8'>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href, link.label)}
                    className='text-gray-800 dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors'>
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className='flex items-center gap-3'>
                <Button
                  onClick={() => router.push('signin')}
                  variant='ghost'
                  className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 cursor-pointer'>
                  Login
                </Button>
                <Button
                  onClick={() => router.push('signup')}
                  className='bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm px-5 py-2 cursor-pointer'>
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Waitlist Modal (rendered outside pointer-events-none wrapper) */}
      <WaitlistModal open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen} />
    </>
  );
}
