"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { MobileCommunityItem, BillingPeriod } from "./types";
import { cn } from "@/lib/utils";
import {
  useSubscribeCommunity,
  useInitializeCommunityPayment,
} from "@/lib/api/services/community.hooks";

interface MobileSubscribeCheckoutProps {
  community: MobileCommunityItem;
  onBack: () => void;
  onPaymentSuccess: () => void;
  onPaymentFailed: () => void;
}

export function MobileSubscribeCheckout({
  community,
  onBack,
  onPaymentSuccess,
  onPaymentFailed,
}: MobileSubscribeCheckoutProps) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [gateway, setGateway] = useState<"paystack" | "korapay">("paystack");
  const [selectedCard, setSelectedCard] = useState<"valid" | "failed">("valid");
  const [isProcessing, setIsProcessing] = useState(false);

  const subscribeMutation = useSubscribeCommunity();
  const initPaymentMutation = useInitializeCommunityPayment();

  const monthlyPrice = community.priceAmount || 2500;
  const yearlyPrice = community.yearlyPriceAmount || 25000;

  const currentPriceText =
    billingPeriod === "monthly"
      ? `₦${monthlyPrice.toLocaleString("en-NG")}/mo`
      : `₦${yearlyPrice.toLocaleString("en-NG")}/yr`;

  const handleSubscribe = async () => {
    setIsProcessing(true);
    if (selectedCard === "failed") {
      setTimeout(() => {
        setIsProcessing(false);
        onPaymentFailed();
      }, 800);
      return;
    }

    const prefix = gateway === "korapay" ? "KPY" : "PSK";
    let paymentReference = `${prefix}-${Date.now()}`;

    try {
      const initRes = await initPaymentMutation.mutateAsync({
        idOrSlug: community.id,
        data: {
          billingPeriod,
          provider: gateway,
          paymentReference,
        },
      });
      if (initRes?.data?.reference) {
        paymentReference = initRes.data.reference;
      }
      if (initRes?.data?.authorizationUrl && typeof window !== "undefined") {
        window.location.href = initRes.data.authorizationUrl;
        return;
      }
    } catch {
      // fallback to subscription completion
    }

    subscribeMutation.mutate(
      {
        idOrSlug: community.id,
        data: {
          billingPeriod,
          provider: gateway,
          paymentReference,
        },
      },
      {
        onSettled: () => {
          setIsProcessing(false);
          onPaymentSuccess();
        },
      },
    );
  };

  return (
    <div className="flex flex-col w-full min-h-full bg-[#141414] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center px-4 h-13 bg-[#141414]/95 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          aria-label="Go back"
        >
          <ArrowLeft size={21} />
        </button>
      </header>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-8 space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Subscribe
          </h1>
          <div className="pt-2">
            <h2 className="text-lg font-bold text-white">
              {community.name}
            </h2>
            <p className="text-xs text-zinc-400 font-medium">
              Paid community
            </p>
          </div>
        </div>

        {/* Billing Period Section */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-zinc-400">
            Billing period
          </label>

          <div className="grid grid-cols-2 gap-3">
            {/* Monthly Option */}
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={cn(
                "relative rounded-xl p-3.5 text-left transition-all cursor-pointer border flex flex-col justify-between h-20",
                billingPeriod === "monthly"
                  ? "bg-[#1c1c1c] border-[#fbbe15] shadow-sm shadow-[#fbbe15]/10"
                  : "bg-[#1c1c1c] border-white/10 hover:border-white/20"
              )}
            >
              <span className="text-xs font-medium text-zinc-300">
                Monthly
              </span>
              <span
                className={cn(
                  "text-sm font-bold",
                  billingPeriod === "monthly" ? "text-[#fbbe15]" : "text-white"
                )}
              >
                ₦{monthlyPrice.toLocaleString("en-NG")}
                <span className="text-[11px] font-normal text-zinc-400">
                  /month
                </span>
              </span>
            </button>

            {/* Yearly Option with Save 17% */}
            <button
              type="button"
              onClick={() => setBillingPeriod("yearly")}
              className={cn(
                "relative rounded-xl p-3.5 text-left transition-all cursor-pointer border flex flex-col justify-between h-20",
                billingPeriod === "yearly"
                  ? "bg-[#1c1c1c] border-[#fbbe15] shadow-sm shadow-[#fbbe15]/10"
                  : "bg-[#1c1c1c] border-white/10 hover:border-white/20"
              )}
            >
              {/* Green Save 17% pill badge on top right */}
              <span className="absolute -top-2 right-2 rounded-full bg-[#22c55e] px-2 py-0.5 text-[9px] font-bold text-black tracking-tight shadow-sm">
                Save 17%
              </span>

              <span className="text-xs font-medium text-zinc-300">
                Yearly
              </span>
              <span
                className={cn(
                  "text-sm font-bold",
                  billingPeriod === "yearly" ? "text-[#fbbe15]" : "text-white"
                )}
              >
                ₦{yearlyPrice.toLocaleString("en-NG")}
                <span className="text-[11px] font-normal text-zinc-400">
                  /year
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Payment Gateway Selector (Paystack / Korapay) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-400">
              Payment gateway
            </label>
            <span className="inline-flex items-center gap-1 text-[10.5px] text-[#22c55e] font-semibold">
              <ShieldCheck size={12} />
              Secured
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {(
              [
                { id: "paystack", label: "Paystack", desc: "Card · Transfer · USSD" },
                { id: "korapay", label: "Korapay", desc: "Instant Bank · Card" },
              ] as const
            ).map((gw) => (
              <button
                key={gw.id}
                type="button"
                onClick={() => setGateway(gw.id)}
                className={cn(
                  "rounded-xl p-3 text-left border transition-all cursor-pointer",
                  gateway === gw.id
                    ? "bg-[#1c1c1c] border-[#fbbe15] text-white"
                    : "bg-[#1c1c1c] border-white/10 text-zinc-400 hover:border-white/20",
                )}
              >
                <div className="text-xs font-bold text-white">{gw.label}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">{gw.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-400">
              Payment method
            </label>
            <button
              type="button"
              onClick={() =>
                setSelectedCard(selectedCard === "valid" ? "failed" : "valid")
              }
              className="text-[10.5px] text-[#fbbe15] hover:underline cursor-pointer"
            >
              {selectedCard === "valid" ? "Simulate Decline" : "Simulate Valid"}
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#1c1c1c] p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CreditCard size={18} className="text-zinc-400" />
              <span className="text-xs font-medium text-zinc-200">
                {selectedCard === "valid"
                  ? "Visa ending in 4417"
                  : "Visa ending in 0000 (failing)"}
              </span>
            </div>
            {selectedCard === "failed" && (
              <span className="text-[10px] text-red-400 font-semibold">
                Will fail
              </span>
            )}
          </div>
        </div>

        {/* Terms Disclaimer */}
        <p className="text-[11.5px] text-zinc-400 leading-relaxed">
          By subscribing you agree to LocalBuka&apos;s Terms of Service and
          authorize recurring {billingPeriod} charges until cancelled.
        </p>

        {/* CTA Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full py-3.5 px-6 rounded-xl bg-[#fbbe15] hover:bg-[#eab308] active:scale-[0.98] transition-all font-bold text-[#141414] text-[15px] shadow-lg shadow-[#fbbe15]/20 cursor-pointer flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin text-black" />
                <span>Processing payment...</span>
              </>
            ) : (
              <span>Subscribe to unlock · {currentPriceText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
