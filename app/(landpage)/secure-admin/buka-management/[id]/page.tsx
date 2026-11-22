'use client';

import { useState } from 'react';
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
import { useParams } from 'next/navigation';
import {
  useRestaurant,
  useUpdateRestaurantStatus,
} from '@/lib/api/services/restaurants.hooks';
import { useToast } from '@/hooks/use-toast';
import { RestaurantAdminControlPanel } from '@/components/admin/buka-management/RestaurantAdminControlPanel';
import { DeleteRestaurantModal } from '@/components/admin/buka-management/DeleteRestaurantModal';
import { SuspendRestaurantModal } from '@/components/admin/buka-management/SuspendRestaurantModal';
import { RejectRestaurantModal } from '@/components/admin/buka-management/RejectRestaurantModal';

export default function BukaDetails() {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const params = useParams();
  const id = params?.id as string;

  const { data: restaurant, isLoading, isError, error, refetch } = useRestaurant(id);
  const updateStatusMutation = useUpdateRestaurantStatus();
  const { toast } = useToast();

  const handleUpdateStatus = async (newStatus: string, reason?: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
        data: {
          status: newStatus,
          reason: reason || `Admin action: set to ${newStatus}`,
        },
      });
      toast({
        title: `Restaurant ${newStatus}`,
        description: `Restaurant status has been updated to ${newStatus}.`,
      });
      setIsRejectModalOpen(false);
      setIsSuspendModalOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Action Error',
        description: error?.response?.data?.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[#fbbe15] w-8 h-8" />
      </div>
    );
  }

  if (isError || !restaurant) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Link
          href="/secure-admin/buka-management"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Management
        </Link>
        <div className="p-12 text-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xs">
          <div className="text-red-400 mb-4 flex justify-center">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Restaurant not found or API Error
          </h2>
          <p className="text-gray-500 mb-4 text-sm">
            We tried to fetch ID: <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{id}</span>
          </p>
          {isError && (
            <div className="max-w-md mx-auto p-3 bg-red-50 text-red-600 rounded text-xs font-mono text-left break-all">
              {error instanceof Error ? error.message : 'Possible network error or invalid ID.'}
            </div>
          )}
        </div>
      </div>
    );
  }

  const badgeStatus =
    restaurant.status === 'approved' ? 'Active' : restaurant.status || 'Pending';

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 font-sans pb-16">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
        <Link
          href="/secure-admin/buka-management"
          className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Buka Management
        </Link>
        <span className="text-gray-400 dark:text-gray-600">/</span>
        <span className="font-semibold text-[#1e293b] dark:text-white truncate max-w-sm">
          {restaurant.name}
        </span>
      </div>

      {/* Prominent Admin Control Panel */}
      <RestaurantAdminControlPanel
        restaurant={restaurant}
        onApprove={() => handleUpdateStatus('approved')}
        onOpenSuspend={() => setIsSuspendModalOpen(true)}
        onOpenReject={() => setIsRejectModalOpen(true)}
        onOpenDelete={() => setIsDeleteModalOpen(true)}
        isUpdating={updateStatusMutation.isPending}
      />

      {/* Main Restaurant Info Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xs p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
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
              <div className="w-full lg:w-[45%]">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xs border border-gray-100 dark:border-gray-800 select-none">
                  <Image
                    key={activePhoto}
                    src={photos[activePhoto]}
                    alt={`${restaurant.name} photo ${activePhoto + 1}`}
                    fill
                    unoptimized
                    className="object-cover transition-opacity duration-300"
                  />

                  {/* Prev / Next buttons */}
                  {total > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xs text-white hover:bg-black/60 transition-colors cursor-pointer z-10"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xs text-white hover:bg-black/60 transition-colors cursor-pointer z-10"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}

                  {/* Dot indicators */}
                  {total > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full z-10">
                      {photos.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActivePhoto(i)}
                          className={`rounded-full transition-all cursor-pointer ${
                            i === activePhoto ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Counter badge */}
                  {total > 1 && (
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full z-10">
                      {activePhoto + 1} / {total}
                    </div>
                  )}
                </div>

                {/* Thumbnail strip */}
                {total > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {photos.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActivePhoto(i)}
                        className={`relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          i === activePhoto ? 'border-[#fbbe15]' : 'border-transparent opacity-60 hover:opacity-90'
                        }`}
                      >
                        <Image src={src} alt={`thumb ${i + 1}`} fill unoptimized className="object-cover" sizes="56px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Right: Details */}
          <div className="w-full lg:w-[55%] flex flex-col pt-2">
            {/* Header: Name & Tags */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Utensils size={24} className="text-[#1e293b] dark:text-white" strokeWidth={2.5} />
                <h2 className="text-[26px] font-bold text-[#1e293b] dark:text-white leading-tight truncate">
                  {restaurant.name}
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                    badgeStatus === 'Active'
                      ? 'text-white bg-green-500'
                      : 'text-[#D39B0A] dark:text-[#fbbe15] bg-[#FCF7E8] dark:bg-yellow-950/40'
                  }`}
                >
                  <span className="w-2 h-2 border border-current rounded-full" />
                  {badgeStatus}
                </span>
              </div>
            </div>

            <span className="px-3 py-1 text-[#D39B0A] dark:text-[#fbbe15] text-xs font-semibold rounded-full capitalize w-fit bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
              {restaurant.cuisine ? restaurant.cuisine.split(',').join(', ') : 'Cuisine'}
            </span>

            {/* Address */}
            <div className="flex items-start gap-2 text-[#4b5563] dark:text-gray-300 mb-6 mt-3">
              <MapPin size={20} className="text-[#fbbe15] mt-1 shrink-0" />
              <span className="text-[16px] leading-snug">{restaurant.address}</span>
            </div>

            {/* Ratings Badge */}
            <div className="bg-[#0f172a] dark:bg-gray-800 rounded-xl p-4 flex items-center gap-6 mb-8 w-fit text-sm">
              <div className="flex items-center gap-1.5 text-white">
                <span className="text-[#fbbe15] font-bold">{restaurant.googleRating?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-300">Google</span>
              </div>
              <div className="flex items-center gap-1.5 text-white">
                <span className="text-[#fbbe15] font-bold">{restaurant.avgRating?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-300">Avg Rating</span>
              </div>
              <div className="flex items-center gap-1.5 text-white">
                <span className="text-[#fbbe15] font-bold">{restaurant.reviewCount || '0'}</span>
                <span className="text-gray-300">Reviews</span>
              </div>
            </div>

            {/* Additional Info Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Phone size={16} className="text-gray-400" />
                <span>{restaurant.phone || 'No phone listed'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Globe size={16} className="text-gray-400" />
                <a
                  className="truncate text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={restaurant.website || 'https://www.localbuka.com'}
                >
                  {restaurant.website || 'Website listed'}
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Clock size={16} className="text-gray-400" />
                <span className="capitalize">{restaurant.status || 'Pending'}</span>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex justify-start">
              <div className="text-[15px] font-semibold text-[#1e293b] dark:text-white mr-8 mt-1 shrink-0">
                Hours:
              </div>
              <div className="flex flex-col gap-2.5 text-[14px]">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const hours = (
                    restaurant.openingHours as Record<string, string> | null | undefined
                  )?.[day];
                  return (
                    <div key={day} className="flex gap-12">
                      <span className="text-gray-400 dark:text-gray-500 w-24 capitalize">{day}</span>
                      {hours ? (
                        <span className="text-[#1e293b] dark:text-gray-200 font-medium">{hours}</span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600 font-medium italic">Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isDeleteModalOpen && (
        <DeleteRestaurantModal
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          redirectAfterDelete={true}
        />
      )}

      {isSuspendModalOpen && (
        <SuspendRestaurantModal
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          isOpen={isSuspendModalOpen}
          onClose={() => setIsSuspendModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}

      {isRejectModalOpen && (
        <RejectRestaurantModal
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
