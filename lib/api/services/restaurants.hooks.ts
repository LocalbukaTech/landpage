import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantsService } from './restaurants.service';
import { queryKeys } from '../types';

export const useRestaurants = (params?: { page?: number; pageSize?: number; city?: string }) => {
  return useQuery({
    queryKey: [...queryKeys.restaurants.list(params)],
    queryFn: async () => {
      const response = await restaurantsService.getRestaurants(params);
      return response.data;
    },
  });
};

export const useTrendingRestaurants = () => {
  return useQuery({
    queryKey: [...queryKeys.restaurants.trending()],
    queryFn: async () => {
      const response = await restaurantsService.getTrendingRestaurants();
      return response.data;
    },
  });
};

export const useSearchRestaurants = (params: { lat: number; lng: number; page?: number; pageSize?: number }, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.restaurants.search(params)],
    queryFn: async () => {
      const response = await restaurantsService.searchRestaurants(params);
      return response.data;
    },
    enabled: enabled && !!params.lat && !!params.lng,
  });
};

export const useRestaurantsByCuisine = (cuisine: string, params?: { page?: number; pageSize?: number; city?: string }) => {
  return useQuery({
    queryKey: [...queryKeys.restaurants.cuisine(cuisine, params)],
    queryFn: async () => {
      const response = await restaurantsService.getRestaurantsByCuisine(cuisine, params);
      return response.data;
    },
    enabled: !!cuisine,
  });
};

export const useRestaurant = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.restaurants.detail(id)],
    queryFn: async () => {
      const response = await restaurantsService.getRestaurantById(id);
      return response.data;
    },
    enabled: enabled && !!id,
  });
};

export const useSavedRestaurants = () => {
  return useQuery({
    queryKey: [...queryKeys.restaurants.saved()],
    queryFn: async () => {
      const response = await restaurantsService.getSavedRestaurants();
      return response.data;
    },
  });
};

export const useSaveRestaurant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restaurantsService.saveRestaurant(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.saved() });
      queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.detail(id) });
    },
  });
};

export const useRemoveSavedRestaurant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restaurantsService.removeSavedRestaurant(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.saved() });
      queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.detail(id) });
    },
  });
};

export const useReviews = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.restaurants.reviews(id)],
    queryFn: async () => {
      const response = await restaurantsService.getReviews(id);
      return response.data;
    },
    enabled: enabled && !!id,
  });
};

export const useGoogleReviews = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.restaurants.googleReviews(id)],
    queryFn: async () => {
      const response = await restaurantsService.getGoogleReviews(id);
      return response.data;
    },
    enabled: enabled && !!id,
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => restaurantsService.addReview(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.reviews(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.detail(id) });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewId }: { id: string; reviewId: string }) => restaurantsService.deleteReview(id, reviewId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.reviews(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.detail(id) });
    },
  });
};

export const useImportGoogleRestaurant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (placeId: string) =>
      restaurantsService.importGoogleRestaurant(placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.all });
    },
  });
};
