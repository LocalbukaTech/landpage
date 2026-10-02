'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { BackCircleButton } from '@/components/ui/BackCircleButton';

interface CommunitySubscribeViewProps {
  communityId?: string;
  communityName?: string;
  communityAvatar?: string;
  isPaid?: boolean;
}

export function CommunitySubscribeView({
  communityId = '1',
  communityName = "Chef Amaka's kitchen",
  communityAvatar = '/images/community/chef-amaka-avatar.jpg',
}: CommunitySubscribeViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const priceLabel = billingPeriod === 'monthly' ? '₦2,500/mo' : '₦25,000/yr';

  const handleSubscribe = (simulateFail = false) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (simulateFail) {
        router.push(`/community/${communityId}/subscribe/failed`);
      } else {
        router.push(`/community/${communityId}/subscribe/success`);
      }
    }, 600);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    toast({
      title: 'Subscription Cancelled',
      description: 'Your membership will remain active until Oct 10, 2026.',
    });
  };

  return (
    <div className='w-full max-w-4xl mx-auto space-y-8 py-2 text-white'>
      {/* Header */}
      <div className='pb-4 border-b border-white/10 flex items-center gap-3.5'>
        <BackCircleButton onClick={() => router.back()} size={26} />
        <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight'>
          Your membership
        </h1>
      </div>

      <div className='max-w-xl space-y-8'>
        {/* Subscribe Section */}
        <div className='space-y-3'>
          <h2 className='text-xs font-semibold text-gray-300 tracking-wider uppercase'>
            Subscribe
          </h2>
          <div className='flex items-center gap-3.5'>
            <div className='relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0'>
              <Image
                src={communityAvatar}
                alt={communityName}
                fill
                className='object-cover'
              />
            </div>
            <div>
              <h3 className='font-bold text-white text-base'>{communityName}</h3>
              <p className='text-xs text-gray-400'>Paid community</p>
            </div>
          </div>
        </div>

        {/* Billing Period */}
        <div className='space-y-3'>
          <h2 className='text-xs font-semibold text-gray-300 tracking-wider uppercase'>
            Billing period
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {/* Monthly Card */}
            <button
              type='button'
              onClick={() => setBillingPeriod('monthly')}
              style={{ borderRadius: '10px' }}
              className={`relative text-left p-4 rounded-[10px] transition-all cursor-pointer bg-[#1e1e1e] ${
                billingPeriod === 'monthly'
                  ? 'border border-[#FFC533] shadow-md ring-1 ring-[#FFC533]/30'
                  : 'border border-white/10 hover:border-white/20'
              }`}
            >
              <span className='block text-xs font-medium text-gray-300 mb-1.5'>Monthly</span>
              <div className='flex items-baseline gap-1'>
                <span className='text-lg font-bold text-[#FFC533]'>₦2,500</span>
                <span className='text-xs text-gray-400'>/month</span>
              </div>
            </button>

            {/* Yearly Card */}
            <button
              type='button'
              onClick={() => setBillingPeriod('yearly')}
              style={{ borderRadius: '10px' }}
              className={`relative text-left p-4 rounded-[10px] transition-all cursor-pointer bg-[#1e1e1e] ${
                billingPeriod === 'yearly'
                  ? 'border border-[#FFC533] shadow-md ring-1 ring-[#FFC533]/30'
                  : 'border border-white/10 hover:border-white/20'
              }`}
            >
              <div className='absolute -top-2.5 right-3'>
                <span className='px-2 py-0.5 rounded-full bg-[#22c55e] text-black font-bold text-[10px] shadow-sm'>
                  Save 17%
                </span>
              </div>
              <span className='block text-xs font-medium text-gray-300 mb-1.5'>Yearly</span>
              <div className='flex items-baseline gap-1'>
                <span className='text-lg font-bold text-[#FFC533]'>₦25,000</span>
                <span className='text-xs text-gray-400'>/year</span>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className='space-y-3'>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '16px', lineHeight: '140%', letterSpacing: '0%', verticalAlign: 'middle', color: 'white', margin: 0 }}>
            Payment method
          </h2>
          <div
            style={{ borderRadius: '10px' }}
            className='w-full px-4 py-3.5 bg-[#242424] border border-white/10 rounded-[10px] text-white text-sm flex items-center justify-between'
          >
            <span>Visa ending in 4417</span>
            <span className='text-xs text-gray-400 font-mono'>10/28</span>
          </div>
        </div>

        {/* Fine print */}
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: '16px', lineHeight: '140%', letterSpacing: '0%', verticalAlign: 'middle', color: '#9ca3af', margin: 0 }}>
          By subscribing you agree to LocalBuka&apos;s Terms of Service and authorize recurring monthly charges until cancelled.
        </p>

        {/* CTA Button */}
        <div className='space-y-3 pt-2'>
          <button
            onClick={() => handleSubscribe(false)}
            disabled={isProcessing}
            className='w-full py-3.5 rounded-xl bg-[#FFC533] hover:bg-[#e6b12d] text-gray-950 font-bold text-sm transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50'
          >
            {isProcessing ? 'Processing…' : `Subscribe to unlock · ${priceLabel}`}
          </button>


        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
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
                Cancel {communityName}?
              </h3>
              <p style={{ color: '#e5e7eb', fontSize: '14px', lineHeight: '140%', margin: 0 }}>
                Cancelling stops future renewals only. You&apos;ll keep full access until your current period ends on Oct 10, 2026.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type='button'
                onClick={() => setShowCancelModal(false)}
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
