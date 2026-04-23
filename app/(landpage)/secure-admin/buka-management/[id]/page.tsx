'use client';

import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  MapPin,
  Utensils,
  Loader2,
  Phone,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {RejectBukaModal} from '@/components/admin/ui/RejectBukaModal';
import {SuspendAccountModal} from '@/components/admin/ui/SuspendAccountModal';
import {useParams} from 'next/navigation';
import {
  useRestaurant,
  useUpdateRestaurantStatus,
} from '@/lib/api/services/restaurants.hooks';
import {useToast} from '@/hooks/use-toast';

export default function BukaDetails() {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const params = useParams();
  const id = params?.id as string;

  const {data: restaurant, isLoading, isError, error} = useRestaurant(id);
  const updateStatusMutation = useUpdateRestaurantStatus();
  const {toast} = useToast();

  const handleUpdateStatus = async (newStatus: string, reason?: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
        data: {
          status: newStatus, 
          reason: reason || 'Standard moderation',
        },
      });
      toast({
        title: 'Success',
        description: `Restaurant is now ${newStatus}.`,
      });
      setIsRejectModalOpen(false);
      setIsSuspendModalOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error?.response?.data?.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Loader2 className='animate-spin text-[#fbbe15] w-8 h-8' />
      </div>
    );
  }

  if (isError || !restaurant) {
    return (
      <div className='max-w-6xl mx-auto p-6 space-y-6'>
        <Link
          href='/secure-admin/buka-management'
          className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors'>
          <ArrowLeft size={16} /> Back to Management
        </Link>
        <div className='p-12 text-center bg-white border border-gray-100 rounded-2xl shadow-sm'>
          <div className='text-red-400 mb-4 flex justify-center'>
            <AlertCircle size={48} />
          </div>
          <h2 className='text-xl font-bold text-gray-800 mb-2'>
            Restaurant not found or API Error
          </h2>
          <p className='text-gray-500 mb-4 text-sm'>
            We tried to fetch ID:{' '}
            <span className='font-mono font-medium text-gray-700'>{id}</span>
          </p>
          {isError && (
            <div className='max-w-md mx-auto p-3 bg-red-50 text-red-600 rounded text-xs font-mono text-left break-all'>
              {error instanceof Error
                ? error.message
                : 'Possible network error or invalid ID.'}
            </div>
          )}
        </div>
      </div>
    );
  }

  const badgeStatus =
    restaurant.status === 'approved'
      ? 'Active'
      : restaurant.status || 'Pending';

  return (
    <div className='max-w-6xl mx-auto flex flex-col gap-6 font-sans'>
      {/* Breadcrumbs */}
      <div className='flex items-center gap-2 text-sm text-gray-500 mt-2'>
        <Link
          href='/secure-admin/buka-management'
          className='flex items-center gap-1 hover:text-gray-900 transition-colors'>
          <ArrowLeft size={16} />
          Buka Management
        </Link>
        <span className='text-gray-400'>/</span>
        <span className='font-semibold text-[#1e293b]'>{restaurant.name}</span>
      </div>

      <div className='flex justify-between items-end mb-2'>
        <h1 className='text-[24px] font-bold text-[#1e293b]'>
          {restaurant.name}
        </h1>
        <div className='flex flex-col items-end gap-1'>
          <span className='text-[10px] text-gray-400 uppercase tracking-widest font-semibold'>
            User ID: {restaurant.owner?.id || 'N/A'}
          </span>
          <span className='text-[10px] text-gray-400 lowercase tracking-wide font-medium'>
            {restaurant.owner?.email || 'N/A'}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className='bg-white border border-gray-100 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left: Image Carousel */}
          {(() => {
            const photos: string[] =
              restaurant.photos && restaurant.photos.length > 0
                ? restaurant.photos
                : ['/images/restaurantImage.png'];
            const total = photos.length;
            const prev = () => setActivePhoto((p) => (p - 1 + total) % total);
            const next = () => setActivePhoto((p) => (p + 1) % total);
            return (
              <div className='w-full lg:w-[45%]'>
                <div className='relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-50 select-none'>
                  <Image
                    key={activePhoto}
                    src={photos[activePhoto]}
                    alt={`${restaurant.name} photo ${activePhoto + 1}`}
                    fill
                    className='object-cover transition-opacity duration-300'
                  />

                  {/* Prev / Next buttons */}
                  {total > 1 && (
                    <>
                      <button
                        onClick={prev}
                        className='absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors border-none cursor-pointer z-10'>
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={next}
                        className='absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors border-none cursor-pointer z-10'>
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}

                  {/* Dot indicators */}
                  {total > 1 && (
                    <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full z-10'>
                      {photos.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePhoto(i)}
                          className={`rounded-full transition-all border-none cursor-pointer ${
                            i === activePhoto
                              ? 'w-4 h-2 bg-white'
                              : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Counter badge */}
                  {total > 1 && (
                    <div className='absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full z-10'>
                      {activePhoto + 1} / {total}
                    </div>
                  )}
                </div>

                {/* Thumbnail strip */}
                {total > 1 && (
                  <div className='flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide'>
                    {photos.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhoto(i)}
                        className={`relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          i === activePhoto
                            ? 'border-[#fbbe15]'
                            : 'border-transparent opacity-60 hover:opacity-90'
                        }`}>
                        <Image
                          src={src}
                          alt={`thumb ${i + 1}`}
                          fill
                          className='object-cover'
                          sizes='56px'
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Right: Details */}
          <div className='w-full lg:w-[55%] flex flex-col pt-2'>
            {/* Header: Name & Tags */}
            <div className='flex items-center gap-4 mb-4'>
              <div className='flex items-center gap-2'>
                <Utensils
                  size={24}
                  className='text-[#1e293b]'
                  strokeWidth={2.5}
                />
                <h2 className='text-[26px] font-bold text-[#1e293b] leading-tight truncate'>
                  {restaurant.name}
                </h2>
              </div>
              <div className='flex items-center gap-2 shrink-0'>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 
                  ${badgeStatus === 'Active' ? 'text-white bg-green-500' : 'text-[#D39B0A] bg-[#FCF7E8]'}
                  `}>
                  <span className='w-2 h-2 border border-current rounded-full' />
                  {badgeStatus}
                </span>
              </div>
            </div>
            <span className='px-3 py-1 text-[#D39B0A] text-xs font-semibold rounded-full capitalize'>
              {restaurant.cuisine.split(',').join(', ') || 'Cuisine'}
            </span>

            {/* Address */}
            <div className='flex items-start gap-2 text-[#4b5563] mb-6'>
              <MapPin size={20} className='text-[#fbbe15] mt-1 shrink-0' />
              <span className='text-[17px] leading-snug'>
                {restaurant.address}
              </span>
            </div>

            {/* Ratings Badge */}
            <div className='bg-[#0f172a] rounded-xl p-4 flex items-center gap-6 mb-8 w-fit text-sm'>
              <div className='flex items-center gap-1.5 text-white'>
                <span className='text-[#fbbe15] font-bold'>
                  {restaurant.googleRating?.toFixed(1) || '0.0'}
                </span>
                <span className='text-gray-300'>Google</span>
              </div>
              <div className='flex items-center gap-1.5 text-white'>
                <span className='text-[#fbbe15] font-bold'>
                  {restaurant.avgRating?.toFixed(1) || '0.0'}
                </span>
                <span className='text-gray-300'>Avg Rating</span>
              </div>
              <div className='flex items-center gap-1.5 text-white'>
                <span className='text-[#fbbe15] font-bold'>
                  {restaurant.reviewCount || '0'}
                </span>
                <span className='text-gray-300'>Reviews</span>
              </div>
            </div>

            {/* Additional Info Grid */}
            <div className='grid grid-cols-2 gap-y-4 gap-x-8 text-sm border-b border-gray-50 pb-6 mb-6'>
              <div className='flex items-center gap-3 text-gray-600'>
                <Phone size={16} className='text-gray-400' />
                <span>{restaurant.phone || 'No phone listed'}</span>
              </div>
              <div className='flex items-center gap-3 text-gray-600'>
                <Globe size={16} className='text-gray-400' />
                <a
                  className='truncate text-primary'
                  target='_blank'
                  href={restaurant.website || 'www.localbuka.com'}>
                  {restaurant.website}
                </a>
              </div>
              <div className='flex items-center gap-3 text-gray-600'>
                <Clock size={16} className='text-gray-400' />
                <span className='capitalize'>
                  {restaurant.status || 'Pending'}
                </span>
              </div>
            </div>

            {/* Opening Hours */}
            <div className='flex justify-start'>
              <div className='text-[15px] font-semibold text-[#1e293b] mr-8 mt-1 shrink-0'>
                Hours:
              </div>
              <div className='flex flex-col gap-3 text-[15px]'>
                {[
                  'monday',
                  'tuesday',
                  'wednesday',
                  'thursday',
                  'friday',
                  'saturday',
                  'sunday',
                ].map((day) => {
                  const hours = (
                    restaurant.openingHours as
                      | Record<string, string>
                      | null
                      | undefined
                  )?.[day];
                  return (
                    <div key={day} className='flex gap-16'>
                      <span className='text-gray-400 w-24 capitalize'>
                        {day}
                      </span>
                      {hours ? (
                        <span className='text-[#1e293b] font-medium'>
                          {hours}
                        </span>
                      ) : (
                        <span className='text-gray-300 font-medium italic'>
                          Closed
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className='flex justify-end mt-12 gap-4 border-t border-gray-100 pt-8'>
          {restaurant.status === 'pending' ||
          restaurant.status === 'suspended' ? (
            <>
              <button
                onClick={() => setIsRejectModalOpen(true)}
                disabled={updateStatusMutation.isPending}
                className='flex items-center gap-2 px-6 py-2.5 bg-[#FEF2F2] text-[#EF4444] hover:bg-[#fee2e2] transition-colors rounded-xl text-sm font-semibold disabled:opacity-50'>
                <XCircle size={16} strokeWidth={3} />
                Reject
              </button>
              <button
                onClick={() => handleUpdateStatus('approved')}
                disabled={updateStatusMutation.isPending}
                className='flex items-center gap-2 px-6 py-2.5 bg-[#F0FDF4] text-[#22C55E] hover:bg-[#dcfce7] transition-colors rounded-xl text-sm font-semibold disabled:opacity-50'>
                {updateStatusMutation.isPending ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <CheckCircle size={16} strokeWidth={3} />
                )}
                Approve
              </button>
            </>
          ) : (
            <div className='flex items-center gap-4'>
              <div
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold border ${restaurant.status === 'approved' ? 'bg-[#F0FDF4] text-[#22C55E] border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                {restaurant.status === 'approved' ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                {restaurant.status === 'approved'
                  ? 'Active on Dashboard'
                  : 'Rejected Listing'}
              </div>
              {restaurant.status === 'approved' && (
                <button
                  onClick={() => setIsSuspendModalOpen(true)}
                  className='px-6 py-2.5 text-xs text-gray-400 hover:text-red-500 font-medium transition-colors'>
                  Suspend Restaurant
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <RejectBukaModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onReject={(reason) => handleUpdateStatus('rejected', reason)}
        restaurantName={restaurant.name}
      />

      <SuspendAccountModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onSuspend={(reason) => handleUpdateStatus('suspended', reason)}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
