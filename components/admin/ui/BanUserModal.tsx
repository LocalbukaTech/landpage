import { X, Loader2 } from "lucide-react";
import { useState } from "react";

interface BanUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBan: (reason: string) => void;
  isLoading?: boolean;
}

export function BanUserModal({ isOpen, onClose, onBan, isLoading }: BanUserModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-800 rounded-[24px] p-8 w-full max-w-[500px] shadow-2xl border border-transparent dark:border-gray-700 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[26px] font-bold text-[#1f2937] dark:text-white">Ban User</h2>
          <button 
            onClick={onClose}
            className="w-7 h-7 bg-[#EF4444] rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors cursor-pointer border-none"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <p className="text-[15px] text-[#4b5563] dark:text-gray-300 mb-6">
          Are you sure you want to ban this user?
        </p>

        {/* Form Inputs */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white dark:bg-gray-800 px-1 text-[12px] font-medium text-gray-400 dark:text-gray-400">
              Reason for Ban
            </label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-200 bg-transparent min-h-[60px] resize-none focus:outline-none focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-200 text-[14px]" 
              placeholder="Text"
              rows={2}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-4 items-center">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 text-[#0f172a] dark:text-gray-200 font-semibold text-[15px] hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
          >
            No, Cancel
          </button>
          <button 
            onClick={() => onBan(reason)}
            disabled={isLoading || !reason.trim()}
            className="flex-1 py-3.5 bg-[#fbbe15] text-[#0f172a] font-bold text-[15px] rounded-xl hover:bg-[#eab308] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border-none"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            Yes, Ban
          </button>
        </div>
      </div>
    </div>
  );
}
