'use client';

import {useState, useEffect} from 'react';
import {Moon, Sun} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const {setTheme, resolvedTheme} = useTheme();
  const pathname = usePathname();
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateConstraints = () => {
      const padding = 16;
      const buttonSize = 44;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Since it is fixed at right-8 (32px from right) and bottom-8 (32px from bottom):
      setDragConstraints({
        left: -(width - 32 - buttonSize - padding),
        right: 32 - padding,
        top: -(height - 32 - buttonSize - padding),
        bottom: 32 - padding
      });
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  // Hide on restaurant detail pages where the map is prominent
  if (pathname.includes('/buka/restaurant/')) {
    return null;
  }

  const isWebapp =
    pathname.startsWith('/feeds') ||
    pathname.startsWith('/buka') ||
    pathname.startsWith('/upload') ||
    pathname.startsWith('/notifications') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/other-profile') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/rewards') ||
    pathname.startsWith('/search');
  const isLandpage = !isWebapp;
  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.15}
      whileDrag={{ scale: 1.08 }}
      onTap={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-8 right-8 z-50 select-none cursor-grab active:cursor-grabbing">
      <Button
        variant='outline'
        size='icon'
        className={`rounded-full h-10 w-10 shadow-lg transition-colors duration-300 pointer-events-none ${
          isLandpage
            ? 'ring-2 ring-yellow-500 dark:ring-yellow-400 ring-offset-2 dark:ring-offset-zinc-950 shadow-[0_0_15px_rgba(251,190,21,0.35)] hover:scale-105 hover:shadow-[0_0_20px_rgba(251,190,21,0.5)]'
            : ''
        }`}>
        <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
        <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    </motion.div>
  );
}
