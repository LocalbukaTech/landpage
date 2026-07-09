'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useState, useMemo, useEffect, useRef} from 'react';
import {useGeolocation} from '@/hooks/useGeolocation';
import {Settings, Loader2, Camera} from 'lucide-react';
import SocialModal from '../social/SocialModal';
import {IoMdShareAlt} from 'react-icons/io';
import {ShareDrawer} from '../video/ShareDrawer';
import {usePathname, useRouter} from 'next/navigation';
import {useAuth} from '@/context/AuthContext';
import {useMe, useUpdateMe} from '@/lib/api/services/auth.hooks';
import { ensureHttps, cn } from '@/lib/utils';
import {
  useFollowUser,
  useUnfollowUser,
  useFollowers,
  useFollowing,
} from '@/lib/api/services/profile.hooks';
import type {PostUser} from '@/types/post';
import type {User} from '@/lib/api/services/auth.service';
import {AvatarCropModal} from '@/components/ui/AvatarCropModal';
import {useToast} from '@/hooks/use-toast';

interface ProfileHeaderProps {
  /** For other-profile pages, pass the other user's data */
  userData?: PostUser | User | any;
  /** Total posts count */
  postsCount?: number;
  /** Total likes given, shown on other-profile */
  likesGivenCount?: number;
}

export function ProfileHeader({
  userData,
  postsCount,
  likesGivenCount = 0,
}: ProfileHeaderProps) {
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const route = usePathname();
  const router = useRouter();

  // Auth & Mutations
  const {user: authUser} = useAuth();
  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateMeMutation = useUpdateMe();
  const {updateUser} = useAuth();
  const {toast} = useToast();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setCropSrc(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async (blob: Blob) => {
    setCropSrc(null);
    setIsUpdatingAvatar(true);

    const payload = new FormData();
    payload.append('fullName', apiUser?.fullName || '');
    payload.append('bio', apiUser?.bio || '');
    payload.append('location', apiUser?.location || '');
    if (apiUser?.username) {
      payload.append('username', apiUser.username);
    }
    payload.append('avatar', blob, 'avatar.png');

    updateMeMutation.mutate(payload as any, {
      onSuccess: (response: any) => {
        setIsUpdatingAvatar(false);
        const updatedUser = response?.data?.data || response?.data;
        if (updatedUser) {
          updateUser(updatedUser);
        }
        toast({
          title: 'Avatar Updated',
          description: 'Your profile picture has been updated successfully.',
          variant: 'success',
        });
      },
      onError: (err: any) => {
        setIsUpdatingAvatar(false);
        toast({
          title: 'Update Failed',
          description: err?.response?.data?.message || 'Unable to update avatar. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  const {data: meResponse, isLoading: isLoadingMe} = useMe();
  const meData =
    (meResponse as any)?.data?.data || (meResponse as any)?.data || null;
  const isOtherProfile =
    route === '/other-profile' || (userData && userData.id !== authUser?.id);

  const apiUser = isOtherProfile ? userData : meData || authUser;

  // Fetch followers count for the viewed profile
  const {data: followersResponse} = useFollowers(apiUser?.id || '', {
    page: 1,
    limit: 1,
  });
  // Fetch following count for the viewed profile (for displaying stats)
  const {data: followingResponse} = useFollowing(apiUser?.id || '', {
    page: 1,
    limit: 1,
  });

  const followersCount = useMemo(() => {
    // Try from main response first
    if (apiUser?.followerCount) return apiUser.followerCount;
    if (apiUser?.followersCount) return apiUser.followersCount;
    if (apiUser?._count?.followers) return apiUser._count.followers;
    // Then from followers endpoint
    return (followersResponse as any)?.data?.total || 0;
  }, [apiUser, followersResponse]);

  const followingCount = useMemo(() => {
    // Try from main response first
    if (apiUser?.followingCount) return apiUser.followingCount;
    if (apiUser?.followings) return apiUser.followings;
    if (apiUser?._count?.following) return apiUser._count.following;
    // Then from following endpoint
    return (followingResponse as any)?.data?.total || 0;
  }, [apiUser, followingResponse]);

  // Determine display values
  const displayName =
    apiUser?.fullName ||
    apiUser?.username ||
    `${apiUser?.firstName || ''} ${apiUser?.lastName || ''}`.trim() ||
    '';

  const displayAvatar = ensureHttps(
    apiUser?.avatar ||
    apiUser?.image_url ||
    apiUser?.profilePicture ||
    '/images/profile.png'
  );

  // Reverse-geocode the user's own location from browser geolocation
  const {lat, lng} = useGeolocation();
  const [geoLocation, setGeoLocation] = useState<string | null>(null);
  useEffect(() => {
    if (isOtherProfile || !lat || !lng) return;
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    )
      .then((r) => r.json())
      .then((data) => {
        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          '';
        const country = data.address?.country || '';
        const loc = [city, country].filter(Boolean).join(', ');
        if (loc) setGeoLocation(loc);
      })
      .catch(() => {});
  }, [lat, lng, isOtherProfile]);

  const displayLocation = !isOtherProfile
    ? geoLocation || apiUser?.location || ''
    : null;

  const displayBio = apiUser?.bio || 'No bio yet.';

  // Extract post count with multiple fallbacks
  const displayPosts = useMemo(() => {
    // Use passed prop first
    if (typeof postsCount === 'number' && postsCount >= 0) return postsCount;
    // Then try from apiUser
    if (typeof apiUser?.postCount === 'number') return apiUser.postCount;
    if (typeof apiUser?.postsCount === 'number') return apiUser.postsCount;
    if (typeof apiUser?.posts === 'number') return apiUser.posts;
    if (typeof apiUser?._count?.posts === 'number') return apiUser._count.posts;
    return 0;
  }, [apiUser, postsCount]);

  const displayFollowers = followersCount;
  const displayFollowing = followingCount;

  const [isFollowing, setIsFollowing] = useState(apiUser?.isFollowing || false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFollowing(apiUser?.isFollowing || false);
    }, 0);
    return () => clearTimeout(timer);
  }, [apiUser?.isFollowing]);

  const handleFollowToggle = () => {
    if (!apiUser?.id) return;

    if (isFollowing) {
      setIsFollowing(false);
      unfollowUserMutation.mutate(apiUser.id, {
        onError: () => setIsFollowing(true),
      });
    } else {
      setIsFollowing(true);
      followUserMutation.mutate(apiUser.id, {
        onError: () => setIsFollowing(false),
      });
    }
  };

  // Show loading for own profile if not passed explicitly as userData
  if (!userData && !isOtherProfile && isLoadingMe) {
    return (
      <div className='w-full flex items-center justify-center py-12'>
        <Loader2 className='w-6 h-6 animate-spin text-[#fbbe15]' />
      </div>
    );
  }

  return (
    <div className='w-full'>
      <SocialModal
        open={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
        userId={apiUser?.id || ''}
        userName={displayName}
        initialTab='followers'
      />
      <SocialModal
        open={isFollowingModalOpen}
        onClose={() => setIsFollowingModalOpen(false)}
        userId={apiUser?.id || ''}
        userName={displayName}
        initialTab='following'
      />
      <ShareDrawer
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        shareUrl={`https://www.localbuka.com/other-profile?id=${apiUser?.id}`}
        shareText={`Check out ${displayName}'s profile on LocalBuka!`}
      />
      <div className='flex items-start gap-4 md:gap-6'>
        {/* Avatar */}
        <div className='relative shrink-0'>
          <div
            onClick={!isOtherProfile ? handleAvatarClick : undefined}
            className={cn(
              'w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-[#FBBE15] overflow-hidden bg-[#FBBE15] relative group',
              isOtherProfile ? 'border-none' : 'cursor-pointer'
            )}>
            <Image
              src={displayAvatar}
              alt={displayName}
              width={128}
              height={128}
              className='w-full h-full object-cover'
              priority
            />
            {!isOtherProfile && (
              <div className='absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                <Camera className='w-5 h-5 md:w-7 md:h-7 text-white' />
                <span className='text-[8px] md:text-[10px] text-white font-medium mt-1'>Change Photo</span>
              </div>
            )}
            {isUpdatingAvatar && (
              <div className='absolute inset-0 bg-black/60 flex items-center justify-center z-10'>
                <Loader2 className='w-6 h-6 md:w-8 md:h-8 animate-spin text-[#fbbe15]' />
              </div>
            )}
          </div>
          {!isOtherProfile && (
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              className='hidden'
            />
          )}
        </div>

        {/* Info */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <h2 className='text-lg md:text-2xl font-bold text-white capitalize truncate'>
                {displayName}
              </h2>
              <button
                onClick={() => setIsShareOpen(true)}
                className='p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center'
                title='Share Profile'
              >
                <IoMdShareAlt size={18} className='text-white' />
              </button>
            </div>
            <Link
              href='/settings'
              className='flex items-center gap-2 text-white hover:text-[#FBBE15] transition-colors'>
              {!isOtherProfile && (
                <>
                  <Settings size={20} />
                  <span className='text-sm font-medium hidden sm:inline'>
                    Settings
                  </span>
                </>
              )}
            </Link>
          </div>

          {/* Location: shown for own profile only (from geolocation); hidden on other-profile until backend provides it */}
          {!isOtherProfile ? (
            <p className='text-sm text-zinc-400 mt-0.5'>
              {apiUser.location ? apiUser.location : displayLocation}
            </p>
          ) : (
            <p className='text-sm text-zinc-400 mt-0.5'>
              {apiUser.location && apiUser.location}
            </p>
          )}

          {/* Follow Button */}
          {isOtherProfile ? (
            <button
              onClick={handleFollowToggle}
              className={`mt-2 px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer border-none ${
                isFollowing
                  ? 'bg-transparent border border-[#FBBE15] text-[#FBBE15] hover:bg-[#FBBE15]/10'
                  : 'bg-[#FBBE15] text-[#1a1a1a] hover:bg-[#e5ab13]'
              }`}
              style={isFollowing ? {border: '1px solid #FBBE15'} : {}}>
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          ) : (
            <button
              onClick={() => {
                router.push('/settings');
              }}
              className={`mt-2 px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer border-none bg-[#FBBE15] text-[#1a1a1a] hover:bg-[#e5ab13]`}>
              Edit
            </button>
          )}

          {/* Stats */}
          <div className='flex items-center gap-4 md:gap-5 mt-3'>
            <div className='text-center'>
              <span className='text-white font-bold text-base'>
                {displayPosts}
              </span>
              <p className='text-zinc-400 text-xs'>Posts</p>
            </div>
            <button
              className='text-center cursor-pointer border-none bg-transparent p-0'
              onClick={() => setIsFollowersModalOpen(true)}>
              <span className='text-white font-bold text-base'>
                {displayFollowers}
              </span>
              <p className='text-zinc-400 text-xs hover:text-white transition-colors'>Followers</p>
            </button>
            <button
              className='text-center cursor-pointer border-none bg-transparent p-0'
              onClick={() => setIsFollowingModalOpen(true)}>
              <span className='text-white font-bold text-base'>
                {displayFollowing}
              </span>
              <p className='text-zinc-400 text-xs hover:text-white transition-colors'>Following</p>
            </button>
            {isOtherProfile && (
              <div className='text-center'>
                <span className='text-white font-bold text-base'>
                  {likesGivenCount}
                </span>
                <p className='text-zinc-400 text-xs'>Likes</p>
              </div>
            )}
          </div>

          {/* Bio */}
          <p className='text-sm text-zinc-400 mt-2'>{displayBio}</p>
        </div>
      </div>
      {cropSrc && (
        <AvatarCropModal
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </div>
  );
}
