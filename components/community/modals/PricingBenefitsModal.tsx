"use client";

import { useState } from "react";
import { X, Check, Plus, Trash2, BadgePercent } from "lucide-react";

interface PricingBenefitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricePerMonth: number;
  benefits: string[];
  onSave: (price: number, benefits: string[]) => void;
}

export function PricingBenefitsModal({
  isOpen,
  onClose,
  pricePerMonth,
  benefits,
  onSave,
}: PricingBenefitsModalProps) {
  const [price, setPrice] = useState(pricePerMonth);
  const [benefitsList, setBenefitsList] = useState<string[]>(benefits);
  const [newBenefit, setNewBenefit] = useState("");

  if (!isOpen) return null;

  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return;
    setBenefitsList([...benefitsList, newBenefit.trim()]);
    setNewBenefit("");
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefitsList(benefitsList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(price, benefitsList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#171717] p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5c94d]/15 text-[#f5c94d]">
              <BadgePercent className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Pricing & Membership Benefits</h2>
              <p className="text-xs text-white/50">Manage your subscription fee and subscriber perks</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Monthly Subscription Price (NGN)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-white/50">
                ₦
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={0}
                step={100}
                placeholder="2500"
                className="w-full rounded-2xl border border-white/10 bg-[#212121] pl-8 pr-4 py-3 text-sm font-medium text-white placeholder-white/30 focus:border-[#f5c94d] focus:outline-none focus:ring-1 focus:ring-[#f5c94d]"
                required
              />
            </div>
            <p className="mt-1 text-[11px] text-white/40">
              Set to 0 if your community is free to join.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Exclusive Member Benefits
            </label>
            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
              {benefitsList.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-[#212121] px-3.5 py-2.5 text-xs text-white/90"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f5c94d] text-black">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(idx)}
                    className="text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddBenefit();
                  }
                }}
                placeholder="Add a new perk (e.g. VIP Chef Zoom call)"
                className="flex-1 rounded-xl border border-white/10 bg-[#212121] px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#f5c94d] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#f5c94d] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#eab308] active:scale-95 transition-all"
            >
              Save Pricing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
