import Link from 'next/link';
import Image from 'next/image';
import { ArrowUp } from 'lucide-react';

export function FooterMew() {
  return (
    <footer className='bg-[#0A1E44] pt-20 pb-8 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Top Section: Links & Info */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
          
          {/* Column 1: Logo & CTA */}
          <div className='col-span-1 lg:col-span-1'>
            <div className='flex items-center gap-2 mb-4'>
              {/* Logo Icon */}
              <span className='text-white font-bold text-2xl tracking-tighter'>
                Local<span className='text-[#FFC727]'>Buka</span>
              </span>
              <div className='w-6 h-6 rounded-full bg-[#FFC727] flex items-center justify-center'>
                <span className='text-[#0A1E44] text-xs font-bold'>LB</span>
              </div>
            </div>
            <p className='text-gray-300 text-sm mb-6 max-w-xs leading-relaxed'>
              Decide what or where to eat without the endless search and guesswork.
            </p>
            <Link 
              href='/explore' 
              className='inline-block bg-[#FFC727] text-[#0A1E44] font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors'
            >
              Find food
            </Link>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className='text-white font-semibold mb-6'>Company</h4>
            <ul className='space-y-4 text-sm'>
              <li><Link href='/about' className='text-gray-300 hover:text-[#FFC727] transition-colors'>About us</Link></li>
              <li><Link href='/blog' className='text-gray-300 hover:text-[#FFC727] transition-colors'>Blogs</Link></li>
              <li><Link href='/team' className='text-gray-300 hover:text-[#FFC727] transition-colors'>Meet the team</Link></li>
              <li><Link href='/ambassador' className='text-gray-300 hover:text-[#FFC727] transition-colors'>Ambassadorship Program</Link></li>
            </ul>
          </div>

          {/* Column 3: Discover */}
          <div>
            <h4 className='text-white font-semibold mb-6'>Discover</h4>
            <ul className='space-y-4 text-sm'>
              <li><Link href='/explore' className='text-gray-300 hover:text-[#FFC727] transition-colors'>Find food</Link></li>
              <li><Link href='/restaurants' className='text-gray-300 hover:text-[#FFC727] transition-colors'>For restaurants</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className='text-white font-semibold mb-6'>Legal</h4>
            <ul className='space-y-4 text-sm'>
              <li><Link href='/terms' className='text-gray-300 hover:text-[#FFC727] transition-colors'>Terms & Policies</Link></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className='border-t border-white/10 pt-8 pb-12 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-gray-400 text-sm'>
            © 2026 LocalBuka. All rights reserved.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='flex items-center gap-2 text-white text-sm hover:text-[#FFC727] transition-colors'
          >
            Back to top <ArrowUp className='w-4 h-4' />
          </button>
        </div>

      </div>

      {/* Giant LocalBuka Image */}
      <div className='w-full flex justify-center mt-8 px-4 overflow-hidden'>
        <div className='w-full max-w-7xl relative flex justify-center items-end pointer-events-none'>
          <Image 
            src="/images/localbukafooter.png" 
            alt="LocalBuka" 
            width={1400} 
            height={300} 
            className='w-full h-auto object-contain' 
          />
        </div>
      </div>
      
    </footer>
  );
}