"use client";

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
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center px-4 h-13 bg-[#141414]/95 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft size={21} />
        </button>
      </header>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-8 space-y-6">
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
