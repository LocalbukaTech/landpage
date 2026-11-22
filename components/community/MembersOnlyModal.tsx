'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export interface MembersOnlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId?: string;
  communityName?: string;
  communityAvatar?: string;
  ownerName?: string;
  price?: string;
}

export function MembersOnlyModal({
  isOpen,
  onClose,
  communityId = 'chef-amaka',
  communityName = "Chef Amaka’s kitchen",
  communityAvatar = '/images/community/amaka-avatar.jpg',
  ownerName = 'Chef Amaka',
  price = '₦2,500/mo',
}: MembersOnlyModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubscribe = () => {
    router.push(`/community/${communityId}/subscribe`);
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200'
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className='relative w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[22px] bg-[#1a1a1d] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] p-5 sm:p-8 text-white text-center animate-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-10'
          aria-label='Close modal'
        >
          <X className='w-5 h-5' />
        </button>

        {/* Inner Content Box */}
        <div className='w-full max-w-[380px] mx-auto flex flex-col items-center gap-4 sm:gap-5'>
          {/* 1. Header: Avatar + Community Name */}
          <div className='w-full flex items-center justify-start gap-2.5 pt-1'>
            <div className='relative w-7 h-7 rounded-full overflow-hidden border border-white/20 shrink-0'>
              <Image
                src={communityAvatar}
                alt={communityName}
                fill
                unoptimized
                className='object-cover'
              />
            </div>
            <span className='font-bold text-white text-[15px] sm:text-[16px] tracking-tight truncate'>
              {communityName}
            </span>
          </div>

          {/* 2. Inner Light/Cream Container */}
          <div className='w-full py-6 px-4 rounded-xl bg-[#FFF9E8] flex flex-col items-center justify-center gap-1.5 shadow-inner'>
            <h3 className='font-bold text-lg sm:text-[19px] text-[#18181B] text-center leading-tight'>
              Members-only content
            </h3>
            <p className='text-sm text-[#71717A] text-center'>
              Subscribe to see this post
            </p>
          </div>

          {/* 3 & 4. Text and Button container */}
          <div className='w-full flex flex-col items-center gap-4 pt-1'>
            <div className='flex flex-col items-center gap-1.5 text-center'>
              <h4 className='font-bold text-base sm:text-lg text-white'>
                Unlock everything in this community
              </h4>
              <p className='text-xs sm:text-sm text-zinc-400 max-w-[340px] leading-relaxed'>
                Get full access to posts, recipes, and live cook-alongs from {ownerName}.
              </p>
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              className='w-full sm:w-[280px] py-3 rounded-xl bg-[#FBBE15] hover:bg-[#e6b12d] text-black font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center whitespace-nowrap'
            >
              Subscribe to unlock · {price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
