'use client';

import {ThemeProvider} from '@/components/theme-provider';
import {ReactQueryProvider} from '@/components/providers/react-query-provider';
import {ToastProvider, Toaster} from '@/components/ui/toast';
import {AuthProvider} from '@/context/AuthContext';
import {AuthModal} from '@/components/modals';
import type { User } from '@/lib/api/services/auth.service';

export function Providers({
  children,
  initialUser,
  initialToken,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialToken?: string | null;
}) {
  return (
    <ReactQueryProvider>
      <AuthProvider initialUser={initialUser} initialToken={initialToken}>
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
