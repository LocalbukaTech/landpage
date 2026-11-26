import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';

export function OwnerCtaSection() {
  return (
    <section className='bg-[#FDFBF7] py-16 md:py-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-8'>
          
          {/* Dark Image Container */}
          <Reveal direction='up' duration={0.6} className='w-full'>
            <div className='bg-[#141414] rounded-0xl w-full flex justify-center py-12 md:py-20'>
              <div className='relative w-full max-w-[400px] md:max-w-[500px]'>
                <Image
                  src="/images/2chairs.png"
                  alt="Own a Buka or a Restaurant"
                  width={600}
                  height={600}
                  className='w-full h-auto object-contain'
                />
              </div>
            </div>
          </Reveal>

          {/* Text & Button Below (Left Aligned) */}
          <div className='text-left max-w-3xl'>
            <Reveal direction='up' delay={0.1} duration={0.6}>
              <p className='text-[#0A1E44] text-xl md:text-2xl font-medium mb-6'>
                Get discovered by thousands of hungry food lovers near you.
              </p>
              
              <Link 
                href='/signup' 
                className='inline-flex items-center justify-center gap-2 bg-[#FFC727] text-[#0A1E44] px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all hover:scale-105 shadow-sm'
              >
                Be discovered now
                <ArrowRight className='w-5 h-5' />
              </Link>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}