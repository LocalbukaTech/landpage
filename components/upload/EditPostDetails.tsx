'use client';

import {useRef, useState, useEffect, useMemo} from 'react';
import Image from 'next/image';
import {
  Hash,
  Loader2,
  MapPin,
  Search as SearchIcon,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {cn, ensureHttps} from '@/lib/utils';
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
import {RiRestaurant2Fill} from 'react-icons/ri';
import type {Post} from '@/types/post';

interface EditPostDetailsProps {
  post: Post;
  isSaving: boolean;
  onSave: (data: {
    caption: string;
    imageCaptions?: string[];
    tags: string[];
    location?: string;
    restaurantId?: string | null;
  }) => void;
  onCancel: () => void;
}

export function EditPostDetails({post, isSaving, onSave, onCancel}: EditPostDetailsProps) {
  const isImage = post.mediaType === 'image';

  const mediaUrls = useMemo(() => {
    if (post.mediaUrls && post.mediaUrls.length > 0) return post.mediaUrls;
    if (post.mediaUrl) return [post.mediaUrl];
    return [];
  }, [post]);

  const totalSlides = mediaUrls.length;
  const [activeIndex, setActiveIndex] = useState(0);

  const [captions, setCaptions] = useState<string[]>(() => {
    if (isImage && post.imageCaptions && post.imageCaptions.length > 0) return post.imageCaptions;
    return isImage ? Array(totalSlides).fill('') : [];
  });
  const [generalCaption, setGeneralCaption] = useState(post.caption || '');
  const [selectedLocations, setSelectedLocations] = useState<string[]>(() =>
    post.location ? [post.location] : []
  );
  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    id: string;
    name: string;
  } | null>(post.restaurant ? {id: post.restaurant.id, name: post.restaurant.name} : null);

  const {user: _authUser} = useAuth();
  const {lat, lng} = useGeolocation();
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lng) return;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then((r) => r.json())
      .then((data) => {
        const area = data.address?.suburb || data.address?.neighbourhood || data.address?.quarter || '';
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state || '';
        const country = data.address?.country || '';
        const mainLoc = [area || city, country].filter(Boolean).join(', ');
        if (mainLoc) setCurrentLocation(mainLoc);
      })
      .catch(() => {});
  }, [lat, lng]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStart = useRef<number | null>(null);

  const [showLocations, setShowLocations] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [tagInput, setTagInput] = useState('');

  const [restaurantSearch, setRestaurantSearch] = useState('');
  const {data: restaurantData} = useRestaurants({
    search: restaurantSearch || undefined,
    page: 1,
    pageSize: 10,
  });
  const restaurants = useMemo(() => {
    const raw = (restaurantData as any)?.data || restaurantData;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.restaurants)) return raw.restaurants;
    return [];
  }, [restaurantData]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (diff > threshold && activeIndex < totalSlides - 1) {
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

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((tag) => tag !== t));
  };

  const handleSave = () => {
    onSave({
      caption: generalCaption,
      imageCaptions: isImage ? captions : undefined,
      tags,
      location: selectedLocations[0] || '',
      restaurantId: selectedRestaurant ? selectedRestaurant.id : null,
    });
  };

  return (
    <div className='w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200'>
      {/* MEDIA PREVIEW */}
      <div className='relative bg-[#121217] border border-white/10 rounded-2xl overflow-hidden'>
        <div
          className='relative w-full aspect-square max-h-[500px] overflow-hidden'
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {mediaUrls.length > 0 && (
            isImage ? (
              <Image
                src={ensureHttps(mediaUrls[activeIndex])}
                alt={`Slide ${activeIndex + 1}`}
                fill
                className='object-cover'
                unoptimized
              />
            ) : (
              <video
                ref={videoRef}
                src={ensureHttps(mediaUrls[0])}
                className='w-full h-full object-cover'
                autoPlay
                loop
                muted={isMuted}
                playsInline
              />
            )
          )}

          {isImage && totalSlides > 1 && (
            <>
              {activeIndex > 0 && (
                <button
                  onClick={() => setActiveIndex((p) => p - 1)}
                  className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1.5 text-white hover:bg-black/70 transition-all z-10'
                >
                  <ChevronLeft className='w-5 h-5' />
                </button>
              )}
              {activeIndex < totalSlides - 1 && (
                <button
                  onClick={() => setActiveIndex((p) => p + 1)}
                  className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1.5 text-white hover:bg-black/70 transition-all z-10'
                >
                  <ChevronRight className='w-5 h-5' />
                </button>
              )}
            </>
          )}

          {!isImage && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className='absolute bottom-3 right-3 bg-black/60 rounded-full p-2 text-white z-10'
            >
              {isMuted ? <VolumeX className='w-4 h-4' /> : <Volume2 className='w-4 h-4' />}
            </button>
          )}
        </div>

        {isImage && totalSlides > 1 && (
          <div className='flex justify-center gap-1.5 py-2'>
            {Array.from({length: totalSlides}).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  i === activeIndex ? 'bg-[#FBBE15] w-3' : 'bg-white/30'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* FORM FIELDS */}
      <div className='space-y-4'>
        {/* General Caption */}
        <div className='bg-[#121217] border border-white/10 rounded-2xl p-4'>
          <label className='text-xs font-semibold text-zinc-400 mb-2 block'>Caption</label>
          <textarea
            value={generalCaption}
            onChange={(e) => setGeneralCaption(e.target.value)}
            placeholder='Write a caption...'
            className='w-full bg-transparent text-white text-sm resize-none outline-none min-h-[80px] placeholder:text-zinc-600'
            maxLength={2200}
          />
          <div className='text-right text-[10px] text-zinc-600'>{generalCaption.length}/2200</div>
        </div>

        {/* Per-image caption */}
        {isImage && totalSlides > 1 && (
          <div className='bg-[#121217] border border-white/10 rounded-2xl p-4'>
            <label className='text-xs font-semibold text-zinc-400 mb-2 block'>
              Image {activeIndex + 1} Caption
            </label>
            <textarea
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder={`Caption for image ${activeIndex + 1}...`}
              className='w-full bg-transparent text-white text-sm resize-none outline-none min-h-[60px] placeholder:text-zinc-600'
              maxLength={500}
            />
          </div>
        )}

        {/* Tags */}
        <div className='bg-[#121217] border border-white/10 rounded-2xl p-4'>
          <label className='text-xs font-semibold text-zinc-400 mb-2 flex items-center gap-1.5'>
            <Hash className='w-3.5 h-3.5' /> Tags
          </label>
          <div className='flex flex-wrap gap-2 mb-2'>
            {tags.map((tag) => (
              <span
                key={tag}
                className='bg-[#FBBE15]/10 text-[#FBBE15] text-xs px-2.5 py-1 rounded-full flex items-center gap-1'
              >
                #{tag}
                <button onClick={() => handleRemoveTag(tag)}>
                  <X className='w-3 h-3' />
                </button>
              </span>
            ))}
          </div>
          <div className='flex gap-2'>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder='Add a tag...'
              className='flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600'
            />
            <button
              onClick={handleAddTag}
              className='bg-[#FBBE15] text-[#141414] text-xs font-bold px-4 rounded-xl'
            >
              Add
            </button>
          </div>
        </div>

        {/* Location */}
        <Drawer open={showLocations} onOpenChange={setShowLocations}>
          <DrawerTrigger asChild>
            <button className='w-full bg-[#121217] border border-white/10 rounded-2xl p-4 flex items-center justify-between text-left'>
              <div className='flex items-center gap-2'>
                <MapPin className='w-4 h-4 text-zinc-400' />
                <span className='text-sm text-white'>
                  {selectedLocations.length > 0 ? selectedLocations[0] : 'Add Location'}
                </span>
              </div>
              <ChevronRight className='w-4 h-4 text-zinc-500' />
            </button>
          </DrawerTrigger>
          <DrawerContent className='bg-[#121217] border-t border-white/10'>
            <DrawerHeader>
              <DrawerTitle className='text-white'>Select Location</DrawerTitle>
            </DrawerHeader>
            <div className='p-4 space-y-3 max-h-[50vh] overflow-y-auto'>
              {currentLocation && (
                <button
                  onClick={() => {
                    setSelectedLocations([currentLocation]);
                    setShowLocations(false);
                  }}
                  className={cn(
                    'w-full text-left p-3 rounded-xl border text-sm',
                    selectedLocations.includes(currentLocation)
                      ? 'bg-[#FBBE15]/10 border-[#FBBE15] text-[#FBBE15]'
                      : 'bg-white/5 border-white/10 text-white'
                  )}
                >
                  📍 {currentLocation} (Current)
                </button>
              )}
              {selectedLocations.length > 0 && selectedLocations[0] !== currentLocation && (
                <div className='flex items-center gap-2 p-3 bg-[#FBBE15]/10 border border-[#FBBE15] rounded-xl text-sm text-[#FBBE15]'>
                  <MapPin className='w-4 h-4' />
                  {selectedLocations[0]}
                  <button onClick={() => setSelectedLocations([])} className='ml-auto'>
                    <X className='w-4 h-4' />
                  </button>
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>

        {/* Restaurant */}
        <Drawer open={showUsers} onOpenChange={setShowUsers}>
          <DrawerTrigger asChild>
            <button className='w-full bg-[#121217] border border-white/10 rounded-2xl p-4 flex items-center justify-between text-left'>
              <div className='flex items-center gap-2 pr-6'>
                <RiRestaurant2Fill className='w-4 h-4 text-zinc-400' />
                <span className='text-sm text-white truncate'>
                  {selectedRestaurant ? selectedRestaurant.name : 'Tag Restaurant'}
                </span>
              </div>
              {selectedRestaurant ? (
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRestaurant(null);
                  }}
                  className='p-1 text-zinc-400 hover:text-white rounded-full hover:bg-white/10'
                  title='Remove restaurant'
                >
                  <X className='w-4 h-4' />
                </button>
              ) : (
                <ChevronRight className='w-4 h-4 text-zinc-500' />
              )}
            </button>
          </DrawerTrigger>
          <DrawerContent className='bg-[#121217] border-t border-white/10'>
            <DrawerHeader>
              <DrawerTitle className='text-white'>Tag a Restaurant</DrawerTitle>
            </DrawerHeader>
            <div className='p-4 space-y-3'>
              <div className='relative'>
                <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500' />
                <input
                  value={restaurantSearch}
                  onChange={(e) => setRestaurantSearch(e.target.value)}
                  placeholder='Search restaurants...'
                  className='w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none'
                />
              </div>
              <div className='max-h-[40vh] overflow-y-auto space-y-2'>
                {selectedRestaurant && (
                  <div className='flex items-center gap-2 p-3 bg-[#FBBE15]/10 border border-[#FBBE15] rounded-xl text-sm text-[#FBBE15]'>
                    <RiRestaurant2Fill className='w-4 h-4' />
                    {selectedRestaurant.name}
                    <button onClick={() => setSelectedRestaurant(null)} className='ml-auto'>
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                )}
                {restaurants.map((r: any) => (
                  <button
                    key={r.id || r._id}
                    onClick={() => {
                      setSelectedRestaurant({id: r.id || r._id, name: r.name});
                      setShowUsers(false);
                    }}
                    className='w-full text-left p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10'
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* ACTION BUTTONS */}
      <div className='flex gap-3 pt-2 pb-6'>
        <button
          onClick={onCancel}
          className='flex-1 bg-white/5 border border-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/10 transition-all text-sm'
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className='flex-1 bg-[#FBBE15] text-[#141414] font-bold py-3 rounded-xl hover:bg-[#e5ab13] transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2'
        >
          {isSaving && <Loader2 className='w-4 h-4 animate-spin' />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
