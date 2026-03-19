'use client';

import {useEffect, useState, Suspense} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Loader2} from 'lucide-react';
import {setUserAuthToken, setUser} from '@/lib/auth';
import { useExchangeGoogleCodeMutation } from '@/lib/api';

const GoogleSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const googleExchangeMutation = useExchangeGoogleCodeMutation();

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      setError('Authentication failed. No code received.');
      return;
    }

    try {
      if (code) {
        googleExchangeMutation.mutate({code});
        if (googleExchangeMutation.isSuccess) {
          const {token, user} = googleExchangeMutation.data.data;
          setUserAuthToken(token.access_token);
          setUser(user);
        }
      }

      // Check where the user came from
      const origin = localStorage.getItem('google_auth_origin');
      
      if (origin === 'signup') {
        // Clear the flag and show the success screen
        localStorage.removeItem('google_auth_origin');
        setShowSuccess(true);
      } else {
        // Automatically redirect to homepage for signins (or unknown origin)
        localStorage.removeItem('google_auth_origin');
        router.push('/feeds');
      }
    } catch {
      setError('Authentication failed. Invalid response data.');
    }
  }, [searchParams, router]);

  const handleProceed = () => {
    router.push('/signup/preferences');
  };

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white dark:bg-black p-6'>
        <div className='text-center max-w-md w-full'>
          <div className='relative w-48 h-48 mx-auto mb-8'>
            <div className='absolute inset-0 rounded-full bg-red-100 dark:bg-red-900/20' />
            <div className='absolute inset-6 rounded-full bg-red-200 dark:bg-red-800/30' />
            <div className='absolute inset-12 rounded-full bg-red-300 dark:bg-red-700/40 flex items-center justify-center'>
              <span className='text-5xl'>❌</span>
            </div>
          </div>

          <h1 className='text-2xl sm:text-3xl font-bold text-[#0A1F44] dark:text-white mb-3'>
            Something Went Wrong
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mb-8'>{error}</p>

          <button
            onClick={() => router.push('/signin')}
            className='w-full max-w-xs mx-auto py-3.5 bg-primary hover:bg-primary/90 text-[#0A1F44] font-semibold rounded-xl transition-colors'>
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white dark:bg-black p-6'>
        <div className='text-center max-w-md w-full'>
          {/* Success Animation */}
          <div className='relative w-48 h-48 mx-auto mb-8'>
            {/* Outer ring */}
            <div className='absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/20' />
            {/* Middle ring */}
            <div className='absolute inset-6 rounded-full bg-green-200 dark:bg-green-800/30' />
            {/* Inner ring */}
            <div className='absolute inset-12 rounded-full bg-green-300 dark:bg-green-700/40 flex items-center justify-center'>
              {/* Party Popper Emoji */}
              <span className='text-5xl'>🎉</span>
            </div>
          </div>

          {/* Text */}
          <h1 className='text-2xl sm:text-3xl font-bold text-[#0A1F44] dark:text-white mb-3'>
            All Set!
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mb-8'>
            Successfully logged in. Let&apos;s get you started.
          </p>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            className='w-full max-w-xs mx-auto py-3.5 bg-primary hover:bg-primary/90 text-[#0A1F44] font-semibold rounded-xl transition-colors'>
            Proceed
          </button>
        </div>
      </div>
    );
  }

  // Show a loading spinner while processing the token and redirecting
  return (
    <div className='min-h-screen flex items-center justify-center bg-white dark:bg-black p-6'>
      <Loader2 className='w-8 h-8 animate-spin text-primary' />
    </div>
  );
};

const GoogleSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
        </div>
      }>
      <GoogleSuccessContent />
    </Suspense>
  );
};

export default GoogleSuccessPage;
