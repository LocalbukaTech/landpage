'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RiLinkedinFill } from 'react-icons/ri';
import { Reveal } from '@/components/anim/Reveal';
import type { Team } from '@/lib/api/services/teams.service';
import { formatExternalUrl } from '@/lib/utils';
import {
  formatTeamName,
  formatTeamPosition,
  getTeamInitials,
  normalizeTeamImageUrl,
} from './team-utils';

interface TeamOverlayCardProps {
  member: Team;
  index: number;
}

export function TeamOverlayCard({ member, index }: TeamOverlayCardProps) {
  const [imageError, setImageError] = useState(false);

  const fullName = formatTeamName(member.first_name, member.last_name);
  const position = formatTeamPosition(member.position);
  const imageUrl = normalizeTeamImageUrl(member.image_url);
  const showPhoto = Boolean(imageUrl) && !imageError;

  return (
    <Reveal
      direction='up'
      delay={(index % 4) * 0.1}
      duration={0.6}
      className='w-full'
    >
      <article className='relative w-full h-[400px] rounded-md overflow-clip group bg-[#0A1E44] opacity-100 rotate-0'>
        {showPhoto ? (
          <Image
            src={imageUrl}
            alt={fullName}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 301px'
            className='block object-cover object-top group-hover:scale-105 transition-transform duration-500'
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className='w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A1E44] to-[#1a3a70] text-[#FFC727] text-4xl font-bold uppercase'
            aria-hidden='true'
          >
            {getTeamInitials(member.first_name, member.last_name)}
          </div>
        )}

        {/* Bottom Dark Gradient Overlay matching Figma */}
        <div className='absolute inset-x-0 bottom-0 h-[136px] bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none' />

        {/* Text Info & LinkedIn Badge */}
        <div className='absolute inset-x-0 bottom-0 px-4 pb-4 pt-6 flex items-end justify-between gap-3'>
          <div className='min-w-0'>
            <h3 className='text-white font-semibold text-[15px] leading-snug mb-0.5'>
              {fullName}
            </h3>
            <p className='text-white/75 text-[11px] leading-snug line-clamp-2'>
              {position}
            </p>
          </div>

          {member.linkedin_url && (
            <a
              href={formatExternalUrl(member.linkedin_url)}
              target='_blank'
              rel='noopener noreferrer'
              className='w-5 h-5 shrink-0 rounded-[3px] bg-white text-[#111827] flex items-center justify-center hover:bg-[#FFC727] hover:text-[#0A1E44] transition-colors'
              aria-label={`${fullName} LinkedIn`}
            >
              <RiLinkedinFill className='w-3.5 h-3.5' />
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}
