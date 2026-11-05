"use client";

import Image from "next/image";
import { ArrowLeft, Lock, Check } from "lucide-react";
import { MobileCommunityItem } from "./types";

interface MobilePaidCommunityDetailsProps {
  community: MobileCommunityItem;
  onBack: () => void;
  onSubscribe: () => void;
}

export function MobilePaidCommunityDetails({
  community,
  onBack,
  onSubscribe,
}: MobilePaidCommunityDetailsProps) {
  const benefits = community.benefits || [
    "Exclusive weekly recipes",
    "Monthly live cook-alongs",
    "Direct Q&A with Chef Amaka",
  ];

  return (
    <div className="flex flex-col w-full min-h-full bg-[#141414] text-white">
      {/* Hero Banner with Food Collage */}
      <div className="relative w-full h-44 bg-zinc-900 shrink-0">
        <Image
          src={community.coverImage || community.image || "/images/community/chef-amaka-hero.jpg"}
          alt={community.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />

        {/* Back button overlay */}
        <button
          type="button"
          onClick={onBack}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer border border-white/10 active:scale-95 z-20"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto px-5 pt-0 pb-8 space-y-6">
        {/* Creator Avatar overlapping hero */}
        <div className="-mt-9 mb-2 relative z-10">
          <div className="relative w-18 h-18 rounded-full border-[3px] border-[#141414] overflow-hidden shadow-xl bg-zinc-800">
            <Image
              src={community.avatar || "/images/community/chef-amaka-avatar.jpg"}
              alt={community.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
            {community.name}
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {community.description}
          </p>

          {/* Paid community lock badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fbbe15]/15 border border-[#fbbe15]/30 px-3 py-1 text-xs font-semibold text-[#fbbe15]">
            <Lock size={12} className="stroke-[2.5]" />
            <span>Paid community</span>
          </div>

          <p className="text-xs text-zinc-400">
            {community.ownerLine}
          </p>
        </div>

        {/* What you get Card */}
        <div className="rounded-2xl bg-[#1e1e1e] border border-white/8 p-5 space-y-4">
          <h2 className="text-base font-bold text-white tracking-tight">
            What you get
          </h2>

          <div className="space-y-3">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-zinc-200">
                <div className="mt-0.5 w-4 h-4 rounded-full bg-transparent flex items-center justify-center shrink-0 text-[#22c55e]">
                  <Check size={16} strokeWidth={3} />
                </div>
                <span className="leading-snug">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Info Box */}
        <div className="space-y-1">
          <div className="text-xl font-extrabold text-white">
            ₦{community.priceAmount.toLocaleString("en-NG")}/month
          </div>
          <p className="text-xs text-zinc-400">
            or ₦{community.yearlyPriceAmount.toLocaleString("en-NG")} billed yearly
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onSubscribe}
            className="w-full py-3.5 px-6 rounded-xl bg-[#fbbe15] hover:bg-[#eab308] active:scale-[0.98] transition-all font-bold text-[#141414] text-[15px] shadow-lg shadow-[#fbbe15]/20 cursor-pointer text-center"
          >
            Subscribe to unlock
          </button>
        </div>
      </div>
    </div>
  );
}
