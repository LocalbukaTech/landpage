"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CuisineFilters, FilterState } from "@/components/buka/CuisineFilters";
import { BukaCard, BukaRestaurant } from "@/components/buka/BukaCard";
import { Pagination } from "@/components/buka/Pagination";
import { useRestaurants, useSearchRestaurants } from "@/lib/api";
import { CgSpinner } from "react-icons/cg";
import { useGeolocation } from "@/hooks/useGeolocation";
import { RESTAURANT_PLACEHOLDER_IMG } from "@/lib/constants";

const LOCATIONS = [
  "Current Location",
  "Ikeja, Lagos",
  "Victoria Island, Lagos",
  "Lekki, Lagos",
  "Abuja, FCT",
  "Port Harcourt, Rivers",
];

const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  "Ikeja, Lagos": { lat: 6.6018, lng: 3.3515 },
  "Victoria Island, Lagos": { lat: 6.4281, lng: 3.4219 },
  "Lekki, Lagos": { lat: 6.4698, lng: 3.5852 },
  "Abuja, FCT": { lat: 9.0765, lng: 7.3986 },
  "Port Harcourt, Rivers": { lat: 4.8156, lng: 7.0498 },
};

const ITEMS_PER_PAGE = 12;

// Sort BukaRestaurant arrays: DB items first, then Google, each group by latest updatedAt
const sortDbFirstThenByDate = (items: BukaRestaurant[]): BukaRestaurant[] =>
  [...items].sort((a, b) => {
    const aIsGoogle = a.rawRestaurant?.source === "google" ? 1 : 0;
    const bIsGoogle = b.rawRestaurant?.source === "google" ? 1 : 0;
    if (aIsGoogle !== bIsGoogle) return aIsGoogle - bIsGoogle;
    const dateA = a.rawRestaurant?.updatedAt;
    const dateB = b.rawRestaurant?.updatedAt;
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

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

export default function ExploreRestaurantsPage() {
  const router = useRouter();
  const { lat: userLat, lng: userLng, loading: loadingGeo } = useGeolocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("Current Location");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const locationRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Extract city for API call (first part before the comma, e.g. "Ikeja" from "Ikeja, Lagos")
  const locationParts = selectedLocation.split(", ");
  const city = locationParts[0];

  // Fetch ALL restaurants from DB
  const { data: allRes, isLoading: isLoadingAll } = useRestaurants({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    city,
  });

  // Google fallback search
  const isCurrentLocation = selectedLocation === "Current Location";
  const coords = isCurrentLocation 
    ? { lat: userLat || 6.5244, lng: userLng || 3.3792 }
    : (LOCATION_COORDS[selectedLocation] || { lat: 6.5244, lng: 3.3792 });

  const { data: fallbackRes, isLoading: isLoadingFallback } =
    useSearchRestaurants({
      lat: coords.lat,
      lng: coords.lng,
      page: currentPage,
      pageSize: ITEMS_PER_PAGE,
    }, isCurrentLocation ? !loadingGeo : true);

  const isLoading = isLoadingAll || isLoadingFallback;

  // Combine DB + fallback, deduplicate
  const apiRestaurants: BukaRestaurant[] = useMemo(() => {
    let rawDb: any[] = [];
    if (allRes && (allRes as any).data?.data && Array.isArray((allRes as any).data.data)) {
      rawDb = (allRes as any).data.data;
    } else if (allRes && Array.isArray((allRes as any).data)) {
      rawDb = (allRes as any).data;
    } else if (Array.isArray(allRes)) {
      rawDb = allRes as any[];
    }

    let rawFallback: any[] = [];
    if (fallbackRes && Array.isArray((fallbackRes as any).data)) {
      rawFallback = (fallbackRes as any).data;
    } else if (Array.isArray(fallbackRes)) {
      rawFallback = fallbackRes as any[];
    }

    const combined = [...rawDb, ...rawFallback];
    const uniqueMap = new Map();
    combined.forEach((c: any) => {
      const id = c.id || c.googlePlaceId;
      if (id && !uniqueMap.has(id)) uniqueMap.set(id, c);
    });

    return sortDbFirstThenByDate(Array.from(uniqueMap.values()).map(mapToBukaRestaurant));
  }, [allRes, fallbackRes]);

  // Filters — no default cuisine
  const [filters, setFilters] = useState<FilterState>({
    minPrice: "",
    maxPrice: "",
    rating: null,
    foodQuality: null,
    cuisines: [],
  });

  // Close location dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(e.target as Node)
      ) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
            tag.toLowerCase().includes(f.toLowerCase().replace(" cuisine", ""))
          )
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

  const totalPages = Math.max(
    (allRes as any)?.data?.totalPages || 1,
    (fallbackRes as any)?.totalPages ||
      (fallbackRes as any)?.data?.totalPages ||
      1
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a]">
      <div className="max-w-[1440px] mx-auto">
        {/* ── Compact Header ── */}
        <div className="w-[92%] mx-auto pt-8 pb-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-white text-2xl font-bold">
              Explore Restaurants
            </h1>
            <p className="text-zinc-400 text-sm mt-0.5">
              Discover the best bukas and restaurants near you
            </p>
          </div>
        </div>

        {/* ── Location & Search Bar ── */}
        <div className="w-[92%] mx-auto py-4">
          <div className="flex items-center justify-between">
            {/* Location LOV */}
            <div className="relative" ref={locationRef}>
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-2 h-12 px-5 bg-white rounded-xl cursor-pointer min-w-[220px]"
              >
                <MapPin size={16} className="text-[#1a1a1a] shrink-0" />
                <span className="text-[#1a1a1a] text-sm flex-1 text-left">
                  {selectedLocation || "Enter Location"}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-zinc-500 shrink-0 transition-transform ${
                    isLocationOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isLocationOpen && (
                <div className="absolute top-14 left-0 w-full bg-white rounded-xl shadow-lg border border-zinc-200 py-1 z-50">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsLocationOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                        selectedLocation === loc
                          ? "bg-[#fbbe15]/10 text-[#1a1a1a] font-medium"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search area */}
            <div className="flex items-center gap-3">
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isSearchOpen ? "w-[300px] opacity-100" : "w-0 opacity-0"
                }`}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search restaurants..."
                  className="w-full h-12 px-4 bg-[#2a2a2a] border border-zinc-700 rounded-xl text-white text-sm outline-none focus:border-[#fbbe15] transition-colors placeholder:text-zinc-500"
                />
              </div>

              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (isSearchOpen) setSearchQuery("");
                }}
                className="w-12 h-12 flex items-center justify-center bg-[#fbbe15] rounded-xl hover:bg-[#e5ac10] transition-colors shrink-0 cursor-pointer"
              >
                <Search size={18} className="text-[#1a1a1a]" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="w-[92%] mx-auto pb-16 flex gap-8">
          {/* Sidebar */}
          <aside className="w-[220px] shrink-0">
            <CuisineFilters
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Restaurant Grid */}
          <div className="flex-1 flex flex-col">
            {/* Results Header */}
            <div className="mb-6">
              <p className="text-zinc-400 text-sm">
                Found{" "}
                <span className="text-[#fbbe15] font-semibold">
                  {filteredRestaurants.length}
                </span>{" "}
                restaurants in{" "}
                <span className="text-[#fbbe15] font-semibold">
                  {selectedLocation}
                </span>
              </p>
            </div>

            {/* Cards Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <CgSpinner className="animate-spin text-[#fbbe15] text-4xl" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {filteredRestaurants.map((restaurant) => (
                  <div key={restaurant.id}>
                    <BukaCard restaurant={restaurant} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredRestaurants.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <p className="text-zinc-500 text-sm">
                  No restaurants found. Try adjusting your filters or location.
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
  );
}
