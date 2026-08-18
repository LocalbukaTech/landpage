import Image from 'next/image';
import { Reveal } from '@/components/anim/Reveal';
import { motion } from 'framer-motion';

export function FoodLoversSection() {
  return (
    <section className="relative py-24 md:py-36 lg:py-48 overflow-hidden bg-white dark:bg-black transition-colors duration-300">
      {/* Animated Background Pattern */}
      <motion.div 
        initial={{ opacity: 0.015, scale: 1.02 }}
        animate={{ 
          opacity: [0.015, 0.04, 0.015],
          scale: [1.02, 1.06, 1.02],
          rotate: [0, 1, 0]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/pattern.png"
          alt="Background pattern"
          fill
          className="object-cover opacity-100 dark:invert"
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/*Text*/}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal direction="right" duration={0.6}>
            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full max-w-[599px] aspect-square rounded-[20px] overflow-hidden shadow-2xl mx-auto md:mx-0 border border-zinc-200/50 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900">
              <Image
                src="/images/foodLover.jpg"
                alt="Food lovers"
                fill
                className='object-cover hover:scale-105 transition-transform duration-700 ease-out'
              />
            </motion.div>
          </Reveal>

          {/*Right Side: Text content*/}
          <Reveal direction="left" duration={0.6} className="flex flex-col justify-start space-y-10 pt-4">
            <div style={{ borderLeft: '8px solid #E4AD13' }} className="pl-8">
              <h2 className="text-5xl md:text-6xl lg:text-[72px] font-extrabold text-[#001F3F] dark:text-white leading-[1.15]">
                Built for all <br />
                Food Lovers
              </h2>
            </div>

            <p className="text-xl md:text-[22px] text-[#001F3F] dark:text-zinc-300 leading-[1.7] py-10 font-medium pr-4">
              localBuka is your gateway to the heart of Nigerian culinary culture.
              We connect chefs, home cooks, and passionate foodies, building a vibrant
              community where you can discover new favorites, share your food journey,
              and celebrate every dish together. Join us and be part of the story.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
