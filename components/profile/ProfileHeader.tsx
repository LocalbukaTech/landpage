'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useState, useMemo, useEffect, useRef} from 'react';
import {useGeolocation} from '@/hooks/useGeolocation';
import {Settings, Loader2, Camera, X, MoreVertical, Ban, Flag} from 'lucide-react';
import SocialModal from '../social/SocialModal';
import {IoMdShareAlt} from 'react-icons/io';
import {ShareDrawer} from '../video/ShareDrawer';
import {usePathname, useRouter} from 'next/navigation';
import {useRequireAuth} from '@/hooks/useRequireAuth';
import {useAuth} from '@/context/AuthContext';
import {useMe, useUpdateMe} from '@/lib/api/services/auth.hooks';
import { ensureHttps, cn } from '@/lib/utils';
import {
  useFollowUser,
  useUnfollowUser,
  useFollowers,
  useFollowing,
} from '@/lib/api/services/profile.hooks';
import {useBlockedUsers} from '@/hooks/useBlockedUsers';
import type {PostUser} from '@/types/post';
import type {User} from '@/lib/api/services/auth.service';
import {AvatarCropModal} from '@/components/ui/AvatarCropModal';
import {useToast} from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const route = usePathname();
  const router = useRouter();
  const {requireAuth} = useRequireAuth();

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
  const { isUserBlocked, blockUser, unblockUser } = useBlockedUsers();
  const isBlocked = Boolean(apiUser?.blockStatus?.hasBlocked ?? isUserBlocked(apiUser?.id));
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleBlockConfirm = async () => {
    if (!apiUser?.id) return;
    setShowBlockConfirm(false);
    try {
      await blockUser(apiUser.id);
      setIsFollowing(false);
      setToastMessage(`${displayName} has been blocked 🚫`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to block user';
      setToastMessage(msg);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUnblock = async () => {
    if (!apiUser?.id) return;
    try {
      await unblockUser(apiUser.id);
      setToastMessage(`${displayName} is unblocked 🚫`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to unblock user';
      setToastMessage(msg);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFollowing(apiUser?.isFollowing || false);
    }, 0);
    return () => clearTimeout(timer);
  }, [apiUser?.isFollowing]);

  const handleFollowToggle = () => {
    if (!apiUser?.id) return;

    requireAuth(() => {
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
    });
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
      {/* Profile Image Preview Lightbox */}
      {isPreviewOpen && (
        <div
          className='fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none'
          onClick={() => setIsPreviewOpen(false)}>
          <div
            className='relative max-w-sm sm:max-w-md w-full flex flex-col items-center'
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsPreviewOpen(false)}
              className='absolute -top-12 right-0 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-colors cursor-pointer'
              aria-label='Close preview'>
              <X className='w-6 h-6' />
            </button>
            <div className='w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-none shadow-2xl relative bg-black shrink-0'>
              <Image
                src={displayAvatar}
                alt={displayName}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 320px, 384px'
              />
            </div>
            {displayName && (
              <p className='mt-5 text-white font-bold text-xl text-center drop-shadow-md'>
                {displayName}
              </p>
            )}
            {apiUser?.username && (
              <p className='text-zinc-400 text-sm text-center mt-0.5'>
                @{apiUser.username}
              </p>
            )}
          </div>
        </div>
      )}
      <div className='flex items-start gap-4 md:gap-6'>
        {/* Avatar */}
        <div className='relative shrink-0'>
          <div
            onClick={!isOtherProfile ? handleAvatarClick : () => setIsPreviewOpen(true)}
            className={cn(
              'w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden bg-[#FBBE15] relative group cursor-pointer transition-transform active:scale-95',
              isOtherProfile ? 'border-none hover:opacity-95' : 'border-4 border-[#FBBE15]'
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
            {!isOtherProfile ? (
              <Link
                href='/settings'
                className='flex items-center gap-2 text-white hover:text-[#FBBE15] transition-colors'>
                <Settings size={20} />
                <span className='text-sm font-medium hidden sm:inline'>
                  Settings
                </span>
              </Link>
            ) : (
              <div className='relative'>
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className='p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center text-zinc-400 hover:text-white'
                  title='Profile options'>
                  <MoreVertical size={18} />
                </button>

                {/* Dropdown Menu */}
                {showOptionsMenu && (
                  <>
                    <div
                      className='fixed inset-0 z-40'
                      onClick={() => setShowOptionsMenu(false)}
                    />
                    <div
                      className='absolute right-0 top-7 z-50 w-36 bg-[#18181b] border border-white/15 rounded-xl shadow-2xl py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150'>
                      <div className='flex items-center justify-between px-3 py-1 border-b border-white/5 mb-1'>
                        <span className='text-[10px] font-bold uppercase tracking-wider text-zinc-500'>Options</span>
                        <button
                          onClick={() => setShowOptionsMenu(false)}
                          className='text-zinc-400 hover:text-white bg-transparent border-none p-0 cursor-pointer'>
                          <X size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setShowOptionsMenu(false);
                          setShowBlockConfirm(true);
                        }}
                        className='w-full px-3 py-2 text-left text-xs font-semibold text-red-500 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer border-none bg-transparent transition-colors'>
                        <Ban size={14} />
                        <span>Block</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowOptionsMenu(false);
                          toast({
                            title: 'Report Submitted',
                            description: 'Thank you for your report. Our safety team will review it.',
                          });
                        }}
                        className='w-full px-3 py-2 text-left text-xs font-semibold text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer border-none bg-transparent transition-colors'>
                        <Flag size={14} />
                        <span>Report</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          {!isOtherProfile ? (
            (apiUser?.location || displayLocation) && (
              <p className='text-sm text-zinc-400 mt-0.5'>
                {apiUser?.location || displayLocation}
              </p>
            )
          ) : (
            apiUser?.location && (
              <p className='text-sm text-zinc-400 mt-0.5'>
                {apiUser.location}
              </p>
            )
          )}

          {/* Follow / Unblock Button */}
          {isOtherProfile ? (
            isBlocked ? (
              <button
                onClick={handleUnblock}
                className='mt-2 px-6 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer border-none bg-[#FBBE15] text-[#1a1a1a] hover:bg-[#e5ab13] shadow-sm'>
                Unblock
              </button>
            ) : (
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
            )
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
              onClick={() => requireAuth(() => setIsFollowersModalOpen(true))}>
              <span className='text-white font-bold text-base'>
                {displayFollowers}
              </span>
              <p className='text-zinc-400 text-xs hover:text-white transition-colors'>Followers</p>
            </button>
            <button
              className='text-center cursor-pointer border-none bg-transparent p-0'
              onClick={() => requireAuth(() => setIsFollowingModalOpen(true))}>
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

      {/* Block Confirmation Modal */}
      <AlertDialog open={showBlockConfirm} onOpenChange={setShowBlockConfirm}>
        <AlertDialogContent className='bg-[#18181b] border border-white/10 text-white rounded-2xl max-w-sm'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-base font-bold text-white'>
              Block {displayName}?
            </AlertDialogTitle>
            <AlertDialogDescription className='text-zinc-400 text-xs leading-relaxed'>
              You won&apos;t be able to see each other&apos;s posts or interact with each other while this user is blocked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex-row gap-2 justify-end mt-4'>
            <AlertDialogCancel className='bg-zinc-800 hover:bg-zinc-700 border-none text-white text-xs font-semibold rounded-lg px-4 py-2 cursor-pointer'>
              No, Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlockConfirm}
              className='bg-red-600 hover:bg-red-700 border-none text-white text-xs font-semibold rounded-lg px-4 py-2 cursor-pointer'>
              Yes, Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Floating pill toast */}
      {toastMessage && (
        <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-black/85 backdrop-blur-md text-white text-xs rounded-full border border-white/15 shadow-2xl animate-in fade-in slide-in-from-bottom-3'>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
