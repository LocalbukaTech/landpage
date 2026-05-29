'use client';

import {useEffect, useState, Suspense} from 'react';
import Image from 'next/image';
import {useRouter, useSearchParams} from 'next/navigation';
import {Loader2} from 'lucide-react';
import {Images} from '@/public/images';

const BookmarkIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="17.6826" cy="17.6826" r="17.6826" fill="#2E2E2E"/>
    <path d="M21.6611 9.0625H13.7039C13.1763 9.0625 12.6703 9.27209 12.2973 9.64515C11.9242 10.0182 11.7146 10.5242 11.7146 11.0518V26.3031L17.6825 20.9983L23.6504 26.3031V11.0518C23.6504 10.5242 23.4408 10.0182 23.0677 9.64515C22.6947 9.27209 22.1887 9.0625 21.6611 9.0625Z" fill="white" stroke="white" strokeWidth="1.47355" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="15" r="15" fill="#2E2E2E"/>
    <path d="M18.1305 7.44434C15.5671 7.44434 14.3036 9.97142 14.3036 9.97142C14.3036 9.97142 13.04 7.44434 10.4766 7.44434C8.39336 7.44434 6.74365 9.18723 6.72233 11.2669C6.67889 15.5839 10.1469 18.6539 13.9482 21.2339C14.053 21.3052 14.1768 21.3433 14.3036 21.3433C14.4303 21.3433 14.5541 21.3052 14.6589 21.2339C18.4598 18.6539 21.9278 15.5839 21.8848 11.2669C21.8635 9.18723 20.2138 7.44434 18.1305 7.44434Z" fill="white" stroke="white" strokeWidth="1.26354" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CommentIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="17.6826" cy="17.6826" r="17.6826" fill="#2E2E2E"/>
    <path d="M17.6826 9.72559C22.5453 9.72559 26.5239 12.8908 26.5239 16.7986C26.5239 20.7065 22.5453 23.8717 17.6826 23.8717C16.5863 23.8717 15.5342 23.7125 14.5616 23.4296C11.98 25.6399 8.84131 25.6399 8.84131 25.6399C10.9013 23.5799 11.2285 22.1918 11.2727 21.6614C9.76965 20.397 8.84131 18.6818 8.84131 16.7986C8.84131 12.8908 12.8199 9.72559 17.6826 9.72559Z" fill="white"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="15" r="15" fill="#2E2E2E"/>
    <path d="M21 15L16.2 9.75V12.375C13.8 12.375 9 13.95 9 20.25C9 19.3747 10.44 17.625 16.2 17.625V20.25L21 15Z" fill="white" stroke="white" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const cardsData = [
  {
    id: 'bukahut',
    name: 'BukaHut',
    image: Images.bukaHut,
    avatarPath: '/avatars/woman.png',
    hasHeart: true,
    hasComment: true,
    hasShare: true,
  },
  {
    id: 'shiro-lagos',
    name: 'Shiro Lagos',
    image: Images.shiroLanguage,
    avatarPath: '/avatars/woman.png',
    hasHeart: true,
    hasComment: true,
    hasShare: true,
  },
  {
    id: 'zen-gradient',
    name: 'Zen Garden',
    image: Images.zenGarden,
    avatarPath: '/avatars/woman.png',
    hasHeart: true,
    hasComment: true,
    hasShare: true,
  },
];

// Fixed dot index for this page — Feed Overview is always page 0
const PAGE_INDEX = 0;

const FeedsOverviewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/feeds';

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleNext = () => {
    router.push('/signup/mapOverview?redirect=' + encodeURIComponent(redirect));
  };

  const handleSkip = () => {
    router.push(redirect);
  };

  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-6 md:px-0 overflow-hidden'>
      <button
        onClick={handleSkip}
        className='absolute top-[71px] right-[16px] md:top-[75px] md:right-[40px] text-[13px] md:text-[19px] font-semibold leading-[1.4] text-[#0A1F44] md:text-[#000000] dark:text-white cursor-pointer hover:opacity-85 transition-opacity'
      >
        Skip
      </button>

      <div className='flex flex-col items-center max-w-[824px] w-full text-center'>

        <div className={`relative flex items-center justify-center w-full h-[260px] md:h-[468px] mb-8 overflow-visible select-none ${!mounted ? 'invisible' : ''}`}>
          {cardsData.map((card, idx) => {
            const isCenter = idx === 0;

            const offsetUnit = isMobile ? 105 : 200;
            const offsets = [0, offsetUnit, -offsetUnit];
            const scales = [1.0, 0.9, 0.88];
            const zIndexes = [30, 20, 10];
            const opacities = [1.0, 0.9, 0.75];

            const xOffset = offsets[idx];
            const scaleVal = scales[idx];
            const zIndexVal = zIndexes[idx];
            const opacityVal = opacities[idx];

            return (
              <div
                key={card.id}
                className={`absolute w-[144px] md:w-[286px] rounded-[10px] md:rounded-[24px] bg-white dark:bg-zinc-900 p-[7px] md:p-4 border border-gray-100 dark:border-zinc-800 shadow-md dark:shadow-2xl/40 origin-center ${
                  isCenter ? 'shadow-xl dark:shadow-yellow-500/5' : ''
                }`}
                style={{
                  transform: `translateX(${xOffset}px) scale(${scaleVal})`,
                  zIndex: zIndexVal,
                  opacity: opacityVal,
                }}
              >
                {/* Card Header */}
                <div className='flex items-center justify-between mb-1 md:mb-3'>
                  <div className='flex items-center gap-1 md:gap-2'>
                    <div className='relative w-4 h-4 md:w-7 md:h-7 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0'>
                      <Image
                        src={card.avatarPath}
                        alt={`${card.name} Avatar`}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <span className='text-[9px] md:text-[15px] font-semibold text-[#151515] dark:text-white truncate' style={{lineHeight: '140%'}}>
                      {card.name}
                    </span>
                  </div>
                  <button className='cursor-pointer hover:opacity-85 transition-opacity shrink-0'>
                    <div className='w-5 h-5 md:w-9 md:h-9 [&>svg]:w-full [&>svg]:h-full'>
                      <BookmarkIcon />
                    </div>
                  </button>
                </div>

                {/* Card Image */}
                <div className='relative w-full aspect-square rounded-[8px] md:rounded-[16px] overflow-hidden bg-gray-50 dark:bg-zinc-950 mb-1 md:mb-3'>
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className='object-cover'
                    priority={idx === 1}
                  />
                </div>

                {/* Card Footer */}
                <div className='flex items-center justify-between mt-0.5 md:mt-1'>
                  <div className='flex items-center gap-1 md:gap-2'>
                    {card.hasHeart && (
                      <button className='cursor-pointer hover:opacity-85 transition-opacity'>
                        <div className='w-4 h-4 md:w-[30px] md:h-[30px] [&>svg]:w-full [&>svg]:h-full'>
                          <HeartIcon />
                        </div>
                      </button>
                    )}
                    {card.hasComment && (
                      <button className='cursor-pointer hover:opacity-85 transition-opacity'>
                        <div className='w-5 h-5 md:w-9 md:h-9 [&>svg]:w-full [&>svg]:h-full'>
                          <CommentIcon />
                        </div>
                      </button>
                    )}
                  </div>
                  {card.hasShare && (
                    <button className='cursor-pointer hover:opacity-85 transition-opacity'>
                      <div className='w-4 h-4 md:w-[30px] md:h-[30px] [&>svg]:w-full [&>svg]:h-full'>
                        <ShareIcon />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className='w-[374px] max-w-full flex flex-col items-center gap-[8px] px-[8px]'>
          <h1 className='w-[367px] max-w-[367px] h-[27px] overflow-hidden whitespace-nowrap text-ellipsis text-center text-[19px] md:text-[23px] font-bold text-[#151515] dark:text-white leading-[1.4] md:h-auto md:w-auto md:whitespace-normal md:overflow-visible'>
            This is where we eat
          </h1>
          <p className='text-[16px] font-normal leading-[1.4] text-[#767676] dark:text-gray-400 text-center whitespace-nowrap'>
            Find good meals, trusted spots, and honest recommendations.
          </p>
        </div>

        {/* Next button + dots pinned to bottom */}
        <div className='fixed bottom-0 inset-x-0 flex flex-col items-center gap-[24px] px-[8px] pb-[40px] pt-[16px]'>
          <button
            onClick={handleNext}
            className='w-[374px] max-w-[calc(100%-16px)] h-[48px] bg-[#FBBE15] hover:bg-[#FBBE15]/90 text-[#0A1F44] font-semibold rounded-[12px] transition-colors cursor-pointer'
          >
            Next
          </button>

          {/* Dots — not clickable, active state fixed to PAGE_INDEX */}
          <div className='flex justify-center gap-2'>
            {cardsData.map((_, index) => (
              <div
                key={index}
                className={`h-2.5 rounded-full ${
                  index === PAGE_INDEX ? 'bg-[#FBBE15] w-6' : 'bg-[#D9D9D9] dark:bg-zinc-700 w-2.5'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const FeedsOverviewPage = () => {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
        </div>
      }
    >
      <FeedsOverviewContent />
    </Suspense>
  );
};

export default FeedsOverviewPage;