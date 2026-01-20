'use client';

import Image from 'next/image';
import {Button} from '@/components/ui/button';
import SectionHeader from '../SectionHeader';
import {ChevronRight} from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import Link from 'next/link';
import {Images} from '@/public/images';
import {Reveal} from '@/components/anim/Reveal';
import {RiLinkedinFill} from 'react-icons/ri';
import {useTeamsQuery} from '@/lib/api/services/teams.hooks';
import type {Team} from '@/lib/api/services/teams.service';

function TeamMemberCard({member}: {member: Team}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className='relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-xl transition-all'>
          <div className='relative h-[584px]'>
            {member.image_url ? (
              <Image
                src={member.image_url}
                alt={`${member.first_name} ${member.last_name}`}
                fill
                className='object-cover group-hover:scale-110 transition-transform duration-500'
              />
            ) : (
              <div className='absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary to-primary/70 text-white text-5xl font-bold capitalize'>
                {member.first_name[0]}
                {member.last_name[0]}
              </div>
            )}
            <div className='absolute bottom-0 left-0 right-0 p-6 pb-4 text-white text-center backdrop-blur-md bg-linear-to-t from-black/95 via-black/70 via-60% to-black/0 opacity-90'>
              <h3 className='font-semibold text-sm capitalize'>
                {member.first_name} {member.last_name}
              </h3>
              <p className='text-xs text-gray-300'>{member.position}</p>
              {member.linkedin_url && (
                <div className='mt-3 flex justify-center'>
                  <p
                    rel='noopener noreferrer'
                    aria-label={`Open ${member.first_name} ${member.last_name}'s LinkedIn`}
                    className='inline-flex items-center justify-center rounded-md bg-white/15 hover:bg-white/25 transition-colors p-2 backdrop-blur-sm'>
                    <RiLinkedinFill className='w-4 h-4 text-white' />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className='bg-white dark:bg-black text-foreground'>
        <div className='absolute inset-0 -z-10'>
          <Image
            src={Images.pattern}
            alt='pattern'
            fill
            className='object-cover opacity-10 dark:opacity-5'
          />
        </div>
        <div className='max-w-2xl mx-auto text-center py-8 px-4'>
          <div className='relative w-32 h-32 mx-auto mb-4'>
            {member.image_url ? (
              <Image
                src={member.image_url}
                alt={`${member.first_name} ${member.last_name}`}
                fill
                className='rounded-full object-cover border-4 border-primary'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/70 text-white text-4xl font-bold capitalize border-4 border-primary'>
                {member.first_name[0]}
                {member.last_name[0]}
              </div>
            )}
          </div>
          <DrawerHeader>
            <DrawerTitle className='text-3xl font-bold capitalize'>
              {member.first_name} {member.last_name}
            </DrawerTitle>
            <DrawerDescription className='text-lg text-primary'>
              {member.position}
            </DrawerDescription>
          </DrawerHeader>
          {member.description && <p className='my-6'>{member.description}</p>}
          <DrawerFooter className='flex-row justify-center gap-4'>
            {member.linkedin_url && (
              <Button asChild>
                <a
                  href={member.linkedin_url}
                  target='_blank'
                  rel='noopener noreferrer'>
                  View LinkedIn
                </a>
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant='outline'>Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function TeamSection() {
  const {data, isLoading, isError} = useTeamsQuery();
  const teams: Team[] = data?.data.docs ?? [];
  const featuredTeams = teams.slice(0, 10);

  return (
    <section className='py-20 bg-white dark:bg-black'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center mb-12'>
          <SectionHeader title='Meet the Team' />
          <Reveal direction='up' duration={0.5}>
            <Button
              asChild
              variant='link'
              className='text-foreground hover:text-primary'>
              <Link href='/team'>
                See All <ChevronRight />
              </Link>
            </Button>
          </Reveal>
        </div>
        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <p className='text-muted-foreground'>Loading team members...</p>
          </div>
        ) : isError || featuredTeams.length === 0 ? (
          <div className='flex items-center justify-center py-12'>
            <p className='text-muted-foreground'>
              Our amazing team will appear here soon.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
            {featuredTeams.map((member, i) => (
              <Reveal
                key={member.id}
                direction='up'
                delay={i * 0.06}
                duration={0.45}>
                <TeamMemberCard member={member} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
