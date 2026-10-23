'use client';

import {useEffect, useRef, useState} from 'react';
import {Sparkles} from 'lucide-react';
import Image from 'next/image';

interface BlogAdCardProps {
  slot?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function BlogAdCard({slot = '4012538754'}: BlogAdCardProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isPushed = useRef(false);
  const [isGoogleFilled, setIsGoogleFilled] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocal =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.endsWith('.local');
      setIsLocalhost(isLocal);
    }
  }, []);

  useEffect(() => {
    if (!adRef.current || isPushed.current) return;

    if (adRef.current.getAttribute('data-adsbygoogle-status') === 'done') {
      isPushed.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !isPushed.current) {
            try {
              if (
                adRef.current &&
                adRef.current.getAttribute('data-adsbygoogle-status') !== 'done'
              ) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                isPushed.current = true;
                observer.disconnect();
              }
            } catch (err) {
              console.error('Google AdSense BlogAd error:', err);
            }
          }
        }
      },
      {threshold: 0.1},
    );

    if (adRef.current) {
      observer.observe(adRef.current);

      const checkAdFilled = () => {
        if (!adRef.current) return;
        const status = adRef.current.getAttribute('data-ad-status');
        const iframe = adRef.current.querySelector('iframe');
        const hasHeight = iframe && iframe.offsetHeight > 50;

        if (status === 'filled' && hasHeight) {
          setIsGoogleFilled(true);
        }
      };

      const mutationObserver = new MutationObserver(checkAdFilled);
      mutationObserver.observe(adRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-ad-status', 'style'],
      });

      return () => {
        observer.disconnect();
        mutationObserver.disconnect();
      };
    }

    return () => observer.disconnect();
  }, []);

  return (
    <article className='group'>
      {/* Card container — matches exact blog card structure */}
      <div className='relative'>
        {/* Fallback native ad card (always renders so it never looks empty) */}
        <div
          className={`transition-opacity duration-500 ${
            isGoogleFilled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
          }`}>
          <a
            href='/buka'
            className='block cursor-pointer'>
            {/* Image matching blog card aspect ratio */}
            <div className='relative aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]'>
              <Image
                src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
                alt='Discover LocalBuka'
                fill
                className='object-cover transition-transform duration-300 group-hover:scale-105'
              />
              {/* Gradient overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

              {/* Sponsored badge */}
              <div className='absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10'>
                <Sparkles className='w-3 h-3 text-[#FFC727]' />
                <span className='text-[9px] font-bold tracking-wider uppercase text-[#FFC727]'>
                  Sponsored
                </span>
              </div>

              {/* CTA overlay at bottom */}
              <div className='absolute bottom-4 left-4 right-4'>
                <div className='bg-[#FFC727] hover:bg-yellow-400 transition-colors text-black text-xs font-bold py-2.5 px-4 rounded-lg text-center'>
                  Explore Top Bukas Near You
                </div>
              </div>
            </div>

            {/* Text content matching blog card layout */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                <span>LocalBuka</span>
                <span>•</span>
                <span className='bg-[#FFC727]/15 text-[#b8860b] dark:text-[#FFC727] text-[10px] font-bold px-2 py-0.5 rounded'>
                  Ad
                </span>
              </div>
              <h2 className='text-lg md:text-xl font-bold text-[#0A1F44] dark:text-white leading-tight group-hover:text-primary transition-colors line-clamp-2'>
                Discover Authentic Bukas & Local Restaurants
              </h2>
              <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3'>
                Find top-rated local food spots, chef specials, and verified reviews from foodies in your neighborhood.
              </p>
            </div>
          </a>
        </div>

        {/* Google AdSense — transitions in when filled */}
        <div
          className={`transition-opacity duration-500 ${
            isGoogleFilled
              ? 'opacity-100'
              : 'opacity-0 absolute inset-0 pointer-events-none'
          }`}>
          <ins
            ref={adRef}
            className='adsbygoogle'
            style={{display: 'block'}}
            data-ad-client='ca-pub-2319578381550272'
            data-ad-slot={slot}
            data-ad-format='auto'
            data-full-width-responsive='true'
            data-adtest={isLocalhost ? 'on' : undefined}
          />
        </div>
      </div>
    </article>
  );
}

export default BlogAdCard;
