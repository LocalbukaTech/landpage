"use client";

import { useState } from "react";
import { CreditCard, Check, ShieldCheck, CheckCircle2 } from "lucide-react";
import { WithdrawModal } from "./modals/WithdrawModal";

export function MonetizationTab() {
  const [balance, setBalance] = useState(3500000.0);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleWithdrawSuccess = (amount: number) => {
    setBalance((prev) => Math.max(0, prev - amount));
    setToastMessage(`Successfully initiated withdrawal of ₦${amount.toLocaleString("en-NG")}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="w-full max-w-[700px] text-white space-y-9 pt-2">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#f5c94d] px-5 py-3 text-sm font-semibold text-black shadow-xl animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Earnings View (Exact Match to Image 1 / Screenshot 1) */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
          Earnings
        </h2>

        <div className="text-3xl sm:text-4xl md:text-[2.6rem] font-bold text-[#f5c94d] tracking-tight">
          ₦ {balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsWithdrawOpen(true)}
            className="rounded-full bg-[#f5c94d] px-8 py-3 text-sm font-semibold text-black hover:bg-[#eab308] active:scale-95 transition-all shadow-md inline-block text-center cursor-pointer"
          >
            Withdraw to bank
          </button>
        </div>
      </div>

      {/* Secondary Account & Plan Details */}
      <div className="pt-4 space-y-6">
        {/* Linked Bank Card */}
        <div className="rounded-[24px] bg-[#1a1a1a] border border-white/5 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-white/70">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#f5c94d]" />
              <span className="font-medium text-white/90">
                Linked Account: Zenith Bank · ****4921 (Tolu Olawale)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#4ade80]">
              <ShieldCheck className="h-4 w-4" />
              <span>Auto-payout: 15 Oct, 2026</span>
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
            <span className="rounded-full bg-[#f5c94d]/15 px-3.5 py-1 text-xs font-bold text-[#f5c94d]">
              ₦2,500 / month
            </span>
          </div>

          <div className="space-y-2.5 text-xs md:text-sm text-white/80">
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

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={balance}
        onSuccess={handleWithdrawSuccess}
      />
    </div>
  );
}
