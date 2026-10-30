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
      {/* Modal Card — Figma specs: width 576px, height 581px */}
      <div
        style={{
          width: '576px',
          maxWidth: '100%',
          height: '581px',
          maxHeight: '90vh',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#1a1a1d',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        }}
        className='relative text-white text-center animate-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer'
          aria-label='Close modal'
        >
          <X className='w-5 h-5' />
        </button>

        {/* Inner Content Box — Figma specs: width 368px, height 403px, gap 17px, padding 10px */}
        <div
          style={{
            width: '368px',
            maxWidth: '100%',
            height: '403px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '17px',
            paddingTop: '10px',
            paddingBottom: '10px',
          }}
        >
          {/* 1. Header: Avatar + Community Name — Figma specs: width 368px, height 37px, gap 8px, padding 4px 0, left-aligned */}
          <div
            style={{
              width: '368px',
              height: '37px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '8px',
              paddingTop: '4px',
              paddingBottom: '4px',
            }}
          >
            <div className='relative w-7 h-7 rounded-full overflow-hidden border border-white/20 shrink-0'>
              <Image
                src={communityAvatar}
                alt={communityName}
                fill
                unoptimized
                className='object-cover'
              />
            </div>
            <span className='font-bold text-white text-[16px] tracking-tight'>
              {communityName}
            </span>
          </div>

          {/* 2. Inner Light/Cream Container — Figma specs: width 368px, height 175px, border-radius 10px */}
          <div
            style={{
              width: '368px',
              height: '175px',
              borderRadius: '10px',
              backgroundColor: '#FFF9E8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            className='shadow-inner'
          >
            <h3
              style={{
                width: '219px',
                height: '27px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '19px',
                lineHeight: '140%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#18181B',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Members-only content
            </h3>
            <p
              style={{
                width: '219px',
                height: '22px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '140%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#71717A',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Subscribe to see this post
            </p>
          </div>

          {/* 3 & 4. Text and Button container (368px x 138px, gap: 20px) */}
          <div
            style={{
              width: '368px',
              minHeight: '138px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <div className="flex flex-col items-center px-1" style={{ gap: '9px' }}>
              <h4
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: '140%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                Unlock everything in this community
              </h4>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '140%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  color: '#A1A1AA',
                  margin: 0,
                  maxWidth: '350px',
                }}
              >
                Get full access to posts, recipes, and live cook-alongs from {ownerName}.
              </p>
            </div>

            {/* Subscribe Button (width: 269px, height: 39px, radius: 9.65px, pad: 32.16px, bg: #FBBE15) */}
            <button
              onClick={handleSubscribe}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
                width: '269px',
                height: '39px',
                borderRadius: '9.65px',
                paddingLeft: '32.16px',
                paddingRight: '32.16px',
                backgroundColor: '#FBBE15',
              }}
              className="text-[#121212] hover:brightness-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center whitespace-nowrap"
            >
              Subscribe to unlock . {price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
