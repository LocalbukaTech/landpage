'use client';

import {Bookmark, MapPin, Star, UtensilsCrossed} from 'lucide-react';
import Image from 'next/image';
import {CgSpinner} from 'react-icons/cg';
import type {BukaRestaurant} from '@/components/buka/BukaCard';
import {useRestaurantCardActions} from '@/lib/hooks/useRestaurantCardActions';
import {isRestaurantOpen} from '@/lib/utils/opening-hours';
import {RESTAURANT_PLACEHOLDER_IMG} from '@/lib/constants';

/**
 * Full-width horizontal list row for mobile restaurant lists.
 * Left: square thumbnail. Right: name, rating, tags, address. Far right: bookmark.
 */
export function MobileRestaurantRow({
  restaurant,
}: {
  restaurant: BukaRestaurant;
}) {
  const {navigate, toggleWishlist, isWishlisted, isNavigating} =
    useRestaurantCardActions(restaurant);
  const isOpen = isRestaurantOpen(
    restaurant.rawRestaurant?.openingHours ?? null,
  );

  return (
    <div
      className='flex items-center gap-3 p-3 bg-[#1e1e1e] rounded-2xl border border-white/5 cursor-pointer active:bg-[#252525] transition-colors'
      onClick={navigate}>
      {/* Thumbnail */}
      <div className='relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 shrink-0'>
        {isNavigating && (
          <div className='absolute inset-0 bg-black/60 z-10 flex items-center justify-center'>
            <CgSpinner className='animate-spin text-[#fbbe15] text-sm' />
          </div>
        )}
        {!restaurant.image ||
        restaurant.image === RESTAURANT_PLACEHOLDER_IMG ? (
          <div className='w-full h-full flex items-center justify-center'>
            <UtensilsCrossed size={24} className='text-zinc-600' />
          </div>
        ) : (
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className='object-cover'
            sizes='80px'
          />
        )}
        {isOpen && (
          <div className='absolute bottom-1 left-1 bg-black/60 rounded-full px-1.5 py-0.5 flex items-center gap-0.5'>
            <span className='w-1 h-1 rounded-full bg-green-500' />
            <span className='text-green-400 text-[8px] font-semibold'>
              Open
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className='flex-1 min-w-0'>
        <p className='text-white text-sm font-semibold truncate'>
          {restaurant.name}
        </p>
        <div className='flex items-center gap-1 mt-0.5'>
          <Star size={11} className='text-[#fbbe15] fill-[#fbbe15] shrink-0' />
          <span className='text-zinc-300 text-xs font-medium'>
            {restaurant.rating > 0 ? restaurant.rating.toFixed(1) : 'New'}
          </span>
          {restaurant.tags[0] && (
            <span className='text-zinc-500 text-xs'>
              · {restaurant.tags[0]}
            </span>
          )}
        </div>
        <div className='flex items-center gap-1 mt-0.5'>
          <MapPin size={10} className='text-zinc-500 shrink-0' />
          <span className='text-zinc-500 text-xs truncate'>
            {restaurant.address}
          </span>
        </div>
      </div>

      {/* Bookmark */}
      <button
        onClick={toggleWishlist}
        className={`w-8 h-8 flex items-center justify-center rounded-full shrink-0 transition-all border ${
          isWishlisted
            ? 'bg-[#fbbe15]/15 border-[#fbbe15]/40'
            : 'bg-white/5 border-transparent'
        }`}>
        <Bookmark
          size={14}
          className={
            isWishlisted ? 'text-[#fbbe15] fill-[#fbbe15]' : 'text-zinc-400'
          }
        />
      </button>
    </div>
  );
}
