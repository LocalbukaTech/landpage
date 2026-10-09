"use client";

import { useState } from "react";
import { X, PauseCircle, AlertTriangle, Loader2, Clock } from "lucide-react";
import { useUpdateRestaurantStatus } from "@/lib/api/services/restaurants.hooks";
import { useToast } from "@/hooks/use-toast";

interface SuspendRestaurantModalProps {
  restaurantId: string | null;
  restaurantName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SUSPENSION_PRESETS = [
  "Temporary Investigation into Customer Reports",
  "Inaccurate or Misleading Menu / Pricing Details",
  "Failed Food Quality or Hygiene Standards Verification",
  "Requested by Restaurant Owner / Temporary Closure",
  "Suspected Unauthorized or Duplicate Listing",
];

export function SuspendRestaurantModal({
  restaurantId,
  restaurantName,
  isOpen,
  onClose,
  onSuccess,
}: SuspendRestaurantModalProps) {
  const { toast } = useToast();
  const [reason, setReason] = useState(SUSPENSION_PRESETS[0]);
  const updateStatusMutation = useUpdateRestaurantStatus();

  if (!isOpen || !restaurantId) return null;

  const handleSuspend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    updateStatusMutation.mutate(
      {
        id: restaurantId,
        data: {
          status: "suspended",
          reason: reason.trim(),
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Restaurant suspended",
            description: `${restaurantName || "The restaurant"} has been suspended and hidden from search.`,
          });
          onSuccess?.();
          onClose();
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to suspend restaurant.";
          toast({
            title: "Suspension failed",
            description: msg,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-amber-50/60 dark:bg-amber-950/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
              <PauseCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Suspend Restaurant Listing
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Hide from discovery without deleting data
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSuspend} className="p-5 space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              Suspending <strong>{restaurantName || "this restaurant"}</strong> will immediately hide it from public search feeds, restaurant maps, and discovery pages.
              <p className="mt-1 text-[11px] text-amber-800/80 dark:text-amber-400/80">
                All data, reviews, and photo uploads are preserved and can be reactivated at any time.
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Reason / Justification:
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {SUSPENSION_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setReason(preset)}
                  className={`text-[10px] px-2.5 py-1 rounded-md border text-left transition-colors cursor-pointer ${
                    reason === preset
                      ? "bg-amber-100 dark:bg-amber-950/60 border-amber-300 text-amber-900 dark:text-amber-200 font-semibold"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  Reason {idx + 1}
                </button>
              ))}
            </div>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
              placeholder="Enter specific suspension note or reason for the owner..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#fbbe15]"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={updateStatusMutation.isPending}
              className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateStatusMutation.isPending || !reason.trim()}
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Suspending...
                </>
              ) : (
                <>
                  <PauseCircle className="w-3.5 h-3.5" />
                  Confirm Suspension
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
