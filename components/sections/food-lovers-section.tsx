import { Images } from '@/public/images';
import Image from 'next/image';
import SectionHeader from '../SectionHeader';
import { Reveal } from '@/components/anim/Reveal';

export function FoodLoversSection() {
  return (
    <section className="relative py-12 md:py-20  overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/Frame.png"
          alt="Background pattern"
          fill
          className="object-cover opacity-40"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/*Text*/}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <Reveal direction="right" duration={0.6}>
            <div className="relative w-full max-w-[599px] aspect-square rounded-[20px] overflow-hidden shadow-xl mx-auto md:mx-0">
              <Image
                src="/images/foodLover.jpg"
                alt="Food lovers"
                fill
                className='object-cover'
              />
            </div>
          </Reveal>

          {/*Right Side: Text content*/}
          <Reveal direction="left" duration={0.6} className="flex flex-col justify-start space-y-10 pt-4">
            <div style={{ borderLeft: '8px solid #E4AD13' }} className="pl-8">
              <h2 className="text-5xl md:text-6xl lg:text-[72px] font-extrabold text-[#001F3F] leading-[1.15]">
                Built for all <br />
                Food Lovers
              </h2>
            </div>

            <p className="text-xl md:text-[22px] text-[#001F3F] leading-[1.7] py-10 font-medium pr-4">
              localBuka is your gateway to the heart of Nigerian culinary culture.
              We connect chefs, home cooks, and passionate foodies, building a vibrant
              community where you can discover new favorites, share your food journey,
              and celebrate every dish together. Join us and be part of the story.
            </p>
          </Reveal>
        </div>
      </div>
    </section>

  )
}
