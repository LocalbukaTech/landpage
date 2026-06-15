'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ArrowLeft, MapPin, Search, X, LocateFixed} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {CuisineFilters, FilterState} from '@/components/buka/CuisineFilters';
import {BukaCard, BukaRestaurant} from '@/components/buka/BukaCard';
import {Pagination} from '@/components/buka/Pagination';
import {MobileExploreRestaurants} from '@/components/buka/mobile/MobileExploreRestaurants';
import {useSearchRestaurants} from '@/lib/api';
import {CgSpinner} from 'react-icons/cg';
import {useGeolocation} from '@/hooks/useGeolocation';
import {RESTAURANT_PLACEHOLDER_IMG} from '@/lib/constants';

const ITEMS_PER_PAGE = 30;

// Sort BukaRestaurant arrays: DB items first, then Google, each group by latest updatedAt

function mapToBukaRestaurant(apiRest: any): BukaRestaurant {
  return {
    id: apiRest.id || apiRest.googlePlaceId || Math.random().toString(),
    name: apiRest.name,
    image:
      apiRest.photos && apiRest.photos.length > 0
        ? apiRest.photos[0]
        : RESTAURANT_PLACEHOLDER_IMG,
    rating: apiRest.avgRating || apiRest.googleRating || 0,
    reviewCount: apiRest.reviewCount || 0,
    address: apiRest.address || `${apiRest.city || ''}, ${apiRest.state || ''}`,
    tags: [
      apiRest.cuisine,
      apiRest.source === 'google' ? 'Google' : 'Local',
    ].filter(Boolean),
    hygiene: 5.0,
    affordability: 5.0,
    foodQuality: 5.0,
    rawRestaurant: apiRest,
  };
}

export default function ExploreRestaurantsPage() {
  const router = useRouter();
  const {lat: userLat, lng: userLng, loading: loadingGeo} = useGeolocation();

  const [currentPage, setCurrentPage] = useState(1);
  // Location state: 'current' means use geolocation, otherwise it's a typed city string
  const [locationMode, setLocationMode] = useState<'current' | 'custom'>('current');
  const [locationInput, setLocationInput] = useState('');
  const [debouncedLocation, setDebouncedLocation] = useState('');
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const locationRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce location input so API calls don't fire on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(locationInput.trim());
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [locationInput]);

  // Display label for the current location state
  const locationDisplayLabel = locationMode === 'current' ? 'Current Location' : (locationInput || 'Type a location...');

  const searchParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      pageSize: ITEMS_PER_PAGE,
      q: searchQuery || undefined,
    };

    if (locationMode === 'current') {
      params.lat = userLat || 6.5244;
      params.lng = userLng || 3.3792;
    } else if (debouncedLocation) {
      params.city = debouncedLocation;
    }

    return params;
  }, [locationMode, userLat, userLng, debouncedLocation, currentPage, searchQuery]);

  const isUsingCurrentLocation = locationMode === 'current';
  const {data: searchResponse, isLoading} = useSearchRestaurants(
    searchParams,
    isUsingCurrentLocation ? !loadingGeo : true
  );

  // Map backend returned unified results
  const apiRestaurants: BukaRestaurant[] = useMemo(() => {
    let rawList: any[] = [];
    if (
      searchResponse &&
      (searchResponse as any).data &&
      Array.isArray((searchResponse as any).data)
    ) {
      rawList = (searchResponse as any).data;
    } else if (
      searchResponse &&
      (searchResponse as any).data?.data &&
      Array.isArray((searchResponse as any).data.data)
    ) {
      rawList = (searchResponse as any).data.data;
    } else if (Array.isArray(searchResponse)) {
      rawList = searchResponse;
    }

    return rawList.map(mapToBukaRestaurant);
  }, [searchResponse]);

  // Filters — no default cuisine
  const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    rating: null,
    foodQuality: null,
    cuisines: [],
  });

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(e.target as Node)
      ) {
        setIsLocationFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Client-side filtering
  const filteredRestaurants = useMemo(() => {
    return apiRestaurants.filter((r) => {
      if (filters.rating && r.rating < filters.rating) return false;
      if (filters.foodQuality && r.foodQuality < filters.foodQuality)
        return false;
      if (filters.cuisines.length > 0) {
        const hasCuisine = r.tags.some((tag) =>
          filters.cuisines.some((f) =>
            tag.toLowerCase().includes(f.toLowerCase().replace(' cuisine', '')),
          ),
        );
        if (!hasCuisine) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const nameMatch = r.name.toLowerCase().includes(q);
        const addressMatch = r.address.toLowerCase().includes(q);
        if (!nameMatch && !addressMatch) return false;
      }
      return true;
    });
  }, [filters, searchQuery, apiRestaurants]);

  const totalPages =
    (searchResponse as any)?.totalPages ||
    (searchResponse as any)?.data?.totalPages ||
    1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({top: 200, behavior: 'smooth'});
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleUseCurrentLocation = useCallback(() => {
    setLocationMode('current');
    setLocationInput('');
    setDebouncedLocation('');
    setIsLocationFocused(false);
    setCurrentPage(1);
  }, []);

  const handleLocationInputChange = useCallback((value: string) => {
    setLocationInput(value);
    if (value.trim()) {
      setLocationMode('custom');
    }
  }, []);

  const handleClearLocation = useCallback(() => {
    setLocationInput('');
    setDebouncedLocation('');
    setLocationMode('current');
    setCurrentPage(1);
  }, []);

  return (
    <>
      {/* ─── Mobile View (< md) ─── */}
      <div className='block md:hidden'>
        <MobileExploreRestaurants
          restaurants={apiRestaurants}
          isLoading={isLoading}
          selectedLocation={locationMode === 'current' ? 'Current Location' : locationInput}
          onLocationChange={(loc) => {
            if (loc === 'Current Location') {
              handleUseCurrentLocation();
            } else {
              setLocationMode('custom');
              setLocationInput(loc);
              setDebouncedLocation(loc);
              setCurrentPage(1);
            }
          }}
        />
      </div>

      {/* ─── Desktop View (≥ md) ─── */}
      <div className='hidden md:block w-full min-h-screen bg-[#1a1a1a]'>
        <div className='max-w-[1440px] mx-auto'>
          {/* ── Compact Header ── */}
          <div className='w-[92%] mx-auto pt-8 pb-4 flex items-center gap-4'>
            <button
              onClick={() => router.back()}
              className='w-10 h-10 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0'
              aria-label='Go back'>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className='text-white text-2xl font-bold'>
                Explore Restaurants
              </h1>
              <p className='text-zinc-400 text-sm mt-0.5'>
                Discover the best bukas and restaurants near you
              </p>
            </div>
          </div>

          {/* ── Location & Search Bar ── */}
          <div className='w-[92%] mx-auto py-4'>
            <div className='flex items-center justify-between'>
              {/* Location input with typeahead */}
              <div className='relative' ref={locationRef}>
                <div className='flex items-center gap-2 h-12 px-4 bg-white rounded-xl min-w-[280px]'>
                  <MapPin size={16} className='text-[#1a1a1a] shrink-0' />
                  <input
                    ref={locationInputRef}
                    type='text'
                    value={locationMode === 'current' && !isLocationFocused ? '' : locationInput}
                    onChange={(e) => handleLocationInputChange(e.target.value)}
                    onFocus={() => setIsLocationFocused(true)}
                    placeholder={locationMode === 'current' ? '📍 Current Location' : 'Type a city or area...'}
                    className='flex-1 bg-transparent text-[#1a1a1a] text-sm outline-none placeholder:text-zinc-500'
                  />
                  {locationMode === 'custom' && locationInput && (
                    <button
                      onClick={handleClearLocation}
                      className='shrink-0 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer'>
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Dropdown hint when focused */}
                {isLocationFocused && (
                  <div className='absolute top-14 left-0 w-full bg-white rounded-xl shadow-lg border border-zinc-200 py-1 z-50'>
                    {/* Use Current Location option */}
                    <button
                      onClick={handleUseCurrentLocation}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center gap-2 ${
                        locationMode === 'current'
                          ? 'bg-[#fbbe15]/10 text-[#1a1a1a] font-medium'
                          : 'text-zinc-700 hover:bg-zinc-100'
                      }`}>
                      <LocateFixed size={14} className='text-[#fbbe15] shrink-0' />
                      Use Current Location
                    </button>
                    <div className='border-t border-zinc-100 my-1' />
                    <p className='px-4 py-1.5 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold'>
                      Or type any city / area above
                    </p>
                  </div>
                )}
              </div>

              {/* Search area */}
              <div className='flex items-center gap-3'>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isSearchOpen ? 'w-[300px] opacity-100' : 'w-0 opacity-0'
                  }`}>
                  <input
                    ref={searchInputRef}
                    type='text'
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder='Search restaurants...'
                    className='w-full h-12 px-4 bg-[#2a2a2a] border border-zinc-700 rounded-xl text-white text-sm outline-none focus:border-[#fbbe15] transition-colors placeholder:text-zinc-500'
                  />
                </div>

                <button
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    if (isSearchOpen) setSearchQuery('');
                  }}
                  className='w-12 h-12 flex items-center justify-center bg-[#fbbe15] rounded-xl hover:bg-[#e5ac10] transition-colors shrink-0 cursor-pointer'>
                  <Search size={18} className='text-[#1a1a1a]' />
                </button>
              </div>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className='w-[92%] mx-auto pb-16 flex gap-8'>
            {/* Sidebar */}
            <aside className='w-[220px] shrink-0'>
              <CuisineFilters onFilterChange={handleFilterChange} />
            </aside>

            {/* Restaurant Grid */}
            <div className='flex-1 flex flex-col'>
              {/* Results Header */}
              <div className='mb-4 md:mb-6'>
                <p className='text-zinc-400 text-sm'>
                  Found{' '}
                  <span className='text-[#fbbe15] font-semibold'>
                    {filteredRestaurants.length}
                  </span>{' '}
                  restaurants in{' '}
                  <span className='text-[#fbbe15] font-semibold'>
                    {locationDisplayLabel}
                  </span>
                </p>
              </div>

              {/* Cards Grid */}
              {isLoading ? (
                <div className='flex items-center justify-center py-20'>
                  <CgSpinner className='animate-spin text-[#fbbe15] text-4xl' />
                </div>
              ) : (
                <div className='grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5'>
                  {filteredRestaurants.map((restaurant) => (
                    <div key={restaurant.id}>
                      <BukaCard restaurant={restaurant} />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && filteredRestaurants.length === 0 && (
                <div className='flex items-center justify-center py-20'>
                  <p className='text-zinc-500 text-sm'>
                    No restaurants found. Try adjusting your filters or
                    location.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {filteredRestaurants.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
