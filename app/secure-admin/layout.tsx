'use client';

import {useRouter, usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {
  Users,
  ListCheck,
  LogOut,
  LayoutDashboard,
  FileText,
} from 'lucide-react';
import Image from 'next/image';
import {isAuthenticated, getAdminUser, logout} from '@/lib/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {Admin} from '@/lib/api/services/auth.service';

export default function AdminLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Don't protect the login page
  const isLoginPage = pathname === '/secure-admin/login';

  useEffect(() => {
    // Skip auth check for login page
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    // Check auth on client side only
    const authenticated = isAuthenticated();
    const adminUser = getAdminUser();

    setIsAuth(authenticated);
    setAdmin(adminUser);
    setIsLoading(false);

    if (!authenticated) {
      router.push('/secure-admin/login');
    }
  }, [isLoginPage, router]);

  // Skip loading and auth checks for login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (isLoading || !isAuth) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/secure-admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Blog',
      href: '/secure-admin/blog',
      icon: FileText,
    },
    {
      name: 'Teams',
      href: '/secure-admin/teams',
      icon: Users,
    },
    {
      name: 'Waitlist',
      href: '/secure-admin/waitlist',
      icon: ListCheck,
    },
  ];

  const handleSignOut = () => {
    logout();
    router.push('/secure-admin/login');
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-black'>
      {/* Sidebar */}
      <aside className='fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800'>
        {/* Logo */}
        <div className='flex items-center gap-3 px-6 py-6 border-b border-gray-200 dark:border-gray-800'>
          <div className='flex justify-center'>
            <Image
              src='/images/localBuka_logo.png'
              alt='LocalBuka'
              width={24}
              height={24}
              className='w-10 h-10 object-contain rounded-full'
            />
          </div>
          <div>
            <h1 className='text-lg font-bold text-foreground'>LocalBuka</h1>
            <p className='text-xs text-muted-foreground'>Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className='p-4 space-y-2'>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white font-semibold shadow-lg'
                    : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground'
                }`}>
                <Icon className='w-5 h-5' />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Sign Out */}
        <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800'>
          <div className='px-4 py-3 mb-2 bg-gray-50 dark:bg-gray-800 rounded-lg'>
            <p className='text-sm font-medium text-foreground capitalize'>
              {admin ? `${admin.first_name} ${admin.last_name}` : 'Admin'}
            </p>
            <p className='text-xs text-muted-foreground'>
              {admin?.email ?? 'Administrator'}
            </p>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className='flex items-center gap-2 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all cursor-pointer'>
            <LogOut className='w-4 h-4' />
            <span className='text-sm font-medium'>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to sign out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the login page and will need to sign in
              again to access the admin dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              className='bg-red-600 hover:bg-red-700 text-white'>
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content */}
      <main className='ml-64 p-8'>{children}</main>
    </div>
  );
}
