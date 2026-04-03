'use client';

import * as React from 'react';
import {Moon, Sun} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function ThemeToggle() {
  const {theme, setTheme} = useTheme();
  const pathname = usePathname();

  // Hide on restaurant detail pages where the map is prominent
  if (pathname.includes('/buka/restaurant/')) {
    return null;
  }

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className='fixed bottom-8 right-8 z-50 rounded-full h-14 w-14 shadow-lg'>
      <Sun className='h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
