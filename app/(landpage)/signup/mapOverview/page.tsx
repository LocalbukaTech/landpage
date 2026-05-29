'use client';

import {Suspense} from 'react';
import Image from 'next/image';
import {useRouter, useSearchParams} from 'next/navigation';
import {Loader2} from 'lucide-react';

const DOTS_COUNT = 3;

// Fixed dot index for this page — Map Overview is always page 1
const PAGE_INDEX = 1;

const MapOverviewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/feeds';

  // Single tap → navigate immediately, no state change
  const handleNext = () => {
    router.push('/signup/postCreateOverview?redirect=' + encodeURIComponent(redirect));
  };

  const handleSkip = () => {
    router.push(redirect);
  };

  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-6 md:px-0 overflow-hidden'>

      <button
        onClick={handleSkip}
        className='absolute top-[71px] right-[16px] md:top-[75px] md:right-[40px] text-[13px] md:text-[19px] font-semibold leading-[1.4] text-[#000000] dark:text-white cursor-pointer hover:opacity-85 transition-opacity'
      >
        Skip
      </button>

      <div className='flex flex-col items-center max-w-[824px] w-full text-center gap-6'>

        <div className='relative w-full h-[234px] md:h-[468px] rounded-[5.32px] overflow-hidden'>
          <Image
            src='/images/mapOverview.png'
            alt='Map overview'
            fill
            className='object-cover'
            priority
          />
        </div>

        <div className='flex flex-col items-center w-full max-w-[510px] gap-6'>

          <div className='flex flex-col items-center gap-2 w-full max-w-[367px] md:max-w-[499px]'>
            <h1 className='text-[19px] md:text-[23px] font-bold text-[#151515] dark:text-white leading-[1.4]'>
              Found somewhere worth going back to?
            </h1>
            <p className='text-[14px] md:text-[16px] font-normal leading-[1.4] text-[#767676] dark:text-gray-400'>
              Get back to your favorite spots with one tap.
            </p>
          </div>

          <div className='fixed bottom-0 inset-x-0 flex flex-col items-center gap-[24px] px-[8px] pb-[40px] pt-[16px]'>
          <button
            onClick={handleNext}
            className='w-[374px] max-w-[calc(100%-16px)] h-[48px] bg-[#FBBE15] hover:bg-[#FBBE15]/90 text-[#0A1F44] font-semibold rounded-[12px] transition-colors cursor-pointer'
          >
            Next
          </button>


            {/* Dots — not clickable, active state fixed to PAGE_INDEX */}
            <div className='flex justify-center gap-2 w-full md:w-auto py-2 md:py-0'>
              {Array.from({length: DOTS_COUNT}).map((_, index) => (
                <div
                  key={index}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === PAGE_INDEX
                      ? 'bg-[#FBBE15] w-6'
                      : 'bg-[#D9D9D9] dark:bg-zinc-700 w-2.5'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className='fixed inset-x-0 bottom-0 z-10 flex justify-center items-end pointer-events-none'>
            <div className='w-[390px] h-[72px] flex items-center justify-center'>
              <div className='w-[134px] h-[5px] rounded-full bg-black/80 dark:bg-white/80' />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const MapOverviewPage = () => {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
        </div>
      }
    >
      <MapOverviewContent />
    </Suspense>
  );
};

export default MapOverviewPage;
