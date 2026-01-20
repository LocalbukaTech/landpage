'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useLoginMutation} from '@/lib/api/services/auth.hooks';
import {Loader2} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import Image from 'next/image';

const AdminLogin = () => {
  const router = useRouter();
  const {toast} = useToast();
  const loginMutation = useLoginMutation();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    loginMutation.mutate(
      {
        email: credentials.email,
        password: credentials.password,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Welcome back! 👋',
            description: 'You have successfully signed in.',
          });
          router.push('/secure-admin/dashboard');
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            'Invalid email or password. Please try again.';
          setError(message);
        },
      }
    );
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-primary/10 via-white to-primary/5 dark:from-black dark:via-gray-950 dark:to-black flex items-center justify-center px-4'>
      <div className='max-w-md w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-4'>
            <div className='w-20 h-20 bg-primary rounded-full flex items-center justify-center'>
              <div className='flex justify-center'>
                <Image
                  src='/images/localBuka_logo.png'
                  alt='LocalBuka'
                  width={24}
                  height={24}
                  className='w-10 h-10 object-contain rounded-full'
                />
              </div>
            </div>
          </div>
          <h1 className='text-3xl font-bold text-foreground mb-2'>
            Admin Dashboard
          </h1>
          <p className='text-muted-foreground'>
            Sign in to access the admin panel
          </p>
        </div>

        {/* Login Card */}
        <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-foreground mb-2'>
                Email Address
              </label>
              <input
                type='email'
                id='email'
                required
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({...credentials, email: e.target.value})
                }
                className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                placeholder='admin@localbuka.com'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-foreground mb-2'>
                Password
              </label>
              <input
                type='password'
                id='password'
                required
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({...credentials, password: e.target.value})
                }
                className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                placeholder='••••••••'
              />
            </div>

            <button
              type='submit'
              disabled={loginMutation.isPending}
              className='w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2'>
              {loginMutation.isPending ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
