'use client';

import Image from 'next/image';
import Link from 'next/link';
import {RiLinkedinFill} from 'react-icons/ri';
import {useTeamsQuery} from '@/lib/api/services/teams.hooks';
import type {Team} from '@/lib/api/services/teams.service';
import {capitalize} from '@/lib/utils';

const DEPARTMENTS = [
  'Operations',
  'Engineering',
  'Product',
  'Human Resource',
  'Brand & Finance',
];

export function TeamsByDepartment() {
  const {data, isLoading, isError} = useTeamsQuery();
  const teams: Team[] = data?.data.docs ?? [];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <p className='text-muted-foreground'>Loading team members...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center py-20'>
        <p className='text-red-600 dark:text-red-400'>
          Failed to load team members. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-black'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        {DEPARTMENTS.map((dept) => {
          const deptMembers = teams.filter((m) => m.department === dept);
          if (deptMembers.length === 0) return null;

          return (
            <div key={dept} className='mb-16'>
              <h2 className='text-2xl font-bold mb-8'>{dept}</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                {deptMembers.map((member) => (
                  <div key={member.id} className='text-center'>
                    <div className='relative w-[204px] h-[204px] mx-auto mb-4 rounded-full border overflow-hidden flex items-center justify-center'>
                      {member.image_url ? (
                        <Image
                          src={member.image_url}
                          alt={`${member.first_name} ${member.last_name}`}
                          fill
                          className='rounded-full object-cover object-center'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/70 text-white text-4xl font-bold uppercase'>
                          {member.first_name[0]}
                          {member.last_name[0]}
                        </div>
                      )}
                    </div>
                    <h3 className='text-lg font-semibold'>
                      {capitalize(member.first_name)}{' '}
                      {capitalize(member.last_name)}
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      {member.position}
                    </p>
                    {member.linkedin_url && (
                      <Link
                        href={member.linkedin_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-block mt-2'
                        aria-label={`${member.first_name} ${member.last_name} LinkedIn`}>
                        <RiLinkedinFill className='w-5 h-5 text-foreground hover:text-primary transition-colors' />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
