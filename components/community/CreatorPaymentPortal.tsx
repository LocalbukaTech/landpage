'use client';

import { useState } from 'react';
import { CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreatorPaymentPortalProps {
  onBack: () => void;
  onSuccess: () => void;
  creatorDetails: {
    name: string;
    bio: string;
    avatar: string;
  };
}

export function CreatorPaymentPortal({
  onBack,
  onSuccess,
  creatorDetails,
}: CreatorPaymentPortalProps) {
  const { toast } = useToast();
  const [paymentState, setPaymentState] = useState<'form' | 'success' | 'failed'>('form');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState(creatorDetails.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveDetails, setSaveDetails] = useState(true);
  const [recurringPayments, setRecurringPayments] = useState(false);

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      // If card ends with 4417 or if specifically tested, can trigger failed, otherwise success
      if (cardNumber.endsWith('4417')) {
        setPaymentState('failed');
      } else {
        setPaymentState('success');
      }
    }, 1200);
  };

  // ─────────────────────────────────────────────────────────────
  // 1. PAYMENT FAILED STATE (Figma Screen 2)
  // ─────────────────────────────────────────────────────────────
  if (paymentState === 'failed') {
    return (
      <div className='w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-20 px-4 animate-in fade-in zoom-in-95 duration-300'>
        {/* Red Circular Ring with X */}
        <div className='w-16 h-16 rounded-full border-[3.5px] border-[#dc2626] flex items-center justify-center text-[#dc2626] mb-6 shadow-sm'>
          <svg className='w-8 h-8' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3.5' strokeLinecap='round' strokeLinejoin='round'>
            <line x1='18' y1='6' x2='6' y2='18'></line>
            <line x1='6' y1='6' x2='18' y2='18'></line>
          </svg>
        </div>

        <h2 className='text-2xl font-bold text-white mb-2'>
          Payment failed
        </h2>

        <p className='text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed mb-8'>
          We couldn&apos;t charge your Visa ending in {cardNumber ? cardNumber.slice(-4) : '4417'}.<br />
          Check your card details or try a different method.
        </p>

        <button
          type='button'
          onClick={() => setPaymentState('form')}
          className='px-10 py-3.5 rounded-xl bg-[#FFC533] hover:bg-[#e6b12d] text-black font-semibold text-sm transition-all shadow-md'
        >
          Try again
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. PAYMENT SUCCESS STATE (Figma Screen 3)
  // ─────────────────────────────────────────────────────────────
  if (paymentState === 'success') {
    return (
      <div className='w-full max-w-[970px] lg:h-[664px] mx-auto bg-white text-gray-900 rounded-[25px] p-8 sm:p-10 flex flex-col items-center justify-center shadow-2xl animate-in fade-in zoom-in-95 duration-300'>
        {/* Scalloped Green Rosette Badge */}
        <div
          className='mb-6 relative flex items-center justify-center shrink-0'
          style={{ width: '161.19px', height: '161.19px' }}
        >
          <svg className='w-full h-full' viewBox='0 0 162 162' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M161.192 80.5966C161.192 87.2356 147.651 92.0072 146.014 98.1301C144.321 104.466 153.612 115.358 150.403 120.905C147.147 126.531 133.04 123.908 128.473 128.474C123.907 133.04 126.531 147.148 120.904 150.403C115.357 153.612 104.465 144.321 98.1296 146.014C92.0065 147.651 87.2351 161.192 80.5962 161.192C73.9572 161.192 69.1857 147.651 63.0625 146.014C56.7269 144.321 45.8348 153.612 40.288 150.403C34.6613 147.147 37.2851 133.04 32.7188 128.473C28.1522 123.907 14.0451 126.531 10.7893 120.904C7.57993 115.357 16.8712 104.465 15.178 98.1295C13.5415 92.0063 0 87.235 0 80.5961C0 73.9571 13.5412 69.1855 15.178 63.0626C16.8712 56.727 7.58022 45.8348 10.7896 40.2881C14.0451 34.6614 28.1525 37.2852 32.7191 32.7189C37.2857 28.1525 34.6616 14.0451 40.2883 10.7893C45.8354 7.57992 56.7272 16.8712 63.0628 15.178C69.1859 13.5415 73.9572 0 80.5962 0C87.2351 0 92.0068 13.5412 98.1296 15.178C104.465 16.8712 115.357 7.58021 120.904 10.7896C126.531 14.0451 123.907 28.1525 128.473 32.7191C133.04 37.2858 147.147 34.6617 150.403 40.2884C153.612 45.8354 144.321 56.7273 146.014 63.0629C147.651 69.1861 161.192 73.9577 161.192 80.5966Z'
              fill='#87C98A'
            />
            {/* Inner Dark Green Bold Checkmark */}
            <path
              d='M54 81L73 100L112 61'
              stroke='#4CAF50'
              strokeWidth='16'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>

        <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center'>
          Your payment is successful!
        </h2>

        {/* Receipt Box */}
        <div className='w-full max-w-md bg-[#ECEEF1]/85 rounded-2xl p-6 space-y-3.5 mb-8 text-sm'>
          <div className='flex items-center justify-between text-gray-500'>
            <span>Order ID</span>
            <span className='font-semibold text-gray-900'>45572908</span>
          </div>
          <div className='border-t border-gray-300/60' />
          <div className='flex items-center justify-between text-gray-500'>
            <span>Payment Method</span>
            <span className='font-semibold text-gray-900'>Google Pay</span>
          </div>
          <div className='border-t border-gray-300/60' />
          <div className='flex items-center justify-between text-gray-500'>
            <span>Date &amp; Time</span>
            <span className='font-semibold text-gray-900'>017/09/26</span>
          </div>
          <div className='border-t border-gray-300/60' />
          <div className='flex items-center justify-between text-gray-500'>
            <span>Total</span>
            <span className='font-bold text-gray-900 text-base'>₦2,500</span>
          </div>
        </div>

        <button
          type='button'
          onClick={onSuccess}
          className='inline-flex items-center justify-center bg-[#FFC533] hover:bg-[#e6b12d] text-black font-semibold text-xs transition-all shadow-sm'
          style={{ width: '240.75px', height: '43.39px', borderRadius: '4.25px' }}
        >
          Back to creator community
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. PAYMENT FORM STATE (Figma Screen 1 & 4)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className='w-full max-w-[970px] mx-auto animate-in fade-in zoom-in-95 duration-300'>
      {/* Back Button */}
      <button
        onClick={onBack}
        className='flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors group'
      >
        <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
        <span>Back to Creator details</span>
      </button>

      {/* Main Payment Container Card */}
      <div className='bg-[#181818] rounded-[25px] overflow-hidden shadow-2xl border border-white/5 flex flex-col lg:flex-row lg:h-[664px]'>
        {/* Left Side - White Form Container */}
        <div className='w-full lg:w-[600px] lg:h-full bg-white text-gray-900 p-8 lg:p-10 rounded-[25px] lg:rounded-r-none flex flex-col justify-between overflow-y-auto'>
          <div>
            <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-5'>
              Payment Method
            </h2>

            {/* Payment Method Selector */}
            <div className='mb-6'>
              <button
                type='button'
                className='flex items-center gap-3 px-5 rounded-[5px] bg-[#FFC533] text-black font-semibold text-sm shadow-sm cursor-default'
                style={{ width: '223px', height: '51px' }}
              >
                <CreditCard className='w-5 h-5 text-black flex-shrink-0' />
                <span>Card</span>
              </button>
            </div>

          {/* Supported Card Badges */}
          <div className='flex items-center gap-3 mb-6 flex-wrap'>
            {/* Mastercard */}
            <div
              className='bg-white border border-gray-200 flex items-center justify-center p-1 shadow-xs flex-shrink-0'
              style={{ width: '55.54px', height: '55.54px', borderRadius: '12.86px' }}
            >
              <div className='flex -space-x-2.5'>
                <div className='w-5 h-5 rounded-full bg-[#EB001B] opacity-90' />
                <div className='w-5 h-5 rounded-full bg-[#F79E1B] opacity-90' />
              </div>
            </div>

            {/* Visa */}
            <div
              className='bg-white border border-gray-200 flex items-center justify-center p-1 shadow-xs flex-shrink-0'
              style={{ width: '55.54px', height: '55.54px', borderRadius: '12.86px' }}
            >
              <span className='font-black italic text-xs tracking-tighter text-[#1A1F71]'>
                VISA
              </span>
            </div>

            {/* PayPal */}
            <div
              className='bg-white border border-gray-200 flex items-center justify-center p-1 shadow-xs flex-shrink-0'
              style={{ width: '55.54px', height: '55.54px', borderRadius: '12.86px' }}
            >
              <span className='font-bold italic text-xs text-[#003087]'>
                Pay<span className='text-[#0079C1]'>Pal</span>
              </span>
            </div>

            {/* Stripe */}
            <div
              className='bg-white border border-gray-200 flex items-center justify-center p-1 shadow-xs flex-shrink-0'
              style={{ width: '55.54px', height: '55.54px', borderRadius: '12.86px' }}
            >
              <span className='font-bold text-xs text-[#635BFF]'>
                stripe
              </span>
            </div>

            {/* GPay */}
            <div
              className='bg-white border border-gray-200 flex items-center justify-center p-1 shadow-xs flex-shrink-0'
              style={{ width: '55.54px', height: '55.54px', borderRadius: '12.86px' }}
            >
              <span className='font-bold text-xs text-gray-700'>
                <span className='text-[#4285F4]'>G</span>Pay
              </span>
            </div>

            {/* Amazon */}
            <div
              className='bg-white border border-gray-200 flex items-center justify-center p-1 shadow-xs flex-shrink-0'
              style={{ width: '55.54px', height: '55.54px', borderRadius: '12.86px' }}
            >
              <span className='font-bold text-xs text-gray-900'>
                amazon
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleConfirmPurchase} className='space-y-4'>
            {/* Cardholder Name */}
            <div>
              <label className='block text-xs font-semibold text-gray-900 mb-1.5'>
                Cardholder name
              </label>
              <input
                type='text'
                required
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className='w-full max-w-[462px] px-4 py-3 bg-[#ECEEF1] border-none rounded-[5px] text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC533]/40 transition-all h-[48px]'
                style={{ width: '462px' }}
              />
            </div>

            {/* Card Number, Exp, CCV */}
            <div className='flex items-center gap-3 max-w-[462px]'>
              <div>
                <label className='block text-xs font-semibold text-gray-900 mb-1.5'>
                  Card number
                </label>
                <input
                  type='text'
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className='px-4 py-3 bg-[#ECEEF1] border-none rounded-[5px] text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC533]/40 transition-all h-[48px]'
                  style={{ width: '294px' }}
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-900 mb-1.5 text-center'>
                  Exp
                </label>
                <input
                  type='text'
                  required
                  maxLength={5}
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className='px-2 py-3 bg-[#ECEEF1] border-none rounded-[5px] text-gray-900 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#FFC533]/40 transition-all h-[48px]'
                  style={{ width: '72px' }}
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-900 mb-1.5 text-center'>
                  CCV
                </label>
                <input
                  type='password'
                  required
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className='px-2 py-3 bg-[#ECEEF1] border-none rounded-[5px] text-gray-900 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#FFC533]/40 transition-all h-[48px]'
                  style={{ width: '72px' }}
                />
              </div>
            </div>

            {/* Checkbox: Save payment details */}
            <div className='flex items-center gap-2 pt-2'>
              <input
                id='save-details'
                type='checkbox'
                checked={saveDetails}
                onChange={(e) => setSaveDetails(e.target.checked)}
                className='w-4 h-4 rounded text-[#1877F2] focus:ring-[#1877F2] border-gray-300'
              />
              <label htmlFor='save-details' className='text-xs text-gray-700 font-medium cursor-pointer select-none'>
                Save my payment details for future purposes
              </label>
            </div>

            {/* Switch: Recurring payments */}
            <div className='pt-3 border-t border-gray-100'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs font-semibold text-gray-900'>
                    Enable recurring payments
                  </span>
                  <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#bbf7d0] text-[#15803d]'>
                    Highly recommended
                  </span>
                </div>

                {/* Toggle switch */}
                <button
                  type='button'
                  onClick={() => setRecurringPayments(!recurringPayments)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    recurringPayments ? 'bg-[#4ade80]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      recurringPayments ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <p className='text-[11px] text-gray-500 mt-1 max-w-sm'>
                Set up automatic payments so you never have to worry about missing a payment.
              </p>
            </div>
          </form>
        </div>
      </div>

        {/* Right Side - Dark Order Summary */}
        <div className='flex-1 bg-[#181818] text-white p-8 lg:p-10 flex flex-col justify-start'>
          <h3 className='text-sm font-semibold text-white mb-6'>
            Order Summary
          </h3>

          <div className='space-y-4 text-sm mb-8'>
            <div className='flex items-center justify-between text-gray-200 font-semibold'>
              <span>Balance Amount:</span>
              <span className='text-white'>₦2,500</span>
            </div>

            <div className='flex items-center justify-between text-gray-200 font-semibold'>
              <span>Total</span>
              <span className='text-white'>₦2,500</span>
            </div>
          </div>

          <button
            type='button'
            onClick={handleConfirmPurchase}
            disabled={isProcessing}
            className='px-6 rounded-[5px] bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50'
            style={{ width: '223px', height: '51px' }}
          >
            {isProcessing ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                <span>Processing...</span>
              </>
            ) : (
              <span>Confirm purchase</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
