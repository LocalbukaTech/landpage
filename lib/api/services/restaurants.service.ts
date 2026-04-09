import { api } from '../client';
import { PaginatedResponse, ApiResponse } from '../types';

export interface Restaurant {
  id: string | null;
  googlePlaceId: string | null;
  name: string;
  description: string | null;
  address: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  website: string | null;
  cuisine: string;
  priceLevel: number | null;
  photos: string[] | null;
  openingHours: Record<string, string> | null;
  source: string;
  isClaimedByOwner: boolean;
  googleRating: number | null;
  avgRating: number;
  reviewCount: number;
  ownerId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  rating: number;
  text: string;
  hygieneRating: number;
  affordabilityRating: number;
  foodQualityRating: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
}

export interface GoogleReview {
  author_name: string;
  author_url: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
}

export const restaurantsService = {
  // Get all restaurants
  getRestaurants: (params?: { page?: number; pageSize?: number; city?: string }) => {
    return api.get<ApiResponse<PaginatedResponse<Restaurant>>>('/restaurants', { params });
  },

  // Get trending restaurants
  getTrendingRestaurants: () => {
    return api.get<ApiResponse<Restaurant[]>>('/restaurants/trending');
  },

  // Search restaurants
  searchRestaurants: (params: { lat: number; lng: number; page?: number; pageSize?: number }) => {
    return api.get<ApiResponse<PaginatedResponse<Restaurant>>>('/restaurants/search', { params });
  },

  // Get restaurants by cuisine
  getRestaurantsByCuisine: (cuisine: string, params?: { page?: number; pageSize?: number; city?: string }) => {
    return api.get<ApiResponse<Restaurant[]>>(`/restaurants/cuisine/${cuisine}`, { params });
  },

  // Get restaurant by id
  getRestaurantById: (id: string) => {
    return api.get<ApiResponse<Restaurant>>(`/restaurants/${id}`);
  },

  // Save a restaurant to favorites
  saveRestaurant: (id: string) => {
    return api.post<ApiResponse<any>>(`/restaurants/${id}/save`);
  },

  // Remove a restaurant from favorites
  removeSavedRestaurant: (id: string) => {
    return api.delete<ApiResponse<any>>(`/restaurants/${id}/save`);
  },

  // Get current user saved restaurants
  getSavedRestaurants: () => {
    return api.get<ApiResponse<Restaurant[]>>(`/restaurants/saved`);
  },

  // Add a review for a restaurant
  addReview: (id: string, data: any) => {
    return api.post<ApiResponse<Review>>(`/restaurants/${id}/reviews`, data);
  },

  // Get LocalBuka reviews for a restaurant
  getReviews: (id: string) => {
    return api.get<ApiResponse<Review[]>>(`/restaurants/${id}/reviews`);
  },

  // Get Google reviews for a restaurant
  getGoogleReviews: (id: string) => {
    return api.get<ApiResponse<GoogleReview[]>>(`/restaurants/${id}/reviews/google`);
  },

  // Delete a review
  deleteReview: (id: string, reviewId: string) => {
    return api.delete<ApiResponse<any>>(`/restaurants/${id}/reviews/${reviewId}`);
  },

  // Import a Google restaurant into our DB by placeId
  importGoogleRestaurant: (placeId: string) => {
    return api.post<ApiResponse<Restaurant>>(`/restaurants/google/${placeId}/import`);
  },

  // Create a new restaurant
  createRestaurant: (data: FormData) => {
    return api.post<ApiResponse<Restaurant>>('/restaurants', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Update an existing restaurant
  updateRestaurant: (id: string, data: FormData) => {
    return api.patch<ApiResponse<Restaurant>>(`/restaurants/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Delete a restaurant
  deleteRestaurant: (id: string) => {
    return api.delete<ApiResponse<any>>(`/restaurants/${id}`);
  },

  // Get current user's own restaurants
  getMyRestaurants: () => {
    return api.get<ApiResponse<Restaurant[]>>('/restaurants/me');
  },
};
