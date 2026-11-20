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
  Edit3,
  Clock,
} from "lucide-react";
import { WithdrawModal } from "./modals/WithdrawModal";
import {
  NIGERIAN_BANKS,
  PAID_COMMUNITIES_ENABLED,
  type CreatorCommunityFormData,
} from "./CreatorCommunityForm";
import { useCreatorEarnings } from "@/lib/api/services/community.hooks";
import { useAuth } from "@/context/AuthContext";

interface MonetizationTabProps {
  community?: CreatorCommunityFormData;
  onUpdateCommunity?: (updates: Partial<CreatorCommunityFormData>) => void;
}

export function MonetizationTab({
  community,
  onUpdateCommunity,
}: MonetizationTabProps) {
  const { user: authUser } = useAuth();
  const { data: liveEarnings } = useCreatorEarnings();
  const [withdrawnTotal, setWithdrawnTotal] = useState(0);

  // Real balance directly from backend earnings (0.00 when no paid subscriptions yet)
  const baseBalance =
    typeof liveEarnings?.availableBalance === "number"
      ? liveEarnings.availableBalance
      : 0;
  const balance = Math.max(0, baseBalance - withdrawnTotal);

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const communityName = community?.name || "My Community";
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

  // Remove stale "Tolu Olawale / 2083948192" defaults
  const hasRealPayoutAccount =
    Boolean(community?.payoutAccount?.accountNumber) &&
    community?.payoutAccount?.accountNumber !== "2083948192" &&
    community?.payoutAccount?.accountName !== "Tolu Olawale";

  const [bankCode, setBankCode] = useState(
    community?.payoutAccount?.bankCode || "zenith"
  );
  const [accountNumber, setAccountNumber] = useState(
    hasRealPayoutAccount ? community?.payoutAccount?.accountNumber || "" : ""
  );
  const [accountName, setAccountName] = useState(
    hasRealPayoutAccount
      ? community?.payoutAccount?.accountName || ""
      : authUser?.fullName || ""
  );

  const displayBankName = hasRealPayoutAccount
    ? community?.payoutAccount?.bankName
    : null;
  const displayAccountNumber = hasRealPayoutAccount
    ? community?.payoutAccount?.accountNumber
    : null;
  const displayAccountName = hasRealPayoutAccount
    ? community?.payoutAccount?.accountName
    : null;

  const slug =
    communityName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "community";

  const originUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  // Always point to this actual community's live link (never stale chef-tolu-s-vip-kitchen)
  const activeCommunityLink = isFree
    ? `${originUrl}/community/${slug}`
    : `${originUrl}/community/${slug}/subscribe`;

  const benefits = community?.benefits?.length
    ? community.benefits
    : [
        "Access to community posts and discussions",
        "Direct updates and recipes from the creator",
      ];

  const handleSaveBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedNum = accountNumber.replace(/\D/g, "");
    if (cleanedNum.length !== 10) {
      setToastMessage("Please enter a valid 10-digit Nigerian account number.");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    if (!accountName.trim()) {
      setToastMessage("Please enter the account holder name.");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    const selectedBank =
      NIGERIAN_BANKS.find((b) => b.code === bankCode)?.name || "Zenith Bank PLC";

    onUpdateCommunity?.({
      payoutAccount: {
        bankCode,
        bankName: selectedBank,
        accountNumber: cleanedNum,
        accountName: accountName.trim(),
      },
    });
    setIsEditingBank(false);
    setToastMessage("Settlement bank account saved!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleWithdrawSuccess = (amount: number) => {
    setWithdrawnTotal((prev) => prev + amount);
    setToastMessage(
      `Successfully initiated withdrawal of ₦${amount.toLocaleString("en-NG")}`
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(activeCommunityLink);
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
            Earnings (92% Creator Share)
          </h2>
          {!PAID_COMMUNITIES_ENABLED ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5c94d]/15 border border-[#f5c94d]/30 px-3 py-1 text-xs font-semibold text-[#f5c94d]">
              <Clock className="h-3.5 w-3.5" />
              Paid Monetization · Coming Soon
            </span>
          ) : (
            <span className="rounded-full bg-[#4ade80]/15 px-3 py-1 text-xs font-semibold text-[#4ade80]">
              7-Day Holding Period Active
            </span>
          )}
        </div>

        <div className="text-3xl sm:text-4xl md:text-[2.6rem] font-bold text-[#f5c94d] tracking-tight">
          ₦{" "}
          {balance.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

        <p className="text-xs text-white/50">
          {liveEarnings?.paidSubscribersCount
            ? `From ${liveEarnings.paidSubscribersCount} active paid subscriber(s) · 8% LocalBuka platform fee`
            : isFree
            ? `${communityName} is currently a Free Community (₦0.00 balance). Paid subscriptions will be available once Paystack goes live.`
            : "No paid subscriber payouts available yet."}
        </p>

        <div className="pt-1">
          <button
            type="button"
            disabled={balance <= 0}
            onClick={() => setIsWithdrawOpen(true)}
            className="rounded-full bg-[#f5c94d] px-8 py-3 text-sm font-semibold text-black hover:bg-[#eab308] active:scale-95 transition-all shadow-md inline-block text-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {balance > 0 ? "Withdraw to bank" : "No funds available to withdraw"}
          </button>
        </div>

        {/* Verified Payout Bank Account Card */}
        <div className="rounded-[24px] bg-[#1a1a1a] border border-white/5 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 text-sm">
              <Building2 className="h-4 w-4 text-[#f5c94d]" />
              {displayBankName && displayAccountNumber ? (
                <span className="text-white/90 font-medium">
                  Payout Account:{" "}
                  <strong className="text-white">{displayBankName}</strong> ·{" "}
                  <span className="font-mono text-white/80">
                    {displayAccountNumber}
                  </span>{" "}
                  ({displayAccountName})
                </span>
              ) : (
                <span className="text-white/70">
                  No settlement bank account linked yet
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {displayBankName && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4ade80]">
                  <ShieldCheck className="h-4 w-4" />
                  Saved
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsEditingBank((v) => !v)}
                className="inline-flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/15 px-3 py-1 text-xs font-semibold text-white cursor-pointer"
              >
                <Edit3 className="h-3 w-3" />
                <span>{displayBankName ? "Edit Bank" : "Add Bank Account"}</span>
              </button>
            </div>
          </div>

          {isEditingBank && (
            <form
              onSubmit={handleSaveBankAccount}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10"
            >
              <select
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className="rounded-xl bg-[#242428] border border-white/10 px-3 py-2 text-xs text-white focus:border-[#f5c94d] focus:outline-none"
              >
                {NIGERIAN_BANKS.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                maxLength={10}
                placeholder="10-digit Account Number"
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(e.target.value.replace(/\D/g, ""))
                }
                className="rounded-xl bg-[#242428] border border-white/10 px-3 py-2 text-xs text-white placeholder-white/40 focus:border-[#f5c94d] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Account Holder Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="rounded-xl bg-[#242428] border border-white/10 px-3 py-2 text-xs text-white placeholder-white/40 focus:border-[#f5c94d] focus:outline-none"
              />
              <div className="sm:col-span-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingBank(false)}
                  className="rounded-xl px-4 py-1.5 text-xs text-white/60 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#f5c94d] px-4 py-1.5 text-xs font-bold text-black hover:bg-[#eab308] cursor-pointer"
                >
                  Save Settlement Account
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs text-white/60 pt-1">
            <CreditCard className="h-4 w-4 text-[#f5c94d]" />
            <span>Payment Gateways:</span>
            {["Paystack (Coming Soon)", "Korapay (Coming Soon)"].map((plat) => (
              <span
                key={plat}
                className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/80"
              >
                {plat}
              </span>
            ))}
          </div>
        </div>

        {/* Shareable Community Link Card */}
        <div className="rounded-[24px] bg-[#1a1a1a] border border-white/5 p-5 sm:p-6 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-[#f5c94d]" />
              <h3 className="text-sm font-semibold text-white">
                {isFree
                  ? "Active Community Invite Link"
                  : "Active Payment & Checkout Link"}
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
                <span>Paystack · Coming Soon</span>
              </span>
            </div>
          </div>
          <p className="text-xs font-mono text-white/80 truncate bg-[#121212] px-3.5 py-2.5 rounded-xl border border-white/5">
            {activeCommunityLink}
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
                Active community plan &amp; member benefits
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
