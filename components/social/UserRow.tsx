import {useRouter} from 'next/navigation';
import Image from 'next/image';
import type {PostUser} from '@/types/post';
import {useFollowUser, useUnfollowUser} from '@/lib/api/services/profile.hooks';
import {useState} from 'react';
import {Loader2} from 'lucide-react';

interface Props {
  user: PostUser;
  isFollowingInitial?: boolean;
}

export default function UserRow({user, isFollowingInitial = false}: Props) {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);
  const router = useRouter();

  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const isLoading = followMutation.isPending || unfollowMutation.isPending;

  const handleToggleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFollowing) {
      setIsFollowing(false);
      unfollowMutation.mutate(user.id, {
        onError: () => setIsFollowing(true),
      });
    } else {
      setIsFollowing(true);
      followMutation.mutate(user.id, {
        onError: () => setIsFollowing(false),
      });
    }
  };

  const name =
    user.fullName ||
    `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
    user.username;
  const avatar = user.avatar || user.profilePicture || '/images/profile.png';

  return (
    <div className='flex items-center justify-between py-3 px-2 rounded-lg transition-colors hover:bg-white/5'>
      {/* User Info */}
      <div
        className='flex items-center gap-3 cursor-pointer flex-1 min-w-0'
        onClick={() => {
          router.push(`/other-profile?id=${user.id}`);
        }}>
        <div className='relative w-10 h-10 shrink-0'>
          <Image
            src={avatar}
            className='w-full h-full rounded-full object-cover border border-gray-800'
            alt={name || 'avatar'}
            width={40}
            height={40}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/images/profile.png';
            }}
          />
        </div>

        <div className='flex flex-col leading-tight min-w-0'>
          <span className='text-white text-[14px] font-semibold truncate'>
            {name}
          </span>
          <span className='text-gray-500 text-[12px] mt-0.5 truncate'>
            @{user.username || 'user'}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleToggleFollow}
        disabled={isLoading}
        className={`min-w-[95px] px-4 py-1.5 rounded-full text-[11px] font-bold tracking-tight transition-all active:scale-95 flex items-center justify-center
          ${
            isFollowing
              ? 'bg-transparent text-[#A1A1AA] border border-[#333]'
              : 'bg-[#FFC107] text-black hover:bg-[#e6ad00]'
          }`}>
        {isLoading ? (
          <Loader2 size={12} className='animate-spin' />
        ) : isFollowing ? (
          'Unfollow'
        ) : (
          'Follow'
        )}
      </button>
    </div>
  );
}
