'use client';

import {useState, useMemo} from 'react';
import {useRouter} from 'next/navigation';
import {Bookmark, MapPin, UtensilsCrossed, Star, X} from 'lucide-react';
import {CgSpinner} from 'react-icons/cg';
import Image from 'next/image';
import {Restaurant} from '@/lib/api/services/restaurants.service';
import {
  useImportGoogleRestaurant,
  useSaveRestaurant,
  useSavedRestaurants,
  useRemoveSavedRestaurant,
} from '@/lib/api';
import {useRequireAuth} from '@/hooks/useRequireAuth';
import {useAuth} from '@/context/AuthContext';
import {RESTAURANT_PLACEHOLDER_IMG} from '@/lib/constants';
import {isRestaurantOpen} from '@/lib/utils/opening-hours';

export interface BukaRestaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  address: string;
  tags: string[];
  hygiene: number;
  affordability: number;
  foodQuality: number;
  /** The full API restaurant object — used to POST fallback items to the DB */
  rawRestaurant?: Restaurant;
}

interface BukaCardProps {
  restaurant: BukaRestaurant;
}

/**
 * Get the googlePlaceId from a raw restaurant for importing.
 */
function getGooglePlaceId(raw: Restaurant): string | null {
  return raw.googlePlaceId || null;
}

/**
 * Extract the restaurant ID from the create response, handling nested response shapes.
 */
function extractNewId(response: any): string | null {
  const resData = response?.data as any;
  return resData?.data?.id || resData?.id || null;
}

/**
 * Return a user-facing error message based on the HTTP status code.
 */
function getErrorMessage(err: any, context: 'save' | 'wishlist'): string {
  const status = err?.response?.status || err?.status;
  if (status === 401 || status === 403) {
    return 'Please sign in to your account to continue.';
  }
  if (context === 'wishlist') {
    return 'Unable to save to your wishlist right now. Please try again later.';
  }
  return 'Unable to load this restaurant right now. Please try again later.';
}

export function BukaCard({restaurant}: BukaCardProps) {
  const router = useRouter();
  const {requireAuth} = useRequireAuth();
  const {isAuthenticated} = useAuth();
  const {mutateAsync: importRestaurant} = useImportGoogleRestaurant();
  const {mutateAsync: saveToWishlist} = useSaveRestaurant();
  const {mutateAsync: removeFromWishlist} = useRemoveSavedRestaurant();
  const {data: savedData} = useSavedRestaurants();

  const [isSaving, setIsSaving] = useState(false);
  const [isSavingWishlist, setIsSavingWishlist] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Derive wishlist status from API data
  const isWishlisted = useMemo(() => {
    if (!isAuthenticated || !savedData) return false;

    // The API structure is { data: { data: [ { restaurant: ... }, ... ] } }
    const responseData = (savedData as any)?.data;
    const items = Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(responseData)
        ? responseData
        : [];

    if (items.length === 0) return false;

    // Check by DB ID or Google Place ID or the UI model ID
    const dbId = restaurant.rawRestaurant?.id;
    const gId = restaurant.rawRestaurant?.googlePlaceId;
    const rId = restaurant.id;

    return items.some((item: any) => {
      const r = item.restaurant || item; // Handle both direct array and nested restaurant object
      return (
        (dbId && r.id === dbId) ||
        (gId && r.googlePlaceId === gId) ||
        r.id === rId ||
        r.googlePlaceId === rId
      );
    });
  }, [isAuthenticated, savedData, restaurant.id, restaurant.rawRestaurant]);

  const hasDbId = !!restaurant.rawRestaurant?.id;

  // ── Navigate to restaurant details ──
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMessage(null);

    if (hasDbId) {
      router.push(`/buka/restaurant/${restaurant.rawRestaurant!.id}`);
      return;
    }

    const placeId = restaurant.rawRestaurant
      ? getGooglePlaceId(restaurant.rawRestaurant)
      : null;
    if (placeId) {
      setIsSaving(true);
      try {
        const response = await importRestaurant(placeId);
        const newId = extractNewId(response);
        if (newId) {
          router.push(`/buka/restaurant/${newId}`);
        }
      } catch (err: any) {
        setErrorMessage(getErrorMessage(err, 'save'));
      } finally {
        setIsSaving(false);
      }
    } else {
      router.push(`/buka/restaurant/${restaurant.id}`);
    }
  };

  // ── Save/Remove from wishlist ──
  const doWishlistSave = async () => {
    setErrorMessage(null);
    setIsSavingWishlist(true);

    try {
      let dbId = restaurant.rawRestaurant?.id;
      const responseData = (savedData as any)?.data;
      const items = Array.isArray(responseData?.data)
        ? responseData.data
        : Array.isArray(responseData)
          ? responseData
          : [];

      // Find the existing ID from saved list if possible (important for removal)
      if (!dbId && isWishlisted && items.length > 0) {
        const gId = restaurant.rawRestaurant?.googlePlaceId;
        const rId = restaurant.id;
        const existing = items.find((item: any) => {
          const r = item.restaurant || item;
          return (
            (gId && r.googlePlaceId === gId) ||
            r.id === rId ||
            r.googlePlaceId === rId
          );
        });
        dbId = existing?.restaurantId || existing?.id;
      }

      // If we are removing
      if (isWishlisted && dbId) {
        await removeFromWishlist(dbId);
        return;
      }

      // If Google fallback and we need to save, import it first
      if (!dbId && restaurant.rawRestaurant) {
        const placeId = getGooglePlaceId(restaurant.rawRestaurant);
        if (placeId) {
          const importResp = await importRestaurant(placeId);
          dbId = extractNewId(importResp);
        }
      }

      if (!dbId) {
        setErrorMessage(
          'Unable to save to your wishlist right now. Please try again later.',
        );
        return;
      }

      await saveToWishlist(dbId);
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err, 'wishlist'));
    } finally {
      setIsSavingWishlist(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requireAuth(() => doWishlistSave());
  };

  const isOpen = isRestaurantOpen(
    restaurant.rawRestaurant?.openingHours ?? null,
  );

  return (
    <div
      className='flex flex-col w-full min-w-0 bg-[#151515] rounded-2xl p-3 pb-4 cursor-pointer relative'
      onClick={handleClick}>
      {/* Saving Overlay */}
      {isSaving && (
        <div className='absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-2xl z-10 flex items-center justify-center'>
          <div className='flex flex-col items-center gap-2'>
            <CgSpinner className='animate-spin text-[#fbbe15] text-2xl' />
            <span className='text-white text-xs font-medium'>Loading...</span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className='absolute inset-x-0 top-0 z-20 m-3'>
          <div className='bg-red-950/90 backdrop-blur-sm border border-red-800/50 text-white text-xs rounded-xl px-3 py-2.5 flex items-start gap-2 shadow-lg'>
            <span className='flex-1 leading-relaxed'>{errorMessage}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setErrorMessage(null);
              }}
              className='shrink-0 mt-0.5 text-white/60 hover:text-white transition-colors'>
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Image */}
      <div className='relative w-full aspect-4/3 rounded-xl overflow-hidden group'>
        {!restaurant.image ||
        restaurant.image === RESTAURANT_PLACEHOLDER_IMG ? (
          <div className='w-full h-full bg-zinc-800 flex items-center justify-center'>
            <UtensilsCrossed size={48} className='text-zinc-600' />
          </div>
        ) : (
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, 33vw'
          />
        )}
        {/* Wishlist Bookmark */}
        <button
          onClick={handleWishlist}
          disabled={isSavingWishlist}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md transition-all ${
            isWishlisted
              ? 'bg-[#fbbe15]/20 text-[#fbbe15] border border-[#fbbe15]/40 shadow-[0_0_10px_rgba(251,190,21,0.2)]'
              : 'bg-black/40 text-white hover:bg-black/60 border border-transparent'
          }`}>
          {isSavingWishlist ? (
            <CgSpinner className='animate-spin text-sm' />
          ) : (
            <Bookmark
              size={16}
              className={isWishlisted ? 'fill-[#fbbe15]' : ''}
            />
          )}
        </button>

        {/* Open/Closed badge — only shown when open */}
        {isOpen && (
          <div className='absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 pointer-events-none'>
            <span className='w-2 h-2 rounded-full bg-green-500 shrink-0' />
            <span className='text-green-400 text-[10px] font-semibold leading-none'>
              Open
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className='flex flex-col gap-2 mt-3'>
        {/* Name & Rating */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1.5 min-w-0'>
            <UtensilsCrossed size={14} className='text-white shrink-0' />
            <span className='text-white text-sm font-bold truncate'>
              {restaurant.name}
            </span>
          </div>
          <div className='flex items-center gap-1 shrink-0 ml-2'>
            <Star size={12} className='text-green-500 fill-green-500' />
            <span className='text-green-500 text-xs font-medium'>
              {restaurant.rating}
            </span>
            <span className='text-zinc-500 text-xs'>
              ({restaurant.reviewCount} Reviews)
            </span>
          </div>
        </div>

        {/* Address */}
        <div className='flex items-start gap-1.5'>
          <MapPin size={12} className='text-zinc-400 shrink-0 mt-0.5' />
          <span className='text-zinc-400 text-xs leading-tight'>
            {restaurant.address}
          </span>
        </div>

        {/* Tags */}
        <div className='flex flex-wrap gap-2 mt-1'>
          {restaurant.tags.map((tag) => (
            <span
              key={tag}
              className='px-3 py-1 text-[10px] font-medium rounded-full bg-[#FEEBB6] text-[#695009]'>
              {tag}
            </span>
          ))}
        </div>

        {/* Scores */}
        <div className='flex items-center gap-4 mt-1'>
          <div className='flex items-center gap-1'>
            <span className='text-primary text-xs font-bold'>
              {restaurant.hygiene.toFixed(1)}
            </span>
            <span className='text-zinc-500 text-[10px]'>Hygiene</span>
          </div>
          <div className='flex items-center gap-1'>
            <span className='text-primary text-xs font-bold'>
              {restaurant.affordability.toFixed(1)}
            </span>
            <span className='text-zinc-500 text-[10px]'>Affordability</span>
          </div>
          <div className='flex items-center gap-1'>
            <span className='text-primary text-xs font-bold'>
              {restaurant.foodQuality.toFixed(1)}
            </span>
            <span className='text-zinc-500 text-[10px]'>Food Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
}
