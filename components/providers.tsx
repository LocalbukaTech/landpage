'use client';

import {ThemeProvider} from '@/components/theme-provider';
import {ReactQueryProvider} from '@/components/providers/react-query-provider';
import {ToastProvider, Toaster} from '@/components/ui/toast';
import {AuthProvider} from '@/context/AuthContext';
import {AuthModal} from '@/components/modals';

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange>
          <ToastProvider>
            {children}
            <AuthModal />
            <Toaster />
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
