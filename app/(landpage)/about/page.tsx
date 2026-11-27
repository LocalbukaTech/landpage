'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import SectionHeader from '@/components/SectionHeader';
import { Reveal } from '@/components/anim/Reveal';
import StarIcon from '@/public/svg/StarIcon';
import { useSiteSettingsQuery } from '@/lib/api/services/contact.hooks';
import { DEFAULT_ABOUT_US_CONTENT } from '@/lib/api/services/contact.service';

export default function AboutPage() {
  const { data: settingsRes } = useSiteSettingsQuery();
  const about = {
    ...DEFAULT_ABOUT_US_CONTENT,
    ...(settingsRes?.data?.aboutUs ?? {}),
    coreValues:
      settingsRes?.data?.aboutUs?.coreValues &&
      settingsRes.data.aboutUs.coreValues.length > 0
        ? settingsRes.data.aboutUs.coreValues
        : DEFAULT_ABOUT_US_CONTENT.coreValues,
  };

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://localbuka.com/about#webpage',
        url: 'https://localbuka.com/about',
        name: 'About LocalBuka - Africa’s Food Discovery & Community Platform',
        description: about.storyParagraph1,
        isPartOf: { '@id': 'https://localbuka.com/#website' },
        about: { '@id': 'https://localbuka.com/#organization' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://localbuka.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About Us',
            item: 'https://localbuka.com/about',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className='relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden -mt-24 rounded-b-xl'>
        <div className='absolute inset-0 z-0'>
          <Image
            src={about.heroImageUrl || '/images/aboutUsHero.png'}
            alt='About LocalBuka hero'
            fill
            className='object-cover object-center'
            priority
          />
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
              {about.heroSubtitle}
            </Reveal>
            <Reveal direction='up' delay={0.2} duration={0.7} className='mt-8 flex justify-center'>
              <Link
                href={about.heroCtaHref || '/feeds'}
                className='px-16 py-4 inline-flex items-center justify-center rounded-2xl bg-[#FBBE15] text-[#111827] hover:bg-[#E5AD13] font-bold text-lg transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap'
              >
                {about.heroCtaText || 'Get Started'}
              </Link>
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
                <SectionHeader title={about.storyHeading || 'About Localbuka'} />
              </Reveal>

              <div className='space-y-4 text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl'>
                <Reveal direction='up' delay={0.1} duration={0.6}>
                  <p>{about.storyParagraph1}</p>
                </Reveal>
                {about.storyParagraph2 && (
                  <Reveal direction='up' delay={0.2} duration={0.6}>
                    <p>{about.storyParagraph2}</p>
                  </Reveal>
                )}
              </div>
            </div>

            {/* Right Column — Image */}
            <Reveal direction='up' delay={0.3} duration={0.6} className='w-full'>
              <div className='relative w-full aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm'>
                <Image
                  src={about.storyImageUrl || '/images/peopleInResturant.png'}
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
              {about.missionSectionTitle}
            </h2>
          </Reveal>

          {/* Two Columns with Divider */}
          <div className='grid grid-cols-1 md:grid-cols-2'>
            {/* Mission Column */}
            <Reveal direction='up' delay={0.1} duration={0.6} className='space-y-4 p-8 md:border-r border-gray-200 dark:border-gray-800'>
              <span className='text-[#FBBE15] text-sm font-semibold uppercase tracking-wider block'>
                {about.missionLabel}
              </span>
              <h3 className='text-2xl md:text-3xl font-extrabold text-[#111827] dark:text-white'>
                {about.missionHeading}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed'>
                {about.missionBody}
              </p>
            </Reveal>

            {/* Vision Column */}
            <Reveal direction='up' delay={0.2} duration={0.6} className='space-y-4 p-8'>
              <span className='text-[#FBBE15] text-sm font-semibold uppercase tracking-wider block'>
                {about.visionLabel}
              </span>
              <h3 className='text-2xl md:text-3xl font-extrabold text-[#111827] dark:text-white'>
                {about.visionHeading}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed'>
                {about.visionBody}
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
                  {about.valuesSectionTitle}
                </h2>
              </div>
            </div>
          </Reveal>

          <Reveal direction='up' delay={0.1} duration={0.6} className='mb-12'>
            <p className='text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto text-center'>
              {about.valuesSectionSubtitle}
            </p>
          </Reveal>

          {/* Dynamic Values Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2'>
            {about.coreValues.map((value, idx) => {
              const isLeft = idx % 2 === 0;
              const isLastRow =
                idx >= about.coreValues.length - (about.coreValues.length % 2 === 0 ? 2 : 1);
              return (
                <Reveal
                  key={`${value.title}-${idx}`}
                  direction='up'
                  delay={0.1 + idx * 0.05}
                  duration={0.6}
                  className={`space-y-3 p-8 border-gray-200 dark:border-gray-800 ${
                    !isLastRow ? 'border-b' : ''
                  } ${isLeft ? 'md:border-r' : ''}`}
                >
                  <h3 className='text-[#FBBE15] text-xl md:text-2xl font-bold'>
                    {value.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed'>
                    {value.description}
                  </p>
                </Reveal>
              );
            })}
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
              {about.ctaHeading}
            </h2>
          </Reveal>
          <Reveal direction='up' delay={0.1} duration={0.6}>
            <p className='text-gray-300 text-base md:text-lg mb-10 max-w-xl mx-auto leading-[1.40] font-nunito'>
              {about.ctaSubtitle}
            </p>
          </Reveal>
          <Reveal direction='up' delay={0.2} duration={0.6}>
            <Link
              href={about.ctaButtonHref || '/signup'}
              className='flex items-center justify-center w-full max-w-lg mx-auto bg-[#FBBE15] text-[#111827] hover:bg-[#E5AD13] active:scale-[0.98] transition-all font-semibold rounded-2xl py-4 text-base cursor-pointer'>
              {about.ctaButtonText || 'Join Localbuka'}
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
