'use client';

import {useEffect, useRef, useState} from 'react';
import {Sparkles} from 'lucide-react';
import Image from 'next/image';

interface DisplayAdProps {
  className?: string;
  slot?: string;
  format?: string;
  fullWidthResponsive?: boolean;
  /** Fallback image to show if Google hasn't filled the ad */
  fallbackSrc?: string;
  fallbackAlt?: string;
  fallbackHref?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function DisplayAd({
  className = '',
  slot = '9727155002',
  format = 'auto',
  fullWidthResponsive = true,
  fallbackSrc = '/images/buka_middle_Image.png',
  fallbackAlt = 'LocalBuka',
  fallbackHref = '/buka/restaurant',
}: DisplayAdProps) {
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLocalhost(isLocal);
    }
  }, []);

  useEffect(() => {
    if (!adRef.current || isPushed.current) return;

    if (adRef.current.getAttribute('data-adsbygoogle-status') === 'done') {
      isPushed.current = true;
      return;
    }

    // Use IntersectionObserver to only push when visible (better performance)
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
              console.error('Google AdSense Display error:', err);
            }
          }
        }
      },
      {threshold: 0.1},
    );

    if (adRef.current) {
      observer.observe(adRef.current);

      // Check if Google actually fills the ad with content
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
    <div className={`relative w-full overflow-hidden rounded-2xl ${className}`}>
      {/* Fallback: Static banner (always visible until Google fills) */}
      <div
        className={`relative w-full transition-opacity duration-500 ${
          isGoogleFilled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
        }`}>
        <a
          href={fallbackHref}
          className='block relative w-full group cursor-pointer'>
          <Image
            src={fallbackSrc}
            alt={fallbackAlt}
            width={1400}
            height={500}
            className='w-full h-auto object-cover rounded-2xl transition-transform duration-300 group-hover:scale-[1.01]'
          />
          {/* Subtle sponsored overlay */}
          <div className='absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10'>
            <Sparkles className='w-3 h-3 text-[#FFC727]' />
            <span className='text-[10px] font-bold tracking-wider uppercase text-[#FFC727]'>
              Sponsored
            </span>
          </div>
        </a>
      </div>

      {/* Google AdSense Display Ad — always in DOM, transitions in when filled */}
      <div
        className={`w-full transition-opacity duration-500 ${
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
          data-ad-format={format}
          data-full-width-responsive={fullWidthResponsive ? 'true' : undefined}
          data-adtest={isLocalhost ? 'on' : undefined}
        />
      </div>
    </div>
  );
}

export default DisplayAd;
