"use client";

import { X } from "lucide-react";

interface MobilePaymentFailedProps {
  onTryAgain: () => void;
}

export function MobilePaymentFailed({ onTryAgain }: MobilePaymentFailedProps) {
  return (
    <div className="flex flex-col w-full min-h-full bg-[#141414] text-white">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-6">
        {/* Large Red X Circle */}
        <div className="w-16 h-16 rounded-full border-2 border-[#ef4444] flex items-center justify-center text-[#ef4444] shadow-lg shadow-[#ef4444]/10 animate-in zoom-in-75 duration-300">
          <X size={34} strokeWidth={3} />
        </div>

        {/* Text */}
        <div className="space-y-2 max-w-xs mx-auto">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Payment failed
          </h1>
          <p className="text-xs text-zinc-300 leading-relaxed">
            We couldn&apos;t charge your Visa ending in 4417. Check your card details
            or try a different method.
          </p>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-5 pb-8">
        <button
          type="button"
          onClick={onTryAgain}
          className="w-full py-3.5 px-6 rounded-xl bg-[#fbbe15] hover:bg-[#eab308] active:scale-[0.98] transition-all font-bold text-[#141414] text-[15px] shadow-lg shadow-[#fbbe15]/20 cursor-pointer text-center"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
