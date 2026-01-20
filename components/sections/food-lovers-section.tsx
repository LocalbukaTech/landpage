import {Images} from '@/public/images';
import Image from 'next/image';
import SectionHeader from '../SectionHeader';
import {Reveal} from '@/components/anim/Reveal';

export function FoodLoversSection() {
  return (
    <section className='py-20 bg-white dark:bg-black'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Texts */}
        <div className='grid md:grid-cols-2 gap-4 items-start'>
          <SectionHeader title='Built for all' titleTwo='Food Lovers' />
          <div className='flex flex-row item-end justify-end'>
            <Reveal
              as='p'
              direction='up'
              duration={0.6}
              className='text-lg leading-relaxed max-w-md'>
              LocalBuka is the place for chefs, home cooks, and food lovers
              alike. Explore favorite restaurants, connect with fellow foodies,
              and become part of a community that celebrates great food.
            </Reveal>
          </div>
        </div>
        {/* Texts end */}

        {/* Images Container */}
        <div className='flex flex-col md:flex-row gap-8 mt-4 items-start justify-between'>
          {/* Left side - Food bowl with navy background */}
          <Reveal
            direction='up'
            duration={0.5}
            className='relative w-full md:w-[30%] h-[350px] md:h-[350px]'>
            {/* Small navy blue background shape at the bottom */}
            <div className='absolute bottom-0 left-0 w-full h-[50%]'>
              <Image
                src={Images.foodSmallBackground}
                alt='Navy blue background shape'
                fill
                className='object-contain object-bottom'
              />
            </div>

            {/* Food bowl - main image */}
            <div className='absolute bottom-0 left-0 right-0 h-[90%]'>
              <Image
                src={Images.soup}
                alt='Delicious food bowl'
                fill
                className='object-contain object-bottom drop-shadow-2xl'
              />
            </div>
          </Reveal>

          {/* Right side - People image with background */}
          <Reveal
            direction='up'
            delay={0.1}
            duration={0.5}
            className='relative w-full md:w-[60%] h-[350px] md:h-[350px] flex justify-end flex-row'>
            {/* Background pattern */}
            <div className='absolute bottom-0 left-0 w-full h-[50%]'>
              <Image
                src='/images/builtForAll_background.png'
                alt='Background pattern'
                fill
                className='object-cover object-bottom '
              />
            </div>

            {/* People image - main image */}
            <div className='relative w-full h-full'>
              <Image
                src='/images/builtForAll.png'
                alt='Food lovers community'
                fill
                className='object-contain'
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
