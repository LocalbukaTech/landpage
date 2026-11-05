"use client";

import { CheckCircle2, PauseCircle, Trash2, X, Loader2 } from "lucide-react";

interface BulkRestaurantActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onBulkApprove: () => void;
  onBulkSuspend: () => void;
  onBulkDelete: () => void;
  isLoading?: boolean;
}

export function BulkRestaurantActionBar({
  selectedCount,
  onClear,
  onBulkApprove,
  onBulkSuspend,
  onBulkDelete,
  isLoading,
}: BulkRestaurantActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-900/95 dark:bg-gray-800/95 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center gap-2 pr-2 border-r border-white/20">
        <span className="w-6 h-6 rounded-full bg-[#fbbe15] text-gray-950 font-bold text-xs flex items-center justify-center">
          {selectedCount}
        </span>
        <span className="text-xs font-semibold whitespace-nowrap">
          {selectedCount === 1 ? "restaurant" : "restaurants"} selected
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Bulk Approve */}
        <button
          type="button"
          onClick={onBulkApprove}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          Approve
        </button>

        {/* Bulk Suspend */}
        <button
          type="button"
          onClick={onBulkSuspend}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PauseCircle className="w-3.5 h-3.5" />}
          Suspend
        </button>

        {/* Bulk Delete */}
        <button
          type="button"
          onClick={onBulkDelete}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Delete
        </button>

        {/* Clear Selection */}
        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
