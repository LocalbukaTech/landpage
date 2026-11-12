"use client";

import { useState } from "react";
import {
  CreditCard,
  Check,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Link2,
  Building2,
} from "lucide-react";
import { WithdrawModal } from "./modals/WithdrawModal";
import type { CreatorCommunityFormData } from "./CreatorCommunityForm";

interface MonetizationTabProps {
  community?: CreatorCommunityFormData;
}

export function MonetizationTab({ community }: MonetizationTabProps) {
  const [balance, setBalance] = useState(3500000.0);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const communityName = community?.name || "Chef Tolu VIP Food Club";
  const isFree = community?.category === "free";
  const pricePerMonth = isFree
    ? 0
    : Math.max(2000, community?.pricePerMonth ?? 2000);
  const creatorShare = Math.round(pricePerMonth * 0.92);
  const localBukaFee = Math.round(pricePerMonth * 0.08);
  const billingLabel =
    community?.billingSchedule === "quarterly"
      ? "quarter"
      : community?.billingSchedule === "yearly"
      ? "year"
      : "month";

  const bankName = community?.payoutAccount?.bankName || "Zenith Bank PLC";
  const accountNumber = community?.payoutAccount?.accountNumber || "2083948192";
  const accountName = community?.payoutAccount?.accountName || "Tolu Olawale";

  const slug =
    communityName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "chef-tolu-s-vip-kitchen";

  const originUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  const defaultInAppCheckoutUrl = `${originUrl}/community/${slug}/subscribe`;

  const activePaymentLink =
    community?.paymentLinks?.paystack &&
    community.paymentLinks.paystack !== "https://paystack.com/pay/localbuka-creator"
      ? community.paymentLinks.paystack
      : defaultInAppCheckoutUrl;

  const benefits = community?.benefits?.length
    ? community.benefits
    : [
        "Unlocks all secret recipes and video tutorials",
        "Direct access to monthly Zoom cook-along sessions",
        "Exclusive discounts at partner Lagos restaurants",
        "Supporters badge next to comments in feed",
      ];

  const handleWithdrawSuccess = (amount: number) => {
    setBalance((prev) => Math.max(0, prev - amount));
    setToastMessage(
      `Successfully initiated withdrawal of ₦${amount.toLocaleString("en-NG")}`
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(activePaymentLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-[740px] text-white space-y-8 pt-2">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#f5c94d] px-5 py-3 text-sm font-semibold text-black shadow-xl animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Earnings View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
            Earnings (92% Creator Share)
          </h2>
          <span className="rounded-full bg-[#4ade80]/15 px-3 py-1 text-xs font-semibold text-[#4ade80]">
            7-Day Holding Period Active
          </span>
        </div>

        <div className="text-3xl sm:text-4xl md:text-[2.6rem] font-bold text-[#f5c94d] tracking-tight">
          ₦{" "}
          {balance.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
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

      {/* Secondary Account, Payment Link & Plan Details */}
      <div className="pt-2 space-y-5">
        {/* Linked Settlement Bank Account Card */}
        <div className="rounded-[24px] bg-[#1a1a1a] border border-white/5 p-5 sm:p-6 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#f5c94d]" />
              <span className="font-medium text-white/95">
                Payout Account: {bankName} · {accountNumber} ({accountName})
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#4ade80]">
              <ShieldCheck className="h-4 w-4" />
              <span>Verified Settlement Account</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs text-white/60">
            <CreditCard className="h-3.5 w-3.5 text-[#f5c94d]" />
            <span>Active Gateways:</span>
            {(community?.paymentPlatforms || ["paystack", "card", "bank_transfer"]).map(
              (plat) => (
                <span
                  key={plat}
                  className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white capitalize"
                >
                  {plat.replace("_", " ")}
                </span>
              )
            )}
          </div>
        </div>

        {/* Shareable Payment Link Card */}
        <div className="rounded-[24px] bg-[#1a1a1a] border border-white/5 p-5 sm:p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-[#f5c94d]" />
              <h3 className="text-sm font-semibold text-white">
                Active Payment &amp; Checkout Link
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#f5c94d]/15 px-3 py-1 text-xs font-bold text-[#f5c94d] hover:bg-[#f5c94d]/25 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold text-white/50 cursor-not-allowed">
                <span>Closed until deploy</span>
              </span>
            </div>
          </div>
          <p className="text-xs font-mono text-white/80 truncate bg-[#121212] px-3.5 py-2.5 rounded-xl border border-white/5">
            {activePaymentLink}
          </p>
        </div>

        {/* Subscription Cost Bracket & Commission Breakdown */}
        <div className="rounded-[24px] bg-[#1a1a1a] border border-white/5 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                {communityName}
              </h3>
              <p className="text-xs text-white/50">
                Active community cost bracket &amp; revenue split
              </p>
            </div>
            <span className="rounded-full bg-[#f5c94d]/15 px-3.5 py-1 text-xs font-bold text-[#f5c94d]">
              {isFree
                ? "Free Community"
                : `₦${pricePerMonth.toLocaleString("en-NG")} / ${billingLabel}`}
            </span>
          </div>

          {!isFree && (
            <div className="grid grid-cols-3 gap-3 rounded-2xl bg-[#141414] border border-white/5 p-3.5 text-center">
              <div>
                <span className="block text-[11px] text-white/50">
                  Member Subscription
                </span>
                <span className="text-sm font-bold text-white">
                  ₦{pricePerMonth.toLocaleString("en-NG")}
                </span>
              </div>
              <div className="border-x border-white/5">
                <span className="block text-[11px] text-[#4ade80]">
                  Creator Share (92%)
                </span>
                <span className="text-sm font-bold text-[#4ade80]">
                  ₦{creatorShare.toLocaleString("en-NG")}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-white/50">
                  LocalBuka (8%)
                </span>
                <span className="text-sm font-semibold text-white/80">
                  ₦{localBukaFee.toLocaleString("en-NG")}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2.5 text-xs md:text-sm text-white/80">
            {benefits.map((perk, i) => (
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
