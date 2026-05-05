'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {CgSpinner} from 'react-icons/cg';
import type {BukaRestaurant} from '@/components/buka/BukaCard';
import {MobileRestaurantRow} from './MobileRestaurantRow';
import {RESTAURANT_PLACEHOLDER_IMG} from '@/lib/constants';

const LOCATIONS = [
  'Current Location',
  'Ikeja, Lagos',
  'Victoria Island, Lagos',
  'Lekki, Lagos',
  'Abuja, FCT',
  'Port Harcourt, Rivers',
];

const CUISINE_CHIPS = [
  'All',
  'Nigerian',
  'Yoruba',
  'Igbo',
  'Hausa',
  'Calabar',
  'Edo',
  'Continental',
];

const RATING_CHIPS = ['All Ratings', '⭐ 4+', '⭐ 3+'];

interface Props {
  restaurants: BukaRestaurant[];
  isLoading: boolean;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
}

/**
 * Mobile-native explore/search page for restaurants.
 * Replaces the desktop sidebar + grid layout with a touch-friendly
 * sticky header, chip filters, and vertical list.
 */
export function MobileExploreRestaurants({
  restaurants,
  isLoading,
  selectedLocation,
  onLocationChange,
}: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('All');
  const [activeRating, setActiveRating] = useState('All Ratings');
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter restaurants client-side based on chips
  const filtered = useMemo(() => {
    let list = restaurants;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (activeCuisine !== 'All') {
      list = list.filter((r) =>
        r.tags.some((t) =>
          t.toLowerCase().includes(activeCuisine.toLowerCase()),
        ),
      );
    }

    if (activeRating === '⭐ 4+') {
      list = list.filter((r) => r.rating >= 4);
    } else if (activeRating === '⭐ 3+') {
      list = list.filter((r) => r.rating >= 3);
    }

    return list;
  }, [restaurants, searchQuery, activeCuisine, activeRating]);

  const hasActiveFilters =
    activeCuisine !== 'All' || activeRating !== 'All Ratings';

  const clearFilters = () => {
    setActiveCuisine('All');
    setActiveRating('All Ratings');
  };

  // Prevent body scroll when location sheet is open
  useEffect(() => {
    document.body.style.overflow = showLocationSheet ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showLocationSheet]);

  return (
    <div className='w-full min-h-screen bg-[#111] pb-24'>
      {/* ── Sticky Header ── */}
      <div className='sticky top-0 z-30 bg-[#111]/96 backdrop-blur-md border-b border-white/5'>
        {/* Top bar */}
        <div className='flex items-center gap-3 px-4 pt-4 pb-2'>
          <button
            onClick={() => router.back()}
            className='w-9 h-9 flex items-center justify-center rounded-full bg-[#1e1e1e] border border-white/8 shrink-0 active:bg-[#2a2a2a] transition-colors'>
            <ArrowLeft size={18} className='text-white' />
          </button>
          <h1 className='text-white font-bold text-base flex-1'>
            Explore Restaurants
          </h1>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className='text-[#fbbe15] text-xs font-medium flex items-center gap-1 active:opacity-70'>
              Clear <X size={12} />
            </button>
          )}
        </div>

        {/* Search input */}
        <div className='px-4 pb-2'>
          <div className='relative'>
            <Search
              size={16}
              className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500'
            />
            <input
              ref={searchInputRef}
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search restaurants, cuisines...'
              className='w-full bg-[#1e1e1e] border border-white/8 rounded-2xl pl-10 pr-10 py-2.5 text-white text-sm placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/40 transition-colors'
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 active:text-white'>
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Location + filter row */}
        <div className='flex items-center gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide'>
          {/* Location button */}
          <button
            onClick={() => setShowLocationSheet(true)}
            className='flex items-center gap-1.5 bg-[#1e1e1e] border border-white/8 rounded-full px-3 py-1.5 shrink-0 active:bg-[#2a2a2a] transition-colors'>
            <span className='text-zinc-300 text-xs font-medium truncate max-w-[120px]'>
              {selectedLocation}
            </span>
            <ChevronDown size={12} className='text-zinc-500 shrink-0' />
          </button>

          {/* Divider */}
          <div className='w-px h-5 bg-white/10 shrink-0' />

          {/* Cuisine chips */}
          {CUISINE_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveCuisine(chip)}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                activeCuisine === chip
                  ? 'bg-[#fbbe15] text-[#1a1a1a]'
                  : 'bg-[#1e1e1e] text-zinc-400 border border-white/8'
              }`}>
              {chip}
            </button>
          ))}

          {/* Divider */}
          <div className='w-px h-5 bg-white/10 shrink-0' />

          {/* Rating chips */}
          {RATING_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveRating(chip)}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                activeRating === chip
                  ? 'bg-[#fbbe15] text-[#1a1a1a]'
                  : 'bg-[#1e1e1e] text-zinc-400 border border-white/8'
              }`}>
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      <div className='px-4 pt-4'>
        {isLoading ? (
          <div className='flex items-center justify-center py-20'>
            <CgSpinner className='animate-spin text-[#fbbe15] text-3xl' />
          </div>
        ) : filtered.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 gap-3'>
            <SlidersHorizontal size={40} className='text-zinc-700' />
            <p className='text-zinc-400 text-sm text-center'>
              No restaurants match your filters.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className='text-[#fbbe15] text-sm font-medium active:opacity-70'>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <p className='text-zinc-500 text-xs mb-3'>
              {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''}{' '}
              found
            </p>
            <div className='flex flex-col gap-2.5'>
              {filtered.map((r) => (
                <MobileRestaurantRow key={r.id} restaurant={r} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Location Bottom Sheet ── */}
      {showLocationSheet && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 bg-black/70 backdrop-blur-sm z-40'
            onClick={() => setShowLocationSheet(false)}
          />
          {/* Sheet */}
          <div className='fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] rounded-t-3xl border-t border-white/10 pb-safe'>
            {/* Handle */}
            <div className='flex justify-center pt-3 pb-1'>
              <div className='w-10 h-1 rounded-full bg-zinc-700' />
            </div>
            <div className='px-4 pt-2 pb-4'>
              <h3 className='text-white font-bold text-base mb-4'>
                Select Location
              </h3>
              <div className='flex flex-col gap-1'>
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      onLocationChange(loc);
                      setShowLocationSheet(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                      selectedLocation === loc
                        ? 'bg-[#fbbe15]/10 border border-[#fbbe15]/30'
                        : 'bg-[#222] border border-transparent active:bg-[#2a2a2a]'
                    }`}>
                    <span
                      className={`text-sm font-medium ${
                        selectedLocation === loc
                          ? 'text-[#fbbe15]'
                          : 'text-zinc-300'
                      }`}>
                      {loc}
                    </span>
                    {selectedLocation === loc && (
                      <span className='ml-auto text-[#fbbe15] text-xs font-bold'>
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
