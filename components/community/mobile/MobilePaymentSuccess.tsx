"use client";

import { Check } from "lucide-react";
import { MobileCommunityItem } from "./types";

interface MobilePaymentSuccessProps {
  community: MobileCommunityItem;
  onGoToCommunity: () => void;
}

export function MobilePaymentSuccess({
  community,
  onGoToCommunity,
}: MobilePaymentSuccessProps) {
  return (
    <div className="flex flex-col w-full min-h-full bg-[#141414] text-white">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-6">
        {/* Large Green Check Circle */}
        <div className="w-16 h-16 rounded-full border-2 border-[#22c55e] flex items-center justify-center text-[#22c55e] shadow-lg shadow-[#22c55e]/10 animate-in zoom-in-75 duration-300">
          <Check size={32} strokeWidth={3} />
        </div>

        {/* Text */}
        <div className="space-y-2 max-w-xs mx-auto">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            You&apos;re in!
          </h1>
          <p className="text-xs text-zinc-300 leading-relaxed">
            You&apos;ve subscribed to {community.name}. Your first charge of ₦
            {community.priceAmount.toLocaleString("en-NG")} was successful,
            renews monthly.
          </p>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-5 pb-8">
        <button
          type="button"
          onClick={onGoToCommunity}
          className="w-full py-3.5 px-6 rounded-xl bg-[#fbbe15] hover:bg-[#eab308] active:scale-[0.98] transition-all font-bold text-[#141414] text-[15px] shadow-lg shadow-[#fbbe15]/20 cursor-pointer text-center"
        >
          Go to community
        </button>
      </div>
    </div>
  );
}
