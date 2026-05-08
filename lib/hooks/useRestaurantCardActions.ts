'use client';

import {useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {
  useImportGoogleRestaurant,
  useRemoveSavedRestaurant,
  useSaveRestaurant,
  useSavedRestaurants,
} from '@/lib/api';
import {useRequireAuth} from '@/hooks/useRequireAuth';
import {useAuth} from '@/context/AuthContext';
import type {BukaRestaurant} from '@/components/buka/BukaCard';

/**
 * Shared hook for restaurant card actions: navigate to detail, toggle wishlist.
 * Used by both desktop BukaCard and mobile card variants.
 */
export function useRestaurantCardActions(restaurant: BukaRestaurant) {
  const router = useRouter();
  const {requireAuth} = useRequireAuth();
  const {isAuthenticated} = useAuth();
  const {mutateAsync: importRestaurant} = useImportGoogleRestaurant();
  const {mutateAsync: saveToWishlist} = useSaveRestaurant();
  const {mutateAsync: removeFromWishlist} = useRemoveSavedRestaurant();
  const {data: savedData} = useSavedRestaurants();

  const [isNavigating, setIsNavigating] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const isWishlisted = useMemo(() => {
    if (!isAuthenticated || !savedData) return false;
    const responseData = (savedData as any)?.data;
    const items = Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(responseData)
        ? responseData
        : [];
    if (items.length === 0) return false;
    const dbId = restaurant.rawRestaurant?.id;
    const gId = restaurant.rawRestaurant?.googlePlaceId;
    const rId = restaurant.id;
    return items.some((item: any) => {
      const r = item.restaurant || item;
      return (
        (dbId && r.id === dbId) ||
        (gId && r.googlePlaceId === gId) ||
        r.id === rId ||
        r.googlePlaceId === rId
      );
    });
  }, [isAuthenticated, savedData, restaurant]);

  const navigate = async () => {
    if (restaurant.rawRestaurant?.id) {
      router.push(`/buka/restaurant/${restaurant.rawRestaurant.id}`);
      return;
    }
    const placeId = restaurant.rawRestaurant?.googlePlaceId;
    if (placeId) {
      setIsNavigating(true);
      try {
        const res = await importRestaurant(placeId);
        const newId =
          (res as any)?.data?.data?.id || (res as any)?.data?.id || null;
        if (newId) router.push(`/buka/restaurant/${newId}`);
      } finally {
        setIsNavigating(false);
      }
    } else {
      router.push(`/buka/restaurant/${restaurant.id}`);
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuth(async () => {
      setIsWishlistLoading(true);
      try {
        let dbId = restaurant.rawRestaurant?.id;

        if (isWishlisted && dbId) {
          await removeFromWishlist(dbId);
          return;
        }

        if (!dbId && restaurant.rawRestaurant?.googlePlaceId) {
          const res = await importRestaurant(
            restaurant.rawRestaurant.googlePlaceId,
          );
          dbId = (res as any)?.data?.data?.id || (res as any)?.data?.id || null;
        }
        if (dbId) await saveToWishlist(dbId);
      } finally {
        setIsWishlistLoading(false);
      }
    });
  };

  return {
    navigate,
    toggleWishlist,
    isWishlisted,
    isNavigating,
    isWishlistLoading,
  };
}
