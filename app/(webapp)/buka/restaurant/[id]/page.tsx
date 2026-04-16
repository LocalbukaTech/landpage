'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Bookmark,
  Camera,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Loader2,
  MapPin,
  MoreVertical,
  Pencil,
  Phone,
  Route,
  Share2,
  Star,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import {BukaCard, BukaRestaurant} from '@/components/buka/BukaCard';
import dynamic from 'next/dynamic';
import {
  useAddReview,
  useGoogleReviews,
  useRemoveSavedRestaurant,
  useRestaurant,
  useReviews,
  useSavedRestaurants,
  useSaveRestaurant,
  useSearchRestaurants,
} from '@/lib/api';
import {useToast} from '@/hooks/use-toast';
import {CgSpinner} from 'react-icons/cg';
import {useRequireAuth} from '@/hooks/useRequireAuth';
import {RESTAURANT_PLACEHOLDER_IMG} from '@/lib/constants';
import {helper} from '@/utils/helper';

const MapEmbed = dynamic(
  () => import('@/components/buka/MapEmbed').then((mod) => mod.MapEmbed),
  {
    ssr: false,
    loading: () => (
      <div className='w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500'>
        Loading Map...
      </div>
    ),
  },
);

// Mock Fallbacks
const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80';

// Sort: DB items first, then Google, each group by latest updatedAt

function mapToSimilarRestaurant(apiRest: any): BukaRestaurant {
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

/* ── Opening Hours ── */

const DAY_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const JS_DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function capitalizeDay(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
}

function parseOpeningHours(
  raw: Record<string, string>,
): Record<string, string> {
  const result: Record<string, string> = {};
  Object.entries(raw).forEach(([key, val]) => {
    // Handle "Monday: 11 am–11 pm" stored as just the key with empty val
    if (!val && key.includes(':')) {
      const colonIdx = key.indexOf(':');
      const day = capitalizeDay(key.slice(0, colonIdx).trim());
      result[day] = key.slice(colonIdx + 1).trim();
    } else {
      result[capitalizeDay(key.trim())] = val;
    }
  });
  return result;
}

/**
 * Parse a time string like "11 am", "9:30 pm", "midnight" → minutes since midnight.
 * Returns null if unparseable.
 */
function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const t = timeStr.trim().toLowerCase();
  if (t === 'midnight') return 24 * 60;
  if (t === 'noon') return 12 * 60;

  const match = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3];

  if (meridiem === 'am' && hours === 12) hours = 0;
  if (meridiem === 'pm' && hours !== 12) hours += 12;

  return hours * 60 + minutes;
}

/**
 * Given today's hours string (e.g. "11 am–11 pm" or "Closed"),
 * return { isOpen, closeTime } where closeTime is the closing time string.
 */
function determineOpenStatus(todayHours: string | null): {
  isOpen: boolean;
  closeTime: string | null;
} {
  if (!todayHours) return {isOpen: false, closeTime: null};
  if (todayHours.toLowerCase() === 'closed')
    return {isOpen: false, closeTime: null};

  // Split on en-dash or regular hyphen
  const parts = todayHours.split(/[–-]/);
  if (parts.length < 2) return {isOpen: true, closeTime: null};

  const openStr = parts[0].trim();
  const closeStr = parts[parts.length - 1].trim();

  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const openMinutes = parseTimeToMinutes(openStr);
  const closeMinutes = parseTimeToMinutes(closeStr);

  if (openMinutes === null || closeMinutes === null) {
    // Can't parse — just show as open with close time text
    return {isOpen: true, closeTime: closeStr};
  }

  // Handle ranges that cross midnight (e.g. 10 pm–2 am)
  let isOpen: boolean;
  if (closeMinutes < openMinutes) {
    isOpen = nowMinutes >= openMinutes || nowMinutes < closeMinutes;
  } else {
    isOpen = nowMinutes >= openMinutes && nowMinutes < closeMinutes;
  }

  return {isOpen, closeTime: closeStr};
}

function OpeningHours({
  openingHours,
}: {
  openingHours: Record<string, string> | null;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!openingHours || Object.keys(openingHours).length === 0) return null;

  const parsed = parseOpeningHours(openingHours);
  const todayName = JS_DAY_NAMES[new Date().getDay()];
  const todayHours = parsed[todayName] || null;
  const {isOpen: isOpenToday, closeTime} = determineOpenStatus(todayHours);

  const sortedEntries = DAY_ORDER.filter((d) => d in parsed).map(
    (d) => [d, parsed[d]] as [string, string],
  );
  const displayEntries =
    sortedEntries.length > 0 ? sortedEntries : Object.entries(parsed);

  return (
    <div className='rounded-xl overflow-hidden bg-[#222] mt-3'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='w-full flex items-center gap-3 px-4 py-3 cursor-pointer bg-transparent border-none'>
        <div className='w-10 h-10 rounded-xl bg-[#1e2d4a] flex items-center justify-center shrink-0'>
          <Clock size={20} className='text-blue-400' />
        </div>
        <div className='flex-1 text-left'>
          {isOpenToday ? (
            <span className='text-green-400 font-semibold text-sm'>Open</span>
          ) : (
            <span className='text-red-400 font-semibold text-sm'>Closed</span>
          )}
          {closeTime && (
            <span className='text-zinc-300 text-sm'> · Closes {closeTime}</span>
          )}
          {!isOpenToday && todayHours && (
            <span className='text-zinc-500 text-sm'> · {todayHours}</span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp size={18} className='text-zinc-400 shrink-0' />
        ) : (
          <ChevronDown size={18} className='text-zinc-400 shrink-0' />
        )}
      </button>

      {isExpanded && (
        <div className='px-4 pb-4 pt-2 flex flex-col gap-1.5 border-t border-white/5'>
          {displayEntries.map(([day, hours]) => (
            <div
              key={day}
              className={`flex items-center justify-between py-1 ${
                day === todayName ? 'text-white' : 'text-zinc-400'
              }`}>
              <span
                className={`text-sm ${day === todayName ? 'font-bold' : ''}`}>
                {day}
              </span>
              <span className='text-sm'>{hours}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Write Review Modal ── */

function WriteReviewModal({
  restaurantId,
  restaurantName,
  onClose,
}: {
  restaurantId: string;
  restaurantName: string;
  onClose: () => void;
}) {
  const {toast} = useToast();
  const {requireAuth} = useRequireAuth();
  const addReviewMutation = useAddReview();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [body, setBody] = useState('');
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ratingLabels = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'];
  const displayRating = hoveredRating || rating;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const merged = [...photoFiles, ...files].slice(0, 5);
    setPhotoFiles(merged);
    setPhotoPreviews(merged.map((f) => URL.createObjectURL(f)));
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    const newFiles = photoFiles.filter((_, i) => i !== index);
    setPhotoFiles(newFiles);
    setPhotoPreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a star rating.',
        variant: 'destructive',
      });
      return;
    }
    requireAuth(() => {
      const formData = new FormData();
      formData.append('rating', String(rating));
      if (body.trim()) formData.append('body', body.trim());
      photoFiles.forEach((f) => formData.append('photos', f));

      addReviewMutation.mutate(
        {id: restaurantId, data: formData},
        {
          onSuccess: () => {
            toast({
              title: 'Review Submitted',
              description: 'Thank you for your review!',
              variant: 'success',
            });
            onClose();
          },
          onError: (err: any) => {
            toast({
              title: 'Submission Failed',
              description:
                err?.response?.data?.message ||
                'Unable to submit review. Please try again.',
              variant: 'destructive',
            });
          },
        },
      );
    });
  };

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
      <div className='bg-[#2a2a2a] rounded-2xl w-full max-w-md flex flex-col gap-5 shadow-2xl border border-white/10 overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 pt-6'>
          <div>
            <h3 className='text-white font-bold text-base'>Write a review</h3>
            <p className='text-zinc-500 text-xs mt-0.5'>{restaurantName}</p>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors border-none cursor-pointer'>
            <X size={16} className='text-zinc-400' />
          </button>
        </div>

        {/* Star Rating */}
        <div className='flex flex-col items-center gap-2 px-6'>
          <div className='flex gap-1'>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className='bg-transparent border-none cursor-pointer p-1 transition-transform hover:scale-110'>
                <Star
                  size={36}
                  className={
                    star <= displayRating
                      ? 'text-[#fbbe15] fill-[#fbbe15]'
                      : 'text-zinc-600'
                  }
                />
              </button>
            ))}
          </div>
          <p
            className={`text-sm font-medium h-5 transition-all ${displayRating > 0 ? 'text-[#fbbe15]' : 'text-transparent'}`}>
            {ratingLabels[displayRating]}
          </p>
        </div>

        {/* Text Area */}
        <div className='px-6'>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='Share details about your experience at this place...'
            rows={4}
            className='w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#fbbe15]/50 resize-none transition-colors'
          />
        </div>

        {/* Photo Upload */}
        <div className='px-6'>
          <div className='flex items-center gap-2 flex-wrap'>
            {photoPreviews.map((preview, i) => (
              <div
                key={i}
                className='relative w-16 h-16 rounded-lg overflow-hidden border border-white/10'>
                <Image
                  src={preview}
                  alt={`Photo ${i + 1}`}
                  fill
                  className='object-cover'
                  sizes='64px'
                />
                <button
                  onClick={() => removePhoto(i)}
                  className='absolute top-0.5 right-0.5 w-4 h-4 bg-black/80 rounded-full flex items-center justify-center border-none cursor-pointer'>
                  <X size={9} className='text-white' />
                </button>
              </div>
            ))}
            {photoFiles.length < 5 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className='w-16 h-16 rounded-lg border border-dashed border-zinc-600 flex flex-col items-center justify-center gap-1 hover:border-zinc-400 transition-colors cursor-pointer bg-transparent'>
                <Camera size={18} className='text-zinc-500' />
                <span className='text-zinc-600 text-[9px]'>Add photo</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            multiple
            onChange={handlePhotoChange}
            className='hidden'
          />
          <p className='text-zinc-600 text-xs mt-2'>Up to 5 photos</p>
        </div>

        {/* Submit */}
        <div className='px-6 pb-6'>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || addReviewMutation.isPending}
            className='w-full py-3 bg-[#fbbe15] text-[#1a1a1a] font-bold text-sm rounded-xl hover:bg-[#e5ac10] transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
            {addReviewMutation.isPending && (
              <Loader2 size={16} className='animate-spin' />
            )}
            {addReviewMutation.isPending ? 'Submitting...' : 'Post Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Similar Restaurants (fetched by lat/lng) ── */

function SimilarRestaurants({
  lat,
  lng,
  currentId,
}: {
  lat: number;
  lng: number;
  currentId: string;
}) {
  const {data: nearbyRes, isLoading} = useSearchRestaurants({
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
      .slice(0, 6)
      .map(mapToSimilarRestaurant);
  })();

  // Sort: DB restaurants first, then Google
  const sorted = helper.sortDbFirstThenByDate(nearby).slice(0, 3);

  if (isLoading) {
    return (
      <div className='pb-16 flex items-center justify-center py-10'>
        <CgSpinner className='animate-spin text-[#fbbe15] text-2xl' />
      </div>
    );
  }

  if (sorted.length === 0) return null;

  return (
    <div className='pb-16'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-white text-lg font-bold'>Similar Restaurants</h2>
        <button className='w-8 h-8 flex items-center justify-center rounded-full border border-zinc-600 text-white hover:bg-white/10 transition-colors cursor-pointer'>
          <ChevronRight size={16} />
        </button>
      </div>
      <div className='grid grid-cols-3 gap-5'>
        {sorted.map((r) => (
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

  const {data: rawRestaurant, isLoading: isLoadingRestaurant} =
    useRestaurant(id);
  const {data: localReviewsData, isLoading: isLoadingLocalReviews} =
    useReviews(id);
  const {data: googleReviewsData, isLoading: isLoadingGoogleReviews} =
    useGoogleReviews(id);

  const [fallbackRestaurant] = useState<any>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(`buka_fallback_${id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse fallback restaurant', e);
      }
    }
    return null;
  });

  // Remap logic
  const restaurant = rawRestaurant || fallbackRestaurant;
  // Response shape: { data: { data: Review[], total, ... } }
  const localReviews: any[] = (() => {
    const d = localReviewsData as any;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data?.data)) return d.data.data;
    if (Array.isArray(d?.data)) return d.data;
    return [];
  })();
  const googleReviews: any[] = (() => {
    const d = googleReviewsData as any;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data?.data)) return d.data.data;
    if (Array.isArray(d?.data)) return d.data;
    return [];
  })();

  // Local reviews first, then Google reviews
  const combinedReviews = [
    ...localReviews.map((r) => ({
      id: r.id,
      name: r.user?.fullName || r.user?.username || 'Anonymous',
      avatar: r.user?.avatar || r.user?.profilePicture || DEFAULT_AVATAR,
      rating: r.rating,
      date: new Date(r.createdAt).toLocaleDateString(),
      text: r.body || r.text || '',
      hygiene: r.hygieneRating || 5.0,
      affordability: r.affordabilityRating || 5.0,
      foodQuality: r.foodQualityRating || 5.0,
      images: r.photos || r.images || [],
      source: 'local' as const,
    })),
    ...googleReviews.map((r) => ({
      id: `${r.time}-${r.author_name}`,
      name: r.author_name,
      avatar: r.profile_photo_url || DEFAULT_AVATAR,
      rating: r.rating,
      date: r.relative_time_description || String(r.time),
      text: r.text || '',
      hygiene: 5.0,
      affordability: 5.0,
      foodQuality: 5.0,
      images: [] as string[],
      source: 'google' as const,
    })),
  ];

  const photos =
    restaurant?.photos && restaurant.photos.length > 0
      ? restaurant.photos
      : restaurant?.image
        ? [restaurant.image]
        : [RESTAURANT_PLACEHOLDER_IMG];

  const isPlaceholderPhoto =
    photos.length === 1 && photos[0] === RESTAURANT_PLACEHOLDER_IMG;

  const rating =
    restaurant?.avgRating ||
    restaurant?.googleRating ||
    restaurant?.rating ||
    0;
  const reviewCountStr = restaurant?.reviewCount || 0;
  const lat = restaurant?.lat || 6.5244;
  const lng = restaurant?.lng || 3.3792;
  const tags = restaurant?.tags
    ? restaurant.tags
    : [
        restaurant?.cuisine,
        restaurant?.source === 'google' ? 'Google' : 'Local',
      ].filter(Boolean);

  const [activeTab, setActiveTab] = useState<'photos' | 'reviews'>('photos');
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

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
  const {data: savedRestaurantsRes} = useSavedRestaurants();
  const savedRestaurants = Array.isArray(savedRestaurantsRes)
    ? savedRestaurantsRes
    : (savedRestaurantsRes as any)?.data || [];
  const isSaved = savedRestaurants.some((r: any) => r.id === id);

  const saveMutation = useSaveRestaurant();
  const removeSaveMutation = useRemoveSavedRestaurant();
  const {requireAuth} = useRequireAuth();

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
    return () => {
      document.body.style.overflow = '';
    };
  }, [showDirectionsModal]);

  if (isLoadingRestaurant) {
    return (
      <div className='w-full min-h-screen bg-[#1a1a1a] flex items-center justify-center'>
        <CgSpinner className='animate-spin text-[#fbbe15] text-4xl' />
      </div>
    );
  }

  if (!isLoadingRestaurant && !restaurant) {
    return (
      <div className='w-full min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center'>
        <h2 className='text-white text-xl mb-4'>Restaurant not found</h2>
        <button
          onClick={() => router.back()}
          className='text-[#fbbe15] hover:underline cursor-pointer'>
          Go Back
        </button>
      </div>
    );
  }

  // Prevent accessing properties of null during loading if both are empty initially
  if (!restaurant) return null;

  return (
    <div className='w-full min-h-screen bg-[#1a1a1a]'>
      <div className='max-w-[1440px] mx-auto'>
        {/* ── Hero Carousel ── */}
        <section className='relative w-full h-[500px] overflow-hidden rounded-b-2xl bg-zinc-900 border-b border-zinc-800'>
          {isPlaceholderPhoto ? (
            <div className='w-full h-full bg-zinc-800 flex items-center justify-center'>
              <UtensilsCrossed size={80} className='text-zinc-600' />
            </div>
          ) : (
            photos.slice(0, 5).map((img: string, i: number) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === activeHeroIndex ? 'opacity-100' : 'opacity-0'
                }`}>
                <Image
                  src={img}
                  alt={`${restaurant?.name || 'Restaurant'} slide ${i + 1}`}
                  fill
                  className='object-cover'
                  sizes='100vw'
                  priority={i === 0}
                />
              </div>
            ))
          )}

          {/* Gradient overlay */}
          <div className='absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent' />

          {/* Dots */}
          <div className='absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2'>
            {photos.slice(0, 5).map((_: string, i: number) => (
              <button
                key={i}
                onClick={() => goToHeroSlide(i)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  i === activeHeroIndex
                    ? 'bg-[#fbbe15] w-6'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className='absolute top-8 left-8 z-10 flex items-center justify-center w-10 h-10 rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors bg-black/20 cursor-pointer'
            aria-label='Go back'>
            <ArrowLeft size={20} />
          </button>
        </section>

        {/* ── Restaurant Info ── */}
        <div className='w-[92%] mx-auto'>
          <div className='py-6 flex flex-col gap-3'>
            {/* Name + Tags row */}
            <div className='flex items-center gap-3'>
              <UtensilsCrossed size={18} className='text-white shrink-0' />
              <h1 className='text-white text-xl font-bold'>
                {restaurant.name}
              </h1>
              <span className='w-4 h-4 rounded-full bg-green-500 shrink-0' />
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className='px-3 py-1 text-[10px] font-medium rounded-full bg-[#FEEBB6] text-[#695009]'>
                  {tag}
                </span>
              ))}
            </div>

            {/* Address + Actions */}
            <div className='flex items-start justify-between'>
              <div className='flex flex-col gap-2'>
                {/* Address */}
                <div className='flex items-center gap-1.5'>
                  <MapPin size={14} className='text-zinc-400 shrink-0' />
                  <span className='text-zinc-400 text-sm'>
                    {restaurant.address}
                  </span>
                </div>
                {/* Rating */}
                <div className='flex items-center gap-1.5'>
                  <Star size={14} className='text-[#fbbe15] fill-[#fbbe15]' />
                  <span className='text-white text-sm font-bold'>{rating}</span>
                  <span className='text-zinc-500 text-sm'>
                    ({reviewCountStr} Reviews)
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className='flex items-center gap-6'>
                <button className='flex flex-col items-center gap-1 cursor-pointer group'>
                  <div className='w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-600 group-hover:border-zinc-400 transition-colors'>
                    <Phone size={16} className='text-white' />
                  </div>
                  <span className='text-zinc-400 text-[10px]'>Call</span>
                </button>
                <button
                  onClick={handleToggleSave}
                  disabled={
                    saveMutation.isPending || removeSaveMutation.isPending
                  }
                  className='flex flex-col items-center gap-1 cursor-pointer group'>
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
                      isSaved
                        ? 'border-[#fbbe15] bg-[#fbbe15]/10'
                        : 'border-zinc-600 group-hover:border-zinc-400'
                    }`}>
                    <Bookmark
                      size={16}
                      className={
                        isSaved ? 'text-[#fbbe15] fill-[#fbbe15]' : 'text-white'
                      }
                    />
                  </div>
                  <span className='text-zinc-400 text-[10px]'>
                    {isSaved ? 'Saved' : 'Save'}
                  </span>
                </button>
                <button className='flex flex-col items-center gap-1 cursor-pointer group'>
                  <div className='w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-600 group-hover:border-zinc-400 transition-colors'>
                    <Share2 size={16} className='text-white' />
                  </div>
                  <span className='text-zinc-400 text-[10px]'>Share</span>
                </button>
              </div>
            </div>

            {/* Scores */}
            <div className='flex items-center gap-6 mt-1'>
              <div className='flex items-center gap-1'>
                <span className='text-[#fbbe15] text-sm font-bold'>
                  {(5.0).toFixed(1)}
                </span>
                <span className='text-zinc-500 text-xs'>Hygiene</span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-[#fbbe15] text-sm font-bold'>
                  {(5.0).toFixed(1)}
                </span>
                <span className='text-zinc-500 text-xs'>Affordability</span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-[#fbbe15] text-sm font-bold'>
                  {(5.0).toFixed(1)}
                </span>
                <span className='text-zinc-500 text-xs'>Food Quality</span>
              </div>
            </div>

            {/* Opening Hours */}
            <OpeningHours openingHours={restaurant.openingHours} />
          </div>

          {/* ── Static Map Preview ── */}
          <div className='w-full h-[480px] rounded-2xl overflow-hidden bg-zinc-800 z-0 relative'>
            <MapEmbed
              destinationLat={lat}
              destinationLng={lng}
              address={restaurant?.address}
              showRoute={false}
            />
          </div>

          {/* Get Directions — opens fullscreen modal */}
          <div className='flex justify-center py-6'>
            <button
              onClick={() => setShowDirectionsModal(true)}
              className='flex items-center gap-2 px-8 py-2.5 bg-[#fbbe15] text-[#1a1a1a] text-sm font-semibold rounded-lg hover:bg-[#e5ac10] transition-colors cursor-pointer'>
              <Route size={18} />
              Get Directions
            </button>
          </div>

          {/* ── Fullscreen Directions Modal ── */}
          {showDirectionsModal && (
            <div className='fixed inset-0 z-50 bg-black'>
              {/* Close button */}
              <button
                onClick={() => setShowDirectionsModal(false)}
                className='absolute top-6 left-6 z-1001 flex items-center justify-center w-10 h-10 rounded-full bg-[#2E68E3] text-white hover:bg-[#2558c5] transition-colors cursor-pointer border-none shadow-lg'
                aria-label='Close directions'>
                <ArrowLeft size={20} />
              </button>

              {/* Restaurant name badge */}
              <div className='absolute top-6 left-20 z-1001 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-xl'>
                <p className='text-sm font-semibold'>{restaurant.name}</p>
                <p className='text-xs text-zinc-400'>{restaurant.address}</p>
              </div>

              {/* Full screen map */}
              <div className='w-full h-full relative'>
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
          <div className='border-b border-zinc-700 flex'>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'photos'
                  ? 'text-white border-b-2 border-[#fbbe15]'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}>
              Photos
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'text-white border-b-2 border-[#fbbe15]'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}>
              Reviews
            </button>
          </div>

          {/* ── Photos Grid ── */}
          {activeTab === 'photos' && (
            <div className='py-8'>
              <div className='grid grid-cols-5 gap-3'>
                {photos.map((photo: string, i: number) => (
                  <div
                    key={i}
                    className='relative aspect-square rounded-xl overflow-hidden'>
                    {photo === RESTAURANT_PLACEHOLDER_IMG ? (
                      <div className='w-full h-full bg-zinc-800 flex items-center justify-center'>
                        <UtensilsCrossed size={48} className='text-zinc-600' />
                      </div>
                    ) : (
                      <Image
                        src={photo}
                        alt={`Photo ${i + 1}`}
                        fill
                        className='object-cover hover:scale-105 transition-transform duration-300'
                        sizes='(max-width: 768px) 50vw, 20vw'
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Reviews List ── */}
          {activeTab === 'reviews' && (
            <div className='py-8 flex flex-col gap-6'>
              {/* Write a review button */}
              <div className='flex justify-center'>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className='flex items-center gap-2 px-6 py-2.5 bg-transparent border border-zinc-600 rounded-full text-white text-sm font-medium hover:border-zinc-400 hover:bg-white/5 transition-colors cursor-pointer'>
                  <Pencil size={14} className='text-blue-400' />
                  Write a review
                </button>
              </div>
              {(isLoadingLocalReviews || isLoadingGoogleReviews) && (
                <div className='flex items-center justify-center p-10'>
                  <CgSpinner className='animate-spin text-[#fbbe15] text-4xl' />
                </div>
              )}

              {!isLoadingLocalReviews &&
                !isLoadingGoogleReviews &&
                combinedReviews.length === 0 && (
                  <div className='flex flex-col items-center justify-center py-20 bg-[#222] rounded-2xl'>
                    <p className='text-zinc-400'>
                      No reviews found for this restaurant.
                    </p>
                  </div>
                )}

              {combinedReviews.slice(0, visibleReviews).map((review) => (
                <div
                  key={review.id}
                  className='bg-[#222] rounded-2xl p-6 flex flex-col gap-3'>
                  {/* Header */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Image
                        src={review.avatar}
                        alt={review.name || 'review_image'}
                        width={40}
                        height={40}
                        className='w-10 h-10 rounded-full object-cover'
                        unoptimized={review.avatar.includes(
                          'googleusercontent',
                        )}
                      />
                      <div>
                        <p className='text-white text-sm font-semibold'>
                          {review.name}
                        </p>
                        <div className='flex items-center gap-2'>
                          <div className='flex items-center gap-0.5'>
                            {Array.from({length: 5}).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={
                                  i < review.rating
                                    ? 'text-[#fbbe15] fill-[#fbbe15]'
                                    : 'text-zinc-600'
                                }
                              />
                            ))}
                          </div>
                          <span className='text-zinc-500 text-xs'>
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className='text-zinc-500 hover:text-white transition-colors cursor-pointer'>
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  {/* Review text */}
                  <p className='text-zinc-300 text-sm leading-relaxed'>
                    {review.text}
                  </p>

                  {/* Scores */}
                  <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-1'>
                      <span className='text-[#fbbe15] text-sm font-bold'>
                        {review.hygiene.toFixed(1)}
                      </span>
                      <span className='text-zinc-500 text-xs'>Hygiene</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <span className='text-[#fbbe15] text-sm font-bold'>
                        {review.affordability.toFixed(1)}
                      </span>
                      <span className='text-zinc-500 text-xs'>
                        Affordability
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <span className='text-[#fbbe15] text-sm font-bold'>
                        {review.foodQuality.toFixed(1)}
                      </span>
                      <span className='text-zinc-500 text-xs'>
                        Food Quality
                      </span>
                    </div>
                  </div>

                  {/* Review images */}
                  {review.images.length > 0 && (
                    <div className='flex gap-2 mt-1'>
                      {review.images.map((img: string, i: number) => (
                        <div
                          key={i}
                          className='relative w-16 h-16 rounded-lg overflow-hidden'>
                          <Image
                            src={img}
                            alt={`Review image ${i + 1}`}
                            fill
                            className='object-cover'
                            sizes='64px'
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
                  className='w-full mt-4 py-3 border border-zinc-600 rounded-xl text-white text-sm font-medium hover:border-zinc-400 transition-colors cursor-pointer bg-transparent'>
                  Load More
                </button>
              )}
            </div>
          )}

          {/* ── Similar Restaurants ── */}
          <SimilarRestaurants lat={lat} lng={lng} currentId={id} />
        </div>
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <WriteReviewModal
          restaurantId={id}
          restaurantName={restaurant.name}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
}
