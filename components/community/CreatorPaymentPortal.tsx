'use client';

import { useState } from 'react';
import {
  CreditCard,
  ArrowLeft,
  Loader2,
  Copy,
  Check,
  Calendar,
  Repeat,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import type { CreatorCommunityFormData } from './CreatorCommunityForm';

interface CreatorPaymentPortalProps {
  onBack: () => void;
  onSuccess: () => void;
  onGoToDashboard?: () => void;
  creatorDetails: CreatorCommunityFormData;
}

type PaymentGatewayId =
  | 'paystack'
  | 'flutterwave'
  | 'mastercard'
  | 'visa'
  | 'paypal'
  | 'stripe'
  | 'gpay'
  | 'amazon';

const GATEWAYS: {
  id: PaymentGatewayId;
  label: string;
  type: 'card' | 'link';
}[] = [
  { id: 'paystack', label: 'Paystack', type: 'link' },
  { id: 'flutterwave', label: 'Flutterwave', type: 'link' },
  { id: 'mastercard', label: 'Mastercard', type: 'card' },
  { id: 'visa', label: 'Visa', type: 'card' },
  { id: 'paypal', label: 'PayPal', type: 'link' },
  { id: 'stripe', label: 'Stripe', type: 'link' },
  { id: 'gpay', label: 'Google Pay', type: 'card' },
  { id: 'amazon', label: 'Amazon Pay', type: 'link' },
];

export function CreatorPaymentPortal({
  onBack,
  onSuccess,
  onGoToDashboard,
  creatorDetails,
}: CreatorPaymentPortalProps) {
  const [paymentState, setPaymentState] = useState<'form' | 'success' | 'failed'>('form');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayId>('paystack');
  const [cardholderName, setCardholderName] = useState(
    creatorDetails.payoutAccount?.accountName || creatorDetails.name || ''
  );
  const [cardNumber, setCardNumber] = useState('5399 8344 1920 8821');
  const [expDate, setExpDate] = useState('09/28');
  const [cvv, setCvv] = useState('482');
  const [saveDetails, setSaveDetails] = useState(true);
  const [recurringPayments, setRecurringPayments] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const amount = Math.max(2000, creatorDetails.pricePerMonth || 2000);
  const creatorShare = Math.round(amount * 0.92);
  const localBukaFee = Math.round(amount * 0.08);
  const billingLabel =
    creatorDetails.billingSchedule === 'quarterly'
      ? 'Quarterly'
      : creatorDetails.billingSchedule === 'yearly'
      ? 'Yearly'
      : 'Monthly';

  const communitySlug =
    (creatorDetails.name || 'chef-tolu-s-vip-kitchen')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'chef-tolu-s-vip-kitchen';

  const originUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000';
  const defaultInAppCheckoutLink = `${originUrl}/community/${communitySlug}/subscribe`;

  const customPaystackLink =
    creatorDetails.paymentLinks?.paystack &&
    creatorDetails.paymentLinks.paystack !== 'https://paystack.com/pay/localbuka-creator'
      ? creatorDetails.paymentLinks.paystack
      : defaultInAppCheckoutLink;

  const activePaymentLink =
    selectedGateway === 'paystack'
      ? customPaystackLink
      : selectedGateway === 'flutterwave'
      ? defaultInAppCheckoutLink
      : selectedGateway === 'stripe'
      ? defaultInAppCheckoutLink
      : defaultInAppCheckoutLink;

  const selectedGatewayLabel =
    GATEWAYS.find((g) => g.id === selectedGateway)?.label || 'Paystack';

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(activePaymentLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      // Card ending with 4417 triggers failed screen for testing
      if (cardNumber.trim().endsWith('4417')) {
        setPaymentState('failed');
      } else {
        setPaymentState('success');
      }
    }, 900);
  };

  // ─────────────────────────────────────────────────────────────
  // 1. PAYMENT FAILED STATE (Figma Screen 2)
  // ─────────────────────────────────────────────────────────────
  if (paymentState === 'failed') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-20 px-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full border-[3.5px] border-[#dc2626] flex items-center justify-center text-[#dc2626] mb-6 shadow-sm">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Payment failed</h2>

        <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed mb-8">
          We couldn&apos;t charge your card ending in{' '}
          {cardNumber ? cardNumber.slice(-4) : '4417'}.
          <br />
          Check your card details or try a different payment method.
        </p>

        <button
          type="button"
          onClick={() => setPaymentState('form')}
          className="px-10 py-3.5 rounded-xl bg-[#FFC533] hover:bg-[#e6b12d] text-black font-semibold text-sm transition-all shadow-md cursor-pointer"
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
      <div className="w-full max-w-[970px] mx-auto bg-white text-gray-900 rounded-[25px] p-8 sm:p-10 flex flex-col items-center justify-center shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Scalloped Green Rosette Badge */}
        <div
          className="mb-5 relative flex items-center justify-center shrink-0"
          style={{ width: '130px', height: '130px' }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 162 162"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M161.192 80.5966C161.192 87.2356 147.651 92.0072 146.014 98.1301C144.321 104.466 153.612 115.358 150.403 120.905C147.147 126.531 133.04 123.908 128.473 128.474C123.907 133.04 126.531 147.148 120.904 150.403C115.357 153.612 104.465 144.321 98.1296 146.014C92.0065 147.651 87.2351 161.192 80.5962 161.192C73.9572 161.192 69.1857 147.651 63.0625 146.014C56.7269 144.321 45.8348 153.612 40.288 150.403C34.6613 147.147 37.2851 133.04 32.7188 128.473C28.1522 123.907 14.0451 126.531 10.7893 120.904C7.57993 115.357 16.8712 104.465 15.178 98.1295C13.5415 92.0063 0 87.235 0 80.5961C0 73.9571 13.5412 69.1855 15.178 63.0626C16.8712 56.727 7.58022 45.8348 10.7896 40.2881C14.0451 34.6614 28.1525 37.2852 32.7191 32.7189C37.2857 28.1525 34.6616 14.0451 40.2883 10.7893C45.8354 7.57992 56.7272 16.8712 63.0628 15.178C69.1859 13.5415 73.9572 0 80.5962 0C87.2351 0 92.0068 13.5412 98.1296 15.178C104.465 16.8712 115.357 7.58021 120.904 10.7896C126.531 14.0451 123.907 28.1525 128.473 32.7191C133.04 37.2858 147.147 34.6617 150.403 40.2884C153.612 45.8354 144.321 56.7273 146.014 63.0629C147.651 69.1861 161.192 73.9577 161.192 80.5966Z"
              fill="#87C98A"
            />
            <path
              d="M54 81L73 100L112 61"
              stroke="#4CAF50"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
          Your payment &amp; payout setup are confirmed!
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          <span className="font-semibold text-gray-800">{creatorDetails.name}</span> is now configured at{' '}
          <span className="font-semibold text-gray-800">
            ₦{amount.toLocaleString('en-NG')} ({billingLabel})
          </span>
          .
        </p>

        {/* Receipt Box */}
        <div className="w-full max-w-md bg-[#ECEEF1]/85 rounded-2xl p-6 space-y-3 mb-6 text-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span>Order ID</span>
            <span className="font-semibold text-gray-900">LBK-45572908</span>
          </div>
          <div className="border-t border-gray-300/60" />
          <div className="flex items-center justify-between text-gray-500">
            <span>Payment Gateway</span>
            <span className="font-semibold text-gray-900">{selectedGatewayLabel}</span>
          </div>
          <div className="border-t border-gray-300/60" />
          <div className="flex items-center justify-between text-gray-500">
            <span>Creator Payout Account</span>
            <span className="font-semibold text-gray-900">
              {creatorDetails.payoutAccount?.bankName || 'Zenith Bank'} ·{' '}
              {creatorDetails.payoutAccount?.accountNumber || '2083948192'}
            </span>
          </div>
          <div className="border-t border-gray-300/60" />
          <div className="flex items-center justify-between text-gray-500">
            <span>Creator Earnings (92%)</span>
            <span className="font-semibold text-green-700">
              ₦{creatorShare.toLocaleString('en-NG')} / member
            </span>
          </div>
          <div className="border-t border-gray-300/60" />
          <div className="flex items-center justify-between text-gray-500">
            <span>Subscription Price</span>
            <span className="font-bold text-gray-900 text-base">
              ₦{amount.toLocaleString('en-NG')} / {billingLabel.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Active Payment Link Box */}
        <div className="w-full max-w-md bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 mb-7 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-gray-500">
              Active Member Payment Link ({selectedGatewayLabel})
            </p>
            <p className="text-xs font-mono text-gray-800 truncate">
              {activePaymentLink}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onSuccess}
            className="inline-flex items-center justify-center bg-[#FFC533] hover:bg-[#e6b12d] text-black font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Submit for Review / View Status
          </button>
          {onGoToDashboard && (
            <button
              type="button"
              onClick={onGoToDashboard}
              className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs px-6 py-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Open Creator Dashboard →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. PAYMENT FORM STATE (Figma Screen 1 & 4)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-[970px] mx-auto animate-in fade-in zoom-in-95 duration-300">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Creator details, cost bracket &amp; bank account</span>
      </button>

      {/* Main Payment Container Card */}
      <div className="bg-[#181818] rounded-[25px] overflow-hidden shadow-2xl border border-white/5 flex flex-col lg:flex-row">
        {/* Left Side - White Form Container */}
        <div className="w-full lg:w-[600px] bg-white text-gray-900 p-7 lg:p-10 rounded-[25px] lg:rounded-r-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Payment Method &amp; Gateway
              </h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FFC533]/25 text-gray-900">
                ₦{amount.toLocaleString('en-NG')} / {billingLabel}
              </span>
            </div>

            {/* Interactive Payment Platform Badges */}
            <p className="text-xs font-semibold text-gray-500 mb-2.5">
              Select payment platform or gateway:
            </p>
            <div className="flex items-center gap-2.5 mb-5 flex-wrap">
              {/* Paystack */}
              <button
                type="button"
                onClick={() => setSelectedGateway('paystack')}
                className={`border flex items-center justify-center px-3 py-2 shadow-xs cursor-pointer transition-all rounded-xl ${
                  selectedGateway === 'paystack'
                    ? 'border-[#FFC533] bg-[#FFC533]/15 ring-2 ring-[#FFC533]'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
                style={{ height: '52px' }}
              >
                <span className="font-extrabold text-xs text-[#09A5DB]">
                  Paystack
                </span>
              </button>

              {/* Flutterwave */}
              <button
                type="button"
                onClick={() => setSelectedGateway('flutterwave')}
                className={`border flex items-center justify-center px-3 py-2 shadow-xs cursor-pointer transition-all rounded-xl ${
                  selectedGateway === 'flutterwave'
                    ? 'border-[#FFC533] bg-[#FFC533]/15 ring-2 ring-[#FFC533]'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
                style={{ height: '52px' }}
              >
                <span className="font-extrabold text-xs text-[#F5A623]">
                  Flutterwave
                </span>
              </button>

              {/* Mastercard */}
              <button
                type="button"
                onClick={() => setSelectedGateway('mastercard')}
                className={`border flex items-center justify-center p-1 shadow-xs cursor-pointer transition-all ${
                  selectedGateway === 'mastercard'
                    ? 'border-[#FFC533] bg-[#FFC533]/15 ring-2 ring-[#FFC533]'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
                style={{ width: '52px', height: '52px', borderRadius: '12px' }}
              >
                <div className="flex -space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#EB001B] opacity-90" />
                  <div className="w-5 h-5 rounded-full bg-[#F79E1B] opacity-90" />
                </div>
              </button>

              {/* Visa */}
              <button
                type="button"
                onClick={() => setSelectedGateway('visa')}
                className={`border flex items-center justify-center p-1 shadow-xs cursor-pointer transition-all ${
                  selectedGateway === 'visa'
                    ? 'border-[#FFC533] bg-[#FFC533]/15 ring-2 ring-[#FFC533]'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
                style={{ width: '52px', height: '52px', borderRadius: '12px' }}
              >
                <span className="font-black italic text-xs tracking-tighter text-[#1A1F71]">
                  VISA
                </span>
              </button>

              {/* PayPal */}
              <button
                type="button"
                onClick={() => setSelectedGateway('paypal')}
                className={`border flex items-center justify-center p-1 shadow-xs cursor-pointer transition-all ${
                  selectedGateway === 'paypal'
                    ? 'border-[#FFC533] bg-[#FFC533]/15 ring-2 ring-[#FFC533]'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
                style={{ width: '52px', height: '52px', borderRadius: '12px' }}
              >
                <span className="font-bold italic text-xs text-[#003087]">
                  Pay<span className="text-[#0079C1]">Pal</span>
                </span>
              </button>

              {/* Stripe */}
              <button
                type="button"
                onClick={() => setSelectedGateway('stripe')}
                className={`border flex items-center justify-center p-1 shadow-xs cursor-pointer transition-all ${
                  selectedGateway === 'stripe'
                    ? 'border-[#FFC533] bg-[#FFC533]/15 ring-2 ring-[#FFC533]'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
                style={{ width: '52px', height: '52px', borderRadius: '12px' }}
              >
                <span className="font-bold text-xs text-[#635BFF]">stripe</span>
              </button>

              {/* GPay */}
              <button
                type="button"
                onClick={() => setSelectedGateway('gpay')}
                className={`border flex items-center justify-center p-1 shadow-xs cursor-pointer transition-all ${
                  selectedGateway === 'gpay'
                    ? 'border-[#FFC533] bg-[#FFC533]/15 ring-2 ring-[#FFC533]'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
                style={{ width: '52px', height: '52px', borderRadius: '12px' }}
              >
                <span className="font-bold text-xs text-gray-700">
                  <span className="text-[#4285F4]">G</span>Pay
                </span>
              </button>
            </div>

            {/* Active Platform Payment Link Bar */}
            <div className="mb-5 rounded-xl bg-[#ECEEF1] p-3.5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-gray-500">
                  {selectedGatewayLabel} Checkout Link
                </span>
                <span className="block text-xs font-mono text-gray-900 truncate">
                  {activePaymentLink}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white text-gray-900 text-xs font-semibold border border-gray-300 hover:bg-gray-50 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-200 text-gray-500 text-xs font-semibold cursor-not-allowed">
                  <span>Closed until deploy</span>
                </span>
              </div>
            </div>

            {/* Card / Billing Form */}
            <form onSubmit={handleConfirmPurchase} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Cardholder / Account name
                </label>
                <input
                  type="text"
                  required
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full max-w-[462px] px-4 py-3 bg-[#ECEEF1] border-none rounded-[5px] text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC533]/40 transition-all h-[46px]"
                />
              </div>

              <div className="flex items-center gap-3 max-w-[462px]">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Card number (end in 4417 to test failure)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-[#ECEEF1] border-none rounded-[5px] text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC533]/40 transition-all h-[46px]"
                  />
                </div>

                <div className="w-[76px]">
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5 text-center">
                    Exp
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-2 py-3 bg-[#ECEEF1] border-none rounded-[5px] text-gray-900 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#FFC533]/40 transition-all h-[46px]"
                  />
                </div>

                <div className="w-[72px]">
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5 text-center">
                    CCV
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full px-2 py-3 bg-[#ECEEF1] border-none rounded-[5px] text-gray-900 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#FFC533]/40 transition-all h-[46px]"
                  />
                </div>
              </div>

              {/* Checkbox: Save payment details */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="save-details"
                  type="checkbox"
                  checked={saveDetails}
                  onChange={(e) => setSaveDetails(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1877F2] focus:ring-[#1877F2] border-gray-300"
                />
                <label
                  htmlFor="save-details"
                  className="text-xs text-gray-700 font-medium cursor-pointer select-none"
                >
                  Save my payment details &amp; settlement method for future payouts
                </label>
              </div>

              {/* Switch: Recurring payments */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-900">
                      Enable scheduled recurring payments ({billingLabel})
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#bbf7d0] text-[#15803d]">
                      Highly recommended
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRecurringPayments(!recurringPayments)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
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

                <p className="text-[11px] text-gray-500 mt-1 max-w-sm">
                  Automatically bill members on a {billingLabel.toLowerCase()} schedule starting{' '}
                  {creatorDetails.scheduledLaunchDate || 'today'}.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Dark Order, Payout Account & Commission Summary */}
        <div className="flex-1 bg-[#181818] text-white p-7 lg:p-10 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-5">
              Community, Cost Bracket &amp; Payout Summary
            </h3>

            <div className="rounded-2xl bg-[#222222] border border-white/8 p-4 mb-5 space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block">Community Name</span>
                <span className="text-white font-bold text-sm">
                  {creatorDetails.name || "Chef Tolu's VIP Kitchen"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/8">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5 text-[#FFC533]" />
                  <span>Billing Cadence</span>
                </span>
                <span className="text-white font-semibold">{billingLabel}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FFC533]" />
                  <span>Scheduled Launch</span>
                </span>
                <span className="text-white font-semibold">
                  {creatorDetails.scheduledLaunchDate || 'Immediate'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#FFC533]" />
                  <span>Active Gateway</span>
                </span>
                <span className="text-[#FFC533] font-semibold">
                  {selectedGatewayLabel}
                </span>
              </div>
            </div>

            {/* Linked Creator Payout Bank Account Card */}
            <div className="rounded-2xl bg-[#222222] border border-[#4ade80]/25 p-4 mb-5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#4ade80] font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Payout Settlement Account</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#4ade80]">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-white font-semibold">
                {creatorDetails.payoutAccount?.bankName || 'Zenith Bank PLC'}
              </p>
              <p className="text-gray-400">
                Acct:{' '}
                <span className="text-white font-mono">
                  {creatorDetails.payoutAccount?.accountNumber || '2083948192'}
                </span>{' '}
                · {creatorDetails.payoutAccount?.accountName || 'Tolu Olawale'}
              </p>
            </div>

            <div className="space-y-2.5 text-sm mb-8">
              <div className="flex items-center justify-between text-gray-300 text-xs">
                <span>Subscription Cost (Min ₦2,000):</span>
                <span className="text-white font-semibold">
                  ₦{amount.toLocaleString('en-NG')}
                </span>
              </div>

              <div className="flex items-center justify-between text-gray-300 text-xs">
                <span>Creator Earnings (92%):</span>
                <span className="text-[#4ade80] font-semibold">
                  ₦{creatorShare.toLocaleString('en-NG')} / member
                </span>
              </div>

              <div className="flex items-center justify-between text-gray-400 text-xs">
                <span>LocalBuka Commission (8%):</span>
                <span>₦{localBukaFee.toLocaleString('en-NG')}</span>
              </div>

              <div className="border-t border-white/10 pt-3 flex items-center justify-between text-white font-bold text-base">
                <span>Plan Rate</span>
                <span className="text-[#FFC533]">
                  ₦{amount.toLocaleString('en-NG')} / {billingLabel.toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirmPurchase}
            disabled={isProcessing}
            className="w-full px-6 py-3.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing &amp; Submitting...</span>
              </>
            ) : (
              <span>Confirm Payment &amp; Submit Community</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
