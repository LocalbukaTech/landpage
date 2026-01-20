'use client';

import {ThemeProvider} from '@/components/theme-provider';
import {ReactQueryProvider} from '@/components/providers/react-query-provider';
import {ToastProvider, Toaster} from '@/components/ui/toast';

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        enableSystem
        disableTransitionOnChange>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
