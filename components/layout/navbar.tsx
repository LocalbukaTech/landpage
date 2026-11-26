'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getUser, isUserAuthenticated, logoutUser } from '@/lib/auth';
import { setAnalyticsUser } from '@/lib/analytics';
import { LogOut, User as UserIcon } from 'lucide-react';

export function Navbar() {
  const [user, setUser] = useState<{ fullName?: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(isUserAuthenticated());
      setUser(getUser());
    };
    
    checkAuth();
    
    // Add scroll listener for the floating effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    setAnalyticsUser(null, null, null, null);
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  const firstName = user?.fullName?.split(' ')[0] || 'User';

  // The specific links from your Figma design
  const navLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Ambassadorship Program', href: '/ambassador' },
    { label: 'Meet the team', href: '/team' },
  ];

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex justify-center pt-4 px-4 ${isScrolled ? 'bg-[#FDFBF7]/90 backdrop-blur-md' : 'bg-transparent'}`}>
      <nav className='bg-white shadow-sm border border-gray-100 rounded-2xl px-6 lg:px-8 max-w-6xl w-full'>
        <div className='flex items-center justify-between h-16 md:h-20'>
          
          {/* Left: Logo + Brand Name */}
          <Link href='/' className='flex items-center gap-2'>
            <span className='font-display text-xl md:text-2xl text-[#0A1E44] font-bold'>
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
          <div className='flex items-center gap-4 md:gap-8'>
            
            {/* Nav Links */}
            <div className='hidden md:flex items-center gap-8'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='text-[#0A1E44] text-sm font-semibold hover:text-[#FFC727] transition-colors'
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className='flex items-center gap-3'>
              {isAuthenticated && user ? (
                // Logged in: Show welcome message
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-2 px-3 py-2 bg-[#FDFBF7] rounded-lg'>
                    <UserIcon className='w-4 h-4 text-[#FFC727]' />
                    <span className='text-sm font-medium text-[#0A1E44]'>
                      Welcome, <span className='text-[#FFC727]'>{firstName}</span>
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className='text-gray-500 hover:text-red-500 transition-colors p-2'
                  >
                    <LogOut className='w-4 h-4' />
                  </button>
                </div>
              ) : (
                // Not logged in: Show Figma-style buttons
                <>
                  <button
                    onClick={() => router.push('/signin')}
                    className='text-sm font-bold text-[#0A1E44] hover:bg-gray-50 px-4 py-2 rounded-xl transition-colors border border-gray-200'
                  >
                    Login
                  </button>
                  
                  {/* Figma has a single "Find Food" button instead of Sign Up */}
                  <button
                    onClick={() => router.push('/explore')}
                    className='bg-[#FFC727] text-[#0A1E44] hover:bg-yellow-400 font-bold text-sm px-6 py-2.5 rounded-xl transition-colors'
                  >
                    Find Food
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}