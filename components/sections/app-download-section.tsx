import Image from 'next/image';
import {Button} from '@/components/ui/button';
import PlayStore from '@/public/svg/PlayStore';
import {Images} from '@/public/images';
import AppleStore from '@/public/svg/AppleStore';
import React, {useState} from 'react';
import {Reveal, RevealStagger} from '@/components/anim/Reveal';

const storeButtons = [
  {
    icon: <AppleStore />,
    label: 'Get on App Store',
  },
  {
    icon: <PlayStore />,
    label: 'Get on Play Store',
  },
];

const StoreButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <Button
    onClick={onClick}
    className='bg-[#334C65] hover:bg-gray-900 text-white px-6 py-5 sm:px-8 sm:py-6 text-base rounded-lg flex items-center gap-2 cursor-pointer'>
    {icon}
    <span>{label}</span>
  </Button>
);

export function AppDownloadSection() {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <section
      id='app'
      className='bg-secondary dark:bg-black text-secondary-foreground relative overflow-hidden rounded-t-xl'>
      <div className='absolute w-full h-full'>
        <Image
          src={Images.pattern}
          className='object-cover rounded-t-lg opacity-50'
          fill
          alt='Abstract background pattern'
        />
      </div>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10'>
        <div className='text-center mb-12'>
          <Reveal
            as='h2'
            direction='up'
            duration={0.7}
            className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4'>
            Get the LocalBuka App
          </Reveal>
          <Reveal
            as='p'
            direction='up'
            delay={0.08}
            duration={0.6}
            className='text-gray-300 text-md sm:text-lg mb-8 max-w-2xl mx-auto'>
            Connecting you to culinary delights near you -<br />
            Discover, Experience, and Share.
          </Reveal>
          <RevealStagger
            as='div'
            className='flex flex-wrap justify-center gap-4'
            from={0.12}
            gap={0.08}
            itemProps={{direction: 'up', duration: 0.5}}>
            {storeButtons.map((button) => (
              <StoreButton 
                key={button.label} 
                icon={button.icon}
                label={button.label}
                onClick={() => setShowMessage(true)} 
              />
            ))}
          </RevealStagger>

          {/* Under Development Notice */}
          {showMessage && (
            <div className='mt-8 p-5 bg-[#334C65]/80 backdrop-blur-md border border-white/10 text-white rounded-2xl max-w-md mx-auto text-sm animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-2 items-center shadow-lg'>
              <p className='font-bold text-[#fbbe15]'>Mobile App Under Development</p>
              <p className='text-gray-200 text-xs max-w-xs leading-relaxed'>
                Our iOS and Android apps are currently being cooked. Please proceed with the web login for now to explore LocalBuka!
              </p>
              <button 
                onClick={() => setShowMessage(false)}
                className='mt-2 px-5 py-1.5 bg-white text-secondary font-bold text-xs rounded-full hover:bg-gray-200 transition-colors border-none cursor-pointer'
              >
                Got it
              </button>
            </div>
          )}
        </div>
        <div className='flex justify-center items-end mt-12 sm:mt-16 max-w-4xl mx-auto'>
          <div className='relative w-full h-[300px] sm:h-[400px] md:h-[500px]'>
            <Image
              src={Images.phones}
              className='object-contain animate-float-slow'
              fill
              alt='LocalBuka app displayed on two mobile phones'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
