'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, startTransition } from 'react';
import { Poppins } from 'next/font/google';
import { isAuthenticated } from '@/lib/auth';
import { AdminLayout } from '@/components/admin/AdminLayout';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['200','300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export default function SecureAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Don't protect the login page
  const isLoginPage = pathname === '/secure-admin/login';

  useEffect(() => {
    if (isLoginPage) return;

    const authenticated = isAuthenticated();

    startTransition(() => {
      setIsAuth(authenticated);
      setIsLoading(false);
    });

    if (!authenticated) {
      router.push('/secure-admin/login');
    }
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return (
      <div className={`${poppins.variable} ${poppins.className} font-poppins [--font-sans:var(--font-poppins)] [--font-nunito-sans:var(--font-poppins)]`}>
        {children}
      </div>
    );
  }

  if (isLoading || !isAuth) {
    return (
      <div className={`${poppins.variable} ${poppins.className} font-poppins [--font-sans:var(--font-poppins)] [--font-nunito-sans:var(--font-poppins)] min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center`}>
        <div className='text-center'>
          <div className='w-10 h-10 border-3 border-[#fbbe15] border-t-transparent rounded-full animate-spin mx-auto mb-4' />
          <p className='text-xs text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${poppins.variable} ${poppins.className} font-poppins [--font-sans:var(--font-poppins)] [--font-nunito-sans:var(--font-poppins)] text-xs`}>
      <AdminLayout>{children}</AdminLayout>
    </div>
  );
}
