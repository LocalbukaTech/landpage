'use client';

import Image from 'next/image';
import { TESTIMONIALS } from '@/lib/constants';
import { MapPin } from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';

export function TestimonialsSection() {
  return (
    <section className='bg-[#FFF8E7] py-24 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Section Header */}
        <div className='mb-12'>
          <Reveal direction='up' duration={0.6}>
            <h2 className='text-[#0A1E44] text-4xl md:text-5xl font-bold'>
              Testimonials
            </h2>
          </Reveal>
        </div>

        {/* Horizontal Scroll Container */}
        <div className='flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide'>
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal 
              key={index} 
              direction='right' 
              delay={index * 0.1} 
              duration={0.6}
              className='min-w-[320px] md:min-w-[400px] bg-[#1A1A1A] p-8 rounded-2xl flex flex-col justify-between snap-start h-[380px]'
            >
              <div>
                <h3 className='text-white text-xl md:text-2xl font-bold mb-4 leading-snug'>
                  {testimonial.title}
                </h3>
                <p className='text-gray-300 text-sm md:text-[15px] leading-relaxed'>
                  {testimonial.text}
                </p>
              </div>

              {/* User Info */}
              <div className='flex items-center gap-4 mt-6'>
                <div className='w-12 h-12 rounded-xl overflow-hidden bg-gray-700 relative'>
                  <Image 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    fill
                    className='object-cover'
                  />
                </div>
                <div>
                  <h4 className='font-bold text-white text-lg'>{testimonial.author}</h4>
                  <p className='text-sm text-[#FFC727] flex items-center gap-1'>
                    <MapPin className="w-3 h-3" />
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}