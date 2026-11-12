'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  ImageIcon,
  Calendar,
  Link2,
  Copy,
  Check,
  Clock,
  Sparkles,
  Plus,
  X,
  Building2,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

const PRESET_AVATARS = [
  '/images/community/cover-1.jpg',
  '/images/community/chef-amaka-hero.jpg',
  '/images/community/carousel-1.jpg',
  '/images/community/avatar-4.png',
  '/images/community/avatar-1.png',
];

export const COST_BRACKETS = [
  {
    id: 'base_2k',
    name: 'Base Plan',
    price: 2000,
    rangeLabel: '₦2,000 / mo',
    tag: 'Minimum Base',
    description: 'Entry paid tier for community recipes, tips & member discussions.',
  },
  {
    id: 'standard_3_5k',
    name: 'Growth Plan',
    price: 3500,
    rangeLabel: '₦3,500 / mo',
    tag: 'Popular',
    description: 'Weekly exclusive dishes, video guides & priority creator Q&A.',
  },
  {
    id: 'pro_5k',
    name: 'Pro Chef Plan',
    price: 5000,
    rangeLabel: '₦5,000 / mo',
    tag: 'Masterclass',
    description: 'Live monthly cook-alongs, secret menu spots & full recipe vault.',
  },
  {
    id: 'vip_10k',
    name: 'VIP Club Plan',
    price: 10000,
    rangeLabel: '₦10,000+ / mo',
    tag: 'All-Access VIP',
    description: '1-on-1 culinary coaching, private tasting invites & restaurant perks.',
  },
] as const;

export type CostBracketId = (typeof COST_BRACKETS)[number]['id'] | 'custom';

export const NIGERIAN_BANKS = [
  { code: 'zenith', name: 'Zenith Bank PLC' },
  { code: 'gtb', name: 'Guaranty Trust Bank (GTBank)' },
  { code: 'access', name: 'Access Bank' },
  { code: 'firstbank', name: 'First Bank of Nigeria' },
  { code: 'uba', name: 'United Bank for Africa (UBA)' },
  { code: 'kuda', name: 'Kuda Microfinance Bank' },
  { code: 'moniepoint', name: 'Moniepoint MFB' },
  { code: 'opay', name: 'OPay (PayCom)' },
] as const;

export const PAYMENT_PLATFORMS = [
  { id: 'paystack', label: 'Paystack (Recommended)', badge: 'Default NGN Gateway' },
  { id: 'flutterwave', label: 'Flutterwave', badge: 'Multi-currency Cards & Bank' },
  { id: 'card', label: 'Direct Card (Visa / Mastercard)', badge: 'Instant Checkout' },
  { id: 'bank_transfer', label: 'Pay with Bank Transfer / USSD', badge: 'Virtual Account' },
  { id: 'stripe', label: 'Stripe', badge: 'International Members' },
  { id: 'paypal', label: 'PayPal', badge: 'Global Wallet' },
] as const;

export interface CreatorCommunityFormData {
  name: string;
  bio: string;
  category: 'free' | 'paid';
  avatar: string;
  coverImage?: string;
  costBracket: CostBracketId;
  pricePerMonth: number;
  yearlyPrice: number;
  billingSchedule: 'monthly' | 'quarterly' | 'yearly';
  payoutSchedule: '7_day_hold' | 'weekly' | 'biweekly' | 'monthly';
  scheduledLaunchDate: string;
  primaryPaymentMethod: string;
  paymentPlatforms: string[];
  payoutAccount: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  paymentLinks: {
    paystack: string;
    flutterwave: string;
    stripe: string;
    custom: string;
  };
  benefits: string[];
}

interface CreatorCommunityFormProps {
  initialData?: Partial<CreatorCommunityFormData>;
  onSelectPaidPlan: (formData: CreatorCommunityFormData) => void;
  onSelectFreePlan: (formData: CreatorCommunityFormData) => void;
}

export const MIN_PAID_PRICE = 2000;

export function CreatorCommunityForm({
  initialData,
  onSelectPaidPlan,
  onSelectFreePlan,
}: CreatorCommunityFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [category, setCategory] = useState<'free' | 'paid'>(
    initialData?.category || 'paid'
  );
  const [selectedAvatar, setSelectedAvatar] = useState(
    initialData?.avatar || PRESET_AVATARS[0]
  );
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  // Cost Bracket & Pricing state (Base plan starts at ₦2,000 minimum and moves upward)
  const [costBracket, setCostBracket] = useState<CostBracketId>(
    initialData?.costBracket || 'base_2k'
  );
  const [pricePerMonth, setPricePerMonth] = useState<number>(
    Math.max(MIN_PAID_PRICE, initialData?.pricePerMonth ?? 2000)
  );
  const [priceInputRaw, setPriceInputRaw] = useState<string>(
    String(Math.max(MIN_PAID_PRICE, initialData?.pricePerMonth ?? 2000))
  );

  // Schedule state
  const [billingSchedule, setBillingSchedule] = useState<
    'monthly' | 'quarterly' | 'yearly'
  >(initialData?.billingSchedule || 'monthly');
  const [payoutSchedule, setPayoutSchedule] = useState<
    '7_day_hold' | 'weekly' | 'biweekly' | 'monthly'
  >(initialData?.payoutSchedule || '7_day_hold');
  const [scheduledLaunchDate, setScheduledLaunchDate] = useState<string>(
    initialData?.scheduledLaunchDate ||
      new Date().toISOString().split('T')[0]
  );

  // Payment Method & Payout Bank Account state
  const [primaryPaymentMethod, setPrimaryPaymentMethod] = useState<string>(
    initialData?.primaryPaymentMethod || 'paystack'
  );
  const [paymentPlatforms, setPaymentPlatforms] = useState<string[]>(
    initialData?.paymentPlatforms || ['paystack', 'card', 'bank_transfer']
  );
  const [bankCode, setBankCode] = useState<string>(
    initialData?.payoutAccount?.bankCode || 'zenith'
  );
  const [accountNumber, setAccountNumber] = useState<string>(
    initialData?.payoutAccount?.accountNumber || '2083948192'
  );
  const [accountName, setAccountName] = useState<string>(
    initialData?.payoutAccount?.accountName || 'Tolu Olawale'
  );

  // Payment Links state
  const [paymentLinks] = useState({
    paystack:
      initialData?.paymentLinks?.paystack &&
      initialData.paymentLinks.paystack !== 'https://paystack.com/pay/localbuka-creator'
        ? initialData.paymentLinks.paystack
        : '',
    flutterwave:
      initialData?.paymentLinks?.flutterwave ||
      'https://flutterwave.com/pay/localbuka-vip',
    stripe:
      initialData?.paymentLinks?.stripe ||
      'https://buy.stripe.com/localbuka-creator',
    custom: initialData?.paymentLinks?.custom || '',
  });

  const [benefits, setBenefits] = useState<string[]>(
    initialData?.benefits || [
      'Exclusive recipes and weekly cook-along sessions',
      'Private food spot recommendations & tasting invites',
      'Direct Q&A and priority community badge',
    ]
  );
  const [newBenefit, setNewBenefit] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const slugPreview =
    (name || 'my-food-community')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'my-food-community';

  const originUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000';
  const generatedCheckoutLink = `${originUrl}/community/${slugPreview}/subscribe`;

  const cycleSuffix =
    billingSchedule === 'monthly'
      ? '/mo'
      : billingSchedule === 'quarterly'
      ? '/qtr'
      : '/yr';

  // PRD Revenue split: 92% Creator, 8% LocalBuka commission
  const creatorShare = Math.round((pricePerMonth || 0) * 0.92);
  const platformFee = Math.round((pricePerMonth || 0) * 0.08);
  const isBelowMinPrice = category === 'paid' && pricePerMonth < MIN_PAID_PRICE;

  const handleSelectBracket = (bracket: (typeof COST_BRACKETS)[number]) => {
    setCostBracket(bracket.id);
    setPricePerMonth(bracket.price);
    setPriceInputRaw(String(bracket.price));
    setFormError(null);
  };

  const handleCustomPriceChange = (val: string) => {
    setPriceInputRaw(val);
    const num = Number(val);
    setPricePerMonth(num);
    const matched = COST_BRACKETS.find((b) => b.price === num);
    setCostBracket(matched ? matched.id : 'custom');
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomAvatar(reader.result);
          setSelectedAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePlatform = (id: string) => {
    setPaymentPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return;
    setBenefits((prev) => [...prev, newBenefit.trim()]);
    setNewBenefit('');
  };

  const handleCopyGeneratedLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(generatedCheckoutLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const selectedBankName =
    NIGERIAN_BANKS.find((b) => b.code === bankCode)?.name || 'Zenith Bank PLC';

  const buildFormData = (selectedCategory: 'free' | 'paid'): CreatorCommunityFormData => {
    const finalName = name.trim() || "Chef Tolu's VIP Kitchen";
    const finalBio =
      bio.trim() ||
      'A focused space where food lovers connect, share authentic recipes, and discover hidden culinary gems.';
    const effectivePrice =
      selectedCategory === 'free'
        ? 0
        : Math.max(MIN_PAID_PRICE, pricePerMonth || MIN_PAID_PRICE);
    return {
      name: finalName,
      bio: finalBio,
      category: selectedCategory,
      avatar: selectedAvatar,
      coverImage: selectedAvatar,
      costBracket,
      pricePerMonth: effectivePrice,
      yearlyPrice: effectivePrice * 10,
      billingSchedule,
      payoutSchedule,
      scheduledLaunchDate,
      primaryPaymentMethod,
      paymentPlatforms:
        paymentPlatforms.length > 0 ? paymentPlatforms : ['paystack', 'card'],
      payoutAccount: {
        bankCode,
        bankName: selectedBankName,
        accountNumber: accountNumber.trim() || '2083948192',
        accountName: accountName.trim() || finalName,
      },
      paymentLinks: {
        ...paymentLinks,
        paystack: paymentLinks.paystack.trim() || generatedCheckoutLink,
        custom: paymentLinks.custom.trim() || generatedCheckoutLink,
      },
      benefits,
    };
  };

  const handleFreeSubmit = () => {
    setFormError(null);
    setCategory('free');
    onSelectFreePlan(buildFormData('free'));
  };

  const handlePaidSubmit = () => {
    setFormError(null);
    if (!pricePerMonth || pricePerMonth < MIN_PAID_PRICE) {
      setFormError(
        `Paid community base plan starts at ₦${MIN_PAID_PRICE.toLocaleString('en-NG')}/month. Prices below ₦2,000 are not allowed.`
      );
      return;
    }
    if (accountNumber.replace(/\D/g, '').length !== 10) {
      setFormError(
        'Please enter a valid 10-digit Nigerian bank account number for your creator payouts.'
      );
      return;
    }
    if (!accountName.trim()) {
      setFormError('Please enter the account holder name for your payout bank account.');
      return;
    }
    setCategory('paid');
    onSelectPaidPlan(buildFormData('paid'));
  };

  return (
    <div className="h-full flex flex-col justify-start px-6 sm:px-8 lg:px-10 py-7 lg:py-8 text-white bg-[#1a1a1a] overflow-y-auto">
      {/* ── Header ─────────────────────────────── */}
      <div className="mb-5 text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFC533]/15 px-3 py-1 text-[11px] font-semibold text-[#FFC533] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Creator Community Onboarding</span>
        </div>
        <h2 className="text-2xl sm:text-[26px] font-bold leading-tight text-white mb-1">
          Welcome to Localbuka
          <br />
          Creator Community!
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Enter your community details, choose Free or Subscribed, pick your cost bracket (starting at ₦2,000 Base Plan upward), and link your payout account.
        </p>
      </div>

      {formError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-500/15 border border-red-500/40 px-4 py-3 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      {/* ── Step 1: Community Identity (Name & Bio) ── */}
      <div className="space-y-3 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Community Name
          </label>
          <input
            type="text"
            placeholder="e.g. Chef Amaka's VIP Kitchen"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[#252525] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFC533] transition-all h-[46px]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Community Bio &amp; Purpose
          </label>
          <textarea
            placeholder="Describe what members receive in your community (recipes, live cook-alongs, restaurant reviews...)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 bg-[#252525] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFC533] transition-all resize-none h-[80px]"
          />
        </div>
      </div>

      {/* ── Step 2: Select Category (Free vs Subscribed/Paid) ── */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-white mb-3">
          Select Community Model (Free or Subscribed)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Free Card */}
          <div
            onClick={() => {
              setCategory('free');
              setFormError(null);
            }}
            className={`cursor-pointer p-4 border transition-all duration-200 flex flex-col justify-between gap-3 rounded-[15px] min-h-[250px] ${
              category === 'free'
                ? 'bg-[#252525] border-[#FFC533] shadow-[0_0_0_1px_#FFC533]'
                : 'bg-[#222222] border-white/5 hover:border-white/15'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center justify-center text-[11px] font-bold bg-[#FFC533] text-black px-3 py-1 rounded-full">
                  Free
                </span>
                {category === 'free' && (
                  <span className="text-[10px] font-semibold text-[#FFC533]">
                    Selected ✓
                  </span>
                )}
              </div>
              <ul className="space-y-2.5 text-[11px] text-gray-300 leading-snug pl-1">
                <li className="flex gap-1.5">
                  <span className="text-gray-400 font-medium shrink-0">1.</span>
                  <span>Gain unlimited access to free LocalBuka communities.</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="text-gray-400 font-medium shrink-0">2.</span>
                  <span>View and participate using approved community engagement features.</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="text-gray-400 font-medium shrink-0">3.</span>
                  <span>Open discovery with no subscription fee required.</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-xs font-bold text-[#4ade80]">₦0 / Free</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFreeSubmit();
                }}
                className="inline-flex items-center justify-center bg-[#FFC533] hover:bg-[#e6b12d] text-black font-semibold text-xs px-4 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                Select Free
              </button>
            </div>
          </div>

          {/* Paid / Subscribed Card */}
          <div
            onClick={() => setCategory('paid')}
            className={`cursor-pointer p-4 border transition-all duration-200 flex flex-col justify-between gap-3 rounded-[15px] min-h-[250px] ${
              category === 'paid'
                ? 'bg-[#252525] border-[#FFC533] shadow-[0_0_0_1px_#FFC533]'
                : 'bg-[#222222] border-white/5 hover:border-white/15'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="inline-flex items-center justify-center text-[11px] font-bold bg-[#86efac] text-black px-3 py-1 rounded-full">
                  Paid (Subscribed)
                </span>
                {category === 'paid' && (
                  <span className="text-[10px] font-semibold text-[#FFC533]">
                    Selected ✓
                  </span>
                )}
              </div>
              <ul className="space-y-2 text-[10.5px] text-gray-300 leading-snug pl-1">
                <li className="flex gap-1.5">
                  <span className="text-gray-400 font-medium shrink-0">1.</span>
                  <span>Base plan starts at ₦2,000/mo and scales upward by bracket.</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="text-gray-400 font-medium shrink-0">2.</span>
                  <span>Creator earns 92% of revenue (8% LocalBuka commission).</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="text-gray-400 font-medium shrink-0">3.</span>
                  <span>Link your payout bank account &amp; Paystack/Flutterwave gateway.</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="inline-flex items-center justify-center bg-[#FFC533]/20 text-[#FFC533] border border-[#FFC533]/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                ₦{Math.max(MIN_PAID_PRICE, pricePerMonth || MIN_PAID_PRICE).toLocaleString('en-NG')}
                {cycleSuffix}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaidSubmit();
                }}
                className="inline-flex items-center justify-center bg-[#FFC533] hover:bg-[#e6b12d] text-black font-semibold text-xs px-4 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                Setup &amp; Pay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Step 3: Cost Bracket (₦2,000 Base Plan Upward) + Payment Method & Bank Account ── */}
      {category === 'paid' && (
        <div className="mb-6 rounded-2xl bg-[#222222] border border-[#FFC533]/30 p-4 sm:p-5 space-y-6 animate-in fade-in duration-200">
          {/* Section A: Cost Bracket Selector (Base ₦2,000 upward) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FFC533]" />
                <h3 className="text-sm font-bold text-white">
                  1. Select Subscription Cost Bracket
                </h3>
              </div>
              <span className="text-[10.5px] text-[#FFC533] font-semibold bg-[#FFC533]/10 px-2.5 py-0.5 rounded-full">
                Min Base Plan: ₦2,000/mo
              </span>
            </div>

            <p className="text-[11px] text-gray-400">
              Choose a recommended cost bracket starting from the ₦2,000 base plan and moving upward, or enter a custom price (₦2,000 minimum).
            </p>

            {/* 4 Upward Cost Bracket Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COST_BRACKETS.map((bracket) => {
                const isSelected =
                  costBracket === bracket.id && pricePerMonth === bracket.price;
                return (
                  <button
                    key={bracket.id}
                    type="button"
                    onClick={() => handleSelectBracket(bracket)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-[#FFC533]/15 border-[#FFC533] shadow-[0_0_0_1px_#FFC533]'
                        : 'bg-[#181818] border-white/8 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-white">
                        {bracket.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-[#FFC533] text-black'
                            : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        {bracket.tag}
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-[#FFC533]">
                      {bracket.rangeLabel}
                    </div>
                    <p className="text-[10.5px] text-gray-400 leading-snug">
                      {bracket.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Custom Price Input (Enforcing >= ₦2,000) */}
            <div className="pt-2 space-y-2">
              <label className="block text-xs font-semibold text-gray-300">
                Custom Subscription Price (₦2,000 minimum base plan and upward)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#FFC533]">
                    ₦
                  </span>
                  <input
                    type="number"
                    min={MIN_PAID_PRICE}
                    step={500}
                    value={priceInputRaw}
                    onChange={(e) => handleCustomPriceChange(e.target.value)}
                    onBlur={() => {
                      if (!pricePerMonth || pricePerMonth < MIN_PAID_PRICE) {
                        setPricePerMonth(MIN_PAID_PRICE);
                        setPriceInputRaw(String(MIN_PAID_PRICE));
                        setCostBracket('base_2k');
                      }
                    }}
                    className={`w-full pl-8 pr-4 py-2.5 bg-[#181818] border rounded-xl text-sm font-bold text-white focus:outline-none ${
                      isBelowMinPrice
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-white/10 focus:border-[#FFC533]'
                    }`}
                  />
                </div>
                <select
                  value={billingSchedule}
                  onChange={(e) =>
                    setBillingSchedule(
                      e.target.value as 'monthly' | 'quarterly' | 'yearly'
                    )
                  }
                  className="px-3 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#FFC533]"
                >
                  <option value="monthly">Per Month</option>
                  <option value="quarterly">Per Quarter</option>
                  <option value="yearly">Per Year</option>
                </select>
              </div>

              {isBelowMinPrice ? (
                <p className="text-[11px] text-red-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Plans below ₦2,000 do not exist. The minimum Base Plan is ₦2,000/month.
                  </span>
                </p>
              ) : (
                /* PRD 92% / 8% Revenue Split Preview Box */
                <div className="rounded-xl bg-[#181818] border border-white/8 p-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="block text-[10px] text-gray-400">
                      Member Pays
                    </span>
                    <span className="text-xs font-bold text-white">
                      ₦{(pricePerMonth || 0).toLocaleString('en-NG')}
                    </span>
                  </div>
                  <div className="border-x border-white/8">
                    <span className="block text-[10px] text-[#4ade80]">
                      Your Earnings (92%)
                    </span>
                    <span className="text-xs font-bold text-[#4ade80]">
                      ₦{creatorShare.toLocaleString('en-NG')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400">
                      LocalBuka Fee (8%)
                    </span>
                    <span className="text-xs font-semibold text-gray-300">
                      ₦{platformFee.toLocaleString('en-NG')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section B: Payment Method & Payout Bank Account Setup */}
          <div className="space-y-4 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#FFC533]" />
                <h3 className="text-sm font-bold text-white">
                  2. Payment Method &amp; Payout Bank Account
                </h3>
              </div>
              <span className="text-[10px] text-[#4ade80] font-semibold bg-[#4ade80]/10 px-2 py-0.5 rounded-full">
                7-Day Holding SLA
              </span>
            </div>

            {/* Select Primary Payment Method / Gateway */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Select Member Payment Method &amp; Gateway
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PAYMENT_PLATFORMS.map((platform) => {
                  const active =
                    paymentPlatforms.includes(platform.id) ||
                    primaryPaymentMethod === platform.id;
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => {
                        setPrimaryPaymentMethod(platform.id);
                        togglePlatform(platform.id);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-[#FFC533]/15 border-[#FFC533] text-white'
                          : 'bg-[#181818] border-white/8 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <span className="block text-xs font-bold">
                          {platform.label}
                        </span>
                        <span className="block text-[10px] text-gray-400">
                          {platform.badge}
                        </span>
                      </div>
                      {active && (
                        <Check className="w-4 h-4 text-[#FFC533] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enter Creator Payout Bank Account */}
            <div className="rounded-xl bg-[#181818] border border-white/10 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Creator Settlement Bank Account (Where you get paid)
                </span>
                <span className="text-[10px] text-gray-400">92% Payout</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">
                    Select Bank
                  </label>
                  <select
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#FFC533]"
                  >
                    {NIGERIAN_BANKS.map((bank) => (
                      <option key={bank.code} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">
                    10-Digit Account Number
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={accountNumber}
                    onChange={(e) =>
                      setAccountNumber(e.target.value.replace(/\D/g, ''))
                    }
                    placeholder="0123456789"
                    className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-xs font-semibold tracking-wider text-white focus:outline-none focus:border-[#FFC533]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">
                  Account Holder Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Enter verified account holder name"
                    className="w-full px-3 py-2.5 bg-[#222222] border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#FFC533]"
                  />
                  {accountNumber.length === 10 && accountName.trim() && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#4ade80]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Schedule & Payment Links */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#FFC533]" />
                  <span>Payout Schedule</span>
                </label>
                <select
                  value={payoutSchedule}
                  onChange={(e) =>
                    setPayoutSchedule(
                      e.target.value as
                        | '7_day_hold'
                        | 'weekly'
                        | 'biweekly'
                        | 'monthly'
                    )
                  }
                  className="w-full px-3 py-2 bg-[#181818] border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#FFC533]"
                >
                  <option value="7_day_hold">
                    Standard (Available after 7-day hold)
                  </option>
                  <option value="weekly">Weekly Auto-Payout (Fridays)</option>
                  <option value="biweekly">Bi-Weekly (1st &amp; 15th)</option>
                  <option value="monthly">Monthly (15th of Month)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#FFC533]" />
                  <span>Scheduled Launch Date</span>
                </label>
                <input
                  type="date"
                  value={scheduledLaunchDate}
                  onChange={(e) => setScheduledLaunchDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#181818] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFC533]"
                />
              </div>
            </div>

            {/* Auto-generated LocalBuka Paystack Checkout Link + Optional External Link */}
            <div className="rounded-xl bg-[#181818] border border-white/10 p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-[#FFC533]" />
                  <span>Live Member Paystack Checkout Link</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyGeneratedLink}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FFC533] hover:underline cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/10 border border-white/15 px-2 py-0.5 text-[10.5px] font-semibold text-gray-300">
                    <span>Closed until deploy</span>
                  </span>
                </div>
              </div>
              <p className="text-xs font-mono text-white/60 truncate">
                https://paystack.com/pay/localbuka-creator (Activates on live deploy)
              </p>

              <div className="pt-1">
                <label className="block text-[10.5px] text-gray-400 mb-1">
                  Paystack Payment Link (Closed for now until ready to deploy)
                </label>
                <input
                  type="url"
                  disabled
                  value="https://paystack.com/pay/localbuka-creator"
                  placeholder="Closed until production deployment"
                  className="w-full px-3 py-2 bg-[#161616] border border-white/10 rounded-xl text-xs text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section D: Subscriber Benefits */}
          <div className="space-y-2 pt-3 border-t border-white/10">
            <label className="block text-xs font-semibold text-gray-300">
              3. Member Value &amp; Benefits
            </label>
            <div className="space-y-1.5">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 bg-[#181818] px-3 py-1.5 rounded-lg text-xs text-gray-200"
                >
                  <span className="truncate">• {b}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setBenefits(benefits.filter((_, idx) => idx !== i))
                    }
                    className="text-gray-500 hover:text-red-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBenefit();
                  }
                }}
                placeholder="Add another subscriber perk..."
                className="flex-1 px-3 py-2 bg-[#181818] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFC533]"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: Choose Cover / Avatar ───────────────────────── */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-white mb-3">
          Choose Community Cover / Avatar
        </p>

        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {PRESET_AVATARS.map((avatar, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedAvatar(avatar);
                setCustomAvatar(null);
              }}
              className={`relative w-12 h-12 rounded-full overflow-hidden transition-all duration-200 cursor-pointer ${
                selectedAvatar === avatar && !customAvatar
                  ? 'ring-2 ring-[#FFC533] ring-offset-2 ring-offset-[#1a1a1a] scale-105'
                  : 'opacity-70 hover:opacity-100 ring-1 ring-white/10 hover:scale-105'
              }`}
            >
              <Image
                src={avatar}
                alt={`Cover ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}

          {customAvatar && (
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#FFC533] ring-offset-2 ring-offset-[#1a1a1a] scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={customAvatar}
                alt="Custom avatar"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCustomImageUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 px-4 bg-[#222222] hover:bg-[#2a2a2a] border border-white/10 rounded-xl text-sm text-gray-300 flex items-center justify-between transition-colors group cursor-pointer"
        >
          <span>Choose your photo from gallery</span>
          <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* ── Primary Submit CTA ───────────────────────── */}
      <button
        type="button"
        onClick={() =>
          category === 'free' ? handleFreeSubmit() : handlePaidSubmit()
        }
        className="w-full py-3.5 px-6 rounded-xl bg-[#FFC533] hover:bg-[#e6b12d] text-black font-bold text-sm transition-all shadow-lg active:scale-[0.99] cursor-pointer"
      >
        {category === 'free'
          ? 'Create Free Community →'
          : `Save Payout Account & Continue to Payment (₦${Math.max(MIN_PAID_PRICE, pricePerMonth || MIN_PAID_PRICE).toLocaleString('en-NG')}${cycleSuffix}) →`}
      </button>
    </div>
  );
}
