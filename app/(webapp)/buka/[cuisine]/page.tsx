"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useParams} from "next/navigation";
import {ChevronDown, MapPin, Search} from "lucide-react";
import {CuisineHero} from "@/components/buka/CuisineHero";
import {CuisineFilters, FilterState} from "@/components/buka/CuisineFilters";
import {BukaCard, BukaRestaurant} from "@/components/buka/BukaCard";
import {Pagination} from "@/components/buka/Pagination";
import {Images} from "@/public/images";
import {useRestaurantsByCuisine, useSearchRestaurants} from "@/lib/api";
import {CgSpinner} from "react-icons/cg";
import {RESTAURANT_PLACEHOLDER_IMG} from "@/lib/constants";
import {helper} from "@/utils/helper";

// Map slug → cuisine filter name
const SLUG_TO_CUISINE: Record<string, string> = {
  "nigeria-cuisine": "Nigerian Cuisine",
  "yoruba-cuisine": "Yoruba Cuisine",
  "igbo-cuisine": "Igbo Cuisine",
  "hausa-cuisine": "Hausa Cuisine",
  "calabar-cuisine": "Calabar Cuisine",
  "edo-cuisine": "Edo Cuisine",
};

// Cuisine metadata
const CUISINE_META: Record<string, { name: string; description: string; images: string[] }> = {
  "nigeria-cuisine": {
    name: "Nigeria Cuisines",
    description:
      "Nigerian cuisine is bold, spicy, and diverse, showcasing rich flavors from rice, yam, and traditional stews.",
    images: [Images.image1, Images.image2, Images.image3],
  },
  "yoruba-cuisine": {
    name: "Yoruba Cuisines",
    description:
      "Yoruba cuisine features amala, ewedu, gbegiri, and rich assorted meat stews from Southwest Nigeria.",
    images: [Images.image2, Images.image1, Images.image3],
  },
  "igbo-cuisine": {
    name: "Igbo Cuisines",
    description:
      "Igbo cuisine is known for ofe nsala, oha soup, abacha, and flavorful dishes from the East.",
    images: [Images.image3, Images.image1, Images.image2],
  },
  "hausa-cuisine": {
    name: "Hausa Cuisines",
    description:
      "Hausa cuisine brings tuwo shinkafa, miyan kuka, kilishi, and Northern Nigerian flavors.",
    images: [Images.image1, Images.image3, Images.image2],
  },
  "calabar-cuisine": {
    name: "Calabar Cuisines",
    description:
      "Calabar cuisine is famous for edikang ikong, afang soup, and rich Cross River delicacies.",
    images: [Images.image2, Images.image3, Images.image1],
  },
  "edo-cuisine": {
    name: "Edo Cuisines",
    description:
      "Edo cuisine features owo soup, black soup, and the culinary traditions of Benin Kingdom.",
    images: [Images.image3, Images.image2, Images.image1],
  },
};

const LOCATIONS = [
  "Ikeja, Lagos",
  "Victoria Island, Lagos",
  "Lekki, Lagos",
  "Abuja, FCT",
  "Port Harcourt, Rivers",
];

const LOCATION_COORDS: Record<string, { lat: number, lng: number }> = {
  "Ikeja, Lagos": { lat: 6.6018, lng: 3.3515 },
  "Victoria Island, Lagos": { lat: 6.4281, lng: 3.4219 },
  "Lekki, Lagos": { lat: 6.4698, lng: 3.5852 },
  "Abuja, FCT": { lat: 9.0765, lng: 7.3986 },
  "Port Harcourt, Rivers": { lat: 4.8156, lng: 7.0498 },
};

const ITEMS_PER_PAGE = 9;

// Sort BukaRestaurant arrays: DB items first, then Google, each group by latest updatedAt


function mapToBukaRestaurant(apiRest: any): BukaRestaurant {
  return {
    id: apiRest.id || apiRest.googlePlaceId || Math.random().toString(),
    name: apiRest.name,
    image: (apiRest.photos && apiRest.photos.length > 0) ? apiRest.photos[0] : RESTAURANT_PLACEHOLDER_IMG,
    rating: apiRest.avgRating || apiRest.googleRating || 0,
    reviewCount: apiRest.reviewCount || 0,
    address: apiRest.address || `${apiRest.city || ''}, ${apiRest.state || ''}`,
    tags: [apiRest.cuisine, apiRest.source === 'google' ? 'Google' : 'Local'].filter(Boolean),
    hygiene: 5.0,
    affordability: 5.0,
    foodQuality: 5.0,
    rawRestaurant: apiRest,
  };
}

export default function CuisineDetailPage() {
  const params = useParams();
  const cuisineSlug = params.cuisine as string;
  const cuisineData = CUISINE_META[cuisineSlug] || CUISINE_META["nigeria-cuisine"];
  const activeCuisine = SLUG_TO_CUISINE[cuisineSlug] || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("Ikeja, Lagos");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const locationRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get actual fetching from APi
  const apiCuisineName = cuisineSlug.replace("-cuisine", "").replace("-", " ");
  // Provide a safe default location city for fetching initially maybe? 
  // We'll extract city for API call if selectedLocation is e.g. "Ikeja, Lagos" -> "Lagos"
  const locationParts = selectedLocation.split(', ');
  const city = locationParts.length > 1 ? locationParts[1] : locationParts[0];

  const { data: cuisineRes, isLoading: isLoadingCuisine } = useRestaurantsByCuisine(apiCuisineName, {
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    city,
  });

  const coords = LOCATION_COORDS[selectedLocation] || { lat: 6.5244, lng: 3.3792 };
  const { data: fallbackSearchRes, isLoading: isLoadingFallback } = useSearchRestaurants({
    lat: coords.lat,
    lng: coords.lng,
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
  });

  const isLoading = isLoadingCuisine || isLoadingFallback;

  const apiRestaurants: BukaRestaurant[] = useMemo(() => {
    let rawCuisine: any[] = [];
    if (cuisineRes && Array.isArray((cuisineRes as any).data)) {
      rawCuisine = (cuisineRes as any).data;
    } else if (cuisineRes && (cuisineRes as any).data?.data && Array.isArray((cuisineRes as any).data.data)) {
      rawCuisine = (cuisineRes as any).data.data;
    } else if (Array.isArray(cuisineRes)) {
      rawCuisine = cuisineRes as any[];
    }

    let rawFallback: any[] = [];
    if (fallbackSearchRes && Array.isArray((fallbackSearchRes as any).data)) {
      rawFallback = (fallbackSearchRes as any).data;
    } else if (Array.isArray(fallbackSearchRes)) {
      rawFallback = fallbackSearchRes as any[];
    }

    const combined = [...rawCuisine, ...rawFallback];
    const uniqueMap = new Map();
    combined.forEach((c: any) => {
      const id = c.id || c.googlePlaceId;
      if (id && !uniqueMap.has(id)) uniqueMap.set(id, c);
    });

    return helper.sortDbFirstThenByDate(Array.from(uniqueMap.values()).map(mapToBukaRestaurant));
  }, [cuisineRes, fallbackSearchRes]);

  const [filters, setFilters] = useState<FilterState>({
    minPrice: "",
    maxPrice: "",
    rating: null,
    foodQuality: null,
    cuisines: activeCuisine ? [activeCuisine] : [],
  });

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Apply filters on client side
  const filteredRestaurants = useMemo(() => {
    return apiRestaurants.filter((r) => {
      if (filters.rating && r.rating < filters.rating) return false;
      if (filters.foodQuality && r.foodQuality < filters.foodQuality) return false;
      if (filters.cuisines.length > 0) {
        // Just checking if any tag partially matches one of the filters 
        const hasCuisine = r.tags.some((tag) => 
          filters.cuisines.some(f => tag.toLowerCase().includes(f.toLowerCase().replace(' cuisine', '')))
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
    (cuisineRes as any)?.data?.totalPages || 1,
    (fallbackSearchRes as any)?.totalPages || (fallbackSearchRes as any)?.data?.totalPages || 1
  );
  const paginatedRestaurants = filteredRestaurants; // if pagination is handled by backend, we don't slice here.

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a]">
      <div className="max-w-[1440px] mx-auto">
        {/* Hero Carousel */}
        <CuisineHero
          name={cuisineData.name}
          description={cuisineData.description}
          images={cuisineData.images}
        />

        {/* Location & Search Bar */}
        <div className="w-[92%] mx-auto py-8">
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

              {/* Dropdown */}
              {isLocationOpen && (
                <div className="absolute top-14 left-0 w-full bg-white rounded-xl shadow-lg border border-zinc-200 py-1 z-50">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsLocationOpen(false);
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
              {/* Expandable search input */}
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

              {/* Search icon button */}
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

        {/* Main Content */}
        <div className="w-[92%] mx-auto pb-16 flex gap-8">
          {/* Sidebar */}
          <aside className="w-[220px] shrink-0">
            <CuisineFilters
              activeCuisine={activeCuisine}
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
                <span className="text-[#fbbe15] font-semibold">{selectedLocation}</span>
              </p>
            </div>

            {/* Cards Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <CgSpinner className="animate-spin text-[#fbbe15] text-4xl" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {paginatedRestaurants.map((restaurant) => (
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
                  No restaurants found matching your filters.
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
