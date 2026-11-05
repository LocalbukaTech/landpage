"use client";

import { useState } from "react";
import { CreditCard, Check, Loader2 } from "lucide-react";

interface PaymentCheckoutCardProps {
  communityName?: string;
  amount?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PaymentCheckoutCard({
  communityName = "Chef Amaka's kitchen",
  amount = 2500,
  onSuccess,
  onCancel,
}: PaymentCheckoutCardProps) {
  const [cardholderName, setCardholderName] = useState(
    "Jabril Babatunde Mudashiru"
  );
  const [cardNumber, setCardNumber] = useState("4532 8243 4243 4342");
  const [expiry, setExpiry] = useState("12/30");
  const [ccv, setCcv] = useState("122");
  const [savePaymentDetails, setSavePaymentDetails] = useState(true);
  const [enableRecurring, setEnableRecurring] = useState(false);
  const [hasCardError, setHasCardError] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Format card number with spaces
  const handleCardNumberChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    setCardNumber(formatted);
    // If it's 16 digits, clear error
    if (cleaned.length === 16) {
      setHasCardError(false);
    } else {
      setHasCardError(true);
    }
  };

  const handleConfirmPurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-[800px] mx-auto rounded-[28px] bg-white p-8 md:p-12 text-black shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 ring-8 ring-green-50">
          <Check className="h-8 w-8 stroke-[3]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">
            Payment Confirmed!
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            You now have full VIP member access to{" "}
            <span className="font-semibold text-black">{communityName}</span>.
            Your receipt has been sent to your email.
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 max-w-xs mx-auto text-xs text-gray-600 space-y-2 text-left">
          <div className="flex justify-between">
            <span>Amount paid</span>
            <span className="font-semibold text-gray-900">
              ₦{amount.toLocaleString("en-NG")}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Payment method</span>
            <span className="font-semibold text-gray-900">
              Card ending in {cardNumber.slice(-4) || "4342"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-green-600 font-semibold">Active Member</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-[#f5c94d] px-8 py-3 text-sm font-bold text-black hover:bg-[#eab308] active:scale-95 transition-all shadow-md"
          >
            Access Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[840px] mx-auto rounded-[28px] bg-white p-6 sm:p-8 text-black shadow-2xl animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Side: Payment Form (8 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Payment Method
            </h3>
          </div>

          {/* Payment Method Selected Button */}
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#f5c94d] px-5 py-2.5 text-sm font-semibold text-black shadow-sm"
            >
              <CreditCard className="h-4 w-4" />
              <span>Card</span>
            </button>
          </div>

          {/* Card Brands Row */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Mastercard */}
            <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm px-1.5 py-1">
              <div className="flex -space-x-1.5 items-center">
                <span className="h-4 w-4 rounded-full bg-[#eb001b]" />
                <span className="h-4 w-4 rounded-full bg-[#f79e1b] opacity-85" />
              </div>
            </div>

            {/* VISA */}
            <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm px-2 py-1">
              <span className="text-xs font-black italic tracking-tighter text-[#1a1f71]">
                VISA
              </span>
            </div>

            {/* PayPal */}
            <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm px-2 py-1">
              <span className="text-xs font-black italic text-[#003087]">
                P<span className="text-[#0079c1]">P</span>
              </span>
            </div>

            {/* AMEX */}
            <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-[#006fcf] shadow-sm px-1 py-1 text-[8px] font-bold text-white tracking-tighter">
              AMEX
            </div>

            {/* Google Pay */}
            <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm px-1 text-[10px] font-bold text-gray-800">
              G<span className="text-blue-500 font-semibold">Pay</span>
            </div>

            {/* Apple Pay */}
            <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-black shadow-sm px-2 text-[10px] font-semibold text-white">
              Pay
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Cardholder Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Cardholder name
              </label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Name on card"
                className="w-full rounded-xl bg-[#e6e6e6] px-4 py-2.5 text-sm font-medium text-gray-900 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              />
            </div>

            {/* Card Details: Number, Exp, CCV */}
            <div className="grid grid-cols-12 gap-3 items-start">
              {/* Card Number */}
              <div className="col-span-12 sm:col-span-7 space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Card number
                </label>
                <input
                  type="text"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  className={`w-full rounded-xl bg-[#e6e6e6] px-3.5 py-2.5 text-sm font-mono tracking-wider text-gray-900 focus:outline-none transition-all ${
                    hasCardError
                      ? "border border-red-500 focus:ring-2 focus:ring-red-300"
                      : "border border-transparent focus:bg-gray-100"
                  }`}
                />
                {hasCardError && (
                  <p className="text-[11px] font-medium text-red-500 pt-0.5">
                    Failed to type border
                  </p>
                )}
              </div>

              {/* Exp */}
              <div className="col-span-6 sm:col-span-2.5 space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Exp
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full rounded-xl bg-[#e6e6e6] px-2 py-2.5 text-sm font-medium text-center text-gray-900 focus:bg-gray-100 focus:outline-none transition-all"
                />
              </div>

              {/* CCV */}
              <div className="col-span-6 sm:col-span-2.5 space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  CCV
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={ccv}
                  onChange={(e) => setCcv(e.target.value.replace(/\D/g, ""))}
                  placeholder="123"
                  className="w-full rounded-xl bg-[#e6e6e6] px-2 py-2.5 text-sm font-medium text-center text-gray-900 focus:bg-gray-100 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Save details checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="saveDetails"
                type="checkbox"
                checked={savePaymentDetails}
                onChange={(e) => setSavePaymentDetails(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-[#2563eb]"
              />
              <label
                htmlFor="saveDetails"
                className="text-xs text-gray-700 cursor-pointer select-none"
              >
                Save payment detail for my future purchases
              </label>
            </div>

            {/* Recurring payment toggle */}
            <div className="pt-2 space-y-1">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-800">
                    Enable recurring payment
                  </span>
                  <span className="inline-flex rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-bold text-[#16a34a]">
                    30-day free trial
                  </span>
                </div>

                {/* Toggle switch matching image */}
                <button
                  type="button"
                  onClick={() => setEnableRecurring(!enableRecurring)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    enableRecurring ? "bg-[#22c55e]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      enableRecurring ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <p className="text-[11px] text-gray-500 leading-normal">
                Use payment to sign for subscriptions and automatic recurring
                payments.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary (5 cols on lg) */}
        <div className="lg:col-span-5 pt-2 lg:pt-0 lg:pl-6 lg:border-l border-gray-100 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              Order Summary
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-800">
              <span className="text-gray-600">Balance Amount :</span>
              <span className="font-semibold text-gray-900">
                ₦{amount.toLocaleString("en-NG")}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-800 pt-2 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">
                ₦{amount.toLocaleString("en-NG")}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmPurchase}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95 py-3 px-6 text-sm font-semibold text-white shadow-md transition-all cursor-pointer disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Confirm purchase</span>
              )}
            </button>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-800 transition-colors pt-1"
            >
              Cancel and return
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
