"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { BukaCategory } from "@/components/buka/BukaCategory";
import { BukaRestaurant } from "@/components/buka/BukaCard";
import { CuisineSection } from "@/components/buka/CuisineSection";
import { Waitlist } from "@/components/buka/Waitlist";
import { Images } from "@/public/images";

import { useEffect, useMemo, useState } from "react";
import { useRestaurants, useTrendingRestaurants, useSearchRestaurants } from "@/lib/api";
import { Restaurant } from "@/lib/api/services/restaurants.service";
import { CgSpinner } from "react-icons/cg";
import Link from "next/link";
import { useGeolocation } from "@/hooks/useGeolocation";

// Helper to map API restaurant to BukaRestaurant UI interface
const mapToBukaRestaurant = (res: Restaurant): BukaRestaurant => ({
  id: res.id || res.googlePlaceId || Math.random().toString(),
  name: res.name || "Unknown Restaurant",
  image: res.photos && res.photos.length > 0 ? res.photos[0] : "",
  rating: res.avgRating || res.googleRating || 0,
  reviewCount: res.reviewCount || 0,
  address: res.address || "No address provided",
  tags: [res.cuisine, res.source === 'google' ? 'Google' : 'Local'].filter(Boolean) as string[],
  hygiene: 5.0,
  affordability: 5.0,
  foodQuality: 5.0,
  rawRestaurant: res,
});

// Cuisine Data
const cuisines = [
  { name: "Nigeria Cuisine", image: Images.image1 },
  { name: "Yoruba Cuisine", image: Images.image2 },
  { name: "Igbo Cuisine", image: Images.image3 },
  { name: "Hausa Cuisine", image: "https://images.unsplash.com/photo-1567982047351-76b6f93e38ee?w=600&q=80" },
  { name: "Calabar Cuisine", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80" },
  { name: "Edo Cuisine", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80" },
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

  // Fetch from the API
  const { data: restaurantsData, isLoading: isLoadingAll } = useRestaurants({ page: 1, pageSize: 20 });
  const { data: trendingData, isLoading: isLoadingTrending } = useTrendingRestaurants();
  // Fetch Google fallback for user location
  const { data: fallbackData, isLoading: isLoadingFallback } = useSearchRestaurants({
    lat: lat || 6.5244,
    lng: lng || 3.3792,
    page: 1,
    pageSize: 20
  }, !loadingGeo);

  // Map the API responses to the UI models
  const allUiRestaurants = useMemo(() => {
    return restaurantsData?.data?.map(mapToBukaRestaurant) || [];
  }, [restaurantsData]);

  const searchUiRestaurants = useMemo(() => {
    return fallbackData?.data?.map(mapToBukaRestaurant) || [];
  }, [fallbackData]);

  const trendingUiRestaurants = useMemo(() => {
    const rawData = trendingData as unknown as { data?: Restaurant[] } | Restaurant[];
    const arrayData = Array.isArray(rawData) ? rawData : rawData?.data;
    return Array.isArray(arrayData) ? arrayData.map(mapToBukaRestaurant) : [];
  }, [trendingData]);

  // We can populate the different UI categories by distributing the dynamic data:
  // Combine ALL and Fallback into a unified list, removing duplicates by ID
  const combinedAll = useMemo(() => {
    const combined = [...allUiRestaurants, ...searchUiRestaurants];
    const uniqueMap = new Map();
    combined.forEach(r => {
      if (!uniqueMap.has(r.id)) uniqueMap.set(r.id, r);
    });
    return Array.from(uniqueMap.values());
  }, [allUiRestaurants, searchUiRestaurants]);

  const topRestaurants = trendingUiRestaurants.length > 0 ? trendingUiRestaurants.slice(0, 5) : combinedAll.slice(0, 5);
  const topBukas = combinedAll.slice(5, 10);
  const hiddenGems = combinedAll.slice(10, 16);
  const streetFavorites = trendingUiRestaurants.length > 5 ? trendingUiRestaurants.slice(5) : combinedAll.slice(0, 6);

  const isLoading = isLoadingAll || isLoadingTrending || isLoadingFallback;

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a]">
      <div className="max-w-[1440px] mx-auto">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden" style={{ height: 1007 }}>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
            style={{ backgroundImage: heroBgUrl }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

          <button
            onClick={() => router.back()}
            className="absolute top-8 left-8 z-10 flex items-center justify-center w-10 h-10 rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors bg-transparent cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>

          <img
            src="/images/buka-hero-overlay.png"
            alt=""
            className="absolute bottom-0 left-0 z-5 pointer-events-none"
          />

          <div className="absolute bottom-16 left-8 z-10 flex flex-col gap-5 max-w-md">
            <h1 className="text-white text-[32px] font-bold leading-tight">
              Wetin You Wan Chop?!
            </h1>
            <p className="text-white/80 text-base leading-relaxed">
              From mama-put joints to city-class bukas,
              <br />
              your next plate is right here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link href="/buka/restaurant" className="w-fit px-10 py-3.5 bg-[#fbbe15] text-[#1a1a1a] text-sm font-semibold rounded-lg hover:bg-[#e5ac10] transition-colors cursor-pointer border-none">
                Explore Restaurants
              </Link>
              <Link href="/buka/list-resturant" className="w-fit px-10 py-3.5 bg-[#fbbe15] text-[#1a1a1a] text-sm font-semibold rounded-lg hover:bg-[#e5ac10] transition-colors cursor-pointer border-none">
                List Resturant
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Sections */}
        <div className="flex flex-col gap-16 px-8 py-16">
          {isLoading ? (
            <div className="flex items-center justify-center p-20">
              <CgSpinner className="animate-spin text-[#fbbe15] text-4xl" />
            </div>
          ) : (
            <>
              {topRestaurants.length > 0 && <BukaCategory title="Top 5 Restaurant" restaurants={topRestaurants} />}
              {topBukas.length > 0 && <BukaCategory title="Top 5 Buka's" restaurants={topBukas} />}
              {hiddenGems.length > 0 && <BukaCategory title="Hidden Gem's" restaurants={hiddenGems} />}
            </>
          )}
        </div>

        {/* By Cuisine Section */}
        <div className="px-8 pb-16">
          <CuisineSection cuisines={cuisines} />
        </div>

        {/* Banner Image */}
        <div className="px-8 pb-16">
          <div className="w-[92%] mx-auto rounded-2xl overflow-hidden">
            <img
              src="/images/buka_middle_Image.png"
              alt="LocalBuka"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Street Favorites Section */}
        <div className="px-8 pb-16">
          {!isLoading && streetFavorites.length > 0 && (
            <BukaCategory title="Street Favorites" restaurants={streetFavorites} />
          )}
        </div>
        {/* WaitList Section */}
        <div className="px-8 pb-16">
          <Waitlist />
        </div>
      </div>
    </div>
  );
}
