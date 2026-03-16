"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Bookmark,
  Share2,
  UtensilsCrossed,
  MoreVertical,
  ChevronRight,
  Route
} from "lucide-react";
import { BukaCard, BukaRestaurant } from "@/components/buka/BukaCard";
import dynamic from "next/dynamic";

const MapEmbed = dynamic(() => import("@/components/buka/MapEmbed").then(mod => mod.MapEmbed), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500">
      Loading Map...
    </div>
  ),
});

import { 
  useRestaurant, 
  useReviews, 
  useGoogleReviews, 
  useSavedRestaurants, 
  useSaveRestaurant, 
  useRemoveSavedRestaurant,
  useSearchRestaurants 
} from "@/lib/api";
import { Restaurant } from "@/lib/api/services/restaurants.service";
import { CgSpinner } from "react-icons/cg";
import { useRequireAuth } from "@/hooks/useRequireAuth";

// Mock Fallbacks
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80";
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80";

function mapToSimilarRestaurant(apiRest: any): BukaRestaurant {
  return {
    id: apiRest.id || apiRest.googlePlaceId || Math.random().toString(),
    name: apiRest.name,
    image:
      apiRest.photos && apiRest.photos.length > 0
        ? apiRest.photos[0]
        : PLACEHOLDER_IMG,
    rating: apiRest.avgRating || apiRest.googleRating || 0,
    reviewCount: apiRest.reviewCount || 0,
    address: apiRest.address || `${apiRest.city || ""}, ${apiRest.state || ""}`,
    tags: [
      apiRest.cuisine,
      apiRest.source === "google" ? "Google" : "Local",
    ].filter(Boolean),
    hygiene: 5.0,
    affordability: 5.0,
    foodQuality: 5.0,
    rawRestaurant: apiRest,
  };
}

/* ── Similar Restaurants (fetched by lat/lng) ── */

function SimilarRestaurants({ lat, lng, currentId }: { lat: number; lng: number; currentId: string }) {
  const { data: nearbyRes, isLoading } = useSearchRestaurants({
    lat,
    lng,
    page: 1,
    pageSize: 6,
  });

  const nearby: BukaRestaurant[] = (() => {
    let raw: any[] = [];
    if (nearbyRes && Array.isArray((nearbyRes as any).data)) {
      raw = (nearbyRes as any).data;
    } else if (Array.isArray(nearbyRes)) {
      raw = nearbyRes as any[];
    }
    return raw
      .filter((r: any) => {
        const rId = r.id || r.googlePlaceId;
        return rId !== currentId;
      })
      .slice(0, 3)
      .map(mapToSimilarRestaurant);
  })();

  if (isLoading) {
    return (
      <div className="pb-16 flex items-center justify-center py-10">
        <CgSpinner className="animate-spin text-[#fbbe15] text-2xl" />
      </div>
    );
  }

  if (nearby.length === 0) return null;

  return (
    <div className="pb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-bold">
          Similar Restaurants
        </h2>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-600 text-white hover:bg-white/10 transition-colors cursor-pointer">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {nearby.map((r) => (
          <BukaCard key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  );
}

/* ────────────────────── Page Component ────────────────────── */

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { data: rawRestaurant, isLoading: isLoadingRestaurant } = useRestaurant(id);
  const { data: localReviewsData, isLoading: isLoadingLocalReviews } = useReviews(id);
  const { data: googleReviewsData, isLoading: isLoadingGoogleReviews } = useGoogleReviews(id);

  const [fallbackRestaurant, setFallbackRestaurant] = useState<any>(null);

  useEffect(() => {
    // Attempt to load from localStorage if we don't have it in the DB
    const saved = localStorage.getItem(`buka_fallback_${id}`);
    if (saved) {
      try {
        setFallbackRestaurant(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse fallback restaurant", e);
      }
    }
  }, [id]);

  // Remap logic
  const restaurant = rawRestaurant || fallbackRestaurant;
  const localReviews = Array.isArray(localReviewsData) ? localReviewsData : (localReviewsData as any)?.data || [];
  const googleReviews = Array.isArray(googleReviewsData) ? googleReviewsData : (googleReviewsData as any)?.data || [];
  
  // Combine reviews for UI purposes
  const combinedReviews = [
    ...(Array.isArray(localReviews) ? localReviews : []).map(r => ({
      id: r.id,
      name:  r.user?.firstName ? `${r.user.firstName} ${r.user.lastName}` : "Anonymous",
      avatar: r.user?.profilePicture  || DEFAULT_AVATAR,
      rating: r.rating,
      date: new Date(r.createdAt).toLocaleDateString(),
      text: r.text,
      hygiene: r.hygieneRating || 5.0,
      affordability: r.affordabilityRating || 5.0,
      foodQuality: r.foodQualityRating || 5.0,
      images: r.images || [],
    })),
    ...(Array.isArray(googleReviews) ? googleReviews : []).map(r => ({
      id: `${r.time}-${r.author_name}`,
      name: r.user?.authorName || r.author_name,
      avatar: r.profile_photo_url || r.user?.authorPhoto || DEFAULT_AVATAR,
      rating: r.rating,
      date: r.relative_time_description || r.time,
      text: r.text,
      hygiene: 5.0, // Google Reviews do not have these specific ratings natively
      affordability: 5.0,
      foodQuality: 5.0,
      images: [],
    })),
  ];

  const photos = (restaurant?.photos && restaurant.photos.length > 0)
    ? restaurant.photos 
    : (restaurant?.image ? [restaurant.image] : [PLACEHOLDER_IMG]);

  const rating = restaurant?.avgRating || restaurant?.googleRating || restaurant?.rating || 0;
  const reviewCountStr = restaurant?.reviewCount || 0;
  const lat = restaurant?.lat || 6.5244;
  const lng = restaurant?.lng || 3.3792;
  const tags = restaurant?.tags ? restaurant.tags : [restaurant?.cuisine, restaurant?.source === 'google' ? 'Google' : 'Local'].filter(Boolean);

  const [activeTab, setActiveTab] = useState<"photos" | "reviews">("photos");
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % photos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [photos.length]);

  const goToHeroSlide = useCallback((index: number) => {
    setActiveHeroIndex(index);
  }, []);

  // Mutations for saved state
  const { data: savedRestaurantsRes } = useSavedRestaurants();
  const savedRestaurants = Array.isArray(savedRestaurantsRes) ? savedRestaurantsRes : (savedRestaurantsRes as any)?.data || [];
  const isSaved = savedRestaurants.some((r: any) => r.id === id);

  const saveMutation = useSaveRestaurant();
  const removeSaveMutation = useRemoveSavedRestaurant();
  const { requireAuth } = useRequireAuth();

  const handleToggleSave = () => {
    requireAuth(() => {
      if (isSaved) {
        removeSaveMutation.mutate(id);
      } else {
        saveMutation.mutate(id);
      }
    });
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showDirectionsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showDirectionsModal]);

  if (isLoadingRestaurant) {
    return (
      <div className="w-full min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <CgSpinner className="animate-spin text-[#fbbe15] text-4xl" />
      </div>
    );
  }

  if (!isLoadingRestaurant && !restaurant) {
    return (
      <div className="w-full min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center">
        <h2 className="text-white text-xl mb-4">Restaurant not found</h2>
        <button onClick={() => router.back()} className="text-[#fbbe15] hover:underline cursor-pointer">
          Go Back
        </button>
      </div>
    );
  }

  // Prevent accessing properties of null during loading if both are empty initially
  if (!restaurant) return null;

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a]">
      <div className="max-w-[1440px] mx-auto">
        {/* ── Hero Carousel ── */}
        <section className="relative w-full h-[500px] overflow-hidden rounded-b-2xl bg-zinc-900 border-b border-zinc-800">
          {photos.slice(0, 5).map((img: string, i: number) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === activeHeroIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={img}
                alt={`${restaurant?.name || 'Restaurant'} slide ${i + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {photos.slice(0, 5).map((_: string, i: number) => (
              <button
                key={i}
                onClick={() => goToHeroSlide(i)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  i === activeHeroIndex
                    ? "bg-[#fbbe15] w-6"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="absolute top-8 left-8 z-10 flex items-center justify-center w-10 h-10 rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors bg-black/20 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        </section>

        {/* ── Restaurant Info ── */}
        <div className="w-[92%] mx-auto">
          <div className="py-6 flex flex-col gap-3">
            {/* Name + Tags row */}
            <div className="flex items-center gap-3">
              <UtensilsCrossed size={18} className="text-white shrink-0" />
              <h1 className="text-white text-xl font-bold">{restaurant.name}</h1>
              <span className="w-4 h-4 rounded-full bg-green-500 shrink-0" />
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[10px] font-medium rounded-full bg-[#FEEBB6] text-[#695009]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Address + Actions */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                {/* Address */}
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-zinc-400 shrink-0" />
                  <span className="text-zinc-400 text-sm">{restaurant.address}</span>
                </div>
                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-[#fbbe15] fill-[#fbbe15]" />
                  <span className="text-white text-sm font-bold">{rating}</span>
                  <span className="text-zinc-500 text-sm">
                    ({reviewCountStr} Reviews)
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-6">
                <button className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-600 group-hover:border-zinc-400 transition-colors">
                    <Phone size={16} className="text-white" />
                  </div>
                  <span className="text-zinc-400 text-[10px]">Call</span>
                </button>
                <button 
                  onClick={handleToggleSave}
                  disabled={saveMutation.isPending || removeSaveMutation.isPending}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
                    isSaved ? 'border-[#fbbe15] bg-[#fbbe15]/10' : 'border-zinc-600 group-hover:border-zinc-400'
                  }`}>
                    <Bookmark size={16} className={isSaved ? "text-[#fbbe15] fill-[#fbbe15]" : "text-white"} />
                  </div>
                  <span className="text-zinc-400 text-[10px]">{isSaved ? "Saved" : "Save"}</span>
                </button>
                <button className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-600 group-hover:border-zinc-400 transition-colors">
                    <Share2 size={16} className="text-white" />
                  </div>
                  <span className="text-zinc-400 text-[10px]">Share</span>
                </button>
              </div>
            </div>

            {/* Scores */}
            <div className="flex items-center gap-6 mt-1">
              <div className="flex items-center gap-1">
                <span className="text-[#fbbe15] text-sm font-bold">
                  {5.0.toFixed(1)}
                </span>
                <span className="text-zinc-500 text-xs">Hygiene</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#fbbe15] text-sm font-bold">
                  {5.0.toFixed(1)}
                </span>
                <span className="text-zinc-500 text-xs">Affordability</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#fbbe15] text-sm font-bold">
                  {5.0.toFixed(1)}
                </span>
                <span className="text-zinc-500 text-xs">Food Quality</span>
              </div>
            </div>
          </div>

          {/* ── Static Map Preview ── */}
          <div className="w-full h-[480px] rounded-2xl overflow-hidden bg-zinc-800 z-0 relative">
            <MapEmbed 
              destinationLat={lat} 
              destinationLng={lng} 
              address={restaurant?.address}
              showRoute={false}
            />
          </div>

          {/* Get Directions — opens fullscreen modal */}
          <div className="flex justify-center py-6">
            <button
              onClick={() => setShowDirectionsModal(true)}
              className="flex items-center gap-2 px-8 py-2.5 bg-[#fbbe15] text-[#1a1a1a] text-sm font-semibold rounded-lg hover:bg-[#e5ac10] transition-colors cursor-pointer"
            >
              <Route size={18} />
              Get Directions
            </button>
          </div>

          {/* ── Fullscreen Directions Modal ── */}
          {showDirectionsModal && (
            <div className="fixed inset-0 z-50 bg-black">
              {/* Close button */}
              <button
                onClick={() => setShowDirectionsModal(false)}
                className="absolute top-6 left-6 z-1001 flex items-center justify-center w-10 h-10 rounded-full bg-[#2E68E3] text-white hover:bg-[#2558c5] transition-colors cursor-pointer border-none shadow-lg"
                aria-label="Close directions"
              >
                <ArrowLeft size={20} />
              </button>

              {/* Restaurant name badge */}
              <div className="absolute top-6 left-20 z-1001 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-xl">
                <p className="text-sm font-semibold">{restaurant.name}</p>
                <p className="text-xs text-zinc-400">{restaurant.address}</p>
              </div>

              {/* Full screen map */}
              <div className="w-full h-full relative">
                <MapEmbed 
                  destinationLat={lat} 
                  destinationLng={lng} 
                  address={restaurant?.address}
                  showRoute={true}
                />
              </div>
            </div>
          )}

          {/* ── Photos / Reviews Tabs ── */}
          <div className="border-b border-zinc-700 flex">
            <button
              onClick={() => setActiveTab("photos")}
              className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "photos"
                  ? "text-white border-b-2 border-[#fbbe15]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "reviews"
                  ? "text-white border-b-2 border-[#fbbe15]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Reviews
            </button>
          </div>

          {/* ── Photos Grid ── */}
          {activeTab === "photos" && (
            <div className="py-8">
              <div className="grid grid-cols-5 gap-3">
                {photos.map((photo: string, i: number) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden"
                  >
                    <Image
                      src={photo}
                      alt={`Photo ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Reviews List ── */}
          {activeTab === "reviews" && (
            <div className="py-8 flex flex-col gap-6">
              {(isLoadingLocalReviews || isLoadingGoogleReviews) && (
                <div className="flex items-center justify-center p-10">
                  <CgSpinner className="animate-spin text-[#fbbe15] text-4xl" />
                </div>
              )}
              
              {!isLoadingLocalReviews && !isLoadingGoogleReviews && combinedReviews.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-[#222] rounded-2xl">
                  <p className="text-zinc-400">No reviews found for this restaurant.</p>
                </div>
              )}

              {combinedReviews.slice(0, visibleReviews).map((review) => (
                <div
                  key={review.id}
                  className="bg-[#222] rounded-2xl p-6 flex flex-col gap-3"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={review.avatar}
                        alt={review.name || "review_image"}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                        unoptimized={review.avatar.includes('googleusercontent')}
                      />
                      <div>
                        <p className="text-white text-sm font-semibold">
                          {review.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={
                                  i < review.rating
                                    ? "text-[#fbbe15] fill-[#fbbe15]"
                                    : "text-zinc-600"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-zinc-500 text-xs">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  {/* Review text */}
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {review.text}
                  </p>

                  {/* Scores */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      <span className="text-[#fbbe15] text-sm font-bold">
                        {review.hygiene.toFixed(1)}
                      </span>
                      <span className="text-zinc-500 text-xs">Hygiene</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#fbbe15] text-sm font-bold">
                        {review.affordability.toFixed(1)}
                      </span>
                      <span className="text-zinc-500 text-xs">Affordability</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#fbbe15] text-sm font-bold">
                        {review.foodQuality.toFixed(1)}
                      </span>
                      <span className="text-zinc-500 text-xs">Food Quality</span>
                    </div>
                  </div>

                  {/* Review images */}
                  {review.images.length > 0 && (
                    <div className="flex gap-2 mt-1">
                      {review.images.map((img: string, i: number) => (
                        <div
                          key={i}
                          className="relative w-16 h-16 rounded-lg overflow-hidden"
                        >
                          <Image
                            src={img}
                            alt={`Review image ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Load More */}
              {visibleReviews < combinedReviews.length && (
                <button
                  onClick={() => setVisibleReviews((v) => v + 5)}
                  className="w-full mt-4 py-3 border border-zinc-600 rounded-xl text-white text-sm font-medium hover:border-zinc-400 transition-colors cursor-pointer bg-transparent"
                >
                  Load More
                </button>
              )}
            </div>
          )}

          {/* ── Similar Restaurants ── */}
          <SimilarRestaurants lat={lat} lng={lng} currentId={id} />
        </div>
      </div>
    </div>
  );
}
