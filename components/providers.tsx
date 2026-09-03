'use client';

import {ThemeProvider} from '@/components/theme-provider';
import {ReactQueryProvider} from '@/components/providers/react-query-provider';
import {ToastProvider, Toaster} from '@/components/ui/toast';
import {AuthProvider} from '@/context/AuthContext';
import {AuthModal} from '@/components/modals';
import {AutoAuthPrompt} from '@/components/auth/AutoAuthPrompt';
import type { User } from '@/lib/api/services/auth.service';

import { LanguageProvider } from '@/context/LanguageContext';

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
        <LanguageProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            enableSystem
            disableTransitionOnChange>
            <ToastProvider>
              {children}
              <AuthModal />
              <AutoAuthPrompt />
              <Toaster />
            </ToastProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
