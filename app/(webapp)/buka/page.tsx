'use client';

import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BukaCategory } from '@/components/buka/BukaCategory';
import { BukaRestaurant } from '@/components/buka/BukaCard';
import { CuisineSection } from '@/components/buka/CuisineSection';
import { Images } from '@/public/images';
import { MobileBukaHome } from '@/components/buka/mobile/MobileBukaHome';

import { useEffect, useMemo, useState } from 'react';
import {
  useSearchRestaurants,
  useTrendingRestaurants,
} from '@/lib/api';
import { Restaurant } from '@/lib/api/services/restaurants.service';
import { CgSpinner } from 'react-icons/cg';
import Link from 'next/link';
import Image from 'next/image';
import { useGeolocation } from '@/hooks/useGeolocation';
import { RESTAURANT_PLACEHOLDER_IMG } from '@/lib/constants';
import { helper } from '@/utils/helper';

// Sort BukaRestaurant arrays: DB items first, then Google, each group by latest updatedAt

// Helper to map API restaurant to BukaRestaurant UI interface
const mapToBukaRestaurant = (res: Restaurant): BukaRestaurant => ({
  id: res.id || res.googlePlaceId || Math.random().toString(),
  name: res.name || 'Unknown Restaurant',
  image:
    res.photos && res.photos.length > 0
      ? res.photos[0]
      : RESTAURANT_PLACEHOLDER_IMG,
  rating: res.avgRating || res.googleRating || 0,
  reviewCount: res.reviewCount || 0,
  address: res.address || 'No address provided',
  tags: [res.cuisine, res.source === 'google' ? 'Google' : 'Local'].filter(
    Boolean,
  ) as string[],
  hygiene: 5.0,
  affordability: 5.0,
  foodQuality: 5.0,
  rawRestaurant: res,
});

// Cuisine Data
const cuisines = [
  { name: 'Nigeria Cuisine', image: Images.image1 },
  { name: 'Yoruba Cuisine', image: Images.image2 },
  { name: 'Igbo Cuisine', image: Images.image3 },
  {
    name: 'Hausa Cuisine',
    image:
      'https://images.unsplash.com/photo-1567982047351-76b6f93e38ee?w=600&q=80',
  },
  {
    name: 'Calabar Cuisine',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  },
  {
    name: 'Edo Cuisine',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
  },
];

export default function BukaPage() {
  const router = useRouter();
  const { lat, lng, loading: loadingGeo } = useGeolocation();
  const [heroBgUrl, setHeroBgUrl] = useState("url('/images/buka.gif')");

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroBgUrl("url('/images/buka_hero.png')");
    }, 3000); // Adjust this value to match your GIF duration
    return () => clearTimeout(timer);
  }, []);

  // Fetch unified restaurants for user location
  const { data: searchResponse, isLoading: isLoadingSearch } =
    useSearchRestaurants(
      {
        lat: lat || 6.5244,
        lng: lng || 3.3792,
        page: 1,
        pageSize: 30,
      },
      !loadingGeo,
    );

  const { data: trendingData, isLoading: isLoadingTrending } =
    useTrendingRestaurants(
      {
        lat: lat || 6.5244,
        lng: lng || 3.3792,
        radius: 50000,
        page: 1,
        pageSize: 20,
      },
      !loadingGeo,
    );

  const trendingUiRestaurants = useMemo(() => {
    const rawData = trendingData as unknown as
      | { data?: Restaurant[] }
      | Restaurant[];
    const arrayData = Array.isArray(rawData) ? rawData : rawData?.data;
    const mapped = Array.isArray(arrayData)
      ? arrayData.map(mapToBukaRestaurant)
      : [];
    return helper.sortDbFirstThenByDate(mapped);
  }, [trendingData]);

  // Combine into a unified list
  const combinedAll = useMemo(() => {
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

  // 1. Determine topRestaurants (prefer trending, fallback to location-based combinedAll)
  const topRestaurants = useMemo(() => {
    if (trendingUiRestaurants.length > 0) {
      return trendingUiRestaurants.slice(0, 5);
    }
    return combinedAll.slice(0, 5);
  }, [trendingUiRestaurants, combinedAll]);

  // To prevent duplicates across sections, determine which items in combinedAll (location-based) are not already used in topRestaurants.
  const remainingLocal = useMemo(() => {
    const usedIds = new Set(topRestaurants.map((r) => r.id));
    return combinedAll.filter((r) => !usedIds.has(r.id));
  }, [combinedAll, topRestaurants]);

  // 2. Allocate the remaining local restaurants to avoid overlap
  const topBukas = useMemo(() => {
    return remainingLocal.slice(0, 5);
  }, [remainingLocal]);

  const hiddenGems = useMemo(() => {
    return remainingLocal.slice(5, 11);
  }, [remainingLocal]);

  const streetFavorites = useMemo(() => {
    return remainingLocal.slice(11, 17);
  }, [remainingLocal]);

  const isLoading = isLoadingTrending || isLoadingSearch;

  return (
    <>
      {/* ─── Mobile View (< md) ─── */}
      <div className='block md:hidden'>
        <MobileBukaHome
          isLoading={isLoading}
          topRestaurants={topRestaurants}
          topBukas={topBukas}
          hiddenGems={hiddenGems}
          streetFavorites={streetFavorites}
          cuisines={cuisines}
        />
      </div>

      {/* ─── Desktop View (≥ md) ─── */}
      <div className='hidden md:block w-full min-h-screen bg-[#1a1a1a]'>
        <div className='max-w-[1440px] mx-auto'>
          {/* Hero Section */}
          <section className='relative w-full overflow-hidden h-[60vh] md:h-[90vh]'>
            <div
              className='absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000'
              style={{ backgroundImage: heroBgUrl }}
            />
            <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent' />

            <button
              onClick={() => router.push('/feeds')}
              className='absolute top-4 left-4 md:top-8 md:left-8 z-10 flex items-center justify-center w-10 h-10 rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors bg-transparent cursor-pointer'
              aria-label='Go back'>
              <ArrowLeft size={20} />
            </button>

            <Image
              src='/images/buka-hero-overlay.png'
              alt=''
              fill
              className='absolute bottom-0 left-0 z-5 pointer-events-none object-contain object-bottom-left'
            />

            <div className='absolute bottom-6 left-4 right-4 md:bottom-16 md:left-8 md:right-auto md:max-w-md z-10 flex flex-col gap-4 md:gap-5'>
              <h1 className='text-white text-2xl md:text-[32px] font-bold leading-tight'>
                Wetin You Wan Chop?!
              </h1>
              <p className='text-white/80 text-sm md:text-base leading-relaxed'>
                From mama-put joints to city-class bukas,
                <br />
                your next plate is right here.
              </p>
              <div className='flex flex-row gap-3 md:gap-4 w-full'>
                <Link
                  href='/buka/restaurant'
                  className='flex-1 md:flex-none md:w-fit text-center px-6 md:px-10 py-3 md:py-3.5 bg-[#fbbe15] text-[#1a1a1a] text-sm font-semibold rounded-lg hover:bg-[#e5ac10] transition-colors cursor-pointer border-none'>
                  Explore Restaurants
                </Link>
                <Link
                  href='/buka/list-resturant'
                  className='flex-1 md:flex-none md:w-fit text-center px-6 md:px-10 py-3 md:py-3.5 bg-[#fbbe15] text-[#1a1a1a] text-sm font-semibold rounded-lg hover:bg-[#e5ac10] transition-colors cursor-pointer border-none'>
                  List Resturant
                </Link>
              </div>
            </div>
            {/* Animated Scroll Down Indicator for Desktop */}
            <div
              onClick={() => {
                const categoriesElement = document.getElementById('buka-categories');
                if (categoriesElement) {
                  categoriesElement.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({
                    top: window.innerHeight * 0.9,
                    behavior: 'smooth',
                  });
                }
              }}
              className='absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex min-[1441px]:hidden flex-col items-center gap-1 z-10 cursor-pointer text-white/70 hover:text-[#fbbe15] transition-colors group animate-bounce'
            >
              <span className='text-[10px] font-bold tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity'>Scroll Down</span>
              <ChevronDown size={20} className='text-white/60 group-hover:text-[#fbbe15] transition-colors' />
            </div>
          </section>

          {/* Categories Sections */}
          <div id='buka-categories' className='flex flex-col gap-8 md:gap-16 px-4 py-8 md:px-8 md:py-16'>
            {isLoading ? (
              <div className='flex items-center justify-center p-20'>
                <CgSpinner className='animate-spin text-[#fbbe15] text-4xl' />
              </div>
            ) : (
              <>
                {topRestaurants.length > 0 && (
                  <BukaCategory
                    title='Trending Restaurant'
                    restaurants={topRestaurants}
                  />
                )}
                {topBukas.length > 0 && (
                  <BukaCategory title="Top 5 Buka's" restaurants={topBukas} />
                )}
                {hiddenGems.length > 0 && (
                  <BukaCategory title="Hidden Gem's" restaurants={hiddenGems} />
                )}
              </>
            )}
          </div>

          {/* By Cuisine Section */}
          <div className='px-4 pb-8 md:px-8 md:pb-16'>
            <CuisineSection cuisines={cuisines} />
          </div>

          {/* Banner Image */}
          <div className='px-4 pb-8 md:px-8 md:pb-16'>
            <div className='w-[92%] mx-auto rounded-2xl overflow-hidden'>
              <Image
                src='/images/buka_middle_Image.png'
                alt='LocalBuka'
                width={1400}
                height={500}
                className='w-full h-auto object-cover'
              />
            </div>
          </div>

          {/* Street Favorites Section */}
          <div className='px-4 pb-8 md:px-8 md:pb-16'>
            {!isLoading && streetFavorites.length > 0 && (
              <BukaCategory
                title='Street Favorites'
                restaurants={streetFavorites}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
