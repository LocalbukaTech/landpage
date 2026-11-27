'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';
import { useTeamsQuery } from '@/lib/api/services/teams.hooks';
import type { Team } from '@/lib/api/services/teams.service';
import { sortTeamMembers } from './team-utils';
import { TeamOverlayCard } from './TeamOverlayCard';

export function TeamsByDepartment() {
  const { data, isLoading, isError } = useTeamsQuery({
    all: false,
    size: 50,
  });

  const sortedTeams = useMemo<Team[]>(
    () => sortTeamMembers(data?.data?.docs ?? []),
    [data]
  );

  return (
    <section className='w-full bg-[#FDF9ED] opacity-100 rotate-0'>
      <div className='w-full max-w-[1440px] mx-auto py-16 px-5 sm:px-8 lg:px-[100px] flex flex-col gap-16'>
        {/* Header Row */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <Reveal direction='up' duration={0.6}>
              <h1 className='font-[family-name:var(--font-plus-jakarta-sans)] font-extrabold text-[36px] sm:text-[48px] lg:text-[64px] leading-[1.4] tracking-[-0.04em] align-middle text-[#0A1E44]'>
                Meet the team
              </h1>
              <p className='text-[#0A1E44]/85 text-[15px] sm:text-[16px] mt-1'>
                The people behind LocalBuka.
              </p>
            </Reveal>
          </div>

          <Reveal direction='up' delay={0.1} duration={0.6}>
            <Link
              href='/company'
              className='text-[#0A1E44] font-semibold inline-flex items-center gap-1.5 hover:underline text-sm sm:text-base self-start sm:self-auto'
            >
              <span>Go back</span>
              <ArrowLeft className='w-4 h-4' />
            </Link>
          </Reveal>
        </div>

        {/* 4-Column Grid: 301×400 cards at 1440px (100px padding, 12px horizontal gap, 64px vertical gap) */}
        {isLoading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-16'>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((slot) => (
              <div
                key={slot}
                className='w-full h-[400px] rounded-md bg-[#0A1E44]/10 animate-pulse'
              />
            ))}
          </div>
        ) : isError ? (
          <div className='flex items-center justify-center py-20'>
            <p className='text-red-600 text-center'>
              Failed to load team members. Please try again.
            </p>
          </div>
        ) : sortedTeams.length === 0 ? (
          <div className='flex items-center justify-center py-20'>
            <p className='text-[#0A1E44]/70 text-center'>
              No team members listed yet.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-16'>
            {sortedTeams.map((member, index) => (
              <TeamOverlayCard key={member.id} member={member} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
