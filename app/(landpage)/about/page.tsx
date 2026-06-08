'use client';

import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import SectionHeader from '@/components/SectionHeader';
import { Reveal } from '@/components/anim/Reveal';
import StarIcon from '@/public/svg/StarIcon';

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className='relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden -mt-24 rounded-b-xl'>
        <div
          className='absolute inset-0 z-0'
          style={{
            backgroundImage: "url('/images/aboutUsHero.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
          <div className='absolute inset-0 bg-black/65' />
        </div>

        <div className='relative z-10 h-full flex items-center justify-center text-center px-4 pt-24'>
          <div className='max-w-4xl'>
            <Reveal
              as='h1'
              direction='up'
              duration={0.8}
              className='text-primary text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight'>
              <span className='text-white'>Discover</span> Restaurants,
              <br />
              <span className='text-white'>Share</span> Experiences,
              <br />
              Live <span className='text-white'>Better.</span>
            </Reveal>
            <Reveal
              as='p'
              direction='up'
              delay={0.12}
              duration={0.7}
              className='text-white text-base md:text-lg max-w-2xl mx-auto'>
              Join a vibrant community of food lovers exploring
              the best local dining experience across Africa.
            </Reveal>
            <Reveal direction='up' delay={0.2} duration={0.7} className='mt-8 flex justify-center'>
              <button className='px-16 py-4 flex items-center justify-center rounded-2xl bg-[#FBBE15] text-[#111827] hover:bg-[#E5AD13] font-bold text-lg transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap'>
                Get Started
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- ABOUT LOCALBUKA SECTION --- */}
      <section className='py-20 bg-white dark:bg-black'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>

            {/* Left Column — Text */}
            <div className='relative space-y-6'>
              <Reveal direction='up' duration={0.5}>
                <SectionHeader title='About Localbuka' />
              </Reveal>

              <div className='space-y-4 text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl'>
                <Reveal direction='up' delay={0.1} duration={0.6}>
                  <p>
                    LocalBuka is Africa&apos;s food discovery and community platform built for
                    the people who care deeply about where they eat, what they eat, and
                    who they eat with. We exist at the intersection of food, community,
                    and everyday life.
                  </p>
                </Reveal>
                <Reveal direction='up' delay={0.2} duration={0.6}>
                  <p>
                    We started with a simple observation: finding a great restaurant in an
                    African city shouldn&apos;t feel like a gamble. Recommendations from
                    friends, honest reviews from real people, and local knowledge should
                    be easy to find and easy to trust. LocalBuka makes that possible.
                    Whether you&apos;re a chef, a home cook, or someone who just loves a
                    good meal, LocalBuka is the place to discover your next favorite
                    restaurant, connect with fellow food lovers, and become part of a
                    community that celebrates every dish.
                  </p>
                </Reveal>
              </div>
            </div>

            {/* Right Column — Image */}
            <Reveal direction='up' delay={0.3} duration={0.6} className='w-full'>
              <div className='relative w-full aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm'>
                <Image
                  src='/images/peopleInResturant.jpg'
                  alt='People enjoying a meal together at a restaurant'
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  priority
                />
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* --- MISSION & VISION SECTION --- */}
      <section className='py-20 bg-[#FFF9E8] dark:bg-muted/10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

          {/* Section Header with Star */}
          <Reveal direction='up' duration={0.5} className='relative mb-16'>
            <div className='absolute -top-6 -left-4'>
              <StarIcon />
            </div>
            <h2 className='text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-tight z-10 text-[#111827] dark:text-white relative'>
              Our Mission & Vision
            </h2>
          </Reveal>

          {/* Two Columns with Divider */}
          {/* Two Columns with Divider */}
          <div className='grid grid-cols-1 md:grid-cols-2'>

            {/* Mission Column */}
            <Reveal direction='up' delay={0.1} duration={0.6} className='space-y-4 p-8 md:border-r border-gray-200 dark:border-gray-800'>
              <span className='text-[#FBBE15] text-sm font-semibold uppercase tracking-wider block'>
                Our Mission
              </span>
              <h3 className='text-2xl md:text-3xl font-extrabold text-[#111827] dark:text-white'>
                What We&apos;re Here to Do
              </h3>
              <p className='text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed'>
                To create a connected food community where people discover restaurants, share authentic experiences, leave honest reviews and ratings, and build healthier, more intentional everyday habits through food and social connection.
              </p>
            </Reveal>

            {/* Vision Column */}
            <Reveal direction='up' delay={0.2} duration={0.6} className='space-y-4 p-8'>
              <span className='text-[#FBBE15] text-sm font-semibold uppercase tracking-wider block'>
                Our Vision
              </span>
              <h3 className='text-2xl md:text-3xl font-extrabold text-[#111827] dark:text-white'>
                Where We&apos;re Going
              </h3>
              <p className='text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed'>
                To become Africa&apos;s leading food discovery and community platform, where restaurants, people, experiences, and better everyday living come together.
              </p>
            </Reveal>

          </div>
        </div>
      </section>

      {/* --- CORE VALUES SECTION --- */}
      <section className='py-20 bg-white dark:bg-black'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

          {/* Section Header */}
          <Reveal direction='up' duration={0.5} className='relative mb-6'>
            <div className='text-center'>
              <div className='relative inline-block'>
                <div className='absolute -top-6 -left-10'>
                  <div className='w-14 h-14'>
                    <StarIcon />
                  </div>
                </div>
                <h2 className='text-4xl md:text-5xl font-extrabold leading-tight z-10 text-[#111827] dark:text-white relative'>
                  Our Core Values
                </h2>
              </div>
            </div>
          </Reveal>

          <Reveal direction='up' delay={0.1} duration={0.6} className='mb-12'>
            <p className='text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto text-center'>
              Five principles that guide everything we build and every decision we make.
            </p>
          </Reveal>

          {/* Values Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2'>

            <Reveal direction='up' delay={0.1} duration={0.6} className='space-y-3 p-8 border-b border-r border-gray-200 dark:border-gray-800'>
              <h3 className='text-[#FBBE15] text-xl md:text-2xl font-bold'>Authentic Discovery</h3>
              <p className='text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed'>
                We believe restaurant discovery should feel simple, genuine, and trustworthy through real reviews, experiences and recommendations from everyday people.
              </p>
            </Reveal>

            <Reveal direction='up' delay={0.15} duration={0.6} className='space-y-3 p-8 border-b border-gray-200 dark:border-gray-800'>
              <h3 className='text-[#FBBE15] text-xl md:text-2xl font-bold'>Exploration</h3>
              <p className='text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed'>
                We encourage people to discover new restaurants, cuisines, tastes, and experiences that enrich everyday life.
              </p>
            </Reveal>

            <Reveal direction='up' delay={0.2} duration={0.6} className='space-y-3 p-8 border-b border-r border-gray-200 dark:border-gray-800'>
              <h3 className='text-[#FBBE15] text-xl md:text-2xl font-bold'>Simplicity</h3>
              <p className='text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed'>
                We strive to make discovering restaurants, sharing experiences, and connecting with others feel natural and intuitive.
              </p>
            </Reveal>

            <Reveal direction='up' delay={0.25} duration={0.6} className='space-y-3 p-8 border-b border-gray-200 dark:border-gray-800'>
              <h3 className='text-[#FBBE15] text-xl md:text-2xl font-bold'>Community & Connection</h3>
              <p className='text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed'>
                We believe food brings people together and fosters meaningful human connections through shared moments and experiences.
              </p>
            </Reveal>

            <Reveal direction='up' delay={0.3} duration={0.6} className='space-y-3 p-8 border-r border-gray-200 dark:border-gray-800'>
              <h3 className='text-[#FBBE15] text-xl md:text-2xl font-bold'>Wellness & Better Living</h3>
              <p className='text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed'>
                We believe mindful food choices and healthy habits contribute to a healthier and more fulfilling lifestyle.
              </p>
            </Reveal>

          </div>
        </div>
      </section>

      <section
        className='py-20 px-4 border-b border-[#C0C0C0]'
        style={{
          background: 'radial-gradient(ellipse at center, #002a5c 0%, #001F3F 70%)',
        }}>
        <div className='max-w-3xl mx-auto text-center'>
          <Reveal direction='up' duration={0.6}>
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6'>
              Ready to Discover Your Next<br className='hidden sm:block' /> Favourite Meal?
            </h2>
          </Reveal>
          <Reveal direction='up' delay={0.1} duration={0.6}>
            <p className='text-gray-300 text-base md:text-lg mb-10 max-w-xl mx-auto leading-[1.40] font-nunito'>
              Join thousands of food lovers exploring the rich culinary landscape of Africa. Share your
              experiences and connect with a community that cares.
            </p>
          </Reveal>
          <Reveal direction='up' delay={0.2} duration={0.6}>
            <a
              href='/signup'
              className='flex items-center justify-center w-full max-w-lg mx-auto bg-[#FBBE15] text-[#111827] hover:bg-[#E5AD13] active:scale-[0.98] transition-all font-semibold rounded-2xl py-4 text-base cursor-pointer'>
              Join Localbuka
            </a>
          </Reveal>
        </div>
      </section >

      <Footer />
    </>
  );
}