import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';

const TEAM_MEMBERS = [
  {
    name: 'Obinna Nwachukwu',
    role: 'CEO',
    image: '/images/ceo.png',
  },
  {
    name: 'Aisha Mohammed',
    role: 'CTO',
    image: '/images/cto.png',
  },
  {
    name: 'Tunde Olaniyan',
    role: 'CFO',
    image: '/images/cfo.png',
  },
  {
    name: 'Chinedu Okoro',
    role: 'Head of Product',
    image: '/images/product.png',
  },
];

export function TeamSection() {
  return (
    <section className='bg-[#FDFBF7] py-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Header Area */}
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6'>
          <div>
            <Reveal direction='up' duration={0.6}>
              <h2 className='text-[#0A1E44] text-4xl md:text-5xl font-bold mb-4'>
                Meet the team
              </h2>
              <p className='text-[#0A1E44] text-lg'>
                The people behind LocalBuka.
              </p>
            </Reveal>
          </div>
          
          <Reveal direction='up' delay={0.1} duration={0.6}>
            <Link 
              href='/team' 
              className='text-[#0A1E44] font-semibold flex items-center gap-2 hover:underline text-lg'
            >
              See the full team <ArrowRight className='w-5 h-5' />
            </Link>
          </Reveal>
        </div>

        {/* Team Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {TEAM_MEMBERS.map((member, index) => (
            <Reveal 
              key={member.name} 
              direction='up' 
              delay={index * 0.1} 
              duration={0.6}
              className='relative h-[380px] rounded-2xl overflow-hidden group cursor-pointer'
            >
              {/* Background Image */}
              <Image
                src={member.image}
                alt={member.name}
                fill
                className='object-cover object-top group-hover:scale-105 transition-transform duration-500'
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90' />
              
              {/* Text Info */}
              <div className='absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between'>
                <div>
                  <h3 className='text-white font-bold text-xl mb-1'>{member.name}</h3>
                  <p className='text-gray-300 text-sm'>{member.role}</p>
                </div>
                
                {/* LinkedIn Icon */}
                <a 
                  href='#' 
                  className='w-8 h-8 bg-white/10 backdrop-blur-sm rounded flex items-center justify-center text-white hover:bg-[#FFC727] hover:text-[#0A1E44] transition-colors'
                  aria-label={`${member.name} LinkedIn`}
                >
                  <Linkedin className='w-4 h-4' />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}