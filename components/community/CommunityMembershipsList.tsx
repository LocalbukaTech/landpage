'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { BackCircleButton } from '@/components/ui/BackCircleButton';

interface MembershipItem {
  id: string;
  name: string;
  avatar: string;
  price: string;
  status: 'active' | 'paused';
  billingDate: string;
}

const initialMemberships: MembershipItem[] = [
  {
    id: 'chef-amaka',
    name: "Chef Amaka's kitchen",
    avatar: '/images/community/chef-amaka-avatar.jpg',
    price: '₦2,500/month',
    status: 'active',
    billingDate: 'Oct 10, 2026',
  },
  {
    id: 'grill-masters',
    name: 'Grill masters NG',
    avatar: '/images/community/chef-amaka-avatar.jpg',
    price: '₦1,200/month',
    status: 'paused',
    billingDate: 'Oct 10, 2026',
  },
];

interface CommunityMembershipsListProps {
  onBack?: () => void;
}

export function CommunityMembershipsList({ onBack }: CommunityMembershipsListProps = {}) {
  const router = useRouter();
  const { toast } = useToast();
  const [memberships, setMemberships] = useState<MembershipItem[]>(initialMemberships);
  const [cancellingItem, setCancellingItem] = useState<MembershipItem | null>(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/community');
    }
  };

  const handleConfirmCancel = () => {
    if (!cancellingItem) return;
    setMemberships((prev) =>
      prev.map((item) =>
        item.id === cancellingItem.id ? { ...item, status: 'paused' } : item
      )
    );
    toast({
      title: 'Membership Cancelled',
      description: `Your access to ${cancellingItem.name} will end on ${cancellingItem.billingDate}.`,
    });
    setCancellingItem(null);
  };

  const handleResume = (item: MembershipItem) => {
    setMemberships((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, status: 'active' } : m))
    );
    toast({
      title: 'Membership Resumed! 🎉',
      description: `Your subscription to ${item.name} is now active.`,
    });
  };

  return (
    <div className='w-full max-w-5xl space-y-6 text-white'>
      {/* Header */}
      <div className='pb-4 border-b border-white/10 flex items-center gap-3.5'>
        <BackCircleButton onClick={handleBack} size={26} />
        <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight'>
          Your membership
        </h1>
      </div>

      {/* Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 pt-2'>
        {memberships.map((item) => {
          const isActive = item.status === 'active';

          return (
            <div
              key={item.id}
              className='bg-[#1e1e1e] border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-lg'
            >
              {/* Top Row: Avatar, Title, Price & Status Badge */}
              <div className='flex items-start justify-between gap-3'>
                <div
                  onClick={() => router.push(`/community/${item.id}/feed`)}
                  className='flex items-center gap-3.5 cursor-pointer hover:opacity-85 transition-opacity'
                >
                  <div className='relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0'>
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <h3 className='font-bold text-white text-base leading-snug hover:underline'>
                      {item.name}
                    </h3>
                    <p className='text-xs text-gray-400 mt-0.5'>{item.price}</p>
                  </div>
                </div>

                {/* Status Badge */}
                {isActive ? (
                  <span className='px-3 py-1 rounded-full bg-[#133827] text-[#22c55e] border border-[#22c55e]/30 text-xs font-semibold'>
                    Active
                  </span>
                ) : (
                  <span className='px-3 py-1 rounded-full bg-[#3d2c00] text-[#FFC533] border border-[#FFC533]/30 text-xs font-semibold'>
                    Paused
                  </span>
                )}
              </div>

              {/* Subtext info */}
              <p className='text-xs text-gray-400'>
                {isActive
                  ? `Next billing date: ${item.billingDate}`
                  : `Access ends ${item.billingDate} . won't renew`}
              </p>

              {/* Action Button */}
              <div>
                {isActive ? (
                  <button
                    onClick={() => setCancellingItem(item)}
                    className='w-full py-3 rounded-xl border border-[#e53e3e]/50 hover:border-[#e53e3e] hover:bg-[#e53e3e]/10 text-[#e53e3e] text-sm font-medium transition-all cursor-pointer text-center'
                  >
                    Cancel membership
                  </button>
                ) : (
                  <button
                    onClick={() => handleResume(item)}
                    className='w-full py-3 rounded-xl border border-[#FFC533]/50 hover:border-[#FFC533] hover:bg-[#FFC533]/10 text-[#FFC533] text-sm font-medium transition-all cursor-pointer text-center'
                  >
                    Resume membership
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancellingItem && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4'
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className='w-full shadow-2xl text-left'
            style={{
              maxWidth: '497px',
              background: '#18181a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '16px', lineHeight: '140%', margin: 0 }}>
                Cancel {cancellingItem.name}?
              </h3>
              <p style={{ color: '#e5e7eb', fontSize: '14px', lineHeight: '140%', margin: 0 }}>
                Cancelling stops future renewals only. You&apos;ll keep full access until your current period ends on {cancellingItem.billingDate}.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type='button'
                onClick={() => setCancellingItem(null)}
                style={{
                  flex: 1,
                  height: '48px',
                  borderRadius: '12px',
                  background: '#2c2d30',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Keep my membership
              </button>
              <button
                type='button'
                onClick={handleConfirmCancel}
                style={{
                  flex: 1,
                  height: '48px',
                  borderRadius: '12px',
                  background: '#FF0000',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
