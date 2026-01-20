import Image from 'next/image';
import {Reveal} from '@/components/anim/Reveal';
import {Typewriter} from '../anim/Typewriter';

export function HeroSection() {
  return (
    <section className='relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden -mt-24 rounded-b-xl'>
      <div
        className='absolute inset-0 z-0'
        style={{
          backgroundImage: "url('/images/hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className='absolute inset-0 bg-black/50' />
      </div>

      {/* BukaGenie overlay - left side of center */}
      <div className='absolute left-4 top-[61%] -translate-y-1/2 md:left-8 lg:left-16 z-20 animate-float-slow'>
        <Image
          src='/images/bukagenie.png'
          alt='BukaGenie'
          width={120}
          height={40}
          className='w-20 md:w-28 h-auto'
        />
      </div>

      {/* Community overlay - right side of center */}
      <div className='absolute right-4 top-[70%] -translate-y-1/2 md:right-8 lg:right-16 z-20 animate-tilt-wobble'>
        <Image
          src='/images/community_icon.png'
          alt='Community'
          width={120}
          height={40}
          className='w-20 md:w-28 h-auto'
        />
      </div>

      <div className='relative z-10 h-full flex items-center justify-center text-center px-4 pt-24'>
        <div className='max-w-4xl'>
          <Reveal
            as='h1'
            direction='up'
            duration={0.8}
            className='text-primary text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight'>
            <span className='text-white'>Taste</span> the world,
            <br />
            one <span className='text-white'>plate</span> at a time.
          </Reveal>
          <Reveal
            as='p'
            direction='up'
            delay={0.12}
            duration={0.7}
            className='text-white text-base md:text-lg max-w-2xl mx-auto'>
            Find the best restaurants — from{' '}
            <Typewriter
              className='font-bold'
              words={['hidden gems', 'local favorites', 'top picks nearby']}
            />{' '}
            — in any city.
          </Reveal>
        </div>
      </div>
    </section>
  );
}
