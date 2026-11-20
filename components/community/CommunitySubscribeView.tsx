'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CreditCard, Building2, CheckCircle2, Lock } from 'lucide-react';
import { BackCircleButton } from '@/components/ui/BackCircleButton';
import {
  useSubscribeCommunity,
  useInitializeCommunityPayment,
} from '@/lib/api/services/community.hooks';

export interface CommunitySubscribeViewProps {
  communityId?: string;
  communityName?: string;
  communityImage?: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  monthlyAmount?: number;
  yearlyAmount?: number;
  onBack?: () => void;
}

export function CommunitySubscribeView({
  communityId = '1',
  communityName = "Chef Tolu's VIP Kitchen",
  communityImage = '/images/community/cover-1.jpg',
  monthlyPrice = '₦2,000',
  yearlyPrice = '₦20,000',
  monthlyAmount = 2000,
  yearlyAmount = 20000,
  onBack,
}: CommunitySubscribeViewProps) {
  const router = useRouter();
  const subscribeMutation = useSubscribeCommunity();
  const initPaymentMutation = useInitializeCommunityPayment();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentGateway, setPaymentGateway] = useState<'paystack' | 'korapay'>('paystack');
  const [paystackMethod, setPaystackMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [cardLast4, setCardLast4] = useState('8821');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeAmount = selectedPlan === 'monthly' ? Math.max(2000, monthlyAmount) : Math.max(20000, yearlyAmount);
  const creatorShare = Math.round(activeAmount * 0.92);
  const platformFee = Math.round(activeAmount * 0.08);
  const gatewayLabel = paymentGateway === 'korapay' ? 'Korapay' : 'Paystack';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined' && window.history.length > 2) {
      router.back();
    } else {
      router.push(`/community/${communityId}`);
    }
  };

  const handleContinuePayment = async (simulateFailure = false) => {
    setIsSubmitting(true);
    if (simulateFailure || cardLast4.trim() === '4417') {
      setTimeout(() => {
        setIsSubmitting(false);
        router.push(`/community/${communityId}/subscribe/failed`);
      }, 600);
      return;
    }

    const prefix = paymentGateway === 'korapay' ? 'KPY' : 'PSK';
    let paymentReference = `${prefix}-${Date.now()}`;

    try {
      const initRes = await initPaymentMutation.mutateAsync({
        idOrSlug: communityId,
        data: {
          billingPeriod: selectedPlan,
          provider: paymentGateway,
          paymentReference,
        },
      });
      const initData = initRes?.data;
      if (initData?.reference) {
        paymentReference = initData.reference;
      }
      if (initData?.authorizationUrl && typeof window !== 'undefined') {
        window.location.href = initData.authorizationUrl;
        return;
      }
    } catch {
      // Fallback to direct subscription verification
    }

    subscribeMutation.mutate(
      {
        idOrSlug: communityId,
        data: {
          billingPeriod: selectedPlan,
          provider: paymentGateway,
          paymentReference,
        },
      },
      {
        onSettled: () => {
          setIsSubmitting(false);
          router.push(
            `/community/${communityId}/subscribe/success?plan=${selectedPlan}&amount=${activeAmount}&gateway=${paymentGateway}&ref=${paymentReference}`,
          );
        },
      },
    );
  };

  return (
    <div className='w-full max-w-[480px] mx-auto py-8 px-4 flex flex-col items-center'>
      {/* Circular Back Button aligned left */}
      <div className='w-full flex items-center justify-between mb-6'>
        <BackCircleButton onClick={handleBack} size={26} color='#FFFFFF' className='text-white' />
        <span className='inline-flex items-center gap-1.5 rounded-full bg-[#4ade80]/15 border border-[#4ade80]/30 px-3 py-1 text-[11px] font-semibold text-[#4ade80]'>
          <ShieldCheck className='w-3.5 h-3.5' />
          <span>Secured by {gatewayLabel}</span>
        </span>
      </div>

      {/* Main Card */}
      <div className='w-full bg-[#202020] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl flex flex-col items-center pb-7'>
        {/* Top Hero Image */}
        <div className='relative w-full h-[200px] bg-zinc-800'>
          <Image
            src={communityImage}
            alt={communityName}
            fill
            className='object-cover object-top'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-t from-[#202020] via-transparent to-transparent' />
        </div>

        {/* Title & Subtitle */}
        <div className='px-6 pt-3 pb-5 text-center space-y-1.5'>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '140%',
              color: '#FFFFFF',
            }}
          >
            Subscribe to {communityName}
          </h1>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: '13px',
              lineHeight: '140%',
              color: '#9CA3AF',
            }}
          >
            Choose a membership plan (Base Plan starts at ₦2,000/month). Cancel anytime.
          </p>
        </div>

        {/* Plan Options */}
        <div className='w-full px-6 space-y-3 mb-5'>
          {/* Monthly Plan */}
          <button
            type='button'
            onClick={() => setSelectedPlan('monthly')}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedPlan === 'monthly'
                ? 'bg-[#FFC533]/10 border-[#FFC533]'
                : 'bg-[#2A2A2A] border-white/8 hover:border-white/20'
            }`}
          >
            <div>
              <div className='text-white font-bold text-base leading-snug'>
                {monthlyPrice} / month
              </div>
              <div className='text-gray-400 text-xs mt-0.5'>
                Billed monthly via Paystack
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedPlan === 'monthly' ? 'border-[#FFC533]' : 'border-gray-400'
              }`}
            >
              {selectedPlan === 'monthly' && (
                <div className='w-2.5 h-2.5 rounded-full bg-[#FFC533]' />
              )}
            </div>
          </button>

          {/* Yearly Plan */}
          <button
            type='button'
            onClick={() => setSelectedPlan('yearly')}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedPlan === 'yearly'
                ? 'bg-[#FFC533]/10 border-[#FFC533]'
                : 'bg-[#2A2A2A] border-white/8 hover:border-white/20'
            }`}
          >
            <div>
              <div className='flex items-center gap-2'>
                <span className='text-white font-bold text-base leading-snug'>
                  {yearlyPrice} / year
                </span>
                <span className='rounded-full bg-[#4ade80]/15 px-2 py-0.5 text-[10px] font-bold text-[#4ade80]'>
                  Save 2 months
                </span>
              </div>
              <div className='text-gray-400 text-xs mt-0.5'>
                Billed annually via Paystack
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedPlan === 'yearly' ? 'border-[#FFC533]' : 'border-gray-400'
              }`}
            >
              {selectedPlan === 'yearly' && (
                <div className='w-2.5 h-2.5 rounded-full bg-[#FFC533]' />
              )}
            </div>
          </button>
        </div>

        {/* Payment Gateway & Channel Selector (Paystack / Korapay) */}
        <div className='w-full px-6 mb-5 space-y-3'>
          <div className='rounded-2xl bg-[#161616] border border-white/8 p-4 space-y-3'>
            <div className='flex items-center justify-between text-xs'>
              <span className='font-semibold text-white flex items-center gap-1.5'>
                <Lock className='w-3.5 h-3.5 text-[#FFC533]' />
                <span>Payment Gateway</span>
              </span>
              <span className='text-[11px] text-gray-400'>NGN Instant Settlement</span>
            </div>

            {/* Gateway Switcher: Paystack vs Korapay */}
            <div className='grid grid-cols-2 gap-2'>
              {(
                [
                  { id: 'paystack', label: 'Paystack', badge: 'Cards · USSD · Bank' },
                  { id: 'korapay', label: 'Korapay', badge: 'Instant Bank · Cards' },
                ] as const
              ).map((gw) => (
                <button
                  key={gw.id}
                  type='button'
                  onClick={() => setPaymentGateway(gw.id)}
                  className={`py-2.5 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentGateway === gw.id
                      ? 'bg-[#FFC533]/15 border-[#FFC533] text-white'
                      : 'bg-[#222222] text-gray-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-bold'>{gw.label}</span>
                    {paymentGateway === gw.id && (
                      <span className='w-2 h-2 rounded-full bg-[#FFC533]' />
                    )}
                  </div>
                  <div className='text-[10px] text-gray-400 mt-0.5'>{gw.badge}</div>
                </button>
              ))}
            </div>

            <div className='grid grid-cols-3 gap-2 pt-1'>
              {(
                [
                  { id: 'card', label: 'Card' },
                  { id: 'transfer', label: 'Bank Transfer' },
                  { id: 'ussd', label: 'USSD *737#' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type='button'
                  onClick={() => setPaystackMethod(m.id)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    paystackMethod === m.id
                      ? 'bg-[#FFC533] text-black border-[#FFC533]'
                      : 'bg-[#222222] text-gray-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {paystackMethod === 'card' && (
              <div className='flex items-center justify-between gap-2 pt-1 text-xs text-gray-300'>
                <span className='flex items-center gap-1.5'>
                  <CreditCard className='w-3.5 h-3.5 text-[#FFC533]' />
                  <span>Test Card Ending In:</span>
                </span>
                <input
                  type='text'
                  maxLength={4}
                  value={cardLast4}
                  onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ''))}
                  className='w-20 bg-[#242424] border border-white/10 rounded-lg px-2.5 py-1 text-center font-mono text-xs text-white focus:outline-none focus:border-[#FFC533]'
                  title='Use 4417 to test failed payment'
                />
              </div>
            )}

            {paystackMethod === 'transfer' && (
              <div className='rounded-xl bg-[#222222] p-2.5 text-[11px] text-gray-300 flex items-center justify-between'>
                <span className='flex items-center gap-1.5'>
                  <Building2 className='w-3.5 h-3.5 text-[#4ade80]' />
                  <span>Paystack Titan / Wema Virtual Account</span>
                </span>
                <span className='font-mono font-bold text-white'>9820194821</span>
              </div>
            )}

            {paystackMethod === 'ussd' && (
              <div className='rounded-xl bg-[#222222] p-2.5 text-[11px] text-gray-300 flex items-center justify-between'>
                <span>Dial USSD Code to authorize:</span>
                <span className='font-mono font-bold text-[#FFC533]'>*737*000*9482#</span>
              </div>
            )}

            {/* Revenue Split Transparency Note */}
            <div className='pt-2 border-t border-white/8 flex items-center justify-between text-[11px] text-gray-400'>
              <span>Creator receives (92%): <strong className='text-[#4ade80]'>₦{creatorShare.toLocaleString('en-NG')}</strong></span>
              <span>Platform fee (8%): ₦{platformFee.toLocaleString('en-NG')}</span>
            </div>
          </div>
        </div>

        {/* Continue to Payment Button */}
        <div className='w-full px-6 space-y-2.5'>
          <button
            type='button'
            disabled={isSubmitting}
            onClick={() => handleContinuePayment(false)}
            style={{
              background: '#FFC533',
              color: '#111111',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '15px',
            }}
            className='w-full py-3.5 rounded-xl hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-60'
          >
            <CheckCircle2 className='w-4 h-4' />
            <span>
              {isSubmitting
                ? `Processing ${gatewayLabel} Payment...`
                : `Pay ₦${activeAmount.toLocaleString('en-NG')} with ${gatewayLabel}`}
            </span>
          </button>

          <button
            type='button'
            onClick={() => handleContinuePayment(true)}
            className='w-full py-2 text-[11px] text-gray-400 hover:text-white transition-colors cursor-pointer'
          >
            Simulate failed payment (test error state)
          </button>
        </div>
      </div>
    </div>
  );
}
