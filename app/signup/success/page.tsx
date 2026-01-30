'use client';

import {Suspense} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Loader2} from 'lucide-react';

const SuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleProceed = () => {
    router.push(`/signup/preferences?redirect=${encodeURIComponent(redirect)}`);
  };

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
          Your account has been verified. Let&apos;s begin.
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
};

const SuccessPage = () => {
  return (
    <Suspense fallback={
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage;

