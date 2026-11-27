'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';
import { useTeamsQuery } from '@/lib/api/services/teams.hooks';
import { sortTeamMembers } from '@/components/team/team-utils';
import { TeamOverlayCard } from '@/components/team/TeamOverlayCard';

export function TeamSection() {
  const { data, isLoading } = useTeamsQuery({ all: false, size: 30 });

  const featuredMembers = useMemo(() => {
    const docs = data?.data?.docs ?? [];
    return sortTeamMembers(docs).slice(0, 4);
  }, [data]);

  return (
    <section className='w-full bg-[#FDF9ED] opacity-100 rotate-0'>
      <div className='w-full max-w-[1440px] mx-auto py-16 px-5 sm:px-8 lg:px-[100px] flex flex-col gap-16'>
        {/* Header Area */}
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
          <div>
            <Reveal direction='up' duration={0.6}>
              <h2 className='font-[family-name:var(--font-plus-jakarta-sans)] font-extrabold text-[36px] sm:text-[48px] lg:text-[64px] leading-[1.4] tracking-[-0.04em] align-middle text-[#0A1E44]'>
                Meet the team
              </h2>
              <p className='text-[#0A1E44]/85 text-[15px] sm:text-[16px] mt-1'>
                The people behind LocalBuka.
              </p>
            </Reveal>
          </div>

          <Reveal direction='up' delay={0.1} duration={0.6}>
            <Link
              href='/team'
              className='text-[#0A1E44] font-semibold inline-flex items-center gap-2 hover:underline text-sm sm:text-base'
            >
              See the full team <ArrowRight className='w-4 h-4' />
            </Link>
          </Reveal>
        </div>

        {/* 4-Column Grid: 301×400 cards at 1440px (100px padding, 12px horizontal gap, 64px vertical gap) */}
        {isLoading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-16'>
            {[0, 1, 2, 3].map((slot) => (
              <div
                key={slot}
                className='w-full h-[400px] rounded-md bg-[#0A1E44]/10 animate-pulse'
              />
            ))}
          </div>
        ) : featuredMembers.length === 0 ? (
          <div className='rounded-md border border-[#0A1E44]/10 bg-white p-10 text-center'>
            <p className='text-[#0A1E44]/70'>
              Meet the people building LocalBuka on our full team directory.
            </p>
            <Link
              href='/team'
              className='mt-4 inline-flex items-center gap-2 rounded-full bg-[#0A1E44] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0A1E44]/90 transition-colors'
            >
              Visit team directory <ArrowRight className='w-4 h-4' />
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-16'>
            {featuredMembers.map((member, index) => (
              <TeamOverlayCard key={member.id} member={member} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
