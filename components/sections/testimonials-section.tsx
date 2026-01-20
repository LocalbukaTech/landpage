'use client';

import Image from 'next/image';
import {Card, CardContent} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import {TESTIMONIALS} from '@/lib/constants';
import SectionHeader from '../SectionHeader';
import {BsQuote} from 'react-icons/bs';
import React from 'react';
import {Reveal} from '@/components/anim/Reveal';

export function TestimonialsSection() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    // Use the real number of snaps so dots update on every slide
    const snaps = api.scrollSnapList().length;
    setCount(snaps);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    // Simple autoplay without external dependency
    const id = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(id);
  }, [api]);

  return (
    <section className='py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <SectionHeader title='Testimonials' />
        <Reveal direction='up' className='w-full mt-8'>
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
            }}
            className='w-full mt-0'>
            <CarouselContent>
              {TESTIMONIALS.map((testimonial, idx) => (
                <CarouselItem key={idx} className='md:basis-1/2'>
                  <Reveal direction='up' delay={idx * 0.06}>
                    <div className='p-1'>
                      <Card className='p-6 border-0 shadow-lg h-[260px] md:h-[280px] flex'>
                        <BsQuote className='text-primary mb-4' size={30} />
                        <CardContent className='p-0 flex flex-col justify-between w-full'>
                          <p className='text-muted-foreground mb-6 leading-relaxed'>
                            {testimonial.text}
                          </p>
                          <div className='flex items-center gap-3 mt-auto'>
                            <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                              <Image
                                src={testimonial.avatar}
                                alt={testimonial.author}
                                fill
                                className='object-cover'
                              />
                            </div>
                            <div>
                              <p className='font-semibold'>
                                {testimonial.author}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </Reveal>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </Reveal>
        <Reveal
          direction='up'
          delay={0.1}
          className='flex justify-center gap-2 mt-4'>
          {Array.from({length: count}).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`w-2 h-2 rounded-full ${
                current === i ? 'bg-primary' : 'bg-gray-300'
              }`}></button>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
