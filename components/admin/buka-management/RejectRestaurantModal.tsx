"use client";

import { useState } from "react";
import { X, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useUpdateRestaurantStatus } from "@/lib/api/services/restaurants.hooks";
import { useToast } from "@/hooks/use-toast";

interface RejectRestaurantModalProps {
  restaurantId: string | null;
  restaurantName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const REJECTION_PRESETS = [
  "Duplicate Listing already exists on LocalBuka",
  "Inaccurate or Fake Restaurant Details / Address",
  "Permanently Closed / Non-Operational Establishment",
  "Inappropriate or Copyrighted Image Content",
  "Failed Verification of Restaurant Legitimacy",
];

export function RejectRestaurantModal({
  restaurantId,
  restaurantName,
  isOpen,
  onClose,
  onSuccess,
}: RejectRestaurantModalProps) {
  const { toast } = useToast();
  const [reason, setReason] = useState(REJECTION_PRESETS[0]);
  const updateStatusMutation = useUpdateRestaurantStatus();

  if (!isOpen || !restaurantId) return null;

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    updateStatusMutation.mutate(
      {
        id: restaurantId,
        data: {
          status: "rejected",
          reason: reason.trim(),
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Restaurant submission rejected",
            description: `${restaurantName || "The restaurant"} listing has been rejected.`,
          });
          onSuccess?.();
          onClose();
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to reject restaurant submission.";
          toast({
            title: "Rejection failed",
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
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-rose-50/60 dark:bg-rose-950/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Reject Restaurant Submission
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Decline listing approval
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
        <form onSubmit={handleReject} className="p-5 space-y-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              Rejecting <strong>{restaurantName || "this restaurant"}</strong> will mark its moderation status as <strong>Rejected</strong> and prevent it from appearing on public discovery feeds.
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Select Reason for Rejection:
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {REJECTION_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setReason(preset)}
                  className={`text-[10px] px-2.5 py-1 rounded-md border text-left transition-colors cursor-pointer ${
                    reason === preset
                      ? "bg-rose-100 dark:bg-rose-950/60 border-rose-300 text-rose-900 dark:text-rose-200 font-semibold"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  Preset {idx + 1}
                </button>
              ))}
            </div>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
              placeholder="Enter rejection notes or reason..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500"
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
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  Confirm Rejection
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
