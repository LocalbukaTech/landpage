"use client";

import { useState } from "react";
import {
  X,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSuccess: (withdrawnAmount: number) => void;
}

const NIGERIAN_BANKS = [
  { code: "zenith", name: "Zenith Bank PLC" },
  { code: "gtb", name: "Guaranty Trust Bank (GTBank)" },
  { code: "access", name: "Access Bank" },
  { code: "firstbank", name: "First Bank of Nigeria" },
  { code: "kuda", name: "Kuda Microfinance Bank" },
  { code: "moniepoint", name: "Moniepoint MFB" },
  { code: "opay", name: "OPay (PayCom)" },
  { code: "uba", name: "United Bank for Africa (UBA)" },
];

export function WithdrawModal({
  isOpen,
  onClose,
  availableBalance,
  onSuccess,
}: WithdrawModalProps) {
  const [selectedBank, setSelectedBank] = useState("zenith");
  const [accountNumber, setAccountNumber] = useState("2083948192");
  const [accountName, setAccountName] = useState("Tolu Olawale");
  const [amount, setAmount] = useState<string>("500000");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount.replace(/,/g, "")) || 0;

  const handleQuickPercent = (pct: number) => {
    const val = Math.round((availableBalance * pct) / 100);
    setAmount(val.toString());
    setError(null);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (numericAmount <= 0) {
      setError("Please enter a valid amount to withdraw.");
      return;
    }

    if (numericAmount > availableBalance) {
      setError("Withdrawal amount cannot exceed available balance.");
      return;
    }

    if (accountNumber.trim().length !== 10) {
      setError("Please enter a valid 10-digit Nigerian bank account number.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
      onSuccess(numericAmount);
    }, 1200);
  };

  const handleClose = () => {
    setIsCompleted(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#171717] p-6 sm:p-7 shadow-2xl text-white">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!isCompleted ? (
          <form onSubmit={handleWithdraw} className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-[#f5c94d]">
                <Building2 className="h-5 w-5" />
                <span className="text-xs uppercase tracking-wider font-semibold">
                  Localbuka Payouts
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                Withdraw to Bank Account
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Funds are disbursed instantly into your linked Nigerian bank account.
              </p>
            </div>

            {/* Balance Badge */}
            <div className="flex items-center justify-between rounded-2xl bg-[#222222] border border-white/5 p-4">
              <div>
                <span className="text-xs text-white/50">Available Balance</span>
                <p className="text-xl font-bold text-[#f5c94d]">
                  ₦{availableBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <span className="rounded-full bg-[#f5c94d]/10 px-3 py-1 text-xs font-semibold text-[#f5c94d]">
                Instant Settlement
              </span>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-3.5 py-2.5 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Amount input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/80">
                Amount to withdraw (NGN)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-white/50">
                  ₦
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(null);
                  }}
                  placeholder="0.00"
                  className="w-full rounded-2xl bg-[#252525] border border-white/10 pl-10 pr-4 py-3 text-base font-semibold text-white placeholder-white/30 focus:border-[#f5c94d] focus:outline-none transition-colors"
                />
              </div>

              {/* Quick % buttons */}
              <div className="flex items-center gap-2 pt-1">
                {[
                  { label: "25%", val: 25 },
                  { label: "50%", val: 50 },
                  { label: "75%", val: 75 },
                  { label: "Max", val: 100 },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => handleQuickPercent(chip.val)}
                    className="flex-1 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] border border-white/5 py-1.5 text-xs font-medium text-white/80 hover:text-white transition-all text-center"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Selection & Account Number */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80">
                  Select Destination Bank
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full rounded-2xl bg-[#252525] border border-white/10 px-4 py-3 text-sm font-medium text-white focus:border-[#f5c94d] focus:outline-none"
                >
                  {NIGERIAN_BANKS.map((bank) => (
                    <option key={bank.code} value={bank.code} className="bg-[#202020]">
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80">
                  Account Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, "");
                    setAccountNumber(cleaned);
                  }}
                  placeholder="0123456789"
                  className="w-full rounded-2xl bg-[#252525] border border-white/10 px-4 py-3 text-sm font-semibold tracking-wide text-white focus:border-[#f5c94d] focus:outline-none"
                />
                {accountName && (
                  <div className="flex items-center gap-1.5 pt-1 text-xs text-[#4ade80]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Verified: {accountName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Fee summary */}
            <div className="rounded-2xl bg-[#202020] border border-white/5 p-3.5 space-y-2 text-xs text-white/70">
              <div className="flex justify-between">
                <span>Transfer processing fee</span>
                <span className="text-white">₦25.00</span>
              </div>
              <div className="flex justify-between font-semibold text-white pt-1 border-t border-white/5">
                <span>You will receive</span>
                <span className="text-[#f5c94d]">
                  ₦
                  {Math.max(0, numericAmount - 25).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || numericAmount <= 0}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#f5c94d] py-3.5 text-sm font-bold text-black hover:bg-[#eab308] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing Withdrawal...</span>
                </>
              ) : (
                <>
                  <span>Withdraw ₦{numericAmount.toLocaleString("en-NG")}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#4ade80]/15 text-[#4ade80] ring-8 ring-[#4ade80]/10">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">
                Withdrawal Successful!
              </h3>
              <p className="text-sm text-white/60 max-w-sm mx-auto">
                <span className="font-semibold text-white">
                  ₦{numericAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </span>{" "}
                has been queued for instant settlement to {accountName} (
                {NIGERIAN_BANKS.find((b) => b.code === selectedBank)?.name}).
              </p>
            </div>

            <div className="rounded-2xl bg-[#222222] border border-white/5 p-4 text-xs text-white/70 text-left space-y-2">
              <div className="flex justify-between">
                <span>Transaction Ref</span>
                <span className="font-mono text-white">LBK-TX-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Arrival</span>
                <span className="text-[#4ade80] font-medium">Within 5 minutes</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-full bg-[#f5c94d] py-3 text-sm font-bold text-black hover:bg-[#eab308] active:scale-95 transition-all shadow-md"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
