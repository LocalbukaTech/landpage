'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Poppins } from 'next/font/google';
import { isAuthenticated, logout } from '@/lib/auth';
import { AdminLayout } from '@/components/admin/AdminLayout';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export default function SecureAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Normalize pathname to prevent case or trailing slash mismatches
  const normalizedPath = pathname ? pathname.toLowerCase().replace(/\/+$/, '') : '';
  const isLoginPage = normalizedPath === '/secure-admin/login';

  useEffect(() => {
    const authenticated = isAuthenticated();

    if (isLoginPage) {
      if (authenticated) {
        router.replace('/secure-admin/dashboard');
      }
      return;
    }

    if (!authenticated) {
      logout();
      startTransition(() => {
        setIsAuth(false);
        setIsLoading(false);
      });
      router.replace('/secure-admin/login');
      return;
    }

    startTransition(() => {
      setIsAuth(true);
      setIsLoading(false);
    });
  }, [isLoginPage, router]);

  // Login page rendering - does not require admin authentication
  if (isLoginPage) {
    return (
      <div
        className={`${poppins.variable} ${poppins.className} font-poppins [--font-sans:var(--font-poppins)] [--font-nunito-sans:var(--font-poppins)]`}
      >
        {children}
      </div>
    );
  }

  // Loading state or unauthorized state -> never show admin layout or children
  if (isLoading || !isAuth) {
    return (
      <div
        className={`${poppins.variable} ${poppins.className} font-poppins [--font-sans:var(--font-poppins)] [--font-nunito-sans:var(--font-poppins)] min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#fbbe15] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-muted-foreground">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  // Fully authenticated admin
  return (
    <div
      className={`${poppins.variable} ${poppins.className} font-poppins [--font-sans:var(--font-poppins)] [--font-nunito-sans:var(--font-poppins)] text-xs`}
    >
      <AdminLayout>{children}</AdminLayout>
    </div>
  );
}
