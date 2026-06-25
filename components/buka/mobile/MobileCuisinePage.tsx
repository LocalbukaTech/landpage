'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  LocateFixed,
  MapPin,
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {CgSpinner} from 'react-icons/cg';
import type {BukaRestaurant} from '@/components/buka/BukaCard';
import {MobileRestaurantRow} from './MobileRestaurantRow';

const RATING_CHIPS = ['All Ratings', '⭐ 4+', '⭐ 3+'];

interface Props {
  cuisineName: string;
  cuisineDescription: string;
  cuisineImages: string[];
  restaurants: BukaRestaurant[];
  isLoading: boolean;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
}

/**
 * Mobile-native cuisine detail page.
 * Shows a compact hero, search, location picker, rating chips,
 * and a vertical restaurant list.
 */
export function MobileCuisinePage({
  cuisineName,
  cuisineDescription,
  cuisineImages,
  restaurants,
  isLoading,
  selectedLocation,
  onLocationChange,
}: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRating, setActiveRating] = useState('All Ratings');
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const locationSheetInputRef = useRef<HTMLInputElement>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (!locationInput.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&limit=3&countrycodes=ng`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          const names = data.map((item: any) => {
            const parts = item.display_name.split(',');
            return parts.slice(0, 3).map((p: string) => p.trim()).join(', ');
          });
          setSuggestions([...new Set(names)]);
        }
      } catch (error) {
        console.error('Error fetching mobile suggestions:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [locationInput]);

  // Hero carousel state
  const [activeSlide, setActiveSlide] = useState(0);

  const isCurrentLocation = selectedLocation === 'Current Location';

  // Auto-advance hero carousel
  useEffect(() => {
    if (cuisineImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % cuisineImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [cuisineImages.length]);

  // Filter restaurants client-side
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

    if (activeRating === '⭐ 4+') {
      list = list.filter((r) => r.rating >= 4);
    } else if (activeRating === '⭐ 3+') {
      list = list.filter((r) => r.rating >= 3);
    }

    return list;
  }, [restaurants, searchQuery, activeRating]);

  const hasActiveFilters = activeRating !== 'All Ratings';

  const clearFilters = () => {
    setActiveRating('All Ratings');
  };

  // Prevent body scroll when location sheet is open
  useEffect(() => {
    document.body.style.overflow = showLocationSheet ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showLocationSheet]);

  // Focus input when sheet opens
  useEffect(() => {
    if (showLocationSheet && locationSheetInputRef.current) {
      setTimeout(() => locationSheetInputRef.current?.focus(), 300);
    }
  }, [showLocationSheet]);

  const handleLocationSubmit = () => {
    const trimmed = locationInput.trim();
    if (trimmed) {
      onLocationChange(trimmed);
    }
    setShowLocationSheet(false);
  };

  const handleUseCurrentLocation = () => {
    setLocationInput('');
    onLocationChange('Current Location');
    setShowLocationSheet(false);
  };

  return (
    <div className='w-full min-h-screen bg-[#111] pb-24'>
      {/* ── Compact Hero ── */}
      <section className='relative w-full h-[240px] overflow-hidden'>
        {/* Hero images carousel */}
        {cuisineImages.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}>
            <Image
              src={img}
              alt={`${cuisineName} slide ${i + 1}`}
              fill
              className='object-cover'
              sizes='100vw'
              priority={i === 0}
            />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-[#111] via-black/40 to-transparent' />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className='absolute top-4 left-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 border border-white/20 active:bg-black/60 transition-colors'>
          <ArrowLeft size={18} className='text-white' />
        </button>

        {/* Hero text */}
        <div className='absolute bottom-4 left-4 right-4 z-10'>
          <h1 className='text-white text-lg font-bold leading-tight mb-1'>
            {cuisineName}
          </h1>
          <p className='text-white/70 text-xs leading-relaxed line-clamp-2'>
            {cuisineDescription}
          </p>
        </div>

        {/* Dots */}
        {cuisineImages.length > 1 && (
          <div className='absolute bottom-3 right-4 z-10 flex gap-1.5'>
            {cuisineImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeSlide
                    ? 'bg-white w-4'
                    : 'bg-white/40 w-1.5'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Sticky Header ── */}
      <div className='sticky top-0 z-30 bg-[#111]/96 backdrop-blur-md border-b border-white/5'>
        {/* Search input */}
        <div className='px-4 pt-3 pb-2'>
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
              placeholder={`Search ${cuisineName.toLowerCase()}...`}
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
            <MapPin size={12} className='text-[#fbbe15] shrink-0' />
            <span className='text-zinc-300 text-xs font-medium truncate max-w-[120px]'>
              {isCurrentLocation ? '📍 Current' : selectedLocation}
            </span>
          </button>

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

          {/* Clear filters */}
          {hasActiveFilters && (
            <>
              <div className='w-px h-5 bg-white/10 shrink-0' />
              <button
                onClick={clearFilters}
                className='text-[#fbbe15] text-xs font-medium flex items-center gap-1 shrink-0 active:opacity-70'>
                Clear <X size={10} />
              </button>
            </>
          )}
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
              No restaurants found for {cuisineName.toLowerCase()}.
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
            <div className='px-4 pt-2 pb-6'>
              <h3 className='text-white font-bold text-base mb-4'>
                Search Location
              </h3>

              {/* Location text input */}
              <div className='relative mb-3'>
                <MapPin
                  size={16}
                  className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500'
                />
                <input
                  ref={locationSheetInputRef}
                  type='text'
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLocationSubmit();
                  }}
                  placeholder='Type a city or area...'
                  className='w-full bg-[#222] border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-white text-sm placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/40 transition-colors'
                />
                {locationInput && (
                  <button
                    onClick={() => setLocationInput('')}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 active:text-white'>
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Mobile location suggestions */}
              {isLoadingSuggestions ? (
                <div className='mb-3 bg-[#222]/30 border border-white/5 rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-zinc-500 text-xs'>
                  <CgSpinner className='animate-spin text-[#fbbe15] text-sm shrink-0' />
                  <span>Searching locations...</span>
                </div>
              ) : locationInput.trim() && suggestions.length > 0 ? (
                <div className='mb-3 bg-[#222]/50 border border-white/5 rounded-2xl overflow-hidden'>
                  {suggestions.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocationInput(loc);
                        onLocationChange(loc);
                        setShowLocationSheet(false);
                      }}
                      className='w-full text-left px-4 py-3.5 text-sm text-zinc-300 border-none bg-transparent active:bg-white/5 border-b border-white/5 last:border-b-0 flex items-center gap-2'
                    >
                      <MapPin size={14} className='text-zinc-500 shrink-0' />
                      <span>{loc}</span>
                    </button>
                  ))}
                </div>
              ) : locationInput.trim() ? (
                <div className='mb-3 bg-[#222]/30 border border-white/5 rounded-2xl py-3 px-4 text-center text-zinc-500 text-xs'>
                  No locations found
                </div>
              ) : null}

              {/* Search button */}
              {locationInput.trim() && (
                <button
                  onClick={handleLocationSubmit}
                  className='w-full py-3 bg-[#fbbe15] text-[#1a1a1a] font-semibold text-sm rounded-2xl mb-3 active:scale-[0.98] transition-transform'>
                  Search in &ldquo;{locationInput.trim()}&rdquo;
                </button>
              )}

              {/* Divider */}
              <div className='flex items-center gap-3 my-3'>
                <div className='flex-1 h-px bg-white/10' />
                <span className='text-zinc-600 text-xs'>or</span>
                <div className='flex-1 h-px bg-white/10' />
              </div>

              {/* Use Current Location */}
              <button
                onClick={handleUseCurrentLocation}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-colors ${
                  isCurrentLocation
                    ? 'bg-[#fbbe15]/10 border border-[#fbbe15]/30'
                    : 'bg-[#222] border border-transparent active:bg-[#2a2a2a]'
                }`}>
                <LocateFixed size={18} className='text-[#fbbe15] shrink-0' />
                <span
                  className={`text-sm font-medium ${
                    isCurrentLocation ? 'text-[#fbbe15]' : 'text-zinc-300'
                  }`}>
                  Use Current Location
                </span>
                {isCurrentLocation && (
                  <span className='ml-auto text-[#fbbe15] text-xs font-bold'>
                    ✓
                  </span>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
