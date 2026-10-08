"use client";

import { CreditCard, Check, ArrowRight, ShieldCheck } from "lucide-react";

export function MonetizationTab() {
  return (
    <div className="w-full max-w-[700px] text-white space-y-7 pt-2">
      {/* Payout Balance Card */}
      <div className="rounded-[24px] bg-[#1a1a1a] border border-white/5 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/50">Available Balance</p>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
              ₦1,890,000
            </h2>
          </div>
          <button
            type="button"
            className="rounded-full bg-[#f5c94d] px-6 py-2.5 text-xs md:text-sm font-semibold text-black hover:bg-[#eab308] active:scale-95 transition-all shadow-md"
          >
            Withdraw Funds
          </button>
        </div>

        <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#f5c94d]" />
            <span>Bank: Zenith Bank · ****4921 (Tolu Olawale)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#4ade80]">
            <ShieldCheck className="h-4 w-4" />
            <span>Next automatic payout: 15 Oct, 2026</span>
          </div>
        </div>
      </div>

      {/* Subscription Tier Details */}
      <div className="rounded-[24px] bg-[#1a1a1a] border border-white/5 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">
              Chef Tolu VIP Food Club
            </h3>
            <p className="text-xs text-white/50">Your active community plan</p>
          </div>
          <span className="rounded-full bg-[#f5c94d]/15 px-3 py-1 text-xs font-bold text-[#f5c94d]">
            ₦2,500 / month
          </span>
        </div>

        <div className="space-y-2 text-xs md:text-sm text-white/80">
          {[
            "Unlocks all secret recipes and video tutorials",
            "Direct access to monthly Zoom cook-along sessions",
            "Exclusive discounts at partner Lagos restaurants",
            "Supporters badge next to comments in feed",
          ].map((perk, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f5c94d] text-black">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              <span>{perk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
