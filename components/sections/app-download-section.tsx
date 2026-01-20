import Image from 'next/image';
import {Button} from '@/components/ui/button';
import PlayStore from '@/public/svg/PlayStore';
import {Images} from '@/public/images';
import AppleStore from '@/public/svg/AppleStore';
import React from 'react';
import {Reveal, RevealStagger} from '@/components/anim/Reveal';

const storeButtons = [
  {
    icon: <AppleStore />,
    label: 'Get on App Store',
    href: '#',
  },
  {
    icon: <PlayStore />,
    label: 'Get on Play Store',
    href: '#',
  },
];

const StoreButton = ({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) => (
  <Button
    asChild
    className='bg-[#334C65] hover:bg-gray-900 text-white px-6 py-5 sm:px-8 sm:py-6 text-base rounded-lg flex items-center gap-2'>
    <a href={href}>
      {icon}
      <span>{label}</span>
    </a>
  </Button>
);

export function AppDownloadSection() {
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
              <StoreButton key={button.label} {...button} />
            ))}
          </RevealStagger>
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
