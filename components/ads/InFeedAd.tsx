'use client';

import {useEffect, useRef, useState} from 'react';
import {BadgeCheck, ExternalLink, Sparkles} from 'lucide-react';

interface InFeedAdProps {
  className?: string;
  slot?: string;
  layoutKey?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function InFeedAd({
  className = '',
  slot = '6202753675',
  layoutKey = '-6t+ed+2i-1n-4w',
}: InFeedAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isPushed = useRef(false);
  const [isGoogleActuallyShowing, setIsGoogleActuallyShowing] = useState(false);
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

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;

        if (width >= 100 && !isPushed.current) {
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
            console.error('Google AdSense InFeed error:', err);
          }
        }
      }
    });

    if (adRef.current) {
      const target = adRef.current.parentElement || adRef.current;
      observer.observe(target);

      // Only switch to Google view if Google explicitly fills an ad with height > 100px
      const checkAdFilled = () => {
        if (!adRef.current) return;
        const status = adRef.current.getAttribute('data-ad-status');
        const iframe = adRef.current.querySelector('iframe');
        const hasHeight = iframe && iframe.offsetHeight > 100;

        if (status === 'filled' && hasHeight) {
          setIsGoogleActuallyShowing(true);
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
    <div className={`relative w-full h-full flex flex-col justify-between overflow-hidden bg-black ${className}`}>
      {/* 
        Native Sponsored Post Card (ALWAYS renders by default so card NEVER goes black).
        If Google provides a real live ad with content, it smoothly overlays.
      */}
      <div className='absolute inset-0 w-full h-full flex flex-col justify-between overflow-hidden'>
        {/* Full-bleed background media with cinematic gradient */}
        <div className='absolute inset-0 w-full h-full overflow-hidden'>
          <img
            src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1080&q=85'
            alt='LocalBuka Sponsored'
            className='w-full h-full object-cover scale-105'
          />
          {/* Dark gradient overlay matching organic feed video overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent' />
          <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent' />
        </div>

        {/* Top Spacer - clear from Following / For You floating tabs */}
        <div className='relative z-10 pt-20 px-4 flex items-center justify-between pointer-events-none'>
          <div className='flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10'>
            <Sparkles className='w-3.5 h-3.5 text-[#FFC727]' />
            <span className='text-[11px] font-bold tracking-wider uppercase text-[#FFC727]'>
              Sponsored
            </span>
          </div>
          <span className='text-[10px] text-zinc-400 font-medium px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs'>
            Ad by Google
          </span>
        </div>

        {/* Bottom Organic Details Overlay */}
        <div className='relative z-10 p-5 flex flex-col gap-2.5 justify-end'>
          {/* Author info */}
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full bg-[#FFC727] text-black font-extrabold flex items-center justify-center text-xs shadow-md border border-white/20'>
              LB
            </div>
            <div className='flex items-center gap-1'>
              <span className='text-white font-bold text-sm tracking-wide'>
                @localbuka
              </span>
              <BadgeCheck className='w-4 h-4 text-[#FFC727] fill-[#FFC727]/20' />
            </div>
          </div>

          {/* Headline and Caption */}
          <div className='flex flex-col gap-1'>
            <h3 className='text-white font-bold text-base leading-snug drop-shadow-md'>
              Craving Authentic Bole & Local Delicacies?
            </h3>
            <p className='text-white/80 text-xs leading-relaxed line-clamp-2 drop-shadow-xs'>
              Discover top-rated Bukas, chef specials, and verified food reviews across your neighborhood.
            </p>
          </div>

          {/* Hashtags */}
          <div className='flex items-center gap-1.5 flex-wrap text-[11px] font-semibold text-[#FFC727] drop-shadow-xs'>
            <span>#LocalBuka</span>
            <span>#LagosFoodie</span>
            <span>#BoleFeast</span>
            <span>#NigerianFood</span>
          </div>

          {/* Call to Action Button */}
          <a
            href='https://localbuka.com'
            target='_blank'
            rel='noopener noreferrer'
            className='mt-1 w-full py-3 px-4 rounded-xl bg-[#FFC727] hover:bg-yellow-400 active:scale-[0.98] transition-all text-black font-extrabold text-xs flex items-center justify-between shadow-xl cursor-pointer border border-yellow-300/30'>
            <span className='flex items-center gap-2'>
              <Sparkles className='w-4 h-4' />
              <span>Explore Top Bukas</span>
            </span>
            <span className='flex items-center gap-1 uppercase tracking-wider text-[11px]'>
              <span>Order Now</span>
              <ExternalLink className='w-3.5 h-3.5' />
            </span>
          </a>
        </div>
      </div>

      {/* 
        Google AdSense In-Feed Ad Unit:
        Always mounted in the DOM so AdSense script initializes properly.
        If Google successfully fills with an actual ad, it transitions in gracefully.
      */}
      <div
        className={`w-full h-full flex items-center justify-center p-4 z-20 transition-opacity duration-500 ${
          isGoogleActuallyShowing
            ? 'opacity-100 pointer-events-auto bg-black'
            : 'opacity-0 pointer-events-none absolute inset-0'
        }`}>
        <ins
          ref={adRef}
          className='adsbygoogle'
          style={{display: 'block', width: '100%'}}
          data-ad-format='fluid'
          data-ad-layout-key={layoutKey}
          data-ad-client='ca-pub-2319578381550272'
          data-ad-slot={slot}
          data-adtest={isLocalhost ? 'on' : undefined}
        />
      </div>
    </div>
  );
}

export default InFeedAd;
