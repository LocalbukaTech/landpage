'use client';

import {Bookmark, MapPin, Star, UtensilsCrossed} from 'lucide-react';
import Image from 'next/image';
import {CgSpinner} from 'react-icons/cg';
import type {BukaRestaurant} from '@/components/buka/BukaCard';
import {useRestaurantCardActions} from '@/lib/hooks/useRestaurantCardActions';
import {isRestaurantOpen} from '@/lib/utils/opening-hours';
import {RESTAURANT_PLACEHOLDER_IMG} from '@/lib/constants';

interface Props {
  restaurant: BukaRestaurant;
}

/**
 * Compact card for horizontal-scroll sections on the mobile Buka home.
 * Width: ~168px shrink-0 — sits nicely 2+ visible in a row.
 */
export function MobileRestaurantCard({restaurant}: Props) {
  const {navigate, toggleWishlist, isWishlisted, isNavigating} =
    useRestaurantCardActions(restaurant);
  const isOpen = isRestaurantOpen(
    restaurant.rawRestaurant?.openingHours ?? null,
  );

  return (
    <div
      className='shrink-0 w-44 flex flex-col cursor-pointer active:opacity-80 transition-opacity'
      onClick={navigate}>
      {/* Thumbnail */}
      <div className='relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-zinc-800'>
        {isNavigating && (
          <div className='absolute inset-0 bg-black/60 z-10 flex items-center justify-center'>
            <CgSpinner className='animate-spin text-[#fbbe15] text-xl' />
          </div>
        )}

        {!restaurant.image ||
        restaurant.image === RESTAURANT_PLACEHOLDER_IMG ? (
          <div className='w-full h-full flex items-center justify-center'>
            <UtensilsCrossed size={36} className='text-zinc-600' />
          </div>
        ) : (
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className='object-cover'
            sizes='176px'
          />
        )}

        {/* Bookmark button */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all border ${
            isWishlisted
              ? 'bg-[#fbbe15]/20 border-[#fbbe15]/50'
              : 'bg-black/50 border-transparent'
          }`}>
          <Bookmark
            size={13}
            className={
              isWishlisted ? 'text-[#fbbe15] fill-[#fbbe15]' : 'text-white'
            }
          />
        </button>

        {/* Open badge */}
        {isOpen && (
          <div className='absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5'>
            <span className='w-1.5 h-1.5 rounded-full bg-green-500' />
            <span className='text-green-400 text-[9px] font-semibold'>
              Open
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className='mt-2 px-0.5 flex flex-col gap-0.5'>
        <p className='text-white text-sm font-semibold leading-tight truncate'>
          {restaurant.name}
        </p>
        <div className='flex items-center gap-1'>
          <Star size={11} className='text-[#fbbe15] fill-[#fbbe15] shrink-0' />
          <span className='text-zinc-300 text-xs font-medium'>
            {restaurant.rating > 0 ? restaurant.rating.toFixed(1) : 'New'}
          </span>
          {restaurant.tags[0] && (
            <>
              <span className='text-zinc-600 text-xs'>·</span>
              <span className='text-zinc-400 text-xs truncate'>
                {restaurant.tags[0]}
              </span>
            </>
          )}
        </div>
        <div className='flex items-center gap-1'>
          <MapPin size={10} className='text-zinc-500 shrink-0' />
          <span className='text-zinc-500 text-[10px] truncate'>
            {restaurant.address}
          </span>
        </div>
      </div>
    </div>
  );
}
