'use client';

import {useRef, useState, useEffect, useMemo} from 'react';
import Image from 'next/image';
import {
  Hash,
  Loader2,
  MapPin,
  MoreVertical,
  Search as SearchIcon,
  Tag,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import {cn} from '@/lib/utils';
import {useRestaurants} from '@/lib/api/services/restaurants.hooks';
import {useGeolocation} from '@/hooks/useGeolocation';
import {useAuth} from '@/context/AuthContext';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { RiRestaurant2Fill } from 'react-icons/ri';

interface UploadDetailsProps {
  files?: File[];
  existingMediaUrls?: string[];
  initialCaption?: string;
  initialImageCaptions?: string[];
  initialLocation?: string;
  initialRestaurant?: { id: string; name: string } | null;
  isEditing?: boolean;
  submitText?: string;
  onPost: (data: {
    description: string;
    imageCaptions?: string[];
    tags: string[];
    location: string;
    restaurantId?: string;
  }) => void;
  onDiscard: () => void;
  isUploading?: boolean;
  onAddFiles?: (newFiles: File[]) => void;
  onRemoveFile?: (index: number) => void;
}

export function UploadDetails({
  files = [],
  existingMediaUrls = [],
  initialCaption = '',
  initialImageCaptions = [],
  initialLocation = '',
  initialRestaurant = null,
  isEditing = false,
  submitText = 'Post',
  onPost,
  onDiscard,
  isUploading = false,
  onAddFiles,
  onRemoveFile,
}: UploadDetailsProps) {
  const isImage = files.length > 0 ? files[0].type.startsWith('image/') : true;
  const totalSlides = files.length > 0 ? files.length : existingMediaUrls.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [captions, setCaptions] = useState<string[]>(() => {
    if (initialImageCaptions.length > 0) return initialImageCaptions;
    return Array(totalSlides).fill('');
  });
  const [generalCaption, setGeneralCaption] = useState(initialCaption);

  const {user: authUser} = useAuth();
  const {lat, lng} = useGeolocation();
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lng) return;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then((r) => r.json())
      .then((data) => {
        const area =
          data.address?.suburb ||
          data.address?.neighbourhood ||
          data.address?.quarter ||
          '';
        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.state ||
          '';
        const country = data.address?.country || '';
        const mainLoc = [area || city, country].filter(Boolean).join(', ');
        if (mainLoc) {
          setCurrentLocation(mainLoc);
        }
      })
      .catch(() => {});
  }, [lat, lng]);

  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStart = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync captions state length when files list expands
  useEffect(() => {
    setCaptions((prev) => {
      if (prev.length === files.length) return prev;
      if (prev.length < files.length) {
        const diff = files.length - prev.length;
        return [...prev, ...Array(diff).fill('')];
      } else {
        return prev.slice(0, files.length);
      }
    });
  }, [files.length]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onAddFiles) {
      const selectedList = Array.from(e.target.files);
      onAddFiles(selectedList);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemoveFile) {
      // Filter out deleted caption to keep remaining captions synced with correct slides
      setCaptions((prev) => prev.filter((_, i) => i !== activeIndex));
      
      onRemoveFile(activeIndex);
      
      // Shift active slide index if we deleted the last slide
      if (activeIndex >= files.length - 1) {
        setActiveIndex(Math.max(0, files.length - 2));
      }
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      const urls = files.map((file) => URL.createObjectURL(file));
      setMediaUrls(urls);
      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    } else if (existingMediaUrls.length > 0) {
      setMediaUrls(existingMediaUrls);
    }
  }, [files, existingMediaUrls]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (diff > threshold && activeIndex < files.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (diff < -threshold && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
    touchStart.current = null;
  };

  const description = captions[activeIndex] || '';

  const handleDescriptionChange = (val: string) => {
    const updated = [...captions];
    updated[activeIndex] = val;
    setCaptions(updated);
  };

  // UI States
  const [showLocations, setShowLocations] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputFocus, setInputFocus] = useState(false);

  // Tagging States
  const [selectedLocations, setSelectedLocations] = useState<string[]>(() =>
    initialLocation ? [initialLocation] : []
  );
  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    id: string;
    name: string;
  } | null>(initialRestaurant);

  // Video States
  const [isMuted, setIsMuted] = useState(false); // Unmuted by default as requested
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState('00:00');

  // Restaurant searching
  const [searchTerm, setSearchTerm] = useState('');
  const {data: restaurantsResponse, isLoading: isLoadingRestaurants} =
    useRestaurants({
      page: 1,
      pageSize: 20,
      // Add city filter if needed, or if the hook supports search param by name
      // For now we'll use the basic fetch and maybe filter client-side if API doesn't support name search directly
    });
  const restaurantsList = restaurantsResponse?.data || [];

  // Client-side filtering as a fallback if API doesn't support 'search' parameter in getRestaurants
  const displayedRestaurants = searchTerm
    ? restaurantsList.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : restaurantsList;

  // Mock data
  // const users = [
  //   { name: "Cody Buka", handle: "@codybuka", image: "/images/mock/user1.jpg" },
  //   { name: "Alfredo Saris", handle: "@localbuka", image: "/images/mock/user2.jpg" },
  //   { name: "Matthias Meal", handle: "@matthias", image: "/images/mock/user3.jpg" },
  // ];

  const locations = useMemo(() => {
    const baseLocations = [
      {name: 'Ikeja, Lagos', address: 'Mainland, Lagos'},
      {name: 'Lekki, Lagos', address: 'Island, Lagos'},
      {name: 'Victoria Island, Lagos', address: 'Island, Lagos'},
      {name: 'Yaba, Lagos', address: 'Mainland, Lagos'},
      {name: 'Surulere, Lagos', address: 'Mainland, Lagos'},
      {name: 'Abuja', address: 'Federal Capital Territory'},
      {name: 'Port Harcourt', address: 'Rivers State'},
      {name: 'Benin City, Edo', address: 'Ekehuan road, Benin'},
      {name: 'Ibadan', address: 'Oyo State'},
      {name: 'Enugu', address: 'Enugu State'},
      {name: 'Kano', address: 'Kano State'},
    ];

    const detectedLoc = currentLocation || authUser?.location;
    if (detectedLoc) {
      const filteredBase = baseLocations.filter(
        (loc) => loc.name.toLowerCase() !== detectedLoc.toLowerCase()
      );
      return [
        {name: detectedLoc, address: 'Current Location', isCurrent: true},
        ...filteredBase,
      ];
    }

    return baseLocations;
  }, [currentLocation, authUser?.location]);
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
      (loc.address &&
        loc.address.toLowerCase().includes(locationSearchTerm.toLowerCase())),
  );

  // Video Event Handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);

      // Format time
      const minutes = Math.floor(current / 60);
      const seconds = Math.floor(current % 60);
      setDuration(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      );
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleAddLocation = (locName: string) => {
    if (!selectedLocations.includes(locName)) {
      setSelectedLocations([...selectedLocations, locName]);
    }
    setShowLocations(false);
  };

  const handleRemoveLocation = (locName: string) => {
    setSelectedLocations(selectedLocations.filter((l) => l !== locName));
  };

  const handleSelectRestaurant = (restaurant: {id: string; name: string}) => {
    setSelectedRestaurant(restaurant);
    setShowUsers(false);
  };

  const handleRemoveRestaurant = () => {
    setSelectedRestaurant(null);
  };

  const handleHashtagClick = () => {
    setGeneralCaption((prev) => prev.trimEnd() + (prev.trimEnd() ? ' #' : '#'));
  };

  const extractHashtags = (text: string) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map((m) => m.slice(1)) : [];
  };

  return (
    <div className='flex flex-col w-full max-w-6xl mx-auto'>
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Main Content Card */}
        <div className='flex-1 bg-[#141414] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl flex flex-col lg:flex-row gap-6 md:gap-8 text-white'>
          {/* Left Column: Form */}
          <div className='flex-1 flex flex-col relative'>
            {/* General Caption Section */}
            <div className='relative mb-5 flex flex-col'>
              <div className='flex justify-between items-center mb-2'>
                <h3 className='text-sm font-bold text-zinc-300 uppercase tracking-wide'>
                  Post Description
                </h3>
                <button
                  onClick={handleHashtagClick}
                  disabled={isUploading}
                  className='flex items-center gap-1 text-[11px] font-bold text-[#fbbe15] hover:text-[#e5ac10] transition-colors border border-[#fbbe15]/30 bg-transparent px-2.5 py-1 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none'
                >
                  <Hash size={12} /> Add Hashtag
                </button>
              </div>
              <div className='relative'>
                <textarea
                  value={generalCaption}
                  onChange={(e) => setGeneralCaption(e.target.value)}
                  placeholder="Tell your followers about this post... Add details, tags, and reviews!"
                  maxLength={4000}
                  className='w-full h-24 bg-[#1e1e1e] rounded-xl p-4 resize-none border border-white/10 focus:ring-2 focus:ring-[#fbbe15] focus:outline-none placeholder:text-zinc-500 text-white text-sm'
                  disabled={isUploading}
                />
                <span className='absolute bottom-3 right-3 text-[10px] text-zinc-500'>
                  {generalCaption.length}/4000
                </span>
              </div>
            </div>

            {/* Slide-Specific Text Overlay Caption */}
            {isImage && (
              <div className='relative mb-5 flex flex-col'>
                <h3 className='text-sm font-bold text-zinc-300 uppercase tracking-wide mb-2 flex items-center justify-between'>
                  <span>Image Slide Text Overlay {files.length > 1 && `(Slide ${activeIndex + 1} of ${files.length})`}</span>
                  {files.length > 1 && (
                    <span className='text-[10px] font-bold text-zinc-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/10'>
                      Slide {activeIndex + 1} of {files.length}
                    </span>
                  )}
                </h3>
                <div className='relative'>
                  <input
                    type='text'
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    placeholder="e.g. Buzz cut, Juicy burger, Fries (overlays in center of image)..."
                    maxLength={80}
                    className='w-full bg-[#1e1e1e] rounded-xl p-3.5 border border-white/10 focus:ring-2 focus:ring-[#fbbe15] focus:outline-none placeholder:text-zinc-500 text-white text-sm pr-16'
                    disabled={isUploading}
                  />
                  <span className='absolute right-4 top-3.5 text-[10px] text-zinc-500'>
                    {description.length}/80
                  </span>
                </div>
              </div>
            )}

            {isImage && files.length > 1 && (
              <div className='bg-[#fbbe15]/10 border border-[#fbbe15]/20 rounded-xl p-4 mb-4 flex flex-col gap-3'>
                <p className='text-zinc-300 text-xs font-semibold leading-relaxed'>
                <strong>Multi-Image Tip:</strong> You can add a different text overlay caption centered on each image slide! Switch slides using the controls below or by swiping the preview image.
                </p>
                <div className='flex items-center justify-between border-t border-[#fbbe15]/15 pt-2.5'>
                  <button
                    onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeIndex === 0}
                    className='px-3.5 py-2 text-xs font-bold text-white bg-white/10 border border-white/10 rounded-lg hover:bg-white/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs'
                  >
                    ← Prev Slide
                  </button>
                  <span className='text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-full border border-white/10'>
                    Slide {activeIndex + 1} of {files.length}
                  </span>
                  <button
                    onClick={() => setActiveIndex((prev) => Math.min(files.length - 1, prev + 1))}
                    disabled={activeIndex === files.length - 1}
                    className='px-3.5 py-2 text-xs font-bold text-white bg-white/10 border border-white/10 rounded-lg hover:bg-white/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs'
                  >
                    Next Slide →
                  </button>
                </div>
              </div>
            )}

            <div className='flex gap-4 mb-6'>
              <button
                onClick={() => {
                  setShowLocations(!showLocations);
                  setShowUsers(false);
                }}
                disabled={isUploading}
                className={cn(
                  'flex items-center gap-1.5 text-xs font-bold transition-colors disabled:opacity-50',
                  showLocations ? 'text-[#fbbe15]' : 'text-[#1a1a1a]',
                )}>
                <MapPin size={16} />
                Add Location
              </button>
              <Drawer open={showUsers} onOpenChange={setShowUsers}>
                <DrawerTrigger asChild>
                  <button
                    onClick={() => {
                      setShowUsers(true);
                      setShowLocations(false);
                    }}
                    disabled={isUploading}
                    className={cn(
                      'flex items-center gap-1.5 text-xs font-bold transition-colors disabled:opacity-50',
                      showUsers ? 'text-[#fbbe15]' : 'text-[#1a1a1a]',
                    )}>
                    <RiRestaurant2Fill size={16} />
                    Tag Buka
                  </button>
                </DrawerTrigger>
                <DrawerContent className='bg-[#18181b] border-white/10 text-white h-[70vh] w-full md:w-[40%] mx-auto'>
                  <DrawerHeader className='border-b border-white/10'>
                    <DrawerTitle className='text-center font-bold text-lg text-white'>
                      Buka Restaurants
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className='p-4 flex flex-col gap-4 overflow-hidden h-full'>
                    {/* Search Bar */}
                    <div className='relative'>
                      <SearchIcon
                        className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400'
                        size={18}
                      />
                      <input
                        type='text'
                        placeholder='Search restaurants...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full bg-[#242428] rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#fbbe15] border border-white/10'
                      />
                    </div>

                    {/* Restaurants List */}
                    <div className='flex-1 overflow-y-auto space-y-2 mt-2 pb-20'>
                      {isLoadingRestaurants ? (
                        <div className='flex justify-center py-10'>
                          <Loader2 className='w-6 h-6 animate-spin text-[#fbbe15]' />
                        </div>
                      ) : displayedRestaurants.length > 0 ? (
                        displayedRestaurants.map((r: any) => (
                          <button
                            key={r.id}
                            onClick={() => {
                              handleSelectRestaurant({id: r.id, name: r.name});
                            }}
                            className='w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors text-left border border-transparent hover:border-white/10'>
                            <div className='w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0 relative'>
                              <Image
                                src={
                                  r.photos?.[0] ||
                                  '/images/placeholder-restaurant.png'
                                }
                                alt={r.name}
                                fill
                                className='object-cover'
                              />
                            </div>
                            <div className='flex flex-col'>
                              <span className='font-bold text-white'>
                                {r.name}
                              </span>
                              <span className='text-xs text-zinc-400 line-clamp-1'>
                                {r.address}
                              </span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className='text-center py-10 text-zinc-400 text-sm'>
                          No restaurants found
                        </div>
                      )}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>

              <button
                onClick={handleHashtagClick}
                disabled={isUploading}
                className='flex items-center gap-1.5 text-xs font-bold text-[#1a1a1a] disabled:opacity-50 cursor-pointer'>
                <Hash size={16} />
                Hashtags
              </button>
            </div>

            {/* Selected Tags Display */}
            {(selectedLocations.length > 0 || selectedRestaurant) && (
              <div className='flex flex-col gap-3 mb-6'>
                {selectedLocations.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {selectedLocations.map((loc) => (
                      <div
                        key={loc}
                        className='flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-xs font-medium border border-orange-100'>
                        <MapPin size={12} className='shrink-0' />
                        <span>{loc}</span>
                        <button
                          onClick={() => handleRemoveLocation(loc)}
                          className='ml-1 hover:bg-orange-100 rounded-full p-0.5 transition-colors'
                          disabled={isUploading}>
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedRestaurant && (
                  <div className='flex flex-wrap gap-2'>
                    <div className='flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100'>
                      <Tag size={12} className='shrink-0' />
                      <span>{selectedRestaurant.name}</span>
                      <button
                        onClick={handleRemoveRestaurant}
                        className='ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors'
                        disabled={isUploading}>
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className='mt-auto space-y-3'>
              <button
                onClick={() =>
                  onPost({
                    description: generalCaption,
                    imageCaptions: captions,
                    tags: extractHashtags(generalCaption),
                    location: selectedLocations[0],
                    restaurantId: selectedRestaurant?.id,
                  })
                }
                className='w-full py-3 bg-[#fbbe15] text-[#1a1a1a] font-bold rounded-xl hover:bg-[#e5ac10] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={isUploading}>
                {isUploading ? (
                  <Loader2 className='w-5 h-5 animate-spin' />
                ) : (
                  submitText
                )}
              </button>
              <button
                onClick={onDiscard}
                disabled={isUploading}
                className='w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
                Discard
              </button>
            </div>

            {/* Dropdowns positioned absolutely within the column */}
            {showLocations && (
              <div className='absolute top-[280px] left-0 z-20 w-64 bg-[#18181b] border border-[#fbbe15]/40 text-white rounded-xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
                <div className='flex justify-between items-center mb-3'>
                  <h3 className='font-bold text-white text-sm'>
                    Locations
                  </h3>
                  <button
                    onClick={() => setShowLocations(false)}
                    className='text-zinc-400 hover:text-white'>
                    <X size={14} />
                  </button>
                </div>
                <div className='mb-2'>
                  <input
                    type='text'
                    placeholder='Search or add custom location...'
                    value={locationSearchTerm}
                    onChange={(e) => setLocationSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && locationSearchTerm.trim()) {
                        e.preventDefault();
                        handleAddLocation(locationSearchTerm.trim());
                        setLocationSearchTerm('');
                      }
                    }}
                    className='w-full text-xs p-2 bg-[#242428] text-white rounded-md border border-white/10 focus:ring-1 focus:ring-[#fbbe15] outline-none placeholder:text-zinc-500'
                  />
                </div>
                <div className='space-y-1 max-h-48 overflow-y-auto'>
                  {filteredLocations.map((loc: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleAddLocation(loc.name)}
                      className={cn(
                        'w-full text-left flex flex-col p-2 rounded transition-colors cursor-pointer',
                        loc.isCurrent
                          ? 'bg-[#fbbe15]/10 hover:bg-[#fbbe15]/20 border border-[#fbbe15]/30 mb-1'
                          : 'hover:bg-white/5'
                      )}>
                      <div className='flex items-center justify-between w-full'>
                        <span className='text-xs font-bold text-white flex items-center gap-1.5'>
                          {loc.isCurrent && (
                            <MapPin className='w-3.5 h-3.5 text-[#fbbe15] fill-[#fbbe15] shrink-0' />
                          )}
                          {loc.name}
                        </span>
                        {loc.isCurrent && (
                          <span className='text-[9px] font-extrabold uppercase text-[#b88300] bg-[#fbbe15]/25 px-1.5 py-0.5 rounded-full shrink-0'>
                            Current Location
                          </span>
                        )}
                      </div>
                      {loc.address && !loc.isCurrent && (
                        <span className='text-[10px] text-zinc-500'>
                          {loc.address}
                        </span>
                      )}
                    </button>
                  ))}
                  {filteredLocations.length === 0 &&
                    locationSearchTerm.trim() && (
                      <div className='p-2 text-center'>
                        <span className='text-xs text-zinc-500'>
                          Press Enter to add &quot;{locationSearchTerm}&quot;
                        </span>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Video Preview */}
          <div className='w-full lg:w-[320px] bg-black rounded-2xl overflow-hidden relative aspect-9/16 lg:aspect-auto h-[500px] group'>
            {isLoading && !isImage && (
              <div className='absolute inset-0 flex items-center justify-center z-20 bg-black/20'>
                <Loader2 className='w-10 h-10 text-white animate-spin' />
              </div>
            )}

            {isImage ? (
              <div 
                className='relative w-full h-full overflow-hidden select-none'
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Slides Flex Wrapper */}
                <div 
                  className='flex w-full h-full transition-transform duration-300 ease-out'
                  style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                  {mediaUrls.map((url, idx) => (
                    <div key={idx} className='w-full h-full flex-shrink-0 relative flex items-center justify-center bg-black'>
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className='w-full h-full object-contain'
                        draggable={false}
                      />
                      
                      {/* Text overlay in the middle of the image */}
                      {captions[idx] && (
                        <div className='absolute inset-0 flex items-center justify-center p-4 pointer-events-none z-10 select-none'>
                          <span 
                            className='text-white font-extrabold text-xl text-center break-words drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-sans max-w-[90%]'
                            style={{ textShadow: '0px 0px 4px rgba(0,0,0,1), -1px -1px 0px rgba(0,0,0,1), 1px -1px 0px rgba(0,0,0,1), -1px 1px 0px rgba(0,0,0,1), 1px 1px 0px rgba(0,0,0,1)' }}
                          >
                            {captions[idx]}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Left/Right Navigation Chevrons */}
                {files.length > 1 && (
                  <>
                    {activeIndex > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex((prev) => prev - 1);
                        }}
                        className='absolute left-2.5 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white border-none cursor-pointer z-20 transition-all hover:scale-105 active:scale-95'
                        aria-label='Previous slide'
                      >
                        <ChevronLeft size={20} />
                      </button>
                    )}
                    {activeIndex < files.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex((prev) => prev + 1);
                        }}
                        className='absolute right-2.5 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white border-none cursor-pointer z-20 transition-all hover:scale-105 active:scale-95'
                        aria-label='Next slide'
                      >
                        <ChevronRight size={20} />
                      </button>
                    )}

                    {/* Add Image slide button */}
                    {isImage && onAddFiles && (
                      <>
                        <input
                          ref={fileInputRef}
                          type='file'
                          multiple
                          accept='image/*'
                          onChange={handleFileInputChange}
                          className='hidden'
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className='absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-2 rounded-lg border border-white/10 transition-all active:scale-95 cursor-pointer pointer-events-auto'
                          aria-label='Add more images'
                        >
                          <PlusCircle size={14} />
                          <span>Add Image</span>
                        </button>
                      </>
                    )}

                    {/* Remove Image slide button */}
                    {isImage && onRemoveFile && (
                      <button
                        onClick={handleRemove}
                        className='absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-red-600/70 hover:bg-red-600/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-2 rounded-lg border border-red-500/20 transition-all active:scale-95 cursor-pointer pointer-events-auto shadow-sm'
                        aria-label='Delete this image'
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    )}

                    {/* Dots Carousel Indicators */}
                    <div className='absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-black/40 px-2.5 py-1.5 rounded-full backdrop-blur-xs'>
                      {files.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveIndex(idx);
                          }}
                          className={cn(
                            'w-1.5 h-1.5 rounded-full border-none p-0 cursor-pointer transition-all',
                            idx === activeIndex ? 'bg-[#fbbe15] scale-110' : 'bg-white/50 hover:bg-white/80'
                          )}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              mediaUrls[0] ? (
                <video
                  ref={videoRef}
                  src={mediaUrls[0]}
                  className='w-full h-full object-cover'
                  loop
                  autoPlay
                  muted={isMuted} // Controlled by state
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onWaiting={() => setIsLoading(true)}
                  onPlaying={() => setIsLoading(false)}
                  onLoadedData={() => setIsLoading(false)}
                />
              ) : null
            )}

            {/* Overlay UI */}
            <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4 z-10 text-white'>
              <div className='flex items-center gap-2 mb-2'>
                <div className='font-bold text-sm'>You</div>
              </div>
              <div className='text-xs opacity-80 mb-3 line-clamp-2'>
                {generalCaption || 'Description preview...'}
              </div>

              {/* Progress Bar & Stats (Hide for images) */}
              {!isImage && (
                <>
                  <div className='h-1 bg-white/30 rounded-full overflow-hidden mb-2'>
                    <div
                      className='h-full bg-white rounded-full transition-all duration-100 ease-linear'
                      style={{width: `${progress}%`}}
                    />
                  </div>

                  <div className='flex justify-between items-center text-xs font-mono'>
                    <span>{duration}</span>
                    <div className='flex gap-2'>
                      <button
                        onClick={toggleMute}
                        className='p-1 hover:bg-white/10 rounded-full transition-colors'>
                        {isMuted ? (
                          <VolumeX size={16} />
                        ) : (
                          <Volume2 size={16} />
                        )}
                      </button>
                      <button className='p-1 hover:bg-white/10 rounded-full transition-colors'>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
