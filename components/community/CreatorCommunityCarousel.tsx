'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  {
    image: '/images/community/carousel-1.jpg',
    title: 'Discover a clear way to discover and join communities that match your food interests.',
  },
  {
    image: '/images/community/food-table.jpg',
    title: 'Participate around shared food interests.',
  },
  {
    image: '/images/community/carousel-2.jpg',
    title: 'A focused space where people can connect and share food experiences.',
  },
];

export function CreatorCommunityCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className='relative w-full h-full min-h-[420px] lg:min-h-full overflow-hidden select-none bg-[#121212]'>
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.image}
            alt='Community'
            fill
            className='object-cover object-center'
            priority={i === 0}
          />
          {/* Subtle gradient overlay to enhance text readability */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10' />
        </div>
      ))}

      {/* Bottom overlay content */}
      <div className='absolute bottom-0 inset-x-0 pb-10 pt-6 px-6 sm:px-8 flex flex-col items-center text-center z-10'>
        {/* Pot Logo Badge */}
        <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-2xl mb-4 hover:scale-105 transition-transform cursor-pointer flex items-center justify-center'>
          <Image
            src='/images/community/logo.png'
            alt='LocalBuka'
            width={64}
            height={64}
            className='w-full h-full object-contain'
          />
        </div>

        {/* Caption */}
        <p className='text-white text-base sm:text-lg font-semibold leading-snug max-w-[340px] drop-shadow-md mb-6 min-h-[52px] flex items-center justify-center text-center'>
          {slides[current].title}
        </p>

        {/* Indicator Dots */}
        <div className='flex items-center justify-center gap-2'>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-white scale-125 opacity-100 ring-2 ring-white/30'
                  : 'bg-white/40 hover:bg-white/70 opacity-60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

